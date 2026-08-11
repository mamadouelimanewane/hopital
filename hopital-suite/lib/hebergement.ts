/* ════════════════════════════════════════════════════════════════
   Hébergement — la facturation qui court toute seule.

   Les trois plateaux facturent des gestes : quelqu'un valide, une
   ligne naît. L'hébergement n'a pas de geste — il s'accumule pendant
   que le patient dort. D'où trois règles propres :

   1. On facture des NUITÉES, pas des jours. Entrer et sortir le même
      jour ne produit aucune journée d'hébergement : cela relève de
      l'ambulatoire, avec son propre forfait. Compter « un jour
      commencé » ferait payer une nuit qui n'a pas eu lieu.

   2. Chaque nuit est facturée au tarif de l'unité où elle a été
      passée. Un patient transféré de réanimation en chambre commune
      ne paie pas la réanimation pour ses nuits en chambre commune.

   3. Le calcul est rejouable sans risque. Une nuit déjà facturée ne
      peut pas l'être deux fois — la clé primaire (mouvement, nuit) y
      veille. On peut donc lancer le calcul chaque matin, et à la
      clôture, sans se demander ce qui a déjà été fait.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser } from "./db"
import { emettreLigne } from "./facturation"

/** Catégorie de chambre → code du catalogue. */
const CODE_PAR_CATEGORIE: Record<string, string | null> = {
  commune: "HEB-COM",
  particuliere: "HEB-PART",
  vip: "HEB-PART",
  reanimation: "HEB-REA",
  // Une consultation externe ou une séance n'occupe pas de lit.
  aucune: null,
}

/** Date locale au format AAAA-MM-JJ, sans dérive de fuseau. */
function jour(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const j = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${j}`
}

/** Minuit local du jour de `d`. */
function minuit(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/**
 * Nuits passées entre deux instants : une nuit par minuit franchi.
 * La nuit est datée du jour où l'on s'est couché.
 */
export function nuitees(debut: Date, fin: Date): string[] {
  if (fin <= debut) return []
  const nuits: string[] = []
  // Premier minuit strictement après le début.
  const curseur = minuit(debut)
  curseur.setDate(curseur.getDate() + 1)

  while (curseur <= fin) {
    // La nuit franchie est celle de la veille du minuit atteint.
    const veille = new Date(curseur)
    veille.setDate(veille.getDate() - 1)
    nuits.push(jour(veille))
    curseur.setDate(curseur.getDate() + 1)
  }
  return nuits
}

export interface ResultatFacturation {
  nuitsFacturees: number
  nuitsDejaFacturees: number
  montant: number
  detail: Array<{ nuit: string; categorie: string; code: string; montant: number }>
}

/**
 * Facture les journées d'hébergement d'un séjour.
 *
 * `jusqua` borne le calcul — par défaut, l'instant présent pour un
 * séjour ouvert, la sortie pour un séjour clos. Rejouable : les nuits
 * déjà facturées sont ignorées.
 */
export async function facturerJournees(
  sejourId: number,
  options: { jusqua?: Date; acteur?: string } = {},
): Promise<ResultatFacturation> {
  const acteur = options.acteur || "facturation"

  const sejour = await one<{ id: number; sortie_le: string | null; statut: string }>(
    `SELECT id, sortie_le, statut FROM sejour WHERE id = $1`, [sejourId],
  )
  if (!sejour) throw new Error("Séjour introuvable")

  const borne = options.jusqua
    ?? (sejour.sortie_le ? new Date(sejour.sortie_le) : new Date())

  const mouvements = await query<{
    id: number; categorie: string; debut_le: string; fin_le: string | null
  }>(
    `SELECT id, categorie, debut_le, fin_le FROM mouvement
      WHERE sejour_id = $1 ORDER BY debut_le`,
    [sejourId],
  )

  const detail: ResultatFacturation["detail"] = []
  let nuitsFacturees = 0
  let nuitsDejaFacturees = 0
  let montant = 0

  for (const m of mouvements) {
    const code = CODE_PAR_CATEGORIE[m.categorie]
    if (!code) continue

    const debut = new Date(m.debut_le)
    const fin = m.fin_le ? new Date(m.fin_le) : borne
    // Un mouvement ne peut pas être facturé au-delà de la borne.
    const finEffective = fin > borne ? borne : fin

    for (const nuit of nuitees(debut, finEffective)) {
      const deja = await one<{ nuit_du: string }>(
        `SELECT nuit_du FROM journee_hebergement
          WHERE mouvement_id = $1 AND nuit_du = $2::date`,
        [m.id, nuit],
      )
      if (deja) { nuitsDejaFacturees++; continue }

      const resultat = await tx(async () => {
        // L'acte porte la date de la nuit : le tarif appliqué est
        // celui en vigueur cette nuit-là, pas celui d'aujourd'hui.
        const acte = await one<{ id: number }>(
          `INSERT INTO acte
             (sejour_id, code_acte, quantite, unite_executante,
              statut, realise_le, valide_le, valide_par, commentaire)
           VALUES ($1,$2,1,'hebergement','valide',
                   ($3::date + time '12:00'), ($3::date + time '12:00'), $4, $5)
           RETURNING id`,
          [sejourId, code, nuit, acteur, `Nuit du ${nuit} — ${m.categorie}`],
        )
        await query(
          `INSERT INTO journee_hebergement (mouvement_id, nuit_du, acte_id, categorie)
           VALUES ($1,$2::date,$3,$4)`,
          [m.id, nuit, acte!.id, m.categorie],
        )
        return emettreLigne(acte!.id, acteur)
      })

      nuitsFacturees++
      const somme = Number(resultat?.montant_total ?? 0)
      montant += somme
      detail.push({ nuit, categorie: m.categorie, code, montant: somme })
    }
  }

  if (nuitsFacturees > 0) {
    await journaliser("sejour", sejourId, "facturation_hebergement", acteur, {
      nuits: nuitsFacturees, montant,
    })
  }
  return { nuitsFacturees, nuitsDejaFacturees, montant, detail }
}

/** Journées déjà facturées d'un séjour, pour affichage. */
export async function journeesDuSejour(sejourId: number) {
  return query<{
    nuit_du: string; categorie: string; unite: string
    code_acte: string; libelle: string; montant_total: string | null
  }>(
    /* to_char plutôt que la colonne brute : le driver restitue les
       DATE en objets Date, et le contrat de l'API ne doit pas
       dépendre de cela. */
    `SELECT to_char(j.nuit_du, 'YYYY-MM-DD') AS nuit_du,
            j.categorie, m.unite,
            a.code_acte, c.libelle, l.montant_total
       FROM journee_hebergement j
       JOIN mouvement m ON m.id = j.mouvement_id
       JOIN acte a ON a.id = j.acte_id
       JOIN catalogue_acte c ON c.code = a.code_acte
       LEFT JOIN ligne_facture l ON l.acte_id = a.id
      WHERE m.sejour_id = $1
      ORDER BY j.nuit_du`,
    [sejourId],
  )
}

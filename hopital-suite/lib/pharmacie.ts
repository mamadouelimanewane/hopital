/* ════════════════════════════════════════════════════════════════
   Circuit du médicament — de la prescription à la facture.

   C'est le plateau le plus éloigné des deux précédents. Au
   laboratoire, une prescription donne un acte et une ligne de
   facture. Ici, une ligne de prescription engendre autant
   d'administrations que de prises — donc autant de lignes.

   Trois règles structurent le circuit :

   1. Rien ne sort de la pharmacie sans avis pharmaceutique favorable.
   2. On ne dispense que ce qu'on a : le stock est une contrainte,
      pas un compteur indicatif.
   3. C'est l'ADMINISTRATION qui facture, pas la dispensation. Ce qui
      est dispensé puis rendu n'a jamais été consommé par le patient
      et ne doit pas lui être facturé.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser } from "./db"
import { emettreLigne } from "./facturation"

export type Voie =
  | "orale" | "intraveineuse" | "intramusculaire"
  | "sous_cutanee" | "inhalee" | "locale" | "rectale"

export type Avis = "favorable" | "reserve" | "refuse"

export interface LignePrescription {
  id: number; prescription_id: number; code_acte: string
  dose: string; unite_dose: string; voie: string
  prises_par_jour: number; duree_jours: number
  dispense: string; administre: string; statut: string
}

/** Nombre total de prises prévues par une ligne. */
export const prisesPrevues = (l: { prises_par_jour: number; duree_jours: number }) =>
  l.prises_par_jour * l.duree_jours

/* ── Prescription ───────────────────────────────────────────────── */
export async function prescrireMedicaments(
  sejourId: number,
  p: {
    prescripteur: string
    lignes: Array<{
      code: string; dose: number; uniteDose?: string; voie?: Voie
      prisesParJour?: number; dureeJours?: number
    }>
    indication?: string
    urgence?: "vitale" | "urgente" | "normale"
  },
  acteur = "medecin",
) {
  if (!p.lignes?.length) throw new Error("Au moins un médicament doit être prescrit")

  const sejour = await one<{ statut: string }>(
    `SELECT statut FROM sejour WHERE id = $1`, [sejourId],
  )
  if (!sejour) throw new Error("Séjour introuvable")
  if (sejour.statut !== "ouvert") {
    throw new Error("Impossible de prescrire sur un séjour qui n'est plus ouvert")
  }

  const codes = p.lignes.map((l) => l.code)
  const connus = await query<{ code: string }>(
    `SELECT c.code FROM catalogue_acte c
       JOIN stock s ON s.code_acte = c.code
      WHERE c.code = ANY($1::text[]) AND c.actif`,
    [codes],
  )
  const inconnus = codes.filter((c) => !connus.some((k) => k.code === c))
  if (inconnus.length) {
    throw new Error(`Médicament inconnu au livret thérapeutique : ${inconnus.join(", ")}`)
  }

  return tx(async () => {
    const prescription = await one<{ id: number; prescripteur: string }>(
      `INSERT INTO prescription (sejour_id, type, prescripteur, indication, urgence)
       VALUES ($1, 'medicament', $2, $3, $4)
       RETURNING id, prescripteur`,
      [sejourId, p.prescripteur, p.indication || "", p.urgence || "normale"],
    )

    const lignes: LignePrescription[] = []
    for (const l of p.lignes) {
      if (!(l.dose > 0)) throw new Error(`Dose invalide pour ${l.code}`)
      const ligne = await one<LignePrescription>(
        `INSERT INTO ligne_prescription
           (prescription_id, code_acte, dose, unite_dose, voie, prises_par_jour, duree_jours)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id, prescription_id, code_acte, dose, unite_dose, voie,
                   prises_par_jour, duree_jours, dispense, administre, statut`,
        [
          prescription!.id, l.code, l.dose, l.uniteDose || "mg", l.voie || "orale",
          l.prisesParJour ?? 1, l.dureeJours ?? 1,
        ],
      )
      lignes.push(ligne!)
    }

    await journaliser("prescription", prescription!.id, "prescription_medicament", acteur, {
      sejourId, codes,
    })
    return { prescription: prescription!, lignes }
  })
}

/* ── Analyse pharmaceutique ─────────────────────────────────────── */
/**
 * Le pharmacien vise la prescription. Un refus bloque toute
 * dispensation : c'est le garde-fou contre l'interaction et le
 * surdosage, et il doit être infranchissable.
 */
export async function analyserPrescription(
  prescriptionId: number,
  a: { avis: Avis; motif?: string; pharmacien: string },
  acteur = "pharmacien",
) {
  if (a.avis !== "favorable" && !a.motif?.trim()) {
    throw new Error("Une réserve ou un refus doit être motivé")
  }

  const p = await one<{ id: number; type: string }>(
    `SELECT id, type FROM prescription WHERE id = $1`, [prescriptionId],
  )
  if (!p) throw new Error("Prescription introuvable")
  if (p.type !== "medicament") {
    throw new Error("Seule une prescription médicamenteuse fait l'objet d'une analyse pharmaceutique")
  }

  const maj = await one<{ id: number; avis_pharmaceutique: string }>(
    `UPDATE prescription
        SET avis_pharmaceutique = $2, avis_le = now(), avis_par = $3, avis_motif = $4
      WHERE id = $1
      RETURNING id, avis_pharmaceutique`,
    [prescriptionId, a.avis, a.pharmacien, a.motif || ""],
  )

  // Un refus arrête les lignes : elles ne pourront plus être servies.
  if (a.avis === "refuse") {
    await query(
      `UPDATE ligne_prescription SET statut = 'arretee' WHERE prescription_id = $1`,
      [prescriptionId],
    )
  }

  await journaliser("prescription", prescriptionId, "analyse_pharmaceutique", acteur, {
    avis: a.avis, motif: a.motif || "",
  })
  return maj!
}

/* ── Dispensation ───────────────────────────────────────────────── */
/**
 * Sortie de stock nominative. Ne facture rien : le patient n'a pas
 * encore reçu le médicament.
 */
export async function dispenser(
  ligneId: number,
  quantite: number,
  acteur = "pharmacien",
) {
  if (!(quantite > 0)) throw new Error("La quantité dispensée doit être positive")

  const ligne = await one<LignePrescription & {
    sejour_id: number; avis: string | null; prises_par_jour: number; duree_jours: number
  }>(
    `SELECT lp.*, p.sejour_id, p.avis_pharmaceutique AS avis
       FROM ligne_prescription lp
       JOIN prescription p ON p.id = lp.prescription_id
      WHERE lp.id = $1`,
    [ligneId],
  )
  if (!ligne) throw new Error("Ligne de prescription introuvable")
  if (ligne.avis !== "favorable" && ligne.avis !== "reserve") {
    throw new Error(
      ligne.avis === "refuse"
        ? "Prescription refusée par le pharmacien : dispensation impossible"
        : "Analyse pharmaceutique requise avant dispensation",
    )
  }
  if (ligne.statut !== "active") {
    throw new Error(`Ligne ${ligne.statut} : dispensation impossible`)
  }

  const restant = prisesPrevues(ligne) - Number(ligne.dispense)
  if (quantite > restant) {
    throw new Error(
      `Dispensation supérieure au prescrit : ${quantite} demandé, ${restant} restant`,
    )
  }

  return tx(async () => {
    // Décrément conditionnel : la contrainte CHECK (quantite >= 0)
    // ne suffirait pas à donner un message utile.
    const stock = await one<{ quantite: string }>(
      `SELECT quantite FROM stock WHERE code_acte = $1 FOR UPDATE`,
      [ligne.code_acte],
    )
    if (!stock) throw new Error("Article absent du stock")
    if (Number(stock.quantite) < quantite) {
      throw new Error(
        `Stock insuffisant pour ${ligne.code_acte} : ${stock.quantite} disponible, ${quantite} demandé`,
      )
    }

    await query(
      `UPDATE stock SET quantite = quantite - $2, modifie_le = now() WHERE code_acte = $1`,
      [ligne.code_acte, quantite],
    )
    await query(
      `INSERT INTO mouvement_stock (code_acte, sens, quantite, motif, sejour_id, acteur)
       VALUES ($1,'sortie',$2,'dispensation',$3,$4)`,
      [ligne.code_acte, quantite, ligne.sejour_id, acteur],
    )
    const maj = await one<LignePrescription>(
      `UPDATE ligne_prescription SET dispense = dispense + $2 WHERE id = $1
       RETURNING id, prescription_id, code_acte, dose, unite_dose, voie,
                 prises_par_jour, duree_jours, dispense, administre, statut`,
      [ligneId, quantite],
    )

    await journaliser("ligne_prescription", ligneId, "dispensation", acteur, {
      code: ligne.code_acte, quantite,
    })
    return maj!
  })
}

/* ── Administration ─────────────────────────────────────────────── */
/**
 * Le geste pivot : l'infirmier administre au lit du patient.
 *
 * C'est ici, et seulement ici, que naît la ligne de facture. Chaque
 * prise administrée est un acte facturable distinct.
 */
export async function administrer(
  ligneId: number,
  a: { soignant: string; quantite?: number; commentaire?: string },
  acteur = "infirmier",
) {
  const quantite = a.quantite ?? 1
  if (!(quantite > 0)) throw new Error("La quantité administrée doit être positive")

  const ligne = await one<LignePrescription & { sejour_id: number }>(
    `SELECT lp.*, p.sejour_id
       FROM ligne_prescription lp
       JOIN prescription p ON p.id = lp.prescription_id
      WHERE lp.id = $1`,
    [ligneId],
  )
  if (!ligne) throw new Error("Ligne de prescription introuvable")
  if (ligne.statut !== "active") {
    throw new Error(`Ligne ${ligne.statut} : administration impossible`)
  }

  const disponible = Number(ligne.dispense) - Number(ligne.administre)
  if (quantite > disponible) {
    throw new Error(
      `Rien à administrer : ${disponible} unité(s) dispensée(s) non encore administrée(s)`,
    )
  }

  return tx(async () => {
    const acte = await one<{ id: number }>(
      `INSERT INTO acte
         (sejour_id, prescription_id, code_acte, quantite, executant,
          unite_executante, statut, realise_le, valide_le, valide_par, commentaire)
       VALUES ($1,$2,$3,$4,$5,'pharmacie','valide', now(), now(), $5, $6)
       RETURNING id`,
      [
        ligne.sejour_id, ligne.prescription_id, ligne.code_acte, quantite,
        a.soignant, a.commentaire || "",
      ],
    )

    const maj = await one<LignePrescription>(
      `UPDATE ligne_prescription SET administre = administre + $2 WHERE id = $1
       RETURNING id, prescription_id, code_acte, dose, unite_dose, voie,
                 prises_par_jour, duree_jours, dispense, administre, statut`,
      [ligneId, quantite],
    )

    // Toutes les prises données : la ligne est terminée.
    if (Number(maj!.administre) >= prisesPrevues(maj!)) {
      await query(`UPDATE ligne_prescription SET statut = 'terminee' WHERE id = $1`, [ligneId])
      maj!.statut = "terminee"
    }

    const ligneFacture = await emettreLigne(acte!.id, acteur)

    await journaliser("ligne_prescription", ligneId, "administration", acteur, {
      code: ligne.code_acte, quantite, acteId: acte!.id,
    })
    return { ligne: maj!, acteId: acte!.id, ligneFacture }
  })
}

/* ── Retour ─────────────────────────────────────────────────────── */
/**
 * Ce qui a été dispensé mais non administré revient à la pharmacie.
 * Aucune facturation n'est annulée : rien n'avait été facturé.
 */
export async function retourner(
  ligneId: number,
  quantite: number,
  motif: string,
  acteur = "pharmacien",
) {
  if (!(quantite > 0)) throw new Error("La quantité retournée doit être positive")
  if (!motif?.trim()) throw new Error("Un retour doit être motivé")

  const ligne = await one<LignePrescription & { sejour_id: number }>(
    `SELECT lp.*, p.sejour_id
       FROM ligne_prescription lp
       JOIN prescription p ON p.id = lp.prescription_id
      WHERE lp.id = $1`,
    [ligneId],
  )
  if (!ligne) throw new Error("Ligne de prescription introuvable")

  const retournable = Number(ligne.dispense) - Number(ligne.administre)
  if (quantite > retournable) {
    throw new Error(
      `Retour supérieur au disponible : ${retournable} unité(s) non administrée(s)`,
    )
  }

  return tx(async () => {
    await query(
      `UPDATE stock SET quantite = quantite + $2, modifie_le = now() WHERE code_acte = $1`,
      [ligne.code_acte, quantite],
    )
    await query(
      `INSERT INTO mouvement_stock (code_acte, sens, quantite, motif, sejour_id, acteur)
       VALUES ($1,'entree',$2,$3,$4,$5)`,
      [ligne.code_acte, quantite, `retour : ${motif.trim()}`, ligne.sejour_id, acteur],
    )
    const maj = await one<LignePrescription>(
      `UPDATE ligne_prescription SET dispense = dispense - $2 WHERE id = $1
       RETURNING id, prescription_id, code_acte, dose, unite_dose, voie,
                 prises_par_jour, duree_jours, dispense, administre, statut`,
      [ligneId, quantite],
    )

    await journaliser("ligne_prescription", ligneId, "retour_pharmacie", acteur, {
      code: ligne.code_acte, quantite, motif,
    })
    return maj!
  })
}

/** Arrête une ligne en cours — le prescripteur change d'avis. */
export async function arreter(ligneId: number, motif: string, acteur = "medecin") {
  const maj = await one<{ id: number; statut: string }>(
    `UPDATE ligne_prescription SET statut = 'arretee'
      WHERE id = $1 AND statut IN ('active', 'suspendue')
      RETURNING id, statut`,
    [ligneId],
  )
  if (!maj) throw new Error("Ligne introuvable ou déjà close")
  await journaliser("ligne_prescription", ligneId, "arret_traitement", acteur, { motif })
  return maj
}

/* ── Vues ───────────────────────────────────────────────────────── */
export async function traitementDuSejour(sejourId: number) {
  return query<{
    ligne_id: number; code_acte: string; libelle: string
    dose: string; unite_dose: string; voie: string
    prises_par_jour: number; duree_jours: number
    dispense: string; administre: string; statut: string
    avis: string | null; avis_motif: string | null
    montant_facture: string | null
  }>(
    `SELECT lp.id AS ligne_id, lp.code_acte, c.libelle,
            lp.dose, lp.unite_dose, lp.voie,
            lp.prises_par_jour, lp.duree_jours,
            lp.dispense, lp.administre, lp.statut,
            p.avis_pharmaceutique AS avis, p.avis_motif,
            (SELECT SUM(l.montant_total) FROM ligne_facture l
               JOIN acte a ON a.id = l.acte_id
              WHERE a.prescription_id = lp.prescription_id
                AND a.code_acte = lp.code_acte) AS montant_facture
       FROM ligne_prescription lp
       JOIN prescription p ON p.id = lp.prescription_id
       JOIN catalogue_acte c ON c.code = lp.code_acte
      WHERE p.sejour_id = $1
      ORDER BY lp.id`,
    [sejourId],
  )
}

/** Articles sous le seuil d'alerte. */
export async function stockEnAlerte() {
  return query<{ code_acte: string; libelle: string; quantite: string; seuil_alerte: string }>(
    `SELECT s.code_acte, c.libelle, s.quantite, s.seuil_alerte
       FROM stock s JOIN catalogue_acte c ON c.code = s.code_acte
      WHERE s.quantite <= s.seuil_alerte
      ORDER BY s.quantite`,
  )
}

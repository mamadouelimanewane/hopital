/* ════════════════════════════════════════════════════════════════
   Circuit du laboratoire — de la prescription à la facture.

   C'est le plateau le plus simple à brancher, et il démontre le
   principe qui vaut pour tous les autres : la validation biologique
   est le geste qui rend l'acte facturable. Imagerie, pharmacie et
   bloc suivront exactement le même schéma.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser } from "./db"
import { emettreLigne } from "./facturation"

export interface Prescription {
  id: number; sejour_id: number; type: string;
  prescripteur: string; urgence: string; statut: string; prescrit_le: string;
}

export interface Acte {
  id: number; sejour_id: number; code_acte: string;
  statut: string; prevu_le: string; realise_le: string | null; valide_le: string | null;
}

/** Prescrit un ou plusieurs examens biologiques sur un séjour ouvert. */
export async function prescrireBiologie(
  sejourId: number,
  p: { prescripteur: string; codes: string[]; indication?: string; urgence?: "vitale" | "urgente" | "normale" },
  acteur = "medecin",
): Promise<{ prescription: Prescription; actes: Acte[] }> {
  if (!p.codes?.length) throw new Error("Au moins un examen doit être prescrit")

  const sejour = await one<{ id: number; statut: string }>(
    `SELECT id, statut FROM sejour WHERE id = $1`, [sejourId],
  )
  if (!sejour) throw new Error("Séjour introuvable")
  if (sejour.statut !== "ouvert") {
    throw new Error("Impossible de prescrire sur un séjour qui n'est plus ouvert")
  }

  const connus = await query<{ code: string }>(
    `SELECT code FROM catalogue_acte
      WHERE code = ANY($1::text[]) AND famille = 'biologie' AND actif`,
    [p.codes],
  )
  const inconnus = p.codes.filter((c) => !connus.some((k) => k.code === c))
  if (inconnus.length) {
    throw new Error(`Examen inconnu au catalogue : ${inconnus.join(", ")}`)
  }

  return tx(async () => {
    const prescription = await one<Prescription>(
      `INSERT INTO prescription (sejour_id, type, prescripteur, indication, urgence)
       VALUES ($1, 'biologie', $2, $3, $4)
       RETURNING id, sejour_id, type, prescripteur, urgence, statut, prescrit_le`,
      [sejourId, p.prescripteur, p.indication || "", p.urgence || "normale"],
    )

    const actes: Acte[] = []
    for (const code of p.codes) {
      const a = await one<Acte>(
        `INSERT INTO acte (sejour_id, prescription_id, code_acte, unite_executante)
         VALUES ($1,$2,$3,'laboratoire')
         RETURNING id, sejour_id, code_acte, statut, prevu_le, realise_le, valide_le`,
        [sejourId, prescription!.id, code],
      )
      actes.push(a!)
    }

    await journaliser("prescription", prescription!.id, "creation", acteur, {
      sejourId, codes: p.codes, urgence: p.urgence || "normale",
    })
    return { prescription: prescription!, actes }
  })
}

/** Enregistre le prélèvement : l'acte passe de « prévu » à « réalisé ». */
export async function enregistrerPrelevement(
  acteId: number,
  preleveur: string,
  acteur = "infirmier",
): Promise<Acte> {
  const acte = await one<Acte>(
    `UPDATE acte SET statut = 'realise', realise_le = now(), executant = $2
      WHERE id = $1 AND statut = 'prevu'
      RETURNING id, sejour_id, code_acte, statut, prevu_le, realise_le, valide_le`,
    [acteId, preleveur],
  )
  if (!acte) throw new Error("Acte introuvable ou déjà prélevé")

  await journaliser("acte", acteId, "prelevement", acteur, { preleveur })
  return acte
}

/** Saisit un résultat. N'a aucun effet sur la facturation. */
export async function saisirResultat(
  acteId: number,
  r: { valeur: string; unite?: string; reference?: string; critique?: boolean; commentaire?: string },
  acteur = "technicien",
): Promise<{ id: number; critique: boolean }> {
  const acte = await one<{ statut: string }>(`SELECT statut FROM acte WHERE id = $1`, [acteId])
  if (!acte) throw new Error("Acte introuvable")
  if (acte.statut === "prevu") throw new Error("Le prélèvement n'a pas été enregistré")
  if (acte.statut === "annule") throw new Error("Acte annulé")

  const ligne = await one<{ id: number; critique: boolean }>(
    `INSERT INTO resultat (acte_id, valeur, unite, reference, critique, commentaire)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, critique`,
    [acteId, r.valeur, r.unite || "", r.reference || "", r.critique ?? false, r.commentaire || ""],
  )

  await journaliser("resultat", ligne!.id, "saisie", acteur, {
    acteId, critique: r.critique ?? false,
  })
  return ligne!
}

/**
 * Validation biologique — le geste pivot.
 *
 * Il rend le résultat opposable ET émet la ligne de facture. Les deux
 * dans la même transaction : il ne peut pas exister de résultat validé
 * sans sa ligne, ni l'inverse.
 */
export async function validerBiologiquement(
  acteId: number,
  biologiste: string,
  acteur = "biologiste",
): Promise<{ acte: Acte; ligne: Awaited<ReturnType<typeof emettreLigne>> }> {
  const resultats = await query<{ id: number }>(
    `SELECT id FROM resultat WHERE acte_id = $1`, [acteId],
  )
  if (resultats.length === 0) {
    throw new Error("Aucun résultat saisi : rien à valider")
  }

  const acte = await one<Acte>(
    `UPDATE acte SET statut = 'valide', valide_le = now(), valide_par = $2
      WHERE id = $1 AND statut = 'realise'
      RETURNING id, sejour_id, code_acte, statut, prevu_le, realise_le, valide_le`,
    [acteId, biologiste],
  )
  if (!acte) throw new Error("Acte introuvable ou déjà validé")

  const ligne = await emettreLigne(acteId, acteur)

  // Si tous les actes de la prescription sont traités, elle est servie.
  await query(
    `UPDATE prescription SET statut = 'servie'
      WHERE id = (SELECT prescription_id FROM acte WHERE id = $1)
        AND NOT EXISTS (
          SELECT 1 FROM acte
           WHERE prescription_id = (SELECT prescription_id FROM acte WHERE id = $1)
             AND statut IN ('prevu', 'realise'))`,
    [acteId],
  )

  await journaliser("acte", acteId, "validation_biologique", acteur, {
    biologiste, ligneEmise: ligne?.id ?? null,
  })
  return { acte, ligne }
}

/** Vue du laboratoire pour un séjour : chaque examen et son état. */
export async function examensDuSejour(sejourId: number) {
  return query<{
    acte_id: number; code_acte: string; libelle: string; statut: string;
    prevu_le: string; realise_le: string | null; valide_le: string | null;
    valeur: string | null; unite: string | null; reference: string | null;
    critique: boolean | null; montant_total: string | null;
  }>(
    `SELECT a.id AS acte_id, a.code_acte, c.libelle, a.statut,
            a.prevu_le, a.realise_le, a.valide_le,
            r.valeur, r.unite, r.reference, r.critique,
            l.montant_total
       FROM acte a
       JOIN catalogue_acte c ON c.code = a.code_acte
       LEFT JOIN resultat r ON r.acte_id = a.id
       LEFT JOIN ligne_facture l ON l.acte_id = a.id
      WHERE a.sejour_id = $1 AND c.famille = 'biologie'
      ORDER BY a.prevu_le`,
    [sejourId],
  )
}

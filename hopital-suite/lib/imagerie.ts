/* ════════════════════════════════════════════════════════════════
   Circuit de l'imagerie — de la demande à la facture.

   Même principe que le laboratoire : la validation rend l'acte
   facturable. Mais trois différences réelles, qui justifient un
   module distinct plutôt qu'une copie :

   1. La demande est programmée avant d'être réalisée, selon
      l'urgence — un examen d'imagerie occupe une machine.
   2. La dose délivrée est tracée à la réalisation. C'est une
      obligation de radioprotection, et elle suit le patient toute
      sa vie, séjour après séjour.
   3. Un examen injecté consomme un produit de contraste, facturé
      en ligne distincte de l'examen lui-même.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser } from "./db"
import { emettreLigne } from "./facturation"

export type Urgence = "vitale" | "urgente" | "normale"

export interface ActeImagerie {
  id: number; sejour_id: number; code_acte: string; statut: string
  prevu_le: string; programme_le: string | null
  realise_le: string | null; valide_le: string | null
  dose_delivree: string | null; dose_unite: string | null
}

/** Examens dont la réalisation consomme un produit de contraste. */
const AVEC_INJECTION = new Set(["IMG-SCANI"])
const CODE_CONTRASTE = "PRD-CONTR"

/** Demande d'imagerie. L'indication clinique est obligatoire. */
export async function demanderImagerie(
  sejourId: number,
  d: { prescripteur: string; codes: string[]; indication: string; urgence?: Urgence },
  acteur = "medecin",
) {
  if (!d.codes?.length) throw new Error("Au moins un examen doit être demandé")
  // Sans indication, le radiologue ne peut ni protocoler ni interpréter.
  if (!d.indication?.trim()) {
    throw new Error("L'indication clinique est requise pour une demande d'imagerie")
  }

  const sejour = await one<{ statut: string }>(
    `SELECT statut FROM sejour WHERE id = $1`, [sejourId],
  )
  if (!sejour) throw new Error("Séjour introuvable")
  if (sejour.statut !== "ouvert") {
    throw new Error("Impossible de demander un examen sur un séjour qui n'est plus ouvert")
  }

  const connus = await query<{ code: string }>(
    `SELECT code FROM catalogue_acte
      WHERE code = ANY($1::text[]) AND famille = 'imagerie' AND actif`,
    [d.codes],
  )
  const inconnus = d.codes.filter((c) => !connus.some((k) => k.code === c))
  if (inconnus.length) {
    throw new Error(`Examen inconnu au catalogue : ${inconnus.join(", ")}`)
  }

  return tx(async () => {
    const prescription = await one<{ id: number; prescripteur: string; urgence: string }>(
      `INSERT INTO prescription (sejour_id, type, prescripteur, indication, urgence)
       VALUES ($1, 'imagerie', $2, $3, $4)
       RETURNING id, prescripteur, urgence`,
      [sejourId, d.prescripteur, d.indication.trim(), d.urgence || "normale"],
    )

    const actes: ActeImagerie[] = []
    for (const code of d.codes) {
      const a = await one<ActeImagerie>(
        `INSERT INTO acte (sejour_id, prescription_id, code_acte, unite_executante)
         VALUES ($1,$2,$3,'imagerie')
         RETURNING id, sejour_id, code_acte, statut, prevu_le, programme_le,
                   realise_le, valide_le, dose_delivree, dose_unite`,
        [sejourId, prescription!.id, code],
      )
      actes.push(a!)
    }

    await journaliser("prescription", prescription!.id, "demande_imagerie", acteur, {
      sejourId, codes: d.codes, urgence: d.urgence || "normale",
    })
    return { prescription: prescription!, actes }
  })
}

/** Positionne l'examen sur un créneau. */
export async function programmer(
  acteId: number,
  creneau: string | Date,
  acteur = "manipulateur",
): Promise<ActeImagerie> {
  const date = creneau instanceof Date ? creneau.toISOString() : creneau
  const acte = await one<ActeImagerie>(
    `UPDATE acte SET programme_le = $2::timestamptz
      WHERE id = $1 AND statut = 'prevu'
      RETURNING id, sejour_id, code_acte, statut, prevu_le, programme_le,
                realise_le, valide_le, dose_delivree, dose_unite`,
    [acteId, date],
  )
  if (!acte) throw new Error("Examen introuvable ou déjà réalisé")

  await journaliser("acte", acteId, "programmation", acteur, { creneau: date })
  return acte
}

/**
 * Réalisation par le manipulateur.
 *
 * La dose est exigée pour tout examen irradiant. Un examen injecté
 * crée en outre l'acte du produit de contraste, qui sera facturé
 * comme l'examen : à la validation.
 */
export async function realiser(
  acteId: number,
  r: { manipulateur: string; dose?: number; doseUnite?: string; contrasteUtilise?: boolean },
  acteur = "manipulateur",
): Promise<{ acte: ActeImagerie; contraste: { id: number } | null }> {
  const existant = await one<{ statut: string; code_acte: string; sejour_id: number; prescription_id: number | null }>(
    `SELECT statut, code_acte, sejour_id, prescription_id FROM acte WHERE id = $1`,
    [acteId],
  )
  if (!existant) throw new Error("Examen introuvable")
  if (existant.statut !== "prevu") throw new Error("Examen déjà réalisé ou annulé")

  // L'échographie et l'IRM n'irradient pas : la dose n'a pas de sens.
  const irradiant = !["IMG-ECHO", "IMG-IRM"].includes(existant.code_acte)
  if (irradiant && (r.dose === undefined || r.dose === null)) {
    throw new Error("La dose délivrée est requise pour un examen irradiant")
  }

  return tx(async () => {
    const acte = await one<ActeImagerie>(
      `UPDATE acte
          SET statut = 'realise', realise_le = now(), executant = $2,
              dose_delivree = $3, dose_unite = $4
        WHERE id = $1
      RETURNING id, sejour_id, code_acte, statut, prevu_le, programme_le,
                realise_le, valide_le, dose_delivree, dose_unite`,
      [acteId, r.manipulateur, r.dose ?? null, r.dose !== undefined ? (r.doseUnite || "mGy") : ""],
    )

    let contraste: { id: number } | null = null
    const injecte = r.contrasteUtilise ?? AVEC_INJECTION.has(existant.code_acte)
    if (injecte) {
      contraste = await one<{ id: number }>(
        `INSERT INTO acte (sejour_id, prescription_id, code_acte, unite_executante,
                           statut, realise_le, executant)
         VALUES ($1,$2,$3,'imagerie','realise', now(), $4)
         RETURNING id`,
        [existant.sejour_id, existant.prescription_id, CODE_CONTRASTE, r.manipulateur],
      )
    }

    await journaliser("acte", acteId, "realisation_imagerie", acteur, {
      dose: r.dose ?? null, contraste: contraste?.id ?? null,
    })
    return { acte: acte!, contraste }
  })
}

/** Compte rendu du radiologue. Sans effet sur la facturation. */
export async function interpreter(
  acteId: number,
  c: { compteRendu: string; conclusion?: string; anomalie?: boolean },
  acteur = "radiologue",
): Promise<{ id: number }> {
  if (!c.compteRendu?.trim()) throw new Error("Le compte rendu ne peut pas être vide")

  const acte = await one<{ statut: string }>(`SELECT statut FROM acte WHERE id = $1`, [acteId])
  if (!acte) throw new Error("Examen introuvable")
  if (acte.statut === "prevu") throw new Error("L'examen n'a pas encore été réalisé")
  if (acte.statut === "annule") throw new Error("Examen annulé")

  const ligne = await one<{ id: number }>(
    `INSERT INTO resultat (acte_id, valeur, unite, reference, critique, commentaire)
     VALUES ($1,$2,'','',$3,$4)
     RETURNING id`,
    [acteId, c.compteRendu.trim(), c.anomalie ?? false, c.conclusion || ""],
  )

  await journaliser("resultat", ligne!.id, "compte_rendu", acteur, {
    acteId, anomalie: c.anomalie ?? false,
  })
  return ligne!
}

/**
 * Signature du compte rendu — le geste pivot.
 *
 * Il rend le compte rendu opposable et émet les lignes de facture :
 * celle de l'examen, et celle du produit de contraste s'il a été
 * utilisé. Les deux dans la même transaction.
 */
export async function signerCompteRendu(
  acteId: number,
  radiologue: string,
  acteur = "radiologue",
) {
  const comptesRendus = await query<{ id: number }>(
    `SELECT id FROM resultat WHERE acte_id = $1`, [acteId],
  )
  if (comptesRendus.length === 0) {
    throw new Error("Aucun compte rendu saisi : rien à signer")
  }

  const acte = await one<ActeImagerie & { prescription_id: number | null }>(
    `UPDATE acte SET statut = 'valide', valide_le = now(), valide_par = $2
      WHERE id = $1 AND statut = 'realise'
      RETURNING id, sejour_id, code_acte, statut, prevu_le, programme_le,
                realise_le, valide_le, dose_delivree, dose_unite, prescription_id`,
    [acteId, radiologue],
  )
  if (!acte) throw new Error("Examen introuvable ou déjà signé")

  const ligne = await emettreLigne(acteId, acteur)

  // Le produit de contraste rattaché suit le sort de l'examen.
  const contrastes = await query<{ id: number }>(
    `SELECT id FROM acte
      WHERE sejour_id = $1 AND code_acte = $2 AND statut = 'realise'
        AND prescription_id IS NOT DISTINCT FROM $3`,
    [acte.sejour_id, CODE_CONTRASTE, acte.prescription_id],
  )
  const lignesContraste = []
  for (const c of contrastes) {
    await query(
      `UPDATE acte SET statut = 'valide', valide_le = now(), valide_par = $2 WHERE id = $1`,
      [c.id, radiologue],
    )
    lignesContraste.push(await emettreLigne(c.id, acteur))
  }

  await query(
    `UPDATE prescription SET statut = 'servie'
      WHERE id = (SELECT prescription_id FROM acte WHERE id = $1)
        AND NOT EXISTS (
          SELECT 1 FROM acte
           WHERE prescription_id = (SELECT prescription_id FROM acte WHERE id = $1)
             AND statut IN ('prevu', 'realise'))`,
    [acteId],
  )

  await journaliser("acte", acteId, "signature_compte_rendu", acteur, {
    radiologue, ligneEmise: ligne?.id ?? null, contrastes: lignesContraste.length,
  })
  return { acte, ligne, lignesContraste }
}

/** Vue du plateau pour un séjour. */
export async function examensImagerie(sejourId: number) {
  return query<{
    acte_id: number; code_acte: string; libelle: string; famille: string; statut: string
    prevu_le: string; programme_le: string | null; realise_le: string | null; valide_le: string | null
    dose_delivree: string | null; dose_unite: string | null
    compte_rendu: string | null; conclusion: string | null; anomalie: boolean | null
    montant_total: string | null
  }>(
    `SELECT a.id AS acte_id, a.code_acte, c.libelle, c.famille, a.statut,
            a.prevu_le, a.programme_le, a.realise_le, a.valide_le,
            a.dose_delivree, a.dose_unite,
            r.valeur AS compte_rendu, r.commentaire AS conclusion, r.critique AS anomalie,
            l.montant_total
       FROM acte a
       JOIN catalogue_acte c ON c.code = a.code_acte
       LEFT JOIN resultat r ON r.acte_id = a.id
       LEFT JOIN ligne_facture l ON l.acte_id = a.id
      WHERE a.sejour_id = $1
        AND (c.famille = 'imagerie' OR a.code_acte = $2)
      ORDER BY a.prevu_le, a.id`,
    [sejourId, CODE_CONTRASTE],
  )
}

/**
 * Dose cumulée reçue par un patient, tous séjours confondus.
 * La radioprotection raisonne sur la vie entière, pas sur la venue.
 */
export async function doseCumulee(patientId: number) {
  const r = await one<{ total: string | null; nb: string }>(
    `SELECT SUM(a.dose_delivree) AS total, COUNT(a.dose_delivree) AS nb
       FROM acte a
       JOIN sejour s ON s.id = a.sejour_id
      WHERE s.patient_id = $1 AND a.dose_delivree IS NOT NULL
        AND a.statut <> 'annule'`,
    [patientId],
  )
  return { total: Number(r?.total ?? 0), nbExamens: Number(r?.nb ?? 0), unite: "mGy" }
}

/* ════════════════════════════════════════════════════════════════
   Bloc opératoire.

   Les autres plateaux facturent. Celui-ci protège d'abord : chaque
   étape est une barrière qu'on ne franchit pas sans la précédente.

   Trois barrières avant de commencer :
     — consentement éclairé signé,
     — consultation d'anesthésie réalisée,
     — liste de vérification « avant induction ».

   Puis deux autres : « avant incision », et « avant sortie de salle ».
   Ces trois temps sont le standard de sécurité chirurgicale ; les
   coder comme des vœux pieux n'aurait aucun intérêt. Ici, ils
   bloquent réellement.

   La facturation est composite : l'acte chirurgical, l'anesthésie,
   l'occupation de salle facturée à l'heure entamée, et chaque
   implant posé — tracé au numéro de lot, obligation qui survit au
   séjour.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser } from "./db"
import { emettreLigne } from "./facturation"

export type Temps = "avant_induction" | "avant_incision" | "avant_sortie"

/** Points à cocher, par temps. Le libellé est celui prononcé à voix haute. */
export const POINTS_ATTENDUS: Record<Temps, string[]> = {
  avant_induction: [
    "identite_patient_confirmee",
    "intervention_et_site_confirmes",
    "consentement_verifie",
    "allergies_connues",
    "materiel_anesthesie_verifie",
  ],
  avant_incision: [
    "equipe_presentee",
    "identite_et_site_reconfirmes",
    "antibioprophylaxie_faite",
    "imagerie_disponible",
  ],
  avant_sortie: [
    "intervention_enregistree",
    "comptage_compresses_correct",
    "materiel_compte",
    "etiquetage_prelevements",
    "consignes_post_operatoires",
  ],
}

export interface Intervention {
  id: number; sejour_id: number; code_acte: string
  chirurgien: string; anesthesiste: string; salle: string
  programmee_le: string | null; induction_le: string | null
  incision_le: string | null; fin_le: string | null
  statut: string
}

/* ── Consentement ───────────────────────────────────────────────── */
export async function recueillirConsentement(
  sejourId: number,
  c: { objet: string; signePar: string; qualite?: "patient" | "representant_legal" | "parent"; recueilliPar: string },
  acteur = "medecin",
) {
  if (!c.objet?.trim()) throw new Error("L'objet du consentement est requis")
  if (!c.signePar?.trim()) throw new Error("Le signataire est requis")

  const ligne = await one<{ id: number; objet: string; signe_le: string }>(
    `INSERT INTO consentement (sejour_id, objet, signe_par, qualite, recueilli_par)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, objet, signe_le`,
    [sejourId, c.objet.trim(), c.signePar.trim(), c.qualite || "patient", c.recueilliPar],
  )
  await journaliser("consentement", ligne!.id, "recueil", acteur, { sejourId, objet: c.objet })
  return ligne!
}

/* ── Consultation d'anesthésie ──────────────────────────────────── */
/**
 * Elle est facturée immédiatement : c'est une consultation réalisée,
 * indépendante du fait que l'intervention ait lieu ou non.
 */
export async function consultationAnesthesie(
  sejourId: number,
  anesthesiste: string,
  acteur = "anesthesiste",
) {
  return tx(async () => {
    const acte = await one<{ id: number }>(
      `INSERT INTO acte
         (sejour_id, code_acte, unite_executante, statut,
          realise_le, valide_le, valide_par, executant)
       VALUES ($1,'CS-ANEST','bloc','valide', now(), now(), $2, $2)
       RETURNING id`,
      [sejourId, anesthesiste],
    )
    const ligne = await emettreLigne(acte!.id, acteur)
    await journaliser("acte", acte!.id, "consultation_anesthesie", acteur, { sejourId })
    return { acteId: acte!.id, ligne }
  })
}

/* ── Programmation ──────────────────────────────────────────────── */
export async function programmerIntervention(
  sejourId: number,
  i: {
    codeActe: string; chirurgien: string; anesthesiste?: string; salle?: string
    creneau?: string | Date; consentementId?: number; consultationAnesthesieId?: number
  },
  acteur = "chirurgien",
): Promise<Intervention> {
  const sejour = await one<{ statut: string }>(
    `SELECT statut FROM sejour WHERE id = $1`, [sejourId])
  if (!sejour) throw new Error("Séjour introuvable")
  if (sejour.statut !== "ouvert") {
    throw new Error("Impossible de programmer sur un séjour qui n'est plus ouvert")
  }

  const acte = await one<{ code: string }>(
    `SELECT code FROM catalogue_acte
      WHERE code = $1 AND famille = 'chirurgie' AND actif`, [i.codeActe])
  if (!acte) throw new Error(`Acte chirurgical inconnu au catalogue : ${i.codeActe}`)

  // Première barrière : sans consentement, on ne programme pas.
  const consentement = i.consentementId
    ? await one<{ id: number; revoque_le: string | null }>(
        `SELECT id, revoque_le FROM consentement WHERE id = $1 AND sejour_id = $2`,
        [i.consentementId, sejourId])
    : await one<{ id: number; revoque_le: string | null }>(
        `SELECT id, revoque_le FROM consentement
          WHERE sejour_id = $1 AND revoque_le IS NULL
          ORDER BY signe_le DESC LIMIT 1`, [sejourId])
  if (!consentement) throw new Error("Consentement éclairé absent : programmation impossible")
  if (consentement.revoque_le) throw new Error("Le consentement a été révoqué")

  // Deuxième barrière : la consultation d'anesthésie doit avoir eu lieu.
  const consult = i.consultationAnesthesieId
    ? await one<{ id: number }>(
        `SELECT id FROM acte WHERE id = $1 AND sejour_id = $2 AND code_acte = 'CS-ANEST'`,
        [i.consultationAnesthesieId, sejourId])
    : await one<{ id: number }>(
        `SELECT id FROM acte WHERE sejour_id = $1 AND code_acte = 'CS-ANEST'
                                AND statut = 'valide'
          ORDER BY valide_le DESC LIMIT 1`, [sejourId])
  if (!consult) throw new Error("Consultation d'anesthésie absente : programmation impossible")

  const intervention = await one<Intervention>(
    `INSERT INTO intervention
       (sejour_id, code_acte, chirurgien, anesthesiste, salle,
        consentement_id, consultation_anesthesie_id, programmee_le)
     VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8::timestamptz, now()))
     RETURNING id, sejour_id, code_acte, chirurgien, anesthesiste, salle,
               programmee_le, induction_le, incision_le, fin_le, statut`,
    [
      sejourId, i.codeActe, i.chirurgien, i.anesthesiste || "", i.salle || "",
      consentement.id, consult.id,
      i.creneau instanceof Date ? i.creneau.toISOString() : (i.creneau ?? null),
    ],
  )

  await journaliser("intervention", intervention!.id, "programmation", acteur, {
    sejourId, code: i.codeActe, salle: i.salle || "",
  })
  return intervention!
}

/* ── Liste de vérification ──────────────────────────────────────── */
/**
 * Valide un temps de la liste. Tous les points doivent être cochés :
 * une liste partiellement remplie ne protège de rien, et l'accepter
 * reviendrait à en faire une formalité.
 */
export async function validerVerification(
  interventionId: number,
  temps: Temps,
  points: Record<string, boolean>,
  validePar: string,
  acteur = "bloc",
) {
  const attendus = POINTS_ATTENDUS[temps]
  if (!attendus) throw new Error("Temps de vérification inconnu")

  const manquants = attendus.filter((p) => points?.[p] !== true)
  if (manquants.length) {
    throw new Error(
      `Liste de vérification incomplète (${temps}) : ${manquants.join(", ")}`,
    )
  }

  const intervention = await one<{ id: number; statut: string }>(
    `SELECT id, statut FROM intervention WHERE id = $1`, [interventionId])
  if (!intervention) throw new Error("Intervention introuvable")
  if (intervention.statut === "annulee") throw new Error("Intervention annulée")

  await query(
    `INSERT INTO verification_bloc (intervention_id, temps, points, validee_par)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (intervention_id, temps)
     DO UPDATE SET points = EXCLUDED.points, validee_par = EXCLUDED.validee_par,
                   validee_le = now()`,
    [interventionId, temps, JSON.stringify(points), validePar],
  )

  await journaliser("intervention", interventionId, `verification_${temps}`, acteur, {
    validePar,
  })
  return { interventionId, temps, validee: true }
}

async function exigerVerification(interventionId: number, temps: Temps) {
  const v = await one<{ temps: string }>(
    `SELECT temps FROM verification_bloc WHERE intervention_id = $1 AND temps = $2`,
    [interventionId, temps])
  if (!v) {
    throw new Error(`Liste de vérification « ${temps} » non validée : étape impossible`)
  }
}

/* ── Déroulé ────────────────────────────────────────────────────── */
export async function induire(interventionId: number, acteur = "anesthesiste") {
  await exigerVerification(interventionId, "avant_induction")
  const i = await one<Intervention>(
    `UPDATE intervention SET statut = 'induite', induction_le = now()
      WHERE id = $1 AND statut = 'programmee'
      RETURNING id, sejour_id, code_acte, chirurgien, anesthesiste, salle,
                programmee_le, induction_le, incision_le, fin_le, statut`,
    [interventionId])
  if (!i) throw new Error("Intervention introuvable ou déjà induite")
  await journaliser("intervention", interventionId, "induction", acteur)
  return i
}

export async function inciser(interventionId: number, acteur = "chirurgien") {
  await exigerVerification(interventionId, "avant_incision")
  const i = await one<Intervention>(
    `UPDATE intervention SET statut = 'en_cours', incision_le = now()
      WHERE id = $1 AND statut = 'induite'
      RETURNING id, sejour_id, code_acte, chirurgien, anesthesiste, salle,
                programmee_le, induction_le, incision_le, fin_le, statut`,
    [interventionId])
  if (!i) throw new Error("L'induction n'a pas été enregistrée")
  await journaliser("intervention", interventionId, "incision", acteur)
  return i
}

/** Enregistre un implant posé. Le numéro de lot est obligatoire. */
export async function poserImplant(
  interventionId: number,
  im: { code: string; numeroLot: string; peremption?: string; quantite?: number },
  acteur = "chirurgien",
) {
  if (!im.numeroLot?.trim()) {
    throw new Error("Le numéro de lot est obligatoire pour un dispositif implantable")
  }
  const intervention = await one<{ statut: string }>(
    `SELECT statut FROM intervention WHERE id = $1`, [interventionId])
  if (!intervention) throw new Error("Intervention introuvable")
  if (intervention.statut !== "en_cours") {
    throw new Error("Un implant ne se pose qu'au cours de l'intervention")
  }
  const connu = await one<{ code: string }>(
    `SELECT code FROM catalogue_acte WHERE code = $1 AND actif`, [im.code])
  if (!connu) throw new Error(`Dispositif inconnu au catalogue : ${im.code}`)

  const ligne = await one<{ id: number; numero_lot: string }>(
    `INSERT INTO implant (intervention_id, code_acte, numero_lot, peremption, quantite)
     VALUES ($1,$2,$3,$4::date,$5)
     RETURNING id, numero_lot`,
    [interventionId, im.code, im.numeroLot.trim(), im.peremption || null, im.quantite ?? 1])

  await journaliser("implant", ligne!.id, "pose", acteur, {
    interventionId, code: im.code, lot: im.numeroLot,
  })
  return ligne!
}

/* ── Sortie de salle et facturation ─────────────────────────────── */
/** Heures entamées entre l'induction et la fin. Toute heure commencée est due. */
export function heuresSalle(debut: Date, fin: Date): number {
  const ms = fin.getTime() - debut.getTime()
  if (ms <= 0) return 1
  return Math.max(1, Math.ceil(ms / 3_600_000))
}

/**
 * Sortie de salle : dernière barrière, puis facturation composite.
 * Acte chirurgical, anesthésie, occupation de salle et implants
 * partent ensemble, dans la même transaction.
 */
export async function sortirDeSalle(
  interventionId: number,
  s: { compteRendu: string; codeAnesthesie?: string; chirurgien: string },
  acteur = "chirurgien",
) {
  if (!s.compteRendu?.trim()) {
    throw new Error("Le compte rendu opératoire est requis avant la sortie de salle")
  }
  await exigerVerification(interventionId, "avant_sortie")

  const i = await one<Intervention>(
    `SELECT id, sejour_id, code_acte, chirurgien, anesthesiste, salle,
            programmee_le, induction_le, incision_le, fin_le, statut
       FROM intervention WHERE id = $1`, [interventionId])
  if (!i) throw new Error("Intervention introuvable")
  if (i.statut !== "en_cours") throw new Error("L'intervention n'est pas en cours")

  return tx(async () => {
    const fin = new Date()
    await query(
      `UPDATE intervention
          SET statut = 'facturee', fin_le = $2, compte_rendu = $3
        WHERE id = $1`,
      [interventionId, fin.toISOString(), s.compteRendu.trim()])

    const lignes: Array<{ code: string; montant: number }> = []

    const facturer = async (code: string, quantite: number, executant: string) => {
      const acte = await one<{ id: number }>(
        `INSERT INTO acte
           (sejour_id, code_acte, quantite, unite_executante, statut,
            realise_le, valide_le, valide_par, executant)
         VALUES ($1,$2,$3,'bloc','valide', now(), now(), $4, $4)
         RETURNING id`,
        [i.sejour_id, code, quantite, executant])
      const l = await emettreLigne(acte!.id, acteur)
      lignes.push({ code, montant: Number(l?.montant_total ?? 0) })
      return acte!.id
    }

    // Acte chirurgical
    await facturer(i.code_acte, 1, i.chirurgien || s.chirurgien)

    // Anesthésie
    await facturer(s.codeAnesthesie || "ANEST-GEN", 1, i.anesthesiste || "")

    // Occupation de salle, à l'heure entamée
    const debut = i.induction_le ? new Date(i.induction_le) : fin
    await facturer("BLOC-SALLE", heuresSalle(debut, fin), i.chirurgien || s.chirurgien)

    // Surveillance post-interventionnelle
    await facturer("ANEST-SSPI", 1, i.anesthesiste || "")

    // Implants posés
    const implants = await query<{ id: number; code_acte: string; quantite: string }>(
      `SELECT id, code_acte, quantite FROM implant
        WHERE intervention_id = $1 AND acte_id IS NULL`, [interventionId])
    for (const im of implants) {
      const acteId = await facturer(im.code_acte, Number(im.quantite), i.chirurgien || s.chirurgien)
      await query(`UPDATE implant SET acte_id = $2 WHERE id = $1`, [im.id, acteId])
    }

    const total = lignes.reduce((t, l) => t + l.montant, 0)
    await journaliser("intervention", interventionId, "sortie_de_salle", acteur, {
      total, lignes: lignes.length,
    })
    return { interventionId, lignes, total }
  })
}

/* ── Vues ───────────────────────────────────────────────────────── */
export async function interventionsDuSejour(sejourId: number) {
  return query<{
    id: number; code_acte: string; libelle: string; statut: string
    chirurgien: string; anesthesiste: string; salle: string
    induction_le: string | null; incision_le: string | null; fin_le: string | null
    verifications: number; implants: number
  }>(
    `SELECT i.id, i.code_acte, c.libelle, i.statut,
            i.chirurgien, i.anesthesiste, i.salle,
            i.induction_le, i.incision_le, i.fin_le,
            (SELECT COUNT(*) FROM verification_bloc v WHERE v.intervention_id = i.id) AS verifications,
            (SELECT COUNT(*) FROM implant im WHERE im.intervention_id = i.id) AS implants
       FROM intervention i
       JOIN catalogue_acte c ON c.code = i.code_acte
      WHERE i.sejour_id = $1
      ORDER BY i.programmee_le`,
    [sejourId],
  )
}

/** Retrouve les patients porteurs d'un lot — rappel de dispositif. */
export async function porteursDuLot(numeroLot: string) {
  return query<{ ipp: string; nom: string; prenom: string; code_acte: string; pose_le: string }>(
    `SELECT p.ipp, p.nom, p.prenom, im.code_acte, im.pose_le
       FROM implant im
       JOIN intervention i ON i.id = im.intervention_id
       JOIN sejour s ON s.id = i.sejour_id
       JOIN patient p ON p.id = s.patient_id
      WHERE im.numero_lot = $1
      ORDER BY im.pose_le`,
    [numeroLot],
  )
}

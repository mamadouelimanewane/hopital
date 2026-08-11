/* ════════════════════════════════════════════════════════════════
   Facturation au fil de l'eau.

   Le principe central du socle : la validation clinique d'un acte et
   l'émission de sa ligne de facture sont le même geste. Un acte non
   capturé au moment où il a lieu ne sera jamais facturé — personne ne
   reconstitue trois semaines de soins à la sortie.

   La ligne fige le tarif et le taux appliqués. Une revalorisation
   ultérieure ne réécrit donc jamais une facture ancienne.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser, prochainNumero } from "./db"

export interface Tarif {
  montant: string
  devise: string
  date_effet: string
}

/** Tarif en vigueur pour un acte à une date donnée. */
export async function tarifApplicable(codeActe: string, date: Date | string): Promise<Tarif | null> {
  const jour = typeof date === "string" ? date.slice(0, 10) : date.toISOString().slice(0, 10)
  return one<Tarif>(
    `SELECT montant, devise, date_effet
       FROM tarif
      WHERE code_acte = $1
        AND date_effet <= $2::date
        AND (date_fin IS NULL OR date_fin >= $2::date)
      ORDER BY date_effet DESC
      LIMIT 1`,
    [codeActe, jour],
  )
}

export interface LigneEmise {
  id: number
  code_acte: string
  libelle: string
  montant_total: string
  part_organisme: string
  part_patient: string
  taux_applique: string
}

/**
 * Émet la ligne de facture d'un acte validé.
 *
 * Idempotent : rappelée sur le même acte, elle renvoie la ligne
 * existante sans dupliquer — la contrainte d'unicité sur acte_id en
 * est le garde-fou.
 */
export async function emettreLigne(acteId: number, acteur = "systeme"): Promise<LigneEmise | null> {
  const existante = await one<LigneEmise>(
    `SELECT id, code_acte, libelle, montant_total, part_organisme, part_patient, taux_applique
       FROM ligne_facture WHERE acte_id = $1`,
    [acteId],
  )
  if (existante) return existante

  const acte = await one<{
    id: number; sejour_id: number; code_acte: string; quantite: string;
    statut: string; valide_le: string | null; realise_le: string | null;
    libelle: string; patient_id: number; couverture_id: number | null;
  }>(
    `SELECT a.id, a.sejour_id, a.code_acte, a.quantite, a.statut,
            a.valide_le, a.realise_le, c.libelle,
            s.patient_id, s.couverture_id
       FROM acte a
       JOIN catalogue_acte c ON c.code = a.code_acte
       JOIN sejour s ON s.id = a.sejour_id
      WHERE a.id = $1`,
    [acteId],
  )
  if (!acte) throw new Error("Acte introuvable")
  if (acte.statut !== "valide") {
    throw new Error("Seul un acte validé peut être facturé")
  }

  const dateActe = acte.valide_le || acte.realise_le || new Date().toISOString()
  const tarif = await tarifApplicable(acte.code_acte, dateActe)
  if (!tarif) {
    // Un acte sans tarif ne doit pas bloquer le soin, mais il doit
    // remonter : il apparaîtra dans les contrôles de cohérence.
    await journaliser("acte", acteId, "tarif_absent", acteur, { code: acte.code_acte })
    return null
  }

  const quantite = Number(acte.quantite)
  const unitaire = Number(tarif.montant)
  const total = Math.round(unitaire * quantite * 100) / 100

  // Taux figé au moment de l'acte, plafonné par le reste disponible.
  // On plafonne le MONTANT puis on en déduit le taux affiché : faire
  // l'inverse laisse des centimes au-delà du plafond.
  let taux = 0
  let partOrganisme = 0
  if (acte.couverture_id) {
    const couv = await one<{ taux_prise_en_charge: string; plafond: string | null; consomme: string }>(
      `SELECT taux_prise_en_charge, plafond, consomme FROM couverture WHERE id = $1`,
      [acte.couverture_id],
    )
    if (couv) {
      taux = Number(couv.taux_prise_en_charge)
      partOrganisme = Math.round((total * taux) / 100 * 100) / 100

      if (couv.plafond !== null) {
        const restant = Math.max(0, Number(couv.plafond) - Number(couv.consomme))
        if (partOrganisme > restant) {
          partOrganisme = restant
          taux = total > 0 ? Math.round((partOrganisme / total) * 10000) / 100 : 0
        }
      }
    }
  }

  const partPatient = Math.round((total - partOrganisme) * 100) / 100

  return tx(async () => {
    const ligne = await one<LigneEmise>(
      `INSERT INTO ligne_facture
         (sejour_id, acte_id, code_acte, libelle, quantite,
          montant_unitaire, montant_total, taux_applique, part_organisme, part_patient)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, code_acte, libelle, montant_total, part_organisme, part_patient, taux_applique`,
      [
        acte.sejour_id, acteId, acte.code_acte, acte.libelle, quantite,
        unitaire, total, taux, partOrganisme, partPatient,
      ],
    )

    if (acte.couverture_id && partOrganisme > 0) {
      await query(
        `UPDATE couverture SET consomme = consomme + $1 WHERE id = $2`,
        [partOrganisme, acte.couverture_id],
      )
    }

    await journaliser("ligne_facture", ligne!.id, "emission", acteur, {
      acteId, code: acte.code_acte, total, taux,
    })
    return ligne!
  })
}

export interface CompteurSejour {
  nda: string
  total: number
  partOrganisme: number
  partPatient: number
  nbLignes: number
  plafondAtteint: boolean
}

/** État financier d'un séjour, à tout instant. */
export async function compteurSejour(sejourId: number): Promise<CompteurSejour> {
  const s = await one<{ nda: string; couverture_id: number | null }>(
    `SELECT nda, couverture_id FROM sejour WHERE id = $1`, [sejourId],
  )
  if (!s) throw new Error("Séjour introuvable")

  const agg = await one<{ total: string | null; org: string | null; pat: string | null; n: string }>(
    `SELECT SUM(montant_total) AS total, SUM(part_organisme) AS org,
            SUM(part_patient) AS pat, COUNT(*) AS n
       FROM ligne_facture WHERE sejour_id = $1`,
    [sejourId],
  )

  let plafondAtteint = false
  if (s.couverture_id) {
    const c = await one<{ plafond: string | null; consomme: string }>(
      `SELECT plafond, consomme FROM couverture WHERE id = $1`, [s.couverture_id],
    )
    if (c?.plafond !== null && c?.plafond !== undefined) {
      plafondAtteint = Number(c.consomme) >= Number(c.plafond)
    }
  }

  return {
    nda: s.nda,
    total: Number(agg?.total ?? 0),
    partOrganisme: Number(agg?.org ?? 0),
    partPatient: Number(agg?.pat ?? 0),
    nbLignes: Number(agg?.n ?? 0),
    plafondAtteint,
  }
}

export interface Anomalie { type: string; detail: string; reference: number | null }

/**
 * Contrôles de cohérence avant clôture.
 * La première anomalie est celle qui coûte le plus cher : un acte
 * validé sans ligne de facture est une recette perdue.
 */
export async function controlerCoherence(sejourId: number): Promise<Anomalie[]> {
  const anomalies: Anomalie[] = []

  const nonFactures = await query<{ id: number; code_acte: string }>(
    `SELECT a.id, a.code_acte
       FROM acte a
       LEFT JOIN ligne_facture l ON l.acte_id = a.id
      WHERE a.sejour_id = $1 AND a.statut = 'valide' AND l.id IS NULL`,
    [sejourId],
  )
  for (const a of nonFactures) {
    anomalies.push({
      type: "acte_non_facture",
      detail: `Acte ${a.code_acte} validé sans ligne de facture`,
      reference: a.id,
    })
  }

  const enAttente = await query<{ id: number; code_acte: string; statut: string }>(
    `SELECT id, code_acte, statut FROM acte
      WHERE sejour_id = $1 AND statut IN ('prevu', 'realise')`,
    [sejourId],
  )
  for (const a of enAttente) {
    anomalies.push({
      type: "acte_non_valide",
      detail: `Acte ${a.code_acte} encore au statut « ${a.statut} »`,
      reference: a.id,
    })
  }

  const prescriptions = await query<{ id: number; type: string }>(
    `SELECT p.id, p.type FROM prescription p
      LEFT JOIN acte a ON a.prescription_id = p.id
      WHERE p.sejour_id = $1 AND p.statut = 'active' AND a.id IS NULL`,
    [sejourId],
  )
  for (const p of prescriptions) {
    anomalies.push({
      type: "prescription_sans_acte",
      detail: `Prescription ${p.type} sans acte associé`,
      reference: p.id,
    })
  }

  const mouvements = await one<{ n: string }>(
    `SELECT COUNT(*) AS n FROM mouvement WHERE sejour_id = $1`, [sejourId],
  )
  if (Number(mouvements?.n ?? 0) === 0) {
    anomalies.push({
      type: "sejour_sans_mouvement",
      detail: "Aucun mouvement enregistré pour ce séjour",
      reference: null,
    })
  }

  return anomalies
}

/** Clôture le séjour et émet la facture. Refuse si des actes restent non facturés. */
export async function cloturerEtFacturer(
  sejourId: number,
  modeSortie: "domicile" | "transfert" | "structure_suite" | "contre_avis_medical" | "deces",
  options: { forcer?: boolean; acteur?: string } = {},
): Promise<{ facture: { id: number; numero: string; total: string; total_patient: string }; anomalies: Anomalie[] }> {
  const acteur = options.acteur || "admission"
  const anomalies = await controlerCoherence(sejourId)

  const bloquantes = anomalies.filter((a) => a.type === "acte_non_facture")
  if (bloquantes.length > 0 && !options.forcer) {
    throw new Error(
      `${bloquantes.length} acte(s) validé(s) sans ligne de facture. ` +
      `Corrigez avant de clôturer, ou forcez explicitement.`,
    )
  }

  return tx(async () => {
    const c = await compteurSejour(sejourId)
    const an = new Date().getFullYear()
    const n = await prochainNumero(`facture-${an}`)
    const numero = `F-${an}-${String(n).padStart(6, "0")}`

    const facture = await one<{ id: number; numero: string; total: string; total_patient: string }>(
      `INSERT INTO facture (numero, sejour_id, total, total_organisme, total_patient)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, numero, total, total_patient`,
      [numero, sejourId, c.total, c.partOrganisme, c.partPatient],
    )

    await query(`UPDATE ligne_facture SET facture_id = $1 WHERE sejour_id = $2`, [facture!.id, sejourId])
    await query(
      `UPDATE sejour SET statut = 'facture', sortie_le = now(), mode_sortie = $1 WHERE id = $2`,
      [modeSortie, sejourId],
    )
    await query(`UPDATE mouvement SET fin_le = now() WHERE sejour_id = $1 AND fin_le IS NULL`, [sejourId])

    await journaliser("facture", facture!.id, "emission", acteur, {
      sejourId, numero, total: c.total, anomalies: anomalies.length,
    })
    return { facture: facture!, anomalies }
  })
}

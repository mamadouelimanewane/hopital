/* ════════════════════════════════════════════════════════════════
   Recouvrement — de la facture émise à l'argent encaissé.

   La facture n'est pas la recette. Entre les deux il y a deux
   circuits distincts, qu'il ne faut jamais confondre :

     — le patient règle son reste à charge, au guichet ;
     — l'organisme règle sa part, sur bordereau, avec des semaines de
       décalage et une part de rejets.

   D'où l'origine portée par chaque règlement. Mélanger les deux
   rendrait impossible de savoir ce qu'on attend encore, et de qui.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser, prochainNumero } from "./db"

export type Moyen =
  | "especes" | "mobile_money" | "carte" | "virement" | "cheque" | "tiers_payant"

/* ── Encaissement patient ───────────────────────────────────────── */
export interface EtatFacture {
  id: number; numero: string
  total: number; totalOrganisme: number; totalPatient: number
  reglePatient: number; regleOrganisme: number
  restePatient: number; resteOrganisme: number
  statut: string
}

export async function etatFacture(factureId: number): Promise<EtatFacture> {
  const f = await one<{
    id: number; numero: string; total: string
    total_organisme: string; total_patient: string; statut: string
  }>(
    `SELECT id, numero, total, total_organisme, total_patient, statut
       FROM facture WHERE id = $1`, [factureId])
  if (!f) throw new Error("Facture introuvable")

  const r = await one<{ patient: string | null; organisme: string | null }>(
    `SELECT SUM(montant) FILTER (WHERE origine = 'patient')   AS patient,
            SUM(montant) FILTER (WHERE origine = 'organisme') AS organisme
       FROM reglement WHERE facture_id = $1`, [factureId])

  const totalPatient = Number(f.total_patient)
  const totalOrganisme = Number(f.total_organisme)
  const reglePatient = Number(r?.patient ?? 0)
  const regleOrganisme = Number(r?.organisme ?? 0)

  return {
    id: f.id, numero: f.numero,
    total: Number(f.total), totalOrganisme, totalPatient,
    reglePatient, regleOrganisme,
    restePatient: Math.round((totalPatient - reglePatient) * 100) / 100,
    resteOrganisme: Math.round((totalOrganisme - regleOrganisme) * 100) / 100,
    statut: f.statut,
  }
}

/** Met le statut de la facture en accord avec ce qui a été réglé. */
async function rafraichirStatut(factureId: number) {
  const e = await etatFacture(factureId)
  const statut =
    e.restePatient <= 0 && e.resteOrganisme <= 0 ? "soldee"
    : e.reglePatient + e.regleOrganisme > 0 ? "partiellement_reglee"
    : "emise"
  await query(`UPDATE facture SET statut = $2 WHERE id = $1`, [factureId, statut])
  return statut
}

/**
 * Encaissement au guichet. Ne peut pas dépasser le reste à charge :
 * un trop-perçu se règle par un avoir, pas par un encaissement.
 */
export async function encaisser(
  factureId: number,
  r: { montant: number; moyen: Moyen; reference?: string },
  acteur = "facturation",
) {
  if (!(r.montant > 0)) throw new Error("Le montant doit être positif")

  const avant = await etatFacture(factureId)
  if (avant.restePatient <= 0) {
    throw new Error("Cette facture ne présente plus de reste à charge patient")
  }
  if (r.montant > avant.restePatient) {
    throw new Error(
      `Montant supérieur au reste à charge : ${avant.restePatient} attendu, ${r.montant} présenté`,
    )
  }

  return tx(async () => {
    const ligne = await one<{ id: number }>(
      `INSERT INTO reglement (facture_id, montant, moyen, origine, reference)
       VALUES ($1,$2,$3,'patient',$4) RETURNING id`,
      [factureId, r.montant, r.moyen, r.reference || ""])
    const statut = await rafraichirStatut(factureId)
    await journaliser("reglement", ligne!.id, "encaissement_patient", acteur, {
      factureId, montant: r.montant, moyen: r.moyen,
    })
    return { reglementId: ligne!.id, statut, etat: await etatFacture(factureId) }
  })
}

/* ── Bordereaux de tiers payant ─────────────────────────────────── */
/**
 * Constitue un bordereau pour un organisme : toutes les factures
 * portant une part organisme non encore réclamée.
 */
export async function constituerBordereau(
  organisme: string,
  options: { regime?: string; acteur?: string } = {},
) {
  const acteur = options.acteur || "facturation"
  if (!organisme?.trim()) throw new Error("L'organisme est requis")

  const candidates = await query<{ id: number; total_organisme: string; regime: string }>(
    `SELECT f.id, f.total_organisme, c.regime
       FROM facture f
       JOIN sejour s ON s.id = f.sejour_id
       JOIN couverture c ON c.id = s.couverture_id
      WHERE c.organisme = $1
        AND f.total_organisme > 0
        AND f.statut <> 'annulee'
        -- Jamais deux fois sur un bordereau vivant.
        AND NOT EXISTS (
          SELECT 1 FROM bordereau_ligne bl
            JOIN bordereau b ON b.id = bl.bordereau_id
           WHERE bl.facture_id = f.id AND b.statut <> 'annule')
      ORDER BY f.emise_le`,
    [organisme.trim()])

  if (candidates.length === 0) {
    throw new Error(`Aucune facture à réclamer pour ${organisme}`)
  }

  return tx(async () => {
    const an = new Date().getFullYear()
    const n = await prochainNumero(`bordereau-${an}`)
    const numero = `B-${an}-${String(n).padStart(5, "0")}`
    const montant = candidates.reduce((t, c) => t + Number(c.total_organisme), 0)

    const bordereau = await one<{ id: number; numero: string; montant_reclame: string }>(
      `INSERT INTO bordereau (numero, organisme, regime, montant_reclame)
       VALUES ($1,$2,$3,$4)
       RETURNING id, numero, montant_reclame`,
      [numero, organisme.trim(), options.regime || candidates[0].regime, montant])

    for (const c of candidates) {
      await query(
        `INSERT INTO bordereau_ligne (bordereau_id, facture_id, montant_reclame)
         VALUES ($1,$2,$3)`,
        [bordereau!.id, c.id, c.total_organisme])
    }

    await journaliser("bordereau", bordereau!.id, "constitution", acteur, {
      organisme, factures: candidates.length, montant,
    })
    return { ...bordereau!, nbFactures: candidates.length }
  })
}

export async function envoyerBordereau(bordereauId: number, acteur = "facturation") {
  const b = await one<{ id: number; numero: string }>(
    `UPDATE bordereau SET statut = 'envoye', envoye_le = now()
      WHERE id = $1 AND statut = 'constitue'
      RETURNING id, numero`, [bordereauId])
  if (!b) throw new Error("Bordereau introuvable ou déjà envoyé")
  await journaliser("bordereau", bordereauId, "envoi", acteur, { numero: b.numero })
  return b
}

/**
 * Retour de l'organisme, ligne par ligne. Un rejet doit être motivé :
 * sans motif, on ne peut ni corriger ni réémettre, et la créance
 * s'évapore silencieusement.
 */
export async function enregistrerRetour(
  bordereauId: number,
  retours: Array<{ factureId: number; montantRegle?: number; motifRejet?: string }>,
  acteur = "facturation",
) {
  const bordereau = await one<{ id: number; statut: string }>(
    `SELECT id, statut FROM bordereau WHERE id = $1`, [bordereauId])
  if (!bordereau) throw new Error("Bordereau introuvable")
  if (bordereau.statut !== "envoye" && bordereau.statut !== "partiel") {
    throw new Error("Le bordereau n'a pas été envoyé")
  }

  for (const r of retours) {
    const rejet = (r.montantRegle ?? 0) <= 0
    if (rejet && !r.motifRejet?.trim()) {
      throw new Error(`Rejet non motivé pour la facture ${r.factureId}`)
    }
  }

  return tx(async () => {
    let totalRegle = 0
    let rejets = 0

    for (const r of retours) {
      const ligne = await one<{ id: number; montant_reclame: string }>(
        `SELECT id, montant_reclame FROM bordereau_ligne
          WHERE bordereau_id = $1 AND facture_id = $2`,
        [bordereauId, r.factureId])
      if (!ligne) throw new Error(`Facture ${r.factureId} absente de ce bordereau`)

      const regle = r.montantRegle ?? 0
      const reclame = Number(ligne.montant_reclame)
      const statut = regle <= 0 ? "rejete" : regle >= reclame ? "regle" : "partiel"

      await query(
        `UPDATE bordereau_ligne
            SET montant_regle = $2, statut = $3, motif_rejet = $4
          WHERE id = $1`,
        [ligne.id, regle, statut, r.motifRejet || ""])

      if (regle > 0) {
        await query(
          `INSERT INTO reglement (facture_id, montant, moyen, origine, reference)
           VALUES ($1,$2,'tiers_payant','organisme',$3)`,
          [r.factureId, regle, `bordereau ${bordereauId}`])
        await rafraichirStatut(r.factureId)
        totalRegle += regle
      } else {
        rejets++
      }
    }

    /* Le bordereau n'est soldé que si TOUTES ses lignes sont
       intégralement réglées. Une ligne encore en attente, rejetée ou
       partiellement payée laisse de l'argent à percevoir. */
    const restant = await one<{ n: string }>(
      `SELECT COUNT(*) AS n FROM bordereau_ligne
        WHERE bordereau_id = $1 AND statut <> 'regle'`, [bordereauId])

    const statutBordereau = Number(restant!.n) > 0 ? "partiel" : "solde"

    await query(
      `UPDATE bordereau
          SET montant_regle = montant_regle + $2, statut = $3, retour_le = now()
        WHERE id = $1`,
      [bordereauId, totalRegle, statutBordereau])

    await journaliser("bordereau", bordereauId, "retour", acteur, {
      regle: totalRegle, rejets,
    })
    return { totalRegle, rejets, statut: statutBordereau }
  })
}

/** Lignes rejetées à retraiter. */
export async function rejetsARetraiter() {
  return query<{
    bordereau: string; organisme: string; facture: string
    montant_reclame: string; motif_rejet: string
  }>(
    `SELECT b.numero AS bordereau, b.organisme, f.numero AS facture,
            bl.montant_reclame, bl.motif_rejet
       FROM bordereau_ligne bl
       JOIN bordereau b ON b.id = bl.bordereau_id
       JOIN facture f ON f.id = bl.facture_id
      WHERE bl.statut = 'rejete'
      ORDER BY b.retour_le DESC`)
}

/* ── Relances patient ───────────────────────────────────────────── */
export async function relancer(
  factureId: number,
  niveau: 1 | 2 | 3,
  canal: "courrier" | "sms" | "appel" | "email" = "sms",
  acteur = "facturation",
) {
  const e = await etatFacture(factureId)
  if (e.restePatient <= 0) throw new Error("Rien à relancer : la part patient est soldée")

  if (niveau > 1) {
    const precedente = await one<{ niveau: number }>(
      `SELECT niveau FROM relance WHERE facture_id = $1 AND niveau = $2`,
      [factureId, niveau - 1])
    if (!precedente) {
      throw new Error(`La relance de niveau ${niveau - 1} n'a pas été envoyée`)
    }
  }

  const ligne = await one<{ id: number; niveau: number }>(
    `INSERT INTO relance (facture_id, niveau, canal, montant_du)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (facture_id, niveau) DO NOTHING
     RETURNING id, niveau`,
    [factureId, niveau, canal, e.restePatient])
  if (!ligne) throw new Error(`Relance de niveau ${niveau} déjà envoyée`)

  await journaliser("relance", ligne!.id, "envoi", acteur, {
    factureId, niveau, canal, montant: e.restePatient,
  })
  return { ...ligne!, montantDu: e.restePatient }
}

/** Factures dont il reste quelque chose à recouvrer. */
export async function creancesEnCours() {
  return query<{
    facture_id: number; numero: string; nda: string; patient: string
    reste_patient: string; reste_organisme: string; emise_le: string
    jours: string; relances: string
  }>(
    `SELECT f.id AS facture_id, f.numero, s.nda,
            p.prenom || ' ' || p.nom AS patient,
            f.total_patient - COALESCE(rp.m, 0)   AS reste_patient,
            f.total_organisme - COALESCE(ro.m, 0) AS reste_organisme,
            f.emise_le,
            EXTRACT(DAY FROM now() - f.emise_le) AS jours,
            (SELECT COUNT(*) FROM relance r WHERE r.facture_id = f.id) AS relances
       FROM facture f
       JOIN sejour s ON s.id = f.sejour_id
       JOIN patient p ON p.id = s.patient_id
       LEFT JOIN (SELECT facture_id, SUM(montant) m FROM reglement
                   WHERE origine = 'patient' GROUP BY facture_id) rp ON rp.facture_id = f.id
       LEFT JOIN (SELECT facture_id, SUM(montant) m FROM reglement
                   WHERE origine = 'organisme' GROUP BY facture_id) ro ON ro.facture_id = f.id
      WHERE f.statut <> 'annulee'
        AND (f.total_patient - COALESCE(rp.m, 0) > 0
             OR f.total_organisme - COALESCE(ro.m, 0) > 0)
      ORDER BY f.emise_le`)
}

/* ── Pilotage ───────────────────────────────────────────────────── */
export interface Indicateurs {
  facture: number
  encaisse: number
  resteARecouvrer: number
  tauxRecouvrement: number
  delaiMoyenEncaissement: number | null
  tauxRejetTiersPayant: number
  fuiteFacturation: { actes: number; sejours: number }
  resteAChargeMoyen: number
}

/**
 * Les chiffres qui décident. Le premier est le plus rentable à
 * surveiller : un acte validé sans ligne de facture est une recette
 * définitivement perdue.
 */
export async function indicateurs(): Promise<Indicateurs> {
  const f = await one<{ total: string | null; patient: string | null; n: string }>(
    `SELECT SUM(total) AS total, SUM(total_patient) AS patient, COUNT(*) AS n
       FROM facture WHERE statut <> 'annulee'`)
  const r = await one<{ total: string | null }>(
    `SELECT SUM(montant) AS total FROM reglement`)

  const delai = await one<{ jours: string | null }>(
    `SELECT AVG(EXTRACT(EPOCH FROM (r.regle_le - f.emise_le)) / 86400) AS jours
       FROM reglement r JOIN facture f ON f.id = r.facture_id`)

  const rejet = await one<{ rejetees: string; total: string }>(
    `SELECT COUNT(*) FILTER (WHERE statut = 'rejete') AS rejetees,
            COUNT(*) AS total
       FROM bordereau_ligne`)

  // Fuite de facturation : actes validés sans ligne émise.
  const fuite = await one<{ actes: string; sejours: string }>(
    `SELECT COUNT(*) AS actes, COUNT(DISTINCT a.sejour_id) AS sejours
       FROM acte a
       LEFT JOIN ligne_facture l ON l.acte_id = a.id
      WHERE a.statut = 'valide' AND l.id IS NULL`)

  const facture = Number(f?.total ?? 0)
  const encaisse = Number(r?.total ?? 0)
  const nbFactures = Number(f?.n ?? 0)
  const totalRejet = Number(rejet?.total ?? 0)

  return {
    facture,
    encaisse,
    resteARecouvrer: Math.round((facture - encaisse) * 100) / 100,
    tauxRecouvrement: facture > 0 ? Math.round((encaisse / facture) * 10000) / 100 : 0,
    delaiMoyenEncaissement: delai?.jours != null
      ? Math.round(Number(delai.jours) * 10) / 10 : null,
    tauxRejetTiersPayant: totalRejet > 0
      ? Math.round((Number(rejet!.rejetees) / totalRejet) * 10000) / 100 : 0,
    fuiteFacturation: {
      actes: Number(fuite?.actes ?? 0),
      sejours: Number(fuite?.sejours ?? 0),
    },
    resteAChargeMoyen: nbFactures > 0
      ? Math.round((Number(f!.patient ?? 0) / nbFactures) * 100) / 100 : 0,
  }
}

/** Recette par famille d'actes — où se crée la ressource. */
export async function recetteParFamille() {
  return query<{ famille: string; montant: string; lignes: string }>(
    `SELECT c.famille, SUM(l.montant_total) AS montant, COUNT(*) AS lignes
       FROM ligne_facture l
       JOIN catalogue_acte c ON c.code = l.code_acte
      GROUP BY c.famille
      ORDER BY SUM(l.montant_total) DESC`)
}

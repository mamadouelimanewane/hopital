/* ════════════════════════════════════════════════════════════════
   Admission — création ou reprise d'un patient, ouverture du séjour,
   qualification du payeur.

   Règle structurante : aucun acte ne peut exister sans séjour ouvert.
   En urgence vitale, on ouvre un séjour en identité provisoire —
   jamais un acte hors séjour.
   ════════════════════════════════════════════════════════════════ */

import { query, one, tx, journaliser, prochainNumero } from "./db"
import { normaliser, clePhonetique, rechercherDoublons, type TraitsPatient } from "./identite"

export type Regime =
  | "payant_direct" | "cmu" | "ipm" | "mutuelle" | "assurance_privee"
  | "convention_employeur" | "prise_en_charge_sociale" | "accident_travail"

export type ModeEntree =
  | "consultation_programmee" | "urgences" | "transfert"
  | "maternite" | "hospitalisation_programmee" | "seance"

export type Triage = "rouge" | "orange" | "jaune" | "vert" | "blanc"

export interface Patient {
  id: number; ipp: string; nom: string; prenom: string;
  date_naissance: string | null; sexe: string | null;
  telephone: string | null; statut_identite: string;
}

/** Taux par défaut appliqué quand l'organisme ne l'a pas précisé. */
const TAUX_PAR_DEFAUT: Record<Regime, number> = {
  payant_direct: 0,
  cmu: 80,
  ipm: 80,
  mutuelle: 70,
  assurance_privee: 90,
  convention_employeur: 100,
  prise_en_charge_sociale: 100,
  accident_travail: 100,
}

function anneeCourante(): number {
  return new Date().getFullYear()
}

async function genererIpp(): Promise<string> {
  const an = anneeCourante()
  const n = await prochainNumero(`ipp-${an}`)
  return `IPP-${an}-${String(n).padStart(6, "0")}`
}

async function genererNda(): Promise<string> {
  const an = anneeCourante()
  const n = await prochainNumero(`nda-${an}`)
  return `NDA-${an}-${String(n).padStart(6, "0")}`
}

/** Crée un patient. À n'appeler qu'après avoir écarté les doublons. */
export async function creerPatient(
  traits: TraitsPatient & {
    lieuNaissance?: string; adresse?: string; personnePrevenir?: string;
    statutIdentite?: "provisoire" | "validee";
  },
  acteur = "accueil",
): Promise<Patient> {
  if (!traits.nom?.trim() || !traits.prenom?.trim()) {
    throw new Error("Le nom et le prénom sont requis")
  }

  const ipp = await genererIpp()
  const patient = await one<Patient>(
    `INSERT INTO patient
       (ipp, nom, prenom, date_naissance, sexe, lieu_naissance,
        nom_norm, prenom_norm, cle_phonetique,
        telephone, adresse, personne_prevenir, statut_identite)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING id, ipp, nom, prenom, date_naissance, sexe, telephone, statut_identite`,
    [
      ipp,
      traits.nom.trim(),
      traits.prenom.trim(),
      traits.dateNaissance || null,
      traits.sexe || null,
      traits.lieuNaissance || "",
      normaliser(traits.nom),
      normaliser(traits.prenom),
      clePhonetique(traits.nom, traits.prenom),
      traits.telephone || "",
      traits.adresse || "",
      traits.personnePrevenir || "",
      traits.statutIdentite || "provisoire",
    ],
  )

  await journaliser("patient", patient!.id, "creation", acteur, { ipp })
  return patient!
}

/** Enregistre une couverture pour un patient. */
export async function ajouterCouverture(
  patientId: number,
  c: {
    regime: Regime; organisme?: string; numeroAdherent?: string;
    taux?: number; plafond?: number | null;
    valideDu?: string; valideAu?: string | null; piece?: string;
  },
  acteur = "accueil",
): Promise<{ id: number; taux_prise_en_charge: string }> {
  const taux = c.taux ?? TAUX_PAR_DEFAUT[c.regime]
  if (taux < 0 || taux > 100) throw new Error("Le taux doit être compris entre 0 et 100")

  const ligne = await one<{ id: number; taux_prise_en_charge: string }>(
    `INSERT INTO couverture
       (patient_id, regime, organisme, numero_adherent, taux_prise_en_charge,
        plafond, valide_du, valide_au, piece_justificative)
     VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7::date, CURRENT_DATE),$8,$9)
     RETURNING id, taux_prise_en_charge`,
    [
      patientId, c.regime, c.organisme || "", c.numeroAdherent || "",
      taux, c.plafond ?? null, c.valideDu || null, c.valideAu || null, c.piece || "",
    ],
  )

  await journaliser("couverture", ligne!.id, "creation", acteur, {
    patientId, regime: c.regime, taux,
  })
  return ligne!
}

/** Couverture applicable à une date donnée, la plus avantageuse d'abord. */
export async function couvertureApplicable(patientId: number, date = new Date()) {
  const jour = date.toISOString().slice(0, 10)
  return one<{ id: number; regime: string; taux_prise_en_charge: string; plafond: string | null; consomme: string }>(
    `SELECT id, regime, taux_prise_en_charge, plafond, consomme
       FROM couverture
      WHERE patient_id = $1
        AND valide_du <= $2::date
        AND (valide_au IS NULL OR valide_au >= $2::date)
      ORDER BY taux_prise_en_charge DESC, valide_du DESC
      LIMIT 1`,
    [patientId, jour],
  )
}

export interface Sejour {
  id: number; nda: string; patient_id: number;
  mode_entree: string; triage: string | null;
  couverture_id: number | null; entree_le: string; statut: string;
}

/** Ouvre un séjour. Le triage n'est accepté que pour une entrée aux urgences. */
export async function ouvrirSejour(
  patientId: number,
  s: {
    modeEntree: ModeEntree; motif?: string; triage?: Triage;
    triagePar?: string; unite?: string; lit?: string;
    categorie?: "commune" | "particuliere" | "vip" | "reanimation" | "aucune";
  },
  acteur = "accueil",
): Promise<Sejour> {
  if (s.triage && s.modeEntree !== "urgences") {
    throw new Error("Le triage ne s'applique qu'à une entrée par les urgences")
  }

  return tx(async () => {
    const ouvert = await one<{ nda: string }>(
      `SELECT nda FROM sejour WHERE patient_id = $1 AND statut = 'ouvert' LIMIT 1`,
      [patientId],
    )
    if (ouvert) {
      throw new Error(`Un séjour est déjà ouvert pour ce patient (${ouvert.nda})`)
    }

    const couverture = await couvertureApplicable(patientId)
    const nda = await genererNda()

    const sejour = await one<Sejour>(
      `INSERT INTO sejour
         (nda, patient_id, mode_entree, motif_entree, triage, triage_le, triage_par, couverture_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, nda, patient_id, mode_entree, triage, couverture_id, entree_le, statut`,
      [
        nda, patientId, s.modeEntree, s.motif || "",
        s.triage || null, s.triage ? new Date().toISOString() : null,
        s.triagePar || "", couverture?.id ?? null,
      ],
    )

    if (s.unite) {
      await query(
        `INSERT INTO mouvement (sejour_id, unite, lit, categorie)
         VALUES ($1,$2,$3,$4)`,
        [sejour!.id, s.unite, s.lit || "", s.categorie || "commune"],
      )
    }

    await journaliser("sejour", sejour!.id, "ouverture", acteur, {
      nda, modeEntree: s.modeEntree, triage: s.triage ?? null,
    })
    return sejour!
  })
}

/** Admission complète : recherche de doublons, puis création si demandé. */
export async function admettre(
  traits: TraitsPatient & { lieuNaissance?: string; adresse?: string },
  sejourInfo: Parameters<typeof ouvrirSejour>[1],
  options: {
    patientExistantId?: number
    forcerCreation?: boolean
    couverture?: Parameters<typeof ajouterCouverture>[1]
    acteur?: string
  } = {},
): Promise<
  | { statut: "doublons_possibles"; candidats: Awaited<ReturnType<typeof rechercherDoublons>> }
  | { statut: "admis"; patient: Patient; sejour: Sejour }
> {
  const acteur = options.acteur || "accueil"

  // Reprise d'un patient connu
  if (options.patientExistantId) {
    const patient = await one<Patient>(
      `SELECT id, ipp, nom, prenom, date_naissance, sexe, telephone, statut_identite
         FROM patient WHERE id = $1`,
      [options.patientExistantId],
    )
    if (!patient) throw new Error("Patient introuvable")
    if (options.couverture) await ajouterCouverture(patient.id, options.couverture, acteur)
    const sejour = await ouvrirSejour(patient.id, sejourInfo, acteur)
    return { statut: "admis", patient, sejour }
  }

  // Barrage anti-doublons : on ne crée jamais sans avoir regardé.
  if (!options.forcerCreation) {
    const candidats = await rechercherDoublons(traits)
    if (candidats.length > 0) return { statut: "doublons_possibles", candidats }
  }

  const patient = await creerPatient(traits, acteur)
  if (options.couverture) await ajouterCouverture(patient.id, options.couverture, acteur)
  const sejour = await ouvrirSejour(patient.id, sejourInfo, acteur)
  return { statut: "admis", patient, sejour }
}

/** Rattache un dossier à un autre. Le doublon est conservé, jamais supprimé. */
export async function fusionner(sourceId: number, cibleId: number, acteur = "accueil") {
  if (sourceId === cibleId) throw new Error("Impossible de fusionner un dossier avec lui-même")

  return tx(async () => {
    await query(`UPDATE sejour SET patient_id = $1 WHERE patient_id = $2`, [cibleId, sourceId])
    await query(`UPDATE couverture SET patient_id = $1 WHERE patient_id = $2`, [cibleId, sourceId])
    await query(
      `UPDATE patient SET statut_identite = 'fusionnee', fusionne_vers = $1, modifie_le = now()
        WHERE id = $2`,
      [cibleId, sourceId],
    )
    await journaliser("patient", sourceId, "fusion", acteur, { vers: cibleId })
  })
}

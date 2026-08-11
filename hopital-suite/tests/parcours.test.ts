/* ════════════════════════════════════════════════════════════════
   Le parcours complet, sur un vrai Postgres.

   De l'arrivée aux urgences à la facture, en passant par le
   laboratoire. C'est le test qui vérifie la thèse du socle : un acte
   devient facturable au moment de sa validation clinique, et à ce
   moment-là seulement.
   ════════════════════════════════════════════════════════════════ */
import { describe, it, expect, beforeEach } from "vitest"
import { baseDeTest } from "./socle"
import { query, one } from "@/lib/db"
import {
  admettre, creerPatient, ajouterCouverture, ouvrirSejour, fusionner,
} from "@/lib/admission"
import { rechercherDoublons } from "@/lib/identite"
import {
  tarifApplicable, emettreLigne, compteurSejour,
  controlerCoherence, cloturerEtFacturer,
} from "@/lib/facturation"
import {
  prescrireBiologie, enregistrerPrelevement, saisirResultat,
  validerBiologiquement, examensDuSejour,
} from "@/lib/laboratoire"

let exec: { query: (t: string, p?: unknown[]) => Promise<{ rows: never[] }> }

beforeEach(async () => {
  const b = await baseDeTest()
  exec = b.exec
})

/* ── Admission et identitovigilance ─────────────────────────────── */
describe("admission", () => {
  it("crée un patient avec un IPP et ouvre un séjour avec un NDA", async () => {
    const r = await admettre(
      { nom: "Ndiaye", prenom: "Fatou", dateNaissance: "1988-04-12", sexe: "F" },
      { modeEntree: "urgences", triage: "orange", motif: "Douleur abdominale" },
      { forcerCreation: true },
    )
    expect(r.statut).toBe("admis")
    if (r.statut !== "admis") return
    expect(r.patient.ipp).toMatch(/^IPP-\d{4}-\d{6}$/)
    expect(r.sejour.nda).toMatch(/^NDA-\d{4}-\d{6}$/)
    expect(r.sejour.triage).toBe("orange")
  })

  it("refuse de créer à l'aveugle quand un doublon possible existe", async () => {
    await creerPatient({ nom: "Ndiaye", prenom: "Fatou", dateNaissance: "1988-04-12", sexe: "F" })

    // Graphie différente, même personne
    const r = await admettre(
      { nom: "Ndiay", prenom: "Fatu", dateNaissance: "1988-04-12", sexe: "F" },
      { modeEntree: "consultation_programmee" },
    )
    expect(r.statut).toBe("doublons_possibles")
    if (r.statut !== "doublons_possibles") return
    expect(r.candidats.length).toBeGreaterThan(0)
    expect(r.candidats[0].verdict).toMatch(/identique|probable/)
  })

  it("laisse créer quand aucun rapprochement n'est trouvé", async () => {
    await creerPatient({ nom: "Ndiaye", prenom: "Fatou", dateNaissance: "1988-04-12" })
    const r = await admettre(
      { nom: "Sylla", prenom: "Ousmane", dateNaissance: "1975-01-01", sexe: "M" },
      { modeEntree: "consultation_programmee" },
    )
    expect(r.statut).toBe("admis")
  })

  it("reprend un patient connu au lieu d'en créer un second", async () => {
    const p = await creerPatient({ nom: "Diop", prenom: "Moussa", dateNaissance: "1990-02-02" })
    const r = await admettre(
      { nom: "Diop", prenom: "Moussa" },
      { modeEntree: "urgences", triage: "vert" },
      { patientExistantId: p.id },
    )
    expect(r.statut).toBe("admis")
    if (r.statut !== "admis") return
    expect(r.patient.ipp).toBe(p.ipp)
    const n = await one<{ n: string }>(`SELECT COUNT(*) AS n FROM patient`)
    expect(Number(n!.n)).toBe(1)
  })

  it("interdit deux séjours ouverts pour un même patient", async () => {
    const p = await creerPatient({ nom: "Fall", prenom: "Awa" })
    await ouvrirSejour(p.id, { modeEntree: "urgences" })
    await expect(ouvrirSejour(p.id, { modeEntree: "consultation_programmee" }))
      .rejects.toThrow(/déjà ouvert/)
  })

  it("n'accepte le triage que pour une entrée par les urgences", async () => {
    const p = await creerPatient({ nom: "Ba", prenom: "Ibrahima" })
    await expect(
      ouvrirSejour(p.id, { modeEntree: "consultation_programmee", triage: "rouge" }),
    ).rejects.toThrow(/urgences/)
  })

  it("conserve le doublon lors d'une fusion et transfère les séjours", async () => {
    const bon = await creerPatient({ nom: "Sow", prenom: "Astou", dateNaissance: "1980-05-05" })
    const doublon = await creerPatient({ nom: "Sow", prenom: "Astou", dateNaissance: "1980-05-05" })
    await ouvrirSejour(doublon.id, { modeEntree: "urgences" })

    await fusionner(doublon.id, bon.id)

    const source = await one<{ statut_identite: string; fusionne_vers: number }>(
      `SELECT statut_identite, fusionne_vers FROM patient WHERE id = $1`, [doublon.id])
    expect(source!.statut_identite).toBe("fusionnee")
    expect(source!.fusionne_vers).toBe(bon.id)

    const sejours = await query(`SELECT id FROM sejour WHERE patient_id = $1`, [bon.id])
    expect(sejours.length).toBe(1)

    // Un dossier fusionné ne doit plus remonter dans les rapprochements.
    const c = await rechercherDoublons({ nom: "Sow", prenom: "Astou", dateNaissance: "1980-05-05" })
    expect(c.every((x) => x.id !== doublon.id)).toBe(true)
  })
})

/* ── Tarification ───────────────────────────────────────────────── */
describe("tarification", () => {
  it("résout le tarif en vigueur à la date de l'acte", async () => {
    const t = await tarifApplicable("BIO-NFS", "2026-06-15")
    expect(Number(t!.montant)).toBe(5000)
  })

  it("ne connaît pas de tarif avant sa date d'effet", async () => {
    const t = await tarifApplicable("BIO-NFS", "2025-12-31")
    expect(t).toBeNull()
  })

  it("applique la revalorisation sans réécrire le passé", async () => {
    await exec.query(
      `INSERT INTO tarif (code_acte, montant, date_effet) VALUES ('BIO-NFS', 7000, '2026-07-01')`,
    )
    expect(Number((await tarifApplicable("BIO-NFS", "2026-06-15"))!.montant)).toBe(5000)
    expect(Number((await tarifApplicable("BIO-NFS", "2026-08-15"))!.montant)).toBe(7000)
  })
})

/* ── Le circuit du laboratoire ──────────────────────────────────── */
describe("laboratoire, de la prescription à la facture", () => {
  async function sejourOuvert(taux = 0) {
    const p = await creerPatient({ nom: "Seck", prenom: "Mame Diarra", dateNaissance: "1992-03-08", sexe: "F" })
    if (taux > 0) {
      await ajouterCouverture(p.id, { regime: "ipm", organisme: "IPM Touba", taux })
    }
    const s = await ouvrirSejour(p.id, { modeEntree: "urgences", triage: "orange", unite: "SAU" })
    return { patient: p, sejour: s }
  }

  it("ne facture rien à la prescription", async () => {
    const { sejour } = await sejourOuvert()
    await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS", "BIO-CRP"] })

    const c = await compteurSejour(sejour.id)
    expect(c.nbLignes).toBe(0)
    expect(c.total).toBe(0)
  })

  it("ne facture toujours rien après le prélèvement et le résultat", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS"] })
    await enregistrerPrelevement(actes[0].id, "IDE Kane")
    await saisirResultat(actes[0].id, { valeur: "11.2", unite: "g/dL", reference: "12–16" })

    expect((await compteurSejour(sejour.id)).nbLignes).toBe(0)
  })

  it("émet la ligne au moment exact de la validation biologique", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS"] })
    await enregistrerPrelevement(actes[0].id, "IDE Kane")
    await saisirResultat(actes[0].id, { valeur: "11.2", unite: "g/dL" })

    const { ligne } = await validerBiologiquement(actes[0].id, "Dr. Mbaye")
    expect(ligne).not.toBeNull()
    expect(Number(ligne!.montant_total)).toBe(5000)

    const c = await compteurSejour(sejour.id)
    expect(c.nbLignes).toBe(1)
    expect(c.total).toBe(5000)
    expect(c.partPatient).toBe(5000)   // aucune couverture
  })

  it("répartit entre organisme et patient selon la couverture", async () => {
    const { sejour } = await sejourOuvert(80)
    const { actes } = await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS"] })
    await enregistrerPrelevement(actes[0].id, "IDE Kane")
    await saisirResultat(actes[0].id, { valeur: "11.2" })
    await validerBiologiquement(actes[0].id, "Dr. Mbaye")

    const c = await compteurSejour(sejour.id)
    expect(c.total).toBe(5000)
    expect(c.partOrganisme).toBe(4000)
    expect(c.partPatient).toBe(1000)
  })

  it("plafonne la prise en charge quand le plafond est atteint", async () => {
    const p = await creerPatient({ nom: "Gueye", prenom: "Modou" })
    await ajouterCouverture(p.id, { regime: "mutuelle", taux: 100, plafond: 6000 })
    const s = await ouvrirSejour(p.id, { modeEntree: "consultation_programmee", unite: "Consultations" })

    const { actes } = await prescrireBiologie(s.id, {
      prescripteur: "Dr. Sy", codes: ["BIO-NFS", "BIO-CRP"],   // 5000 puis 6000
    })
    for (const a of actes) {
      await enregistrerPrelevement(a.id, "IDE Diallo")
      await saisirResultat(a.id, { valeur: "x" })
      await validerBiologiquement(a.id, "Dr. Mbaye")
    }

    const c = await compteurSejour(s.id)
    expect(c.total).toBe(11000)
    expect(c.partOrganisme).toBe(6000)    // le plafond, pas davantage
    expect(c.partPatient).toBe(5000)
    expect(c.plafondAtteint).toBe(true)
  })

  it("ne duplique pas la ligne si la validation est rejouée", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-GLY"] })
    await enregistrerPrelevement(actes[0].id, "IDE Kane")
    await saisirResultat(actes[0].id, { valeur: "0.92" })
    await validerBiologiquement(actes[0].id, "Dr. Mbaye")

    await emettreLigne(actes[0].id)
    await emettreLigne(actes[0].id)

    expect((await compteurSejour(sejour.id)).nbLignes).toBe(1)
  })

  it("refuse de valider sans résultat saisi", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS"] })
    await enregistrerPrelevement(actes[0].id, "IDE Kane")
    await expect(validerBiologiquement(actes[0].id, "Dr. Mbaye")).rejects.toThrow(/résultat/i)
  })

  it("refuse un résultat avant le prélèvement", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS"] })
    await expect(saisirResultat(actes[0].id, { valeur: "11" })).rejects.toThrow(/prélèvement/i)
  })

  it("refuse un examen absent du catalogue", async () => {
    const { sejour } = await sejourOuvert()
    await expect(
      prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-INEXISTANT"] }),
    ).rejects.toThrow(/catalogue/i)
  })

  it("marque la prescription servie une fois tous les examens validés", async () => {
    const { sejour } = await sejourOuvert()
    const { prescription, actes } = await prescrireBiologie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["BIO-NFS", "BIO-CRP"],
    })

    await enregistrerPrelevement(actes[0].id, "IDE Kane")
    await saisirResultat(actes[0].id, { valeur: "11" })
    await validerBiologiquement(actes[0].id, "Dr. Mbaye")
    let p = await one<{ statut: string }>(`SELECT statut FROM prescription WHERE id = $1`, [prescription.id])
    expect(p!.statut).toBe("active")

    await enregistrerPrelevement(actes[1].id, "IDE Kane")
    await saisirResultat(actes[1].id, { valeur: "48" })
    await validerBiologiquement(actes[1].id, "Dr. Mbaye")
    p = await one<{ statut: string }>(`SELECT statut FROM prescription WHERE id = $1`, [prescription.id])
    expect(p!.statut).toBe("servie")
  })

  it("restitue l'état de chaque examen du séjour", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await prescrireBiologie(sejour.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS", "BIO-TDR"] })
    await enregistrerPrelevement(actes[0].id, "IDE Kane")
    await saisirResultat(actes[0].id, { valeur: "11.2", unite: "g/dL", critique: true })
    await validerBiologiquement(actes[0].id, "Dr. Mbaye")

    const vue = await examensDuSejour(sejour.id)
    expect(vue.length).toBe(2)
    const nfs = vue.find((v) => v.code_acte === "BIO-NFS")!
    expect(nfs.statut).toBe("valide")
    expect(nfs.critique).toBe(true)
    expect(Number(nfs.montant_total)).toBe(5000)
    const tdr = vue.find((v) => v.code_acte === "BIO-TDR")!
    expect(tdr.statut).toBe("prevu")
    expect(tdr.montant_total).toBeNull()
  })
})

/* ── Clôture ────────────────────────────────────────────────────── */
describe("clôture du séjour", () => {
  async function sejourAvecExamen() {
    const p = await creerPatient({ nom: "Diouf", prenom: "Rokhaya" })
    await ajouterCouverture(p.id, { regime: "cmu", taux: 80 })
    const s = await ouvrirSejour(p.id, { modeEntree: "urgences", triage: "vert", unite: "SAU" })
    const { actes } = await prescrireBiologie(s.id, { prescripteur: "Dr. Sy", codes: ["BIO-NFS"] })
    return { sejour: s, acte: actes[0] }
  }

  it("signale les actes encore non validés", async () => {
    const { sejour } = await sejourAvecExamen()
    const a = await controlerCoherence(sejour.id)
    expect(a.some((x) => x.type === "acte_non_valide")).toBe(true)
  })

  it("détecte un acte validé dont la ligne manque", async () => {
    const { sejour, acte } = await sejourAvecExamen()
    await enregistrerPrelevement(acte.id, "IDE Kane")
    await saisirResultat(acte.id, { valeur: "11" })
    await validerBiologiquement(acte.id, "Dr. Mbaye")

    // Simulation d'une perte de recette
    await exec.query(`DELETE FROM ligne_facture WHERE acte_id = $1`, [acte.id])

    const a = await controlerCoherence(sejour.id)
    expect(a.some((x) => x.type === "acte_non_facture")).toBe(true)
    await expect(cloturerEtFacturer(sejour.id, "domicile")).rejects.toThrow(/sans ligne de facture/)
  })

  it("émet la facture et solde les totaux", async () => {
    const { sejour, acte } = await sejourAvecExamen()
    await enregistrerPrelevement(acte.id, "IDE Kane")
    await saisirResultat(acte.id, { valeur: "11" })
    await validerBiologiquement(acte.id, "Dr. Mbaye")

    const { facture } = await cloturerEtFacturer(sejour.id, "domicile")
    expect(facture.numero).toMatch(/^F-\d{4}-\d{6}$/)
    expect(Number(facture.total)).toBe(5000)
    expect(Number(facture.total_patient)).toBe(1000)

    const s = await one<{ statut: string; mode_sortie: string; sortie_le: string }>(
      `SELECT statut, mode_sortie, sortie_le FROM sejour WHERE id = $1`, [sejour.id])
    expect(s!.statut).toBe("facture")
    expect(s!.mode_sortie).toBe("domicile")
    expect(s!.sortie_le).not.toBeNull()

    const m = await one<{ fin_le: string | null }>(
      `SELECT fin_le FROM mouvement WHERE sejour_id = $1`, [sejour.id])
    expect(m!.fin_le).not.toBeNull()
  })

  it("trace chaque étape dans un journal", async () => {
    const { sejour, acte } = await sejourAvecExamen()
    await enregistrerPrelevement(acte.id, "IDE Kane")
    await saisirResultat(acte.id, { valeur: "11" })
    await validerBiologiquement(acte.id, "Dr. Mbaye")
    await cloturerEtFacturer(sejour.id, "domicile")

    const actions = await query<{ action: string }>(`SELECT action FROM journal ORDER BY id`)
    const liste = actions.map((a) => a.action)
    for (const attendu of [
      "creation", "ouverture", "prelevement", "saisie",
      "validation_biologique", "emission",
    ]) {
      expect(liste).toContain(attendu)
    }
  })
})

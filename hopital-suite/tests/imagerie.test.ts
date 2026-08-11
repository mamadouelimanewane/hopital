/* ════════════════════════════════════════════════════════════════
   Le plateau d'imagerie, de la demande à la facture.

   Vérifie les trois spécificités qui le distinguent du laboratoire :
   la programmation, la dose tracée, et le produit de contraste
   facturé en ligne distincte.
   ════════════════════════════════════════════════════════════════ */
import { describe, it, expect, beforeEach } from "vitest"
import { baseDeTest, requete } from "./socle"
import { one, query } from "@/lib/db"
import { creerPatient, ajouterCouverture, ouvrirSejour } from "@/lib/admission"
import { compteurSejour, controlerCoherence, cloturerEtFacturer } from "@/lib/facturation"
import {
  demanderImagerie, programmer, realiser, interpreter,
  signerCompteRendu, examensImagerie, doseCumulee,
} from "@/lib/imagerie"
import { POST as postImagerie } from "@/app/api/socle/sejours/[id]/imagerie/route"
import type { Role } from "@/lib/auth"

beforeEach(async () => { await baseDeTest() })

const ctx = (id: number) => ({ params: Promise.resolve({ id: String(id) }) })
const img = (id: number, role: Role, body: Record<string, unknown>) =>
  postImagerie(requete("http://x/img", { role, body }), ctx(id))

async function sejourOuvert(taux = 0) {
  const p = await creerPatient({ nom: "Ba", prenom: "Ibrahima", dateNaissance: "1979-11-02", sexe: "M" })
  if (taux > 0) await ajouterCouverture(p.id, { regime: "ipm", taux })
  const s = await ouvrirSejour(p.id, { modeEntree: "urgences", triage: "orange", unite: "SAU" })
  return { patient: p, sejour: s }
}

describe("demande d'imagerie", () => {
  it("exige une indication clinique", async () => {
    const { sejour } = await sejourOuvert()
    await expect(
      demanderImagerie(sejour.id, { prescripteur: "Dr. Sall", codes: ["IMG-RXT"], indication: "  " }),
    ).rejects.toThrow(/indication/i)
  })

  it("refuse un examen absent du catalogue", async () => {
    const { sejour } = await sejourOuvert()
    await expect(
      demanderImagerie(sejour.id, {
        prescripteur: "Dr. Sall", codes: ["IMG-TELEPORT"], indication: "Douleur",
      }),
    ).rejects.toThrow(/catalogue/i)
  })

  it("refuse un examen de biologie sur ce circuit", async () => {
    const { sejour } = await sejourOuvert()
    await expect(
      demanderImagerie(sejour.id, {
        prescripteur: "Dr. Sall", codes: ["BIO-NFS"], indication: "Fièvre",
      }),
    ).rejects.toThrow(/catalogue/i)
  })

  it("crée un acte par examen demandé", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-RXT", "IMG-ECHO"], indication: "Douleur thoracique",
    })
    expect(actes.length).toBe(2)
    expect(actes.every((a) => a.statut === "prevu")).toBe(true)
  })
})

describe("réalisation et dose", () => {
  it("exige la dose pour un examen irradiant", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-RXT"], indication: "Toux",
    })
    await expect(
      realiser(actes[0].id, { manipulateur: "Moussa Dieng" }),
    ).rejects.toThrow(/dose/i)
  })

  it("n'exige pas de dose pour une échographie", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-ECHO"], indication: "Douleur abdominale",
    })
    const { acte } = await realiser(actes[0].id, { manipulateur: "Moussa Dieng" })
    expect(acte.statut).toBe("realise")
    expect(acte.dose_delivree).toBeNull()
  })

  it("enregistre la dose et la programmation", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-RXT"], indication: "Toux",
    })
    const p = await programmer(actes[0].id, "2026-08-12T09:30:00Z")
    expect(p.programme_le).not.toBeNull()

    const { acte } = await realiser(actes[0].id, { manipulateur: "Moussa Dieng", dose: 0.28 })
    expect(Number(acte.dose_delivree)).toBeCloseTo(0.28, 3)
    expect(acte.dose_unite).toBe("mGy")
  })

  it("cumule la dose sur toute la vie du patient, pas sur le séjour", async () => {
    const { patient, sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-RXT", "IMG-SCAN"], indication: "Bilan",
    })
    await realiser(actes[0].id, { manipulateur: "M. Dieng", dose: 0.3 })
    await realiser(actes[1].id, { manipulateur: "M. Dieng", dose: 7.5 })

    // Un second séjour, plus tard.
    await query(`UPDATE sejour SET statut = 'facture' WHERE id = $1`, [sejour.id])
    const s2 = await ouvrirSejour(patient.id, { modeEntree: "consultation_programmee", unite: "Radiologie" })
    const d2 = await demanderImagerie(s2.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-RXT"], indication: "Contrôle",
    })
    await realiser(d2.actes[0].id, { manipulateur: "M. Dieng", dose: 0.3 })

    const dose = await doseCumulee(patient.id)
    expect(dose.total).toBeCloseTo(8.1, 2)
    expect(dose.nbExamens).toBe(3)
  })

  it("refuse une réalisation en double", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-RXT"], indication: "Toux",
    })
    await realiser(actes[0].id, { manipulateur: "M. Dieng", dose: 0.3 })
    await expect(
      realiser(actes[0].id, { manipulateur: "M. Dieng", dose: 0.3 }),
    ).rejects.toThrow(/déjà réalisé/i)
  })
})

describe("compte rendu et facturation", () => {
  async function jusquAuCompteRendu(code = "IMG-RXT", taux = 0) {
    const { sejour } = await sejourOuvert(taux)
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: [code], indication: "Douleur thoracique",
    })
    await realiser(actes[0].id, { manipulateur: "M. Dieng", dose: 0.3 })
    return { sejour, acteId: actes[0].id }
  }

  it("ne facture rien avant la signature", async () => {
    const { sejour, acteId } = await jusquAuCompteRendu()
    expect((await compteurSejour(sejour.id)).total).toBe(0)

    await interpreter(acteId, { compteRendu: "Pas de foyer parenchymateux." })
    expect((await compteurSejour(sejour.id)).total).toBe(0)
  })

  it("facture à la signature du compte rendu", async () => {
    const { sejour, acteId } = await jusquAuCompteRendu()
    await interpreter(acteId, { compteRendu: "Pas de foyer.", conclusion: "Normal" })
    const { ligne } = await signerCompteRendu(acteId, "Dr. Cheikh Sy")

    expect(Number(ligne!.montant_total)).toBe(12000)
    expect((await compteurSejour(sejour.id)).total).toBe(12000)
  })

  it("refuse de signer sans compte rendu", async () => {
    const { acteId } = await jusquAuCompteRendu()
    await expect(signerCompteRendu(acteId, "Dr. Sy")).rejects.toThrow(/compte rendu/i)
  })

  it("refuse un compte rendu vide", async () => {
    const { acteId } = await jusquAuCompteRendu()
    await expect(interpreter(acteId, { compteRendu: "   " })).rejects.toThrow(/vide/i)
  })

  it("refuse un compte rendu avant réalisation", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-RXT"], indication: "Toux",
    })
    await expect(
      interpreter(actes[0].id, { compteRendu: "Normal" }),
    ).rejects.toThrow(/pas encore été réalisé/i)
  })

  it("facture le produit de contraste en ligne distincte", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-SCANI"], indication: "Bilan d'extension",
    })
    const { contraste } = await realiser(actes[0].id, { manipulateur: "M. Dieng", dose: 8.2 })
    expect(contraste).not.toBeNull()

    await interpreter(actes[0].id, { compteRendu: "Lésion hépatique." , anomalie: true })
    const { lignesContraste } = await signerCompteRendu(actes[0].id, "Dr. Sy")

    expect(lignesContraste.length).toBe(1)
    const c = await compteurSejour(sejour.id)
    expect(c.total).toBe(95000 + 18000)   // examen + contraste
    expect(c.nbLignes).toBe(2)
  })

  it("répartit selon la couverture, contraste compris", async () => {
    const { sejour } = await sejourOuvert(80)
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-SCANI"], indication: "Bilan",
    })
    await realiser(actes[0].id, { manipulateur: "M. Dieng", dose: 8.2 })
    await interpreter(actes[0].id, { compteRendu: "Normal." })
    await signerCompteRendu(actes[0].id, "Dr. Sy")

    const c = await compteurSejour(sejour.id)
    expect(c.total).toBe(113000)
    expect(c.partOrganisme).toBe(90400)
    expect(c.partPatient).toBe(22600)
  })

  it("laisse le séjour clôturable après signature", async () => {
    const { sejour, acteId } = await jusquAuCompteRendu()
    await interpreter(acteId, { compteRendu: "Normal." })
    await signerCompteRendu(acteId, "Dr. Sy")

    expect(await controlerCoherence(sejour.id)).toEqual([])
    const { facture } = await cloturerEtFacturer(sejour.id, "domicile")
    expect(Number(facture.total)).toBe(12000)
  })

  it("restitue l'état de chaque examen, contraste inclus", async () => {
    const { sejour } = await sejourOuvert()
    const { actes } = await demanderImagerie(sejour.id, {
      prescripteur: "Dr. Sall", codes: ["IMG-SCANI"], indication: "Bilan",
    })
    await realiser(actes[0].id, { manipulateur: "M. Dieng", dose: 8.2 })
    await interpreter(actes[0].id, { compteRendu: "Lésion.", conclusion: "À contrôler", anomalie: true })
    await signerCompteRendu(actes[0].id, "Dr. Sy")

    const vue = await examensImagerie(sejour.id)
    expect(vue.length).toBe(2)
    const scan = vue.find((v) => v.code_acte === "IMG-SCANI")!
    expect(scan.statut).toBe("valide")
    expect(scan.anomalie).toBe(true)
    expect(scan.conclusion).toBe("À contrôler")
    expect(Number(scan.dose_delivree)).toBeCloseTo(8.2, 2)
    const contr = vue.find((v) => v.code_acte === "PRD-CONTR")!
    expect(Number(contr.montant_total)).toBe(18000)
  })
})

describe("imagerie — rôles", () => {
  async function demandeExistante() {
    const { sejour } = await sejourOuvert()
    const r = await img(sejour.id, "medecin", {
      action: "demander", codes: ["IMG-RXT"], indication: "Douleur thoracique",
    })
    const corps = await r.json()
    return { sejourId: sejour.id, acteId: corps.actes[0].id }
  }

  it("le médecin demande, signé de son nom de session", async () => {
    const { sejour } = await sejourOuvert()
    const r = await img(sejour.id, "medecin", {
      action: "demander", codes: ["IMG-RXT"],
      indication: "Toux fébrile", prescripteur: "Dr. Usurpateur",
    })
    expect(r.status).toBe(201)
    expect((await r.json()).prescription.prescripteur).toBe("Dr. Oumar Sall")
  })

  const interdits: Array<[Role, string, Record<string, unknown>]> = [
    ["manipulateur", "demander", { action: "demander", codes: ["IMG-RXT"], indication: "x" }],
    ["radiologue", "réaliser", { action: "realiser", acteId: 1, dose: 1 }],
    ["manipulateur", "interpréter", { action: "interpreter", acteId: 1, compteRendu: "x" }],
    ["manipulateur", "signer", { action: "signer", acteId: 1 }],
    ["medecin", "signer", { action: "signer", acteId: 1 }],
    ["biologiste", "signer", { action: "signer", acteId: 1 }],
  ]
  for (const [role, geste, body] of interdits) {
    it(`interdit à ${role} de ${geste}`, async () => {
      const { sejourId } = await demandeExistante()
      const r = await img(sejourId, role, body)
      expect(r.status).toBe(403)
    })
  }

  it("déroule le circuit complet, chaque geste par son rôle", async () => {
    const { sejourId, acteId } = await demandeExistante()

    let r = await img(sejourId, "manipulateur", { action: "programmer", acteId })
    expect(r.status).toBe(200)

    r = await img(sejourId, "manipulateur", { action: "realiser", acteId, dose: 0.31 })
    expect(r.status).toBe(201)

    r = await img(sejourId, "radiologue", {
      action: "interpreter", acteId, compteRendu: "Pas de foyer.", conclusion: "Normal",
    })
    expect(r.status).toBe(201)

    r = await img(sejourId, "radiologue", { action: "signer", acteId })
    expect(r.status).toBe(200)
    expect((await compteurSejour(sejourId)).total).toBe(12000)
  })

  it("attribue la signature au radiologue connecté", async () => {
    const { sejourId, acteId } = await demandeExistante()
    await img(sejourId, "manipulateur", { action: "realiser", acteId, dose: 0.3 })
    await img(sejourId, "radiologue", { action: "interpreter", acteId, compteRendu: "Normal." })
    await img(sejourId, "radiologue", { action: "signer", acteId, radiologue: "Dr. Faux" })

    const acte = await one<{ valide_par: string }>(
      `SELECT valide_par FROM acte WHERE id = $1`, [acteId])
    expect(acte!.valide_par).toBe("Dr. Cheikh Sy")
  })

  it("refuse toute action sans session", async () => {
    const { sejourId } = await demandeExistante()
    const r = await postImagerie(
      new Request("http://x/img", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signer", acteId: 1 }),
      }) as never,
      ctx(sejourId),
    )
    expect(r.status).toBe(401)
  })
})

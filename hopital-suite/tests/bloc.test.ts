/* ════════════════════════════════════════════════════════════════
   Bloc opératoire.

   L'enjeu n'est pas la facturation mais les barrières : consentement,
   consultation d'anesthésie, et la liste de vérification en trois
   temps. Codées comme des vœux pieux elles ne serviraient à rien —
   ces tests vérifient qu'elles bloquent réellement.
   ════════════════════════════════════════════════════════════════ */
import { describe, it, expect, beforeEach } from "vitest"
import { baseDeTest, requete } from "./socle"
import { one, query } from "@/lib/db"
import { creerPatient, ajouterCouverture, ouvrirSejour } from "@/lib/admission"
import { compteurSejour } from "@/lib/facturation"
import {
  recueillirConsentement, consultationAnesthesie, programmerIntervention,
  validerVerification, induire, inciser, poserImplant, sortirDeSalle,
  interventionsDuSejour, porteursDuLot, heuresSalle, POINTS_ATTENDUS,
} from "@/lib/bloc"
import { POST as postBloc } from "@/app/api/socle/sejours/[id]/bloc/route"
import type { Role } from "@/lib/auth"

beforeEach(async () => { await baseDeTest() })

const ctx = (id: number) => ({ params: Promise.resolve({ id: String(id) }) })
const bloc = (id: number, role: Role, body: Record<string, unknown>) =>
  postBloc(requete("http://x/bloc", { role, body }), ctx(id))

/** Tous les points d'un temps, cochés. */
const tousCoches = (temps: keyof typeof POINTS_ATTENDUS) =>
  Object.fromEntries(POINTS_ATTENDUS[temps].map((p) => [p, true]))

async function sejourOuvert(taux = 0) {
  const p = await creerPatient({ nom: "Faye", prenom: "Abdou", dateNaissance: "1968-02-11", sexe: "M" })
  if (taux > 0) await ajouterCouverture(p.id, { regime: "ipm", taux })
  const s = await ouvrirSejour(p.id, {
    modeEntree: "hospitalisation_programmee", unite: "Chirurgie", categorie: "commune",
  })
  return { patient: p, sejour: s }
}

/** Séjour avec consentement et consultation d'anesthésie faits. */
async function preOperatoire() {
  const { patient, sejour } = await sejourOuvert()
  const consentement = await recueillirConsentement(sejour.id, {
    objet: "Cure de hernie inguinale", signePar: "Abdou Faye", recueilliPar: "Dr. Gueye",
  })
  const anesth = await consultationAnesthesie(sejour.id, "Dr. Coumba Faye")
  return { patient, sejour, consentement, anesth }
}

describe("barrières avant programmation", () => {
  it("refuse de programmer sans consentement", async () => {
    const { sejour } = await sejourOuvert()
    await consultationAnesthesie(sejour.id, "Dr. Faye")
    await expect(
      programmerIntervention(sejour.id, { codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye" }),
    ).rejects.toThrow(/consentement/i)
  })

  it("refuse de programmer sans consultation d'anesthésie", async () => {
    const { sejour } = await sejourOuvert()
    await recueillirConsentement(sejour.id, {
      objet: "Cure de hernie", signePar: "Abdou Faye", recueilliPar: "Dr. Gueye",
    })
    await expect(
      programmerIntervention(sejour.id, { codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye" }),
    ).rejects.toThrow(/anesthésie/i)
  })

  it("refuse un consentement révoqué", async () => {
    const { sejour, consentement } = await preOperatoire()
    await query(`UPDATE consentement SET revoque_le = now() WHERE id = $1`, [consentement.id])
    await expect(
      programmerIntervention(sejour.id, {
        codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye", consentementId: consentement.id,
      }),
    ).rejects.toThrow(/révoqué/i)
  })

  it("refuse un acte qui n'est pas chirurgical", async () => {
    const { sejour } = await preOperatoire()
    await expect(
      programmerIntervention(sejour.id, { codeActe: "BIO-NFS", chirurgien: "Dr. Gueye" }),
    ).rejects.toThrow(/catalogue/i)
  })

  it("programme quand les deux conditions sont réunies", async () => {
    const { sejour } = await preOperatoire()
    const i = await programmerIntervention(sejour.id, {
      codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye", anesthesiste: "Dr. Faye", salle: "Salle 2",
    })
    expect(i.statut).toBe("programmee")
    expect(i.salle).toBe("Salle 2")
  })

  it("facture la consultation d'anesthésie immédiatement", async () => {
    const { sejour } = await sejourOuvert()
    await consultationAnesthesie(sejour.id, "Dr. Faye")
    expect((await compteurSejour(sejour.id)).total).toBe(12000)
  })
})

describe("liste de vérification en trois temps", () => {
  async function programmee() {
    const { sejour } = await preOperatoire()
    const i = await programmerIntervention(sejour.id, {
      codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye", anesthesiste: "Dr. Faye",
    })
    return { sejour, intervention: i }
  }

  it("refuse une liste incomplète", async () => {
    const { intervention } = await programmee()
    await expect(
      validerVerification(intervention.id, "avant_induction", {
        identite_patient_confirmee: true,
        // les autres points manquent
      }, "IBODE Ba"),
    ).rejects.toThrow(/incomplète/i)
  })

  it("nomme les points manquants", async () => {
    const { intervention } = await programmee()
    await expect(
      validerVerification(intervention.id, "avant_induction", {}, "IBODE Ba"),
    ).rejects.toThrow(/allergies_connues/)
  })

  it("bloque l'induction tant que le premier temps n'est pas validé", async () => {
    const { intervention } = await programmee()
    await expect(induire(intervention.id)).rejects.toThrow(/avant_induction/)
  })

  it("bloque l'incision tant que le deuxième temps n'est pas validé", async () => {
    const { intervention } = await programmee()
    await validerVerification(intervention.id, "avant_induction", tousCoches("avant_induction"), "IBODE Ba")
    await induire(intervention.id)
    await expect(inciser(intervention.id)).rejects.toThrow(/avant_incision/)
  })

  it("bloque la sortie de salle tant que le troisième temps n'est pas validé", async () => {
    const { intervention } = await programmee()
    await validerVerification(intervention.id, "avant_induction", tousCoches("avant_induction"), "IBODE Ba")
    await induire(intervention.id)
    await validerVerification(intervention.id, "avant_incision", tousCoches("avant_incision"), "IBODE Ba")
    await inciser(intervention.id)
    await expect(
      sortirDeSalle(intervention.id, { compteRendu: "RAS", chirurgien: "Dr. Gueye" }),
    ).rejects.toThrow(/avant_sortie/)
  })

  it("impose l'ordre : pas d'incision sans induction", async () => {
    const { intervention } = await programmee()
    await validerVerification(intervention.id, "avant_incision", tousCoches("avant_incision"), "IBODE Ba")
    await expect(inciser(intervention.id)).rejects.toThrow(/induction/i)
  })
})

describe("implants", () => {
  async function enCours() {
    const { sejour } = await preOperatoire()
    const i = await programmerIntervention(sejour.id, {
      codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye", anesthesiste: "Dr. Faye",
    })
    await validerVerification(i.id, "avant_induction", tousCoches("avant_induction"), "IBODE Ba")
    await induire(i.id)
    await validerVerification(i.id, "avant_incision", tousCoches("avant_incision"), "IBODE Ba")
    await inciser(i.id)
    return { sejour, intervention: i }
  }

  it("exige le numéro de lot", async () => {
    const { intervention } = await enCours()
    await expect(
      poserImplant(intervention.id, { code: "DMI-FILET", numeroLot: "  " }),
    ).rejects.toThrow(/numéro de lot/i)
  })

  it("refuse la pose hors intervention en cours", async () => {
    const { sejour } = await preOperatoire()
    const i = await programmerIntervention(sejour.id, {
      codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye",
    })
    await expect(
      poserImplant(i.id, { code: "DMI-FILET", numeroLot: "LOT-1" }),
    ).rejects.toThrow(/au cours de l'intervention/i)
  })

  it("retrouve les porteurs d'un lot — rappel de dispositif", async () => {
    const { intervention } = await enCours()
    await poserImplant(intervention.id, { code: "DMI-FILET", numeroLot: "LOT-2026-0042" })

    const porteurs = await porteursDuLot("LOT-2026-0042")
    expect(porteurs.length).toBe(1)
    expect(porteurs[0].nom).toBe("Faye")
    expect(porteurs[0].ipp).toMatch(/^IPP-/)
  })
})

describe("sortie de salle et facturation composite", () => {
  async function jusquAuBout(taux = 0, avecImplant = false) {
    const p = await creerPatient({ nom: "Faye", prenom: "Abdou", dateNaissance: "1968-02-11" })
    if (taux > 0) await ajouterCouverture(p.id, { regime: "ipm", taux })
    const s = await ouvrirSejour(p.id, {
      modeEntree: "hospitalisation_programmee", unite: "Chirurgie", categorie: "commune",
    })
    await recueillirConsentement(s.id, {
      objet: "Cure de hernie", signePar: "Abdou Faye", recueilliPar: "Dr. Gueye",
    })
    await consultationAnesthesie(s.id, "Dr. Faye")
    const i = await programmerIntervention(s.id, {
      codeActe: "CHIR-HERN", chirurgien: "Dr. Gueye", anesthesiste: "Dr. Faye",
    })
    await validerVerification(i.id, "avant_induction", tousCoches("avant_induction"), "IBODE Ba")
    await induire(i.id)
    await validerVerification(i.id, "avant_incision", tousCoches("avant_incision"), "IBODE Ba")
    await inciser(i.id)
    if (avecImplant) {
      await poserImplant(i.id, { code: "DMI-FILET", numeroLot: "LOT-77", quantite: 1 })
    }
    await validerVerification(i.id, "avant_sortie", tousCoches("avant_sortie"), "IBODE Ba")
    return { sejour: s, intervention: i }
  }

  it("exige le compte rendu opératoire", async () => {
    const { intervention } = await jusquAuBout()
    await expect(
      sortirDeSalle(intervention.id, { compteRendu: "   ", chirurgien: "Dr. Gueye" }),
    ).rejects.toThrow(/compte rendu/i)
  })

  it("facture l'acte, l'anesthésie, la salle et la surveillance", async () => {
    const { sejour, intervention } = await jusquAuBout()
    const r = await sortirDeSalle(intervention.id, {
      compteRendu: "Cure par voie ouverte, suites simples.", chirurgien: "Dr. Gueye",
    })

    const codes = r.lignes.map((l) => l.code).sort()
    expect(codes).toEqual(["ANEST-GEN", "ANEST-SSPI", "BLOC-SALLE", "CHIR-HERN"])

    // 120 000 + 60 000 + 40 000 (1 h entamée) + 18 000, plus la
    // consultation d'anesthésie déjà facturée.
    expect(r.total).toBe(238000)
    expect((await compteurSejour(sejour.id)).total).toBe(238000 + 12000)
  })

  it("ajoute une ligne par implant posé", async () => {
    const { sejour, intervention } = await jusquAuBout(0, true)
    const r = await sortirDeSalle(intervention.id, {
      compteRendu: "Pose de filet.", chirurgien: "Dr. Gueye",
    })
    expect(r.lignes.some((l) => l.code === "DMI-FILET")).toBe(true)
    expect((await compteurSejour(sejour.id)).total).toBe(238000 + 65000 + 12000)

    // Le lot reste rattaché à l'acte facturé.
    const im = await one<{ acte_id: number | null }>(
      `SELECT acte_id FROM implant WHERE numero_lot = 'LOT-77'`)
    expect(im!.acte_id).not.toBeNull()
  })

  it("répartit selon la couverture", async () => {
    const { sejour, intervention } = await jusquAuBout(80)
    await sortirDeSalle(intervention.id, { compteRendu: "RAS.", chirurgien: "Dr. Gueye" })
    const c = await compteurSejour(sejour.id)
    expect(c.partOrganisme).toBe(Math.round(c.total * 0.8 * 100) / 100)
  })

  it("interdit une seconde sortie de salle", async () => {
    const { intervention } = await jusquAuBout()
    await sortirDeSalle(intervention.id, { compteRendu: "RAS.", chirurgien: "Dr. Gueye" })
    await expect(
      sortirDeSalle(intervention.id, { compteRendu: "RAS.", chirurgien: "Dr. Gueye" }),
    ).rejects.toThrow(/pas en cours/i)
  })

  it("restitue l'état des interventions du séjour", async () => {
    const { sejour, intervention } = await jusquAuBout(0, true)
    await sortirDeSalle(intervention.id, { compteRendu: "RAS.", chirurgien: "Dr. Gueye" })

    const liste = await interventionsDuSejour(sejour.id)
    expect(liste.length).toBe(1)
    expect(liste[0].statut).toBe("facturee")
    expect(Number(liste[0].verifications)).toBe(3)
    expect(Number(liste[0].implants)).toBe(1)
  })
})

describe("occupation de salle", () => {
  it("facture toute heure entamée", () => {
    const t = (h: number, m = 0) => new Date(2026, 2, 10, h, m)
    expect(heuresSalle(t(8), t(8, 30))).toBe(1)
    expect(heuresSalle(t(8), t(9))).toBe(1)
    expect(heuresSalle(t(8), t(9, 1))).toBe(2)
    expect(heuresSalle(t(8), t(11, 30))).toBe(4)
  })

  it("ne descend jamais sous une heure", () => {
    const t = (h: number) => new Date(2026, 2, 10, h)
    expect(heuresSalle(t(10), t(10))).toBe(1)
    expect(heuresSalle(t(11), t(10))).toBe(1)
  })
})

describe("bloc — rôles", () => {
  async function programmeeParApi() {
    const { sejour } = await sejourOuvert()
    await bloc(sejour.id, "chirurgien", {
      action: "consentement", objet: "Cure de hernie", signePar: "Abdou Faye",
    })
    await bloc(sejour.id, "anesthesiste", { action: "anesthesie" })
    const r = await bloc(sejour.id, "chirurgien", {
      action: "programmer", codeActe: "CHIR-HERN", salle: "Salle 1",
    })
    const corps = await r.json()
    return { sejourId: sejour.id, interventionId: corps.id }
  }

  const interdits: Array<[Role, string, (c: { interventionId: number }) => Record<string, unknown>]> = [
    ["infirmier", "programmer", () => ({ action: "programmer", codeActe: "CHIR-HERN" })],
    ["anesthesiste", "programmer", () => ({ action: "programmer", codeActe: "CHIR-HERN" })],
    ["chirurgien", "induire", (c) => ({ action: "induire", interventionId: c.interventionId })],
    ["anesthesiste", "inciser", (c) => ({ action: "inciser", interventionId: c.interventionId })],
    ["bloc", "poser un implant", (c) => ({ action: "implant", interventionId: c.interventionId, code: "DMI-FILET", numeroLot: "L1" })],
    ["anesthesiste", "sortir de salle", (c) => ({ action: "sortie", interventionId: c.interventionId, compteRendu: "x" })],
    ["chirurgien", "faire la consultation d'anesthésie", () => ({ action: "anesthesie" })],
  ]
  for (const [role, geste, corps] of interdits) {
    it(`interdit à ${role} de ${geste}`, async () => {
      const c = await programmeeParApi()
      const r = await bloc(c.sejourId, role, corps(c))
      expect(r.status).toBe(403)
    })
  }

  it("laisse l'IBODE valider la liste de vérification", async () => {
    const { sejourId, interventionId } = await programmeeParApi()
    const r = await bloc(sejourId, "bloc", {
      action: "verifier", interventionId, temps: "avant_induction",
      points: tousCoches("avant_induction"),
    })
    expect(r.status).toBe(200)
  })

  it("déroule l'intervention complète, chaque geste par son rôle", async () => {
    const { sejourId, interventionId } = await programmeeParApi()

    await bloc(sejourId, "bloc", {
      action: "verifier", interventionId, temps: "avant_induction",
      points: tousCoches("avant_induction"),
    })
    let r = await bloc(sejourId, "anesthesiste", { action: "induire", interventionId })
    expect(r.status).toBe(200)

    await bloc(sejourId, "bloc", {
      action: "verifier", interventionId, temps: "avant_incision",
      points: tousCoches("avant_incision"),
    })
    r = await bloc(sejourId, "chirurgien", { action: "inciser", interventionId })
    expect(r.status).toBe(200)

    r = await bloc(sejourId, "chirurgien", {
      action: "implant", interventionId, code: "DMI-FILET", numeroLot: "LOT-API-1",
    })
    expect(r.status).toBe(201)

    await bloc(sejourId, "bloc", {
      action: "verifier", interventionId, temps: "avant_sortie",
      points: tousCoches("avant_sortie"),
    })
    r = await bloc(sejourId, "chirurgien", {
      action: "sortie", interventionId, compteRendu: "Suites simples.",
    })
    expect(r.status).toBe(200)
    expect((await compteurSejour(sejourId)).total).toBe(238000 + 65000 + 12000)
  })

  it("attribue le consentement au praticien connecté", async () => {
    const { sejourId } = await programmeeParApi()
    await bloc(sejourId, "chirurgien", {
      action: "consentement", objet: "Second acte",
      signePar: "Abdou Faye", recueilliPar: "Dr. Imposteur",
    })
    const c = await one<{ recueilli_par: string }>(
      `SELECT recueilli_par FROM consentement WHERE objet = 'Second acte'`)
    expect(c!.recueilli_par).toBe("Dr. Papa Gueye")
  })

  it("refuse toute action sans session", async () => {
    const { sejourId } = await programmeeParApi()
    const r = await postBloc(
      new Request("http://x/bloc", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "induire", interventionId: 1 }),
      }) as never,
      ctx(sejourId),
    )
    expect(r.status).toBe(401)
  })
})

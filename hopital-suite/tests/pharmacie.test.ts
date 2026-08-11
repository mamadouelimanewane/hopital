/* ════════════════════════════════════════════════════════════════
   Le circuit du médicament.

   Ce qui le distingue des deux autres plateaux : une ligne de
   prescription engendre plusieurs administrations, donc plusieurs
   lignes de facture ; et le stock est une contrainte réelle.
   ════════════════════════════════════════════════════════════════ */
import { describe, it, expect, beforeEach } from "vitest"
import { baseDeTest, requete } from "./socle"
import { one, query } from "@/lib/db"
import { creerPatient, ajouterCouverture, ouvrirSejour } from "@/lib/admission"
import { compteurSejour, cloturerEtFacturer } from "@/lib/facturation"
import {
  prescrireMedicaments, analyserPrescription, dispenser, administrer,
  retourner, arreter, traitementDuSejour, stockEnAlerte,
} from "@/lib/pharmacie"
import { POST as postPharma } from "@/app/api/socle/sejours/[id]/pharmacie/route"
import type { Role } from "@/lib/auth"

beforeEach(async () => { await baseDeTest() })

const ctx = (id: number) => ({ params: Promise.resolve({ id: String(id) }) })
const pharma = (id: number, role: Role, body: Record<string, unknown>) =>
  postPharma(requete("http://x/pharma", { role, body }), ctx(id))

const stockDe = async (code: string) =>
  Number((await one<{ quantite: string }>(
    `SELECT quantite FROM stock WHERE code_acte = $1`, [code]))!.quantite)

async function sejourOuvert(taux = 0) {
  const p = await creerPatient({ nom: "Sarr", prenom: "Ndeye", dateNaissance: "1995-06-20", sexe: "F" })
  if (taux > 0) await ajouterCouverture(p.id, { regime: "cmu", taux })
  const s = await ouvrirSejour(p.id, { modeEntree: "urgences", triage: "jaune", unite: "SAU" })
  return { patient: p, sejour: s }
}

/** Prescrit du paracétamol : 3 prises par jour pendant 2 jours = 6. */
async function prescrire(sejourId: number, over: Record<string, unknown> = {}) {
  return prescrireMedicaments(sejourId, {
    prescripteur: "Dr. Sall",
    lignes: [{ code: "MED-PARA", dose: 1000, uniteDose: "mg", voie: "orale", prisesParJour: 3, dureeJours: 2 }],
    indication: "Fièvre",
    ...over,
  })
}

describe("prescription médicamenteuse", () => {
  it("enregistre la posologie complète", async () => {
    const { sejour } = await sejourOuvert()
    const { lignes } = await prescrire(sejour.id)
    expect(lignes.length).toBe(1)
    expect(Number(lignes[0].dose)).toBe(1000)
    expect(lignes[0].voie).toBe("orale")
    expect(lignes[0].prises_par_jour * lignes[0].duree_jours).toBe(6)
  })

  it("refuse un médicament hors livret", async () => {
    const { sejour } = await sejourOuvert()
    await expect(
      prescrireMedicaments(sejour.id, {
        prescripteur: "Dr. Sall",
        lignes: [{ code: "MED-INEXISTANT", dose: 1 }],
      }),
    ).rejects.toThrow(/livret/i)
  })

  it("refuse un examen de biologie comme médicament", async () => {
    const { sejour } = await sejourOuvert()
    await expect(
      prescrireMedicaments(sejour.id, {
        prescripteur: "Dr. Sall", lignes: [{ code: "BIO-NFS", dose: 1 }],
      }),
    ).rejects.toThrow(/livret/i)
  })

  it("refuse une dose nulle", async () => {
    const { sejour } = await sejourOuvert()
    await expect(
      prescrireMedicaments(sejour.id, {
        prescripteur: "Dr. Sall", lignes: [{ code: "MED-PARA", dose: 0 }],
      }),
    ).rejects.toThrow(/dose/i)
  })
})

describe("analyse pharmaceutique", () => {
  it("bloque la dispensation tant qu'elle n'a pas eu lieu", async () => {
    const { sejour } = await sejourOuvert()
    const { lignes } = await prescrire(sejour.id)
    await expect(dispenser(lignes[0].id, 6)).rejects.toThrow(/analyse pharmaceutique requise/i)
  })

  it("exige un motif pour une réserve ou un refus", async () => {
    const { sejour } = await sejourOuvert()
    const { prescription } = await prescrire(sejour.id)
    await expect(
      analyserPrescription(prescription.id, { avis: "refuse", pharmacien: "Dr. Diagne" }),
    ).rejects.toThrow(/motiv/i)
  })

  it("un refus arrête les lignes et interdit la dispensation", async () => {
    const { sejour } = await sejourOuvert()
    const { prescription, lignes } = await prescrire(sejour.id)
    await analyserPrescription(prescription.id, {
      avis: "refuse", motif: "Allergie documentée", pharmacien: "Dr. Diagne",
    })

    const l = await one<{ statut: string }>(
      `SELECT statut FROM ligne_prescription WHERE id = $1`, [lignes[0].id])
    expect(l!.statut).toBe("arretee")
    await expect(dispenser(lignes[0].id, 6)).rejects.toThrow(/refusée/i)
  })

  it("une réserve motivée laisse dispenser", async () => {
    const { sejour } = await sejourOuvert()
    const { prescription, lignes } = await prescrire(sejour.id)
    await analyserPrescription(prescription.id, {
      avis: "reserve", motif: "Surveiller la fonction rénale", pharmacien: "Dr. Diagne",
    })
    const maj = await dispenser(lignes[0].id, 6)
    expect(Number(maj.dispense)).toBe(6)
  })

  it("ne s'applique pas à une prescription de biologie", async () => {
    const { sejour } = await sejourOuvert()
    const p = await one<{ id: number }>(
      `INSERT INTO prescription (sejour_id, type, prescripteur)
       VALUES ($1,'biologie','Dr. Sall') RETURNING id`, [sejour.id])
    await expect(
      analyserPrescription(p!.id, { avis: "favorable", pharmacien: "Dr. Diagne" }),
    ).rejects.toThrow(/médicamenteuse/i)
  })
})

describe("dispensation et stock", () => {
  async function prescriptionVisee() {
    const { sejour } = await sejourOuvert()
    const { prescription, lignes } = await prescrire(sejour.id)
    await analyserPrescription(prescription.id, { avis: "favorable", pharmacien: "Dr. Diagne" })
    return { sejour, prescription, ligne: lignes[0] }
  }

  it("décrémente le stock et trace le mouvement", async () => {
    const avant = await stockDe("MED-PARA")
    const { ligne } = await prescriptionVisee()
    await dispenser(ligne.id, 6)

    expect(await stockDe("MED-PARA")).toBe(avant - 6)
    const mvt = await query<{ sens: string; quantite: string; motif: string }>(
      `SELECT sens, quantite, motif FROM mouvement_stock WHERE code_acte = 'MED-PARA'`)
    expect(mvt.length).toBe(1)
    expect(mvt[0].sens).toBe("sortie")
    expect(Number(mvt[0].quantite)).toBe(6)
  })

  it("refuse de dispenser plus que le prescrit", async () => {
    const { ligne } = await prescriptionVisee()
    await expect(dispenser(ligne.id, 7)).rejects.toThrow(/supérieure au prescrit/i)
  })

  it("refuse de dispenser au-delà du stock disponible", async () => {
    const { sejour } = await sejourOuvert()
    // La morphine n'est qu'à 40 unités.
    const { prescription, lignes } = await prescrireMedicaments(sejour.id, {
      prescripteur: "Dr. Sall",
      lignes: [{ code: "MED-MORPH", dose: 10, prisesParJour: 6, dureeJours: 10 }],
    })
    await analyserPrescription(prescription.id, { avis: "favorable", pharmacien: "Dr. Diagne" })

    await expect(dispenser(lignes[0].id, 50)).rejects.toThrow(/stock insuffisant/i)
    expect(await stockDe("MED-MORPH")).toBe(40)   // rien n'a bougé
  })

  it("ne facture rien à la dispensation", async () => {
    const { sejour, ligne } = await prescriptionVisee()
    await dispenser(ligne.id, 6)
    expect((await compteurSejour(sejour.id)).total).toBe(0)
  })

  it("signale les articles sous le seuil d'alerte", async () => {
    await query(`UPDATE stock SET quantite = 5 WHERE code_acte = 'MED-MORPH'`)
    const alertes = await stockEnAlerte()
    expect(alertes.some((a) => a.code_acte === "MED-MORPH")).toBe(true)
  })
})

describe("administration — le geste qui facture", () => {
  async function prete(taux = 0) {
    const { sejour } = await sejourOuvert(taux)
    const { prescription, lignes } = await prescrire(sejour.id)
    await analyserPrescription(prescription.id, { avis: "favorable", pharmacien: "Dr. Diagne" })
    await dispenser(lignes[0].id, 6)
    return { sejour, ligne: lignes[0] }
  }

  it("facture chaque prise administrée", async () => {
    const { sejour, ligne } = await prete()
    await administrer(ligne.id, { soignant: "IDE Kane" })
    let c = await compteurSejour(sejour.id)
    expect(c.total).toBe(300)
    expect(c.nbLignes).toBe(1)

    await administrer(ligne.id, { soignant: "IDE Kane" })
    await administrer(ligne.id, { soignant: "IDE Kane" })
    c = await compteurSejour(sejour.id)
    expect(c.total).toBe(900)
    expect(c.nbLignes).toBe(3)   // trois prises, trois lignes
  })

  it("répartit selon la couverture", async () => {
    const { sejour, ligne } = await prete(80)
    await administrer(ligne.id, { soignant: "IDE Kane" })
    const c = await compteurSejour(sejour.id)
    expect(c.partOrganisme).toBe(240)
    expect(c.partPatient).toBe(60)
  })

  it("refuse d'administrer ce qui n'a pas été dispensé", async () => {
    const { sejour } = await sejourOuvert()
    const { prescription, lignes } = await prescrire(sejour.id)
    await analyserPrescription(prescription.id, { avis: "favorable", pharmacien: "Dr. Diagne" })
    await expect(
      administrer(lignes[0].id, { soignant: "IDE Kane" }),
    ).rejects.toThrow(/rien à administrer/i)
  })

  it("refuse d'administrer plus que dispensé", async () => {
    const { sejour } = await sejourOuvert()
    const { prescription, lignes } = await prescrire(sejour.id)
    await analyserPrescription(prescription.id, { avis: "favorable", pharmacien: "Dr. Diagne" })
    await dispenser(lignes[0].id, 2)
    await expect(
      administrer(lignes[0].id, { soignant: "IDE Kane", quantite: 3 }),
    ).rejects.toThrow(/rien à administrer/i)
  })

  it("termine la ligne quand toutes les prises sont données", async () => {
    const { ligne } = await prete()
    let etat
    for (let i = 0; i < 6; i++) {
      etat = await administrer(ligne.id, { soignant: "IDE Kane" })
    }
    expect(etat!.ligne.statut).toBe("terminee")
    await expect(
      administrer(ligne.id, { soignant: "IDE Kane" }),
    ).rejects.toThrow(/terminee|impossible/i)
  })

  it("laisse le séjour clôturable", async () => {
    const { sejour, ligne } = await prete()
    await administrer(ligne.id, { soignant: "IDE Kane" })
    const { facture } = await cloturerEtFacturer(sejour.id, "domicile", { forcer: true })
    expect(Number(facture.total)).toBe(300)
  })
})

describe("retours et arrêts", () => {
  async function dispensee() {
    const { sejour } = await sejourOuvert()
    const { prescription, lignes } = await prescrire(sejour.id)
    await analyserPrescription(prescription.id, { avis: "favorable", pharmacien: "Dr. Diagne" })
    await dispenser(lignes[0].id, 6)
    return { sejour, ligne: lignes[0] }
  }

  it("recrédite le stock sans rien facturer", async () => {
    const avant = await stockDe("MED-PARA")
    const { sejour, ligne } = await dispensee()
    expect(await stockDe("MED-PARA")).toBe(avant - 6)

    await administrer(ligne.id, { soignant: "IDE Kane" })     // 1 prise donnée
    await retourner(ligne.id, 5, "sortie du patient")

    expect(await stockDe("MED-PARA")).toBe(avant - 1)          // seule la prise donnée manque
    const c = await compteurSejour(sejour.id)
    expect(c.total).toBe(300)                                  // une seule prise facturée
    expect(c.nbLignes).toBe(1)
  })

  it("refuse de retourner plus que le non administré", async () => {
    const { ligne } = await dispensee()
    await administrer(ligne.id, { soignant: "IDE Kane" })
    await expect(retourner(ligne.id, 6, "erreur")).rejects.toThrow(/supérieur au disponible/i)
  })

  it("exige un motif de retour", async () => {
    const { ligne } = await dispensee()
    await expect(retourner(ligne.id, 1, "  ")).rejects.toThrow(/motiv/i)
  })

  it("arrête un traitement en cours", async () => {
    const { ligne } = await dispensee()
    await arreter(ligne.id, "Effet indésirable")
    await expect(
      administrer(ligne.id, { soignant: "IDE Kane" }),
    ).rejects.toThrow(/arretee/i)
  })

  it("restitue le traitement du séjour avec le montant facturé", async () => {
    const { sejour, ligne } = await dispensee()
    await administrer(ligne.id, { soignant: "IDE Kane" })
    await administrer(ligne.id, { soignant: "IDE Kane" })

    const t = await traitementDuSejour(sejour.id)
    expect(t.length).toBe(1)
    expect(t[0].code_acte).toBe("MED-PARA")
    expect(Number(t[0].dispense)).toBe(6)
    expect(Number(t[0].administre)).toBe(2)
    expect(t[0].avis).toBe("favorable")
    expect(Number(t[0].montant_facture)).toBe(600)
  })
})

describe("pharmacie — rôles", () => {
  async function prescriptionExistante() {
    const { sejour } = await sejourOuvert()
    const r = await pharma(sejour.id, "medecin", {
      action: "prescrire",
      lignes: [{ code: "MED-AMOX", dose: 1000, prisesParJour: 2, dureeJours: 3 }],
      indication: "Infection",
    })
    const corps = await r.json()
    return { sejourId: sejour.id, prescriptionId: corps.prescription.id, ligneId: corps.lignes[0].id }
  }

  it("le médecin prescrit, signé de son nom de session", async () => {
    const { sejour } = await sejourOuvert()
    const r = await pharma(sejour.id, "medecin", {
      action: "prescrire",
      lignes: [{ code: "MED-PARA", dose: 1000 }],
      prescripteur: "Dr. Usurpateur",
    })
    expect(r.status).toBe(201)
    expect((await r.json()).prescription.prescripteur).toBe("Dr. Oumar Sall")
  })

  const interdits: Array<[Role, string, (c: { prescriptionId: number; ligneId: number }) => Record<string, unknown>]> = [
    ["pharmacien", "prescrire", () => ({ action: "prescrire", lignes: [{ code: "MED-PARA", dose: 1 }] })],
    ["infirmier", "analyser", (c) => ({ action: "analyser", prescriptionId: c.prescriptionId, avis: "favorable" })],
    ["medecin", "analyser", (c) => ({ action: "analyser", prescriptionId: c.prescriptionId, avis: "favorable" })],
    ["infirmier", "dispenser", (c) => ({ action: "dispenser", ligneId: c.ligneId, quantite: 1 })],
    ["pharmacien", "administrer", (c) => ({ action: "administrer", ligneId: c.ligneId })],
    ["medecin", "administrer", (c) => ({ action: "administrer", ligneId: c.ligneId })],
  ]
  for (const [role, geste, corps] of interdits) {
    it(`interdit à ${role} de ${geste}`, async () => {
      const c = await prescriptionExistante()
      const r = await pharma(c.sejourId, role, corps(c))
      expect(r.status).toBe(403)
    })
  }

  it("déroule le circuit complet, chaque geste par son rôle", async () => {
    const { sejourId, prescriptionId, ligneId } = await prescriptionExistante()

    let r = await pharma(sejourId, "pharmacien", {
      action: "analyser", prescriptionId, avis: "favorable",
    })
    expect(r.status).toBe(200)

    r = await pharma(sejourId, "pharmacien", { action: "dispenser", ligneId, quantite: 6 })
    expect(r.status).toBe(200)
    expect((await compteurSejour(sejourId)).total).toBe(0)

    r = await pharma(sejourId, "infirmier", { action: "administrer", ligneId })
    expect(r.status).toBe(201)
    expect((await compteurSejour(sejourId)).total).toBe(900)   // amoxicilline
  })

  it("attribue l'administration au soignant connecté", async () => {
    const { sejourId, prescriptionId, ligneId } = await prescriptionExistante()
    await pharma(sejourId, "pharmacien", { action: "analyser", prescriptionId, avis: "favorable" })
    await pharma(sejourId, "pharmacien", { action: "dispenser", ligneId, quantite: 1 })
    await pharma(sejourId, "infirmier", { action: "administrer", ligneId, soignant: "IDE Faux" })

    const acte = await one<{ executant: string }>(
      `SELECT executant FROM acte WHERE code_acte = 'MED-AMOX'`)
    expect(acte!.executant).toBe("IDE Aïda Kane")
  })

  it("refuse toute action sans session", async () => {
    const { sejourId } = await prescriptionExistante()
    const r = await postPharma(
      new Request("http://x/pharma", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "administrer", ligneId: 1 }),
      }) as never,
      ctx(sejourId),
    )
    expect(r.status).toBe(401)
  })
})

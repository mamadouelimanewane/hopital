/* ════════════════════════════════════════════════════════════════
   Recouvrement — de la facture émise à l'argent encaissé.

   L'enjeu : ne jamais confondre la part patient et la part
   organisme. Ce sont deux circuits, deux calendriers, et l'un des
   deux comporte des rejets.
   ════════════════════════════════════════════════════════════════ */
import { describe, it, expect, beforeEach } from "vitest"
import { baseDeTest, requete } from "./socle"
import { query, one } from "@/lib/db"
import { creerPatient, ajouterCouverture, ouvrirSejour } from "@/lib/admission"
import { cloturerEtFacturer } from "@/lib/facturation"
import {
  prescrireBiologie, enregistrerPrelevement, saisirResultat, validerBiologiquement,
} from "@/lib/laboratoire"
import {
  etatFacture, encaisser, constituerBordereau, envoyerBordereau,
  enregistrerRetour, relancer, creancesEnCours, rejetsARetraiter,
  indicateurs, recetteParFamille,
} from "@/lib/recouvrement"
import { GET as getRecouvrement, POST as postRecouvrement } from "@/app/api/socle/recouvrement/route"
import type { Role } from "@/lib/auth"

beforeEach(async () => { await baseDeTest() })

const rec = (role: Role, body: Record<string, unknown>) =>
  postRecouvrement(requete("http://x/rec", { role, body }))

/**
 * Séjour facturé : une NFS à 5 000 F, couverture à 80 %.
 * Reste patient 1 000, part organisme 4 000.
 */
async function factureSimple(taux = 80, organisme = "IPM Touba", nom = "Ndiaye") {
  const p = await creerPatient({ nom, prenom: "Fatou", dateNaissance: "1988-04-12" })
  if (taux > 0) await ajouterCouverture(p.id, { regime: "ipm", organisme, taux })
  const s = await ouvrirSejour(p.id, { modeEntree: "urgences", triage: "vert", unite: "SAU" })
  const { actes } = await prescrireBiologie(s.id, { prescripteur: "Dr. Sall", codes: ["BIO-NFS"] })
  await enregistrerPrelevement(actes[0].id, "IDE Kane")
  await saisirResultat(actes[0].id, { valeur: "11" })
  await validerBiologiquement(actes[0].id, "Dr. Mbaye")
  const { facture } = await cloturerEtFacturer(s.id, "domicile")
  return { patient: p, sejour: s, factureId: facture.id, numero: facture.numero }
}

describe("état d'une facture", () => {
  it("sépare la part patient de la part organisme", async () => {
    const { factureId } = await factureSimple()
    const e = await etatFacture(factureId)
    expect(e.total).toBe(5000)
    expect(e.totalOrganisme).toBe(4000)
    expect(e.totalPatient).toBe(1000)
    expect(e.restePatient).toBe(1000)
    expect(e.resteOrganisme).toBe(4000)
  })
})

describe("encaissement au guichet", () => {
  it("enregistre un règlement et met la facture à jour", async () => {
    const { factureId } = await factureSimple()
    const r = await encaisser(factureId, { montant: 1000, moyen: "mobile_money" })
    expect(r.statut).toBe("partiellement_reglee")   // l'organisme n'a pas encore payé
    expect(r.etat.restePatient).toBe(0)
    expect(r.etat.resteOrganisme).toBe(4000)
  })

  it("refuse un montant supérieur au reste à charge", async () => {
    const { factureId } = await factureSimple()
    await expect(
      encaisser(factureId, { montant: 5000, moyen: "especes" }),
    ).rejects.toThrow(/supérieur au reste à charge/i)
  })

  it("refuse un encaissement sur une part patient déjà soldée", async () => {
    const { factureId } = await factureSimple()
    await encaisser(factureId, { montant: 1000, moyen: "especes" })
    await expect(
      encaisser(factureId, { montant: 100, moyen: "especes" }),
    ).rejects.toThrow(/plus de reste à charge/i)
  })

  it("accepte un règlement en plusieurs fois", async () => {
    const { factureId } = await factureSimple()
    await encaisser(factureId, { montant: 400, moyen: "especes" })
    await encaisser(factureId, { montant: 600, moyen: "mobile_money" })
    expect((await etatFacture(factureId)).restePatient).toBe(0)
  })

  it("refuse un montant nul ou négatif", async () => {
    const { factureId } = await factureSimple()
    await expect(encaisser(factureId, { montant: 0, moyen: "especes" }))
      .rejects.toThrow(/positif/i)
  })
})

describe("bordereaux de tiers payant", () => {
  it("regroupe les factures d'un organisme", async () => {
    await factureSimple(80, "IPM Touba", "Ndiaye")
    await factureSimple(80, "IPM Touba", "Diop")
    const b = await constituerBordereau("IPM Touba")
    expect(b.nbFactures).toBe(2)
    expect(Number(b.montant_reclame)).toBe(8000)
    expect(b.numero).toMatch(/^B-\d{4}-\d{5}$/)
  })

  it("n'inclut pas les factures d'un autre organisme", async () => {
    await factureSimple(80, "IPM Touba", "Ndiaye")
    await factureSimple(80, "Mutuelle Mbacké", "Diop")
    const b = await constituerBordereau("IPM Touba")
    expect(b.nbFactures).toBe(1)
  })

  it("refuse un organisme sans facture à réclamer", async () => {
    await expect(constituerBordereau("Organisme fantôme"))
      .rejects.toThrow(/aucune facture/i)
  })

  it("ne place jamais une facture sur deux bordereaux vivants", async () => {
    await factureSimple(80, "IPM Touba")
    await constituerBordereau("IPM Touba")
    await expect(constituerBordereau("IPM Touba")).rejects.toThrow(/aucune facture/i)
  })

  it("exige l'envoi avant d'enregistrer un retour", async () => {
    const { factureId } = await factureSimple()
    const b = await constituerBordereau("IPM Touba")
    await expect(
      enregistrerRetour(b.id, [{ factureId, montantRegle: 4000 }]),
    ).rejects.toThrow(/n'a pas été envoyé/i)
  })

  it("encaisse la part organisme au retour", async () => {
    const { factureId } = await factureSimple()
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)

    const r = await enregistrerRetour(b.id, [{ factureId, montantRegle: 4000 }])
    expect(r.totalRegle).toBe(4000)
    expect(r.statut).toBe("solde")

    const e = await etatFacture(factureId)
    expect(e.resteOrganisme).toBe(0)
    expect(e.regleOrganisme).toBe(4000)
    expect(e.restePatient).toBe(1000)   // le patient doit toujours sa part
  })

  it("solde la facture quand les deux parts sont réglées", async () => {
    const { factureId } = await factureSimple()
    await encaisser(factureId, { montant: 1000, moyen: "especes" })
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)
    await enregistrerRetour(b.id, [{ factureId, montantRegle: 4000 }])

    const f = await one<{ statut: string }>(`SELECT statut FROM facture WHERE id = $1`, [factureId])
    expect(f!.statut).toBe("soldee")
  })

  it("exige un motif pour tout rejet", async () => {
    const { factureId } = await factureSimple()
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)
    await expect(
      enregistrerRetour(b.id, [{ factureId, montantRegle: 0 }]),
    ).rejects.toThrow(/non motivé/i)
  })

  it("consigne les rejets pour retraitement", async () => {
    const { factureId } = await factureSimple()
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)
    await enregistrerRetour(b.id, [{
      factureId, montantRegle: 0, motifRejet: "Droits expirés à la date des soins",
    }])

    const rejets = await rejetsARetraiter()
    expect(rejets.length).toBe(1)
    expect(rejets[0].motif_rejet).toMatch(/droits expirés/i)
    expect((await etatFacture(factureId)).resteOrganisme).toBe(4000)
  })

  it("gère un règlement partiel", async () => {
    const { factureId } = await factureSimple()
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)
    const r = await enregistrerRetour(b.id, [{ factureId, montantRegle: 2500 }])
    expect(r.statut).toBe("partiel")
    expect((await etatFacture(factureId)).resteOrganisme).toBe(1500)
  })

  it("refuse une facture absente du bordereau", async () => {
    const { factureId } = await factureSimple(80, "IPM Touba", "Ndiaye")
    const autre = await factureSimple(80, "Mutuelle Mbacké", "Diop")
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)
    await expect(
      enregistrerRetour(b.id, [{ factureId: autre.factureId, montantRegle: 100 }]),
    ).rejects.toThrow(/absente de ce bordereau/i)
    expect(factureId).toBeGreaterThan(0)
  })
})

describe("relances patient", () => {
  it("enregistre une relance avec le montant dû", async () => {
    const { factureId } = await factureSimple()
    const r = await relancer(factureId, 1, "sms")
    expect(r.montantDu).toBe(1000)
  })

  it("impose l'ordre des niveaux", async () => {
    const { factureId } = await factureSimple()
    await expect(relancer(factureId, 2)).rejects.toThrow(/niveau 1/i)
  })

  it("refuse une relance en double", async () => {
    const { factureId } = await factureSimple()
    await relancer(factureId, 1)
    await expect(relancer(factureId, 1)).rejects.toThrow(/déjà envoyée/i)
  })

  it("ne relance pas une part patient soldée", async () => {
    const { factureId } = await factureSimple()
    await encaisser(factureId, { montant: 1000, moyen: "especes" })
    await expect(relancer(factureId, 1)).rejects.toThrow(/soldée/i)
  })
})

describe("créances et pilotage", () => {
  it("liste ce qu'il reste à recouvrer, et de qui", async () => {
    const { factureId } = await factureSimple()
    await encaisser(factureId, { montant: 400, moyen: "especes" })

    const c = await creancesEnCours()
    expect(c.length).toBe(1)
    expect(Number(c[0].reste_patient)).toBe(600)
    expect(Number(c[0].reste_organisme)).toBe(4000)
    expect(c[0].patient).toContain("Ndiaye")
  })

  it("sort de la liste une fois tout réglé", async () => {
    const { factureId } = await factureSimple()
    await encaisser(factureId, { montant: 1000, moyen: "especes" })
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)
    await enregistrerRetour(b.id, [{ factureId, montantRegle: 4000 }])
    expect((await creancesEnCours()).length).toBe(0)
  })

  it("calcule le taux de recouvrement", async () => {
    const { factureId } = await factureSimple()
    await encaisser(factureId, { montant: 1000, moyen: "especes" })
    const i = await indicateurs()
    expect(i.facture).toBe(5000)
    expect(i.encaisse).toBe(1000)
    expect(i.resteARecouvrer).toBe(4000)
    expect(i.tauxRecouvrement).toBe(20)
  })

  it("mesure le taux de rejet du tiers payant", async () => {
    const a = await factureSimple(80, "IPM Touba", "Ndiaye")
    const b2 = await factureSimple(80, "IPM Touba", "Diop")
    const b = await constituerBordereau("IPM Touba")
    await envoyerBordereau(b.id)
    await enregistrerRetour(b.id, [
      { factureId: a.factureId, montantRegle: 4000 },
      { factureId: b2.factureId, montantRegle: 0, motifRejet: "Bénéficiaire non reconnu" },
    ])
    const i = await indicateurs()
    expect(i.tauxRejetTiersPayant).toBe(50)
  })

  it("dénonce la fuite de facturation", async () => {
    const { factureId } = await factureSimple()
    // On simule la perte : un acte validé dont la ligne disparaît.
    await query(`DELETE FROM ligne_facture WHERE sejour_id = (
                   SELECT sejour_id FROM facture WHERE id = $1)`, [factureId])
    const i = await indicateurs()
    expect(i.fuiteFacturation.actes).toBeGreaterThan(0)
    expect(i.fuiteFacturation.sejours).toBe(1)
  })

  it("ventile la recette par famille d'actes", async () => {
    await factureSimple()
    const r = await recetteParFamille()
    expect(r.some((x) => x.famille === "biologie")).toBe(true)
  })
})

describe("recouvrement — rôles", () => {
  it("ouvre le tableau de bord au service de facturation", async () => {
    await factureSimple()
    const r = await getRecouvrement(requete("http://x/rec", { role: "facturation" }))
    expect(r.status).toBe(200)
    const d = await r.json()
    expect(d.indicateurs.facture).toBe(5000)
    expect(d.creances.length).toBe(1)
  })

  const interdits: Role[] = ["medecin", "infirmier", "accueil", "biologiste", "pharmacien"]
  for (const role of interdits) {
    it(`interdit le tableau de bord à ${role}`, async () => {
      const r = await getRecouvrement(requete("http://x/rec", { role }))
      expect(r.status).toBe(403)
    })
  }

  it("interdit l'encaissement à un soignant", async () => {
    const { factureId } = await factureSimple()
    const r = await rec("infirmier", { action: "encaisser", factureId, montant: 100, moyen: "especes" })
    expect(r.status).toBe(403)
  })

  it("déroule encaissement et bordereau par l'API", async () => {
    const { factureId } = await factureSimple()

    let r = await rec("facturation", {
      action: "encaisser", factureId, montant: 1000, moyen: "mobile_money",
    })
    expect(r.status).toBe(201)

    r = await rec("facturation", { action: "bordereau", organisme: "IPM Touba" })
    expect(r.status).toBe(201)
    const bordereauId = (await r.json()).id

    r = await rec("facturation", { action: "envoyer", bordereauId })
    expect(r.status).toBe(200)

    r = await rec("facturation", {
      action: "retour", bordereauId, retours: [{ factureId, montantRegle: 4000 }],
    })
    expect(r.status).toBe(200)

    r = await rec("facturation", { action: "etat", factureId })
    const e = await r.json()
    expect(e.restePatient).toBe(0)
    expect(e.resteOrganisme).toBe(0)
  })

  it("refuse toute action sans session", async () => {
    const r = await postRecouvrement(
      new Request("http://x/rec", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "encaisser", factureId: 1, montant: 1 }),
      }) as never)
    expect(r.status).toBe(401)
  })
})

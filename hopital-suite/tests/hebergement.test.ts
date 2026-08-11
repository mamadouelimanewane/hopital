/* ════════════════════════════════════════════════════════════════
   Hébergement — la facturation qui court sans geste soignant.

   Trois propriétés à tenir : on compte des nuitées et non des jours,
   chaque nuit est payée au tarif de l'unité où elle a été passée, et
   le calcul est rejouable sans jamais facturer deux fois.
   ════════════════════════════════════════════════════════════════ */
import { describe, it, expect, beforeEach } from "vitest"
import { baseDeTest } from "./socle"
import { query, one } from "@/lib/db"
import { creerPatient, ajouterCouverture, ouvrirSejour } from "@/lib/admission"
import { compteurSejour, cloturerEtFacturer } from "@/lib/facturation"
import { nuitees, facturerJournees, journeesDuSejour } from "@/lib/hebergement"

beforeEach(async () => { await baseDeTest() })

const d = (iso: string) => new Date(iso)

/** Séjour dont le mouvement est repositionné dans le temps. */
async function sejourAvecMouvement(
  debut: string, fin: string | null,
  categorie: "commune" | "particuliere" | "reanimation" | "aucune" = "commune",
  taux = 0,
) {
  const p = await creerPatient({ nom: "Cissé", prenom: "Ousmane", dateNaissance: "1970-01-15" })
  if (taux > 0) await ajouterCouverture(p.id, { regime: "ipm", taux })
  const s = await ouvrirSejour(p.id, {
    modeEntree: "hospitalisation_programmee", unite: "Médecine", categorie,
  })
  await query(
    `UPDATE mouvement SET debut_le = $2::timestamptz, fin_le = $3::timestamptz
      WHERE sejour_id = $1`,
    [s.id, debut, fin],
  )
  await query(`UPDATE sejour SET entree_le = $2::timestamptz WHERE id = $1`, [s.id, debut])
  return { patient: p, sejour: s }
}

describe("comptage des nuitées", () => {
  it("ne compte aucune nuit pour une entrée et une sortie le même jour", () => {
    expect(nuitees(d("2026-03-10T08:00:00"), d("2026-03-10T19:00:00"))).toEqual([])
  })

  it("compte une nuit pour un minuit franchi", () => {
    expect(nuitees(d("2026-03-10T22:00:00"), d("2026-03-11T07:00:00"))).toEqual(["2026-03-10"])
  })

  it("date la nuit du jour où l'on s'est couché", () => {
    const n = nuitees(d("2026-03-10T23:30:00"), d("2026-03-13T09:00:00"))
    expect(n).toEqual(["2026-03-10", "2026-03-11", "2026-03-12"])
  })

  it("ne compte pas la nuit de sortie quand on part le matin", () => {
    // Entrée lundi 14 h, sortie mercredi 10 h : deux nuits, pas trois.
    expect(nuitees(d("2026-03-09T14:00:00"), d("2026-03-11T10:00:00")).length).toBe(2)
  })

  it("ignore un intervalle vide ou inversé", () => {
    expect(nuitees(d("2026-03-10T10:00:00"), d("2026-03-10T10:00:00"))).toEqual([])
    expect(nuitees(d("2026-03-12T10:00:00"), d("2026-03-10T10:00:00"))).toEqual([])
  })
})

describe("facturation des journées", () => {
  it("ne facture rien pour un passage dans la journée", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-10T08:00:00", "2026-03-10T18:00:00")
    const r = await facturerJournees(sejour.id)
    expect(r.nuitsFacturees).toBe(0)
    expect((await compteurSejour(sejour.id)).total).toBe(0)
  })

  it("facture une nuit par minuit franchi", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", "2026-03-12T10:00:00")
    const r = await facturerJournees(sejour.id)
    expect(r.nuitsFacturees).toBe(3)
    expect(r.montant).toBe(24000)                       // 3 × 8 000
    expect((await compteurSejour(sejour.id)).total).toBe(24000)
  })

  it("applique le tarif de la catégorie de chambre", async () => {
    const { sejour } = await sejourAvecMouvement(
      "2026-03-09T14:00:00", "2026-03-11T10:00:00", "reanimation")
    const r = await facturerJournees(sejour.id)
    expect(r.nuitsFacturees).toBe(2)
    expect(r.montant).toBe(150000)                      // 2 × 75 000
  })

  it("ne facture pas un séjour sans occupation de lit", async () => {
    const { sejour } = await sejourAvecMouvement(
      "2026-03-09T09:00:00", "2026-03-12T09:00:00", "aucune")
    const r = await facturerJournees(sejour.id)
    expect(r.nuitsFacturees).toBe(0)
  })

  it("répartit selon la couverture", async () => {
    const { sejour } = await sejourAvecMouvement(
      "2026-03-09T14:00:00", "2026-03-11T10:00:00", "commune", 80)
    await facturerJournees(sejour.id)
    const c = await compteurSejour(sejour.id)
    expect(c.total).toBe(16000)
    expect(c.partOrganisme).toBe(12800)
    expect(c.partPatient).toBe(3200)
  })

  it("facture chaque nuit au tarif de l'unité où elle a été passée", async () => {
    const p = await creerPatient({ nom: "Diallo", prenom: "Sadio" })
    const s = await ouvrirSejour(p.id, {
      modeEntree: "urgences", triage: "rouge", unite: "Réanimation", categorie: "reanimation",
    })
    // Deux nuits en réanimation, puis deux en chambre commune.
    await query(
      `UPDATE mouvement SET debut_le = '2026-03-09T14:00:00', fin_le = '2026-03-11T11:00:00'
        WHERE sejour_id = $1`, [s.id])
    await query(
      `INSERT INTO mouvement (sejour_id, unite, categorie, debut_le, fin_le)
       VALUES ($1,'Médecine','commune','2026-03-11T11:00:00','2026-03-13T09:00:00')`,
      [s.id])

    const r = await facturerJournees(s.id)
    expect(r.nuitsFacturees).toBe(4)
    expect(r.montant).toBe(2 * 75000 + 2 * 8000)        // 166 000
    const parCategorie = r.detail.reduce<Record<string, number>>((acc, x) => {
      acc[x.categorie] = (acc[x.categorie] ?? 0) + 1; return acc
    }, {})
    expect(parCategorie).toEqual({ reanimation: 2, commune: 2 })
  })

  it("borne le calcul d'un séjour encore ouvert", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", null)
    const r = await facturerJournees(sejour.id, { jusqua: d("2026-03-11T08:00:00") })
    expect(r.nuitsFacturees).toBe(2)
  })
})

describe("idempotence", () => {
  it("ne facture pas deux fois la même nuit", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", "2026-03-12T10:00:00")

    const premier = await facturerJournees(sejour.id)
    expect(premier.nuitsFacturees).toBe(3)

    const second = await facturerJournees(sejour.id)
    expect(second.nuitsFacturees).toBe(0)
    expect(second.nuitsDejaFacturees).toBe(3)

    const c = await compteurSejour(sejour.id)
    expect(c.total).toBe(24000)                          // inchangé
    expect(c.nbLignes).toBe(3)
  })

  it("ne facture que les nuits nouvelles lors d'un calcul quotidien", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", null)

    let r = await facturerJournees(sejour.id, { jusqua: d("2026-03-11T08:00:00") })
    expect(r.nuitsFacturees).toBe(2)

    r = await facturerJournees(sejour.id, { jusqua: d("2026-03-13T08:00:00") })
    expect(r.nuitsFacturees).toBe(2)                     // les deux suivantes
    expect(r.nuitsDejaFacturees).toBe(2)

    expect((await compteurSejour(sejour.id)).total).toBe(32000)   // 4 nuits
  })

  it("empêche l'insertion en double au niveau de la base", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", "2026-03-10T10:00:00")
    await facturerJournees(sejour.id)
    const m = await one<{ id: number }>(
      `SELECT id FROM mouvement WHERE sejour_id = $1`, [sejour.id])
    await expect(
      query(
        `INSERT INTO journee_hebergement (mouvement_id, nuit_du, categorie)
         VALUES ($1,'2026-03-09','commune')`, [m!.id]),
    ).rejects.toThrow()
  })
})

describe("clôture", () => {
  it("facture les nuitées restantes au moment de clôturer", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", "2026-03-12T10:00:00")
    expect((await compteurSejour(sejour.id)).total).toBe(0)

    const { facture } = await cloturerEtFacturer(sejour.id, "domicile")
    expect(Number(facture.total)).toBe(24000)
  })

  it("n'ajoute rien si les journées ont déjà été facturées", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", "2026-03-12T10:00:00")
    await facturerJournees(sejour.id)
    const { facture } = await cloturerEtFacturer(sejour.id, "domicile")
    expect(Number(facture.total)).toBe(24000)
    expect((await compteurSejour(sejour.id)).nbLignes).toBe(3)
  })

  it("restitue le détail des journées", async () => {
    const { sejour } = await sejourAvecMouvement(
      "2026-03-09T14:00:00", "2026-03-11T10:00:00", "particuliere")
    await facturerJournees(sejour.id)

    const j = await journeesDuSejour(sejour.id)
    expect(j.length).toBe(2)
    expect(j[0].nuit_du).toBe("2026-03-09")   // chaîne, pas objet Date
    expect(j[0].categorie).toBe("particuliere")
    expect(Number(j[0].montant_total)).toBe(20000)
  })

  it("laisse la trace au journal", async () => {
    const { sejour } = await sejourAvecMouvement("2026-03-09T14:00:00", "2026-03-11T10:00:00")
    await facturerJournees(sejour.id, { acteur: "facturation" })
    const j = await query<{ action: string; acteur: string }>(
      `SELECT action, acteur FROM journal WHERE action = 'facturation_hebergement'`)
    expect(j.length).toBe(1)
    expect(j[0].acteur).toBe("facturation")
  })
})

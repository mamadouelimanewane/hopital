/* Contrat HTTP des routes du socle, contre une vraie base. */
import { describe, it, expect, beforeEach } from "vitest"
import { baseDeTest, requete, cookiePour } from "./socle"
import { GET as getPatients, POST as postPatients } from "@/app/api/socle/patients/route"
import { GET as getSejour } from "@/app/api/socle/sejours/[id]/route"
import { POST as postLabo } from "@/app/api/socle/sejours/[id]/laboratoire/route"
import type { Role } from "@/lib/auth"

beforeEach(async () => { await baseDeTest() })

const ctx = (id: number) => ({ params: Promise.resolve({ id: String(id) }) })

/** Requête GET munie d'une session, avec nextUrl pour les routes qui le lisent. */
function getReq(url: string, role: Role) {
  const r = requete(url, { role }) as unknown as Record<string, unknown>
  r.nextUrl = new URL(url)
  return r as never
}

async function admettre(nom: string, prenom: string, extra: Record<string, unknown> = {}) {
  const r = await postPatients(requete("http://x/api/socle/patients", {
    role: "accueil",
    body: {
      traits: { nom, prenom, dateNaissance: "1988-04-12", sexe: "F" },
      sejour: { modeEntree: "urgences", triage: "orange", unite: "SAU" },
      forcerCreation: true,
      ...extra,
    },
  }))
  return { statut: r.status, corps: await r.json() }
}

const labo = (id: number, role: Role, body: Record<string, unknown>) =>
  postLabo(requete("http://x/labo", { role, body }), ctx(id))

describe("routes du socle", () => {
  it("admet un patient et renvoie 201", async () => {
    const { statut, corps } = await admettre("Ndiaye", "Fatou")
    expect(statut).toBe(201)
    expect(corps.statut).toBe("admis")
    expect(corps.sejour.nda).toMatch(/^NDA-/)
  })

  it("refuse une admission sans nom", async () => {
    const r = await postPatients(requete("http://x/api/socle/patients", {
      role: "accueil", body: { traits: { nom: "" } },
    }))
    expect(r.status).toBe(400)
  })

  it("signale les doublons sans créer", async () => {
    await admettre("Ndiaye", "Fatou")
    const r = await postPatients(requete("http://x/api/socle/patients", {
      role: "accueil",
      body: {
        traits: { nom: "Ndiay", prenom: "Fatu", dateNaissance: "1988-04-12", sexe: "F" },
        sejour: { modeEntree: "consultation_programmee" },
      },
    }))
    expect(r.status).toBe(200)
    expect((await r.json()).statut).toBe("doublons_possibles")
  })

  it("expose les rapprochements en GET", async () => {
    await admettre("Ndiaye", "Fatou")
    const r = await getPatients(
      getReq("http://x/api/socle/patients?nom=Ndiay&prenom=Fatu&naissance=1988-04-12", "accueil"),
    )
    expect((await r.json()).candidats.length).toBeGreaterThan(0)
  })

  it("renvoie 404 pour un séjour inconnu", async () => {
    const r = await getSejour(requete("http://x/s", { role: "medecin" }), ctx(9999))
    expect(r.status).toBe(404)
  })

  it("déroule le circuit complet, chaque geste par son rôle", async () => {
    const { corps } = await admettre("Seck", "Mame Diarra")
    const id = corps.sejour.id
    const vue = async () =>
      (await (await getSejour(requete("http://x/s", { role: "medecin" }), ctx(id))).json())

    let r = await labo(id, "medecin", { action: "prescrire", codes: ["BIO-NFS"] })
    expect(r.status).toBe(201)
    const acteId = (await r.json()).actes[0].id
    expect((await vue()).compteur.total).toBe(0)

    await labo(id, "infirmier", { action: "prelever", acteId })
    await labo(id, "biologiste", { action: "resultat", acteId, valeur: "11.2", unite: "g/dL" })
    expect((await vue()).compteur.total).toBe(0)

    r = await labo(id, "biologiste", { action: "valider", acteId })
    expect(r.status).toBe(200)

    const apres = await vue()
    expect(apres.compteur.total).toBe(5000)
    expect(apres.anomalies.length).toBe(0)

    r = await labo(id, "facturation", { action: "cloturer", modeSortie: "domicile" })
    expect((await r.json()).facture.numero).toMatch(/^F-/)
  })

  it("rejette une action inconnue", async () => {
    const { corps } = await admettre("Ba", "Ibrahima")
    const r = await labo(corps.sejour.id, "admin", { action: "sabotage" })
    expect(r.status).toBe(400)
  })

  it("transmet l'erreur métier au client", async () => {
    const { corps } = await admettre("Fall", "Awa")
    const r = await labo(corps.sejour.id, "medecin", {
      action: "prescrire", codes: ["BIO-INEXISTANT"],
    })
    expect(r.status).toBe(400)
    expect((await r.json()).erreur).toMatch(/catalogue/i)
  })

  it("inscrit au journal l'identité de la session, pas celle du corps", async () => {
    const { corps } = await admettre("Diouf", "Rokhaya")
    const id = corps.sejour.id

    // Le client tente de signer sous un autre nom.
    const r = await labo(id, "medecin", {
      action: "prescrire", codes: ["BIO-NFS"], prescripteur: "Dr. Usurpateur",
    })
    const { prescription } = await r.json()
    expect(prescription.prescripteur).toBe("Dr. Oumar Sall")
    expect(prescription.prescripteur).not.toContain("Usurpateur")

    const { query } = await import("@/lib/db")
    const lignes = await query<{ acteur: string }>(
      `SELECT acteur FROM journal WHERE entite = 'prescription'`,
    )
    expect(lignes[0].acteur).toBe("medecin")
  })

  it("nomme le biologiste d'après la session dans le journal", async () => {
    const { corps } = await admettre("Sow", "Astou")
    const id = corps.sejour.id
    const acteId = (await (await labo(id, "medecin", { action: "prescrire", codes: ["BIO-GLY"] })).json()).actes[0].id

    await labo(id, "infirmier", { action: "prelever", acteId })
    await labo(id, "biologiste", { action: "resultat", acteId, valeur: "0.9" })
    await labo(id, "biologiste", { action: "valider", acteId, biologiste: "Dr. Faux" })

    const { one } = await import("@/lib/db")
    const acte = await one<{ valide_par: string }>(
      `SELECT valide_par FROM acte WHERE id = $1`, [acteId])
    expect(acte!.valide_par).toBe("Dr. Fatou Mbaye")
  })
})

describe("contrôle d'accès", () => {
  it("refuse toute route sans session", async () => {
    const routes: Array<[string, Promise<Response>]> = [
      ["patients GET", getPatients({ nextUrl: new URL("http://x/api/socle/patients?nom=A&prenom=B"), headers: new Headers() } as never)],
      ["patients POST", postPatients(new Request("http://x/p", { method: "POST", body: "{}" }) as never)],
      ["sejour GET", getSejour(new Request("http://x/s") as never, ctx(1))],
      ["labo POST", postLabo(new Request("http://x/l", { method: "POST", body: JSON.stringify({ action: "prescrire" }) }) as never, ctx(1))],
    ]
    for (const [nom, p] of routes) {
      const r = await p
      expect(r.status, nom).toBe(401)
    }
  })

  it("refuse un jeton forgé", async () => {
    const r = await getSejour(
      new Request("http://x/s", { headers: { cookie: "ndamatou_session=jeton.bidon.forge" } }) as never,
      ctx(1),
    )
    expect(r.status).toBe(401)
  })

  const interdits: Array<[Role, string, Record<string, unknown>]> = [
    ["infirmier", "prescrire", { action: "prescrire", codes: ["BIO-NFS"] }],
    ["medecin", "prélever", { action: "prelever", acteId: 1 }],
    ["accueil", "valider", { action: "valider", acteId: 1 }],
    ["infirmier", "valider", { action: "valider", acteId: 1 }],
    ["medecin", "clôturer", { action: "cloturer" }],
    ["biologiste", "clôturer", { action: "cloturer" }],
  ]
  for (const [role, geste, body] of interdits) {
    it(`interdit à ${role} de ${geste}`, async () => {
      const { corps } = await admettre("Test", "Acces")
      const r = await labo(corps.sejour.id, role, body)
      expect(r.status).toBe(403)
      expect((await r.json()).erreur).toMatch(new RegExp(role))
    })
  }

  it("interdit l'admission à un médecin", async () => {
    const r = await postPatients(requete("http://x/p", {
      role: "medecin",
      body: { traits: { nom: "X", prenom: "Y" }, forcerCreation: true },
    }))
    expect(r.status).toBe(403)
  })

  it("laisse chaque soignant consulter le séjour qu'il sert", async () => {
    const { corps } = await admettre("Diagne", "Awa")
    const id = corps.sejour.id
    const soignants: Role[] = ["medecin", "infirmier", "technicien", "biologiste",
                               "manipulateur", "radiologue", "pharmacien", "facturation"]
    for (const role of soignants) {
      const r = await getSejour(requete("http://x/s", { role }), ctx(id))
      expect(r.status, role).toBe(200)
    }
  })

  it("laisse l'admin passer partout", async () => {
    const { corps } = await admettre("Kane", "Modou")
    const r = await labo(corps.sejour.id, "admin", { action: "prescrire", codes: ["BIO-NFS"] })
    expect(r.status).toBe(201)
  })

  it("produit un cookie httpOnly et SameSite", async () => {
    const { POST } = await import("@/app/api/socle/auth/route")
    const { MOT_DE_PASSE_TEST } = await import("./socle")
    const r = await POST(new Request("http://x/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifiant: "biologiste", motDePasse: MOT_DE_PASSE_TEST }),
    }) as never)
    expect(r.status).toBe(200)
    const cookie = r.headers.get("set-cookie") || ""
    expect(cookie).toMatch(/HttpOnly/i)
    expect(cookie).toMatch(/SameSite=Lax/i)
    expect(await r.json()).toMatchObject({ session: { role: "biologiste" } })
  })

  it("refuse un mot de passe erroné sans révéler le compte", async () => {
    const { POST } = await import("@/app/api/socle/auth/route")
    const mauvais = await POST(new Request("http://x/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifiant: "biologiste", motDePasse: "faux" }),
    }) as never)
    const inconnu = await POST(new Request("http://x/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifiant: "personne", motDePasse: "faux" }),
    }) as never)
    expect(mauvais.status).toBe(401)
    expect(inconnu.status).toBe(401)
    expect((await mauvais.json()).erreur).toBe((await inconnu.json()).erreur)
  })

  it("ne renvoie jamais l'empreinte du mot de passe", async () => {
    const { POST } = await import("@/app/api/socle/auth/route")
    const { MOT_DE_PASSE_TEST } = await import("./socle")
    const r = await POST(new Request("http://x/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifiant: "admin", motDePasse: MOT_DE_PASSE_TEST }),
    }) as never)
    expect(JSON.stringify(await r.json())).not.toMatch(/\$2[aby]\$/)
  })

  it("efface le cookie à la déconnexion", async () => {
    const { DELETE } = await import("@/app/api/socle/auth/route")
    const r = await DELETE()
    expect(r.headers.get("set-cookie")).toMatch(/Max-Age=0/)
  })

  it("expose la session courante et la refuse sans cookie", async () => {
    const { GET } = await import("@/app/api/socle/auth/route")
    const avec = await GET(new Request("http://x/auth", {
      headers: { cookie: cookiePour("medecin") },
    }) as never)
    expect((await avec.json()).session.role).toBe("medecin")

    const sans = await GET(new Request("http://x/auth") as never)
    expect(sans.status).toBe(401)
  })
})

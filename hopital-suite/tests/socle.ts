/* Base de test : Postgres 16 compilé en WebAssembly.
   Aucun serveur à installer, mais le SQL exécuté est celui de
   production — schéma, transactions, contraintes comprises.

   L'instance est démarrée une fois par processus puis vidée entre
   chaque test : redémarrer un Postgres complet à chaque fois faisait
   durer la suite six minutes, et une suite de six minutes ne se
   lance pas. */
import fs from "node:fs"
import path from "node:path"
import { PGlite } from "@electric-sql/pglite"
import { setExecutor } from "@/lib/db"
import { chargerCatalogue } from "@/db/catalogue.mjs"
import { hacher, signer, type Role, type Session } from "@/lib/auth"

process.env.JWT_SECRET =
  process.env.JWT_SECRET || "secret-de-test-de-plus-de-trente-deux-caracteres"

const COMPTES: Array<[string, Role, string]> = [
  ["accueil", "accueil", "Aïssatou Diallo"],
  ["medecin", "medecin", "Dr. Oumar Sall"],
  ["infirmier", "infirmier", "IDE Aïda Kane"],
  ["biologiste", "biologiste", "Dr. Fatou Mbaye"],
  ["manipulateur", "manipulateur", "Moussa Dieng"],
  ["radiologue", "radiologue", "Dr. Cheikh Sy"],
  ["pharmacien", "pharmacien", "Dr. Awa Diagne"],
  ["facturation", "facturation", "Cheikh Ndoye"],
  ["admin", "admin", "Administrateur"],
]

export const MOT_DE_PASSE_TEST = "motdepasse-test"

/* bcrypt au coût de production prend ~300 ms. Calculé une fois par
   processus plutôt qu'à chaque test : les comptes sont identiques. */
let _empreinte: Promise<string> | null = null
const empreinteTest = () => (_empreinte ??= hacher(MOT_DE_PASSE_TEST))

/* Tout est remis à zéro entre les tests, y compris le catalogue et
   les tarifs : un test qui simule une revalorisation ne doit pas
   changer le prix vu par les suivants. Seuls les comptes du personnel
   survivent — aucun test ne les modifie. */
const TABLES_A_VIDER = [
  "journal", "reglement", "facture", "ligne_facture", "journee_hebergement",
  "resultat", "acte",
  "prescription", "mouvement", "sejour", "couverture", "patient",
  "tarif", "catalogue_acte", "compteur",
]

type Exec = { query: (t: string, p?: unknown[]) => Promise<{ rows: never[] }> }

let _pg: PGlite | null = null
let _exec: Exec | null = null

async function demarrer() {
  const pg = new PGlite()
  await pg.exec(fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"))

  const exec: Exec = {
    query: async (text, params = []) =>
      pg.query(text, params) as Promise<{ rows: never[] }>,
  }
  setExecutor(exec)
  await chargerCatalogue(exec)

  const empreinte = await empreinteTest()
  for (const [identifiant, role, nom] of COMPTES) {
    await exec.query(
      `INSERT INTO utilisateur (identifiant, mot_de_passe, nom_complet, role)
       VALUES ($1,$2,$3,$4)`,
      [identifiant, empreinte, nom, role],
    )
  }

  _pg = pg
  _exec = exec
}

export async function baseDeTest() {
  if (!_pg || !_exec) {
    await demarrer()
  } else {
    // RESTART IDENTITY : les IPP et NDA repartent à 1, pour que les
    // tests puissent s'appuyer sur des identifiants prévisibles.
    await _exec.query(
      `TRUNCATE ${TABLES_A_VIDER.join(", ")} RESTART IDENTITY CASCADE`,
    )
    await chargerCatalogue(_exec)
    setExecutor(_exec)
  }
  return { pg: _pg!, exec: _exec! }
}

/** Cookie de session pour un rôle donné, sans passer par /auth. */
export function cookiePour(role: Role, id = 1): string {
  const compte = COMPTES.find((c) => c[1] === role)
  const session: Session = {
    id,
    identifiant: compte?.[0] ?? role,
    nom: compte?.[2] ?? role,
    role,
    unite: "",
  }
  return `ndamatou_session=${signer(session)}`
}

/** Requête munie d'une session. */
export function requete(url: string, options: {
  role?: Role; body?: unknown; methode?: string
} = {}) {
  const headers: Record<string, string> = {}
  if (options.role) headers.cookie = cookiePour(options.role)
  if (options.body !== undefined) headers["Content-Type"] = "application/json"

  return new Request(url, {
    method: options.methode ?? (options.body !== undefined ? "POST" : "GET"),
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  }) as never
}

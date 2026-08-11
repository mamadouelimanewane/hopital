#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════
   Postgres jetable pour le développement local.

   Expose PGlite (Postgres compilé en WebAssembly) sur le port 5433,
   avec le schéma et le catalogue déjà chargés. Aucune installation,
   aucune donnée persistée : à l'arrêt, tout disparaît.

   Usage :  node db/serveur-test.mjs
   Puis  :  DATABASE_URL=postgres://postgres@localhost:5433/postgres
            PGSSL_DISABLE=1  npm run dev
   ════════════════════════════════════════════════════════════════ */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import bcrypt from "bcryptjs"
import { PGlite } from "@electric-sql/pglite"
import { PGLiteSocketServer } from "@electric-sql/pglite-socket"
import { chargerCatalogue } from "./catalogue.mjs"

/* Comptes de développement. Mot de passe unique et affiché : cette
   base est jetable et n'écoute que sur la boucle locale. */
const MOT_DE_PASSE = "socle-local"
const COMPTES = [
  ["accueil",    "accueil",    "Aïssatou Diallo"],
  ["medecin",    "medecin",    "Dr. Oumar Sall"],
  ["infirmier",  "infirmier",  "IDE Aïda Kane"],
  ["biologiste", "biologiste", "Dr. Fatou Mbaye"],
  ["manipulateur","manipulateur","Moussa Dieng"],
  ["radiologue", "radiologue", "Dr. Cheikh Sy"],
  ["pharmacien","pharmacien","Dr. Awa Diagne"],
  ["facturation","facturation","Cheikh Ndoye"],
  ["admin",      "admin",      "Administrateur"],
]

const ici = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT_PG || 5433)

const pg = new PGlite()
await pg.exec(fs.readFileSync(path.join(ici, "schema.sql"), "utf8"))
const n = await chargerCatalogue({ query: (t, p) => pg.query(t, p) })

const empreinte = await bcrypt.hash(MOT_DE_PASSE, 10)
for (const [identifiant, role, nom] of COMPTES) {
  await pg.query(
    `INSERT INTO utilisateur (identifiant, mot_de_passe, nom_complet, role)
     VALUES ($1,$2,$3,$4)`,
    [identifiant, empreinte, nom, role],
  )
}

const serveur = new PGLiteSocketServer({ db: pg, port, host: "127.0.0.1" })
await serveur.start()

console.log(`✓ Postgres de test sur 127.0.0.1:${port}`)
console.log(`  ${n} actes au catalogue · ${COMPTES.length} comptes de développement`)
console.log(`  Identifiants : ${COMPTES.map((c) => c[0]).join(", ")}`)
console.log(`  Mot de passe commun : ${MOT_DE_PASSE}`)
console.log("  Ctrl+C pour arrêter. Rien n'est conservé.")

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await serveur.stop()
    await pg.close()
    process.exit(0)
  })
}

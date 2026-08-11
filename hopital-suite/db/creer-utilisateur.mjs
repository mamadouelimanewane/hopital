#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════
   Crée ou réinitialise un compte du personnel.

   Usage : node db/creer-utilisateur.mjs <identifiant> <role> "<Nom complet>"

   Rôles : accueil, infirmier, technicien, medecin, biologiste,
           pharmacien, facturation, admin

   Le mot de passe n'est jamais passé en argument — il resterait dans
   l'historique du shell. Il est généré et affiché une seule fois, ou
   lu dans MOT_DE_PASSE.
   ════════════════════════════════════════════════════════════════ */
import crypto from "node:crypto"
import bcrypt from "bcryptjs"
import pg from "pg"

const ROLES = ["accueil", "infirmier", "technicien", "medecin",
               "biologiste", "pharmacien", "facturation", "admin"]

const [identifiant, role, nomComplet] = process.argv.slice(2)

if (!identifiant || !ROLES.includes(role)) {
  console.error('Usage : node db/creer-utilisateur.mjs <identifiant> <role> "<Nom complet>"')
  console.error("Rôles :", ROLES.join(", "))
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL non défini.")
  process.exit(1)
}

function genererMotDePasse(n = 16) {
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const octets = crypto.randomBytes(n)
  return Array.from(octets, (o) => alphabet[o % alphabet.length]).join("")
}

const motDePasse = process.env.MOT_DE_PASSE || genererMotDePasse()
if (motDePasse.length < 10) {
  console.error("✗ MOT_DE_PASSE doit faire au moins 10 caractères.")
  process.exit(1)
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL_DISABLE === "1" ? false : { rejectUnauthorized: false },
})

await client.connect()
try {
  const empreinte = await bcrypt.hash(motDePasse, 12)
  const { rows } = await client.query(
    `INSERT INTO utilisateur (identifiant, mot_de_passe, nom_complet, role)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (lower(identifiant))
     DO UPDATE SET mot_de_passe = EXCLUDED.mot_de_passe,
                   nom_complet = EXCLUDED.nom_complet,
                   role = EXCLUDED.role,
                   actif = true
     RETURNING id, identifiant, role`,
    [identifiant, empreinte, nomComplet || identifiant, role],
  )
  const u = rows[0]
  console.log(`✓ Compte #${u.id} : ${u.identifiant} (${u.role})`)
  if (!process.env.MOT_DE_PASSE) {
    console.log("")
    console.log("  Mot de passe généré (affiché une seule fois) :")
    console.log("  " + motDePasse)
    console.log("")
  }
} finally {
  await client.end()
}

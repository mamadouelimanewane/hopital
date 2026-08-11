#!/usr/bin/env node
/* Applique db/schema.sql sur DATABASE_URL.
   Usage : node db/migrate.mjs                                     */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const ici = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL non défini.")
  console.error('  PowerShell : $env:DATABASE_URL = "postgres://…"')
  process.exit(1)
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL_DISABLE === "1" ? false : { rejectUnauthorized: false },
})

await client.connect()
try {
  await client.query(fs.readFileSync(path.join(ici, "schema.sql"), "utf8"))
  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name`,
  )
  console.log("✓ Schéma appliqué.")
  console.log("  Tables :", rows.map((r) => r.table_name).join(", "))
} finally {
  await client.end()
}

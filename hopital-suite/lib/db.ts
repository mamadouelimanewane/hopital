/* ════════════════════════════════════════════════════════════════
   Accès à la base.

   L'exécuteur est remplaçable (setExecutor) pour que les tests
   d'intégration puissent viser un Postgres en mémoire sans qu'aucun
   code métier ne change.
   ════════════════════════════════════════════════════════════════ */

export type Row = Record<string, unknown>

export interface Executor {
  query<T = Row>(text: string, params?: unknown[]): Promise<{ rows: T[] }>
}

let executor: Executor | null = null

/** Remplace l'exécuteur — utilisé par les tests. */
export function setExecutor(e: Executor | null) {
  executor = e
}

function defaultExecutor(): Executor {
  const g = globalThis as { __ndamatouPool?: Executor }
  if (g.__ndamatouPool) return g.__ndamatouPool

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL absent. Renseignez-le dans .env.local " +
      "(voir .env.example) avant d'utiliser le socle."
    )
  }

  // Import différé : le driver ne doit pas être chargé côté client,
  // ni dans les tests qui fournissent leur propre exécuteur.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg")
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL_DISABLE === "1" ? false : { rejectUnauthorized: false },
    // Le Postgres jetable de développement (db/serveur-test.mjs)
    // n'accepte qu'une connexion : PGPOOL_MAX=1 dans .env.local.
    max: Number(process.env.PGPOOL_MAX || 3),
  })
  g.__ndamatouPool = pool as Executor
  return pool as Executor
}

function exec(): Executor {
  return executor ?? defaultExecutor()
}

export async function query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await exec().query<T>(text, params)
  return rows
}

export async function one<T = Row>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}

/**
 * Transaction. L'exécuteur de test étant mono-connexion, on se
 * contente d'encadrer par BEGIN/COMMIT plutôt que de réserver un
 * client dédié — suffisant ici, et identique en production tant que
 * les appels ne sont pas concurrents sur la même transaction.
 */
export async function tx<T>(fn: () => Promise<T>): Promise<T> {
  const e = exec()
  await e.query("BEGIN")
  try {
    const out = await fn()
    await e.query("COMMIT")
    return out
  } catch (err) {
    try { await e.query("ROLLBACK") } catch { /* connexion perdue */ }
    throw err
  }
}

/** Journalise une action. Le journal n'est jamais modifié ni purgé. */
export async function journaliser(
  entite: string,
  entiteId: number | null,
  action: string,
  acteur = "systeme",
  detail: Record<string, unknown> = {},
) {
  await query(
    `INSERT INTO journal (entite, entite_id, action, acteur, detail)
     VALUES ($1, $2, $3, $4, $5)`,
    [entite, entiteId, action, acteur, JSON.stringify(detail)],
  )
}

/** Incrémente un compteur et renvoie sa nouvelle valeur. */
export async function prochainNumero(nom: string): Promise<number> {
  const row = await one<{ valeur: string }>(
    `INSERT INTO compteur (nom, valeur) VALUES ($1, 1)
     ON CONFLICT (nom) DO UPDATE SET valeur = compteur.valeur + 1
     RETURNING valeur`,
    [nom],
  )
  return Number(row!.valeur)
}

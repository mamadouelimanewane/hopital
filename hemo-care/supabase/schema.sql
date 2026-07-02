-- ══════════════════════════════════════════════════════════════════════════
-- Hemo-Care — Schéma Supabase (PostgreSQL)
-- Centre d'Hémodialyse — Hôpital Ndamatou de Touba, Sénégal
--
-- NOTE IMPORTANTE : Row Level Security (RLS) n'est PAS configuré dans ce
-- script. Avant toute mise en production, activez RLS sur chaque table et
-- définissez des policies adaptées (ex: accès restreint par rôle utilisateur,
-- données patients sensibles). Exemple :
--   ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
--   CREATE POLICY "authenticated read" ON patients FOR SELECT
--     USING (auth.role() = 'authenticated');
-- ══════════════════════════════════════════════════════════════════════════

-- ── Table: patients ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id                    text PRIMARY KEY,
  nom                   text NOT NULL,
  age                   integer NOT NULL,
  groupe_sanguin        text NOT NULL,
  poids_sec             numeric(5,1) NOT NULL,
  poids_entree_hopital  numeric(5,1) NOT NULL,
  date_debut_dialyse    date NOT NULL,
  pathologie            text NOT NULL,
  statut                text NOT NULL CHECK (statut IN ('Actif', 'Suspendu', 'Transféré')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ── Table: generateurs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS generateurs (
  id                    text PRIMARY KEY,
  nom                   text NOT NULL,
  salle                 text NOT NULL,
  statut                text NOT NULL CHECK (statut IN ('Disponible', 'Occupé', 'Maintenance')),
  dernier_entretien     date,
  prochain_entretien    date,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ── Table: seances ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seances (
  id                    text PRIMARY KEY,
  patient_id            text NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  patient_nom           text NOT NULL,
  date                  date NOT NULL,
  heure                 time NOT NULL,
  generateur_id         text REFERENCES generateurs(id) ON DELETE SET NULL,
  duree_min             integer NOT NULL DEFAULT 240,
  poids_avant           numeric(5,1),
  poids_apres           numeric(5,1),
  tension_avant         text,
  tension_apres         text,
  statut                text NOT NULL CHECK (statut IN ('Planifiée', 'En cours', 'Terminée', 'Annulée')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ── Index utiles ────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_seances_patient_id   ON seances(patient_id);
CREATE INDEX IF NOT EXISTS idx_seances_generateur_id ON seances(generateur_id);
CREATE INDEX IF NOT EXISTS idx_seances_date          ON seances(date);
CREATE INDEX IF NOT EXISTS idx_patients_statut       ON patients(statut);

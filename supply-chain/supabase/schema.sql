-- ============================================================================
-- Supply-Chain — Hôpital Ndamatou de Touba
-- Schéma de base de données Supabase (PostgreSQL)
-- ============================================================================
-- NOTE IMPORTANTE : Row Level Security (RLS) n'est PAS configuré ici.
-- Avant toute mise en production, activez RLS sur chaque table et définissez
-- des policies adaptées aux rôles applicatifs (agent, chef_achats, econome, admin).
-- Exemple : ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
-- ============================================================================

-- ── Table: fournisseurs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fournisseurs (
  id                text PRIMARY KEY,
  nom               text NOT NULL,
  categorie         text NOT NULL CHECK (categorie IN ('Alimentation', 'Blanchisserie', 'Fournitures', 'Équipement')),
  contact           text,
  telephone         text,
  delai_moyen_jours integer DEFAULT 0,
  notation          numeric(2,1) DEFAULT 0 CHECK (notation >= 0 AND notation <= 5),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ── Table: commandes ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commandes (
  id                     text PRIMARY KEY,
  fournisseur_nom        text NOT NULL,
  articles               text,
  montant_fcfa           numeric(14,2) NOT NULL DEFAULT 0,
  statut                 text NOT NULL CHECK (statut IN ('Brouillon', 'Envoyée', 'Confirmée', 'Livrée', 'Annulée')),
  date_commande          date NOT NULL,
  date_livraison_prevue  date,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- ── Table: livraisons ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS livraisons (
  id               text PRIMARY KEY,
  commande_id      text REFERENCES commandes(id) ON DELETE SET NULL,
  fournisseur_nom  text NOT NULL,
  date_reçue       date NOT NULL,
  conforme         boolean NOT NULL DEFAULT true,
  remarque         text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Table: stocks_non_medicaux ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stocks_non_medicaux (
  id            text PRIMARY KEY,
  article       text NOT NULL,
  categorie     text NOT NULL CHECK (categorie IN ('Linge', 'Cuisine', 'Fournitures Bureau')),
  quantite      numeric(10,2) NOT NULL DEFAULT 0,
  quantite_min  numeric(10,2) NOT NULL DEFAULT 0,
  unite         text NOT NULL DEFAULT 'unités',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes utiles ────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_fournisseur ON commandes(fournisseur_nom);
CREATE INDEX IF NOT EXISTS idx_livraisons_commande ON livraisons(commande_id);
CREATE INDEX IF NOT EXISTS idx_stocks_categorie ON stocks_non_medicaux(categorie);

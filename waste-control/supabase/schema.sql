-- ════════════════════════════════════════════════════════════════════════
-- Waste-Control — Schéma Supabase
-- Hôpital Ndamatou de Touba, Sénégal · Gestion des Déchets Médicaux (DASRI)
-- ════════════════════════════════════════════════════════════════════════
-- NOTE: Row Level Security (RLS) n'est PAS configuré dans ce script.
-- Avant toute mise en production, activez RLS sur chaque table et définissez
-- des policies adaptées aux rôles applicatifs (agent, superviseur, hygieniste, admin).
-- ════════════════════════════════════════════════════════════════════════

-- ── Table: collectes ───────────────────────────────────────────────────────
create table if not exists collectes (
  id                text primary key,
  code_barre        text not null unique,
  zone              text not null,
  type_dechet       text not null check (type_dechet in (
                      'DASRI Infectieux', 'DASRI Piquant-Coupant',
                      'Pharmaceutique', 'Chimique', 'Assimilé Ménager'
                    )),
  poids_kg          numeric(10,2) not null default 0,
  date_collecte      timestamptz not null default now(),
  collecteur        text not null,
  statut            text not null default 'En attente' check (statut in (
                      'En attente', 'Collecté', 'Stocké', 'Détruit'
                    )),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ── Table: containers ───────────────────────────────────────────────────────
create table if not exists containers (
  id                     text primary key,
  zone                   text not null,
  service                text not null,
  capacite_kg            numeric(10,2) not null default 0,
  niveau_remplissage_pct numeric(5,2) not null default 0 check (niveau_remplissage_pct between 0 and 100),
  dernier_vidage         date,
  type_dechet            text not null check (type_dechet in (
                           'DASRI Infectieux', 'DASRI Piquant-Coupant',
                           'Pharmaceutique', 'Chimique', 'Assimilé Ménager'
                         )),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ── Table: destructions ──────────────────────────────────────────────────────
create table if not exists destructions (
  id                  text primary key,
  numero_lot          text not null unique,
  collectes_ids       text[] not null default '{}',
  date_incineration    date not null,
  poids_total_kg       numeric(10,2) not null default 0,
  numero_certificat   text not null unique,
  operateur           text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────
create index if not exists idx_collectes_statut     on collectes (statut);
create index if not exists idx_collectes_type        on collectes (type_dechet);
create index if not exists idx_containers_niveau     on containers (niveau_remplissage_pct);
create index if not exists idx_destructions_date     on destructions (date_incineration);

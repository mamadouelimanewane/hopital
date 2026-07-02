-- ══════════════════════════════════════════════════════════════
-- Mater-Neo — Schema Supabase
-- Maternité & Néonatologie · Hôpital Ndamatou, Touba, Sénégal
-- Développé par Processingenierie
-- ══════════════════════════════════════════════════════════════

-- NOTE : Row Level Security (RLS) n'est PAS configuré dans ce schéma.
-- Avant tout déploiement en production avec des données patientes réelles,
-- activez RLS sur chaque table et définissez des politiques d'accès
-- appropriées (ex: par rôle utilisateur, par service hospitalier).

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ── Grossesses ───────────────────────────────────────────────
create table if not exists grossesses (
  id                          text primary key,
  patiente_nom                text not null,
  age                         int not null,
  terme                       int not null, -- semaines d'aménorrhée
  date_prevue_accouchement    text not null,
  groupe_sanguin              text not null,
  grossesse_risque            boolean not null default false,
  suivi                       text not null default 'Normal' check (suivi in ('Normal','Surveillance','Risque Élevé')),
  dernier_rdv                 text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- ── Accouchements ────────────────────────────────────────────
create table if not exists accouchements (
  id              text primary key,
  patiente_nom    text not null,
  date            text not null,
  type            text not null check (type in ('Voie basse','Césarienne')),
  complications   text default 'Aucune',
  sage_femme      text,
  poids_bebe      int not null,
  apgar           int not null check (apgar between 0 and 10),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Nouveau-nés ──────────────────────────────────────────────
create table if not exists nouveau_nes (
  id               text primary key,
  nom_mere         text not null,
  date_naissance   text not null,
  sexe             text not null check (sexe in ('M','F')),
  poids            int not null, -- grammes
  apgar_score      int not null check (apgar_score between 0 and 10),
  couveuse_id      text,
  statut           text not null default 'En chambre' check (statut in ('En chambre','Néonatologie','Sorti')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Couveuses ────────────────────────────────────────────────
create table if not exists couveuses (
  id               text primary key, -- ex: CV-01 à CV-15
  statut           text not null default 'Libre' check (statut in ('Libre','Occupée','Maintenance')),
  occupant_nom     text,
  date_admission   text,
  poids_actuel     int,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Index utiles ─────────────────────────────────────────────
create index if not exists idx_grossesses_suivi on grossesses (suivi);
create index if not exists idx_accouchements_type on accouchements (type);
create index if not exists idx_nouveau_nes_statut on nouveau_nes (statut);
create index if not exists idx_couveuses_statut on couveuses (statut);

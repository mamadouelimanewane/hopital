-- DMP-Gateway — Schéma Supabase
-- Hôpital Ndamatou de Touba, Sénégal · Développé par Processingenierie
--
-- NOTE IMPORTANTE : Row Level Security (RLS) doit être configuré avant toute
-- mise en production. Ce schéma ne définit aucune politique RLS — par défaut,
-- les tables sont donc accessibles sans restriction via la clé anonyme.
-- Ajoutez des policies adaptées (par rôle, par hôpital, etc.) avant déploiement réel.

-- ── Table : dossiers_patients ────────────────────────────────────────────
create table if not exists dossiers_patients (
  id                text primary key,
  nom_patient       text not null,
  hopital_origine   text not null,
  derniere_synchro  timestamptz not null default now(),
  statut_synchro    text not null check (statut_synchro in ('Synchronisé', 'En attente', 'Erreur')),
  nombre_documents  integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ── Table : connecteurs ──────────────────────────────────────────────────
create table if not exists connecteurs (
  id               text primary key,
  nom              text not null,
  type             text not null check (type in ('HL7 v2', 'FHIR R4')),
  hopital_distant  text not null,
  statut           text not null check (statut in ('Actif', 'Inactif', 'Erreur')),
  dernier_ping     timestamptz not null default now(),
  latence_ms       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Table : logs_synchro ─────────────────────────────────────────────────
create table if not exists logs_synchro (
  id               text primary key,
  connecteur_nom   text not null,
  date             timestamptz not null default now(),
  type_evenement   text not null check (type_evenement in ('Synchronisation', 'Erreur', 'Reconnexion')),
  statut           text not null check (statut in ('Succès', 'Échec')),
  message          text,
  created_at       timestamptz not null default now()
);

-- ── Index utiles ──────────────────────────────────────────────────────────
create index if not exists idx_dossiers_statut on dossiers_patients (statut_synchro);
create index if not exists idx_connecteurs_statut on connecteurs (statut);
create index if not exists idx_logs_date on logs_synchro (date desc);

-- ── Rappel sécurité ───────────────────────────────────────────────────────
-- alter table dossiers_patients enable row level security;
-- alter table connecteurs enable row level security;
-- alter table logs_synchro enable row level security;
-- -- puis créer des policies adaptées (select/insert/update/delete) selon les rôles applicatifs.

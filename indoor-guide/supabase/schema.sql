-- ════════════════════════════════════════════════════════════════
-- Indoor-Guide — Schéma Supabase / PostgreSQL
-- Hôpital Ndamatou de Touba, Sénégal — Processingenierie
--
-- NOTE IMPORTANTE : Aucune politique RLS (Row Level Security) n'est
-- définie ici. Avant toute mise en production, configurez RLS sur
-- chaque table (ex: ALTER TABLE ... ENABLE ROW LEVEL SECURITY;) et
-- créez des policies adaptées aux rôles applicatifs.
-- ════════════════════════════════════════════════════════════════

-- Extension utile pour générer des UUID (si non déjà activée)
create extension if not exists "pgcrypto";

-- ── Table: visiteurs ────────────────────────────────────────────
create table if not exists visiteurs (
  id               text primary key default gen_random_uuid()::text,
  nom              text not null,
  badge_numero     text not null,
  service_visite   text not null,
  patient_visite   text not null,
  heure_entree     text not null,
  heure_sortie     text,
  statut           text not null default 'En visite' check (statut in ('En visite', 'Sorti')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Table: zones ────────────────────────────────────────────────
create table if not exists zones (
  id               text primary key default gen_random_uuid()::text,
  nom              text not null,
  batiment         text not null,
  etage            text not null,
  categorie        text not null check (categorie in ('Consultation', 'Urgences', 'Hospitalisation', 'Administration', 'Services')),
  coord_x          numeric not null check (coord_x >= 0 and coord_x <= 100),
  coord_y          numeric not null check (coord_y >= 0 and coord_y <= 100),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Table: places_parking ───────────────────────────────────────
create table if not exists places_parking (
  id               text primary key default gen_random_uuid()::text,
  numero           text not null,
  zone             text not null check (zone in ('Visiteurs', 'Personnel', 'Ambulances')),
  statut           text not null default 'Libre' check (statut in ('Libre', 'Occupée', 'Réservée')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Index utiles ────────────────────────────────────────────────
create index if not exists idx_visiteurs_statut on visiteurs(statut);
create index if not exists idx_zones_categorie on zones(categorie);
create index if not exists idx_places_parking_zone on places_parking(zone);
create index if not exists idx_places_parking_statut on places_parking(statut);

-- ═══════════════════════════════════════════════════════════════════════
-- Morgue-Sync — Schéma de base de données
-- Hôpital Ndamatou de Touba, Sénégal
-- ═══════════════════════════════════════════════════════════════════════
--
-- NOTE IMPORTANTE : ce schéma ne configure aucune politique RLS
-- (Row Level Security). Avant toute mise en production, il est
-- indispensable de définir des politiques RLS adaptées afin de
-- restreindre l'accès aux données selon le rôle de l'utilisateur.

-- ── Table : defunts ────────────────────────────────────────────────────
-- (la contrainte de clé étrangère vers "casiers" est ajoutée plus bas,
-- une fois la table "casiers" créée, pour éviter une référence circulaire)
create table if not exists defunts (
  id                    text primary key,
  nom                   text not null,
  date_deces            date not null,
  service               text not null,
  casier_id             text,
  statut_demarches      text not null default 'En attente'
                        check (statut_demarches in ('En attente', 'En cours', 'Finalisées')),
  date_admission_morgue date not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ── Table : casiers ─────────────────────────────────────────────────────
create table if not exists casiers (
  id           text primary key,
  numero       text not null unique,
  statut       text not null default 'Libre'
               check (statut in ('Libre', 'Occupé', 'Maintenance')),
  temperature  numeric(4,1) not null default 4.0,
  occupant_id  text references defunts(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Ajout de la clé étrangère différée defunts.casier_id → casiers.id
alter table defunts
  add constraint fk_defunts_casier
  foreign key (casier_id) references casiers(id) on delete set null;

-- ── Table : demarches ────────────────────────────────────────────────────
create table if not exists demarches (
  id            text primary key,
  defunt_id     text not null references defunts(id) on delete cascade,
  defunt_nom    text not null,
  type          text not null
                check (type in ('Certificat de décès', 'Autorisation de transfert', 'Autorisation d''inhumation')),
  statut        text not null default 'En attente'
                check (statut in ('En attente', 'En cours', 'Émise')),
  date_emission date,
  responsable   text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Table : familles (accompagnement) ─────────────────────────────────────
create table if not exists familles (
  id            text primary key,
  defunt_id     text not null references defunts(id) on delete cascade,
  defunt_nom    text not null,
  contact_nom   text not null,
  lien_parente  text not null,
  telephone     text not null,
  date_visite   date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Index utiles ──────────────────────────────────────────────────────────
create index if not exists idx_defunts_statut on defunts (statut_demarches);
create index if not exists idx_demarches_defunt on demarches (defunt_id);
create index if not exists idx_demarches_statut on demarches (statut);
create index if not exists idx_familles_defunt on familles (defunt_id);

-- Rappel : activer et configurer RLS avant la mise en production, par
-- exemple :
--   alter table defunts enable row level security;
--   alter table casiers enable row level security;
--   alter table demarches enable row level security;
--   alter table familles enable row level security;
-- puis créer des policies adaptées aux rôles (agent, responsable, medecin, admin).

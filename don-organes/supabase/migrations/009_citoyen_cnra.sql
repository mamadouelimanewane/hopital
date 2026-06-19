-- Migration 009 — CitoyenCNRA
-- Portail public citoyen du CNRA Sénégal
-- Run in Supabase Dashboard > SQL Editor
-- NOTE : Ce projet partage le même projet Supabase que mediabase/mediawatch/electrowatch.
--        Les tables medias, campagnes, interventions, alertes sont créées par d'autres migrations.
--        Ce fichier crée uniquement les tables propres au portail citoyen.

-- ─────────────────────────────────────────────
-- 1. Signalements citoyens
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS signalements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_dossier    VARCHAR(20) UNIQUE NOT NULL DEFAULT 'CNRA-' || LPAD(FLOOR(random() * 999999)::TEXT, 6, '0'),
  type_infraction   VARCHAR(60) NOT NULL
                      CHECK (type_infraction IN ('desequilibre','contenu_partisan','temps_non_declare','autre')),
  description       TEXT NOT NULL,
  media_concerne    VARCHAR(200),
  date_observation  DATE,
  nom_signalant     VARCHAR(200),
  email_signalant   VARCHAR(200),
  telephone         VARCHAR(30),
  anonyme           BOOLEAN DEFAULT false,
  statut            VARCHAR(30) NOT NULL DEFAULT 'recu'
                      CHECK (statut IN ('recu','en_cours','traite','classe','transmis_med')),
  priorite          VARCHAR(20) DEFAULT 'normale'
                      CHECK (priorite IN ('faible','normale','haute','urgente')),
  reponse_cnra      TEXT,
  date_reponse      TIMESTAMPTZ,
  agent_traitement  VARCHAR(200),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-incrément du numéro de dossier propre
CREATE SEQUENCE IF NOT EXISTS signalement_seq START 1;

CREATE OR REPLACE FUNCTION set_signalement_numero()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.numero_dossier := 'CNRA-' || LPAD(nextval('signalement_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_signalement_numero ON signalements;
CREATE TRIGGER trg_signalement_numero
  BEFORE INSERT ON signalements
  FOR EACH ROW EXECUTE FUNCTION set_signalement_numero();

-- ─────────────────────────────────────────────
-- 2. Pétitions citoyennes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS petitions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre                 VARCHAR(500) NOT NULL,
  description           TEXT NOT NULL,
  auteur                VARCHAR(300),
  email_auteur          VARCHAR(200),
  categorie             VARCHAR(100) NOT NULL DEFAULT 'Pluralisme',
  objectif_signatures   INTEGER NOT NULL DEFAULT 1000 CHECK (objectif_signatures >= 100),
  nb_signatures         INTEGER NOT NULL DEFAULT 0,
  statut                VARCHAR(30) NOT NULL DEFAULT 'en_attente'
                          CHECK (statut IN ('en_attente','active','acceptee','rejetee','expiree')),
  date_expiration       DATE,
  reponse_cnra          TEXT,
  date_reponse_cnra     TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. Signatures de pétitions (une par adresse IP / email)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS signatures_petition (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  petition_id   UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
  nom           VARCHAR(200),
  email         VARCHAR(200),
  ip_hash       VARCHAR(64),          -- SHA-256 de l'IP, jamais l'IP brute
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(petition_id, ip_hash)        -- empêche un double vote depuis la même IP
);

-- Trigger : incrémente nb_signatures sur chaque signature
CREATE OR REPLACE FUNCTION increment_nb_signatures()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE petitions SET nb_signatures = nb_signatures + 1, updated_at = NOW()
  WHERE id = NEW.petition_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_signature_count ON signatures_petition;
CREATE TRIGGER trg_signature_count
  AFTER INSERT ON signatures_petition
  FOR EACH ROW EXECUTE FUNCTION increment_nb_signatures();

-- ─────────────────────────────────────────────
-- 4. Journal des consultations (analytics light, RGPD-friendly)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consultations_portail (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section     VARCHAR(60) NOT NULL,   -- accueil, observatoire, decisions, medias, education
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. Abonnements aux alertes citoyennes (opt-in newsletter)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS abonnements_alertes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(200) NOT NULL UNIQUE,
  themes      TEXT[] DEFAULT '{}',   -- pluralisme, elections, sanctions, deepfakes
  actif       BOOLEAN DEFAULT true,
  token_desinscription VARCHAR(64) UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Seed data
-- ─────────────────────────────────────────────
INSERT INTO petitions (titre, description, auteur, categorie, objectif_signatures, nb_signatures, statut) VALUES
(
  'Pour l''équité du temps de parole sur RTS1 pendant les campagnes',
  'Nous demandons au CNRA de renforcer les contrôles sur RTS1 et d''imposer une répartition équitable du temps de parole entre tous les partis politiques enregistrés.',
  'Coalition Médias Équitables',
  'Pluralisme',
  5000, 3847, 'active'
),
(
  'Transparence des sanctions CNRA — Publication obligatoire sous 48h',
  'Toutes les décisions et sanctions prononcées par le CNRA doivent être publiées dans un délai de 48h sur le portail officiel.',
  'Association Presse Libre SN',
  'Transparence',
  2000, 2000, 'acceptee'
),
(
  'Accès aux fréquences radio pour les médias communautaires ruraux',
  'Plaidoyer pour l''attribution de fréquences aux radios communautaires rurales afin de garantir l''accès à l''information dans toutes les régions du Sénégal.',
  'Réseau Radios Communautaires',
  'Accès à l''info',
  10000, 6234, 'active'
),
(
  'Contre la concentration excessive des médias privés',
  'Limiter la propriété croisée des médias pour préserver le pluralisme de l''information et éviter les monopoles médiatiques.',
  'Journalistes Sans Frontières SN',
  'Pluralisme',
  3000, 1245, 'active'
)
ON CONFLICT DO NOTHING;

INSERT INTO signalements (type_infraction, description, media_concerne, date_observation, anonyme, statut, priorite) VALUES
(
  'desequilibre',
  'Durant le journal de 20h du 10/06/2026, le parti au pouvoir a bénéficié de 18 minutes de temps d''antenne contre 2 minutes pour les partis d''opposition réunis.',
  'RTS1',
  '2026-06-10',
  true, 'en_cours', 'haute'
),
(
  'contenu_partisan',
  'L''émission « Débat du soir » du 08/06/2026 a exclusivement invité des membres du gouvernement sans représentant de l''opposition.',
  'TFM',
  '2026-06-08',
  false, 'recu', 'normale'
)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- RLS (Row Level Security)
-- ─────────────────────────────────────────────
ALTER TABLE signalements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE petitions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures_petition  ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations_portail ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonnements_alertes  ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'signalements',
    'petitions',
    'signatures_petition',
    'consultations_portail',
    'abonnements_alertes'
  ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "anon_read_%s"   ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "anon_insert_%s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "anon_update_%s" ON %I', t, t);

    -- Lecture publique sur petitions, consultations
    IF t IN ('petitions', 'consultations_portail') THEN
      EXECUTE format('CREATE POLICY "anon_read_%s" ON %I FOR SELECT TO anon USING (true)', t, t);
    END IF;

    -- Lecture restreinte : signalements lisibles seulement si non anonymes OU si on connaît le numéro dossier
    IF t = 'signalements' THEN
      EXECUTE format('CREATE POLICY "anon_read_%s" ON %I FOR SELECT TO anon USING (anonyme = false)', t, t);
    END IF;

    -- Insertion publique sur toutes les tables (formulaires citoyens)
    EXECUTE format('CREATE POLICY "anon_insert_%s" ON %I FOR INSERT TO anon WITH CHECK (true)', t, t);
  END LOOP;
END $$;

-- Mise à jour uniquement par service_role (agents CNRA) — pas de policy UPDATE pour anon
-- Les agents CNRA utilisent la clé service_role pour traiter les signalements

-- ============================================================
-- CNRA ElectroWatch — Migration 002
-- Sanctions, mises en demeure, signalements, logs notifications
-- ============================================================

-- ─── Mises en demeure ────────────────────────────────────────
CREATE TABLE mises_en_demeure (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alerte_id       UUID NOT NULL REFERENCES alertes(id) ON DELETE CASCADE,
  media_id        UUID NOT NULL REFERENCES medias(id),
  campagne_id     UUID NOT NULL REFERENCES campagnes(id),
  motif           TEXT NOT NULL,
  contenu         TEXT NOT NULL,
  date_envoi      DATE NOT NULL DEFAULT CURRENT_DATE,
  delai_reponse   INTEGER NOT NULL DEFAULT 15,
  statut          TEXT NOT NULL DEFAULT 'envoyee' CHECK (statut IN ('envoyee','reponse_recue','sans_suite')),
  creee_par       UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Sanctions ────────────────────────────────────────────────
CREATE TABLE sanctions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mise_en_demeure_id UUID REFERENCES mises_en_demeure(id),
  media_id        UUID NOT NULL REFERENCES medias(id),
  campagne_id     UUID NOT NULL REFERENCES campagnes(id),
  type_sanction   TEXT NOT NULL CHECK (type_sanction IN ('avertissement','suspension_temporaire','amende','retrait_agrement')),
  montant_fcfa    NUMERIC(15,0),
  duree_jours     INTEGER,
  motif           TEXT NOT NULL,
  decision_numero TEXT,
  date_decision   DATE NOT NULL DEFAULT CURRENT_DATE,
  date_effet      DATE NOT NULL DEFAULT CURRENT_DATE,
  statut          TEXT NOT NULL DEFAULT 'prononcee' CHECK (statut IN ('prononcee','notifiee','executee','annulee')),
  prononcee_par   UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Signalements citoyens ────────────────────────────────────
CREATE TABLE signalements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campagne_id     UUID REFERENCES campagnes(id),
  media_id        UUID REFERENCES medias(id),
  nom_signalant   TEXT,
  email_signalant TEXT,
  telephone       TEXT,
  description     TEXT NOT NULL,
  type_infraction TEXT NOT NULL DEFAULT 'desequilibre' CHECK (type_infraction IN ('desequilibre','contenu_partisan','temps_non_declare','autre')),
  statut          TEXT NOT NULL DEFAULT 'recu' CHECK (statut IN ('recu','en_examen','traite','classe')),
  pieces_jointes  JSONB DEFAULT '[]',
  traite_par      UUID REFERENCES auth.users(id),
  traite_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Log notifications ────────────────────────────────────────
CREATE TABLE notifications_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        TEXT NOT NULL CHECK (type IN ('email','sms')),
  destinataire TEXT NOT NULL,
  sujet       TEXT,
  contenu     TEXT NOT NULL,
  statut      TEXT NOT NULL DEFAULT 'envoye' CHECK (statut IN ('envoye','echec','en_attente')),
  reference_id UUID,
  reference_type TEXT,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Contacts CNRA (destinataires notifications) ──────────────
CREATE TABLE contacts_cnra (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom         TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  telephone   TEXT,
  role        TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('directeur','chef_service','agent','observateur_externe')),
  actif       BOOLEAN NOT NULL DEFAULT true,
  notif_alertes BOOLEAN NOT NULL DEFAULT true,
  notif_rapports BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Index ────────────────────────────────────────────────────
CREATE INDEX idx_sanctions_media       ON sanctions(media_id);
CREATE INDEX idx_sanctions_campagne    ON sanctions(campagne_id);
CREATE INDEX idx_signalements_statut   ON signalements(statut);
CREATE INDEX idx_mises_en_demeure_media ON mises_en_demeure(media_id);

-- ─── RLS ──────────────────────────────────────────────────────
ALTER TABLE mises_en_demeure  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE signalements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_cnra     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_mises_en_demeure"  ON mises_en_demeure  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_all_sanctions"         ON sanctions         FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_all_notifications_log" ON notifications_log FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_all_contacts_cnra"     ON contacts_cnra     FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "public_insert_signalements" ON signalements      FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_signalements"     ON signalements      FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_signalements"   ON signalements      FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ─── Données initiales contacts ───────────────────────────────
INSERT INTO contacts_cnra (nom, email, role, notif_alertes, notif_rapports) VALUES
  ('Directeur Général CNRA', 'dg@cnra.sn', 'directeur', true, true),
  ('Chef Service Monitoring', 'monitoring@cnra.sn', 'chef_service', true, true);

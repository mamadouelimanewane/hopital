-- ============================================================
-- CNRA MediaBase — Migration 003 (version corrigée)
-- ============================================================

-- ─── Groupes médias ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS groupes_media (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom            TEXT NOT NULL,
  type_groupe    TEXT NOT NULL DEFAULT 'prive' CHECK (type_groupe IN ('public','prive','communautaire','religieux','diaspora')),
  pays_origine   TEXT NOT NULL DEFAULT 'Sénégal',
  description    TEXT,
  proprietaire   TEXT,
  annee_creation INTEGER,
  site_web       TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Extension de la table medias ─────────────────────────────
ALTER TABLE medias ADD COLUMN IF NOT EXISTS groupe_id        UUID REFERENCES groupes_media(id);
ALTER TABLE medias ADD COLUMN IF NOT EXISTS date_creation    DATE;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS numero_agrement  TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS date_agrement    DATE;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS frequence        TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS audience_estimee INTEGER;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS couverture       TEXT DEFAULT 'nationale' CHECK (couverture IN ('nationale','regionale','locale','internationale'));
ALTER TABLE medias ADD COLUMN IF NOT EXISTS description      TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS ville            TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS adresse          TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS telephone        TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS email            TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS site_web         TEXT;
ALTER TABLE medias ADD COLUMN IF NOT EXISTS latitude         NUMERIC(9,6);
ALTER TABLE medias ADD COLUMN IF NOT EXISTS longitude        NUMERIC(9,6);
ALTER TABLE medias ADD COLUMN IF NOT EXISTS capital_social   NUMERIC(15,2);
ALTER TABLE medias ADD COLUMN IF NOT EXISTS effectif         INTEGER;

-- ─── Journalistes ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journalistes (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom                TEXT NOT NULL,
  prenom             TEXT NOT NULL,
  media_id           UUID REFERENCES medias(id),
  poste              TEXT,
  specialite         TEXT,
  carte_presse       TEXT UNIQUE,
  date_accreditation DATE,
  email              TEXT,
  telephone          TEXT,
  actif              BOOLEAN NOT NULL DEFAULT true,
  photo_url          TEXT,
  biographie         TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Programmes ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programmes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id       UUID NOT NULL REFERENCES medias(id) ON DELETE CASCADE,
  nom            TEXT NOT NULL,
  categorie      TEXT NOT NULL DEFAULT 'information',
  jour_semaine   TEXT,
  heure_debut    TIME,
  heure_fin      TIME,
  duree_minutes  INTEGER,
  description    TEXT,
  langue         TEXT,
  actif          BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Audits / Contrôles CNRA ──────────────────────────────────
CREATE TABLE IF NOT EXISTS audits_media (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id         UUID NOT NULL REFERENCES medias(id),
  date_audit       DATE NOT NULL DEFAULT CURRENT_DATE,
  type_audit       TEXT NOT NULL DEFAULT 'routine',
  auditeur         TEXT,
  score            INTEGER CHECK (score BETWEEN 0 AND 100),
  resultat         TEXT NOT NULL DEFAULT 'conforme' CHECK (resultat IN ('conforme','non_conforme','partiellement_conforme')),
  observations     TEXT,
  recommandations  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Statistiques d'audience ──────────────────────────────────
CREATE TABLE IF NOT EXISTS stats_audience (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id       UUID NOT NULL REFERENCES medias(id),
  annee          INTEGER NOT NULL,
  trimestre      INTEGER CHECK (trimestre BETWEEN 1 AND 4),
  audience_hebdo BIGINT,
  parts_marche   NUMERIC(5,2),
  reach_mensuel  BIGINT,
  taux_fidelite  NUMERIC(5,2),
  source         TEXT DEFAULT 'CNRA',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Index ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_journalistes_media  ON journalistes(media_id);
CREATE INDEX IF NOT EXISTS idx_programmes_media    ON programmes(media_id);
CREATE INDEX IF NOT EXISTS idx_audits_media        ON audits_media(media_id);
CREATE INDEX IF NOT EXISTS idx_stats_audience_m    ON stats_audience(media_id);

-- ─── RLS ──────────────────────────────────────────────────────
ALTER TABLE groupes_media  ENABLE ROW LEVEL SECURITY;
ALTER TABLE journalistes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits_media   ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_audience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_groupes"      ON groupes_media  FOR SELECT USING (true);
CREATE POLICY "public_read_journalistes" ON journalistes   FOR SELECT USING (true);
CREATE POLICY "public_read_programmes"   ON programmes     FOR SELECT USING (true);
CREATE POLICY "public_read_stats_aud"    ON stats_audience FOR SELECT USING (true);
CREATE POLICY "auth_all_audits"          ON audits_media   FOR ALL    USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_groupes"       ON groupes_media  FOR ALL    USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_journalistes"  ON journalistes   FOR ALL    USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_programmes"    ON programmes     FOR ALL    USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_stats"         ON stats_audience FOR ALL    USING (auth.uid() IS NOT NULL);

-- ─── Seed — Groupes médias ────────────────────────────────────
INSERT INTO groupes_media (nom, type_groupe, pays_origine, proprietaire, annee_creation, description) VALUES
  ('Radiodiffusion Télévision Sénégalaise', 'public', 'Sénégal', 'État du Sénégal', 1962, 'Groupe audiovisuel public national du Sénégal, tutelle du Ministère de la Communication'),
  ('Futurs Médias Group', 'prive', 'Sénégal', 'Youssou Ndour', 1997, 'Groupe médias de Youssou Ndour — TFM, RFM, L''Obs, Futurs Médias'),
  ('Excaf Télécom', 'prive', 'Sénégal', 'Cheikh Mbaye', 2003, 'Groupe de distribution et production audiovisuelle — 2STV, Excaf TV'),
  ('Groupe Walfadjri', 'prive', 'Sénégal', 'Sidy Lamine Niasse', 1984, 'Groupe de presse sénégalais — Walf TV, Walf FM, Walf Quotidien'),
  ('Sen TV Group', 'prive', 'Sénégal', 'Bougane Guèye Dany', 2010, 'Groupe audiovisuel privé sénégalais — Sen TV, 7TV'),
  ('Groupe Sud Communication', 'prive', 'Sénégal', 'Babacar Touré', 1993, 'Groupe de presse indépendant — Sud FM, Sud Quotidien');

-- ─── Enrichissement des médias existants ──────────────────────
UPDATE medias SET
  groupe_id        = (SELECT id FROM groupes_media WHERE nom = 'Radiodiffusion Télévision Sénégalaise'),
  date_creation    = '1972-01-01',
  numero_agrement  = 'CNRA-TV-001',
  audience_estimee = 3500000,
  couverture       = 'nationale',
  description      = 'Première chaîne publique nationale du Sénégal, créée en 1972.',
  frequence        = 'Satellite + Hertzien',
  ville            = 'Dakar',
  latitude         = 14.7167,
  longitude        = -17.4677,
  effectif         = 450
WHERE sigle = 'RTS1';

UPDATE medias SET
  groupe_id        = (SELECT id FROM groupes_media WHERE nom = 'Futurs Médias Group'),
  date_creation    = '2000-06-01',
  numero_agrement  = 'CNRA-TV-007',
  audience_estimee = 2800000,
  couverture       = 'nationale',
  description      = 'Télévision Futurs Médias, chaîne privée généraliste du groupe Youssou Ndour.',
  frequence        = 'Satellite + TNT',
  ville            = 'Dakar',
  effectif         = 280
WHERE sigle = 'TFM';

UPDATE medias SET
  groupe_id        = (SELECT id FROM groupes_media WHERE nom = 'Excaf Télécom'),
  date_creation    = '2003-09-01',
  numero_agrement  = 'CNRA-TV-009',
  audience_estimee = 1900000,
  couverture       = 'nationale',
  description      = '2STV, chaîne privée généraliste du groupe Excaf Télécom.',
  frequence        = 'TNT + Satellite',
  ville            = 'Dakar',
  effectif         = 180
WHERE sigle = '2STV';

UPDATE medias SET
  groupe_id        = (SELECT id FROM groupes_media WHERE nom = 'Sen TV Group'),
  date_creation    = '2010-03-01',
  numero_agrement  = 'CNRA-TV-015',
  audience_estimee = 1200000,
  couverture       = 'nationale',
  description      = 'Sen TV, chaîne d''information continue et de divertissement.',
  ville            = 'Dakar',
  effectif         = 120
WHERE sigle = 'SENTV';

UPDATE medias SET
  groupe_id        = (SELECT id FROM groupes_media WHERE nom = 'Futurs Médias Group'),
  date_creation    = '1997-01-01',
  numero_agrement  = 'CNRA-RAD-003',
  audience_estimee = 4200000,
  couverture       = 'nationale',
  description      = 'Radio Futurs Médias, première radio privée musicale du Sénégal.',
  frequence        = '96.7',
  ville            = 'Dakar',
  effectif         = 95
WHERE sigle = 'RFM';

UPDATE medias SET
  groupe_id        = (SELECT id FROM groupes_media WHERE nom = 'Radiodiffusion Télévision Sénégalaise'),
  date_creation    = '1962-01-01',
  numero_agrement  = 'CNRA-RAD-001',
  audience_estimee = 5000000,
  couverture       = 'nationale',
  description      = 'Radio nationale du Sénégal, la plus ancienne station du pays.',
  frequence        = '92.5',
  ville            = 'Dakar',
  effectif         = 320
WHERE sigle = 'RS';

UPDATE medias SET
  groupe_id        = (SELECT id FROM groupes_media WHERE nom = 'Groupe Sud Communication'),
  date_creation    = '1994-05-01',
  numero_agrement  = 'CNRA-RAD-008',
  audience_estimee = 3100000,
  couverture       = 'nationale',
  description      = 'Sud FM, radio d''information indépendante du groupe Sud Communication.',
  frequence        = '98.5',
  ville            = 'Dakar',
  effectif         = 110
WHERE sigle = 'SUDFM';

-- ─── Seed — Journalistes ──────────────────────────────────────
INSERT INTO journalistes (nom, prenom, media_id, poste, specialite, carte_presse, date_accreditation) VALUES
  ('Diallo',  'Fatou',    (SELECT id FROM medias WHERE sigle='RTS1'),  'Présentatrice',         'Politique',            'CP-2024-001', '2024-01-15'),
  ('Ndiaye',  'Ousmane',  (SELECT id FROM medias WHERE sigle='RTS1'),  'Rédacteur en chef',     'Information générale', 'CP-2024-002', '2024-01-15'),
  ('Seck',    'Aminata',  (SELECT id FROM medias WHERE sigle='TFM'),   'Présentatrice',         'Économie',             'CP-2024-003', '2024-02-01'),
  ('Fall',    'Ibrahima', (SELECT id FROM medias WHERE sigle='TFM'),   'Journaliste',           'Sport',                'CP-2024-004', '2024-02-01'),
  ('Mbaye',   'Rokhaya',  (SELECT id FROM medias WHERE sigle='2STV'),  'Présentatrice',         'Culture',              'CP-2024-005', '2024-02-15'),
  ('Diouf',   'Mamadou',  (SELECT id FROM medias WHERE sigle='RFM'),   'Journaliste',           'Politique',            'CP-2024-006', '2024-03-01'),
  ('Sarr',    'Khady',    (SELECT id FROM medias WHERE sigle='SUDFM'), 'Présentatrice',         'Société',              'CP-2024-007', '2024-03-01'),
  ('Ly',      'Aliou',    (SELECT id FROM medias WHERE sigle='SENTV'), 'Directeur de rédaction','Information',          'CP-2024-008', '2024-03-15');

-- ─── Seed — Programmes ────────────────────────────────────────
INSERT INTO programmes (media_id, nom, categorie, jour_semaine, heure_debut, heure_fin, duree_minutes, langue) VALUES
  ((SELECT id FROM medias WHERE sigle='RTS1'),  'Journal de 20h',      'information',    'lundi',    '20:00', '20:30', 30,  'wolof'),
  ((SELECT id FROM medias WHERE sigle='RTS1'),  'Grand Jury',          'politique',      'dimanche', '10:00', '12:00', 120, 'français'),
  ((SELECT id FROM medias WHERE sigle='TFM'),   'Infos 20h',           'information',    'lundi',    '20:00', '20:35', 35,  'français'),
  ((SELECT id FROM medias WHERE sigle='TFM'),   'Plateau Politique',   'politique',      'vendredi', '21:00', '23:00', 120, 'français'),
  ((SELECT id FROM medias WHERE sigle='RFM'),   'Revue de Presse',     'information',    'lundi',    '07:00', '08:00', 60,  'français'),
  ((SELECT id FROM medias WHERE sigle='RFM'),   'Bonjour Sénégal',     'divertissement', 'lundi',    '06:00', '09:00', 180, 'wolof');

-- ─── Seed — Stats audience ────────────────────────────────────
INSERT INTO stats_audience (media_id, annee, trimestre, audience_hebdo, parts_marche, reach_mensuel, taux_fidelite) VALUES
  ((SELECT id FROM medias WHERE sigle='RTS1'),  2024, 3, 3500000, 28.5, 8000000, 72.0),
  ((SELECT id FROM medias WHERE sigle='TFM'),   2024, 3, 2800000, 22.8, 6500000, 68.0),
  ((SELECT id FROM medias WHERE sigle='RFM'),   2024, 3, 4200000, 34.2, 9000000, 75.5),
  ((SELECT id FROM medias WHERE sigle='2STV'),  2024, 3, 1900000, 15.5, 4200000, 55.0),
  ((SELECT id FROM medias WHERE sigle='SUDFM'), 2024, 3, 3100000, 25.3, 7000000, 71.0),
  ((SELECT id FROM medias WHERE sigle='SENTV'), 2024, 3, 1200000,  9.8, 2800000, 48.0);

-- ─── Seed — Audits ────────────────────────────────────────────
INSERT INTO audits_media (media_id, date_audit, type_audit, auditeur, score, resultat, observations) VALUES
  ((SELECT id FROM medias WHERE sigle='RTS1'),  '2024-09-15', 'routine',             'Equipe CNRA A', 88, 'conforme',               'Respect du cahier des charges. Bonne représentation des genres.'),
  ((SELECT id FROM medias WHERE sigle='TFM'),   '2024-08-20', 'routine',             'Equipe CNRA B', 82, 'conforme',               'Légère sur-représentation des contenus publicitaires en soirée.'),
  ((SELECT id FROM medias WHERE sigle='2STV'),  '2024-07-10', 'suite_signalement',   'Equipe CNRA A', 61, 'partiellement_conforme', 'Dépassement du quota publicitaire signalé par 3 téléspectateurs.'),
  ((SELECT id FROM medias WHERE sigle='RFM'),   '2024-06-05', 'renouvellement',      'Equipe CNRA C', 91, 'conforme',               'Excellent respect du pluralisme et de la diversité musicale.'),
  ((SELECT id FROM medias WHERE sigle='SUDFM'), '2024-05-22', 'routine',             'Equipe CNRA B', 79, 'conforme',               'Couverture satisfaisante des régions. Quelques biais éditoriaux mineurs.'),
  ((SELECT id FROM medias WHERE sigle='SENTV'), '2024-04-18', 'suite_signalement',   'Equipe CNRA A', 45, 'non_conforme',           'Diffusion de contenus non homologués. Mise en demeure émise.');

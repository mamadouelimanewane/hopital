-- ============================================================
-- CNRA EduMedia — Migration 006
-- Éducation aux médias et littératie médiatique
-- ============================================================

-- ─── Établissements partenaires ───────────────────────────────
CREATE TABLE IF NOT EXISTS etablissements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom             TEXT NOT NULL,
  type_etab       TEXT NOT NULL CHECK (type_etab IN ('universite','lycee','college','ecole_primaire','centre_formation','ong','media','autre')),
  region          TEXT NOT NULL,
  ville           TEXT,
  directeur       TEXT,
  contact_email   TEXT,
  contact_tel     TEXT,
  nb_apprenants   INTEGER DEFAULT 0,
  partenaire_depuis DATE DEFAULT CURRENT_DATE,
  actif           BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Ressources pédagogiques ──────────────────────────────────
CREATE TABLE IF NOT EXISTS ressources (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre           TEXT NOT NULL,
  type_ressource  TEXT NOT NULL CHECK (type_ressource IN ('guide','video','podcast','infographie','fiche','exercice','etude_de_cas')),
  categorie       TEXT NOT NULL CHECK (categorie IN ('litteratie_mediatique','fake_news','droit_medias','journalisme','numerique','regulation','autre')),
  niveau          TEXT NOT NULL DEFAULT 'tous' CHECK (niveau IN ('primaire','secondaire','superieur','professionnel','tous')),
  langue          TEXT NOT NULL DEFAULT 'fr' CHECK (langue IN ('fr','wo','ff','sr','autre')),
  auteur          TEXT,
  url             TEXT,
  description     TEXT,
  nb_telechargements INTEGER DEFAULT 0,
  date_publication DATE DEFAULT CURRENT_DATE,
  actif           BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Modules de formation ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules_formation (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre           TEXT NOT NULL,
  description     TEXT,
  objectifs       TEXT[],
  niveau          TEXT NOT NULL DEFAULT 'tous',
  duree_heures    NUMERIC(4,1),
  nb_lecons       INTEGER DEFAULT 0,
  categorie       TEXT NOT NULL,
  formateur       TEXT,
  certifiant      BOOLEAN DEFAULT false,
  nb_inscrits     INTEGER DEFAULT 0,
  note_moyenne    NUMERIC(3,1),
  date_creation   DATE DEFAULT CURRENT_DATE,
  actif           BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Sessions de formation ────────────────────────────────────
CREATE TABLE IF NOT EXISTS formations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id       UUID REFERENCES modules_formation(id),
  etablissement_id UUID REFERENCES etablissements(id),
  titre           TEXT NOT NULL,
  formateur       TEXT,
  date_debut      DATE NOT NULL,
  date_fin        DATE,
  lieu            TEXT,
  modalite        TEXT NOT NULL DEFAULT 'presentiel' CHECK (modalite IN ('presentiel','distanciel','hybride')),
  nb_participants INTEGER DEFAULT 0,
  nb_certifies    INTEGER DEFAULT 0,
  statut          TEXT NOT NULL DEFAULT 'planifiee' CHECK (statut IN ('planifiee','en_cours','terminee','annulee')),
  note_satisfaction NUMERIC(3,1),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Quiz / Évaluations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre           TEXT NOT NULL,
  module_id       UUID REFERENCES modules_formation(id),
  niveau          TEXT NOT NULL DEFAULT 'tous',
  nb_questions    INTEGER DEFAULT 0,
  duree_minutes   INTEGER,
  score_minimum   INTEGER DEFAULT 60,
  nb_passages     INTEGER DEFAULT 0,
  taux_reussite   NUMERIC(5,2),
  actif           BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Certificats délivrés ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificats (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero          TEXT UNIQUE NOT NULL,
  formation_id    UUID REFERENCES formations(id),
  module_id       UUID REFERENCES modules_formation(id),
  beneficiaire    TEXT NOT NULL,
  etablissement   TEXT,
  score_obtenu    INTEGER,
  date_delivrance DATE DEFAULT CURRENT_DATE,
  valide_jusqu_au DATE,
  statut          TEXT NOT NULL DEFAULT 'valide' CHECK (statut IN ('valide','expire','revoque')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Index ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_etab_region      ON etablissements(region);
CREATE INDEX IF NOT EXISTS idx_ressources_cat   ON ressources(categorie);
CREATE INDEX IF NOT EXISTS idx_formations_statut ON formations(statut);
CREATE INDEX IF NOT EXISTS idx_certificats_num  ON certificats(numero);

-- ─── RLS ──────────────────────────────────────────────────────
ALTER TABLE etablissements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ressources          ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules_formation   ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz                ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificats         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_etab"     ON etablissements    FOR SELECT USING (true);
CREATE POLICY "public_read_ressources" ON ressources      FOR SELECT USING (true);
CREATE POLICY "public_read_modules"  ON modules_formation FOR SELECT USING (true);
CREATE POLICY "public_read_formations" ON formations      FOR SELECT USING (true);
CREATE POLICY "public_read_quiz"     ON quiz              FOR SELECT USING (true);
CREATE POLICY "public_read_certs"    ON certificats       FOR SELECT USING (true);
CREATE POLICY "auth_write_etab"      ON etablissements    FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_ressources" ON ressources       FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_modules"   ON modules_formation FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_formations" ON formations       FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_quiz"      ON quiz              FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_write_certs"     ON certificats       FOR ALL USING (auth.uid() IS NOT NULL);

-- ─── Seed — Établissements ────────────────────────────────────
INSERT INTO etablissements (nom, type_etab, region, ville, directeur, nb_apprenants, partenaire_depuis) VALUES
  ('Université Cheikh Anta Diop de Dakar', 'universite', 'Dakar', 'Dakar', 'Pr. Ibrahima Thioub', 80000, '2022-09-01'),
  ('Université Gaston Berger de Saint-Louis', 'universite', 'Saint-Louis', 'Saint-Louis', 'Pr. Oumar Sock', 18000, '2022-09-01'),
  ('Lycée Blaise Diagne', 'lycee', 'Dakar', 'Dakar', 'M. Mamadou Diallo', 3200, '2023-01-15'),
  ('Lycée de Ziguinchor', 'lycee', 'Ziguinchor', 'Ziguinchor', 'Mme Aïssatou Badji', 1800, '2023-03-01'),
  ('Lycée Kennedy', 'lycee', 'Dakar', 'Dakar', 'M. Ousmane Ndiaye', 2700, '2023-01-15'),
  ('CESTI — Centre d''Études des Sciences et Techniques de l''Information', 'centre_formation', 'Dakar', 'Dakar', 'M. Ibrahima Sarr', 450, '2022-06-01'),
  ('École Supérieure de Journalisme (ESJ)', 'centre_formation', 'Dakar', 'Dakar', 'Mme Fatou Diagne', 320, '2022-06-01'),
  ('ONG Aide Transparence', 'ong', 'Dakar', 'Dakar', 'M. Cheikh Fall', 0, '2023-06-01'),
  ('RTS — Radio Télévision Sénégalaise', 'media', 'Dakar', 'Dakar', 'M. Pape Alé Niang', 0, '2023-09-01'),
  ('Collège d''Enseignement Moyen de Thiès', 'college', 'Thiès', 'Thiès', 'Mme Rokhaya Sow', 1200, '2023-10-01');

-- ─── Seed — Ressources ────────────────────────────────────────
INSERT INTO ressources (titre, type_ressource, categorie, niveau, langue, auteur, description, nb_telechargements, date_publication) VALUES
  ('Guide pratique — Détecter les fausses informations', 'guide', 'fake_news', 'tous', 'fr', 'CNRA / Cellule EduMedia', 'Manuel complet de 48 pages pour identifier, vérifier et démonter les fausses informations. Exemples sénégalais.', 1247, '2023-09-15'),
  ('Vidéo — Comment fonctionne un deepfake ?', 'video', 'litteratie_mediatique', 'secondaire', 'fr', 'CNRA EduMedia', 'Vidéo pédagogique de 12 minutes expliquant le fonctionnement des deepfakes avec animations et cas concrets.', 3892, '2024-01-20'),
  ('Infographie — Les 5 réflexes du citoyen numérique', 'infographie', 'numerique', 'tous', 'fr', 'CNRA / ARTP', 'Poster pédagogique illustrant les 5 comportements clés face à l''information numérique. Disponible en A2 et A4.', 5631, '2023-11-01'),
  ('Fiche — Droits et devoirs des médias audiovisuels au Sénégal', 'fiche', 'droit_medias', 'superieur', 'fr', 'Direction Juridique CNRA', 'Fiche de synthèse sur le cadre réglementaire des médias : loi 2017-27, code de la presse, RLS.', 876, '2023-07-10'),
  ('Podcast — Médias et démocratie en Afrique de l''Ouest', 'podcast', 'journalisme', 'tous', 'fr', 'CNRA EduMedia × WACC', 'Série de 6 épisodes (30 min chacun) sur le rôle des médias dans la consolidation de la démocratie.', 2104, '2024-03-01'),
  ('Guide en wolof — Xam-xam ci médias yi', 'guide', 'litteratie_mediatique', 'tous', 'wo', 'CNRA EduMedia', 'Guide d''éducation aux médias traduit en wolof pour les communautés non-francophones. 32 pages illustrées.', 1893, '2024-02-14'),
  ('Étude de cas — Campagne de désinformation élections 2024', 'etude_de_cas', 'fake_news', 'superieur', 'fr', 'Cellule CNRA AntiDeep', 'Analyse détaillée des campagnes de désinformation lors des élections législatives. Méthodologie et enseignements.', 432, '2025-01-10'),
  ('Exercice — Vérifier une source en 3 étapes', 'exercice', 'litteratie_mediatique', 'secondaire', 'fr', 'CNRA EduMedia', 'Fiche d''exercice pratique pour apprendre à évaluer la fiabilité d''une source. Avec corrigé pédagogue.', 2891, '2023-10-05');

-- ─── Seed — Modules de formation ──────────────────────────────
INSERT INTO modules_formation (titre, description, objectifs, niveau, duree_heures, nb_lecons, categorie, formateur, certifiant, nb_inscrits, note_moyenne) VALUES
  ('Littératie médiatique — Niveau 1', 'Introduction aux fondamentaux de la littératie médiatique : comprendre les médias, leur fonctionnement et leur influence.', ARRAY['Identifier les types de médias','Comprendre les biais médiatiques','Évaluer la crédibilité d''une source'], 'tous', 6.0, 8, 'litteratie_mediatique', 'CNRA EduMedia', false, 1243, 4.6),
  ('Détection des fausses informations', 'Module pratique de fact-checking et de détection des infox. Outils en ligne, méthodologie de vérification.', ARRAY['Maîtriser les outils de fact-checking','Identifier les techniques de manipulation','Vérifier images et vidéos'], 'secondaire', 4.5, 6, 'fake_news', 'Cellule CNRA AntiDeep', true, 892, 4.8),
  ('Droit des médias au Sénégal', 'Module juridique sur la réglementation audiovisuelle : cadre légal, droits, obligations, sanctions.', ARRAY['Connaître la loi 2017-27','Comprendre le rôle du CNRA','Identifier les obligations des médias'], 'superieur', 8.0, 10, 'droit_medias', 'Direction Juridique CNRA', true, 567, 4.4),
  ('Journalisme numérique et réseaux sociaux', 'Formation aux nouvelles pratiques journalistiques à l''ère du numérique : live, réseaux sociaux, podcasts.', ARRAY['Maîtriser les outils numériques','Gérer sa présence en ligne','Appliquer la déontologie en ligne'], 'professionnel', 12.0, 15, 'journalisme', 'CESTI / ESJ Dakar', true, 334, 4.7),
  ('Éducation aux médias pour les jeunes', 'Module adapté aux collégiens et lycéens : décrypter la publicité, comprendre les algorithmes, cultiver l''esprit critique.', ARRAY['Décrypter les images médiatiques','Comprendre les réseaux sociaux','Développer l''esprit critique'], 'secondaire', 3.0, 5, 'litteratie_mediatique', 'CNRA EduMedia', false, 2187, 4.9);

-- ─── Seed — Formations (sessions) ────────────────────────────
INSERT INTO formations (titre, formateur, date_debut, date_fin, lieu, modalite, nb_participants, nb_certifies, statut, note_satisfaction) VALUES
  ('Atelier Fact-checking — Lycée Blaise Diagne', 'Mme Aminata Sow (CNRA)', '2024-10-14', '2024-10-16', 'Lycée Blaise Diagne, Dakar', 'presentiel', 120, 98, 'terminee', 4.7),
  ('Formation CESTI — Droit des médias avancé', 'M. El Hadj Diaw (Direction juridique)', '2024-11-04', '2024-11-08', 'CESTI, Dakar', 'presentiel', 45, 41, 'terminee', 4.5),
  ('Webinaire — Littératie médiatique en wolof', 'M. Oumar Faye (CNRA)', '2024-12-10', '2024-12-10', 'En ligne', 'distanciel', 387, 0, 'terminee', 4.8),
  ('Formation UGB — Journalisme numérique', 'Mme Rokhaya Diop (ESJ)', '2025-02-17', '2025-02-21', 'UGB, Saint-Louis', 'hybride', 89, 76, 'terminee', 4.6),
  ('Atelier lycées Dakar — Deepfakes et désinformation', 'M. Ibrahima Kane (CNRA)', '2025-04-07', '2025-04-11', 'CNRA, Dakar', 'presentiel', 210, 0, 'terminee', 4.9),
  ('Session UCAD — Module Littératie Niveau 1', 'CNRA EduMedia', '2025-06-23', '2025-06-27', 'UCAD, Dakar', 'presentiel', 65, 0, 'planifiee', NULL),
  ('Webinaire national — Médias et élections', 'Panel CNRA / CENA / ARTP', '2025-07-15', '2025-07-15', 'En ligne', 'distanciel', 0, 0, 'planifiee', NULL);

-- ─── Seed — Quiz ──────────────────────────────────────────────
INSERT INTO quiz (titre, niveau, nb_questions, duree_minutes, score_minimum, nb_passages, taux_reussite) VALUES
  ('Quiz — Identifier une fausse information', 'tous', 15, 20, 70, 4231, 74.2),
  ('Quiz — Droit des médias sénégalais', 'superieur', 20, 30, 60, 1892, 61.8),
  ('Quiz — Comprendre les deepfakes', 'secondaire', 10, 15, 65, 3104, 82.1),
  ('Quiz certifiant — Littératie médiatique niveau 1', 'tous', 30, 45, 75, 987, 68.4),
  ('Quiz — Journalisme numérique et éthique', 'professionnel', 25, 35, 70, 445, 71.2);

-- ─── Seed — Certificats ───────────────────────────────────────
INSERT INTO certificats (numero, beneficiaire, etablissement, score_obtenu, date_delivrance, valide_jusqu_au, statut) VALUES
  ('CNRA-EDU-2024-001', 'Aminata Diallo', 'Lycée Blaise Diagne', 92, '2024-10-16', '2027-10-16', 'valide'),
  ('CNRA-EDU-2024-002', 'Moussa Ndiaye', 'CESTI Dakar', 87, '2024-11-08', '2027-11-08', 'valide'),
  ('CNRA-EDU-2024-003', 'Fatou Sarr', 'CESTI Dakar', 79, '2024-11-08', '2027-11-08', 'valide'),
  ('CNRA-EDU-2025-001', 'Ibrahima Sow', 'UGB Saint-Louis', 95, '2025-02-21', '2028-02-21', 'valide'),
  ('CNRA-EDU-2025-002', 'Rokhaya Fall', 'UGB Saint-Louis', 83, '2025-02-21', '2028-02-21', 'valide'),
  ('CNRA-EDU-2025-003', 'Cheikh Diop', 'UGB Saint-Louis', 91, '2025-02-21', '2028-02-21', 'valide'),
  ('CNRA-EDU-2025-004', 'Mariama Ba', 'UCAD Dakar', 88, '2025-03-10', '2028-03-10', 'valide'),
  ('CNRA-EDU-2025-005', 'Abdoulaye Gaye', 'ESJ Dakar', 76, '2025-04-05', '2028-04-05', 'valide');

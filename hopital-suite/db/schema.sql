-- ════════════════════════════════════════════════════════════════
--  NDAMATOU SUITE — Socle du parcours patient
--
--  Trois clés portent tout le système :
--    patient.ipp    identifiant permanent, à vie
--    sejour.nda     une venue, ouverte à l'arrivée, fermée à la sortie
--    mouvement      où se trouve le patient, et depuis quand
--
--  Tout le reste — prescription, acte, résultat, ligne de facture —
--  s'accroche à ces trois clés. Compatible Postgres 14+.
-- ════════════════════════════════════════════════════════════════

-- ── Personnel ────────────────────────────────────────────────────
-- Le rôle détermine ce que la personne a le droit de faire, et son
-- identité alimente le journal. Aucune action soignante n'est
-- enregistrée sous un nom fourni par le navigateur.
CREATE TABLE IF NOT EXISTS utilisateur (
  id             SERIAL PRIMARY KEY,
  identifiant    TEXT NOT NULL,
  mot_de_passe   TEXT NOT NULL,          -- empreinte bcrypt
  nom_complet    TEXT NOT NULL,
  role           TEXT NOT NULL CHECK (role IN (
                   'accueil', 'infirmier', 'technicien', 'medecin',
                   'biologiste', 'manipulateur', 'radiologue',
                   'chirurgien', 'anesthesiste', 'bloc',
                   'pharmacien', 'facturation', 'admin')),
  unite          TEXT DEFAULT '',
  actif          BOOLEAN NOT NULL DEFAULT true,
  cree_le        TIMESTAMPTZ NOT NULL DEFAULT now(),
  derniere_connexion TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS utilisateur_identifiant_key
  ON utilisateur (lower(identifiant));

-- ── Patient ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patient (
  id              SERIAL PRIMARY KEY,
  ipp             TEXT NOT NULL UNIQUE,

  nom             TEXT NOT NULL,
  prenom          TEXT NOT NULL,
  date_naissance  DATE,
  sexe            TEXT CHECK (sexe IN ('M', 'F', 'I')),
  lieu_naissance  TEXT DEFAULT '',

  -- Traits normalisés : c'est sur eux que porte la recherche de
  -- doublons, jamais sur la saisie brute.
  nom_norm        TEXT NOT NULL,
  prenom_norm     TEXT NOT NULL,
  cle_phonetique  TEXT NOT NULL,

  telephone       TEXT DEFAULT '',
  adresse         TEXT DEFAULT '',
  personne_prevenir TEXT DEFAULT '',

  -- Une identité créée en urgence reste « provisoire » jusqu'à
  -- vérification d'une pièce. « fusionnee » marque un doublon
  -- rattaché à un autre IPP.
  statut_identite TEXT NOT NULL DEFAULT 'provisoire'
                  CHECK (statut_identite IN ('provisoire', 'validee', 'douteuse', 'fusionnee')),
  fusionne_vers   INTEGER REFERENCES patient(id),

  cree_le         TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS patient_phonetique_idx ON patient (cle_phonetique);
CREATE INDEX IF NOT EXISTS patient_norm_idx ON patient (nom_norm, prenom_norm);
CREATE INDEX IF NOT EXISTS patient_naissance_idx ON patient (date_naissance);

-- ── Couverture ───────────────────────────────────────────────────
-- Un patient peut avoir plusieurs couvertures dans le temps. Celle
-- qui s'applique est celle valide à la date de l'acte.
CREATE TABLE IF NOT EXISTS couverture (
  id            SERIAL PRIMARY KEY,
  patient_id    INTEGER NOT NULL REFERENCES patient(id) ON DELETE CASCADE,

  regime        TEXT NOT NULL CHECK (regime IN (
                  'payant_direct', 'cmu', 'ipm', 'mutuelle',
                  'assurance_privee', 'convention_employeur',
                  'prise_en_charge_sociale', 'accident_travail')),
  organisme     TEXT DEFAULT '',
  numero_adherent TEXT DEFAULT '',

  -- Part payée par l'organisme, de 0 à 100.
  taux_prise_en_charge NUMERIC(5,2) NOT NULL DEFAULT 0
                  CHECK (taux_prise_en_charge >= 0 AND taux_prise_en_charge <= 100),
  plafond       NUMERIC(12,2),          -- NULL = pas de plafond
  consomme      NUMERIC(12,2) NOT NULL DEFAULT 0,

  valide_du     DATE NOT NULL DEFAULT CURRENT_DATE,
  valide_au     DATE,                   -- NULL = sans terme
  piece_justificative TEXT DEFAULT '',

  cree_le       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS couverture_patient_idx ON couverture (patient_id, valide_du);

-- ── Séjour ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sejour (
  id            SERIAL PRIMARY KEY,
  nda           TEXT NOT NULL UNIQUE,
  patient_id    INTEGER NOT NULL REFERENCES patient(id),

  mode_entree   TEXT NOT NULL CHECK (mode_entree IN (
                  'consultation_programmee', 'urgences', 'transfert',
                  'maternite', 'hospitalisation_programmee', 'seance')),
  motif_entree  TEXT DEFAULT '',

  -- Triage renseigné uniquement pour une entrée par les urgences.
  triage        TEXT CHECK (triage IN ('rouge', 'orange', 'jaune', 'vert', 'blanc')),
  triage_le     TIMESTAMPTZ,
  triage_par    TEXT DEFAULT '',

  couverture_id INTEGER REFERENCES couverture(id),

  entree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  sortie_le     TIMESTAMPTZ,
  mode_sortie   TEXT CHECK (mode_sortie IN (
                  'domicile', 'transfert', 'structure_suite',
                  'contre_avis_medical', 'deces')),

  statut        TEXT NOT NULL DEFAULT 'ouvert'
                CHECK (statut IN ('ouvert', 'cloture_clinique', 'facture', 'solde')),

  cree_le       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sejour_patient_idx ON sejour (patient_id, entree_le DESC);
CREATE INDEX IF NOT EXISTS sejour_statut_idx ON sejour (statut);

-- ── Mouvement ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mouvement (
  id          SERIAL PRIMARY KEY,
  sejour_id   INTEGER NOT NULL REFERENCES sejour(id) ON DELETE CASCADE,
  unite       TEXT NOT NULL,
  lit         TEXT DEFAULT '',
  categorie   TEXT NOT NULL DEFAULT 'commune'
              CHECK (categorie IN ('commune', 'particuliere', 'vip', 'reanimation', 'aucune')),
  debut_le    TIMESTAMPTZ NOT NULL DEFAULT now(),
  fin_le      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS mouvement_sejour_idx ON mouvement (sejour_id, debut_le);

-- ── Catalogue des actes ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS catalogue_acte (
  code        TEXT PRIMARY KEY,
  libelle     TEXT NOT NULL,
  famille     TEXT NOT NULL CHECK (famille IN (
                'consultation', 'biologie', 'imagerie', 'chirurgie',
                'anesthesie', 'hebergement', 'forfait', 'produit',
                'transport', 'annexe')),
  unite       TEXT NOT NULL DEFAULT 'acte',
  actif       BOOLEAN NOT NULL DEFAULT true
);

-- ── Tarifs ───────────────────────────────────────────────────────
-- Un tarif est daté. Une revalorisation crée une nouvelle ligne et
-- ne réécrit jamais le passé : une facture ancienne doit rester
-- reproductible à l'identique des années plus tard.
CREATE TABLE IF NOT EXISTS tarif (
  id            SERIAL PRIMARY KEY,
  code_acte     TEXT NOT NULL REFERENCES catalogue_acte(code),
  montant       NUMERIC(12,2) NOT NULL CHECK (montant >= 0),
  devise        TEXT NOT NULL DEFAULT 'XOF',
  date_effet    DATE NOT NULL,
  date_fin      DATE
);
CREATE INDEX IF NOT EXISTS tarif_lookup_idx ON tarif (code_acte, date_effet DESC);

-- ── Stock pharmaceutique ─────────────────────────────────────────
-- Le stock est une contrainte réelle : on ne dispense pas ce qu'on
-- n'a pas, et chaque mouvement doit être justifiable.
CREATE TABLE IF NOT EXISTS stock (
  code_acte     TEXT PRIMARY KEY REFERENCES catalogue_acte(code),
  quantite      NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  seuil_alerte  NUMERIC(12,2) NOT NULL DEFAULT 0,
  modifie_le    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mouvement_stock (
  id          SERIAL PRIMARY KEY,
  code_acte   TEXT NOT NULL REFERENCES catalogue_acte(code),
  sens        TEXT NOT NULL CHECK (sens IN ('entree', 'sortie')),
  quantite    NUMERIC(12,2) NOT NULL CHECK (quantite > 0),
  motif       TEXT NOT NULL,
  sejour_id   INTEGER REFERENCES sejour(id) ON DELETE SET NULL,
  acteur      TEXT DEFAULT '',
  survenu_le  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mouvement_stock_code_idx ON mouvement_stock (code_acte, survenu_le DESC);

-- ── Prescription ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prescription (
  id            SERIAL PRIMARY KEY,
  sejour_id     INTEGER NOT NULL REFERENCES sejour(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN (
                  'biologie', 'imagerie', 'medicament', 'avis', 'soin')),
  prescripteur  TEXT NOT NULL,
  indication    TEXT DEFAULT '',
  urgence       TEXT NOT NULL DEFAULT 'normale'
                CHECK (urgence IN ('vitale', 'urgente', 'normale')),
  statut        TEXT NOT NULL DEFAULT 'active'
                CHECK (statut IN ('active', 'servie', 'annulee')),
  prescrit_le   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS prescription_sejour_idx ON prescription (sejour_id);

-- Avis du pharmacien sur une prescription médicamenteuse. Sans avis
-- favorable, rien ne sort de la pharmacie.
ALTER TABLE prescription ADD COLUMN IF NOT EXISTS avis_pharmaceutique TEXT
  CHECK (avis_pharmaceutique IN ('favorable', 'reserve', 'refuse'));
ALTER TABLE prescription ADD COLUMN IF NOT EXISTS avis_le TIMESTAMPTZ;
ALTER TABLE prescription ADD COLUMN IF NOT EXISTS avis_par TEXT DEFAULT '';
ALTER TABLE prescription ADD COLUMN IF NOT EXISTS avis_motif TEXT DEFAULT '';

-- ── Ligne de prescription médicamenteuse ─────────────────────────
-- Une prescription porte plusieurs médicaments, chacun avec sa
-- posologie. Une ligne engendre autant d'administrations que de
-- prises — et autant de lignes de facture.
CREATE TABLE IF NOT EXISTS ligne_prescription (
  id              SERIAL PRIMARY KEY,
  prescription_id INTEGER NOT NULL REFERENCES prescription(id) ON DELETE CASCADE,
  code_acte       TEXT NOT NULL REFERENCES catalogue_acte(code),

  dose            NUMERIC(10,3) NOT NULL CHECK (dose > 0),
  unite_dose      TEXT NOT NULL DEFAULT 'mg',
  voie            TEXT NOT NULL DEFAULT 'orale'
                  CHECK (voie IN ('orale', 'intraveineuse', 'intramusculaire',
                                  'sous_cutanee', 'inhalee', 'locale', 'rectale')),
  prises_par_jour INTEGER NOT NULL DEFAULT 1 CHECK (prises_par_jour > 0),
  duree_jours     INTEGER NOT NULL DEFAULT 1 CHECK (duree_jours > 0),

  dispense        NUMERIC(12,2) NOT NULL DEFAULT 0,
  administre      NUMERIC(12,2) NOT NULL DEFAULT 0,

  statut          TEXT NOT NULL DEFAULT 'active'
                  CHECK (statut IN ('active', 'suspendue', 'arretee', 'terminee')),
  cree_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ligne_prescription_idx ON ligne_prescription (prescription_id);

-- ── Acte ─────────────────────────────────────────────────────────
-- Le pivot du système. Un acte prescrit n'est pas facturable ; il le
-- devient au moment où il est validé.
CREATE TABLE IF NOT EXISTS acte (
  id              SERIAL PRIMARY KEY,
  sejour_id       INTEGER NOT NULL REFERENCES sejour(id) ON DELETE CASCADE,
  prescription_id INTEGER REFERENCES prescription(id),
  code_acte       TEXT NOT NULL REFERENCES catalogue_acte(code),

  quantite        NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK (quantite > 0),
  executant       TEXT DEFAULT '',
  unite_executante TEXT DEFAULT '',

  statut          TEXT NOT NULL DEFAULT 'prevu'
                  CHECK (statut IN ('prevu', 'realise', 'valide', 'annule')),

  -- Radioprotection : la dose reçue par le patient doit être
  -- traçable examen par examen, sur toute sa vie.
  dose_delivree   NUMERIC(10,3),
  dose_unite      TEXT DEFAULT '',

  prevu_le        TIMESTAMPTZ NOT NULL DEFAULT now(),
  programme_le    TIMESTAMPTZ,
  realise_le      TIMESTAMPTZ,
  valide_le       TIMESTAMPTZ,
  valide_par      TEXT DEFAULT '',

  commentaire     TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS acte_sejour_idx ON acte (sejour_id, prevu_le);
CREATE INDEX IF NOT EXISTS acte_statut_idx ON acte (statut);

-- ── Résultat ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resultat (
  id            SERIAL PRIMARY KEY,
  acte_id       INTEGER NOT NULL REFERENCES acte(id) ON DELETE CASCADE,
  valeur        TEXT NOT NULL,
  unite         TEXT DEFAULT '',
  reference     TEXT DEFAULT '',
  critique      BOOLEAN NOT NULL DEFAULT false,
  commentaire   TEXT DEFAULT '',
  saisi_le      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS resultat_acte_idx ON resultat (acte_id);

-- ── Consentement éclairé ─────────────────────────────────────────
-- Document opposable : il doit pouvoir être présenté des années plus
-- tard, avec la date et la personne qui l'a signé.
CREATE TABLE IF NOT EXISTS consentement (
  id           SERIAL PRIMARY KEY,
  sejour_id    INTEGER NOT NULL REFERENCES sejour(id) ON DELETE CASCADE,
  objet        TEXT NOT NULL,
  signe_par    TEXT NOT NULL,
  qualite      TEXT NOT NULL DEFAULT 'patient'
               CHECK (qualite IN ('patient', 'representant_legal', 'parent')),
  recueilli_par TEXT NOT NULL,
  signe_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoque_le   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS consentement_sejour_idx ON consentement (sejour_id);

-- ── Bloc opératoire ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS intervention (
  id             SERIAL PRIMARY KEY,
  sejour_id      INTEGER NOT NULL REFERENCES sejour(id) ON DELETE CASCADE,
  code_acte      TEXT NOT NULL REFERENCES catalogue_acte(code),

  chirurgien     TEXT DEFAULT '',
  anesthesiste   TEXT DEFAULT '',
  salle          TEXT DEFAULT '',

  consentement_id INTEGER REFERENCES consentement(id),
  consultation_anesthesie_id INTEGER REFERENCES acte(id),

  programmee_le  TIMESTAMPTZ,
  induction_le   TIMESTAMPTZ,
  incision_le    TIMESTAMPTZ,
  fin_le         TIMESTAMPTZ,

  compte_rendu   TEXT DEFAULT '',
  statut         TEXT NOT NULL DEFAULT 'programmee'
                 CHECK (statut IN ('programmee', 'induite', 'en_cours',
                                   'terminee', 'facturee', 'annulee')),
  cree_le        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS intervention_sejour_idx ON intervention (sejour_id);

-- Liste de vérification en trois temps. Chaque temps est une barrière :
-- on ne franchit pas l'étape suivante sans lui.
CREATE TABLE IF NOT EXISTS verification_bloc (
  intervention_id INTEGER NOT NULL REFERENCES intervention(id) ON DELETE CASCADE,
  temps           TEXT NOT NULL
                  CHECK (temps IN ('avant_induction', 'avant_incision', 'avant_sortie')),
  points          JSONB NOT NULL DEFAULT '{}'::jsonb,
  validee_par     TEXT NOT NULL,
  validee_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (intervention_id, temps)
);

-- Dispositifs implantables : la traçabilité lot ↔ patient est une
-- obligation, et doit survivre au séjour.
CREATE TABLE IF NOT EXISTS implant (
  id              SERIAL PRIMARY KEY,
  intervention_id INTEGER NOT NULL REFERENCES intervention(id) ON DELETE CASCADE,
  code_acte       TEXT NOT NULL REFERENCES catalogue_acte(code),
  numero_lot      TEXT NOT NULL,
  peremption      DATE,
  quantite        NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK (quantite > 0),
  acte_id         INTEGER REFERENCES acte(id),
  pose_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS implant_intervention_idx ON implant (intervention_id);
CREATE INDEX IF NOT EXISTS implant_lot_idx ON implant (numero_lot);

-- ── Journées d'hébergement ───────────────────────────────────────
-- Une ligne par nuitée effectivement passée, rattachée au mouvement
-- qui l'a produite. La clé primaire garantit qu'une même nuit ne peut
-- être facturée deux fois, même si le calcul est relancé.
CREATE TABLE IF NOT EXISTS journee_hebergement (
  mouvement_id  INTEGER NOT NULL REFERENCES mouvement(id) ON DELETE CASCADE,
  nuit_du       DATE NOT NULL,
  acte_id       INTEGER REFERENCES acte(id) ON DELETE CASCADE,
  categorie     TEXT NOT NULL,
  PRIMARY KEY (mouvement_id, nuit_du)
);

-- ── Ligne de facture ─────────────────────────────────────────────
-- Créée au moment de la validation de l'acte, jamais reconstituée à
-- la sortie. Elle fige le tarif et le taux appliqués : c'est ce qui
-- rend la facture reproductible.
CREATE TABLE IF NOT EXISTS ligne_facture (
  id              SERIAL PRIMARY KEY,
  sejour_id       INTEGER NOT NULL REFERENCES sejour(id) ON DELETE CASCADE,
  acte_id         INTEGER UNIQUE REFERENCES acte(id) ON DELETE CASCADE,

  code_acte       TEXT NOT NULL,
  libelle         TEXT NOT NULL,
  quantite        NUMERIC(10,2) NOT NULL,
  montant_unitaire NUMERIC(12,2) NOT NULL,
  montant_total   NUMERIC(12,2) NOT NULL,

  taux_applique   NUMERIC(5,2) NOT NULL DEFAULT 0,
  part_organisme  NUMERIC(12,2) NOT NULL DEFAULT 0,
  part_patient    NUMERIC(12,2) NOT NULL DEFAULT 0,

  facture_id      INTEGER,
  emise_le        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ligne_sejour_idx ON ligne_facture (sejour_id);

-- ── Facture ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS facture (
  id              SERIAL PRIMARY KEY,
  numero          TEXT NOT NULL UNIQUE,
  sejour_id       INTEGER NOT NULL REFERENCES sejour(id),
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_organisme NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_patient   NUMERIC(12,2) NOT NULL DEFAULT 0,
  statut          TEXT NOT NULL DEFAULT 'emise'
                  CHECK (statut IN ('emise', 'partiellement_reglee', 'soldee', 'annulee')),
  emise_le        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reglement (
  id          SERIAL PRIMARY KEY,
  facture_id  INTEGER NOT NULL REFERENCES facture(id) ON DELETE CASCADE,
  montant     NUMERIC(12,2) NOT NULL CHECK (montant > 0),
  moyen       TEXT NOT NULL CHECK (moyen IN (
                'especes', 'mobile_money', 'carte', 'virement', 'cheque', 'tiers_payant')),
  reference   TEXT DEFAULT '',
  regle_le    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Journal ──────────────────────────────────────────────────────
-- Écriture seule. Un dossier de soins doit pouvoir être présenté des
-- années plus tard, avec la trace de qui a fait quoi et quand.
CREATE TABLE IF NOT EXISTS journal (
  id          BIGSERIAL PRIMARY KEY,
  entite      TEXT NOT NULL,
  entite_id   INTEGER,
  action      TEXT NOT NULL,
  acteur      TEXT NOT NULL DEFAULT 'systeme',
  detail      JSONB NOT NULL DEFAULT '{}'::jsonb,
  survenu_le  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS journal_entite_idx ON journal (entite, entite_id);
CREATE INDEX IF NOT EXISTS journal_date_idx ON journal (survenu_le DESC);

-- ── Compteurs ────────────────────────────────────────────────────
-- IPP et NDA lisibles par un humain, séquentiels par année.
CREATE TABLE IF NOT EXISTS compteur (
  nom     TEXT PRIMARY KEY,
  valeur  BIGINT NOT NULL DEFAULT 0
);

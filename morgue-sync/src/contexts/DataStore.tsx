import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Defunt {
  id: string;
  nom: string;
  dateDeces: string;
  service: string;
  casierId: string | null;
  statutDemarches: 'En attente' | 'En cours' | 'Finalisées';
  dateAdmissionMorgue: string;
}

export interface Casier {
  id: string;
  numero: string;
  statut: 'Libre' | 'Occupé' | 'Maintenance';
  temperature: number;
  occupantId: string | null;
}

export interface Demarche {
  id: string;
  defuntId: string;
  defuntNom: string;
  type: 'Certificat de décès' | 'Autorisation de transfert' | "Autorisation d'inhumation";
  statut: 'En attente' | 'En cours' | 'Émise';
  dateEmission: string | null;
  responsable: string;
}

export interface Famille {
  id: string;
  defuntId: string;
  defuntNom: string;
  contactNom: string;
  lienParente: string;
  telephone: string;
  dateVisite: string | null;
  notes: string;
}

// ── Initial Data ───────────────────────────────────────────────────────────

const initialDefunts: Defunt[] = [
  { id: 'DEF-2026-001', nom: 'Moussa Sarr',        dateDeces: '2026-06-28', service: 'Réanimation',   casierId: 'CAS-01', statutDemarches: 'En cours',    dateAdmissionMorgue: '2026-06-28' },
  { id: 'DEF-2026-002', nom: 'Fatoumata Diagne',    dateDeces: '2026-06-27', service: 'Urgences',       casierId: 'CAS-02', statutDemarches: 'Finalisées',  dateAdmissionMorgue: '2026-06-27' },
  { id: 'DEF-2026-003', nom: 'Ibrahima Sylla',      dateDeces: '2026-06-29', service: 'Médecine Interne', casierId: 'CAS-03', statutDemarches: 'En attente', dateAdmissionMorgue: '2026-06-29' },
  { id: 'DEF-2026-004', nom: 'Awa Camara',          dateDeces: '2026-06-25', service: 'Gériatrie',      casierId: 'CAS-04', statutDemarches: 'Finalisées',  dateAdmissionMorgue: '2026-06-25' },
  { id: 'DEF-2026-005', nom: 'Mor Thioune',         dateDeces: '2026-06-30', service: 'Chirurgie',      casierId: 'CAS-05', statutDemarches: 'En cours',    dateAdmissionMorgue: '2026-06-30' },
  { id: 'DEF-2026-006', nom: 'Bineta Faye',         dateDeces: '2026-06-26', service: 'Cardiologie',    casierId: null,     statutDemarches: 'Finalisées',  dateAdmissionMorgue: '2026-06-26' },
  { id: 'DEF-2026-007', nom: 'Alioune Badara Gueye',dateDeces: '2026-07-01', service: 'Urgences',       casierId: 'CAS-06', statutDemarches: 'En attente',  dateAdmissionMorgue: '2026-07-01' },
];

const initialCasiers: Casier[] = [
  { id: 'CAS-01', numero: 'C-01', statut: 'Occupé', temperature: 3.5, occupantId: 'DEF-2026-001' },
  { id: 'CAS-02', numero: 'C-02', statut: 'Occupé', temperature: 3.2, occupantId: 'DEF-2026-002' },
  { id: 'CAS-03', numero: 'C-03', statut: 'Occupé', temperature: 3.8, occupantId: 'DEF-2026-003' },
  { id: 'CAS-04', numero: 'C-04', statut: 'Occupé', temperature: 3.4, occupantId: 'DEF-2026-004' },
  { id: 'CAS-05', numero: 'C-05', statut: 'Occupé', temperature: 3.6, occupantId: 'DEF-2026-005' },
  { id: 'CAS-06', numero: 'C-06', statut: 'Occupé', temperature: 3.3, occupantId: 'DEF-2026-007' },
  { id: 'CAS-07', numero: 'C-07', statut: 'Libre',  temperature: 4.0, occupantId: null },
  { id: 'CAS-08', numero: 'C-08', statut: 'Libre',  temperature: 4.1, occupantId: null },
  { id: 'CAS-09', numero: 'C-09', statut: 'Maintenance', temperature: 8.2, occupantId: null },
  { id: 'CAS-10', numero: 'C-10', statut: 'Libre',  temperature: 3.9, occupantId: null },
];

const initialDemarches: Demarche[] = [
  { id: 'DEM-001', defuntId: 'DEF-2026-001', defuntNom: 'Moussa Sarr',         type: 'Certificat de décès',           statut: 'Émise',      dateEmission: '2026-06-28', responsable: 'Dr. Serigne Kane' },
  { id: 'DEM-002', defuntId: 'DEF-2026-001', defuntNom: 'Moussa Sarr',         type: "Autorisation d'inhumation",     statut: 'En cours',   dateEmission: null,         responsable: 'Aïssatou Ndoye' },
  { id: 'DEM-003', defuntId: 'DEF-2026-002', defuntNom: 'Fatoumata Diagne',    type: 'Certificat de décès',           statut: 'Émise',      dateEmission: '2026-06-27', responsable: 'Dr. Serigne Kane' },
  { id: 'DEM-004', defuntId: 'DEF-2026-002', defuntNom: 'Fatoumata Diagne',    type: "Autorisation d'inhumation",     statut: 'Émise',      dateEmission: '2026-06-28', responsable: 'Aïssatou Ndoye' },
  { id: 'DEM-005', defuntId: 'DEF-2026-003', defuntNom: 'Ibrahima Sylla',      type: 'Certificat de décès',           statut: 'En attente', dateEmission: null,         responsable: 'Dr. Serigne Kane' },
  { id: 'DEM-006', defuntId: 'DEF-2026-004', defuntNom: 'Awa Camara',          type: 'Autorisation de transfert',     statut: 'Émise',      dateEmission: '2026-06-26', responsable: 'Cheikh Anta Mbaye' },
  { id: 'DEM-007', defuntId: 'DEF-2026-005', defuntNom: 'Mor Thioune',         type: 'Certificat de décès',           statut: 'Émise',      dateEmission: '2026-06-30', responsable: 'Dr. Serigne Kane' },
  { id: 'DEM-008', defuntId: 'DEF-2026-005', defuntNom: 'Mor Thioune',         type: "Autorisation d'inhumation",     statut: 'En cours',   dateEmission: null,         responsable: 'Aïssatou Ndoye' },
  { id: 'DEM-009', defuntId: 'DEF-2026-007', defuntNom: 'Alioune Badara Gueye',type: 'Certificat de décès',           statut: 'En attente', dateEmission: null,         responsable: 'Dr. Serigne Kane' },
];

const initialFamilles: Famille[] = [
  { id: 'FAM-001', defuntId: 'DEF-2026-001', defuntNom: 'Moussa Sarr',          contactNom: 'Aminata Sarr',    lienParente: 'Épouse',    telephone: '77 123 45 01', dateVisite: '2026-06-29', notes: 'Famille accompagnée pour les démarches, en attente du certificat.' },
  { id: 'FAM-002', defuntId: 'DEF-2026-002', defuntNom: 'Fatoumata Diagne',     contactNom: 'Ousmane Diagne',  lienParente: 'Fils',      telephone: '77 123 45 02', dateVisite: '2026-06-27', notes: 'Dossier finalisé, corps remis à la famille le 28/06.' },
  { id: 'FAM-003', defuntId: 'DEF-2026-003', defuntNom: 'Ibrahima Sylla',       contactNom: 'Mariama Sylla',   lienParente: 'Sœur',      telephone: '77 123 45 03', dateVisite: null,          notes: 'Famille prévenue, visite prévue dans les prochains jours.' },
  { id: 'FAM-004', defuntId: 'DEF-2026-004', defuntNom: 'Awa Camara',           contactNom: 'Modou Camara',    lienParente: 'Fils',      telephone: '77 123 45 04', dateVisite: '2026-06-26', notes: 'Transfert organisé vers Kaolack, famille satisfaite du suivi.' },
  { id: 'FAM-005', defuntId: 'DEF-2026-005', defuntNom: 'Mor Thioune',          contactNom: 'Ndeye Thioune',   lienParente: 'Épouse',    telephone: '77 123 45 05', dateVisite: '2026-07-01', notes: 'Accompagnement psychologique proposé, rendez-vous fixé.' },
  { id: 'FAM-006', defuntId: 'DEF-2026-007', defuntNom: 'Alioune Badara Gueye', contactNom: 'Cheikh Gueye',    lienParente: 'Frère',     telephone: '77 123 45 06', dateVisite: null,          notes: 'Contact établi par téléphone, visite à confirmer.' },
];

// ── LocalStorage helpers ───────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function lsSet<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
}

// ── Supabase sync helpers ──────────────────────────────────────────────────

// Map app table name → Supabase table name
const TABLE: Record<string, string> = {
  defunts: 'defunts',
  casiers: 'casiers',
  demarches: 'demarches',
  familles: 'familles',
};

async function sbFetch<T>(table: string): Promise<T[] | null> {
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data as T[];
  } catch { return null; }
}

// Upsert all + delete removed rows
async function sbSync<T extends { id: string }>(table: string, rows: T[]) {
  if (!rows.length) return;
  try {
    // upsert all current rows
    const { error: upsertErr } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
    if (upsertErr) throw upsertErr;

    // delete rows no longer present
    const ids = rows.map(r => r.id);
    const { data: existing } = await supabase.from(table).select('id');
    if (existing) {
      const toDelete = (existing as { id: string }[]).map(r => r.id).filter(id => !ids.includes(id));
      if (toDelete.length) {
        await supabase.from(table).delete().in('id', toDelete);
      }
    }
  } catch (e) {
    console.warn(`[Supabase] sync ${table} failed:`, e);
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface DataStoreContextType {
  defunts: Defunt[];
  setDefunts: (val: Defunt[] | ((prev: Defunt[]) => Defunt[])) => void;
  casiers: Casier[];
  setCasiers: (val: Casier[] | ((prev: Casier[]) => Casier[])) => void;
  demarches: Demarche[];
  setDemarches: (val: Demarche[] | ((prev: Demarche[]) => Demarche[])) => void;
  familles: Famille[];
  setFamilles: (val: Famille[] | ((prev: Famille[]) => Famille[])) => void;
  supabaseReady: boolean;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [defunts, _setDefunts] = useState<Defunt[]>(() => lsGet('morguesync_defunts', initialDefunts));
  const [casiers, _setCasiers] = useState<Casier[]>(() => lsGet('morguesync_casiers', initialCasiers));
  const [demarches, _setDemarches] = useState<Demarche[]>(() => lsGet('morguesync_demarches', initialDemarches));
  const [familles, _setFamilles] = useState<Famille[]>(() => lsGet('morguesync_familles', initialFamilles));
  const [supabaseReady, setSupabaseReady] = useState(false);
  const initialized = useRef(false);

  // On mount: load from Supabase (overrides localStorage if data exists)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const [sbDefunts, sbCasiers, sbDemarches, sbFamilles] = await Promise.all([
        sbFetch<Defunt>('defunts'),
        sbFetch<Casier>('casiers'),
        sbFetch<Demarche>('demarches'),
        sbFetch<Famille>('familles'),
      ]);

      // Seed Supabase if empty, otherwise load from Supabase
      if (sbDefunts !== null) {
        if (sbDefunts.length === 0) {
          await sbSync('defunts', initialDefunts);
          _setDefunts(initialDefunts);
          lsSet('morguesync_defunts', initialDefunts);
        } else {
          _setDefunts(sbDefunts);
          lsSet('morguesync_defunts', sbDefunts);
        }
      }
      if (sbCasiers !== null) {
        if (sbCasiers.length === 0) {
          await sbSync('casiers', initialCasiers);
          _setCasiers(initialCasiers);
          lsSet('morguesync_casiers', initialCasiers);
        } else {
          _setCasiers(sbCasiers);
          lsSet('morguesync_casiers', sbCasiers);
        }
      }
      if (sbDemarches !== null) {
        if (sbDemarches.length === 0) {
          await sbSync('demarches', initialDemarches);
          _setDemarches(initialDemarches);
          lsSet('morguesync_demarches', initialDemarches);
        } else {
          _setDemarches(sbDemarches);
          lsSet('morguesync_demarches', sbDemarches);
        }
      }
      if (sbFamilles !== null) {
        if (sbFamilles.length === 0) {
          await sbSync('familles', initialFamilles);
          _setFamilles(initialFamilles);
          lsSet('morguesync_familles', initialFamilles);
        } else {
          _setFamilles(sbFamilles);
          lsSet('morguesync_familles', sbFamilles);
        }
      }

      setSupabaseReady(true);
    })();
  }, []);

  // Wrapped setters: update state + localStorage + Supabase
  const setDefunts = (val: Defunt[] | ((prev: Defunt[]) => Defunt[])) => {
    _setDefunts(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('morguesync_defunts', next);
      sbSync(TABLE.defunts, next);
      return next;
    });
  };

  const setCasiers = (val: Casier[] | ((prev: Casier[]) => Casier[])) => {
    _setCasiers(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('morguesync_casiers', next);
      sbSync(TABLE.casiers, next);
      return next;
    });
  };

  const setDemarches = (val: Demarche[] | ((prev: Demarche[]) => Demarche[])) => {
    _setDemarches(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('morguesync_demarches', next);
      sbSync(TABLE.demarches, next);
      return next;
    });
  };

  const setFamilles = (val: Famille[] | ((prev: Famille[]) => Famille[])) => {
    _setFamilles(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('morguesync_familles', next);
      sbSync(TABLE.familles, next);
      return next;
    });
  };

  return (
    <DataStoreContext.Provider value={{
      defunts, setDefunts,
      casiers, setCasiers,
      demarches, setDemarches,
      familles, setFamilles,
      supabaseReady,
    }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be inside DataStoreProvider');
  return ctx;
}

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Grossesse {
  id: string;
  patienteNom: string;
  age: number;
  terme: number; // semaines d'aménorrhée
  datePrevueAccouchement: string;
  groupeSanguin: string;
  grossesseRisque: boolean;
  suivi: 'Normal' | 'Surveillance' | 'Risque Élevé';
  dernierRdv: string;
}

export interface Accouchement {
  id: string;
  patienteNom: string;
  date: string;
  type: 'Voie basse' | 'Césarienne';
  complications: string;
  sageFemme: string;
  poidsBebe: number;
  apgar: number;
}

export interface NouveauNe {
  id: string;
  nomMere: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  poids: number;
  apgarScore: number;
  couveuseId: string | null;
  statut: 'En chambre' | 'Néonatologie' | 'Sorti';
}

export interface Couveuse {
  id: string;
  statut: 'Libre' | 'Occupée' | 'Maintenance';
  occupantNom: string | null;
  dateAdmission: string | null;
  poidsActuel: number | null;
}

// ── Initial Data ───────────────────────────────────────────────────────────

const initialGrossesses: Grossesse[] = [
  { id: 'GR-2026-001', patienteNom: 'Aminata Diagne', age: 29, terme: 39, datePrevueAccouchement: '08 Jui. 2026', groupeSanguin: 'O+', grossesseRisque: true, suivi: 'Risque Élevé', dernierRdv: '30 Juin 2026' },
  { id: 'GR-2026-002', patienteNom: 'Sokhna Fall', age: 24, terme: 32, datePrevueAccouchement: '15 Aoû. 2026', groupeSanguin: 'A+', grossesseRisque: false, suivi: 'Normal', dernierRdv: '28 Juin 2026' },
  { id: 'GR-2026-003', patienteNom: 'Mariéme Ba', age: 34, terme: 36, datePrevueAccouchement: '22 Jui. 2026', groupeSanguin: 'B+', grossesseRisque: true, suivi: 'Surveillance', dernierRdv: '29 Juin 2026' },
  { id: 'GR-2026-004', patienteNom: 'Awa Sy', age: 21, terme: 28, datePrevueAccouchement: '10 Sep. 2026', groupeSanguin: 'O-', grossesseRisque: true, suivi: 'Risque Élevé', dernierRdv: '01 Jui. 2026' },
  { id: 'GR-2026-005', patienteNom: 'Ndèye Coumba Diop', age: 27, terme: 40, datePrevueAccouchement: '03 Jui. 2026', groupeSanguin: 'AB+', grossesseRisque: false, suivi: 'Normal', dernierRdv: '01 Jui. 2026' },
  { id: 'GR-2026-006', patienteNom: 'Bineta Cissé', age: 31, terme: 34, datePrevueAccouchement: '05 Aoû. 2026', groupeSanguin: 'A-', grossesseRisque: false, suivi: 'Normal', dernierRdv: '27 Juin 2026' },
  { id: 'GR-2026-007', patienteNom: 'Fatou Gueye', age: 38, terme: 37, datePrevueAccouchement: '18 Jui. 2026', groupeSanguin: 'O+', grossesseRisque: true, suivi: 'Surveillance', dernierRdv: '30 Juin 2026' },
  { id: 'GR-2026-008', patienteNom: 'Astou Mbengue', age: 25, terme: 30, datePrevueAccouchement: '25 Aoû. 2026', groupeSanguin: 'B-', grossesseRisque: false, suivi: 'Normal', dernierRdv: '26 Juin 2026' },
];

const initialAccouchements: Accouchement[] = [
  { id: 'ACC-2026-001', patienteNom: 'Ndèye Coumba Diop', date: '01 Jui. 2026 · 06:42', type: 'Voie basse', complications: 'Aucune', sageFemme: 'Aïssatou Ndoye', poidsBebe: 3200, apgar: 9 },
  { id: 'ACC-2026-002', patienteNom: 'Rokhaya Sène', date: '30 Juin 2026 · 22:15', type: 'Césarienne', complications: 'Présentation par le siège', sageFemme: 'Dr. Fatoumata Sarr', poidsBebe: 2900, apgar: 8 },
  { id: 'ACC-2026-003', patienteNom: 'Aïda Wade', date: '29 Juin 2026 · 14:30', type: 'Voie basse', complications: 'Aucune', sageFemme: 'Aïssatou Ndoye', poidsBebe: 3450, apgar: 10 },
  { id: 'ACC-2026-004', patienteNom: 'Coumba Ndao', date: '28 Juin 2026 · 03:05', type: 'Césarienne', complications: 'Souffrance fœtale', sageFemme: 'Dr. Fatoumata Sarr', poidsBebe: 2600, apgar: 7 },
  { id: 'ACC-2026-005', patienteNom: 'Marème Sow', date: '27 Juin 2026 · 11:20', type: 'Voie basse', complications: 'Aucune', sageFemme: 'Khady Diouf', poidsBebe: 3100, apgar: 9 },
  { id: 'ACC-2026-006', patienteNom: 'Absa Niang', date: '26 Juin 2026 · 19:48', type: 'Voie basse', complications: 'Déchirure périnéale légère', sageFemme: 'Aïssatou Ndoye', poidsBebe: 3550, apgar: 9 },
  { id: 'ACC-2026-007', patienteNom: 'Yacine Thiam', date: '25 Juin 2026 · 08:10', type: 'Césarienne', complications: 'Grossesse gémellaire', sageFemme: 'Dr. Fatoumata Sarr', poidsBebe: 2400, apgar: 8 },
];

const initialNouveauNes: NouveauNe[] = [
  { id: 'NN-2026-001', nomMere: 'Ndèye Coumba Diop', dateNaissance: '01 Jui. 2026', sexe: 'F', poids: 3200, apgarScore: 9, couveuseId: null, statut: 'En chambre' },
  { id: 'NN-2026-002', nomMere: 'Rokhaya Sène', dateNaissance: '30 Juin 2026', sexe: 'M', poids: 2900, apgarScore: 8, couveuseId: 'CV-04', statut: 'Néonatologie' },
  { id: 'NN-2026-003', nomMere: 'Aïda Wade', dateNaissance: '29 Juin 2026', sexe: 'F', poids: 3450, apgarScore: 10, couveuseId: null, statut: 'Sorti' },
  { id: 'NN-2026-004', nomMere: 'Coumba Ndao', dateNaissance: '28 Juin 2026', sexe: 'M', poids: 2600, apgarScore: 7, couveuseId: 'CV-02', statut: 'Néonatologie' },
  { id: 'NN-2026-005', nomMere: 'Marème Sow', dateNaissance: '27 Juin 2026', sexe: 'F', poids: 3100, apgarScore: 9, couveuseId: null, statut: 'Sorti' },
  { id: 'NN-2026-006', nomMere: 'Absa Niang', dateNaissance: '26 Juin 2026', sexe: 'M', poids: 3550, apgarScore: 9, couveuseId: null, statut: 'En chambre' },
  { id: 'NN-2026-007', nomMere: 'Yacine Thiam', dateNaissance: '25 Juin 2026', sexe: 'F', poids: 2400, apgarScore: 8, couveuseId: 'CV-07', statut: 'Néonatologie' },
  { id: 'NN-2026-008', nomMere: 'Yacine Thiam', dateNaissance: '25 Juin 2026', sexe: 'M', poids: 2350, apgarScore: 8, couveuseId: 'CV-09', statut: 'Néonatologie' },
];

function buildCouveuses(): Couveuse[] {
  const occupied: Record<string, { nom: string; date: string; poids: number }> = {
    'CV-02': { nom: 'Bébé Ndao (Coumba Ndao)', date: '28 Juin 2026', poids: 2650 },
    'CV-04': { nom: 'Bébé Sène (Rokhaya Sène)', date: '30 Juin 2026', poids: 2920 },
    'CV-07': { nom: 'Bébé Thiam A. (Yacine Thiam)', date: '25 Juin 2026', poids: 2410 },
    'CV-09': { nom: 'Bébé Thiam B. (Yacine Thiam)', date: '25 Juin 2026', poids: 2380 },
    'CV-11': { nom: 'Bébé Faye (Anta Faye)', date: '24 Juin 2026', poids: 2100 },
  };
  const maintenance = ['CV-13'];

  const list: Couveuse[] = [];
  for (let i = 1; i <= 15; i++) {
    const id = `CV-${String(i).padStart(2, '0')}`;
    if (occupied[id]) {
      list.push({ id, statut: 'Occupée', occupantNom: occupied[id].nom, dateAdmission: occupied[id].date, poidsActuel: occupied[id].poids });
    } else if (maintenance.includes(id)) {
      list.push({ id, statut: 'Maintenance', occupantNom: null, dateAdmission: null, poidsActuel: null });
    } else {
      list.push({ id, statut: 'Libre', occupantNom: null, dateAdmission: null, poidsActuel: null });
    }
  }
  return list;
}

const initialCouveuses: Couveuse[] = buildCouveuses();

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
  grossesses: 'grossesses',
  accouchements: 'accouchements',
  nouveauNes: 'nouveau_nes',
  couveuses: 'couveuses',
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
  grossesses: Grossesse[];
  setGrossesses: (val: Grossesse[] | ((prev: Grossesse[]) => Grossesse[])) => void;
  accouchements: Accouchement[];
  setAccouchements: (val: Accouchement[] | ((prev: Accouchement[]) => Accouchement[])) => void;
  nouveauNes: NouveauNe[];
  setNouveauNes: (val: NouveauNe[] | ((prev: NouveauNe[]) => NouveauNe[])) => void;
  couveuses: Couveuse[];
  setCouveuses: (val: Couveuse[] | ((prev: Couveuse[]) => Couveuse[])) => void;
  supabaseReady: boolean;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [grossesses, _setGrossesses] = useState<Grossesse[]>(() => lsGet('materneo_grossesses', initialGrossesses));
  const [accouchements, _setAccouchements] = useState<Accouchement[]>(() => lsGet('materneo_accouchements', initialAccouchements));
  const [nouveauNes, _setNouveauNes] = useState<NouveauNe[]>(() => lsGet('materneo_nouveaunes', initialNouveauNes));
  const [couveuses, _setCouveuses] = useState<Couveuse[]>(() => lsGet('materneo_couveuses', initialCouveuses));
  const [supabaseReady, setSupabaseReady] = useState(false);
  const initialized = useRef(false);

  // On mount: load from Supabase (overrides localStorage if data exists)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const [sbGrossesses, sbAccouchements, sbNouveauNes, sbCouveuses] = await Promise.all([
        sbFetch<Grossesse>('grossesses'),
        sbFetch<Accouchement>('accouchements'),
        sbFetch<NouveauNe>('nouveau_nes'),
        sbFetch<Couveuse>('couveuses'),
      ]);

      // Seed Supabase if empty, otherwise load from Supabase
      if (sbGrossesses !== null) {
        if (sbGrossesses.length === 0) {
          await sbSync('grossesses', initialGrossesses);
          _setGrossesses(initialGrossesses);
          lsSet('materneo_grossesses', initialGrossesses);
        } else {
          _setGrossesses(sbGrossesses);
          lsSet('materneo_grossesses', sbGrossesses);
        }
      }
      if (sbAccouchements !== null) {
        if (sbAccouchements.length === 0) {
          await sbSync('accouchements', initialAccouchements);
          _setAccouchements(initialAccouchements);
          lsSet('materneo_accouchements', initialAccouchements);
        } else {
          _setAccouchements(sbAccouchements);
          lsSet('materneo_accouchements', sbAccouchements);
        }
      }
      if (sbNouveauNes !== null) {
        if (sbNouveauNes.length === 0) {
          await sbSync('nouveau_nes', initialNouveauNes);
          _setNouveauNes(initialNouveauNes);
          lsSet('materneo_nouveaunes', initialNouveauNes);
        } else {
          _setNouveauNes(sbNouveauNes);
          lsSet('materneo_nouveaunes', sbNouveauNes);
        }
      }
      if (sbCouveuses !== null) {
        if (sbCouveuses.length === 0) {
          await sbSync('couveuses', initialCouveuses);
          _setCouveuses(initialCouveuses);
          lsSet('materneo_couveuses', initialCouveuses);
        } else {
          _setCouveuses(sbCouveuses);
          lsSet('materneo_couveuses', sbCouveuses);
        }
      }

      setSupabaseReady(true);
    })();
  }, []);

  // Wrapped setters: update state + localStorage + Supabase
  const setGrossesses = (val: Grossesse[] | ((prev: Grossesse[]) => Grossesse[])) => {
    _setGrossesses(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('materneo_grossesses', next);
      sbSync(TABLE.grossesses, next);
      return next;
    });
  };

  const setAccouchements = (val: Accouchement[] | ((prev: Accouchement[]) => Accouchement[])) => {
    _setAccouchements(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('materneo_accouchements', next);
      sbSync(TABLE.accouchements, next);
      return next;
    });
  };

  const setNouveauNes = (val: NouveauNe[] | ((prev: NouveauNe[]) => NouveauNe[])) => {
    _setNouveauNes(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('materneo_nouveaunes', next);
      sbSync(TABLE.nouveauNes, next);
      return next;
    });
  };

  const setCouveuses = (val: Couveuse[] | ((prev: Couveuse[]) => Couveuse[])) => {
    _setCouveuses(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('materneo_couveuses', next);
      sbSync(TABLE.couveuses, next);
      return next;
    });
  };

  return (
    <DataStoreContext.Provider value={{
      grossesses, setGrossesses,
      accouchements, setAccouchements,
      nouveauNes, setNouveauNes,
      couveuses, setCouveuses,
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

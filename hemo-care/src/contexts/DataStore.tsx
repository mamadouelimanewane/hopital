import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Patient {
  id: string;
  nom: string;
  age: number;
  groupeSanguin: string;
  poidsSec: number;
  poidsEntreeHopital: number;
  dateDebutDialyse: string;
  pathologie: string;
  statut: 'Actif' | 'Suspendu' | 'Transféré';
}

export interface Seance {
  id: string;
  patientId: string;
  patientNom: string;
  date: string;
  heure: string;
  generateurId: string;
  dureeMin: number;
  poidsAvant: number;
  poidsApres: number;
  tensionAvant: string;
  tensionApres: string;
  statut: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
}

export interface Generateur {
  id: string;
  nom: string;
  salle: string;
  statut: 'Disponible' | 'Occupé' | 'Maintenance';
  dernierEntretien: string;
  prochainEntretien: string;
}

// ── Initial Data ───────────────────────────────────────────────────────────

const initialPatients: Patient[] = [
  { id: 'PAT-001', nom: 'Moustapha Kane', age: 54, groupeSanguin: 'O+', poidsSec: 68.5, poidsEntreeHopital: 72.8, dateDebutDialyse: '2022-03-14', pathologie: 'Néphropathie diabétique', statut: 'Actif' },
  { id: 'PAT-002', nom: 'Fatoumata Sarr', age: 47, groupeSanguin: 'A+', poidsSec: 61.2, poidsEntreeHopital: 64.0, dateDebutDialyse: '2021-11-02', pathologie: 'Hypertension artérielle', statut: 'Actif' },
  { id: 'PAT-003', nom: 'Ousmane Diagne', age: 62, groupeSanguin: 'B+', poidsSec: 74.0, poidsEntreeHopital: 77.5, dateDebutDialyse: '2020-06-19', pathologie: 'Glomérulonéphrite chronique', statut: 'Actif' },
  { id: 'PAT-004', nom: 'Aminata Diallo', age: 39, groupeSanguin: 'O-', poidsSec: 58.3, poidsEntreeHopital: 61.1, dateDebutDialyse: '2023-01-08', pathologie: 'Polykystose rénale', statut: 'Actif' },
  { id: 'PAT-005', nom: 'Ibrahima Ndao', age: 58, groupeSanguin: 'AB+', poidsSec: 70.7, poidsEntreeHopital: 74.2, dateDebutDialyse: '2019-09-25', pathologie: 'Néphroangiosclérose', statut: 'Suspendu' },
  { id: 'PAT-006', nom: 'Awa Gueye', age: 44, groupeSanguin: 'A-', poidsSec: 63.9, poidsEntreeHopital: 67.0, dateDebutDialyse: '2022-08-30', pathologie: 'Lupus érythémateux', statut: 'Actif' },
  { id: 'PAT-007', nom: 'Cheikh Tidiane Ba', age: 51, groupeSanguin: 'O+', poidsSec: 79.4, poidsEntreeHopital: 83.6, dateDebutDialyse: '2021-04-17', pathologie: 'Néphropathie diabétique', statut: 'Actif' },
  { id: 'PAT-008', nom: 'Sokhna Mbaye', age: 36, groupeSanguin: 'B-', poidsSec: 55.6, poidsEntreeHopital: 58.2, dateDebutDialyse: '2023-05-11', pathologie: 'Syndrome néphrotique', statut: 'Transféré' },
  { id: 'PAT-009', nom: 'Alioune Badara Faye', age: 66, groupeSanguin: 'A+', poidsSec: 72.1, poidsEntreeHopital: 75.9, dateDebutDialyse: '2018-12-03', pathologie: 'Hypertension artérielle', statut: 'Actif' },
  { id: 'PAT-010', nom: 'Ndeye Fatou Sy', age: 49, groupeSanguin: 'O+', poidsSec: 60.8, poidsEntreeHopital: 63.5, dateDebutDialyse: '2022-02-27', pathologie: 'Glomérulonéphrite chronique', statut: 'Actif' },
];

const initialGenerateurs: Generateur[] = [
  { id: 'GEN-01', nom: 'Fresenius 4008S — G-01', salle: 'Salle A', statut: 'Disponible', dernierEntretien: '2026-06-05', prochainEntretien: '2026-09-05' },
  { id: 'GEN-02', nom: 'Fresenius 4008S — G-02', salle: 'Salle A', statut: 'Occupé', dernierEntretien: '2026-05-22', prochainEntretien: '2026-08-22' },
  { id: 'GEN-03', nom: 'Nikkiso DBB-EXA — G-03', salle: 'Salle A', statut: 'Disponible', dernierEntretien: '2026-06-12', prochainEntretien: '2026-09-12' },
  { id: 'GEN-04', nom: 'Nikkiso DBB-EXA — G-04', salle: 'Salle B', statut: 'Maintenance', dernierEntretien: '2026-06-28', prochainEntretien: '2026-07-05' },
  { id: 'GEN-05', nom: 'B.Braun Dialog+ — G-05', salle: 'Salle B', statut: 'Occupé', dernierEntretien: '2026-06-01', prochainEntretien: '2026-09-01' },
  { id: 'GEN-06', nom: 'B.Braun Dialog+ — G-06', salle: 'Salle B', statut: 'Disponible', dernierEntretien: '2026-06-15', prochainEntretien: '2026-09-15' },
  { id: 'GEN-07', nom: 'Fresenius 5008 — G-07', salle: 'Salle C', statut: 'Disponible', dernierEntretien: '2026-06-20', prochainEntretien: '2026-09-20' },
  { id: 'GEN-08', nom: 'Fresenius 5008 — G-08', salle: 'Salle C', statut: 'Occupé', dernierEntretien: '2026-05-30', prochainEntretien: '2026-08-30' },
];

const initialSeances: Seance[] = [
  { id: 'SE-2026-101', patientId: 'PAT-001', patientNom: 'Moustapha Kane', date: '2026-07-02', heure: '07:00', generateurId: 'GEN-02', dureeMin: 240, poidsAvant: 72.1, poidsApres: 68.6, tensionAvant: '15/9', tensionApres: '13/8', statut: 'En cours' },
  { id: 'SE-2026-102', patientId: 'PAT-002', patientNom: 'Fatoumata Sarr', date: '2026-07-02', heure: '07:30', generateurId: 'GEN-05', dureeMin: 210, poidsAvant: 64.2, poidsApres: 61.3, tensionAvant: '14/8', tensionApres: '12/7', statut: 'En cours' },
  { id: 'SE-2026-103', patientId: 'PAT-003', patientNom: 'Ousmane Diagne', date: '2026-07-02', heure: '08:00', generateurId: 'GEN-08', dureeMin: 240, poidsAvant: 77.8, poidsApres: 74.1, tensionAvant: '16/9', tensionApres: '13/8', statut: 'Planifiée' },
  { id: 'SE-2026-104', patientId: 'PAT-004', patientNom: 'Aminata Diallo', date: '2026-07-02', heure: '12:00', generateurId: 'GEN-01', dureeMin: 200, poidsAvant: 61.0, poidsApres: 58.4, tensionAvant: '13/8', tensionApres: '12/7', statut: 'Planifiée' },
  { id: 'SE-2026-105', patientId: 'PAT-006', patientNom: 'Awa Gueye', date: '2026-07-02', heure: '13:00', generateurId: 'GEN-03', dureeMin: 210, poidsAvant: 67.2, poidsApres: 64.0, tensionAvant: '14/9', tensionApres: '12/8', statut: 'Planifiée' },
  { id: 'SE-2026-106', patientId: 'PAT-007', patientNom: 'Cheikh Tidiane Ba', date: '2026-07-01', heure: '07:00', generateurId: 'GEN-06', dureeMin: 240, poidsAvant: 83.9, poidsApres: 79.5, tensionAvant: '15/9', tensionApres: '13/8', statut: 'Terminée' },
  { id: 'SE-2026-107', patientId: 'PAT-009', patientNom: 'Alioune Badara Faye', date: '2026-07-01', heure: '08:00', generateurId: 'GEN-07', dureeMin: 220, poidsAvant: 76.2, poidsApres: 72.3, tensionAvant: '16/10', tensionApres: '13/8', statut: 'Terminée' },
  { id: 'SE-2026-108', patientId: 'PAT-010', patientNom: 'Ndeye Fatou Sy', date: '2026-07-01', heure: '12:30', generateurId: 'GEN-02', dureeMin: 200, poidsAvant: 63.9, poidsApres: 61.0, tensionAvant: '13/8', tensionApres: '11/7', statut: 'Terminée' },
  { id: 'SE-2026-109', patientId: 'PAT-001', patientNom: 'Moustapha Kane', date: '2026-06-30', heure: '07:00', generateurId: 'GEN-02', dureeMin: 240, poidsAvant: 71.6, poidsApres: 68.4, tensionAvant: '15/9', tensionApres: '13/8', statut: 'Terminée' },
  { id: 'SE-2026-110', patientId: 'PAT-003', patientNom: 'Ousmane Diagne', date: '2026-07-03', heure: '08:00', generateurId: 'GEN-08', dureeMin: 240, poidsAvant: 0, poidsApres: 0, tensionAvant: '', tensionApres: '', statut: 'Planifiée' },
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
  patients: 'patients',
  seances: 'seances',
  generateurs: 'generateurs',
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
  patients: Patient[];
  setPatients: (val: Patient[] | ((prev: Patient[]) => Patient[])) => void;
  seances: Seance[];
  setSeances: (val: Seance[] | ((prev: Seance[]) => Seance[])) => void;
  generateurs: Generateur[];
  setGenerateurs: (val: Generateur[] | ((prev: Generateur[]) => Generateur[])) => void;
  supabaseReady: boolean;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [patients, _setPatients] = useState<Patient[]>(() => lsGet('hemocare_patients', initialPatients));
  const [seances, _setSeances] = useState<Seance[]>(() => lsGet('hemocare_seances', initialSeances));
  const [generateurs, _setGenerateurs] = useState<Generateur[]>(() => lsGet('hemocare_generateurs', initialGenerateurs));
  const [supabaseReady, setSupabaseReady] = useState(false);
  const initialized = useRef(false);

  // On mount: load from Supabase (overrides localStorage if data exists)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const [sbPatients, sbSeances, sbGenerateurs] = await Promise.all([
        sbFetch<Patient>('patients'),
        sbFetch<Seance>('seances'),
        sbFetch<Generateur>('generateurs'),
      ]);

      // Seed Supabase if empty, otherwise load from Supabase
      if (sbPatients !== null) {
        if (sbPatients.length === 0) {
          await sbSync('patients', initialPatients);
          _setPatients(initialPatients);
          lsSet('hemocare_patients', initialPatients);
        } else {
          _setPatients(sbPatients);
          lsSet('hemocare_patients', sbPatients);
        }
      }
      if (sbSeances !== null) {
        if (sbSeances.length === 0) {
          await sbSync('seances', initialSeances);
          _setSeances(initialSeances);
          lsSet('hemocare_seances', initialSeances);
        } else {
          _setSeances(sbSeances);
          lsSet('hemocare_seances', sbSeances);
        }
      }
      if (sbGenerateurs !== null) {
        if (sbGenerateurs.length === 0) {
          await sbSync('generateurs', initialGenerateurs);
          _setGenerateurs(initialGenerateurs);
          lsSet('hemocare_generateurs', initialGenerateurs);
        } else {
          _setGenerateurs(sbGenerateurs);
          lsSet('hemocare_generateurs', sbGenerateurs);
        }
      }

      setSupabaseReady(true);
    })();
  }, []);

  // Wrapped setters: update state + localStorage + Supabase
  const setPatients = (val: Patient[] | ((prev: Patient[]) => Patient[])) => {
    _setPatients(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('hemocare_patients', next);
      sbSync(TABLE.patients, next);
      return next;
    });
  };

  const setSeances = (val: Seance[] | ((prev: Seance[]) => Seance[])) => {
    _setSeances(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('hemocare_seances', next);
      sbSync(TABLE.seances, next);
      return next;
    });
  };

  const setGenerateurs = (val: Generateur[] | ((prev: Generateur[]) => Generateur[])) => {
    _setGenerateurs(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('hemocare_generateurs', next);
      sbSync(TABLE.generateurs, next);
      return next;
    });
  };

  return (
    <DataStoreContext.Provider value={{ patients, setPatients, seances, setSeances, generateurs, setGenerateurs, supabaseReady }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be inside DataStoreProvider');
  return ctx;
}

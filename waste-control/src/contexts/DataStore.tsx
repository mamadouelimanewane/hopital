import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

export type TypeDechet = 'DASRI Infectieux' | 'DASRI Piquant-Coupant' | 'Pharmaceutique' | 'Chimique' | 'Assimilé Ménager';
export type StatutCollecte = 'En attente' | 'Collecté' | 'Stocké' | 'Détruit';

export interface Collecte {
  id: string;
  codeBarre: string;
  zone: string;
  typeDechet: TypeDechet;
  poidsKg: number;
  dateCollecte: string;
  collecteur: string;
  statut: StatutCollecte;
}

export interface Container {
  id: string;
  zone: string;
  service: string;
  capaciteKg: number;
  niveauRemplissagePct: number;
  dernierVidage: string;
  typeDechet: TypeDechet;
}

export interface Destruction {
  id: string;
  numeroLot: string;
  collectesIds: string[];
  dateIncineration: string;
  poidsTotalKg: number;
  numeroCertificat: string;
  operateur: string;
}

// ── Initial Data ───────────────────────────────────────────────────────────

const initialCollectes: Collecte[] = [
  { id: 'COL-2026-001', codeBarre: 'WC-8817234', zone: 'Bloc Opératoire 1', typeDechet: 'DASRI Infectieux', poidsKg: 12.4, dateCollecte: '2026-06-29 08:15', collecteur: 'Moussa Ndao', statut: 'Détruit' },
  { id: 'COL-2026-002', codeBarre: 'WC-8817235', zone: 'Urgences', typeDechet: 'DASRI Piquant-Coupant', poidsKg: 4.8, dateCollecte: '2026-06-29 09:40', collecteur: 'Moussa Ndao', statut: 'Stocké' },
  { id: 'COL-2026-003', codeBarre: 'WC-8817236', zone: 'Laboratoire Central', typeDechet: 'Chimique', poidsKg: 7.2, dateCollecte: '2026-06-30 10:05', collecteur: 'Cheikh Mbaye', statut: 'Collecté' },
  { id: 'COL-2026-004', codeBarre: 'WC-8817237', zone: 'Maternité', typeDechet: 'DASRI Infectieux', poidsKg: 15.6, dateCollecte: '2026-06-30 11:20', collecteur: 'Moussa Ndao', statut: 'Collecté' },
  { id: 'COL-2026-005', codeBarre: 'WC-8817238', zone: 'Pharmacie Centrale', typeDechet: 'Pharmaceutique', poidsKg: 9.1, dateCollecte: '2026-07-01 08:50', collecteur: 'Fatou Diagne', statut: 'En attente' },
  { id: 'COL-2026-006', codeBarre: 'WC-8817239', zone: 'Réanimation', typeDechet: 'DASRI Piquant-Coupant', poidsKg: 6.3, dateCollecte: '2026-07-01 09:30', collecteur: 'Cheikh Mbaye', statut: 'En attente' },
  { id: 'COL-2026-007', codeBarre: 'WC-8817240', zone: 'Cuisine / Administration', typeDechet: 'Assimilé Ménager', poidsKg: 38.0, dateCollecte: '2026-07-01 07:00', collecteur: 'Moussa Ndao', statut: 'Collecté' },
  { id: 'COL-2026-008', codeBarre: 'WC-8817241', zone: 'Bloc Opératoire 2', typeDechet: 'DASRI Infectieux', poidsKg: 18.9, dateCollecte: '2026-07-02 08:10', collecteur: 'Fatou Diagne', statut: 'Stocké' },
  { id: 'COL-2026-009', codeBarre: 'WC-8817242', zone: 'Radiologie', typeDechet: 'Chimique', poidsKg: 5.4, dateCollecte: '2026-07-02 09:05', collecteur: 'Cheikh Mbaye', statut: 'En attente' },
  { id: 'COL-2026-010', codeBarre: 'WC-8817243', zone: 'Hémodialyse', typeDechet: 'DASRI Piquant-Coupant', poidsKg: 3.7, dateCollecte: '2026-07-02 09:45', collecteur: 'Moussa Ndao', statut: 'Collecté' },
];

const initialContainers: Container[] = [
  { id: 'CNT-001', zone: 'Bloc Opératoire 1', service: 'Chirurgie', capaciteKg: 60, niveauRemplissagePct: 45, dernierVidage: '2026-06-29', typeDechet: 'DASRI Infectieux' },
  { id: 'CNT-002', zone: 'Bloc Opératoire 2', service: 'Chirurgie', capaciteKg: 60, niveauRemplissagePct: 88, dernierVidage: '2026-06-22', typeDechet: 'DASRI Infectieux' },
  { id: 'CNT-003', zone: 'Urgences', service: 'Urgences', capaciteKg: 40, niveauRemplissagePct: 92, dernierVidage: '2026-06-20', typeDechet: 'DASRI Piquant-Coupant' },
  { id: 'CNT-004', zone: 'Laboratoire Central', service: 'Laboratoire', capaciteKg: 30, niveauRemplissagePct: 60, dernierVidage: '2026-06-27', typeDechet: 'Chimique' },
  { id: 'CNT-005', zone: 'Maternité', service: 'Gynéco-Obstétrique', capaciteKg: 50, niveauRemplissagePct: 34, dernierVidage: '2026-06-30', typeDechet: 'DASRI Infectieux' },
  { id: 'CNT-006', zone: 'Pharmacie Centrale', service: 'Pharmacie', capaciteKg: 25, niveauRemplissagePct: 71, dernierVidage: '2026-06-24', typeDechet: 'Pharmaceutique' },
  { id: 'CNT-007', zone: 'Réanimation', service: 'Réanimation', capaciteKg: 45, niveauRemplissagePct: 55, dernierVidage: '2026-06-28', typeDechet: 'DASRI Piquant-Coupant' },
  { id: 'CNT-008', zone: 'Cuisine / Administration', service: 'Services Généraux', capaciteKg: 100, niveauRemplissagePct: 27, dernierVidage: '2026-07-01', typeDechet: 'Assimilé Ménager' },
  { id: 'CNT-009', zone: 'Hémodialyse', service: 'Néphrologie', capaciteKg: 35, niveauRemplissagePct: 83, dernierVidage: '2026-06-23', typeDechet: 'DASRI Piquant-Coupant' },
];

const initialDestructions: Destruction[] = [
  { id: 'DST-001', numeroLot: 'INC-2026-011', collectesIds: ['COL-2026-001'], dateIncineration: '2026-06-30', poidsTotalKg: 112.8, numeroCertificat: 'CERT-NDT-2026-0611', operateur: 'Ibrahima Sarr' },
  { id: 'DST-002', numeroLot: 'INC-2026-012', collectesIds: ['COL-2026-002', 'COL-2026-003'], dateIncineration: '2026-06-24', poidsTotalKg: 96.4, numeroCertificat: 'CERT-NDT-2026-0612', operateur: 'Ibrahima Sarr' },
  { id: 'DST-003', numeroLot: 'INC-2026-013', collectesIds: ['COL-2026-004'], dateIncineration: '2026-06-17', poidsTotalKg: 84.1, numeroCertificat: 'CERT-NDT-2026-0613', operateur: 'Sokhna Fall' },
  { id: 'DST-004', numeroLot: 'INC-2026-014', collectesIds: ['COL-2026-006', 'COL-2026-007'], dateIncineration: '2026-06-27', poidsTotalKg: 128.4, numeroCertificat: 'CERT-NDT-2026-0614', operateur: 'Sokhna Fall' },
  { id: 'DST-005', numeroLot: 'INC-2026-015', collectesIds: ['COL-2026-008'], dateIncineration: '2026-06-10', poidsTotalKg: 74.9, numeroCertificat: 'CERT-NDT-2026-0615', operateur: 'Ibrahima Sarr' },
  { id: 'DST-006', numeroLot: 'INC-2026-016', collectesIds: ['COL-2026-009', 'COL-2026-010'], dateIncineration: '2026-06-03', poidsTotalKg: 68.3, numeroCertificat: 'CERT-NDT-2026-0616', operateur: 'Sokhna Fall' },
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

const TABLE: Record<string, string> = {
  collectes: 'collectes',
  containers: 'containers',
  destructions: 'destructions',
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
    const { error: upsertErr } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
    if (upsertErr) throw upsertErr;

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
  collectes: Collecte[];
  setCollectes: (val: Collecte[] | ((prev: Collecte[]) => Collecte[])) => void;
  containers: Container[];
  setContainers: (val: Container[] | ((prev: Container[]) => Container[])) => void;
  destructions: Destruction[];
  setDestructions: (val: Destruction[] | ((prev: Destruction[]) => Destruction[])) => void;
  supabaseReady: boolean;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [collectes, _setCollectes] = useState<Collecte[]>(() => lsGet('wc_collectes', initialCollectes));
  const [containers, _setContainers] = useState<Container[]>(() => lsGet('wc_containers', initialContainers));
  const [destructions, _setDestructions] = useState<Destruction[]>(() => lsGet('wc_destructions', initialDestructions));
  const [supabaseReady, setSupabaseReady] = useState(false);
  const initialized = useRef(false);

  // On mount: load from Supabase (overrides localStorage if data exists)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const [sbCollectes, sbContainers, sbDestructions] = await Promise.all([
        sbFetch<Collecte>('collectes'),
        sbFetch<Container>('containers'),
        sbFetch<Destruction>('destructions'),
      ]);

      if (sbCollectes !== null) {
        if (sbCollectes.length === 0) {
          await sbSync('collectes', initialCollectes);
          _setCollectes(initialCollectes);
          lsSet('wc_collectes', initialCollectes);
        } else {
          _setCollectes(sbCollectes);
          lsSet('wc_collectes', sbCollectes);
        }
      }
      if (sbContainers !== null) {
        if (sbContainers.length === 0) {
          await sbSync('containers', initialContainers);
          _setContainers(initialContainers);
          lsSet('wc_containers', initialContainers);
        } else {
          _setContainers(sbContainers);
          lsSet('wc_containers', sbContainers);
        }
      }
      if (sbDestructions !== null) {
        if (sbDestructions.length === 0) {
          await sbSync('destructions', initialDestructions);
          _setDestructions(initialDestructions);
          lsSet('wc_destructions', initialDestructions);
        } else {
          _setDestructions(sbDestructions);
          lsSet('wc_destructions', sbDestructions);
        }
      }

      setSupabaseReady(true);
    })();
  }, []);

  // Wrapped setters: update state + localStorage + Supabase
  const setCollectes = (val: Collecte[] | ((prev: Collecte[]) => Collecte[])) => {
    _setCollectes(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('wc_collectes', next);
      sbSync(TABLE.collectes, next);
      return next;
    });
  };

  const setContainers = (val: Container[] | ((prev: Container[]) => Container[])) => {
    _setContainers(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('wc_containers', next);
      sbSync(TABLE.containers, next);
      return next;
    });
  };

  const setDestructions = (val: Destruction[] | ((prev: Destruction[]) => Destruction[])) => {
    _setDestructions(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('wc_destructions', next);
      sbSync(TABLE.destructions, next);
      return next;
    });
  };

  return (
    <DataStoreContext.Provider value={{
      collectes, setCollectes,
      containers, setContainers,
      destructions, setDestructions,
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

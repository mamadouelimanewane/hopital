import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Visiteur {
  id: string;
  nom: string;
  badgeNumero: string;
  serviceVisite: string;
  patientVisite: string;
  heureEntree: string;
  heureSortie: string | null;
  statut: 'En visite' | 'Sorti';
}

export interface Zone {
  id: string;
  nom: string;
  batiment: string;
  etage: string;
  categorie: 'Consultation' | 'Urgences' | 'Hospitalisation' | 'Administration' | 'Services';
  coordX: number;
  coordY: number;
}

export interface PlaceParking {
  id: string;
  numero: string;
  zone: 'Visiteurs' | 'Personnel' | 'Ambulances';
  statut: 'Libre' | 'Occupée' | 'Réservée';
}

// ── Initial Data ───────────────────────────────────────────────────────────

const initialVisiteurs: Visiteur[] = [
  { id: 'VIS-001', nom: 'Awa Diagne', badgeNumero: 'B-1041', serviceVisite: 'Cardiologie', patientVisite: 'Modou Diagne', heureEntree: '08:15', heureSortie: null, statut: 'En visite' },
  { id: 'VIS-002', nom: 'Ousmane Kane', badgeNumero: 'B-1042', serviceVisite: 'Maternité', patientVisite: 'Aissatou Kane', heureEntree: '08:40', heureSortie: null, statut: 'En visite' },
  { id: 'VIS-003', nom: 'Bineta Sy', badgeNumero: 'B-1043', serviceVisite: 'Pédiatrie', patientVisite: 'Ibrahima Sy', heureEntree: '09:05', heureSortie: '10:20', statut: 'Sorti' },
  { id: 'VIS-004', nom: 'Cheikh Fall', badgeNumero: 'B-1044', serviceVisite: 'Urgences', patientVisite: 'Ndeye Fall', heureEntree: '09:30', heureSortie: null, statut: 'En visite' },
  { id: 'VIS-005', nom: 'Mariéme Ba', badgeNumero: 'B-1045', serviceVisite: 'Chirurgie', patientVisite: 'Alioune Ba', heureEntree: '10:00', heureSortie: '11:45', statut: 'Sorti' },
  { id: 'VIS-006', nom: 'Serigne Mbaye', badgeNumero: 'B-1046', serviceVisite: 'Réanimation', patientVisite: 'Fatou Mbaye', heureEntree: '10:20', heureSortie: null, statut: 'En visite' },
  { id: 'VIS-007', nom: 'Ndeye Sow', badgeNumero: 'B-1047', serviceVisite: 'Consultation Externe', patientVisite: 'Abdou Sow', heureEntree: '11:00', heureSortie: null, statut: 'En visite' },
  { id: 'VIS-008', nom: 'Lamine Diouf', badgeNumero: 'B-1048', serviceVisite: 'Radiologie', patientVisite: 'Khady Diouf', heureEntree: '11:15', heureSortie: '12:00', statut: 'Sorti' },
];

const initialZones: Zone[] = [
  { id: 'ZON-001', nom: 'Accueil Principal', batiment: 'Bâtiment A', etage: 'RDC', categorie: 'Administration', coordX: 10, coordY: 50 },
  { id: 'ZON-002', nom: 'Consultations Externes', batiment: 'Bâtiment A', etage: 'RDC', categorie: 'Consultation', coordX: 25, coordY: 30 },
  { id: 'ZON-003', nom: 'Urgences', batiment: 'Bâtiment B', etage: 'RDC', categorie: 'Urgences', coordX: 45, coordY: 15 },
  { id: 'ZON-004', nom: 'Radiologie', batiment: 'Bâtiment A', etage: 'RDC', categorie: 'Services', coordX: 25, coordY: 65 },
  { id: 'ZON-005', nom: 'Laboratoire', batiment: 'Bâtiment A', etage: 'RDC', categorie: 'Services', coordX: 40, coordY: 70 },
  { id: 'ZON-006', nom: 'Cardiologie', batiment: 'Bâtiment C', etage: '1er étage', categorie: 'Hospitalisation', coordX: 65, coordY: 25 },
  { id: 'ZON-007', nom: 'Maternité', batiment: 'Bâtiment C', etage: '1er étage', categorie: 'Hospitalisation', coordX: 80, coordY: 35 },
  { id: 'ZON-008', nom: 'Pédiatrie', batiment: 'Bâtiment C', etage: '2ème étage', categorie: 'Hospitalisation', coordX: 65, coordY: 55 },
  { id: 'ZON-009', nom: 'Bloc Opératoire', batiment: 'Bâtiment B', etage: '1er étage', categorie: 'Services', coordX: 50, coordY: 45 },
  { id: 'ZON-010', nom: 'Direction Générale', batiment: 'Bâtiment A', etage: '2ème étage', categorie: 'Administration', coordX: 15, coordY: 85 },
];

const initialParking: PlaceParking[] = [
  { id: 'PAR-001', numero: 'V-01', zone: 'Visiteurs', statut: 'Libre' },
  { id: 'PAR-002', numero: 'V-02', zone: 'Visiteurs', statut: 'Occupée' },
  { id: 'PAR-003', numero: 'V-03', zone: 'Visiteurs', statut: 'Occupée' },
  { id: 'PAR-004', numero: 'V-04', zone: 'Visiteurs', statut: 'Libre' },
  { id: 'PAR-005', numero: 'V-05', zone: 'Visiteurs', statut: 'Réservée' },
  { id: 'PAR-006', numero: 'P-01', zone: 'Personnel', statut: 'Occupée' },
  { id: 'PAR-007', numero: 'P-02', zone: 'Personnel', statut: 'Occupée' },
  { id: 'PAR-008', numero: 'P-03', zone: 'Personnel', statut: 'Libre' },
  { id: 'PAR-009', numero: 'A-01', zone: 'Ambulances', statut: 'Libre' },
  { id: 'PAR-010', numero: 'A-02', zone: 'Ambulances', statut: 'Réservée' },
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
  visiteurs: 'visiteurs',
  zones: 'zones',
  placesParking: 'places_parking',
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
  visiteurs: Visiteur[];
  setVisiteurs: (val: Visiteur[] | ((prev: Visiteur[]) => Visiteur[])) => void;
  zones: Zone[];
  setZones: (val: Zone[] | ((prev: Zone[]) => Zone[])) => void;
  placesParking: PlaceParking[];
  setPlacesParking: (val: PlaceParking[] | ((prev: PlaceParking[]) => PlaceParking[])) => void;
  supabaseReady: boolean;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [visiteurs, _setVisiteurs] = useState<Visiteur[]>(() => lsGet('ig_visiteurs', initialVisiteurs));
  const [zones, _setZones] = useState<Zone[]>(() => lsGet('ig_zones', initialZones));
  const [placesParking, _setPlacesParking] = useState<PlaceParking[]>(() => lsGet('ig_parking', initialParking));
  const [supabaseReady, setSupabaseReady] = useState(false);
  const initialized = useRef(false);

  // On mount: load from Supabase (overrides localStorage if data exists)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const [sbVisiteurs, sbZones, sbParking] = await Promise.all([
        sbFetch<Visiteur>('visiteurs'),
        sbFetch<Zone>('zones'),
        sbFetch<PlaceParking>('places_parking'),
      ]);

      // Seed Supabase if empty, otherwise load from Supabase
      if (sbVisiteurs !== null) {
        if (sbVisiteurs.length === 0) {
          await sbSync('visiteurs', initialVisiteurs);
          _setVisiteurs(initialVisiteurs);
          lsSet('ig_visiteurs', initialVisiteurs);
        } else {
          _setVisiteurs(sbVisiteurs);
          lsSet('ig_visiteurs', sbVisiteurs);
        }
      }
      if (sbZones !== null) {
        if (sbZones.length === 0) {
          await sbSync('zones', initialZones);
          _setZones(initialZones);
          lsSet('ig_zones', initialZones);
        } else {
          _setZones(sbZones);
          lsSet('ig_zones', sbZones);
        }
      }
      if (sbParking !== null) {
        if (sbParking.length === 0) {
          await sbSync('places_parking', initialParking);
          _setPlacesParking(initialParking);
          lsSet('ig_parking', initialParking);
        } else {
          _setPlacesParking(sbParking);
          lsSet('ig_parking', sbParking);
        }
      }

      setSupabaseReady(true);
    })();
  }, []);

  // Wrapped setters: update state + localStorage + Supabase
  const setVisiteurs = (val: Visiteur[] | ((prev: Visiteur[]) => Visiteur[])) => {
    _setVisiteurs(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('ig_visiteurs', next);
      sbSync(TABLE.visiteurs, next);
      return next;
    });
  };

  const setZones = (val: Zone[] | ((prev: Zone[]) => Zone[])) => {
    _setZones(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('ig_zones', next);
      sbSync(TABLE.zones, next);
      return next;
    });
  };

  const setPlacesParking = (val: PlaceParking[] | ((prev: PlaceParking[]) => PlaceParking[])) => {
    _setPlacesParking(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('ig_parking', next);
      sbSync(TABLE.placesParking, next);
      return next;
    });
  };

  return (
    <DataStoreContext.Provider value={{ visiteurs, setVisiteurs, zones, setZones, placesParking, setPlacesParking, supabaseReady }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be inside DataStoreProvider');
  return ctx;
}

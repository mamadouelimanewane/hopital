import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DossierPatient {
  id: string;
  nomPatient: string;
  hopitalOrigine: string;
  derniereSynchro: string;
  statutSynchro: 'Synchronisé' | 'En attente' | 'Erreur';
  nombreDocuments: number;
}

export interface Connecteur {
  id: string;
  nom: string;
  type: 'HL7 v2' | 'FHIR R4';
  hopitalDistant: string;
  statut: 'Actif' | 'Inactif' | 'Erreur';
  dernierPing: string;
  latenceMs: number;
}

export interface LogSynchro {
  id: string;
  connecteurNom: string;
  date: string;
  typeEvenement: 'Synchronisation' | 'Erreur' | 'Reconnexion';
  statut: 'Succès' | 'Échec';
  message: string;
}

// ── Initial Data ───────────────────────────────────────────────────────────

const initialDossiers: DossierPatient[] = [
  { id: 'DMP-1001', nomPatient: 'Fatoumata Bâ',        hopitalOrigine: 'Hôpital Ndamatou Touba',         derniereSynchro: '02 Jui. 2026, 09:14', statutSynchro: 'Synchronisé', nombreDocuments: 12 },
  { id: 'DMP-1002', nomPatient: 'Ousmane Diagne',       hopitalOrigine: 'CHU Aristide Le Dantec Dakar',   derniereSynchro: '02 Jui. 2026, 08:52', statutSynchro: 'Synchronisé', nombreDocuments: 7  },
  { id: 'DMP-1003', nomPatient: 'Aminata Sy',           hopitalOrigine: 'Hôpital Régional de Thiès',      derniereSynchro: '01 Jui. 2026, 22:31', statutSynchro: 'En attente',  nombreDocuments: 4  },
  { id: 'DMP-1004', nomPatient: 'Mor Talla Diop',       hopitalOrigine: 'Hôpital Ndamatou Touba',         derniereSynchro: '02 Jui. 2026, 07:40', statutSynchro: 'Synchronisé', nombreDocuments: 19 },
  { id: 'DMP-1005', nomPatient: 'Coumba Ndoye',         hopitalOrigine: 'Hôpital Régional de Saint-Louis',derniereSynchro: '01 Jui. 2026, 18:05', statutSynchro: 'Erreur',      nombreDocuments: 3  },
  { id: 'DMP-1006', nomPatient: 'Ibrahima Cissé',       hopitalOrigine: 'Hôpital Régional de Kaolack',    derniereSynchro: '02 Jui. 2026, 06:12', statutSynchro: 'Synchronisé', nombreDocuments: 9  },
  { id: 'DMP-1007', nomPatient: 'Ndèye Fatou Gueye',    hopitalOrigine: 'Hôpital de Ziguinchor',          derniereSynchro: '01 Jui. 2026, 20:47', statutSynchro: 'En attente',  nombreDocuments: 6  },
  { id: 'DMP-1008', nomPatient: 'Modou Lô',             hopitalOrigine: 'Hôpital Ndamatou Touba',         derniereSynchro: '02 Jui. 2026, 09:02', statutSynchro: 'Synchronisé', nombreDocuments: 15 },
  { id: 'DMP-1009', nomPatient: 'Ramatoulaye Sall',     hopitalOrigine: 'CHU Aristide Le Dantec Dakar',   derniereSynchro: '01 Jui. 2026, 23:58', statutSynchro: 'Erreur',      nombreDocuments: 2  },
  { id: 'DMP-1010', nomPatient: 'Babacar Fall',         hopitalOrigine: 'Hôpital Régional de Thiès',      derniereSynchro: '02 Jui. 2026, 05:29', statutSynchro: 'Synchronisé', nombreDocuments: 11 },
];

const initialConnecteurs: Connecteur[] = [
  { id: 'CNX-01', nom: 'Passerelle FHIR — Ndamatou Central',   type: 'FHIR R4', hopitalDistant: 'Hôpital Ndamatou Touba',          statut: 'Actif',   dernierPing: '02 Jui. 2026, 09:20', latenceMs: 42  },
  { id: 'CNX-02', nom: 'Interface HL7 — Le Dantec',             type: 'HL7 v2',  hopitalDistant: 'CHU Aristide Le Dantec Dakar',    statut: 'Actif',   dernierPing: '02 Jui. 2026, 09:18', latenceMs: 118 },
  { id: 'CNX-03', nom: 'Passerelle FHIR — Thiès Régional',      type: 'FHIR R4', hopitalDistant: 'Hôpital Régional de Thiès',       statut: 'Actif',   dernierPing: '02 Jui. 2026, 09:15', latenceMs: 210 },
  { id: 'CNX-04', nom: 'Interface HL7 — Saint-Louis',           type: 'HL7 v2',  hopitalDistant: 'Hôpital Régional de Saint-Louis', statut: 'Erreur',  dernierPing: '01 Jui. 2026, 18:03', latenceMs: 0   },
  { id: 'CNX-05', nom: 'Passerelle FHIR — Kaolack',             type: 'FHIR R4', hopitalDistant: 'Hôpital Régional de Kaolack',     statut: 'Actif',   dernierPing: '02 Jui. 2026, 09:11', latenceMs: 165 },
  { id: 'CNX-06', nom: 'Interface HL7 — Ziguinchor',            type: 'HL7 v2',  hopitalDistant: 'Hôpital de Ziguinchor',           statut: 'Inactif', dernierPing: '30 Jui. 2026, 14:22', latenceMs: 0   },
  { id: 'CNX-07', nom: 'Passerelle FHIR — Ministère Santé',     type: 'FHIR R4', hopitalDistant: 'Réseau National de Santé',        statut: 'Actif',   dernierPing: '02 Jui. 2026, 09:21', latenceMs: 88  },
];

const initialLogs: LogSynchro[] = [
  { id: 'LOG-2001', connecteurNom: 'Passerelle FHIR — Ndamatou Central', date: '02 Jui. 2026, 09:20', typeEvenement: 'Synchronisation', statut: 'Succès', message: '24 dossiers synchronisés avec succès.' },
  { id: 'LOG-2002', connecteurNom: 'Interface HL7 — Le Dantec',           date: '02 Jui. 2026, 09:18', typeEvenement: 'Synchronisation', statut: 'Succès', message: '8 dossiers reçus depuis CHU Le Dantec.' },
  { id: 'LOG-2003', connecteurNom: 'Interface HL7 — Saint-Louis',         date: '01 Jui. 2026, 18:03', typeEvenement: 'Erreur',          statut: 'Échec',  message: 'Timeout de connexion — délai dépassé (30s).' },
  { id: 'LOG-2004', connecteurNom: 'Passerelle FHIR — Thiès Régional',    date: '02 Jui. 2026, 09:15', typeEvenement: 'Synchronisation', statut: 'Succès', message: '5 dossiers mis à jour.' },
  { id: 'LOG-2005', connecteurNom: 'Interface HL7 — Ziguinchor',          date: '30 Jui. 2026, 14:25', typeEvenement: 'Erreur',          statut: 'Échec',  message: 'Connecteur désactivé manuellement par administrateur.' },
  { id: 'LOG-2006', connecteurNom: 'Passerelle FHIR — Kaolack',           date: '02 Jui. 2026, 09:11', typeEvenement: 'Synchronisation', statut: 'Succès', message: '3 dossiers synchronisés, 1 document ajouté.' },
  { id: 'LOG-2007', connecteurNom: 'Interface HL7 — Saint-Louis',         date: '01 Jui. 2026, 17:58', typeEvenement: 'Reconnexion',     statut: 'Échec',  message: 'Tentative de reconnexion automatique échouée (3/3).' },
  { id: 'LOG-2008', connecteurNom: 'Passerelle FHIR — Ministère Santé',   date: '02 Jui. 2026, 09:21', typeEvenement: 'Synchronisation', statut: 'Succès', message: 'Rapport national agrégé transmis.' },
  { id: 'LOG-2009', connecteurNom: 'Passerelle FHIR — Ndamatou Central',  date: '02 Jui. 2026, 08:50', typeEvenement: 'Synchronisation', statut: 'Succès', message: '19 dossiers envoyés vers le réseau national.' },
  { id: 'LOG-2010', connecteurNom: 'Interface HL7 — Le Dantec',           date: '02 Jui. 2026, 07:30', typeEvenement: 'Reconnexion',     statut: 'Succès', message: 'Connexion rétablie après coupure réseau brève.' },
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
  dossiers: 'dossiers_patients',
  connecteurs: 'connecteurs',
  logs: 'logs_synchro',
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
  dossiers: DossierPatient[];
  setDossiers: (val: DossierPatient[] | ((prev: DossierPatient[]) => DossierPatient[])) => void;
  connecteurs: Connecteur[];
  setConnecteurs: (val: Connecteur[] | ((prev: Connecteur[]) => Connecteur[])) => void;
  logs: LogSynchro[];
  setLogs: (val: LogSynchro[] | ((prev: LogSynchro[]) => LogSynchro[])) => void;
  supabaseReady: boolean;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [dossiers, _setDossiers] = useState<DossierPatient[]>(() => lsGet('dmp_dossiers', initialDossiers));
  const [connecteurs, _setConnecteurs] = useState<Connecteur[]>(() => lsGet('dmp_connecteurs', initialConnecteurs));
  const [logs, _setLogs] = useState<LogSynchro[]>(() => lsGet('dmp_logs', initialLogs));
  const [supabaseReady, setSupabaseReady] = useState(false);
  const initialized = useRef(false);

  // On mount: load from Supabase (overrides localStorage if data exists)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const [sbDossiers, sbConnecteurs, sbLogs] = await Promise.all([
        sbFetch<DossierPatient>('dossiers_patients'),
        sbFetch<Connecteur>('connecteurs'),
        sbFetch<LogSynchro>('logs_synchro'),
      ]);

      // Seed Supabase if empty, otherwise load from Supabase
      if (sbDossiers !== null) {
        if (sbDossiers.length === 0) {
          await sbSync('dossiers_patients', initialDossiers);
          _setDossiers(initialDossiers);
          lsSet('dmp_dossiers', initialDossiers);
        } else {
          _setDossiers(sbDossiers);
          lsSet('dmp_dossiers', sbDossiers);
        }
      }
      if (sbConnecteurs !== null) {
        if (sbConnecteurs.length === 0) {
          await sbSync('connecteurs', initialConnecteurs);
          _setConnecteurs(initialConnecteurs);
          lsSet('dmp_connecteurs', initialConnecteurs);
        } else {
          _setConnecteurs(sbConnecteurs);
          lsSet('dmp_connecteurs', sbConnecteurs);
        }
      }
      if (sbLogs !== null) {
        if (sbLogs.length === 0) {
          await sbSync('logs_synchro', initialLogs);
          _setLogs(initialLogs);
          lsSet('dmp_logs', initialLogs);
        } else {
          _setLogs(sbLogs);
          lsSet('dmp_logs', sbLogs);
        }
      }

      setSupabaseReady(true);
    })();
  }, []);

  // Wrapped setters: update state + localStorage + Supabase
  const setDossiers = (val: DossierPatient[] | ((prev: DossierPatient[]) => DossierPatient[])) => {
    _setDossiers(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('dmp_dossiers', next);
      sbSync(TABLE.dossiers, next);
      return next;
    });
  };

  const setConnecteurs = (val: Connecteur[] | ((prev: Connecteur[]) => Connecteur[])) => {
    _setConnecteurs(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('dmp_connecteurs', next);
      sbSync(TABLE.connecteurs, next);
      return next;
    });
  };

  const setLogs = (val: LogSynchro[] | ((prev: LogSynchro[]) => LogSynchro[])) => {
    _setLogs(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('dmp_logs', next);
      sbSync(TABLE.logs, next);
      return next;
    });
  };

  return (
    <DataStoreContext.Provider value={{ dossiers, setDossiers, connecteurs, setConnecteurs, logs, setLogs, supabaseReady }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be inside DataStoreProvider');
  return ctx;
}

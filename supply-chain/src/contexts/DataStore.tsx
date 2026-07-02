import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Commande {
  id: string;
  fournisseurNom: string;
  articles: string;
  montantFcfa: number;
  statut: 'Brouillon' | 'Envoyée' | 'Confirmée' | 'Livrée' | 'Annulée';
  dateCommande: string;
  dateLivraisonPrevue: string;
}

export interface Fournisseur {
  id: string;
  nom: string;
  categorie: 'Alimentation' | 'Blanchisserie' | 'Fournitures' | 'Équipement';
  contact: string;
  telephone: string;
  delaiMoyenJours: number;
  notation: number; // 1-5
}

export interface Livraison {
  id: string;
  commandeId: string;
  fournisseurNom: string;
  dateReçue: string;
  conforme: boolean;
  remarque: string;
}

export interface StockNonMedical {
  id: string;
  article: string;
  categorie: 'Linge' | 'Cuisine' | 'Fournitures Bureau';
  quantite: number;
  quantiteMin: number;
  unite: string;
}

// ── Initial Data ───────────────────────────────────────────────────────────

const initialCommandes: Commande[] = [
  { id: 'CMD-101', fournisseurNom: 'Touba Alimentation Gros', articles: 'Riz brisé (500kg), Huile végétale (100L)', montantFcfa: 1850000, statut: 'Livrée', dateCommande: '2026-06-02', dateLivraisonPrevue: '2026-06-06' },
  { id: 'CMD-102', fournisseurNom: 'Sénégal Linge Pro', articles: 'Draps hospitaliers (300u), Taies oreiller (300u)', montantFcfa: 2400000, statut: 'Confirmée', dateCommande: '2026-06-10', dateLivraisonPrevue: '2026-06-20' },
  { id: 'CMD-103', fournisseurNom: 'Diourbel Fournitures & Bureau', articles: 'Ramettes papier A4 (50), Stylos (300)', montantFcfa: 375000, statut: 'Envoyée', dateCommande: '2026-06-15', dateLivraisonPrevue: '2026-06-22' },
  { id: 'CMD-104', fournisseurNom: 'Touba Alimentation Gros', articles: 'Légumes frais (200kg), Poisson (150kg)', montantFcfa: 980000, statut: 'Livrée', dateCommande: '2026-06-18', dateLivraisonPrevue: '2026-06-19' },
  { id: 'CMD-105', fournisseurNom: 'Baol Équipements Hôteliers', articles: 'Marmites inox (10u), Chariots repas (5u)', montantFcfa: 3200000, statut: 'Brouillon', dateCommande: '2026-06-25', dateLivraisonPrevue: '2026-07-10' },
  { id: 'CMD-106', fournisseurNom: 'Sénégal Linge Pro', articles: 'Blouses soignants (150u)', montantFcfa: 1125000, statut: 'Annulée', dateCommande: '2026-06-08', dateLivraisonPrevue: '2026-06-15' },
  { id: 'CMD-107', fournisseurNom: 'Thiès Détergents & Hygiène', articles: 'Détergent industriel (80L), Javel (60L)', montantFcfa: 640000, statut: 'Confirmée', dateCommande: '2026-06-27', dateLivraisonPrevue: '2026-07-04' },
  { id: 'CMD-108', fournisseurNom: 'Touba Alimentation Gros', articles: 'Céréales & légumineuses (400kg)', montantFcfa: 1520000, statut: 'Confirmée', dateCommande: '2026-06-29', dateLivraisonPrevue: '2026-07-06' },
  { id: 'CMD-109', fournisseurNom: 'Diourbel Fournitures & Bureau', articles: 'Cartouches imprimante (25u), Classeurs (100u)', montantFcfa: 480000, statut: 'Envoyée', dateCommande: '2026-07-01', dateLivraisonPrevue: '2026-07-08' },
  { id: 'CMD-110', fournisseurNom: 'Baol Équipements Hôteliers', articles: 'Vaisselle inox réfectoire (200 pièces)', montantFcfa: 1650000, statut: 'Brouillon', dateCommande: '2026-07-02', dateLivraisonPrevue: '2026-07-18' },
];

const initialFournisseurs: Fournisseur[] = [
  { id: 'FRN-001', nom: 'Touba Alimentation Gros', categorie: 'Alimentation', contact: 'M. Serigne Fall', telephone: '+221 77 542 18 90', delaiMoyenJours: 3, notation: 4.5 },
  { id: 'FRN-002', nom: 'Sénégal Linge Pro', categorie: 'Blanchisserie', contact: 'Mme Coumba Diagne', telephone: '+221 76 220 44 15', delaiMoyenJours: 8, notation: 4.0 },
  { id: 'FRN-003', nom: 'Diourbel Fournitures & Bureau', categorie: 'Fournitures', contact: 'M. Ousmane Kane', telephone: '+221 78 310 92 27', delaiMoyenJours: 5, notation: 3.8 },
  { id: 'FRN-004', nom: 'Baol Équipements Hôteliers', categorie: 'Équipement', contact: 'M. Alioune Badara Mbaye', telephone: '+221 77 905 63 41', delaiMoyenJours: 14, notation: 4.2 },
  { id: 'FRN-005', nom: 'Thiès Détergents & Hygiène', categorie: 'Fournitures', contact: 'Mme Rokhaya Seck', telephone: '+221 70 481 27 63', delaiMoyenJours: 6, notation: 4.3 },
  { id: 'FRN-006', nom: 'Touba Marché Central Traiteur', categorie: 'Alimentation', contact: 'M. Ibrahima Lô', telephone: '+221 76 654 30 12', delaiMoyenJours: 2, notation: 3.5 },
  { id: 'FRN-007', nom: 'Kaolack Textiles Hospitaliers', categorie: 'Blanchisserie', contact: 'Mme Astou Ndao', telephone: '+221 77 118 76 55', delaiMoyenJours: 10, notation: 3.9 },
];

const initialLivraisons: Livraison[] = [
  { id: 'LIV-011', commandeId: 'CMD-101', fournisseurNom: 'Touba Alimentation Gros', dateReçue: '2026-06-06', conforme: true, remarque: 'Quantités conformes au bon de commande.' },
  { id: 'LIV-012', commandeId: 'CMD-104', fournisseurNom: 'Touba Alimentation Gros', dateReçue: '2026-06-19', conforme: true, remarque: 'Fraîcheur vérifiée, RAS.' },
  { id: 'LIV-013', commandeId: 'CMD-106', fournisseurNom: 'Sénégal Linge Pro', dateReçue: '2026-06-14', conforme: false, remarque: 'Commande annulée avant réception finale, retour partiel.' },
  { id: 'LIV-014', commandeId: 'CMD-102', fournisseurNom: 'Sénégal Linge Pro', dateReçue: '2026-06-19', conforme: false, remarque: '12 draps tachés à l\'arrivée, retour au fournisseur demandé.' },
  { id: 'LIV-015', commandeId: 'CMD-103', fournisseurNom: 'Diourbel Fournitures & Bureau', dateReçue: '2026-06-21', conforme: true, remarque: 'Livraison complète et conforme.' },
  { id: 'LIV-016', commandeId: 'CMD-107', fournisseurNom: 'Thiès Détergents & Hygiène', dateReçue: '2026-07-01', conforme: true, remarque: 'Emballages intacts, quantités correctes.' },
];

const initialStocks: StockNonMedical[] = [
  { id: 'STK-201', article: 'Riz brisé', categorie: 'Cuisine', quantite: 12, quantiteMin: 50, unite: 'kg' },
  { id: 'STK-202', article: 'Huile végétale', categorie: 'Cuisine', quantite: 35, quantiteMin: 20, unite: 'L' },
  { id: 'STK-203', article: 'Légumes frais', categorie: 'Cuisine', quantite: 8, quantiteMin: 30, unite: 'kg' },
  { id: 'STK-204', article: 'Poisson congelé', categorie: 'Cuisine', quantite: 45, quantiteMin: 25, unite: 'kg' },
  { id: 'STK-205', article: 'Draps hospitaliers', categorie: 'Linge', quantite: 180, quantiteMin: 100, unite: 'unités' },
  { id: 'STK-206', article: 'Taies oreiller', categorie: 'Linge', quantite: 60, quantiteMin: 80, unite: 'unités' },
  { id: 'STK-207', article: 'Blouses soignants', categorie: 'Linge', quantite: 22, quantiteMin: 40, unite: 'unités' },
  { id: 'STK-208', article: 'Ramettes papier A4', categorie: 'Fournitures Bureau', quantite: 15, quantiteMin: 20, unite: 'ramettes' },
  { id: 'STK-209', article: 'Cartouches imprimante', categorie: 'Fournitures Bureau', quantite: 6, quantiteMin: 10, unite: 'unités' },
  { id: 'STK-210', article: 'Détergent industriel', categorie: 'Cuisine', quantite: 28, quantiteMin: 15, unite: 'L' },
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
  commandes: 'commandes',
  fournisseurs: 'fournisseurs',
  livraisons: 'livraisons',
  stocks: 'stocks_non_medicaux',
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
  commandes: Commande[];
  setCommandes: (val: Commande[] | ((prev: Commande[]) => Commande[])) => void;
  fournisseurs: Fournisseur[];
  setFournisseurs: (val: Fournisseur[] | ((prev: Fournisseur[]) => Fournisseur[])) => void;
  livraisons: Livraison[];
  setLivraisons: (val: Livraison[] | ((prev: Livraison[]) => Livraison[])) => void;
  stocks: StockNonMedical[];
  setStocks: (val: StockNonMedical[] | ((prev: StockNonMedical[]) => StockNonMedical[])) => void;
  supabaseReady: boolean;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [commandes, _setCommandes] = useState<Commande[]>(() => lsGet('sc_commandes', initialCommandes));
  const [fournisseurs, _setFournisseurs] = useState<Fournisseur[]>(() => lsGet('sc_fournisseurs', initialFournisseurs));
  const [livraisons, _setLivraisons] = useState<Livraison[]>(() => lsGet('sc_livraisons', initialLivraisons));
  const [stocks, _setStocks] = useState<StockNonMedical[]>(() => lsGet('sc_stocks', initialStocks));
  const [supabaseReady, setSupabaseReady] = useState(false);
  const initialized = useRef(false);

  // On mount: load from Supabase (overrides localStorage if data exists)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const [sbCommandes, sbFournisseurs, sbLivraisons, sbStocks] = await Promise.all([
        sbFetch<Commande>('commandes'),
        sbFetch<Fournisseur>('fournisseurs'),
        sbFetch<Livraison>('livraisons'),
        sbFetch<StockNonMedical>('stocks_non_medicaux'),
      ]);

      // Seed Supabase if empty, otherwise load from Supabase
      if (sbCommandes !== null) {
        if (sbCommandes.length === 0) {
          await sbSync('commandes', initialCommandes);
          _setCommandes(initialCommandes);
          lsSet('sc_commandes', initialCommandes);
        } else {
          _setCommandes(sbCommandes);
          lsSet('sc_commandes', sbCommandes);
        }
      }
      if (sbFournisseurs !== null) {
        if (sbFournisseurs.length === 0) {
          await sbSync('fournisseurs', initialFournisseurs);
          _setFournisseurs(initialFournisseurs);
          lsSet('sc_fournisseurs', initialFournisseurs);
        } else {
          _setFournisseurs(sbFournisseurs);
          lsSet('sc_fournisseurs', sbFournisseurs);
        }
      }
      if (sbLivraisons !== null) {
        if (sbLivraisons.length === 0) {
          await sbSync('livraisons', initialLivraisons);
          _setLivraisons(initialLivraisons);
          lsSet('sc_livraisons', initialLivraisons);
        } else {
          _setLivraisons(sbLivraisons);
          lsSet('sc_livraisons', sbLivraisons);
        }
      }
      if (sbStocks !== null) {
        if (sbStocks.length === 0) {
          await sbSync('stocks_non_medicaux', initialStocks);
          _setStocks(initialStocks);
          lsSet('sc_stocks', initialStocks);
        } else {
          _setStocks(sbStocks);
          lsSet('sc_stocks', sbStocks);
        }
      }

      setSupabaseReady(true);
    })();
  }, []);

  // Wrapped setters: update state + localStorage + Supabase
  const setCommandes = (val: Commande[] | ((prev: Commande[]) => Commande[])) => {
    _setCommandes(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('sc_commandes', next);
      sbSync(TABLE.commandes, next);
      return next;
    });
  };

  const setFournisseurs = (val: Fournisseur[] | ((prev: Fournisseur[]) => Fournisseur[])) => {
    _setFournisseurs(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('sc_fournisseurs', next);
      sbSync(TABLE.fournisseurs, next);
      return next;
    });
  };

  const setLivraisons = (val: Livraison[] | ((prev: Livraison[]) => Livraison[])) => {
    _setLivraisons(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('sc_livraisons', next);
      sbSync(TABLE.livraisons, next);
      return next;
    });
  };

  const setStocks = (val: StockNonMedical[] | ((prev: StockNonMedical[]) => StockNonMedical[])) => {
    _setStocks(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      lsSet('sc_stocks', next);
      sbSync(TABLE.stocks, next);
      return next;
    });
  };

  return (
    <DataStoreContext.Provider value={{
      commandes, setCommandes,
      fournisseurs, setFournisseurs,
      livraisons, setLivraisons,
      stocks, setStocks,
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

import { useState } from 'react';
import { Search, ShoppingCart, X, Calendar, Truck, Coins } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Commande } from '../contexts/DataStore';

const STATUTS: Commande['statut'][] = ['Brouillon', 'Envoyée', 'Confirmée', 'Livrée', 'Annulée'];

const statutColors: Record<string, string> = {
  'Brouillon': 'bg-slate-500/15 text-slate-400',
  'Envoyée': 'bg-blue-500/15 text-blue-400',
  'Confirmée': 'bg-amber-500/15 text-amber-400',
  'Livrée': 'bg-emerald-500/15 text-emerald-400',
  'Annulée': 'bg-rose-500/15 text-rose-400',
};

function CommandeDetailModal({ commande, onClose }: { commande: Commande; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-strong rounded-2xl p-6 shadow-2xl border border-slate-700/50 z-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-amber-400" size={20} />
            <h3 className="text-lg font-bold text-white">{commande.id}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Statut</span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statutColors[commande.statut]}`}>{commande.statut}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Truck size={14} className="text-slate-500" />
              <span className="font-semibold">{commande.fournisseurNom}</span>
            </div>
            <p className="text-xs text-slate-400">{commande.articles}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                <Calendar size={11} /> Date Commande
              </div>
              <p className="text-sm font-semibold text-slate-200">{commande.dateCommande}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                <Calendar size={11} /> Livraison Prévue
              </div>
              <p className="text-sm font-semibold text-slate-200">{commande.dateLivraisonPrevue}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <Coins size={14} /> Montant total
            </div>
            <span className="text-lg font-bold text-white">{commande.montantFcfa.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default function Commandes() {
  const { commandes } = useDataStore();
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('Tous');
  const [selected, setSelected] = useState<Commande | null>(null);

  const filtered = commandes.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.fournisseurNom.toLowerCase().includes(search.toLowerCase()) ||
      c.articles.toLowerCase().includes(search.toLowerCase());
    const matchesStatut = statutFilter === 'Tous' || c.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });

  return (
    <>
      {selected && <CommandeDetailModal commande={selected} onClose={() => setSelected(null)} />}

      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Commandes</h1>
            <p className="text-sm text-slate-400 mt-1">
              Suivi des achats non-médicaux · {commandes.length} commandes au total
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Rechercher par n°, fournisseur, articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Filtrer:</span>
            {['Tous', ...STATUTS].map((s) => (
              <button
                key={s}
                onClick={() => setStatutFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  statutFilter === s ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass border border-slate-700/40 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-semibold">N° Commande</th>
                  <th className="px-4 py-3 font-semibold">Fournisseur</th>
                  <th className="px-4 py-3 font-semibold">Articles</th>
                  <th className="px-4 py-3 font-semibold">Montant</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Date Commande</th>
                  <th className="px-4 py-3 font-semibold">Livraison Prévue</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-200">{c.id}</td>
                    <td className="px-4 py-3 text-slate-300">{c.fournisseurNom}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{c.articles}</td>
                    <td className="px-4 py-3 text-slate-300 font-medium whitespace-nowrap">{c.montantFcfa.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${statutColors[c.statut]}`}>{c.statut}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{c.dateCommande}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{c.dateLivraisonPrevue}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500 text-sm">Aucune commande ne correspond à votre recherche.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

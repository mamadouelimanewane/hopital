import { useState } from 'react';
import { Search, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

export default function Livraisons() {
  const { livraisons } = useDataStore();
  const [search, setSearch] = useState('');
  const [conformiteFilter, setConformiteFilter] = useState<'Toutes' | 'Conforme' | 'Non conforme'>('Toutes');

  const filtered = livraisons.filter(l => {
    const matchesSearch = l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.fournisseurNom.toLowerCase().includes(search.toLowerCase()) ||
      l.commandeId.toLowerCase().includes(search.toLowerCase());
    const matchesConformite =
      conformiteFilter === 'Toutes' ||
      (conformiteFilter === 'Conforme' && l.conforme) ||
      (conformiteFilter === 'Non conforme' && !l.conforme);
    return matchesSearch && matchesConformite;
  });

  const tauxConformite = livraisons.length > 0
    ? Math.round((livraisons.filter(l => l.conforme).length / livraisons.length) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="text-amber-400" size={24} /> Livraisons
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Suivi des livraisons fournisseurs · Taux de conformité global : <span className="text-emerald-400 font-semibold">{tauxConformite}%</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Rechercher par n° livraison, commande, fournisseur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filtrer:</span>
          {(['Toutes', 'Conforme', 'Non conforme'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setConformiteFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                conformiteFilter === f ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
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
                <th className="px-4 py-3 font-semibold">N° Livraison</th>
                <th className="px-4 py-3 font-semibold">Commande</th>
                <th className="px-4 py-3 font-semibold">Fournisseur</th>
                <th className="px-4 py-3 font-semibold">Date Reçue</th>
                <th className="px-4 py-3 font-semibold">Conformité</th>
                <th className="px-4 py-3 font-semibold">Remarque</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-200">{l.id}</td>
                  <td className="px-4 py-3 text-slate-300">{l.commandeId}</td>
                  <td className="px-4 py-3 text-slate-300">{l.fournisseurNom}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{l.dateReçue}</td>
                  <td className="px-4 py-3">
                    {l.conforme ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                        <CheckCircle2 size={11} /> Conforme
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/15 text-rose-400">
                        <XCircle size={11} /> Non conforme
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{l.remarque}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500 text-sm">Aucune livraison ne correspond à votre recherche.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { UtensilsCrossed, AlertTriangle, PackagePlus } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

export default function Restauration() {
  const { stocks } = useDataStore();
  const cuisineStocks = stocks.filter(s => s.categorie === 'Cuisine');
  const alertes = cuisineStocks.filter(s => s.quantite < s.quantiteMin);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <UtensilsCrossed className="text-amber-400" size={24} /> Restauration
        </h1>
        <p className="text-sm text-slate-400 mt-1">Approvisionnement des cuisines de l'hôpital.</p>
      </div>

      {/* Alertes de réassort */}
      {alertes.length > 0 && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-rose-400" />
            <h2 className="text-sm font-semibold text-rose-300">Alertes de réassort ({alertes.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alertes.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="text-sm text-slate-200">{s.article}</span>
                <span className="text-xs font-semibold text-rose-400">{s.quantite} / {s.quantiteMin} {s.unite}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table stock cuisine */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Stock cuisine</h2>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-semibold rounded-xl transition-all active:scale-95">
            <PackagePlus size={14} />
            Lancer un réassort
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">Article</th>
                <th className="px-4 py-3 font-semibold">Quantité</th>
                <th className="px-4 py-3 font-semibold">Seuil Min</th>
                <th className="px-4 py-3 font-semibold">Niveau</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {cuisineStocks.map((s) => {
                const critical = s.quantite < s.quantiteMin;
                const pct = Math.min(100, Math.round((s.quantite / (s.quantiteMin * 2)) * 100));
                return (
                  <tr key={s.id} className="border-b border-slate-800/50">
                    <td className="px-4 py-3 text-slate-200 font-medium">{s.article}</td>
                    <td className="px-4 py-3 text-slate-300">{s.quantite} {s.unite}</td>
                    <td className="px-4 py-3 text-slate-400">{s.quantiteMin} {s.unite}</td>
                    <td className="px-4 py-3 w-40">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${critical ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${critical ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                        {critical ? 'Rupture proche' : 'Suffisant'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {cuisineStocks.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500 text-sm">Aucun article de cuisine enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

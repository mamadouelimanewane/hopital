import { useState } from 'react';
import { Package, AlertTriangle, MapPin, Calendar, RotateCcw, Search } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { TypeDechet } from '../contexts/DataStore';

const typeStyle: Record<TypeDechet, string> = {
  'DASRI Infectieux': 'text-rose-400',
  'DASRI Piquant-Coupant': 'text-amber-400',
  'Pharmaceutique': 'text-purple-400',
  'Chimique': 'text-blue-400',
  'Assimilé Ménager': 'text-lime-400',
};

function fillColor(pct: number) {
  if (pct >= 80) return 'bg-rose-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function fillTextColor(pct: number) {
  if (pct >= 80) return 'text-rose-400';
  if (pct >= 50) return 'text-amber-400';
  return 'text-emerald-400';
}

export default function Containers() {
  const { containers, setContainers } = useDataStore();
  const [search, setSearch] = useState('');

  const filtered = containers.filter(c =>
    c.zone.toLowerCase().includes(search.toLowerCase()) ||
    c.service.toLowerCase().includes(search.toLowerCase())
  );

  const critiques = containers.filter(c => c.niveauRemplissagePct > 80).length;

  const handleVidage = (id: string) => {
    setContainers(prev => prev.map(c =>
      c.id === id
        ? { ...c, niveauRemplissagePct: 0, dernierVidage: new Date().toISOString().slice(0, 10) }
        : c
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Containers</h1>
          <p className="text-sm text-slate-400 mt-1">
            <span className="text-white font-medium">{containers.length}</span> containers actifs
            {critiques > 0 && <span className="text-rose-400 font-medium"> · {critiques} en alerte (&gt;80%)</span>}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Rechercher par zone ou service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const alert = c.niveauRemplissagePct > 80;
          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl glass border transition-all duration-300 hover:-translate-y-0.5 ${
                alert ? 'border-rose-500/40 pulse-critical' : 'border-slate-700/40 hover:border-slate-600/60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${alert ? 'bg-rose-500/15' : 'bg-slate-800'}`}>
                    <Package size={18} className={alert ? 'text-rose-400' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{c.zone}</p>
                    <p className="text-xs text-slate-500">{c.service}</p>
                  </div>
                </div>
                {alert && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-[10px] font-bold">
                    <AlertTriangle size={11} />
                    Alerte
                  </span>
                )}
              </div>

              <p className={`text-xs font-medium mb-2 ${typeStyle[c.typeDechet]}`}>{c.typeDechet}</p>

              {/* Fill level */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Remplissage</span>
                  <span className={`font-bold ${fillTextColor(c.niveauRemplissagePct)}`}>{c.niveauRemplissagePct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${fillColor(c.niveauRemplissagePct)}`}
                    style={{ width: `${c.niveauRemplissagePct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Capacité : {c.capaciteKg} kg</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  Vidé le {c.dernierVidage}
                </div>
                <button
                  onClick={() => handleVidage(c.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-lime-500/15 text-slate-300 hover:text-lime-400 text-[11px] font-medium transition-all"
                >
                  <RotateCcw size={12} />
                  Vider
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Package size={40} className="mx-auto mb-3 text-slate-700" />
          <p className="font-medium text-slate-400">Aucun container trouvé</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <MapPin size={12} />
        Tous les containers sont géolocalisés par zone/service de l'Hôpital Ndamatou
      </div>
    </div>
  );
}

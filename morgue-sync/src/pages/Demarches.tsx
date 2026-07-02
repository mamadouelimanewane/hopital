import { useState } from 'react';
import { Search, FileText, Calendar, User } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

const typeFilters = ['Tous', 'Certificat de décès', 'Autorisation de transfert', "Autorisation d'inhumation"];
const statutFilters = ['Tous', 'En attente', 'En cours', 'Émise'];

const statutStyle: Record<string, string> = {
  'En attente': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'En cours':   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Émise':      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

export default function Demarches() {
  const { demarches, setDemarches } = useDataStore();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('Tous');
  const [activeStatut, setActiveStatut] = useState('Tous');

  const filtered = demarches.filter(d => {
    const matchType = activeType === 'Tous' || d.type === activeType;
    const matchStatut = activeStatut === 'Tous' || d.statut === activeStatut;
    const matchSearch =
      d.defuntNom.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.responsable.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatut && matchSearch;
  });

  const advanceStatut = (id: string) => {
    setDemarches(prev => prev.map(d => {
      if (d.id !== id) return d;
      if (d.statut === 'En attente') return { ...d, statut: 'En cours' };
      if (d.statut === 'En cours') return { ...d, statut: 'Émise', dateEmission: new Date().toISOString().slice(0, 10) };
      return d;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Démarches administratives</h1>
          <p className="text-sm text-slate-400 mt-1">
            <span className="text-white font-medium">{filtered.length}</span> démarches · Certificats et autorisations
          </p>
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {typeFilters.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeType === t
                ? 'bg-slate-500/15 text-slate-200 border border-slate-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Rechercher par défunt, ID, responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Statut:</span>
          {statutFilters.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatut(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeStatut === st
                  ? 'bg-slate-700 text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass border border-slate-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-700/50 bg-slate-900/30">
              <tr>
                <th className="px-6 py-3 font-semibold">Démarche</th>
                <th className="px-6 py-3 font-semibold">Défunt</th>
                <th className="px-6 py-3 font-semibold">Responsable</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
                <th className="px-6 py-3 font-semibold">Date d'émission</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors flex-shrink-0">
                        <FileText size={15} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{d.type}</p>
                        <p className="text-xs text-slate-500 font-mono">{d.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-xs">{d.defuntNom}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <User size={12} />
                      {d.responsable}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statutStyle[d.statut]}`}>
                      {d.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={12} />
                      {d.dateEmission || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {d.statut !== 'Émise' ? (
                      <button
                        onClick={() => advanceStatut(d.id)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                      >
                        {d.statut === 'En attente' ? 'Démarrer' : 'Marquer émise'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600">Terminée</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <FileText size={40} className="mx-auto mb-3 text-slate-700" />
            <p className="font-medium text-slate-400">Aucune démarche trouvée</p>
            <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </div>
  );
}

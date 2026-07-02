import { useState } from 'react';
import { Search, FileText, CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { DossierPatient } from '../contexts/DataStore';

const statutConfig: Record<DossierPatient['statutSynchro'], { color: string; bg: string; icon: React.ElementType }> = {
  'Synchronisé': { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  'En attente':  { color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',   icon: Clock },
  'Erreur':      { color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',     icon: XCircle },
};

export default function DossiersPartages() {
  const { dossiers } = useDataStore();
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState<'Tous' | DossierPatient['statutSynchro']>('Tous');

  const filtered = dossiers.filter(d => {
    const matchSearch = d.nomPatient.toLowerCase().includes(search.toLowerCase()) ||
      d.hopitalOrigine.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === 'Tous' || d.statutSynchro === statutFilter;
    return matchSearch && matchStatut;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dossiers Partagés</h1>
        <p className="text-sm text-slate-400 mt-1">
          Dossiers médicaux partagés à travers le réseau national de santé sénégalais
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Rechercher un patient, hôpital, ID de dossier…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter size={14} className="text-slate-500 shrink-0" />
          {(['Tous', 'Synchronisé', 'En attente', 'Erreur'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatutFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statutFilter === s ? 'bg-emerald-500 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass border border-slate-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">ID Dossier</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Hôpital d'origine</th>
                <th className="px-5 py-3 font-medium">Dernière synchro</th>
                <th className="px-5 py-3 font-medium">Documents</th>
                <th className="px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(d => {
                const cfg = statutConfig[d.statutSynchro];
                return (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{d.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">{d.nomPatient}</td>
                    <td className="px-5 py-3.5 text-slate-400">{d.hopitalOrigine}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{d.derniereSynchro}</td>
                    <td className="px-5 py-3.5 text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <FileText size={13} className="text-slate-500" />
                        {d.nombreDocuments}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                        <cfg.icon size={12} />
                        {d.statutSynchro}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500 text-sm">Aucun dossier ne correspond à votre recherche.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500">{filtered.length} dossier{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''} sur {dossiers.length}</p>
    </div>
  );
}

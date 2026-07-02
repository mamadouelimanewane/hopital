import { useState } from 'react';
import { RefreshCcw, AlertTriangle, Wifi, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { LogSynchro } from '../contexts/DataStore';

const typeIcon: Record<LogSynchro['typeEvenement'], React.ElementType> = {
  'Synchronisation': RefreshCcw,
  'Erreur': AlertTriangle,
  'Reconnexion': Wifi,
};

const typeColor: Record<LogSynchro['typeEvenement'], string> = {
  'Synchronisation': 'text-blue-400 bg-blue-500/10',
  'Erreur': 'text-rose-400 bg-rose-500/10',
  'Reconnexion': 'text-amber-400 bg-amber-500/10',
};

export default function JournalSynchro() {
  const { logs } = useDataStore();
  const [statutFilter, setStatutFilter] = useState<'Tous' | LogSynchro['statut']>('Tous');
  const [typeFilter, setTypeFilter] = useState<'Tous' | LogSynchro['typeEvenement']>('Tous');

  const filtered = [...logs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter(l => (statutFilter === 'Tous' || l.statut === statutFilter) && (typeFilter === 'Tous' || l.typeEvenement === typeFilter));

  const succes = logs.filter(l => l.statut === 'Succès').length;
  const echecs = logs.filter(l => l.statut === 'Échec').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Journal de Synchronisation</h1>
        <p className="text-sm text-slate-400 mt-1">
          Historique chronologique des événements de synchronisation inter-hospitalière
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass border border-slate-700/40">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total événements</p>
          <p className="text-2xl font-bold text-white mt-1">{logs.length}</p>
        </div>
        <div className="p-4 rounded-2xl glass border border-emerald-500/20">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Succès</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{succes}</p>
        </div>
        <div className="p-4 rounded-2xl glass border border-rose-500/20">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Échecs</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{echecs}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-slate-500" />
        {(['Tous', 'Succès', 'Échec'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatutFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statutFilter === s ? 'bg-emerald-500 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="w-px h-4 bg-slate-700 mx-1" />
        {(['Tous', 'Synchronisation', 'Erreur', 'Reconnexion'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === t ? 'bg-blue-500 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Timeline table */}
      <div className="rounded-2xl glass border border-slate-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Connecteur</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Message</th>
                <th className="px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(log => {
                const TIcon = typeIcon[log.typeEvenement];
                return (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{log.date}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">{log.connecteurNom}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${typeColor[log.typeEvenement]}`}>
                        <TIcon size={11} />
                        {log.typeEvenement}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs max-w-md">{log.message}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                        log.statut === 'Succès' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {log.statut === 'Succès' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {log.statut}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500 text-sm">Aucun événement ne correspond à ces filtres.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

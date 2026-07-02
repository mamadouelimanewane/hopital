import { useState } from 'react';
import { Search, Filter, X, User, Droplet, Scale, Calendar, Activity } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Patient } from '../contexts/DataStore';

const statutStyles: Record<Patient['statut'], string> = {
  'Actif': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Suspendu': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Transféré': 'bg-slate-700/50 text-slate-400 border border-slate-700/30',
};

export default function Patients() {
  const { patients, seances } = useDataStore();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<'Tous' | Patient['statut']>('Tous');
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = patients.filter(p => {
    const matchesSearch =
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.pathologie.toLowerCase().includes(search.toLowerCase());
    const matchesStatut = filterStatut === 'Tous' || p.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  const patientSeances = selected
    ? seances.filter(s => s.patientId === selected.id).sort((a, b) => (b.date + b.heure).localeCompare(a.date + a.heure))
    : [];

  const ecartPoids = (p: Patient) => (p.poidsEntreeHopital - p.poidsSec).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Patients</h1>
          <p className="text-sm text-slate-400 mt-1">
            Suivi des patients du centre d'hémodialyse · {patients.length} patients enregistrés
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Rechercher par nom, ID, pathologie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <span className="text-xs text-slate-500">Statut:</span>
          {(['Tous', 'Actif', 'Suspendu', 'Transféré'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatut(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatut === s
                  ? 'bg-slate-700 text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
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
              <tr className="border-b border-slate-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Âge</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Groupe</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Poids Sec</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Écart</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pathologie</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-[11px] font-bold text-sky-400 flex-shrink-0">
                        {p.nom.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{p.nom}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{p.age} ans</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">{p.groupeSanguin}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{p.poidsSec} kg</td>
                  <td className="px-4 py-3 text-slate-400">+{ecartPoids(p)} kg</td>
                  <td className="px-4 py-3 text-slate-400">{p.pathologie}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${statutStyles[p.statut]}`}>
                      {p.statut}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-600 text-sm">Aucun patient trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-lg glass-strong rounded-2xl p-6 shadow-2xl border border-slate-700/50 animate-fade-in-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-sky-500/10 flex items-center justify-center text-sm font-bold text-sky-400">
                  {selected.nom.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selected.nom}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selected.id}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><User size={11} /> Âge</div>
                <p className="text-sm font-semibold text-slate-200">{selected.age} ans</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Droplet size={11} /> Groupe</div>
                <p className="text-sm font-semibold text-slate-200">{selected.groupeSanguin}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Scale size={11} /> Poids Sec</div>
                <p className="text-sm font-semibold text-slate-200">{selected.poidsSec} kg</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Scale size={11} /> Poids Entrée</div>
                <p className="text-sm font-semibold text-slate-200">{selected.poidsEntreeHopital} kg</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Calendar size={11} /> Début dialyse</div>
                <p className="text-sm font-semibold text-slate-200">{selected.dateDebutDialyse}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Activity size={11} /> Statut</div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${statutStyles[selected.statut]}`}>{selected.statut}</span>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pathologie</p>
              <p className="text-sm text-slate-300">{selected.pathologie}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Historique des séances ({patientSeances.length})</p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {patientSeances.length === 0 && <p className="text-xs text-slate-600">Aucune séance enregistrée</p>}
                {patientSeances.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/50 text-xs">
                    <span className="text-slate-400">{s.date} · {s.heure}</span>
                    <span className="text-slate-500">{s.generateurId}</span>
                    <span className="text-slate-300 font-medium">{s.poidsAvant || '—'} → {s.poidsApres || '—'} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

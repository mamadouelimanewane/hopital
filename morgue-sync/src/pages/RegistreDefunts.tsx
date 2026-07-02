import { useState } from 'react';
import { Search, X, BookOpen, Calendar, MapPin, Snowflake, FileText } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Defunt } from '../contexts/DataStore';

const statutFilters = ['Tous', 'En attente', 'En cours', 'Finalisées'];

const statutStyle: Record<string, string> = {
  'En attente':  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'En cours':    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Finalisées':  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

const demStatutStyle: Record<string, string> = {
  'En attente': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'En cours':   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Émise':      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

function DefuntDrawer({ defunt, onClose }: { defunt: Defunt; onClose: () => void }) {
  const { demarches, casiers } = useDataStore();
  const linked = demarches.filter(d => d.defuntId === defunt.id);
  const casier = casiers.find(c => c.id === defunt.casierId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] h-full bg-slate-900 border-l border-slate-700/50 shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <BookOpen size={18} className="text-slate-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{defunt.nom}</h2>
              <p className="text-xs text-slate-500 font-mono">{defunt.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${statutStyle[defunt.statutDemarches]}`}>
            {defunt.statutDemarches}
          </span>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date de décès', value: defunt.dateDeces },
              { label: 'Service', value: defunt.service },
              { label: 'Admission morgue', value: defunt.dateAdmissionMorgue },
              { label: 'Casier', value: casier ? casier.numero : 'Non assigné' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          {casier && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Snowflake size={14} className="text-slate-300" />
              Casier {casier.numero} · {casier.temperature}°C · {casier.statut}
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-2">Démarches liées ({linked.length})</h3>
            {linked.length === 0 ? (
              <p className="text-xs text-slate-500">Aucune démarche enregistrée pour ce dossier.</p>
            ) : (
              <div className="space-y-2">
                {linked.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-300 truncate max-w-[260px]">{d.type}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{d.responsable}{d.dateEmission ? ` · ${d.dateEmission}` : ''}</p>
                    </div>
                    <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border ${demStatutStyle[d.statut]}`}>
                      {d.statut}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistreDefunts() {
  const { defunts } = useDataStore();
  const [search, setSearch] = useState('');
  const [activeStatut, setActiveStatut] = useState('Tous');
  const [selected, setSelected] = useState<Defunt | null>(null);

  const filtered = defunts.filter(d => {
    const matchStatut = activeStatut === 'Tous' || d.statutDemarches === activeStatut;
    const matchSearch =
      d.nom.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.service.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  return (
    <>
      {selected && <DefuntDrawer defunt={selected} onClose={() => setSelected(null)} />}

      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Registre des défunts</h1>
            <p className="text-sm text-slate-400 mt-1">
              <span className="text-white font-medium">{filtered.length}</span> dossiers enregistrés
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Rechercher par nom, ID, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Démarches:</span>
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
                  <th className="px-6 py-3 font-semibold">Défunt</th>
                  <th className="px-6 py-3 font-semibold">Date de décès</th>
                  <th className="px-6 py-3 font-semibold">Service</th>
                  <th className="px-6 py-3 font-semibold">Casier</th>
                  <th className="px-6 py-3 font-semibold">Démarches</th>
                  <th className="px-6 py-3 font-semibold">Admission morgue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors flex-shrink-0">
                          <FileText size={15} className="text-slate-300" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{d.nom}</p>
                          <p className="text-xs text-slate-500 font-mono">{d.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar size={12} />
                        {d.dateDeces}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {d.service}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {d.casierId ? d.casierId.replace('CAS-', 'C-') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statutStyle[d.statutDemarches]}`}>
                        {d.statutDemarches}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{d.dateAdmissionMorgue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <BookOpen size={40} className="mx-auto mb-3 text-slate-700" />
              <p className="font-medium text-slate-400">Aucun dossier trouvé</p>
              <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

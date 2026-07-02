import { useState } from 'react';
import {
  Search, Filter, Plus, Baby, Eye, Trash2, X, Calendar, Droplet, AlertTriangle,
} from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Grossesse } from '../contexts/DataStore';

const suiviFilters = ['Tous', 'Normal', 'Surveillance', 'Risque Élevé'];

const suiviStyle: Record<string, string> = {
  'Normal': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Surveillance': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Risque Élevé': 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

// ── Add Grossesse Modal ──────────────────────────────────────────────────────

function AddGrossesseModal({ onClose, onAdd }: { onClose: () => void; onAdd: (g: Grossesse) => void }) {
  const [patienteNom, setPatienteNom] = useState('');
  const [age, setAge] = useState('');
  const [terme, setTerme] = useState('');
  const [datePrevueAccouchement, setDatePrevueAccouchement] = useState('');
  const [groupeSanguin, setGroupeSanguin] = useState('O+');
  const [suivi, setSuivi] = useState<Grossesse['suivi']>('Normal');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!patienteNom.trim()) e.patienteNom = 'Le nom est requis';
    if (!age.trim()) e.age = "L'âge est requis";
    if (!terme.trim()) e.terme = 'Le terme est requis';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const newG: Grossesse = {
      id: `GR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      patienteNom,
      age: Number(age),
      terme: Number(terme),
      datePrevueAccouchement: datePrevueAccouchement || 'À définir',
      groupeSanguin,
      grossesseRisque: suivi !== 'Normal',
      suivi,
      dernierRdv: 'Aujourd\'hui',
    };
    onAdd(newG);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg glass-strong rounded-2xl p-6 shadow-2xl border border-slate-700/50 z-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Nouvelle Grossesse</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nom de la patiente *</label>
            <input
              type="text"
              value={patienteNom}
              onChange={e => { setPatienteNom(e.target.value); setErrors(p => ({ ...p, patienteNom: '' })); }}
              placeholder="ex: Fatou Diallo"
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.patienteNom ? 'border-rose-500' : 'border-slate-700 focus:border-pink-500'}`}
            />
            {errors.patienteNom && <p className="text-xs text-rose-400 mt-1">{errors.patienteNom}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Âge *</label>
              <input
                type="number"
                value={age}
                onChange={e => { setAge(e.target.value); setErrors(p => ({ ...p, age: '' })); }}
                placeholder="ex: 28"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.age ? 'border-rose-500' : 'border-slate-700 focus:border-pink-500'}`}
              />
              {errors.age && <p className="text-xs text-rose-400 mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Terme (SA) *</label>
              <input
                type="number"
                value={terme}
                onChange={e => { setTerme(e.target.value); setErrors(p => ({ ...p, terme: '' })); }}
                placeholder="ex: 32"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.terme ? 'border-rose-500' : 'border-slate-700 focus:border-pink-500'}`}
              />
              {errors.terme && <p className="text-xs text-rose-400 mt-1">{errors.terme}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Groupe sanguin</label>
              <select value={groupeSanguin} onChange={e => setGroupeSanguin(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors">
                {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Niveau de suivi</label>
              <select value={suivi} onChange={e => setSuivi(e.target.value as Grossesse['suivi'])} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors">
                <option>Normal</option>
                <option>Surveillance</option>
                <option>Risque Élevé</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Date prévue d'accouchement</label>
            <input type="text" value={datePrevueAccouchement} onChange={e => setDatePrevueAccouchement(e.target.value)} placeholder="ex: 15 Aoû. 2026" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">Annuler</button>
          <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-xl transition-all shadow-lg shadow-pink-900/30 active:scale-95">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────

function GrossesseDrawer({ grossesse, onClose }: { grossesse: Grossesse; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] h-full bg-slate-900 border-l border-slate-700/50 shadow-2xl flex flex-col animate-fade-in-up overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <Baby size={18} className="text-pink-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{grossesse.patienteNom}</h2>
              <p className="text-xs text-slate-500 font-mono">{grossesse.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${suiviStyle[grossesse.suivi]}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${grossesse.suivi === 'Normal' ? 'bg-emerald-400' : grossesse.suivi === 'Surveillance' ? 'bg-amber-400' : 'bg-rose-400'}`} />
            {grossesse.suivi}
          </span>

          {grossesse.grossesseRisque && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300">Grossesse à risque — surveillance médicale rapprochée recommandée.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Âge', value: `${grossesse.age} ans` },
              { label: 'Terme', value: `${grossesse.terme} SA` },
              { label: 'Groupe sanguin', value: grossesse.groupeSanguin },
              { label: 'Dernier RDV', value: grossesse.dernierRdv },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar size={14} className="text-pink-400" />
            Date prévue d'accouchement : <span className="text-slate-200 font-medium">{grossesse.datePrevueAccouchement}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Droplet size={14} className="text-pink-400" />
            Groupe sanguin : <span className="text-slate-200 font-medium">{grossesse.groupeSanguin}</span>
          </div>

          {/* Progress bar terme */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Progression grossesse</span>
              <span className="font-bold text-pink-400">{grossesse.terme}/41 SA</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-pink-500 transition-all" style={{ width: `${Math.min(100, (grossesse.terme / 41) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Grossesses() {
  const { grossesses, setGrossesses } = useDataStore();
  const [activeSuivi, setActiveSuivi] = useState('Tous');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Grossesse | null>(null);

  const filtered = grossesses.filter(g => {
    const matchSuivi = activeSuivi === 'Tous' || g.suivi === activeSuivi;
    const matchSearch =
      g.patienteNom.toLowerCase().includes(search.toLowerCase()) ||
      g.id.toLowerCase().includes(search.toLowerCase());
    return matchSuivi && matchSearch;
  });

  return (
    <>
      {showModal && (
        <AddGrossesseModal
          onClose={() => setShowModal(false)}
          onAdd={g => setGrossesses(prev => [...prev, g])}
        />
      )}
      {selected && (
        <GrossesseDrawer grossesse={selected} onClose={() => setSelected(null)} />
      )}

      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Grossesses</h1>
            <p className="text-sm text-slate-400 mt-1">
              <span className="text-white font-medium">{filtered.length}</span> dossiers de suivi de grossesse
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-pink-900/30 active:scale-95"
          >
            <Plus size={16} />
            Nouvelle Grossesse
          </button>
        </div>

        {/* Filters row */}
        <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Rechercher par nom, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">Suivi:</span>
            {suiviFilters.map((st) => (
              <button
                key={st}
                onClick={() => setActiveSuivi(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeSuivi === st
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
                  <th className="px-6 py-3 font-semibold">Patiente</th>
                  <th className="px-6 py-3 font-semibold">Âge</th>
                  <th className="px-6 py-3 font-semibold">Terme (SA)</th>
                  <th className="px-6 py-3 font-semibold">Groupe</th>
                  <th className="px-6 py-3 font-semibold">Date prévue</th>
                  <th className="px-6 py-3 font-semibold">Suivi</th>
                  <th className="px-6 py-3 font-semibold">Dernier RDV</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => setSelected(g)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors flex-shrink-0">
                          <Baby size={15} className="text-pink-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{g.patienteNom}</p>
                          <p className="text-xs text-slate-500 font-mono">{g.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{g.age} ans</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{g.terme} SA</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{g.groupeSanguin}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{g.datePrevueAccouchement}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${suiviStyle[g.suivi]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${g.suivi === 'Normal' ? 'bg-emerald-400' : g.suivi === 'Surveillance' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        {g.suivi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{g.dernierRdv}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(g); }}
                          className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all"
                          title="Voir détails"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setGrossesses(prev => prev.filter(x => x.id !== g.id)); }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Baby size={40} className="mx-auto mb-3 text-slate-700" />
              <p className="font-medium text-slate-400">Aucune grossesse trouvée</p>
              <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { Search, Filter, Plus, HeartPulse, Eye, Trash2, X, Baby, Scale, Activity } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Accouchement } from '../contexts/DataStore';

const typeFilters = ['Tous', 'Voie basse', 'Césarienne'];

const typeStyle: Record<string, string> = {
  'Voie basse': 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
  'Césarienne': 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
};

// ── Add Accouchement Modal ──────────────────────────────────────────────────

function AddAccouchementModal({ onClose, onAdd }: { onClose: () => void; onAdd: (a: Accouchement) => void }) {
  const [patienteNom, setPatienteNom] = useState('');
  const [type, setType] = useState<Accouchement['type']>('Voie basse');
  const [complications, setComplications] = useState('');
  const [sageFemme, setSageFemme] = useState('');
  const [poidsBebe, setPoidsBebe] = useState('');
  const [apgar, setApgar] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!patienteNom.trim()) e.patienteNom = 'Le nom est requis';
    if (!poidsBebe.trim()) e.poidsBebe = 'Le poids est requis';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const now = new Date();
    const newA: Accouchement = {
      id: `ACC-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      patienteNom,
      date: now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type,
      complications: complications.trim() || 'Aucune',
      sageFemme: sageFemme.trim() || 'Non renseigné',
      poidsBebe: Number(poidsBebe),
      apgar: Number(apgar) || 9,
    };
    onAdd(newA);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg glass-strong rounded-2xl p-6 shadow-2xl border border-slate-700/50 z-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Nouvel Accouchement</h3>
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
              placeholder="ex: Aïda Wade"
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.patienteNom ? 'border-rose-500' : 'border-slate-700 focus:border-pink-500'}`}
            />
            {errors.patienteNom && <p className="text-xs text-rose-400 mt-1">{errors.patienteNom}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Type d'accouchement *</label>
              <select value={type} onChange={e => setType(e.target.value as Accouchement['type'])} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors">
                <option>Voie basse</option>
                <option>Césarienne</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Sage-femme / Médecin</label>
              <input type="text" value={sageFemme} onChange={e => setSageFemme(e.target.value)} placeholder="ex: Aïssatou Ndoye" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Poids bébé (g) *</label>
              <input
                type="number"
                value={poidsBebe}
                onChange={e => { setPoidsBebe(e.target.value); setErrors(p => ({ ...p, poidsBebe: '' })); }}
                placeholder="ex: 3200"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.poidsBebe ? 'border-rose-500' : 'border-slate-700 focus:border-pink-500'}`}
              />
              {errors.poidsBebe && <p className="text-xs text-rose-400 mt-1">{errors.poidsBebe}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Score Apgar</label>
              <input type="number" min={0} max={10} value={apgar} onChange={e => setApgar(e.target.value)} placeholder="ex: 9" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Complications</label>
            <input type="text" value={complications} onChange={e => setComplications(e.target.value)} placeholder="Aucune" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors" />
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

// ── Main Component ───────────────────────────────────────────────────────────

export default function Accouchements() {
  const { accouchements, setAccouchements } = useDataStore();
  const [activeType, setActiveType] = useState('Tous');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = accouchements.filter(a => {
    const matchType = activeType === 'Tous' || a.type === activeType;
    const matchSearch =
      a.patienteNom.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.sageFemme.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const voieBasseCount = accouchements.filter(a => a.type === 'Voie basse').length;
  const cesarienneCount = accouchements.filter(a => a.type === 'Césarienne').length;
  const poidsMoyen = accouchements.length ? Math.round(accouchements.reduce((s, a) => s + a.poidsBebe, 0) / accouchements.length) : 0;

  return (
    <>
      {showModal && (
        <AddAccouchementModal
          onClose={() => setShowModal(false)}
          onAdd={a => setAccouchements(prev => [a, ...prev])}
        />
      )}

      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Accouchements</h1>
            <p className="text-sm text-slate-400 mt-1">
              <span className="text-white font-medium">{filtered.length}</span> naissances enregistrées
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-pink-900/30 active:scale-95"
          >
            <Plus size={16} />
            Nouvel Accouchement
          </button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl glass border border-slate-700/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10"><Baby size={18} className="text-pink-400" /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Voie basse</p>
              <p className="text-lg font-bold text-white">{voieBasseCount}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl glass border border-slate-700/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10"><Activity size={18} className="text-violet-400" /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Césariennes</p>
              <p className="text-lg font-bold text-white">{cesarienneCount}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl glass border border-slate-700/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10"><Scale size={18} className="text-blue-400" /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Poids moyen</p>
              <p className="text-lg font-bold text-white">{poidsMoyen} g</p>
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Rechercher par nom, ID, sage-femme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">Type:</span>
            {typeFilters.map((st) => (
              <button
                key={st}
                onClick={() => setActiveType(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeType === st
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
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Complications</th>
                  <th className="px-6 py-3 font-semibold">Sage-femme</th>
                  <th className="px-6 py-3 font-semibold">Poids bébé</th>
                  <th className="px-6 py-3 font-semibold">Apgar</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors flex-shrink-0">
                          <HeartPulse size={15} className="text-pink-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{a.patienteNom}</p>
                          <p className="text-xs text-slate-500 font-mono">{a.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{a.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${typeStyle[a.type]}`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs max-w-[180px] truncate">{a.complications}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{a.sageFemme}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{a.poidsBebe} g</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${a.apgar >= 8 ? 'text-emerald-400' : a.apgar >= 5 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {a.apgar}/10
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all" title="Voir détails">
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setAccouchements(prev => prev.filter(x => x.id !== a.id))}
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
              <HeartPulse size={40} className="mx-auto mb-3 text-slate-700" />
              <p className="font-medium text-slate-400">Aucun accouchement trouvé</p>
              <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

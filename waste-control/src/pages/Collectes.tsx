import { useState } from 'react';
import {
  Search, Filter, Plus, Trash2, Eye, X, Barcode, MapPin, Calendar,
  User as UserIcon, Scale, CheckCircle2,
} from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Collecte, TypeDechet, StatutCollecte } from '../contexts/DataStore';

const typeOptions: TypeDechet[] = ['DASRI Infectieux', 'DASRI Piquant-Coupant', 'Pharmaceutique', 'Chimique', 'Assimilé Ménager'];
const statutOptions: StatutCollecte[] = ['En attente', 'Collecté', 'Stocké', 'Détruit'];

const typeStyle: Record<TypeDechet, string> = {
  'DASRI Infectieux': 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  'DASRI Piquant-Coupant': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Pharmaceutique': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Chimique': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Assimilé Ménager': 'bg-lime-500/10 text-lime-400 border border-lime-500/20',
};

const statutStyle: Record<StatutCollecte, string> = {
  'En attente': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Collecté':   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Stocké':     'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Détruit':    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

function AddCollecteModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Collecte) => void }) {
  const [zone, setZone] = useState('');
  const [typeDechet, setTypeDechet] = useState<TypeDechet>('DASRI Infectieux');
  const [poidsKg, setPoidsKg] = useState('');
  const [collecteur, setCollecteur] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!zone.trim()) e.zone = 'La zone est requise';
    if (!poidsKg || Number(poidsKg) <= 0) e.poidsKg = 'Poids invalide';
    if (!collecteur.trim()) e.collecteur = 'Le collecteur est requis';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const now = new Date();
    const newC: Collecte = {
      id: `COL-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      codeBarre: `WC-${Math.floor(1000000 + Math.random() * 8999999)}`,
      zone,
      typeDechet,
      poidsKg: Number(poidsKg),
      dateCollecte: now.toISOString().slice(0, 16).replace('T', ' '),
      collecteur,
      statut: 'En attente',
    };
    onAdd(newC);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg glass-strong rounded-2xl p-6 shadow-2xl border border-slate-700/50 z-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Nouvelle Collecte</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Zone / Service *</label>
            <input
              type="text"
              value={zone}
              onChange={e => { setZone(e.target.value); setErrors(p => ({ ...p, zone: '' })); }}
              placeholder="ex: Bloc Opératoire 1"
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.zone ? 'border-rose-500' : 'border-slate-700 focus:border-lime-500'}`}
            />
            {errors.zone && <p className="text-xs text-rose-400 mt-1">{errors.zone}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Type de déchet *</label>
              <select value={typeDechet} onChange={e => setTypeDechet(e.target.value as TypeDechet)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition-colors">
                {typeOptions.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Poids (kg) *</label>
              <input
                type="number" step="0.1" min="0"
                value={poidsKg}
                onChange={e => { setPoidsKg(e.target.value); setErrors(p => ({ ...p, poidsKg: '' })); }}
                placeholder="0.0"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.poidsKg ? 'border-rose-500' : 'border-slate-700 focus:border-lime-500'}`}
              />
              {errors.poidsKg && <p className="text-xs text-rose-400 mt-1">{errors.poidsKg}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Agent collecteur *</label>
            <input
              type="text"
              value={collecteur}
              onChange={e => { setCollecteur(e.target.value); setErrors(p => ({ ...p, collecteur: '' })); }}
              placeholder="ex: Moussa Ndao"
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.collecteur ? 'border-rose-500' : 'border-slate-700 focus:border-lime-500'}`}
            />
            {errors.collecteur && <p className="text-xs text-rose-400 mt-1">{errors.collecteur}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">Annuler</button>
          <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-lime-500 hover:bg-lime-600 rounded-xl transition-all shadow-lg shadow-lime-900/30 active:scale-95">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

function CollecteDrawer({ collecte, onClose, onAdvance }: { collecte: Collecte; onClose: () => void; onAdvance: () => void }) {
  const nextStatut: Record<StatutCollecte, StatutCollecte | null> = {
    'En attente': 'Collecté',
    'Collecté': 'Stocké',
    'Stocké': 'Détruit',
    'Détruit': null,
  };
  const next = nextStatut[collecte.statut];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] h-full bg-slate-900 border-l border-slate-700/50 shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <Barcode size={18} className="text-lime-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{collecte.codeBarre}</h2>
              <p className="text-xs text-slate-500 font-mono">{collecte.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${statutStyle[collecte.statut]}`}>
            {collecte.statut}
          </span>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Type de déchet', value: collecte.typeDechet },
              { label: 'Poids', value: `${collecte.poidsKg} kg` },
              { label: 'Zone', value: collecte.zone },
              { label: 'Collecteur', value: collecte.collecteur },
              { label: 'Date de collecte', value: collecte.dateCollecte },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          {/* Traceability timeline */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-3">Traçabilité</h3>
            <div className="space-y-3">
              {(['En attente', 'Collecté', 'Stocké', 'Détruit'] as StatutCollecte[]).map((s, i) => {
                const idx = statutOptions.indexOf(collecte.statut);
                const done = i <= idx;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-lime-500/20 text-lime-400' : 'bg-slate-800 text-slate-600'}`}>
                      <CheckCircle2 size={14} />
                    </div>
                    <span className={`text-xs ${done ? 'text-slate-200 font-medium' : 'text-slate-600'}`}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          {next ? (
            <button
              onClick={() => { onAdvance(); onClose(); }}
              className="w-full py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={15} />
              Faire avancer vers « {next} »
            </button>
          ) : (
            <p className="text-center text-xs text-slate-500">Cycle de vie terminé — déchet détruit.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Collectes() {
  const { collectes, setCollectes } = useDataStore();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('Tous');
  const [activeStatut, setActiveStatut] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Collecte | null>(null);

  const filtered = collectes.filter(c => {
    const matchType = activeType === 'Tous' || c.typeDechet === activeType;
    const matchStatut = activeStatut === 'Tous' || c.statut === activeStatut;
    const matchSearch =
      c.codeBarre.toLowerCase().includes(search.toLowerCase()) ||
      c.zone.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatut && matchSearch;
  });

  const advance = (c: Collecte) => {
    const order: StatutCollecte[] = ['En attente', 'Collecté', 'Stocké', 'Détruit'];
    const idx = order.indexOf(c.statut);
    if (idx < order.length - 1) {
      setCollectes(prev => prev.map(x => x.id === c.id ? { ...x, statut: order[idx + 1] } : x));
    }
  };

  return (
    <>
      {showModal && (
        <AddCollecteModal onClose={() => setShowModal(false)} onAdd={c => setCollectes(prev => [c, ...prev])} />
      )}
      {selected && (
        <CollecteDrawer collecte={selected} onClose={() => setSelected(null)} onAdvance={() => advance(selected)} />
      )}

      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Collectes</h1>
            <p className="text-sm text-slate-400 mt-1">
              <span className="text-white font-medium">{filtered.length}</span> collectes · Traçabilité complète
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-lime-900/30 active:scale-95"
          >
            <Plus size={16} />
            Nouvelle Collecte
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Tous', ...typeOptions].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeType === t
                  ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Rechercher par code-barres, zone, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">Statut:</span>
            {['Tous', ...statutOptions].map((st) => (
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
                  <th className="px-6 py-3 font-semibold">Code-barres</th>
                  <th className="px-6 py-3 font-semibold">Zone / Service</th>
                  <th className="px-6 py-3 font-semibold">Type de déchet</th>
                  <th className="px-6 py-3 font-semibold">Poids</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Collecteur</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Barcode size={14} className="text-slate-500" />
                        <span className="font-mono text-xs text-slate-300">{c.codeBarre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                        <MapPin size={12} className="text-slate-500" />
                        {c.zone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${typeStyle[c.typeDechet]}`}>
                        {c.typeDechet}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                        <Scale size={12} className="text-slate-500" />
                        {c.poidsKg} kg
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar size={12} />
                        {c.dateCollecte}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <UserIcon size={12} />
                        {c.collecteur}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statutStyle[c.statut]}`}>
                        {c.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelected(c)}
                          className="p-1.5 text-slate-400 hover:text-lime-400 hover:bg-lime-500/10 rounded-lg transition-all"
                          title="Voir traçabilité"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setCollectes(prev => prev.filter(x => x.id !== c.id))}
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
              <Trash2 size={40} className="mx-auto mb-3 text-slate-700" />
              <p className="font-medium text-slate-400">Aucune collecte trouvée</p>
              <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

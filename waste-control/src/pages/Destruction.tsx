import { useState } from 'react';
import { Flame, FileText, Search, Calendar, Scale, User as UserIcon, Plus, X, Download } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Destruction as DestructionType } from '../contexts/DataStore';

function AddDestructionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (d: DestructionType) => void }) {
  const [poidsTotalKg, setPoidsTotalKg] = useState('');
  const [operateur, setOperateur] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!poidsTotalKg || Number(poidsTotalKg) <= 0) e.poidsTotalKg = 'Poids invalide';
    if (!operateur.trim()) e.operateur = "L'opérateur est requis";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const now = new Date();
    const lotNum = Math.floor(100 + Math.random() * 900);
    const newD: DestructionType = {
      id: `DST-${Math.floor(100 + Math.random() * 900)}`,
      numeroLot: `INC-${now.getFullYear()}-0${lotNum}`,
      collectesIds: [],
      dateIncineration: now.toISOString().slice(0, 10),
      poidsTotalKg: Number(poidsTotalKg),
      numeroCertificat: `CERT-NDT-${now.getFullYear()}-0${lotNum}`,
      operateur,
    };
    onAdd(newD);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg glass-strong rounded-2xl p-6 shadow-2xl border border-slate-700/50 z-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Nouveau Lot d'Incinération</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Poids total (kg) *</label>
            <input
              type="number" step="0.1" min="0"
              value={poidsTotalKg}
              onChange={e => { setPoidsTotalKg(e.target.value); setErrors(p => ({ ...p, poidsTotalKg: '' })); }}
              placeholder="0.0"
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.poidsTotalKg ? 'border-rose-500' : 'border-slate-700 focus:border-lime-500'}`}
            />
            {errors.poidsTotalKg && <p className="text-xs text-rose-400 mt-1">{errors.poidsTotalKg}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Opérateur *</label>
            <input
              type="text"
              value={operateur}
              onChange={e => { setOperateur(e.target.value); setErrors(p => ({ ...p, operateur: '' })); }}
              placeholder="ex: Ibrahima Sarr"
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.operateur ? 'border-rose-500' : 'border-slate-700 focus:border-lime-500'}`}
            />
            {errors.operateur && <p className="text-xs text-rose-400 mt-1">{errors.operateur}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">Annuler</button>
          <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-lg shadow-orange-900/30 active:scale-95">
            <Flame size={14} className="inline mr-1.5 -mt-0.5" />
            Générer le certificat
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Destruction() {
  const { destructions, collectes } = useDataStore();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = destructions.filter(d => {
    const matchSearch = d.numeroLot.toLowerCase().includes(search.toLowerCase()) ||
      d.numeroCertificat.toLowerCase().includes(search.toLowerCase()) ||
      d.operateur.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || d.dateIncineration === dateFilter;
    return matchSearch && matchDate;
  });

  const totalPoids = destructions.reduce((s, d) => s + d.poidsTotalKg, 0);

  return (
    <>
      {showModal && (
        <AddDestructionModal onClose={() => setShowModal(false)} onAdd={() => {}} />
      )}

      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Registre de Destruction</h1>
            <p className="text-sm text-slate-400 mt-1">
              <span className="text-white font-medium">{destructions.length}</span> lots incinérés ·
              <span className="text-orange-400 font-medium"> {totalPoids.toFixed(1)} kg</span> au total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-900/30 active:scale-95"
          >
            <Plus size={16} />
            Nouveau Lot
          </button>
        </div>

        {/* Filters */}
        <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Rechercher par n° lot, certificat, opérateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {dateFilter && (
              <button onClick={() => setDateFilter('')} className="text-xs text-slate-500 hover:text-slate-300">Réinitialiser</button>
            )}
          </div>
        </div>

        {/* Registry cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="p-5 rounded-2xl glass border border-slate-700/40 hover:border-orange-500/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10">
                    <Flame size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{d.numeroLot}</p>
                    <p className="text-xs text-slate-500 font-mono">{d.id}</p>
                  </div>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all" title="Télécharger le certificat">
                  <Download size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 mb-0.5 flex items-center gap-1"><Scale size={10} /> Poids total</p>
                  <p className="text-sm font-semibold text-slate-200">{d.poidsTotalKg} kg</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 mb-0.5 flex items-center gap-1"><Calendar size={10} /> Date</p>
                  <p className="text-sm font-semibold text-slate-200">{d.dateIncineration}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 mb-0.5 flex items-center gap-1"><UserIcon size={10} /> Opérateur</p>
                  <p className="text-sm font-semibold text-slate-200">{d.operateur}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                  <p className="text-[10px] text-slate-500 mb-0.5">Collectes liées</p>
                  <p className="text-sm font-semibold text-slate-200">{d.collectesIds.length || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <FileText size={14} className="text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500">N° Certificat</p>
                  <p className="text-xs font-mono text-emerald-400 truncate">{d.numeroCertificat}</p>
                </div>
              </div>

              {d.collectesIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.collectesIds.map(id => {
                    const c = collectes.find(x => x.id === id);
                    return (
                      <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                        {c?.codeBarre || id}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Flame size={40} className="mx-auto mb-3 text-slate-700" />
            <p className="font-medium text-slate-400">Aucun lot d'incinération trouvé</p>
          </div>
        )}
      </div>
    </>
  );
}

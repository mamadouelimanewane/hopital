import { useState } from 'react';
import { Plus, Search, Filter, X, CalendarClock, Clock } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Seance } from '../contexts/DataStore';
import { useNotifications } from '../contexts/NotificationContext';

const statutStyles: Record<Seance['statut'], string> = {
  'Planifiée': 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  'En cours':  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Terminée':  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Annulée':   'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

function AddSeanceModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Seance) => void }) {
  const { patients, generateurs } = useDataStore();
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('2026-07-03');
  const [heure, setHeure] = useState('08:00');
  const [generateurId, setGenerateurId] = useState('');
  const [dureeMin, setDureeMin] = useState(240);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!patientId) errs.patientId = 'Le patient est requis';
    if (!generateurId) errs.generateurId = 'Le générateur est requis';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const patient = patients.find(p => p.id === patientId)!;
    const newSeance: Seance = {
      id: `SE-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId,
      patientNom: patient.nom,
      date, heure, generateurId, dureeMin,
      poidsAvant: 0, poidsApres: 0, tensionAvant: '', tensionApres: '',
      statut: 'Planifiée',
    };
    onAdd(newSeance);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg glass-strong rounded-2xl p-6 shadow-2xl border border-slate-700/50 z-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CalendarClock className="text-sky-400" size={20} />
            <h3 className="text-lg font-bold text-white">Planifier une séance</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Patient *</label>
            <select
              value={patientId}
              onChange={e => { setPatientId(e.target.value); setErrors(prev => ({ ...prev, patientId: '' })); }}
              className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.patientId ? 'border-rose-500' : 'border-slate-700 focus:border-sky-500'}`}
            >
              <option value="">Sélectionner un patient</option>
              {patients.filter(p => p.statut === 'Actif').map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
            {errors.patientId && <p className="text-xs text-rose-400 mt-1">{errors.patientId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Heure *</label>
              <input
                type="time"
                value={heure}
                onChange={e => setHeure(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Générateur *</label>
              <select
                value={generateurId}
                onChange={e => { setGenerateurId(e.target.value); setErrors(prev => ({ ...prev, generateurId: '' })); }}
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.generateurId ? 'border-rose-500' : 'border-slate-700 focus:border-sky-500'}`}
              >
                <option value="">Sélectionner</option>
                {generateurs.filter(g => g.statut !== 'Maintenance').map(g => (
                  <option key={g.id} value={g.id}>{g.id} — {g.salle}</option>
                ))}
              </select>
              {errors.generateurId && <p className="text-xs text-rose-400 mt-1">{errors.generateurId}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Durée (min)</label>
              <input
                type="number"
                value={dureeMin}
                onChange={e => setDureeMin(Number(e.target.value))}
                min={60}
                step={30}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">Annuler</button>
          <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all shadow-lg shadow-sky-900/30 active:scale-95">
            Planifier
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Planning() {
  const { seances, setSeances, generateurs } = useDataStore();
  const { push } = useNotifications();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<'Tous' | Seance['statut']>('Tous');
  const [filterGenerateur, setFilterGenerateur] = useState('Tous');
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (s: Seance) => {
    setSeances(prev => [s, ...prev]);
    push({ type: 'success', title: 'Séance planifiée', message: `${s.patientNom} — ${s.date} à ${s.heure}` });
  };

  const filtered = seances
    .filter(s => {
      const matchesSearch = s.patientNom.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatut = filterStatut === 'Tous' || s.statut === filterStatut;
      const matchesGen = filterGenerateur === 'Tous' || s.generateurId === filterGenerateur;
      return matchesSearch && matchesStatut && matchesGen;
    })
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));

  return (
    <>
      {showModal && <AddSeanceModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}

      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Planning des séances</h1>
            <p className="text-sm text-slate-400 mt-1">
              Séances du jour et à venir · {seances.length} séances au total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30 hover:shadow-sky-900/50 active:scale-95"
          >
            <Plus size={16} />
            Nouvelle séance
          </button>
        </div>

        {/* Filters */}
        <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Rechercher par patient, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">Statut:</span>
            {(['Tous', 'Planifiée', 'En cours', 'Terminée', 'Annulée'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatut(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterStatut === s ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={filterGenerateur}
            onChange={e => setFilterGenerateur(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="Tous">Tous les générateurs</option>
            {generateurs.map(g => <option key={g.id} value={g.id}>{g.id}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="glass border border-slate-700/40 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Heure</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Générateur</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durée</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Poids Av./Apr.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-200">{s.patientNom}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{s.id}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{s.date}</td>
                    <td className="px-4 py-3 text-slate-400">
                      <span className="inline-flex items-center gap-1"><Clock size={11} />{s.heure}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{s.generateurId}</td>
                    <td className="px-4 py-3 text-slate-400">{s.dureeMin} min</td>
                    <td className="px-4 py-3 text-slate-400">
                      {s.poidsAvant ? `${s.poidsAvant} → ${s.poidsApres} kg` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${statutStyles[s.statut]}`}>{s.statut}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-600 text-sm">Aucune séance trouvée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

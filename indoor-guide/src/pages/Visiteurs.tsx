import { useState } from 'react';
import { Search, UserPlus, LogIn, LogOut, Users } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Visiteur } from '../contexts/DataStore';

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function Visiteurs() {
  const { visiteurs, setVisiteurs } = useDataStore();
  const [query, setQuery] = useState('');
  const [statutFilter, setStatutFilter] = useState<'Tous' | Visiteur['statut']>('Tous');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: '', badgeNumero: '', serviceVisite: '', patientVisite: '' });

  const filtered = visiteurs.filter(v => {
    const matchQuery = `${v.nom} ${v.badgeNumero} ${v.serviceVisite} ${v.patientVisite}`.toLowerCase().includes(query.toLowerCase());
    const matchStatut = statutFilter === 'Tous' || v.statut === statutFilter;
    return matchQuery && matchStatut;
  });

  const checkOut = (id: string) => {
    setVisiteurs(prev => prev.map(v => v.id === id ? { ...v, statut: 'Sorti', heureSortie: nowHHMM() } : v));
  };

  const checkIn = (id: string) => {
    setVisiteurs(prev => prev.map(v => v.id === id ? { ...v, statut: 'En visite', heureSortie: null, heureEntree: nowHHMM() } : v));
  };

  const addVisiteur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.badgeNumero) return;
    const newV: Visiteur = {
      id: `VIS-${Date.now()}`,
      nom: form.nom,
      badgeNumero: form.badgeNumero,
      serviceVisite: form.serviceVisite || 'Non spécifié',
      patientVisite: form.patientVisite || 'Non spécifié',
      heureEntree: nowHHMM(),
      heureSortie: null,
      statut: 'En visite',
    };
    setVisiteurs(prev => [newV, ...prev]);
    setForm({ nom: '', badgeNumero: '', serviceVisite: '', patientVisite: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Visiteurs</h1>
          <p className="text-sm text-slate-400 mt-1">Gestion des badges et horaires des visiteurs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40 active:scale-95"
        >
          <UserPlus size={16} />
          Enregistrer un visiteur
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addVisiteur} className="p-5 rounded-2xl glass border border-slate-700/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in-up">
          <input required placeholder="Nom du visiteur" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
            className="rounded-xl px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50" />
          <input required placeholder="N° Badge (ex: B-1050)" value={form.badgeNumero} onChange={e => setForm({ ...form, badgeNumero: e.target.value })}
            className="rounded-xl px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50" />
          <input placeholder="Service visité" value={form.serviceVisite} onChange={e => setForm({ ...form, serviceVisite: e.target.value })}
            className="rounded-xl px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50" />
          <input placeholder="Patient visité" value={form.patientVisite} onChange={e => setForm({ ...form, patientVisite: e.target.value })}
            className="rounded-xl px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50" />
          <button type="submit" className="sm:col-span-2 lg:col-span-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all active:scale-95">
            Confirmer l'enregistrement
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Rechercher par nom, badge, service, patient..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-2">
          {(['Tous', 'En visite', 'Sorti'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatutFilter(s)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                statutFilter === s
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                  : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
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
              <tr className="border-b border-slate-800 text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">Visiteur</th>
                <th className="px-4 py-3 font-semibold">Badge</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Patient</th>
                <th className="px-4 py-3 font-semibold">Entrée</th>
                <th className="px-4 py-3 font-semibold">Sortie</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200">{v.nom}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{v.badgeNumero}</td>
                  <td className="px-4 py-3 text-slate-400">{v.serviceVisite}</td>
                  <td className="px-4 py-3 text-slate-400">{v.patientVisite}</td>
                  <td className="px-4 py-3 text-slate-400">{v.heureEntree}</td>
                  <td className="px-4 py-3 text-slate-400">{v.heureSortie ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${v.statut === 'En visite' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-600/20 text-slate-400'}`}>
                      {v.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {v.statut === 'En visite' ? (
                      <button onClick={() => checkOut(v.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all">
                        <LogOut size={12} /> Sortie
                      </button>
                    ) : (
                      <button onClick={() => checkIn(v.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all">
                        <LogIn size={12} /> Ré-entrer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    <Users size={24} className="mx-auto mb-2 text-slate-700" />
                    Aucun visiteur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

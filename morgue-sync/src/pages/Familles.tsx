import { useState } from 'react';
import { Search, Users, Phone, Calendar, MessageSquare } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

export default function Familles() {
  const { familles } = useDataStore();
  const [search, setSearch] = useState('');

  const filtered = familles.filter(f =>
    f.defuntNom.toLowerCase().includes(search.toLowerCase()) ||
    f.contactNom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Accompagnement des familles</h1>
          <p className="text-sm text-slate-400 mt-1">
            <span className="text-white font-medium">{filtered.length}</span> familles suivies · Contacts et visites
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="glass border border-slate-700/40 rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Rechercher par défunt ou contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="p-5 rounded-2xl glass border border-slate-700/40">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-800 rounded-xl">
                  <Users size={16} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{f.contactNom}</p>
                  <p className="text-xs text-slate-500">{f.lienParente} de {f.defuntNom}</p>
                </div>
              </div>
              {f.dateVisite ? (
                <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Visité
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  À contacter
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Phone size={12} />
                {f.telephone}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar size={12} />
                {f.dateVisite ? `Visite le ${f.dateVisite}` : 'Aucune visite prévue'}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <MessageSquare size={13} className="text-slate-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">{f.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Users size={40} className="mx-auto mb-3 text-slate-700" />
          <p className="font-medium text-slate-400">Aucune famille trouvée</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Users, Search, Phone, Star, Clock } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Fournisseur } from '../contexts/DataStore';

const CATEGORIES: Fournisseur['categorie'][] = ['Alimentation', 'Blanchisserie', 'Fournitures', 'Équipement'];

const categoryColors: Record<string, string> = {
  'Alimentation': 'bg-emerald-500/10 text-emerald-400',
  'Blanchisserie': 'bg-blue-500/10 text-blue-400',
  'Fournitures': 'bg-purple-500/10 text-purple-400',
  'Équipement': 'bg-amber-500/10 text-amber-400',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-xs text-amber-400 font-semibold flex-shrink-0">
      <Star size={12} className="fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
    </div>
  );
}

export default function Fournisseurs() {
  const { fournisseurs } = useDataStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  const filtered = fournisseurs.filter(f => {
    const matchesSearch = f.nom.toLowerCase().includes(search.toLowerCase()) ||
      f.contact.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'Tous' || f.categorie === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fournisseurs</h1>
          <p className="text-sm text-slate-400 mt-1">
            Gérez les relations avec vos partenaires logistiques non-médicaux.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Rechercher par entreprise ou contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500">Filtrer:</span>
          {['Tous', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((f) => (
          <div key={f.id} className="p-5 rounded-2xl glass border border-slate-700/40 hover:border-slate-600/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${categoryColors[f.categorie]}`}>
                  {f.categorie}
                </span>
                <StarRating rating={f.notation} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-slate-500" />
                <h3 className="text-base font-bold text-white tracking-tight">{f.nom}</h3>
              </div>

              <div className="space-y-2 mb-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className="text-slate-500">Contact:</span> {f.contact}
                </div>
                <a href={`tel:${f.telephone}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors">
                  <Phone size={12} /> {f.telephone}
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={13} className="text-amber-400" />
                <span>Délai moyen : <span className="font-semibold text-slate-200">{f.delaiMoyenJours} jours</span></span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-slate-500 text-sm">Aucun fournisseur ne correspond à votre recherche.</div>
        )}
      </div>
    </div>
  );
}

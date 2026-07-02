import { useState } from 'react';
import { MapPin, Building2, Layers, Navigation } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Zone } from '../contexts/DataStore';
import { useNavigate } from 'react-router-dom';

const categoryColors: Record<Zone['categorie'], { bg: string; border: string; text: string }> = {
  Consultation:     { bg: 'bg-blue-500/15',    border: 'border-blue-500/40',    text: 'text-blue-400' },
  Urgences:         { bg: 'bg-rose-500/15',    border: 'border-rose-500/40',    text: 'text-rose-400' },
  Hospitalisation:  { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  Administration:   { bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   text: 'text-amber-400' },
  Services:         { bg: 'bg-violet-500/15',  border: 'border-violet-500/40',  text: 'text-violet-400' },
};

export default function CarteInteractive() {
  const { zones } = useDataStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Zone | null>(null);
  const [filter, setFilter] = useState<Zone['categorie'] | 'Toutes'>('Toutes');

  const categories: (Zone['categorie'] | 'Toutes')[] = ['Toutes', 'Consultation', 'Urgences', 'Hospitalisation', 'Administration', 'Services'];
  const visibleZones = filter === 'Toutes' ? zones : zones.filter(z => z.categorie === filter);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Carte Interactive</h1>
          <p className="text-sm text-slate-400 mt-1">
            Plan simulé du complexe · Cliquez sur une zone pour plus de détails
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === cat
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                  : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map area */}
        <div className="xl:col-span-2 p-4 rounded-2xl glass border border-slate-700/40">
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/40"
            style={{ aspectRatio: '4 / 3', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>

            {/* Grid background */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#3b82f6" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)" />
            </svg>

            {/* Building outlines (decorative) */}
            <div className="absolute left-[5%] top-[5%] w-[35%] h-[85%] border border-dashed border-slate-600/40 rounded-lg" />
            <div className="absolute left-[42%] top-[5%] w-[25%] h-[55%] border border-dashed border-slate-600/40 rounded-lg" />
            <div className="absolute left-[60%] top-[15%] w-[35%] h-[75%] border border-dashed border-slate-600/40 rounded-lg" />

            {/* Zones as positioned dots/cards */}
            {visibleZones.map(zone => {
              const colors = categoryColors[zone.categorie];
              const isSelected = selected?.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelected(zone)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-200 ${isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'}`}
                  style={{ left: `${zone.coordX}%`, top: `${zone.coordY}%` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${colors.bg} ${isSelected ? 'border-white' : colors.border} shadow-lg`}>
                    <MapPin size={14} className={colors.text} />
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${isSelected ? 'bg-white text-slate-900' : 'bg-slate-900/80 text-slate-300'}`}>
                    {zone.nom}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info panel */}
        <div className="p-5 rounded-2xl glass border border-slate-700/40">
          {selected ? (
            <div className="animate-fade-in-up">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{selected.nom}</h2>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColors[selected.categorie].bg} ${categoryColors[selected.categorie].text}`}>
                    {selected.categorie}
                  </span>
                </div>
                <div className={`p-2 rounded-xl ${categoryColors[selected.categorie].bg}`}>
                  <MapPin size={18} className={categoryColors[selected.categorie].text} />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50">
                  <Building2 size={15} className="text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Bâtiment</p>
                    <p className="text-slate-200 font-medium">{selected.batiment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50">
                  <Layers size={15} className="text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Étage</p>
                    <p className="text-slate-200 font-medium">{selected.etage}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/itineraires')}
                className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
              >
                <Navigation size={15} />
                Générer un itinéraire vers cette zone
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[240px] text-center">
              <MapPin size={32} className="text-slate-700 mb-3" />
              <p className="text-sm text-slate-500">Sélectionnez une zone sur la carte pour voir ses détails</p>
            </div>
          )}
        </div>
      </div>

      {/* Zone list */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <h2 className="text-sm font-semibold text-white mb-4">Toutes les zones ({visibleZones.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleZones.map(zone => {
            const colors = categoryColors[zone.categorie];
            return (
              <button
                key={zone.id}
                onClick={() => setSelected(zone)}
                className={`text-left p-3 rounded-xl border transition-all hover:-translate-y-0.5 ${selected?.id === zone.id ? colors.border + ' ' + colors.bg : 'border-slate-800/50 bg-slate-900/40 hover:border-slate-700/50'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${colors.bg.replace('/15', '')}`} style={{ backgroundColor: 'currentColor' }} />
                  <p className={`text-xs font-semibold ${colors.text}`}>{zone.nom}</p>
                </div>
                <p className="text-[10px] text-slate-500">{zone.batiment} · {zone.etage}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

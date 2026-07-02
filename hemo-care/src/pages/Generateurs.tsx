import { Cpu, MapPin, Wrench, CalendarClock } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Generateur } from '../contexts/DataStore';

const statutStyles: Record<Generateur['statut'], string> = {
  'Disponible': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Occupé': 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  'Maintenance': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

const statutDot: Record<Generateur['statut'], string> = {
  'Disponible': 'bg-emerald-500',
  'Occupé': 'bg-sky-500',
  'Maintenance': 'bg-amber-500',
};

export default function Generateurs() {
  const { generateurs } = useDataStore();

  const counts = {
    Disponible: generateurs.filter(g => g.statut === 'Disponible').length,
    Occupé: generateurs.filter(g => g.statut === 'Occupé').length,
    Maintenance: generateurs.filter(g => g.statut === 'Maintenance').length,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Générateurs</h1>
        <p className="text-sm text-slate-400 mt-1">
          Parc de {generateurs.length} générateurs de dialyse réparti sur 3 salles
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {(['Disponible', 'Occupé', 'Maintenance'] as const).map(statut => (
          <div key={statut} className="p-4 rounded-2xl glass border border-slate-700/40">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-2 h-2 rounded-full ${statutDot[statut]}`} />
              <span className="text-xs text-slate-400">{statut}</span>
            </div>
            <p className="text-2xl font-bold text-white">{counts[statut]}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {generateurs.map((g) => (
          <div key={g.id} className="p-5 rounded-2xl glass border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-sky-500/10">
                <Cpu size={20} className="text-sky-400" />
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${statutStyles[g.statut]}`}>
                {g.statut}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{g.nom}</h3>
            <p className="text-[10px] text-slate-500 font-mono mb-4">{g.id}</p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={12} className="text-slate-600" />
                <span>{g.salle}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Wrench size={12} className="text-slate-600" />
                <span>Dernier entretien: {g.dernierEntretien}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CalendarClock size={12} className="text-slate-600" />
                <span>Prochain entretien: {g.prochainEntretien}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Snowflake, Thermometer, User } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

const statutStyle: Record<string, string> = {
  'Libre':       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Occupé':      'bg-slate-500/10 text-slate-300 border-slate-500/20',
  'Maintenance': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const dotStyle: Record<string, string> = {
  'Libre': 'bg-emerald-400',
  'Occupé': 'bg-slate-400',
  'Maintenance': 'bg-amber-400',
};

export default function Casiers() {
  const { casiers, defunts } = useDataStore();

  const libre = casiers.filter(c => c.statut === 'Libre').length;
  const occupe = casiers.filter(c => c.statut === 'Occupé').length;
  const maintenance = casiers.filter(c => c.statut === 'Maintenance').length;

  const getOccupant = (occupantId: string | null) => {
    if (!occupantId) return null;
    return defunts.find(d => d.id === occupantId) || null;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Casiers réfrigérés</h1>
          <p className="text-sm text-slate-400 mt-1">
            <span className="text-white font-medium">{casiers.length}</span> unités · Suivi de la disponibilité frigorifique
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {libre} libres
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-300 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {occupe} occupés
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {maintenance} en maintenance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {casiers.map((c) => {
          const occupant = getOccupant(c.occupantId);
          return (
            <div
              key={c.id}
              className={`p-4 rounded-2xl glass border transition-all ${
                c.statut === 'Occupé' ? 'border-slate-600/50' : c.statut === 'Maintenance' ? 'border-amber-600/30' : 'border-emerald-600/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  <Snowflake size={16} className="text-slate-300" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statutStyle[c.statut]}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${dotStyle[c.statut]}`} />
                  {c.statut}
                </span>
              </div>
              <p className="text-lg font-bold text-white">{c.numero}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                <Thermometer size={12} className={c.temperature > 6 ? 'text-rose-400' : 'text-blue-400'} />
                <span className={c.temperature > 6 ? 'text-rose-400 font-medium' : ''}>{c.temperature}°C</span>
              </div>
              {occupant ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800">
                  <User size={12} />
                  <span className="truncate">{occupant.nom}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-800">Aucun occupant</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

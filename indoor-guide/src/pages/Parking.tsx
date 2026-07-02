import { useState } from 'react';
import { ParkingSquare, Car, Users, Ambulance } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { PlaceParking } from '../contexts/DataStore';

const zoneIcons: Record<PlaceParking['zone'], React.ElementType> = {
  Visiteurs: Users,
  Personnel: Car,
  Ambulances: Ambulance,
};

const statutStyles: Record<PlaceParking['statut'], { bg: string; border: string; text: string; dot: string }> = {
  Libre:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  Occupée:  { bg: 'bg-rose-500/10',    border: 'border-rose-500/40',    text: 'text-rose-400',    dot: 'bg-rose-500' },
  Réservée: { bg: 'bg-amber-500/10',   border: 'border-amber-500/40',   text: 'text-amber-400',   dot: 'bg-amber-500' },
};

export default function Parking() {
  const { placesParking, setPlacesParking } = useDataStore();
  const [zoneFilter, setZoneFilter] = useState<'Toutes' | PlaceParking['zone']>('Toutes');

  const filtered = zoneFilter === 'Toutes' ? placesParking : placesParking.filter(p => p.zone === zoneFilter);

  const counts = {
    Libre: placesParking.filter(p => p.statut === 'Libre').length,
    Occupée: placesParking.filter(p => p.statut === 'Occupée').length,
    Réservée: placesParking.filter(p => p.statut === 'Réservée').length,
  };

  const cycleStatut = (id: string) => {
    const order: PlaceParking['statut'][] = ['Libre', 'Occupée', 'Réservée'];
    setPlacesParking(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next = order[(order.indexOf(p.statut) + 1) % order.length];
      return { ...p, statut: next };
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Parking</h1>
          <p className="text-sm text-slate-400 mt-1">Disponibilité des places de stationnement en temps réel</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {(Object.entries(counts) as [PlaceParking['statut'], number][]).map(([statut, count]) => (
            <div key={statut} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${statutStyles[statut].dot}`} />
              <span className="text-slate-400">{statut}: <span className="font-bold text-slate-200">{count}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(['Toutes', 'Visiteurs', 'Personnel', 'Ambulances'] as const).map(z => (
          <button
            key={z}
            onClick={() => setZoneFilter(z)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
              zoneFilter === z
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(place => {
            const Icon = zoneIcons[place.zone];
            const style = statutStyles[place.statut];
            return (
              <button
                key={place.id}
                onClick={() => cycleStatut(place.id)}
                title="Cliquer pour changer le statut"
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${style.bg} ${style.border}`}
              >
                <div className={`p-2.5 rounded-xl ${style.bg}`}>
                  <Icon size={18} className={style.text} />
                </div>
                <p className="text-sm font-bold text-white">{place.numero}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {place.statut}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-500">
              <ParkingSquare size={24} className="mx-auto mb-2 text-slate-700" />
              Aucune place trouvée pour ce filtre
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

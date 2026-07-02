import { useState, useEffect, useMemo } from 'react';
import { Baby, HeartPulse, Thermometer, Wind, AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Couveuse } from '../contexts/DataStore';

const statutStyle: Record<Couveuse['statut'], string> = {
  'Libre': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Occupée': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Maintenance': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const statutDot: Record<Couveuse['statut'], string> = {
  'Libre': 'bg-emerald-400',
  'Occupée': 'bg-pink-400',
  'Maintenance': 'bg-amber-400',
};

// Deterministic pseudo-random monitoring values, seeded by couveuse id, refreshed periodically
function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return h;
}

function useTick(intervalMs: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return tick;
}

export default function Neonatologie() {
  const { couveuses } = useDataStore();
  const tick = useTick(4000);

  const monitoring = useMemo(() => {
    const map: Record<string, { bcf: number; temp: number; spo2: number }> = {};
    couveuses.forEach(c => {
      const seed = seedFromId(c.id) + tick;
      map[c.id] = {
        bcf: 128 + (seed % 20), // 128-147 bpm
        temp: 36.2 + ((seed % 12) / 10), // 36.2 - 37.4
        spo2: 94 + (seed % 6), // 94-99%
      };
    });
    return map;
  }, [couveuses, tick]);

  const libres = couveuses.filter(c => c.statut === 'Libre').length;
  const occupees = couveuses.filter(c => c.statut === 'Occupée').length;
  const maintenance = couveuses.filter(c => c.statut === 'Maintenance').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Néonatologie</h1>
          <p className="text-sm text-slate-400 mt-1">Gestion des 15 lits néonatals · Monitoring en temps réel</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label: 'Libres', value: libres, color: 'text-emerald-400' },
            { label: 'Occupées', value: occupees, color: 'text-pink-400' },
            { label: 'Maintenance', value: maintenance, color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs">
              <span className={`font-bold ${s.color}`}>{s.value}</span>
              <span className="text-slate-500 ml-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incubator grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {couveuses.map((c) => {
          const m = monitoring[c.id];
          const isOccupied = c.statut === 'Occupée';
          return (
            <div
              key={c.id}
              className={`p-4 rounded-2xl glass border transition-all duration-300 hover:-translate-y-0.5 ${
                c.statut === 'Occupée' ? 'border-pink-500/30' : c.statut === 'Maintenance' ? 'border-amber-500/30' : 'border-slate-700/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isOccupied ? 'bg-pink-500/10' : c.statut === 'Maintenance' ? 'bg-amber-500/10' : 'bg-slate-800'}`}>
                    <Baby size={15} className={isOccupied ? 'text-pink-400' : c.statut === 'Maintenance' ? 'text-amber-400' : 'text-slate-500'} />
                  </div>
                  <span className="text-sm font-bold text-white font-mono">{c.id}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statutStyle[c.statut]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statutDot[c.statut]} ${isOccupied ? 'animate-pulse' : ''}`} />
                  {c.statut}
                </span>
              </div>

              {c.statut === 'Occupée' && (
                <>
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-200 truncate">{c.occupantNom}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Admis le {c.dateAdmission}</p>
                  </div>

                  {/* Monitoring mini-cards */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-center">
                      <HeartPulse size={11} className="text-rose-400 mx-auto mb-1" />
                      <p className="text-[11px] font-bold text-slate-200">{m.bcf}</p>
                      <p className="text-[8px] text-slate-500">bpm</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-center">
                      <Thermometer size={11} className="text-amber-400 mx-auto mb-1" />
                      <p className="text-[11px] font-bold text-slate-200">{m.temp.toFixed(1)}°</p>
                      <p className="text-[8px] text-slate-500">temp.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-center">
                      <Wind size={11} className="text-blue-400 mx-auto mb-1" />
                      <p className="text-[11px] font-bold text-slate-200">{m.spo2}%</p>
                      <p className="text-[8px] text-slate-500">SpO₂</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Poids actuel</span>
                    <span className="font-semibold text-slate-200">{c.poidsActuel} g</span>
                  </div>
                </>
              )}

              {c.statut === 'Libre' && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 size={22} className="text-emerald-500/60 mb-2" />
                  <p className="text-xs text-slate-500">Lit disponible</p>
                </div>
              )}

              {c.statut === 'Maintenance' && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Wrench size={22} className="text-amber-500/60 mb-2" />
                  <p className="text-xs text-slate-500">Hors service — technicien requis</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend / alert */}
      <div className="p-4 rounded-2xl glass border border-slate-700/40 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400">
          Les valeurs de monitoring (rythme cardiaque fœtal, température, SpO₂) affichées sont des données de démonstration
          générées automatiquement à des fins de simulation, et sont actualisées toutes les 4 secondes.
        </p>
      </div>
    </div>
  );
}

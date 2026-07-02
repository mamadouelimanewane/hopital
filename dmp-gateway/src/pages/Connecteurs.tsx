import { useState } from 'react';
import { Cable, Signal, CheckCircle2, XCircle, PauseCircle, Hospital } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';
import type { Connecteur } from '../contexts/DataStore';

const statutConfig: Record<Connecteur['statut'], { color: string; bg: string; icon: React.ElementType }> = {
  'Actif':   { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  'Inactif': { color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20',    icon: PauseCircle },
  'Erreur':  { color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',      icon: XCircle },
};

const typeConfig: Record<Connecteur['type'], { color: string; bg: string }> = {
  'HL7 v2':  { color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  'FHIR R4': { color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
};

function latenceColor(ms: number) {
  if (ms === 0) return 'text-slate-500';
  if (ms < 150) return 'text-emerald-400';
  if (ms < 300) return 'text-amber-400';
  return 'text-rose-400';
}

export default function Connecteurs() {
  const { connecteurs } = useDataStore();
  const [typeFilter, setTypeFilter] = useState<'Tous' | Connecteur['type']>('Tous');

  const filtered = connecteurs.filter(c => typeFilter === 'Tous' || c.type === typeFilter);

  const actifs = connecteurs.filter(c => c.statut === 'Actif').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connecteurs</h1>
          <p className="text-sm text-slate-400 mt-1">
            Points d'intégration HL7 v2 / FHIR R4 vers les hôpitaux du réseau national
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <Signal size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">{actifs}/{connecteurs.length} connecteurs actifs</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {(['Tous', 'HL7 v2', 'FHIR R4'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === t ? 'bg-emerald-500 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid of connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => {
          const sCfg = statutConfig[c.statut];
          const tCfg = typeConfig[c.type];
          return (
            <div key={c.id} className="p-5 rounded-2xl glass border border-slate-700/40 hover:border-slate-600/60 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800/60">
                    <Cable size={16} className="text-slate-400" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${tCfg.bg} ${tCfg.color}`}>{c.type}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold ${sCfg.bg} ${sCfg.color}`}>
                  <sCfg.icon size={11} />
                  {c.statut}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-1">{c.nom}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                <Hospital size={12} />
                {c.hopitalDistant}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Latence</p>
                  <p className={`text-sm font-bold ${latenceColor(c.latenceMs)}`}>{c.latenceMs > 0 ? `${c.latenceMs} ms` : '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Dernier ping</p>
                  <p className="text-xs text-slate-400">{c.dernierPing}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

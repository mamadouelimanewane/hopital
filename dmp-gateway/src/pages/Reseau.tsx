import { useState } from 'react';
import { Cable, CheckCircle2, XCircle, PauseCircle, Signal, Hospital } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

interface Node {
  id: string;
  name: string;
  ville: string;
  x: number; // percentage
  y: number; // percentage
  central?: boolean;
}

const nodes: Node[] = [
  { id: 'ndamatou',    name: 'Hôpital Ndamatou Touba',          ville: 'Touba',       x: 45, y: 42, central: true },
  { id: 'dakar',       name: 'CHU Aristide Le Dantec Dakar',    ville: 'Dakar',       x: 15, y: 38 },
  { id: 'thies',       name: 'Hôpital Régional de Thiès',       ville: 'Thiès',       x: 28, y: 40 },
  { id: 'saintlouis',  name: 'Hôpital Régional de Saint-Louis', ville: 'Saint-Louis', x: 30, y: 10 },
  { id: 'kaolack',     name: 'Hôpital Régional de Kaolack',     ville: 'Kaolack',     x: 46, y: 62 },
  { id: 'ziguinchor',  name: 'Hôpital de Ziguinchor',           ville: 'Ziguinchor',  x: 22, y: 88 },
];

const statutConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  'Actif':   { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  'Inactif': { color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20',    icon: PauseCircle },
  'Erreur':  { color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',      icon: XCircle },
};

export default function Reseau() {
  const { connecteurs } = useDataStore();
  const [selected, setSelected] = useState<Node | null>(null);

  const centralNode = nodes.find(n => n.central)!;
  const otherNodes = nodes.filter(n => !n.central);

  const connecteurFor = (node: Node) =>
    connecteurs.find(c => c.hopitalDistant.toLowerCase().includes(node.ville.toLowerCase()));

  const lineColor = (node: Node) => {
    const c = connecteurFor(node);
    if (!c) return '#334155';
    if (c.statut === 'Actif') return '#10b981';
    if (c.statut === 'Erreur') return '#f43f5e';
    return '#64748b';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Réseau National</h1>
        <p className="text-sm text-slate-400 mt-1">
          Carte des hôpitaux sénégalais connectés au DMP-Gateway · Cliquez un nœud pour voir son statut
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map */}
        <div className="xl:col-span-2 relative glass border border-slate-700/40 rounded-2xl p-4 overflow-hidden" style={{ minHeight: 480 }}>
          {/* Senegal-shaped relative container */}
          <div className="relative w-full h-full" style={{ minHeight: 440 }}>

            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />

            {/* Connection lines (SVG overlay) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {otherNodes.map(node => (
                <line
                  key={node.id}
                  x1={`${centralNode.x}%`} y1={`${centralNode.y}%`}
                  x2={`${node.x}%`} y2={`${node.y}%`}
                  stroke={lineColor(node)}
                  strokeWidth="1.5"
                  strokeDasharray={connecteurFor(node)?.statut === 'Actif' ? '0' : '4 3'}
                  opacity="0.7"
                />
              ))}
            </svg>

            {/* Central node — Ndamatou */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${centralNode.x}%`, top: `${centralNode.y}%` }}
              onClick={() => setSelected(centralNode)}
            >
              <div className="flex flex-col items-center gap-1.5 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(16,185,129,0.15)', borderColor: '#10b981', boxShadow: '0 0 24px rgba(16,185,129,0.4)' }}>
                  🏥
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded-md whitespace-nowrap">Ndamatou (Central)</span>
              </div>
            </div>

            {/* Other nodes */}
            {otherNodes.map(node => {
              const c = connecteurFor(node);
              const cfg = c ? statutConfig[c.statut] : statutConfig['Inactif'];
              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => setSelected(node)}
                >
                  <div className="flex flex-col items-center gap-1.5 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-110 ${cfg.bg}`}
                      style={{ borderColor: c?.statut === 'Actif' ? '#10b981' : c?.statut === 'Erreur' ? '#f43f5e' : '#475569' }}>
                      <Hospital size={16} className={cfg.color} />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded-md whitespace-nowrap">{node.ville}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="p-5 rounded-2xl glass border border-slate-700/40">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <Signal size={32} className="text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">Sélectionnez un hôpital sur la carte pour voir le statut de sa connexion.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selected.ville}, Sénégal</p>
              </div>

              {selected.central ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-400 mb-1">Nœud central du réseau</p>
                  <p className="text-xs text-slate-400">Point d'ancrage du DMP-Gateway, relié à {otherNodes.length} hôpitaux distants.</p>
                </div>
              ) : (
                (() => {
                  const c = connecteurFor(selected);
                  if (!c) {
                    return <p className="text-xs text-slate-500">Aucun connecteur configuré pour cet hôpital.</p>;
                  }
                  const cfg = statutConfig[c.statut];
                  return (
                    <div className="space-y-3">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg}`}>
                        <cfg.icon size={16} className={cfg.color} />
                        <span className={`text-sm font-semibold ${cfg.color}`}>{c.statut}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <p className="text-[10px] text-slate-500 uppercase">Type</p>
                          <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-1">
                            <Cable size={12} /> {c.type}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <p className="text-[10px] text-slate-500 uppercase">Latence</p>
                          <p className="text-sm font-semibold text-slate-200 mt-1">{c.latenceMs > 0 ? `${c.latenceMs} ms` : '—'}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                        <p className="text-[10px] text-slate-500 uppercase">Dernier ping</p>
                        <p className="text-xs text-slate-400 mt-1">{c.dernierPing}</p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 flex-wrap px-1">
        {Object.entries(statutConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: key === 'Actif' ? '#10b981' : key === 'Erreur' ? '#f43f5e' : '#64748b' }} />
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}

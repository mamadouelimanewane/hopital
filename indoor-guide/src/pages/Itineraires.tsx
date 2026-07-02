import { useState } from 'react';
import { Navigation, MapPin, ArrowRight, Footprints, CheckCircle2, RotateCcw } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

interface Etape {
  texte: string;
  distance: string;
}

function genererEtapes(depart: string, arrivee: string): { etapes: Etape[]; tempsEstime: string } {
  const templates = [
    `Sortez de "${depart}" et dirigez-vous vers le couloir principal`,
    'Suivez le couloir principal jusqu\'au hall central',
    'Traversez le hall central en direction des panneaux de signalisation bleus',
    'Prenez l\'escalier ou l\'ascenseur si le service se trouve à un autre étage',
    `Continuez tout droit jusqu\'à atteindre "${arrivee}"`,
    'Présentez-vous à l\'accueil du service pour finaliser votre orientation',
  ];

  const distances = ['40 m', '65 m', '30 m', '15 m', '50 m', '5 m'];
  const etapes: Etape[] = templates.map((texte, i) => ({ texte, distance: distances[i] }));

  const totalMeters = distances.reduce((sum, d) => sum + parseInt(d), 0);
  const minutes = Math.max(1, Math.round(totalMeters / 70)); // ~70m/min marche
  return { etapes, tempsEstime: `${minutes} min` };
}

export default function Itineraires() {
  const { zones } = useDataStore();
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [resultat, setResultat] = useState<{ etapes: Etape[]; tempsEstime: string } | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());

  const generer = () => {
    if (!depart || !arrivee || depart === arrivee) return;
    const departZone = zones.find(z => z.id === depart);
    const arriveeZone = zones.find(z => z.id === arrivee);
    if (!departZone || !arriveeZone) return;
    setResultat(genererEtapes(departZone.nom, arriveeZone.nom));
    setDone(new Set());
  };

  const reset = () => {
    setResultat(null);
    setDone(new Set());
    setDepart('');
    setArrivee('');
  };

  const toggleDone = (idx: number) => {
    setDone(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const departZone = zones.find(z => z.id === depart);
  const arriveeZone = zones.find(z => z.id === arrivee);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Itinéraires</h1>
        <p className="text-sm text-slate-400 mt-1">Simulateur de guidage pas-à-pas dans le complexe hospitalier</p>
      </div>

      {/* Form */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Départ</label>
            <select value={depart} onChange={e => setDepart(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 outline-none focus:border-blue-500/50">
              <option value="">Sélectionner une zone de départ</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.nom} ({z.batiment})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Destination</label>
            <select value={arrivee} onChange={e => setArrivee(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 text-slate-200 outline-none focus:border-blue-500/50">
              <option value="">Sélectionner une destination</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.nom} ({z.batiment})</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={generer}
            disabled={!depart || !arrivee || depart === arrivee}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            <Navigation size={16} />
            Générer l'itinéraire
          </button>
          {resultat && (
            <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-slate-200 text-sm font-medium transition-all">
              <RotateCcw size={14} /> Réinitialiser
            </button>
          )}
        </div>
        {depart && arrivee && depart === arrivee && (
          <p className="text-xs text-amber-400 mt-2">Le départ et la destination doivent être différents.</p>
        )}
      </div>

      {/* Result */}
      {resultat && departZone && arriveeZone && (
        <div className="p-5 rounded-2xl glass border border-slate-700/40 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 font-semibold">
                <MapPin size={13} /> {departZone.nom}
              </span>
              <ArrowRight size={16} className="text-slate-600" />
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold">
                <MapPin size={13} /> {arriveeZone.nom}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-300 text-sm font-medium">
              <Footprints size={15} className="text-blue-400" />
              Temps estimé : <span className="font-bold text-white">{resultat.tempsEstime}</span>
            </div>
          </div>

          <ol className="space-y-3">
            {resultat.etapes.map((etape, idx) => {
              const isDone = done.has(idx);
              return (
                <li key={idx}>
                  <button
                    onClick={() => toggleDone(idx)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50'
                    }`}
                  >
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle2 size={15} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isDone ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{etape.texte}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">≈ {etape.distance}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          {done.size === resultat.etapes.length && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <p className="text-sm text-emerald-300 font-medium">Vous êtes arrivé à destination : {arriveeZone.nom} !</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

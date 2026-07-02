import { useState } from 'react';
import { Activity, HeartPulse, Clock, User } from 'lucide-react';
import {
  LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts';

interface PatienteEnTravail {
  id: string;
  nom: string;
  age: number;
  terme: number;
  debutTravail: string;
  sageFemme: string;
  data: { heure: string; dilatation: number; bcf: number; contractions: number }[];
}

const PATIENTES: PatienteEnTravail[] = [
  {
    id: 'TRV-001', nom: 'Khadija Sarr', age: 26, terme: 39, debutTravail: '04:15', sageFemme: 'Aïssatou Ndoye',
    data: [
      { heure: '04:15', dilatation: 2, bcf: 140, contractions: 2 },
      { heure: '05:15', dilatation: 3, bcf: 138, contractions: 3 },
      { heure: '06:15', dilatation: 4, bcf: 142, contractions: 3 },
      { heure: '07:15', dilatation: 5, bcf: 145, contractions: 4 },
      { heure: '08:15', dilatation: 7, bcf: 139, contractions: 4 },
      { heure: '09:15', dilatation: 8, bcf: 141, contractions: 5 },
    ],
  },
  {
    id: 'TRV-002', nom: 'Maïmouna Diouf', age: 31, terme: 40, debutTravail: '07:00', sageFemme: 'Khady Diouf',
    data: [
      { heure: '07:00', dilatation: 1, bcf: 135, contractions: 1 },
      { heure: '08:00', dilatation: 2, bcf: 137, contractions: 2 },
      { heure: '09:00', dilatation: 3, bcf: 140, contractions: 2 },
      { heure: '10:00', dilatation: 4, bcf: 138, contractions: 3 },
    ],
  },
  {
    id: 'TRV-003', nom: 'Ramatoulaye Kane', age: 23, terme: 38, debutTravail: '01:30', sageFemme: 'Aïssatou Ndoye',
    data: [
      { heure: '01:30', dilatation: 3, bcf: 142, contractions: 2 },
      { heure: '02:30', dilatation: 5, bcf: 144, contractions: 3 },
      { heure: '03:30', dilatation: 6, bcf: 141, contractions: 4 },
      { heure: '04:30', dilatation: 8, bcf: 146, contractions: 4 },
      { heure: '05:30', dilatation: 10, bcf: 143, contractions: 5 },
    ],
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
        <p className="font-semibold text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-400 capitalize">{entry.name}:</span>
            <span className="font-medium text-slate-200">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Partogramme() {
  const [selectedId, setSelectedId] = useState(PATIENTES[0].id);
  const selected = PATIENTES.find(p => p.id === selectedId)!;
  const lastPoint = selected.data[selected.data.length - 1];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Partogramme</h1>
        <p className="text-sm text-slate-400 mt-1">Suivi électronique du travail — patientes actuellement en salle de naissance</p>
      </div>

      {/* Patient tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PATIENTES.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedId === p.id
                ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <User size={14} />
            {p.nom}
          </button>
        ))}
      </div>

      {/* Patient info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Âge', value: `${selected.age} ans`, icon: User, color: 'text-pink-400 bg-pink-500/10' },
          { label: 'Terme', value: `${selected.terme} SA`, icon: Clock, color: 'text-violet-400 bg-violet-500/10' },
          { label: 'Dilatation actuelle', value: `${lastPoint.dilatation} cm`, icon: Activity, color: 'text-blue-400 bg-blue-500/10' },
          { label: 'BCF actuel', value: `${lastPoint.bcf} bpm`, icon: HeartPulse, color: 'text-rose-400 bg-rose-500/10' },
        ].map(kpi => (
          <div key={kpi.label} className="p-5 rounded-2xl glass border border-slate-700/40">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mt-1.5 tracking-tight">{kpi.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                <kpi.icon size={20} className={kpi.color.split(' ')[0]} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info bar */}
      <div className="glass border border-slate-700/40 rounded-2xl p-4 flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock size={14} className="text-pink-400" />
          Début du travail : <span className="text-slate-200 font-medium">{selected.debutTravail}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <User size={14} className="text-pink-400" />
          Sage-femme : <span className="text-slate-200 font-medium">{selected.sageFemme}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-mono text-xs">{selected.id}</span>
        </div>
      </div>

      {/* Line chart — dilatation cervicale */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-white">Évolution de la dilatation cervicale</h2>
          <p className="text-xs text-slate-500 mt-0.5">Courbe de travail — dilatation (cm) et rythme cardiaque fœtal (bpm) dans le temps</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={selected.data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="heure" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#ec4899" fontSize={11} tickLine={false} axisLine={false} domain={[0, 10]} label={{ value: 'Dilatation (cm)', angle: -90, position: 'insideLeft', fill: '#ec4899', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={11} tickLine={false} axisLine={false} domain={[100, 180]} label={{ value: 'BCF (bpm)', angle: 90, position: 'insideRight', fill: '#f43f5e', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="left" type="monotone" dataKey="dilatation" name="Dilatation (cm)" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 4, fill: '#ec4899' }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="bcf" name="BCF (bpm)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: '#f43f5e' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data table */}
      <div className="rounded-2xl glass border border-slate-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-700/50 bg-slate-900/30">
              <tr>
                <th className="px-6 py-3 font-semibold">Heure</th>
                <th className="px-6 py-3 font-semibold">Dilatation cervicale</th>
                <th className="px-6 py-3 font-semibold">BCF (bpm)</th>
                <th className="px-6 py-3 font-semibold">Contractions / 10min</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {selected.data.map((d, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3 text-slate-300 font-mono text-xs">{d.heure}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-pink-500" style={{ width: `${(d.dilatation / 10) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-300 font-semibold">{d.dilatation} cm</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{d.bcf} bpm</td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{d.contractions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

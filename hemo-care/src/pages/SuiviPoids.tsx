import { useState, useMemo } from 'react';
import { Scale, TrendingDown } from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, Legend,
} from 'recharts';
import { useDataStore } from '../contexts/DataStore';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
        <p className="font-semibold text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-400 capitalize">{entry.name}:</span>
            <span className="font-medium text-slate-200">{entry.value} kg</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function SuiviPoids() {
  const { patients, seances } = useDataStore();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');

  const selectedPatient = patients.find(p => p.id === patientId);

  const chartData = useMemo(() => {
    return seances
      .filter(s => s.patientId === patientId && s.poidsAvant > 0)
      .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure))
      .map(s => ({
        date: s.date.slice(5),
        poidsAvant: s.poidsAvant,
        poidsApres: s.poidsApres,
        poidsSec: selectedPatient?.poidsSec ?? 0,
      }));
  }, [seances, patientId, selectedPatient]);

  const dernierEcart = chartData.length
    ? (chartData[chartData.length - 1].poidsAvant - chartData[chartData.length - 1].poidsApres).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Suivi du poids</h1>
          <p className="text-sm text-slate-400 mt-1">
            Évolution du poids avant / après séance, comparé au poids sec
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-slate-500" />
          <select
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedPatient && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Poids Sec</p>
            <p className="text-xl font-bold text-white">{selectedPatient.poidsSec} kg</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Poids Entrée Hôpital</p>
            <p className="text-xl font-bold text-white">{selectedPatient.poidsEntreeHopital} kg</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Séances suivies</p>
            <p className="text-xl font-bold text-white">{chartData.length}</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dernier retrait</p>
            <p className="text-xl font-bold text-white flex items-center gap-1.5">
              <TrendingDown size={16} className="text-emerald-400" />
              {dernierEcart} kg
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <h2 className="text-base font-semibold text-white mb-1">Poids avant / après séance</h2>
        <p className="text-xs text-slate-500 mb-5">{selectedPatient?.nom}</p>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
            Aucune séance avec données de poids pour ce patient
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gAvant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gApres" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="poidsAvant" name="Poids avant" stroke="#0ea5e9" strokeWidth={2} fill="url(#gAvant)" dot={{ r: 3, fill: '#0ea5e9' }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="poidsApres" name="Poids après" stroke="#10b981" strokeWidth={2} fill="url(#gApres)" dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="poidsSec" name="Poids sec" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

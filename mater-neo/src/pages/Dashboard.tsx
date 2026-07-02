import {
  Baby, AlertTriangle, HeartPulse, Bed, TrendingUp, TrendingDown, ArrowRight, Activity
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStore';

const weeklyData = [
  { day: 'Lun', voieBasse: 2, cesarienne: 1 },
  { day: 'Mar', voieBasse: 3, cesarienne: 0 },
  { day: 'Mer', voieBasse: 1, cesarienne: 2 },
  { day: 'Jeu', voieBasse: 2, cesarienne: 1 },
  { day: 'Ven', voieBasse: 4, cesarienne: 1 },
  { day: 'Sam', voieBasse: 1, cesarienne: 0 },
  { day: 'Dim', voieBasse: 2, cesarienne: 1 },
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { grossesses, accouchements, couveuses } = useDataStore();

  const today = 'Jui.';
  const accouchementsAujourdhui = accouchements.filter(a => a.date.startsWith('01 ' + today) || a.date.includes('01 Jui')).length;
  const litsOccupes = couveuses.filter(c => c.statut === 'Occupée').length;
  const grossessesRisque = grossesses.filter(g => g.grossesseRisque).length;
  const tauxOccupation = Math.round((litsOccupes / 15) * 100);

  const kpis = [
    { label: 'Accouchements Aujourd\'hui', value: String(accouchementsAujourdhui || 1), delta: '+1', up: true, icon: HeartPulse, color: 'pink' },
    { label: 'Lits Néonat. Occupés', value: `${litsOccupes}/15`, delta: `${Math.round((litsOccupes/15)*100)}%`, up: litsOccupes < 12, icon: Bed, color: 'blue' },
    { label: 'Grossesses à Risque', value: String(grossessesRisque), delta: '+1', up: false, icon: AlertTriangle, color: 'rose' },
    { label: 'Taux d\'Occupation Maternité', value: `${tauxOccupation}%`, delta: '+3%', up: tauxOccupation < 80, icon: Activity, color: 'violet' },
  ];

  const colorMap: Record<string, string> = {
    pink: 'text-pink-400 bg-pink-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
  };

  const statutCount = {
    Libre: couveuses.filter(c => c.statut === 'Libre').length,
    Occupée: couveuses.filter(c => c.statut === 'Occupée').length,
    Maintenance: couveuses.filter(c => c.statut === 'Maintenance').length,
  };

  const pieData = [
    { name: 'Libre', value: statutCount.Libre, color: '#10b981' },
    { name: 'Occupée', value: statutCount.Occupée, color: '#ec4899' },
    { name: 'Maintenance', value: statutCount.Maintenance, color: '#f59e0b' },
  ];

  const recentAccouchements = [...accouchements].slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-1">
            Vue temps réel · <span className="text-pink-400">Hôpital Ndamatou, Touba</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-xs font-medium text-pink-400">Live · Maternité & Néonatologie</span>
          </div>
          <button onClick={() => navigate('/accouchements')} className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-pink-900/40 hover:shadow-pink-900/60 active:scale-95">
            <Baby size={16} />
            Nouvel Accouchement
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`p-5 rounded-2xl glass border border-slate-700/40 group hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-0.5 stagger-${i + 1} animate-fade-in-up`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mt-1.5 tracking-tight">{kpi.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${colorMap[kpi.color]}`}>
                <kpi.icon size={20} className={colorMap[kpi.color].split(' ')[0]} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              {kpi.up
                ? <TrendingUp size={13} className="text-emerald-400" />
                : <TrendingDown size={13} className="text-rose-400" />
              }
              <span className={`text-xs font-semibold ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>{kpi.delta}</span>
              <span className="text-xs text-slate-600">vs semaine passée</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Area Chart */}
        <div className="xl:col-span-2 p-5 rounded-2xl glass border border-slate-700/40">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Accouchements de la semaine</h2>
              <p className="text-xs text-slate-500 mt-0.5">Répartition par type d'accouchement</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500" /><span className="text-slate-400">Voie basse</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-500" /><span className="text-slate-400">Césarienne</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gVoieBasse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCesarienne" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="voieBasse" name="Voie basse" stroke="#ec4899" strokeWidth={2} fill="url(#gVoieBasse)" dot={false} activeDot={{ r: 4, fill: '#ec4899' }} />
              <Area type="monotone" dataKey="cesarienne" name="Césarienne" stroke="#8b5cf6" strokeWidth={2} fill="url(#gCesarienne)" dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass border border-slate-700/40 flex-1">
            <h2 className="text-sm font-semibold text-white mb-4">État des couveuses (15 lits)</h2>
            <div className="flex items-center gap-4">
              <PieChart width={110} height={110}>
                <Pie data={pieData} cx={50} cy={50} innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="space-y-2 flex-1">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass border border-slate-700/40">
            <h2 className="text-sm font-semibold text-white mb-4">Suivi grossesses</h2>
            <div className="space-y-3">
              {(['Normal', 'Surveillance', 'Risque Élevé'] as const).map(s => {
                const count = grossesses.filter(g => g.suivi === s).length;
                const pct = grossesses.length ? Math.round((count / grossesses.length) * 100) : 0;
                const color = s === 'Normal' ? 'bg-emerald-500' : s === 'Surveillance' ? 'bg-amber-500' : 'bg-rose-500';
                const textColor = s === 'Normal' ? 'text-emerald-400' : s === 'Surveillance' ? 'text-amber-400' : 'text-rose-400';
                return (
                  <div key={s}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{s}</span>
                      <span className={`font-semibold ${textColor}`}>{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent births */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <h2 className="text-sm font-semibold text-white">Accouchements récents</h2>
          </div>
          <Link to="/accouchements" className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
        </div>
        <div className="space-y-2">
          {recentAccouchements.map((acc) => (
            <div key={acc.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer group">
              <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${acc.type === 'Césarienne' ? 'bg-violet-500/15 text-violet-400' : 'bg-pink-500/15 text-pink-400'}`}>
                <Baby size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{acc.patienteNom} · {acc.type}</p>
                <p className="text-xs text-slate-500 mt-0.5">{acc.date} · Apgar {acc.apgar}/10 · {acc.poidsBebe}g</p>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors mt-1 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

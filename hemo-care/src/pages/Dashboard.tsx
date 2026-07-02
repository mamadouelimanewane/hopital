import {
  Users, CalendarCheck, Cpu, Gauge, ArrowRight, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStore';

const weeklyData = [
  { day: 'Lun', planifiees: 18, realisees: 17 },
  { day: 'Mar', planifiees: 20, realisees: 19 },
  { day: 'Mer', planifiees: 16, realisees: 16 },
  { day: 'Jeu', planifiees: 19, realisees: 18 },
  { day: 'Ven', planifiees: 21, realisees: 20 },
  { day: 'Sam', planifiees: 14, realisees: 13 },
  { day: 'Dim', planifiees: 10, realisees: 10 },
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

const statutColors: Record<string, string> = {
  'Disponible': '#10b981',
  'Occupé': '#0ea5e9',
  'Maintenance': '#f59e0b',
};

const seanceStatutBadge: Record<string, string> = {
  'Planifiée': 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  'En cours':  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Terminée':  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Annulée':   'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { patients, seances, generateurs } = useDataStore();

  const patientsActifs = patients.filter(p => p.statut === 'Actif').length;
  const today = '2026-07-02';
  const seancesAujourdhui = seances.filter(s => s.date === today);
  const generateursDisponibles = generateurs.filter(g => g.statut === 'Disponible').length;
  const tauxOccupation = Math.round(
    (generateurs.filter(g => g.statut === 'Occupé').length / (generateurs.length || 1)) * 100
  );

  const kpis = [
    { label: 'Patients Actifs',        value: String(patientsActifs), delta: '+2', up: true,  icon: Users,        color: 'sky' },
    { label: "Séances Aujourd'hui",    value: String(seancesAujourdhui.length), delta: '+1', up: true, icon: CalendarCheck, color: 'emerald' },
    { label: 'Générateurs Disponibles',value: String(generateursDisponibles), delta: '-1', up: false, icon: Cpu, color: 'blue' },
    { label: "Taux d'Occupation",      value: `${tauxOccupation}%`, delta: '+5%', up: true,  icon: Gauge,        color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    sky: 'text-sky-400 bg-sky-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };

  const pieData = ['Disponible', 'Occupé', 'Maintenance'].map(statut => ({
    name: statut,
    value: generateurs.filter(g => g.statut === statut).length,
    color: statutColors[statut],
  }));

  const recentSeances = [...seances]
    .sort((a, b) => (b.date + b.heure).localeCompare(a.date + a.heure))
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-1">
            Centre d'Hémodialyse · <span className="text-sky-400">Hôpital Ndamatou, Touba</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-medium text-sky-400">Live · Mis à jour à l'instant</span>
          </div>
          <button onClick={() => navigate('/planning')} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/40 hover:shadow-sky-900/60 active:scale-95">
            <CalendarCheck size={16} />
            Voir le planning
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
              <h2 className="text-base font-semibold text-white">Activité de la semaine</h2>
              <p className="text-xs text-slate-500 mt-0.5">Séances planifiées vs réalisées</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-500" /><span className="text-slate-400">Planifiées</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-slate-400">Réalisées</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gPlanifiees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gRealisees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="planifiees" stroke="#0ea5e9" strokeWidth={2} fill="url(#gPlanifiees)" dot={false} activeDot={{ r: 4, fill: '#0ea5e9' }} />
              <Area type="monotone" dataKey="realisees" stroke="#10b981" strokeWidth={2} fill="url(#gRealisees)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie générateurs */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass border border-slate-700/40 flex-1">
            <h2 className="text-sm font-semibold text-white mb-4">État des générateurs ({generateurs.length})</h2>
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
        </div>
      </div>

      {/* Recent séances */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <h2 className="text-sm font-semibold text-white">Séances récentes</h2>
          </div>
          <Link to="/planning" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
        </div>
        <div className="space-y-2">
          {recentSeances.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700/50 transition-all">
              <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center text-[11px] font-bold text-sky-400 flex-shrink-0">
                {s.patientNom.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{s.patientNom}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.date} à {s.heure} · {s.generateurId}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${seanceStatutBadge[s.statut]}`}>
                {s.statut}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

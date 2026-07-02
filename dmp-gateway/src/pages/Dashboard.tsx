import {
  Activity, CheckCircle2, Cable, Clock, FolderKanban,
  TrendingUp, TrendingDown, ArrowRight, AlertTriangle
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell,
} from 'recharts';
import { Link } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStore';

const hourlyData = [
  { heure: '00h', volume: 4 },
  { heure: '03h', volume: 2 },
  { heure: '06h', volume: 6 },
  { heure: '09h', volume: 22 },
  { heure: '12h', volume: 18 },
  { heure: '15h', volume: 25 },
  { heure: '18h', volume: 14 },
  { heure: '21h', volume: 8 },
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
  const { dossiers, connecteurs, logs } = useDataStore();

  const synchronises = dossiers.filter(d => d.statutSynchro === 'Synchronisé').length;
  const actifs = connecteurs.filter(c => c.statut === 'Actif').length;
  const disponibilite = connecteurs.length ? Math.round((actifs / connecteurs.length) * 1000) / 10 : 0;
  const derniereSynchro = [...logs].sort((a, b) => b.date.localeCompare(a.date))[0];

  const pieData = [
    { name: 'Actif',   value: connecteurs.filter(c => c.statut === 'Actif').length,   color: '#10b981' },
    { name: 'Inactif', value: connecteurs.filter(c => c.statut === 'Inactif').length, color: '#64748b' },
    { name: 'Erreur',  value: connecteurs.filter(c => c.statut === 'Erreur').length,  color: '#f43f5e' },
  ];

  const kpis = [
    { label: 'Dossiers Synchronisés', value: `${synchronises}/${dossiers.length}`, delta: '+3 aujourd\'hui', up: true, icon: FolderKanban, color: 'emerald' },
    { label: 'Connecteurs Actifs',    value: `${actifs}/${connecteurs.length}`,     delta: 'Stable',          up: true, icon: Cable,        color: 'blue' },
    { label: 'Disponibilité Réseau',  value: `${disponibilite}%`,                   delta: '+0.4%',           up: true, icon: Activity,     color: 'purple' },
    { label: 'Dernière Synchro',      value: derniereSynchro ? derniereSynchro.date.split(',')[1]?.trim() ?? derniereSynchro.date : '—', delta: derniereSynchro?.connecteurNom.split('—')[1]?.trim() ?? '', up: true, icon: Clock, color: 'rose' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };

  const recentLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-1">
            Vue temps réel · <span className="text-emerald-400">Hôpital Ndamatou Touba — Réseau National</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Live · Mis à jour il y a 5s</span>
          </div>
          <Link to="/journal" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 active:scale-95">
            <CheckCircle2 size={16} />
            Voir le journal
          </Link>
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
              <span className={`text-xs font-semibold ${kpi.up ? 'text-emerald-400' : 'text-rose-400'} truncate`}>{kpi.delta}</span>
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
              <h2 className="text-base font-semibold text-white">Volume de synchronisation (24h)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Nombre de dossiers synchronisés par tranche horaire</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-slate-400">Volume</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="heure" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} fill="url(#gVolume)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass border border-slate-700/40 flex-1">
            <h2 className="text-sm font-semibold text-white mb-4">Statut des connecteurs</h2>
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
            <h2 className="text-sm font-semibold text-white mb-4">Hôpitaux les plus actifs</h2>
            <div className="space-y-3">
              {Array.from(new Set(dossiers.map(d => d.hopitalOrigine))).slice(0, 4).map(hopital => {
                const count = dossiers.filter(d => d.hopitalOrigine === hopital).length;
                const pct = Math.round((count / dossiers.length) * 100);
                return (
                  <div key={hopital}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 truncate">{hopital}</span>
                      <span className="font-semibold text-emerald-400">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent sync log */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-semibold text-white">Journal de synchronisation récent</h2>
          </div>
          <Link to="/journal" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
        </div>
        <div className="space-y-2">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer group">
              <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                log.statut === 'Échec' ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                {log.statut === 'Échec' ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{log.connecteurNom}</p>
                <p className="text-xs text-slate-500 mt-0.5">{log.message} · {log.date}</p>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors mt-1 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

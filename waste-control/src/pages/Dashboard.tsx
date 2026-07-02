import {
  Scale, Package, ShieldCheck, Flame,
  TrendingUp, TrendingDown, ArrowRight, Trash2
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStore';

const weeklyData = [
  { day: 'Lun', infectieux: 22, piquant: 8, chimique: 5, menager: 30 },
  { day: 'Mar', infectieux: 18, piquant: 6, chimique: 4, menager: 28 },
  { day: 'Mer', infectieux: 26, piquant: 9, chimique: 3, menager: 32 },
  { day: 'Jeu', infectieux: 20, piquant: 7, chimique: 6, menager: 29 },
  { day: 'Ven', infectieux: 24, piquant: 10, chimique: 5, menager: 35 },
  { day: 'Sam', infectieux: 14, piquant: 4, chimique: 2, menager: 20 },
  { day: 'Dim', infectieux: 11, piquant: 3, chimique: 1, menager: 18 },
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
  const { collectes, containers, destructions } = useDataStore();

  const kgCollectesSemaine = collectes.reduce((s, c) => s + c.poidsKg, 0).toFixed(1);
  const containersPleins = containers.filter(c => c.niveauRemplissagePct > 80).length;
  const totalDetruit = collectes.filter(c => c.statut === 'Détruit').length;
  const tauxConformite = collectes.length
    ? Math.round((collectes.filter(c => c.statut !== 'En attente').length / collectes.length) * 100)
    : 100;
  const incinerationsMois = destructions.length;

  const kpis = [
    { label: 'Kg Collectés cette Semaine', value: `${kgCollectesSemaine} kg`, delta: '+8.2%', up: false, icon: Scale, color: 'lime' },
    { label: 'Containers > 80% Pleins', value: String(containersPleins), delta: containersPleins > 0 ? 'Attention' : 'OK', up: containersPleins === 0, icon: Package, color: 'rose' },
    { label: 'Taux de Conformité', value: `${tauxConformite}%`, delta: '+2.1%', up: true, icon: ShieldCheck, color: 'emerald' },
    { label: 'Incinérations ce Mois', value: String(incinerationsMois), delta: '+1', up: true, icon: Flame, color: 'orange' },
  ];

  const colorMap: Record<string, string> = {
    lime: 'text-lime-400 bg-lime-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
  };

  const pieData = [
    { name: 'DASRI Infectieux', value: collectes.filter(c => c.typeDechet === 'DASRI Infectieux').reduce((s, c) => s + c.poidsKg, 0), color: '#f43f5e' },
    { name: 'DASRI Piquant-Coupant', value: collectes.filter(c => c.typeDechet === 'DASRI Piquant-Coupant').reduce((s, c) => s + c.poidsKg, 0), color: '#f59e0b' },
    { name: 'Pharmaceutique', value: collectes.filter(c => c.typeDechet === 'Pharmaceutique').reduce((s, c) => s + c.poidsKg, 0), color: '#a855f7' },
    { name: 'Chimique', value: collectes.filter(c => c.typeDechet === 'Chimique').reduce((s, c) => s + c.poidsKg, 0), color: '#3b82f6' },
    { name: 'Assimilé Ménager', value: collectes.filter(c => c.typeDechet === 'Assimilé Ménager').reduce((s, c) => s + c.poidsKg, 0), color: '#84cc16' },
  ].filter(d => d.value > 0);

  const recentCollectes = [...collectes]
    .sort((a, b) => b.dateCollecte.localeCompare(a.dateCollecte))
    .slice(0, 5);

  const statutColor: Record<string, string> = {
    'En attente': 'bg-amber-500/15 text-amber-400',
    'Collecté':   'bg-blue-500/15 text-blue-400',
    'Stocké':     'bg-purple-500/15 text-purple-400',
    'Détruit':    'bg-emerald-500/15 text-emerald-400',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-1">
            Vue temps réel · <span className="text-lime-400">Hôpital Ndamatou, Touba</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-lime-500/10 border border-lime-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span className="text-xs font-medium text-lime-400">Live · Mis à jour il y a 5s</span>
          </div>
          <button onClick={() => navigate('/conformite')} className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-lime-900/40 hover:shadow-lime-900/60 active:scale-95">
            <ShieldCheck size={16} />
            Rapport de Conformité
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
              <h2 className="text-base font-semibold text-white">Volume hebdomadaire de collecte</h2>
              <p className="text-xs text-slate-500 mt-0.5">Répartition par type de déchet (kg)</p>
            </div>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-slate-400">Infectieux</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-slate-400">Piquant</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-lime-500" /><span className="text-slate-400">Ménager</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gInfectieux" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPiquant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gMenager" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84cc16" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="infectieux" stroke="#f43f5e" strokeWidth={2} fill="url(#gInfectieux)" dot={false} activeDot={{ r: 4, fill: '#f43f5e' }} />
              <Area type="monotone" dataKey="piquant" stroke="#f59e0b" strokeWidth={2} fill="url(#gPiquant)" dot={false} activeDot={{ r: 4, fill: '#f59e0b' }} />
              <Area type="monotone" dataKey="menager" stroke="#84cc16" strokeWidth={2} fill="url(#gMenager)" dot={false} activeDot={{ r: 4, fill: '#84cc16' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie + Containers */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass border border-slate-700/40 flex-1">
            <h2 className="text-sm font-semibold text-white mb-4">Répartition par type (kg)</h2>
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
                    <span className="text-xs font-bold text-slate-200">{item.value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass border border-slate-700/40">
            <h2 className="text-sm font-semibold text-white mb-4">Remplissage containers critiques</h2>
            <div className="space-y-3">
              {containers.filter(c => c.niveauRemplissagePct > 60).slice(0, 5).map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{c.zone}</span>
                    <span className={`font-semibold ${c.niveauRemplissagePct >= 80 ? 'text-rose-400' : 'text-amber-400'}`}>{c.niveauRemplissagePct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${c.niveauRemplissagePct >= 80 ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${c.niveauRemplissagePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent collectes + Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent collectes */}
        <div className="p-5 rounded-2xl glass border border-slate-700/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trash2 size={15} className="text-lime-400" />
              <h2 className="text-sm font-semibold text-white">Collectes récentes</h2>
            </div>
            <Link to="/collectes" className="text-xs text-lime-400 hover:text-lime-300 flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {recentCollectes.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer group">
                <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${statutColor[c.statut]}`}>
                  <Trash2 size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{c.typeDechet} · {c.poidsKg} kg</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.zone} · {c.dateCollecte}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${statutColor[c.statut]}`}>{c.statut}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart: kg by zone */}
        <div className="p-5 rounded-2xl glass border border-slate-700/40">
          <h2 className="text-sm font-semibold text-white mb-1">Poids par zone de collecte</h2>
          <p className="text-xs text-slate-500 mb-4">Cumul des kg collectés</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={Object.entries(
                collectes.reduce<Record<string, number>>((acc, c) => {
                  const short = c.zone.split(' ').slice(0, 2).join(' ');
                  acc[short] = (acc[short] || 0) + c.poidsKg;
                  return acc;
                }, {})
              ).map(([zone, kg]) => ({ zone, kg: Number(kg.toFixed(1)) }))}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              barCategoryGap="35%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="zone" fontSize={9} stroke="#475569" tickLine={false} axisLine={false} />
              <YAxis fontSize={10} stroke="#475569" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kg" fill="#84cc16" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

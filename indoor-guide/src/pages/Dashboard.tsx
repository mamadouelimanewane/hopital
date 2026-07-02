import {
  Users, Ticket, ParkingSquare, Route as RouteIcon,
  TrendingUp, TrendingDown, ArrowRight, Clock
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStore';

const hourlyFlow = [
  { hour: '07h', visiteurs: 4 },
  { hour: '08h', visiteurs: 12 },
  { hour: '09h', visiteurs: 22 },
  { hour: '10h', visiteurs: 30 },
  { hour: '11h', visiteurs: 26 },
  { hour: '12h', visiteurs: 15 },
  { hour: '13h', visiteurs: 10 },
  { hour: '14h', visiteurs: 24 },
  { hour: '15h', visiteurs: 28 },
  { hour: '16h', visiteurs: 18 },
  { hour: '17h', visiteurs: 9 },
];

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];

const colorMap: Record<string, string> = {
  blue:    'text-blue-400 bg-blue-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  amber:   'text-amber-400 bg-amber-500/10',
  purple:  'text-purple-400 bg-purple-500/10',
};

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
  const { visiteurs, placesParking } = useDataStore();

  const visiteursPresents = visiteurs.filter(v => v.statut === 'En visite').length;
  const badgesActifs = visiteurs.filter(v => v.statut === 'En visite').length;
  const placesLibres = placesParking.filter(p => p.statut === 'Libre').length;
  const itinerairesGeneres = 17; // simulé

  const kpis = [
    { label: 'Visiteurs Présents', value: String(visiteursPresents), delta: '+3', up: true, icon: Users, color: 'blue' },
    { label: 'Badges Actifs', value: String(badgesActifs), delta: '+2', up: true, icon: Ticket, color: 'emerald' },
    { label: 'Places Parking Libres', value: String(placesLibres), delta: '-1', up: false, icon: ParkingSquare, color: 'amber' },
    { label: 'Itinéraires Générés (jour)', value: String(itinerairesGeneres), delta: '+5', up: true, icon: RouteIcon, color: 'purple' },
  ];

  const serviceCounts = visiteurs.reduce<Record<string, number>>((acc, v) => {
    acc[v.serviceVisite] = (acc[v.serviceVisite] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(serviceCounts).map(([name, value], i) => ({
    name, value, color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const recentVisiteurs = [...visiteurs].sort((a, b) => b.heureEntree.localeCompare(a.heureEntree)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-1">
            Vue temps réel · <span className="text-blue-400">Hôpital Ndamatou de Touba</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-blue-400">Live · Mis à jour il y a 5s</span>
          </div>
          <button onClick={() => navigate('/itineraires')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 active:scale-95">
            <RouteIcon size={16} />
            Générer Itinéraire
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
              <span className="text-xs text-slate-600">vs hier</span>
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
              <h2 className="text-base font-semibold text-white">Flux horaire des visiteurs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Nombre de visiteurs enregistrés par heure</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-slate-400">Visiteurs</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hourlyFlow} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gVisiteurs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hour" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="visiteurs" stroke="#3b82f6" strokeWidth={2} fill="url(#gVisiteurs)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: répartition par service */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass border border-slate-700/40 flex-1">
            <h2 className="text-sm font-semibold text-white mb-4">Répartition par service</h2>
            <div className="flex items-center gap-4">
              <PieChart width={110} height={110}>
                <Pie data={pieData} cx={50} cy={50} innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="space-y-2 flex-1">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                      <span className="text-xs text-slate-400 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent visiteurs */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Visiteurs récents</h2>
          </div>
          <Link to="/visiteurs" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
        </div>
        <div className="space-y-2">
          {recentVisiteurs.map((v) => (
            <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer group">
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${v.statut === 'En visite' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-600/20 text-slate-400'}`}>
                <Users size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{v.nom} <span className="text-slate-500 font-normal">· Badge {v.badgeNumero}</span></p>
                <p className="text-xs text-slate-500 mt-0.5">{v.serviceVisite} · Visite à {v.patientVisite} · {v.heureEntree}{v.heureSortie ? ` – ${v.heureSortie}` : ''}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${v.statut === 'En visite' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-600/20 text-slate-400'}`}>
                {v.statut}
              </span>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

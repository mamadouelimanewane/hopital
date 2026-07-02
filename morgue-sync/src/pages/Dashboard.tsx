import {
  Snowflake, FileClock, Truck, Clock, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Link } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStore';

const weeklyAdmissions = [
  { day: 'Lun', admissions: 2 },
  { day: 'Mar', admissions: 1 },
  { day: 'Mer', admissions: 3 },
  { day: 'Jeu', admissions: 1 },
  { day: 'Ven', admissions: 2 },
  { day: 'Sam', admissions: 0 },
  { day: 'Dim', admissions: 1 },
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
  const { casiers, demarches, defunts } = useDataStore();

  const casiersOccupes = casiers.filter(c => c.statut === 'Occupé').length;
  const totalCasiers = casiers.length;
  const demarchesEnAttente = demarches.filter(d => d.statut === 'En attente').length;
  const today = new Date().toISOString().slice(0, 10);
  const transfertsAujourdhui = demarches.filter(d => d.type === 'Autorisation de transfert' && d.dateEmission === today).length;

  const kpis = [
    { label: 'Casiers Occupés', value: `${casiersOccupes}/${totalCasiers}`, icon: Snowflake, color: 'slate' },
    { label: 'Démarches en Attente', value: String(demarchesEnAttente), icon: FileClock, color: 'amber' },
    { label: "Transferts Aujourd'hui", value: String(transfertsAujourdhui), icon: Truck, color: 'blue' },
    { label: 'Temps Moyen de Traitement', value: '2j 4h', icon: Clock, color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    slate: 'text-slate-300 bg-slate-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    teal: 'text-teal-400 bg-teal-500/10',
  };

  const pieData = [
    { name: 'Libre', value: casiers.filter(c => c.statut === 'Libre').length, color: '#10b981' },
    { name: 'Occupé', value: casiers.filter(c => c.statut === 'Occupé').length, color: '#94a3b8' },
    { name: 'Maintenance', value: casiers.filter(c => c.statut === 'Maintenance').length, color: '#f59e0b' },
  ];

  const recentDemarches = [...demarches]
    .sort((a, b) => (b.dateEmission || '9999').localeCompare(a.dateEmission || '9999'))
    .slice(0, 5);

  const statutStyle: Record<string, string> = {
    'En attente': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'En cours':   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'Émise':      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-1">
            Vue d'ensemble · <span className="text-slate-300">{defunts.length} dossiers actifs</span>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`p-5 rounded-2xl glass border border-slate-700/40 stagger-${i + 1} animate-fade-in-up`}
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
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Bar Chart admissions */}
        <div className="xl:col-span-2 p-5 rounded-2xl glass border border-slate-700/40">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Admissions de la semaine</h2>
              <p className="text-xs text-slate-500 mt-0.5">Nombre de nouvelles admissions à la morgue</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyAdmissions} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="admissions" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie casiers */}
        <div className="p-5 rounded-2xl glass border border-slate-700/40">
          <h2 className="text-sm font-semibold text-white mb-4">État des casiers ({totalCasiers} unités)</h2>
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

      {/* Recent démarches */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Démarches récentes</h2>
          <Link to="/demarches" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
        </div>
        <div className="space-y-2">
          {recentDemarches.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{d.type}</p>
                <p className="text-xs text-slate-500 mt-0.5">{d.defuntNom} · {d.responsable}</p>
              </div>
              <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statutStyle[d.statut]}`}>
                {d.statut}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

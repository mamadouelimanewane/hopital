import {
  ShoppingCart, AlertTriangle, CheckCircle2, Coins,
  TrendingUp, TrendingDown, ArrowRight
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStore';

const monthlySpend = [
  { month: 'Fév', Alimentation: 2100000, Blanchisserie: 900000, Fournitures: 400000 },
  { month: 'Mar', Alimentation: 2400000, Blanchisserie: 1200000, Fournitures: 350000 },
  { month: 'Avr', Alimentation: 2250000, Blanchisserie: 800000, Fournitures: 500000 },
  { month: 'Mai', Alimentation: 2600000, Blanchisserie: 1500000, Fournitures: 420000 },
  { month: 'Jun', Alimentation: 2850000, Blanchisserie: 2400000, Fournitures: 480000 },
  { month: 'Jul', Alimentation: 2500000, Blanchisserie: 1125000, Fournitures: 375000 },
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
            <span className="font-medium text-slate-200">{Number(entry.value).toLocaleString('fr-FR')} FCFA</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { commandes, livraisons, stocks } = useDataStore();

  const commandesEnCours = commandes.filter(c => c.statut === 'Envoyée' || c.statut === 'Confirmée').length;
  const rupturesJ0 = stocks.filter(s => s.quantite < s.quantiteMin).length;
  const livraisonsConformes = livraisons.filter(l => l.conforme).length;
  const tauxConformite = livraisons.length > 0 ? Math.round((livraisonsConformes / livraisons.length) * 100) : 0;

  const now = new Date();
  const depenseMois = commandes
    .filter(c => {
      const d = new Date(c.dateCommande);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && c.statut !== 'Annulée';
    })
    .reduce((sum, c) => sum + c.montantFcfa, 0);

  const kpis = [
    { label: 'Commandes en Cours', value: String(commandesEnCours), delta: '+2', up: false, icon: ShoppingCart, color: 'amber' },
    { label: 'Ruptures J-0', value: String(rupturesJ0), delta: rupturesJ0 > 0 ? 'Attention' : 'OK', up: rupturesJ0 === 0, icon: AlertTriangle, color: 'rose' },
    { label: 'Taux Conformité Livraisons', value: `${tauxConformite}%`, delta: tauxConformite >= 80 ? '+3%' : '-5%', up: tauxConformite >= 80, icon: CheckCircle2, color: 'emerald' },
    { label: 'Dépense du Mois', value: `${depenseMois.toLocaleString('fr-FR')} FCFA`, delta: '+8%', up: false, icon: Coins, color: 'blue' },
  ];

  const colorMap: Record<string, string> = {
    amber: 'text-amber-400 bg-amber-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
  };

  // Répartition dépenses par catégorie (basé sur les commandes non annulées)
  const categoryTotals: Record<string, number> = {};
  commandes.filter(c => c.statut !== 'Annulée').forEach(c => {
    categoryTotals[c.fournisseurNom] = (categoryTotals[c.fournisseurNom] || 0) + c.montantFcfa;
  });
  const totalSpend = monthlySpend.reduce((s, m) => s + m.Alimentation + m.Blanchisserie + m.Fournitures, 0);
  const pieData = [
    { name: 'Alimentation', value: monthlySpend.reduce((s, m) => s + m.Alimentation, 0), color: '#eab308' },
    { name: 'Blanchisserie', value: monthlySpend.reduce((s, m) => s + m.Blanchisserie, 0), color: '#3b82f6' },
    { name: 'Fournitures', value: monthlySpend.reduce((s, m) => s + m.Fournitures, 0), color: '#f43f5e' },
  ].map(p => ({ ...p, pct: Math.round((p.value / totalSpend) * 100) }));

  const recentCommandes = [...commandes]
    .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
    .slice(0, 5);

  const statutColors: Record<string, string> = {
    'Brouillon': 'bg-slate-500/15 text-slate-400',
    'Envoyée': 'bg-blue-500/15 text-blue-400',
    'Confirmée': 'bg-amber-500/15 text-amber-400',
    'Livrée': 'bg-emerald-500/15 text-emerald-400',
    'Annulée': 'bg-rose-500/15 text-rose-400',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-1">
            Vue temps réel · <span className="text-amber-400">Hôpital Ndamatou, Touba</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-amber-400">Live · Mis à jour à l'instant</span>
          </div>
          <button onClick={() => navigate('/commandes')} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-900/40 hover:shadow-amber-900/60 active:scale-95">
            <ShoppingCart size={16} />
            Nouvelle Commande
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
              <span className="text-xs text-slate-600">vs mois passé</span>
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
              <h2 className="text-base font-semibold text-white">Dépenses mensuelles par catégorie</h2>
              <p className="text-xs text-slate-500 mt-0.5">Évolution des dépenses sur 6 mois (FCFA)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-slate-400">Alimentation</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-slate-400">Blanchisserie</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-slate-400">Fournitures</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlySpend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gAlim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBlan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gFourn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Alimentation" stroke="#eab308" strokeWidth={2} fill="url(#gAlim)" dot={false} activeDot={{ r: 4, fill: '#eab308' }} />
              <Area type="monotone" dataKey="Blanchisserie" stroke="#3b82f6" strokeWidth={2} fill="url(#gBlan)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="Fournitures" stroke="#f43f5e" strokeWidth={2} fill="url(#gFourn)" dot={false} activeDot={{ r: 4, fill: '#f43f5e' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass border border-slate-700/40 flex-1">
            <h2 className="text-sm font-semibold text-white mb-4">Répartition des dépenses par catégorie</h2>
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
                    <span className="text-xs font-bold text-slate-200">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass border border-slate-700/40">
            <h2 className="text-sm font-semibold text-white mb-4">État des stocks non-médicaux</h2>
            <div className="space-y-3">
              {stocks.slice(0, 4).map((s) => {
                const pct = Math.min(100, Math.round((s.quantite / (s.quantiteMin * 2)) * 100));
                const critical = s.quantite < s.quantiteMin;
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{s.article}</span>
                      <span className={`font-semibold ${critical ? 'text-rose-400' : 'text-emerald-400'}`}>{s.quantite} {s.unite}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${critical ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent commandes */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Commandes récentes</h2>
          <Link to="/commandes" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">Voir tout <ArrowRight size={12} /></Link>
        </div>
        <div className="space-y-2">
          {recentCommandes.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer group">
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 flex-shrink-0">
                <ShoppingCart size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{c.id} · {c.fournisseurNom}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{c.articles}</p>
              </div>
              <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">{c.montantFcfa.toLocaleString('fr-FR')} FCFA</span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap ${statutColors[c.statut]}`}>{c.statut}</span>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

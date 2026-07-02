import { Shirt, ArrowDownCircle, ArrowUpCircle, PackageCheck } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDataStore } from '../contexts/DataStore';

const weeklyFlow = [
  { day: 'Lun', propre: 120, sale: 95 },
  { day: 'Mar', propre: 105, sale: 130 },
  { day: 'Mer', propre: 140, sale: 110 },
  { day: 'Jeu', propre: 98, sale: 125 },
  { day: 'Ven', propre: 160, sale: 140 },
  { day: 'Sam', propre: 80, sale: 60 },
  { day: 'Dim', propre: 55, sale: 45 },
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
            <span className="font-medium text-slate-200">{entry.value} unités</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Blanchisserie() {
  const { stocks } = useDataStore();
  const lingeStocks = stocks.filter(s => s.categorie === 'Linge');

  const totalPropre = weeklyFlow.reduce((s, d) => s + d.propre, 0);
  const totalSale = weeklyFlow.reduce((s, d) => s + d.sale, 0);
  const tauxTraitement = Math.round((totalPropre / totalSale) * 100);

  const kpis = [
    { label: 'Linge Propre (7j)', value: `${totalPropre}`, icon: ArrowUpCircle, color: 'emerald' },
    { label: 'Linge Sale Collecté (7j)', value: `${totalSale}`, icon: ArrowDownCircle, color: 'rose' },
    { label: 'Taux de Traitement', value: `${tauxTraitement}%`, icon: PackageCheck, color: 'amber' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Shirt className="text-amber-400" size={24} /> Blanchisserie
        </h1>
        <p className="text-sm text-slate-400 mt-1">Suivi du flux de linge propre / sale de l'hôpital.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-5 rounded-2xl glass border border-slate-700/40">
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

      {/* Mini chart */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Flux hebdomadaire (linge propre vs sale)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Unités traitées par jour</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-slate-400">Propre</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-slate-400">Sale</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyFlow} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="day" fontSize={11} stroke="#475569" tickLine={false} axisLine={false} />
            <YAxis fontSize={11} stroke="#475569" tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="propre" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sale" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock linge */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <h2 className="text-sm font-semibold text-white mb-4">Stock de linge disponible</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">Article</th>
                <th className="px-4 py-3 font-semibold">Quantité</th>
                <th className="px-4 py-3 font-semibold">Seuil Min</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {lingeStocks.map((s) => {
                const critical = s.quantite < s.quantiteMin;
                return (
                  <tr key={s.id} className="border-b border-slate-800/50">
                    <td className="px-4 py-3 text-slate-200 font-medium">{s.article}</td>
                    <td className="px-4 py-3 text-slate-300">{s.quantite} {s.unite}</td>
                    <td className="px-4 py-3 text-slate-400">{s.quantiteMin} {s.unite}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${critical ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                        {critical ? 'Réassort requis' : 'Suffisant'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

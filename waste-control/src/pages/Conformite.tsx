import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Line, LineChart, Legend,
} from 'recharts';
import { ShieldCheck, Download, AlertTriangle, CheckCircle2, FileBarChart, Scale } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

const monthlyTonnage = [
  { mois: 'Fév', tonnage: 2.1, seuil: 3.0 },
  { mois: 'Mar', tonnage: 2.4, seuil: 3.0 },
  { mois: 'Avr', tonnage: 2.8, seuil: 3.0 },
  { mois: 'Mai', tonnage: 3.2, seuil: 3.0 },
  { mois: 'Jun', tonnage: 2.6, seuil: 3.0 },
  { mois: 'Jul', tonnage: 1.1, seuil: 3.0 },
];

const conformiteTrend = [
  { mois: 'Fév', taux: 92 },
  { mois: 'Mar', taux: 94 },
  { mois: 'Avr', taux: 91 },
  { mois: 'Mai', taux: 88 },
  { mois: 'Jun', taux: 96 },
  { mois: 'Jul', taux: 97 },
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

export default function Conformite() {
  const { collectes, destructions } = useDataStore();

  const tauxTraçabilite = collectes.length
    ? Math.round((collectes.filter(c => c.statut === 'Détruit' || c.statut === 'Stocké').length / collectes.length) * 100)
    : 100;

  const delaiMoyen = 18; // heures — placeholder réaliste
  const seuilRespect = monthlyTonnage.every(m => m.tonnage <= m.seuil * 1.1);

  const reportCards = [
    { label: 'Traçabilité complète', value: `${tauxTraçabilite}%`, ok: tauxTraçabilite >= 90, icon: ShieldCheck },
    { label: 'Délai moyen collecte→destruction', value: `${delaiMoyen}h`, ok: delaiMoyen <= 48, icon: Scale },
    { label: 'Respect seuils réglementaires', value: seuilRespect ? 'Conforme' : 'Non conforme', ok: seuilRespect, icon: CheckCircle2 },
    { label: 'Certificats émis', value: String(destructions.length), ok: true, icon: FileBarChart },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Rapport de Conformité</h1>
          <p className="text-sm text-slate-400 mt-1">
            Normes environnementales et réglementaires · <span className="text-lime-400">DASRI — Hôpital Ndamatou</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-lime-900/30 active:scale-95">
          <Download size={16} />
          Exporter le rapport
        </button>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((r, i) => (
          <div key={r.label} className={`p-5 rounded-2xl glass border border-slate-700/40 stagger-${i + 1} animate-fade-in-up`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${r.ok ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                <r.icon size={18} className={r.ok ? 'text-emerald-400' : 'text-rose-400'} />
              </div>
              {r.ok
                ? <CheckCircle2 size={16} className="text-emerald-400" />
                : <AlertTriangle size={16} className="text-rose-400" />
              }
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{r.label}</p>
            <p className="text-xl font-bold text-white mt-1">{r.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl glass border border-slate-700/40">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">Tonnage mensuel vs seuil réglementaire</h2>
            <p className="text-xs text-slate-500 mt-0.5">Comparaison des volumes DASRI produits par rapport à la limite autorisée (tonnes)</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTonnage} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="mois" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="tonnage" name="Tonnage produit" fill="#84cc16" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="seuil" name="Seuil réglementaire" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl glass border border-slate-700/40">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">Évolution du taux de conformité</h2>
            <p className="text-xs text-slate-500 mt-0.5">Traçabilité et respect des délais réglementaires (%)</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={conformiteTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="mois" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[80, 100]} stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="taux" name="Taux de conformité" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed report */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <h2 className="text-sm font-semibold text-white mb-4">Synthèse réglementaire</h2>
        <div className="space-y-3 text-sm text-slate-400">
          <p>
            <span className="text-slate-200 font-medium">Norme applicable :</span> Gestion des Déchets d'Activités de Soins à Risque Infectieux (DASRI),
            conformément aux directives du Ministère de la Santé et de l'Action Sociale du Sénégal et aux recommandations de l'OMS.
          </p>
          <p>
            <span className="text-slate-200 font-medium">Séparation à la source :</span> Les déchets sont triés dès leur production selon 5 catégories
            (Infectieux, Piquant-Coupant, Pharmaceutique, Chimique, Assimilé Ménager) avec code couleur dédié par filière.
          </p>
          <p>
            <span className="text-slate-200 font-medium">Traçabilité :</span> Chaque unité de déchet est identifiée par un code-barres unique, suivi du point
            de collecte jusqu'à la destruction finale, avec émission d'un certificat d'incinération.
          </p>
          <p>
            <span className="text-slate-200 font-medium">Délai maximal de stockage :</span> 48 heures pour les déchets infectieux, conformément aux bonnes
            pratiques hospitalières régionales.
          </p>
        </div>
      </div>
    </div>
  );
}

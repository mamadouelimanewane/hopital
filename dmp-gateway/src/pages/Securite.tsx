import { ShieldCheck, Lock, Eye, AlertCircle, KeyRound } from 'lucide-react';
import { useDataStore } from '../contexts/DataStore';

interface AccessLog {
  id: string;
  utilisateur: string;
  role: string;
  dossierConsulte: string;
  date: string;
  action: 'Lecture' | 'Écriture' | 'Export';
  chiffrement: 'AES-256' | 'TLS 1.3';
}

const accessLogs: AccessLog[] = [
  { id: 'ACC-501', utilisateur: 'Dr. Cheikh Anta Mbaye', role: 'Médecin',   dossierConsulte: 'DMP-1001 — Fatoumata Bâ',    date: '02 Jui. 2026, 09:12', action: 'Lecture',  chiffrement: 'AES-256' },
  { id: 'ACC-502', utilisateur: 'Aïssatou Kane',          role: 'DIM',      dossierConsulte: 'DMP-1004 — Mor Talla Diop',  date: '02 Jui. 2026, 08:47', action: 'Export',   chiffrement: 'TLS 1.3' },
  { id: 'ACC-503', utilisateur: 'Moussa Sarr',            role: 'Référent', dossierConsulte: 'DMP-1008 — Modou Lô',        date: '02 Jui. 2026, 08:20', action: 'Lecture',  chiffrement: 'AES-256' },
  { id: 'ACC-504', utilisateur: 'Dr. Cheikh Anta Mbaye', role: 'Médecin',   dossierConsulte: 'DMP-1002 — Ousmane Diagne',  date: '01 Jui. 2026, 22:05', action: 'Écriture', chiffrement: 'AES-256' },
  { id: 'ACC-505', utilisateur: 'Admin DMP-Gateway',      role: 'Admin',    dossierConsulte: 'DMP-1005 — Coumba Ndoye',    date: '01 Jui. 2026, 18:10', action: 'Lecture',  chiffrement: 'TLS 1.3' },
  { id: 'ACC-506', utilisateur: 'Aïssatou Kane',          role: 'DIM',      dossierConsulte: 'DMP-1010 — Babacar Fall',    date: '01 Jui. 2026, 17:30', action: 'Lecture',  chiffrement: 'AES-256' },
];

const actionColor: Record<AccessLog['action'], string> = {
  'Lecture': 'text-blue-400 bg-blue-500/10',
  'Écriture': 'text-amber-400 bg-amber-500/10',
  'Export': 'text-violet-400 bg-violet-500/10',
};

export default function Securite() {
  const { dossiers, connecteurs } = useDataStore();
  const chiffres = dossiers.filter(d => d.statutSynchro !== 'Erreur').length;

  const indicators = [
    { label: 'Chiffrement transport', value: 'TLS 1.3', icon: Lock, color: 'emerald' },
    { label: 'Chiffrement stockage',  value: 'AES-256', icon: KeyRound, color: 'blue' },
    { label: 'Dossiers protégés',     value: `${chiffres}/${dossiers.length}`, icon: ShieldCheck, color: 'purple' },
    { label: 'Connecteurs sécurisés', value: `${connecteurs.length}/${connecteurs.length}`, icon: Eye, color: 'rose' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Sécurité & Audit</h1>
        <p className="text-sm text-slate-400 mt-1">
          Traçabilité des accès aux dossiers médicaux partagés et statut du chiffrement
        </p>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map(ind => (
          <div key={ind.label} className="p-5 rounded-2xl glass border border-slate-700/40">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{ind.label}</p>
                <p className="text-xl font-bold text-white mt-1.5 tracking-tight">{ind.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${colorMap[ind.color]}`}>
                <ind.icon size={20} className={colorMap[ind.color].split(' ')[0]} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Encryption banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
        <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-400">Chiffrement bout en bout actif</p>
          <p className="text-xs text-slate-400 mt-1">Toutes les données en transit sont protégées par TLS 1.3 et les données au repos par AES-256. Conforme aux exigences de protection des données de santé.</p>
        </div>
      </div>

      {/* Access log table */}
      <div className="rounded-2xl glass border border-slate-700/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Journal des accès</h2>
          <p className="text-xs text-slate-500 mt-0.5">Qui a consulté quel dossier, et quand</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Utilisateur</th>
                <th className="px-5 py-3 font-medium">Rôle</th>
                <th className="px-5 py-3 font-medium">Dossier consulté</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Chiffrement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {accessLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-200">{log.utilisateur}</td>
                  <td className="px-5 py-3.5 text-slate-400">{log.role}</td>
                  <td className="px-5 py-3.5 text-slate-400">{log.dossierConsulte}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{log.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-semibold ${actionColor[log.action]}`}>{log.action}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                      <Lock size={11} /> {log.chiffrement}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/90">Les journaux d'accès sont conservés pendant 5 ans conformément à la réglementation sur les données de santé. Toute anomalie est signalée automatiquement à l'administrateur système.</p>
      </div>
    </div>
  );
}

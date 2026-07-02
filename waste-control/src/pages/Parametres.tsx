import { useState, useEffect } from 'react';
import { useAuth, roleLabels } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  User, Bell, Database, Info, Save,
  RotateCcw, Download, CheckCircle2, Shield,
} from 'lucide-react';

interface NotifPrefs {
  containerPlein: boolean;
  collecteEnAttente: boolean;
  certificatEmis: boolean;
  rapportMensuel: boolean;
  delaiAlerte: 'J-7' | 'J-3' | 'J-1';
}

const DEFAULT_PREFS: NotifPrefs = {
  containerPlein: true,
  collecteEnAttente: true,
  certificatEmis: true,
  rapportMensuel: true,
  delaiAlerte: 'J-3',
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-lime-500' : 'bg-slate-700'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}

const SECTIONS = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'donnees', label: 'Données', icon: Database },
  { id: 'apropos', label: 'À propos', icon: Info },
];

export default function Parametres() {
  const { user } = useAuth();
  const { push } = useNotifications();

  const [prefs, setPrefs] = useState<NotifPrefs>(() => {
    try {
      const stored = localStorage.getItem('wc_notif_prefs');
      return stored ? JSON.parse(stored) : DEFAULT_PREFS;
    } catch { return DEFAULT_PREFS; }
  });

  const [activeSection, setActiveSection] = useState('profil');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('wc_notif_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const handleSave = () => {
    setSaved(true);
    push({ type: 'success', title: 'Paramètres sauvegardés', message: 'Vos préférences ont été enregistrées avec succès.' });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser toutes les données aux valeurs initiales ? Cette action est irréversible.')) {
      const keysToRemove = ['wc_collectes', 'wc_containers', 'wc_destructions', 'wc_notif_prefs'];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      push({ type: 'warning', title: 'Données réinitialisées', message: 'Toutes les données ont été remises aux valeurs initiales. Rechargez la page.' });
    }
  };

  const handleExport = () => {
    const data = {
      collectes: JSON.parse(localStorage.getItem('wc_collectes') || '[]'),
      containers: JSON.parse(localStorage.getItem('wc_containers') || '[]'),
      destructions: JSON.parse(localStorage.getItem('wc_destructions') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waste-control-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    push({ type: 'info', title: 'Export terminé', message: 'Les données ont été exportées au format JSON.' });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-400 mt-1">Gérez votre profil et les préférences de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Nav */}
        <div className="lg:col-span-1">
          <div className="glass border border-slate-700/40 rounded-2xl p-2 space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === s.id ? 'bg-lime-500/15 text-lime-400' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profil' && user && (
            <div className="glass border border-slate-700/40 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white mb-5">Informations du profil</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center text-xl font-bold text-white">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield size={11} className="text-lime-400" />
                    <span className="text-xs text-lime-400 font-medium">{roleLabels[user.role]}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Département</label>
                  <input readOnly value={user.dept} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Identifiant</label>
                  <input readOnly value={user.id} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 font-mono" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="glass border border-slate-700/40 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Préférences de notification</h2>
              <div className="divide-y divide-slate-800">
                <Toggle checked={prefs.containerPlein} onChange={v => setPrefs(p => ({ ...p, containerPlein: v }))} label="Alerte container plein (>80%)" />
                <Toggle checked={prefs.collecteEnAttente} onChange={v => setPrefs(p => ({ ...p, collecteEnAttente: v }))} label="Collecte en attente prolongée" />
                <Toggle checked={prefs.certificatEmis} onChange={v => setPrefs(p => ({ ...p, certificatEmis: v }))} label="Certificat de destruction émis" />
                <Toggle checked={prefs.rapportMensuel} onChange={v => setPrefs(p => ({ ...p, rapportMensuel: v }))} label="Rapport mensuel de conformité" />
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Délai d'alerte avant échéance</label>
                <select
                  value={prefs.delaiAlerte}
                  onChange={e => setPrefs(p => ({ ...p, delaiAlerte: e.target.value as NotifPrefs['delaiAlerte'] }))}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500"
                >
                  <option value="J-7">J-7</option>
                  <option value="J-3">J-3</option>
                  <option value="J-1">J-1</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === 'donnees' && (
            <div className="glass border border-slate-700/40 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Gestion des données</h2>
              <p className="text-xs text-slate-500 mb-4">
                Les données sont stockées localement (localStorage) et synchronisées avec Supabase si configuré.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors">
                  <Download size={15} />
                  Exporter (JSON)
                </button>
                <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-xl transition-colors">
                  <RotateCcw size={15} />
                  Réinitialiser les données
                </button>
              </div>
            </div>
          )}

          {activeSection === 'apropos' && (
            <div className="glass border border-slate-700/40 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white mb-4">À propos de Waste-Control</h2>
              <div className="space-y-2 text-sm text-slate-400">
                <p><span className="text-slate-200 font-medium">Version :</span> 1.0.0</p>
                <p><span className="text-slate-200 font-medium">Établissement :</span> Hôpital Ndamatou, Touba, Sénégal</p>
                <p><span className="text-slate-200 font-medium">Objectif :</span> Traçabilité complète des déchets infectieux et hospitaliers (DASRI)</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-600">
                Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-lime-900/30 active:scale-95"
            >
              {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
              {saved ? 'Enregistré !' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

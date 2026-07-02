import { useState, useEffect } from 'react';
import { useAuth, roleLabels } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  User, Bell, Database, Info, Save, RotateCcw, Shield, Mail, Building2,
} from 'lucide-react';

interface NotifPrefs {
  priseDePoids: boolean;
  generateurMaintenance: boolean;
  seancePlanifiee: boolean;
  seanceTerminee: boolean;
}

const DEFAULT_PREFS: NotifPrefs = {
  priseDePoids: true,
  generateurMaintenance: true,
  seancePlanifiee: true,
  seanceTerminee: false,
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
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-sky-500' : 'bg-slate-700'}`}
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
      const stored = localStorage.getItem('hemocare_notif_prefs');
      return stored ? JSON.parse(stored) : DEFAULT_PREFS;
    } catch { return DEFAULT_PREFS; }
  });

  const [activeSection, setActiveSection] = useState('profil');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('hemocare_notif_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const handleSave = () => {
    setSaved(true);
    push({ type: 'success', title: 'Paramètres sauvegardés', message: 'Vos préférences ont été enregistrées avec succès.' });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser toutes les données aux valeurs initiales ? Cette action est irréversible.')) {
      const keysToRemove = ['hemocare_patients', 'hemocare_seances', 'hemocare_generateurs', 'hemocare_notif_prefs'];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      push({ type: 'warning', title: 'Données réinitialisées', message: 'Toutes les données ont été remises aux valeurs initiales. Rechargez la page.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-400 mt-1">Gérez votre profil et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="glass border border-slate-700/40 rounded-2xl p-2 space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === s.id ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 glass border border-slate-700/40 rounded-2xl p-6">
          {activeSection === 'profil' && user && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white mb-4">Profil utilisateur</h2>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center text-lg font-bold text-sky-400">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{roleLabels[user.role]}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Mail size={11} /> Email</div>
                  <p className="text-sm text-slate-200">{user.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Building2 size={11} /> Service</div>
                  <p className="text-sm text-slate-200">{user.dept}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Shield size={11} /> Rôle</div>
                  <p className="text-sm text-slate-200">{roleLabels[user.role]}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1"><Database size={11} /> Identifiant</div>
                  <p className="text-sm text-slate-200 font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-white mb-4">Préférences de notification</h2>
              <div className="divide-y divide-slate-800/60">
                <Toggle checked={prefs.priseDePoids} onChange={v => setPrefs(p => ({ ...p, priseDePoids: v }))} label="Prise de poids interdialytique importante" />
                <Toggle checked={prefs.generateurMaintenance} onChange={v => setPrefs(p => ({ ...p, generateurMaintenance: v }))} label="Générateur en maintenance" />
                <Toggle checked={prefs.seancePlanifiee} onChange={v => setPrefs(p => ({ ...p, seancePlanifiee: v }))} label="Nouvelle séance planifiée" />
                <Toggle checked={prefs.seanceTerminee} onChange={v => setPrefs(p => ({ ...p, seanceTerminee: v }))} label="Séance terminée" />
              </div>
            </div>
          )}

          {activeSection === 'donnees' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white mb-4">Gestion des données</h2>
              <p className="text-sm text-slate-400">
                Les données de l'application sont stockées localement (localStorage) et synchronisées avec Supabase lorsque disponible.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-semibold rounded-xl transition-all"
              >
                <RotateCcw size={15} />
                Réinitialiser les données de démonstration
              </button>
            </div>
          )}

          {activeSection === 'apropos' && (
            <div className="space-y-3 text-sm text-slate-400">
              <h2 className="text-base font-semibold text-white mb-4">À propos</h2>
              <p><span className="text-slate-500">Application:</span> Hemo-Care — Centre d'Hémodialyse</p>
              <p><span className="text-slate-500">Version:</span> 1.0.0</p>
              <p><span className="text-slate-500">Hôpital:</span> Hôpital Ndamatou, Touba, Sénégal</p>
              <p className="pt-4 text-xs text-slate-600">Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳</p>
            </div>
          )}

          <div className="flex justify-end mt-6 pt-4 border-t border-slate-800/60">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30 active:scale-95"
            >
              <Save size={15} />
              {saved ? 'Enregistré ✓' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

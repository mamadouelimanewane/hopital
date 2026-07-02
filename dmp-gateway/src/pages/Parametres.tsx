import { useState } from 'react';
import { User, Bell, Database, Shield, Save } from 'lucide-react';
import { useAuth, roleLabels } from '../contexts/AuthContext';

export default function Parametres() {
  const { user } = useAuth();
  const [notifSync, setNotifSync] = useState(true);
  const [notifErreur, setNotifErreur] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-400 mt-1">Gérez votre profil et les préférences du DMP-Gateway</p>
      </div>

      {/* Profile */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Profil utilisateur</h2>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg font-bold text-white">
              {user.avatar}
            </div>
            <div>
              <p className="text-base font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-xs text-emerald-400 mt-0.5">{roleLabels[user.role]} · {user.dept}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-slate-200">Alertes de synchronisation</p>
              <p className="text-xs text-slate-500">Recevoir une notification à chaque synchronisation réussie</p>
            </div>
            <input type="checkbox" checked={notifSync} onChange={e => setNotifSync(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-slate-200">Alertes d'erreur connecteur</p>
              <p className="text-xs text-slate-500">Être notifié immédiatement en cas d'échec de connexion</p>
            </div>
            <input type="checkbox" checked={notifErreur} onChange={e => setNotifErreur(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
          </label>
        </div>
      </div>

      {/* Synchronisation */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Synchronisation</h2>
        </div>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm text-slate-200">Synchronisation automatique</p>
            <p className="text-xs text-slate-500">Synchroniser les dossiers avec le réseau national toutes les 15 minutes</p>
          </div>
          <input type="checkbox" checked={autoSync} onChange={e => setAutoSync(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
        </label>
      </div>

      {/* Security */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Sécurité</h2>
        </div>
        <p className="text-xs text-slate-400">Chiffrement TLS 1.3 en transit et AES-256 au repos, appliqué automatiquement à toutes les données échangées avec le réseau national de santé.</p>
      </div>

      <button
        onClick={handleSave}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
      >
        <Save size={16} />
        {saved ? 'Enregistré ✓' : 'Enregistrer les modifications'}
      </button>

      <p className="text-center text-[10px] pt-4" style={{ color: 'var(--text-faint)' }}>
        Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
      </p>
    </div>
  );
}

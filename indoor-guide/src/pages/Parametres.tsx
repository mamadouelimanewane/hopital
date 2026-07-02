import { useState } from 'react';
import { User, Bell, Database, Shield, Save } from 'lucide-react';
import { useAuth, roleLabels } from '../contexts/AuthContext';

export default function Parametres() {
  const { user } = useAuth();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
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
        <p className="text-sm text-slate-400 mt-1">Gérez votre profil et les préférences de l'application</p>
      </div>

      {/* Profile */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Profil utilisateur</h2>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-lg font-bold text-white">
              {user.avatar}
            </div>
            <div>
              <p className="text-base font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <p className="text-xs text-slate-500 mt-0.5">{roleLabels[user.role]} · {user.dept}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 cursor-pointer">
            <div>
              <p className="text-sm text-slate-200">Notifications par email</p>
              <p className="text-xs text-slate-500">Recevoir un résumé quotidien des visiteurs</p>
            </div>
            <input type="checkbox" checked={notifEmail} onChange={e => setNotifEmail(e.target.checked)}
              className="w-4 h-4 accent-blue-500" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 cursor-pointer">
            <div>
              <p className="text-sm text-slate-200">Notifications push</p>
              <p className="text-xs text-slate-500">Alertes en temps réel sur les badges non retournés</p>
            </div>
            <input type="checkbox" checked={notifPush} onChange={e => setNotifPush(e.target.checked)}
              className="w-4 h-4 accent-blue-500" />
          </label>
        </div>
      </div>

      {/* Data / Sync */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Données & synchronisation</h2>
        </div>
        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 cursor-pointer">
          <div>
            <p className="text-sm text-slate-200">Synchronisation automatique</p>
            <p className="text-xs text-slate-500">Synchroniser les données avec le serveur central dès que possible</p>
          </div>
          <input type="checkbox" checked={autoSync} onChange={e => setAutoSync(e.target.checked)}
            className="w-4 h-4 accent-blue-500" />
        </label>
      </div>

      {/* Security */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Sécurité</h2>
        </div>
        <p className="text-xs text-slate-500">
          Compte de démonstration — les identifiants doivent être personnalisés avant mise en production.
        </p>
      </div>

      <button
        onClick={handleSave}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
      >
        <Save size={16} />
        {saved ? 'Enregistré !' : 'Enregistrer les modifications'}
      </button>

      <p className="text-[10px] text-slate-600 pt-4 border-t border-slate-800">
        Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
      </p>
    </div>
  );
}

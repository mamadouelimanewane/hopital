import { useState } from 'react';
import { User, Bell, Shield, Database, Save, Wifi, WifiOff } from 'lucide-react';
import { useAuth, roleLabels } from '../contexts/AuthContext';
import { useDataStore } from '../contexts/DataStore';

export default function Parametres() {
  const { user } = useAuth();
  const { supabaseReady, grossesses, accouchements, nouveauNes, couveuses } = useDataStore();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-400 mt-1">Gérez votre profil, vos notifications et la synchronisation des données</p>
      </div>

      {/* Profile */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-pink-400" />
          <h2 className="text-sm font-semibold text-white">Profil utilisateur</h2>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {user.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
              <p className="text-xs text-pink-400 mt-1 font-medium">{roleLabels[user.role]} · {user.dept}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-pink-400" />
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 cursor-pointer">
            <div>
              <p className="text-sm text-slate-200">Alertes par email</p>
              <p className="text-xs text-slate-500 mt-0.5">Grossesses à risque, alertes couveuses</p>
            </div>
            <input type="checkbox" checked={notifEmail} onChange={e => setNotifEmail(e.target.checked)} className="w-4 h-4 rounded accent-pink-500" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 cursor-pointer">
            <div>
              <p className="text-sm text-slate-200">Alertes par SMS</p>
              <p className="text-xs text-slate-500 mt-0.5">Urgences uniquement</p>
            </div>
            <input type="checkbox" checked={notifSms} onChange={e => setNotifSms(e.target.checked)} className="w-4 h-4 rounded accent-pink-500" />
          </label>
        </div>
      </div>

      {/* Data & sync */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-pink-400" />
          <h2 className="text-sm font-semibold text-white">Données & synchronisation</h2>
        </div>
        <div className="flex items-center gap-2 mb-4">
          {supabaseReady ? <Wifi size={14} className="text-emerald-400" /> : <WifiOff size={14} className="text-amber-400" />}
          <span className={`text-xs font-medium ${supabaseReady ? 'text-emerald-400' : 'text-amber-400'}`}>
            {supabaseReady ? 'Synchronisation Supabase active' : 'Mode localStorage (Supabase non configuré)'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Grossesses', value: grossesses.length },
            { label: 'Accouchements', value: accouchements.length },
            { label: 'Nouveau-nés', value: nouveauNes.length },
            { label: 'Couveuses', value: couveuses.length },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 text-center">
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-pink-400" />
          <h2 className="text-sm font-semibold text-white">Sécurité</h2>
        </div>
        <p className="text-xs text-slate-500">
          Application de démonstration — authentification simulée localement. En production, activez l'authentification
          Supabase et les politiques RLS avant tout déploiement avec des données patientes réelles.
        </p>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-pink-900/30 active:scale-95"
        >
          <Save size={16} />
          Enregistrer les préférences
        </button>
        {saved && <span className="text-xs text-emerald-400 font-medium">Préférences enregistrées ✓</span>}
      </div>

      {/* Branding footer */}
      <p className="text-[10px] text-slate-600 text-center pt-4">
        Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
      </p>
    </div>
  );
}

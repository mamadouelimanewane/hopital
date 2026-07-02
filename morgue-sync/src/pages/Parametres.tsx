import { Settings, User, Bell, Database, Shield } from 'lucide-react';
import { useAuth, roleLabels } from '../contexts/AuthContext';

export default function Parametres() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-400 mt-1">Gestion du compte et préférences du système</p>
      </div>

      {/* Profil */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-slate-300" />
          <h2 className="text-sm font-semibold text-white">Profil</h2>
        </div>
        {user && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <p className="text-[10px] text-slate-500 mb-0.5">Nom</p>
              <p className="text-sm font-semibold text-slate-200">{user.name}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <p className="text-[10px] text-slate-500 mb-0.5">Email</p>
              <p className="text-sm font-semibold text-slate-200">{user.email}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <p className="text-[10px] text-slate-500 mb-0.5">Rôle</p>
              <p className="text-sm font-semibold text-slate-200">{roleLabels[user.role]}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <p className="text-[10px] text-slate-500 mb-0.5">Service</p>
              <p className="text-sm font-semibold text-slate-200">{user.dept}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-slate-300" />
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            'Nouveau dossier enregistré',
            'Démarche en attente depuis plus de 24h',
            'Casier en maintenance',
          ].map(label => (
            <label key={label} className="flex items-center justify-between text-sm text-slate-300">
              <span>{label}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-slate-500" />
            </label>
          ))}
        </div>
      </div>

      {/* Données */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-slate-300" />
          <h2 className="text-sm font-semibold text-white">Données</h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Les données sont conservées localement et synchronisées avec la base centrale lorsque la connexion
          est disponible. Aucune donnée n'est partagée en dehors du système hospitalier.
        </p>
      </div>

      {/* Sécurité */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-slate-300" />
          <h2 className="text-sm font-semibold text-white">Sécurité</h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Accès réservé au personnel autorisé du service mortuaire et de l'administration de l'Hôpital Ndamatou.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-600 justify-center pt-2">
        <Settings size={12} />
        Morgue-Sync · Développé par Processingenierie
      </div>
    </div>
  );
}

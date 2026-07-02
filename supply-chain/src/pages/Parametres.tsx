import { Settings, User, Bell, Database, Shield, Info } from 'lucide-react';
import { useAuth, roleLabels } from '../contexts/AuthContext';

export default function Parametres() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="text-amber-400" size={24} /> Paramètres
        </h1>
        <p className="text-sm text-slate-400 mt-1">Gérez votre compte et les préférences de l'application.</p>
      </div>

      {/* Profil */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Profil utilisateur</h2>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-lg font-bold text-white">
              {user.avatar}
            </div>
            <div>
              <p className="text-base font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <p className="text-xs text-amber-400 mt-0.5">{roleLabels[user.role]} · {user.dept}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Alertes de rupture de stock', desc: 'Recevoir une alerte quand un article passe sous le seuil minimum' },
            { label: 'Livraisons non conformes', desc: 'Être notifié dès qu\'une livraison est marquée non conforme' },
            { label: 'Confirmations de commandes', desc: 'Notification lorsqu\'un fournisseur confirme une commande' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
              <div>
                <p className="text-sm text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <div className="w-10 h-5 rounded-full bg-amber-500/80 relative cursor-pointer flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Données */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Données & synchronisation</h2>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Les données sont sauvegardées localement (cache navigateur) et synchronisées automatiquement avec Supabase lorsque la connexion est disponible.
        </p>
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <Shield size={13} />
          Stockage local actif · Synchronisation best-effort
        </div>
      </div>

      {/* À propos */}
      <div className="p-5 rounded-2xl glass border border-slate-700/40">
        <div className="flex items-center gap-2 mb-4">
          <Info size={16} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-white">À propos</h2>
        </div>
        <p className="text-xs text-slate-400">
          Supply-Chain v1.0 · Gestion de l'approvisionnement non-médical de l'Hôpital Ndamatou de Touba.
        </p>
        <p className="text-[10px] text-slate-600 mt-3">
          Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
        </p>
      </div>
    </div>
  );
}

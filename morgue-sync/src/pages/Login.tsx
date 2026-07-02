import { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, HeartHandshake, Shield, Stethoscope, Settings } from 'lucide-react';
import { useAuth, roleLabels } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

const ACCOUNTS = [
  { role: 'agent'       as UserRole, email: 'c.mbaye@ndamatou.sn', password: 'agent2026',    name: 'Cheikh Anta Mbaye', post: 'Agent Mortuaire' },
  { role: 'responsable' as UserRole, email: 'a.ndoye@ndamatou.sn', password: 'resp2026',     name: 'Aïssatou Ndoye',    post: 'Responsable Admin.' },
  { role: 'medecin'     as UserRole, email: 's.kane@ndamatou.sn',  password: 'med2026',      name: 'Dr. Serigne Kane',  post: 'Médecin Légiste' },
  { role: 'admin'       as UserRole, email: 'admin@ndamatou.sn',   password: 'ndamatou2026', name: 'Admin Morgue-Sync', post: 'Administrateur' },
];

const RoleIcon: Record<UserRole, React.ElementType> = {
  agent: HeartHandshake, responsable: Shield, medecin: Stethoscope, admin: Settings,
};

const avatarColors: Record<UserRole, string> = {
  agent:       'from-slate-500 to-slate-600',
  responsable: 'from-blue-500 to-slate-600',
  medecin:     'from-teal-500 to-slate-600',
  admin:       'from-indigo-500 to-slate-600',
};

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
  };

  const quickLogin = async (acc: typeof ACCOUNTS[0], idx: number) => {
    setActiveCard(idx);
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setLoading(true);
    await login(acc.email, acc.password);
    setLoading(false);
    setActiveCard(null);
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#0b1220' }}>

      {/* ── PANNEAU GAUCHE — identité ─────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Fond dégradé sobre */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)'
        }} />

        {/* Halos discrets */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #94a3b8 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #475569 0%, transparent 70%)' }} />

        {/* ── Header logo ── */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(148,163,184,0.12)', border: '1px solid rgba(148,163,184,0.25)' }}>
              <span className="text-3xl">🕊️</span>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: '#94a3b8' }}>
                République du Sénégal
              </div>
              <div className="text-xs text-slate-400 tracking-widest">Ministère de la Santé</div>
            </div>
          </div>

          <div className="mb-3">
            <h1 className="font-black leading-tight text-white" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)' }}>
              Morgue-Sync
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px flex-1 opacity-30" style={{ background: '#94a3b8' }} />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#94a3b8' }}>Hôpital Ndamatou — Touba</span>
              <div className="h-px flex-1 opacity-30" style={{ background: '#94a3b8' }} />
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md mt-4">
            Administration numérisée, respectueuse et transparente des décès. Suivi des casiers,
            des démarches administratives et de l'accompagnement des familles.
          </p>
        </div>

        {/* ── Footer gauche ── */}
        <div className="relative z-10">
          <div className="h-px w-full mb-4 opacity-20" style={{ background: '#94a3b8' }} />
          <div className="flex items-center justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span>© 2026 Morgue-Sync · Hôpital Ndamatou</span>
            <span>Développé par Processingenierie</span>
          </div>
        </div>
      </div>

      {/* ── PANNEAU DROIT — formulaire ─────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-10 relative"
        style={{ background: 'linear-gradient(180deg, #0d1526 0%, #0b1220 100%)' }}>

        <div className="absolute top-0 right-0 w-80 h-80 opacity-10 blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #475569 0%, transparent 70%)' }} />

        <div className="w-full max-w-[420px]">

          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(148,163,184,0.12)', border: '1px solid rgba(148,163,184,0.25)' }}>
              <span className="text-lg">🕊️</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm">Morgue-Sync</div>
              <div className="text-[10px] text-slate-500">Hôpital Ndamatou, Touba</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-0.5 rounded-full" style={{ background: '#94a3b8' }} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#94a3b8' }}>
                Portail Morgue-Sync
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">Connexion</h2>
            <p className="text-sm text-slate-500 mt-1">Accédez à votre espace de gestion</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide">
                EMAIL PROFESSIONNEL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="prenom.nom@ndamatou.sn"
                required
                className="w-full rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(148,163,184,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide">
                MOT DE PASSE
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all pr-12"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(148,163,184,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(148,163,184,0.5)' : 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)',
                color: '#0f172a',
                boxShadow: '0 8px 32px rgba(148,163,184,0.2)',
              }}
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Connexion en cours…</>
                : <><span>Se connecter</span><span className="text-lg">→</span></>
              }
            </button>
          </form>

          {/* Accès rapide */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-600">Accès rapide</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {ACCOUNTS.map((acc, idx) => {
                const Icon = RoleIcon[acc.role];
                const isActive = activeCard === idx;
                return (
                  <button
                    key={acc.role}
                    onClick={() => quickLogin(acc, idx)}
                    disabled={loading}
                    className="relative flex items-center gap-3 p-3 rounded-xl text-left transition-all group disabled:opacity-50 overflow-hidden"
                    style={{
                      background: isActive ? 'rgba(148,163,184,0.1)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    }}
                    onMouseLeave={e => {
                      if (activeCard !== idx) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                      }
                    }}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${avatarColors[acc.role]} flex items-center justify-center shrink-0`}>
                      {isActive
                        ? <Loader2 size={13} className="text-white animate-spin" />
                        : <Icon size={13} className="text-white" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-200 truncate">{acc.name.split(' ')[0]} {acc.name.split(' ')[1]}</p>
                      <p className="text-[9px] text-slate-600 truncate">{acc.post.split(' ')[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tableau des accès */}
            <div className="mt-5 rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>
                  Accès — Hôpital Ndamatou
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {ACCOUNTS.map(acc => (
                  <div key={acc.role} className="grid grid-cols-2 px-4 py-2.5 text-[10px]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <span className="text-slate-500">Login: </span>
                      <span className="text-slate-300 font-mono">{acc.email.split('@')[0]}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Pwd: </span>
                      <span className="font-mono" style={{ color: '#94a3b8' }}>{acc.password}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-[9px] text-slate-600 text-center">
                @ndamatou.sn · {roleLabels.admin} à modifier après première connexion
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Système opérationnel · Morgue-Sync · Touba, Sénégal
          </div>
        </div>
      </div>
    </div>
  );
}

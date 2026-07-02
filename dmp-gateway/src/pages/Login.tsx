import { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, Stethoscope, Shield, Network, Settings } from 'lucide-react';
import { useAuth, roleLabels } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

const ACCOUNTS = [
  { role: 'medecin'  as UserRole, email: 'c.mbaye@ndamatou.sn', password: 'dmp2026',     name: 'Cheikh Anta Mbaye', post: 'Médecin'      },
  { role: 'dim'       as UserRole, email: 'a.kane@ndamatou.sn',  password: 'dim2026',     name: 'Aïssatou Kane',    post: 'DIM'           },
  { role: 'referent'  as UserRole, email: 'm.sarr@ndamatou.sn',  password: 'ref2026',     name: 'Moussa Sarr',      post: 'Référent Réseau' },
  { role: 'admin'     as UserRole, email: 'admin@ndamatou.sn',   password: 'ndamatou2026',name: 'Admin DMP-Gateway',post: 'Administrateur'  },
];

const RoleIcon: Record<UserRole, React.ElementType> = {
  medecin: Stethoscope, dim: Network, referent: Shield, admin: Settings,
};

const avatarColors: Record<UserRole, string> = {
  medecin:  'from-emerald-400 to-teal-500',
  dim:      'from-cyan-400 to-blue-500',
  referent: 'from-violet-400 to-purple-500',
  admin:    'from-amber-400 to-orange-500',
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
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#070d1a' }}>

      {/* ── PANNEAU GAUCHE — identité réseau national ─────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Fond dégradé riche */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 30%, #053b2e 60%, #011a13 100%)'
        }} />

        {/* Motif réseau — lignes connectées */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="net" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#10b981"/>
              <circle cx="80" cy="30" r="2" fill="#10b981"/>
              <circle cx="45" cy="70" r="2" fill="#10b981"/>
              <line x1="10" y1="10" x2="80" y2="30" stroke="#10b981" strokeWidth="0.5"/>
              <line x1="80" y1="30" x2="45" y2="70" stroke="#10b981" strokeWidth="0.5"/>
              <line x1="45" y1="70" x2="10" y2="10" stroke="#10b981" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#net)"/>
        </svg>

        {/* Halos lumineux */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

        {/* ── Header logo ── */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-2xl rotate-3"
                style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }} />
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center text-3xl">
                🌍
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: '#10b981' }}>
                République du Sénégal
              </div>
              <div className="text-xs text-emerald-300/70 tracking-widest">Ministère de la Santé</div>
            </div>
          </div>

          {/* Nom de l'application */}
          <div className="mb-3">
            <h1 className="font-black leading-tight" style={{
              fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
              background: 'linear-gradient(90deg, #34d399 0%, #10b981 40%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              DMP-Gateway
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px flex-1 opacity-30" style={{ background: '#10b981' }} />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#10b981' }}>Touba — Sénégal</span>
              <div className="h-px flex-1 opacity-30" style={{ background: '#10b981' }} />
            </div>
          </div>

          <p className="text-emerald-200/60 text-sm leading-relaxed max-w-md mt-4">
            Dossier Médical Partagé connecté au réseau national de santé sénégalais · Interopérabilité HL7 v2 / FHIR R4
          </p>
        </div>

        {/* ── Statistiques ── */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { val: 'National', label: 'Couverture', icon: '🌍' },
              { val: '100%', label: 'Interopérable', icon: '🔗' },
              { val: 'HL7', label: 'Standard', icon: '📄' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-xl" style={{ color: '#34d399' }}>{s.val}</div>
                <div className="text-xs text-emerald-300/60">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Hôpitaux connectés */}
          <div className="flex items-center gap-3 flex-wrap">
            {['Touba', 'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor'].map(ville => (
              <div key={ville} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold"
                style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#10b981', background: 'rgba(16,185,129,0.06)' }}>
                <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                {ville}
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer gauche ── */}
        <div className="relative z-10">
          <div className="h-px w-full mb-4 opacity-20" style={{ background: '#10b981' }} />
          <div className="flex items-center justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span>© 2026 DMP-Gateway · Hôpital Ndamatou</span>
            <span>Processingenierie</span>
          </div>
        </div>
      </div>

      {/* ── PANNEAU DROIT — formulaire ─────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-10 relative"
        style={{ background: 'linear-gradient(180deg, #090f1e 0%, #070d1a 100%)' }}>

        {/* Halo décoratif droit */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-10 blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />

        <div className="w-full max-w-[420px]">

          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
              🌍
            </div>
            <div>
              <div className="font-bold text-white text-sm">DMP-Gateway</div>
              <div className="text-[10px] text-slate-500">Touba, Sénégal</div>
            </div>
          </div>

          {/* Titre section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-0.5 rounded-full" style={{ background: '#10b981' }} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#10b981' }}>
                Portail DMP-Gateway
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">Connexion</h2>
            <p className="text-sm text-slate-500 mt-1">Accédez à votre espace d'interopérabilité</p>
          </div>

          {/* Formulaire */}
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
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
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
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
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
                background: loading ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #10b981 100%)',
                color: '#022c22',
                boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
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
                      background: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
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
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${avatarColors[acc.role]} flex items-center justify-center shrink-0`}>
                      {isActive
                        ? <Loader2 size={13} className="text-white animate-spin" />
                        : <Icon size={13} className="text-white" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-200 truncate">{acc.name.split(' ')[0]} {acc.name.split(' ')[1]}</p>
                      <p className="text-[9px] text-slate-600 truncate">{acc.post}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tableau des accès */}
            <div className="mt-5 rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#10b981' }}>
                  🔐 Accès — Hôpital Ndamatou
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
                      <span className="font-mono" style={{ color: '#10b981' }}>{acc.password}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-[9px] text-slate-600 text-center">
                @ndamatou.sn · Modifier après première connexion
              </div>
            </div>
          </div>

          {/* Indicateur statut système */}
          <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Réseau national opérationnel · DMP-Gateway · Touba, Sénégal
          </div>

          <p className="text-center text-[9px] mt-4" style={{ color: 'var(--text-faint)' }}>
            Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
          </p>
        </div>
      </div>
    </div>
  );
}

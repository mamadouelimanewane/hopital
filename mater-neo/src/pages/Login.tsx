import { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, Heart, Stethoscope, Baby, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

const ACCOUNTS = [
  { role: 'sage-femme'  as UserRole, email: 'a.ndoye@ndamatou.sn',  password: 'sf2026',       name: 'Aïssatou Ndoye',       post: 'Sage-Femme'          },
  { role: 'gynecologue' as UserRole, email: 'f.sarr@ndamatou.sn',   password: 'gyn2026',      name: 'Dr. Fatoumata Sarr',   post: 'Gynécologue'         },
  { role: 'pediatre'    as UserRole, email: 'c.mbaye@ndamatou.sn',  password: 'ped2026',      name: 'Dr. Cheikh A. Mbaye',  post: 'Pédiatre Néonat.'    },
  { role: 'admin'       as UserRole, email: 'admin@ndamatou.sn',    password: 'ndamatou2026', name: 'Admin Mater-Neo',      post: 'Administrateur'      },
];

const RoleIcon: Record<UserRole, React.ElementType> = {
  'sage-femme': Heart, 'gynecologue': Stethoscope, 'pediatre': Baby, 'admin': Settings,
};

const avatarColors: Record<UserRole, string> = {
  'sage-femme':  'from-pink-400 to-rose-500',
  'gynecologue': 'from-fuchsia-400 to-pink-500',
  'pediatre':    'from-cyan-400 to-blue-500',
  'admin':       'from-violet-400 to-purple-500',
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
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#0c0614' }}>

      {/* ── PANNEAU GAUCHE — identité hôpital ─────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Fond dégradé riche */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #4a0d33 0%, #6b1150 30%, #3d0a2e 60%, #1a0512 100%)'
        }} />

        {/* Motifs géométriques — SVG overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,4 76,22 76,58 40,76 4,58 4,22" fill="none" stroke="#ec4899" strokeWidth="0.8"/>
              <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="#ec4899" strokeWidth="0.5"/>
              <circle cx="40" cy="40" r="6" fill="none" stroke="#ec4899" strokeWidth="0.5"/>
              <line x1="40" y1="4" x2="40" y2="16" stroke="#ec4899" strokeWidth="0.4"/>
              <line x1="40" y1="64" x2="40" y2="76" stroke="#ec4899" strokeWidth="0.4"/>
              <line x1="4" y1="22" x2="16" y2="28" stroke="#ec4899" strokeWidth="0.4"/>
              <line x1="64" y1="52" x2="76" y2="58" stroke="#ec4899" strokeWidth="0.4"/>
              <line x1="76" y1="22" x2="64" y2="28" stroke="#ec4899" strokeWidth="0.4"/>
              <line x1="16" y1="52" x2="4" y2="58" stroke="#ec4899" strokeWidth="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)"/>
        </svg>

        {/* Halos lumineux */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />

        {/* ── Header logo ── */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-2xl rotate-3"
                style={{ background: 'linear-gradient(135deg, #ec4899, #f9a8d4)' }} />
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center text-3xl">
                👶
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: '#ec4899' }}>
                République du Sénégal
              </div>
              <div className="text-xs text-pink-200/70 tracking-widest">Ministère de la Santé</div>
            </div>
          </div>

          {/* Nom de l'hôpital */}
          <div className="mb-3">
            <h1 className="font-black leading-tight" style={{
              fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
              background: 'linear-gradient(90deg, #f9a8d4 0%, #ec4899 40%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Mater-Neo<br/>Ndamatou
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px flex-1 opacity-30" style={{ background: '#ec4899' }} />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#ec4899' }}>Touba — Sénégal</span>
              <div className="h-px flex-1 opacity-30" style={{ background: '#ec4899' }} />
            </div>
          </div>

          <p className="text-pink-100/60 text-sm leading-relaxed max-w-md mt-4">
            Suivi des grossesses, accouchements et soins intensifs néonatals à l'Hôpital Ndamatou de Touba
          </p>
        </div>

        {/* ── Statistiques ── */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { val: '15', label: 'Lits Néonat.', icon: '🛏️' },
              { val: '100%', label: 'Traçabilité', icon: '📋' },
              { val: '24/7', label: 'Soins Intensifs', icon: '❤️' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(236,72,153,0.2)' }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-xl" style={{ color: '#f9a8d4' }}>{s.val}</div>
                <div className="text-xs text-pink-200/60">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="flex items-center gap-3 flex-wrap">
            {['OMS Partenaire', 'ISO 13485', 'Protocole Kangourou', 'Normes WHO'].map(cert => (
              <div key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold"
                style={{ borderColor: 'rgba(236,72,153,0.3)', color: '#ec4899', background: 'rgba(236,72,153,0.06)' }}>
                <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                {cert}
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer gauche ── */}
        <div className="relative z-10">
          <div className="h-px w-full mb-4 opacity-20" style={{ background: '#ec4899' }} />
          <div className="flex items-center justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span>Développé par Processingenierie</span>
            <span>Hôpital Ndamatou Touba 🇸🇳</span>
          </div>
        </div>
      </div>

      {/* ── PANNEAU DROIT — formulaire ─────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-10 relative"
        style={{ background: 'linear-gradient(180deg, #0f0a1a 0%, #0c0614 100%)' }}>

        {/* Halo décoratif droit */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-10 blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a21caf 0%, transparent 70%)' }} />

        <div className="w-full max-w-[420px]">

          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f9a8d4)' }}>
              👶
            </div>
            <div>
              <div className="font-bold text-white text-sm">Mater-Neo</div>
              <div className="text-[10px] text-slate-500">Touba, Sénégal</div>
            </div>
          </div>

          {/* Titre section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-0.5 rounded-full" style={{ background: '#ec4899' }} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#ec4899' }}>
                Portail Mater-Neo
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">Connexion</h2>
            <p className="text-sm text-slate-500 mt-1">Accédez à votre espace de gestion</p>
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
                onFocus={e => { e.target.style.borderColor = 'rgba(236,72,153,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
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
                  onFocus={e => { e.target.style.borderColor = 'rgba(236,72,153,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
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
                background: loading ? 'rgba(236,72,153,0.5)' : 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 50%, #ec4899 100%)',
                color: '#3d0a2e',
                boxShadow: '0 8px 32px rgba(236,72,153,0.25)',
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
                      background: isActive ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.06)',
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
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#ec4899' }}>
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
                      <span className="font-mono" style={{ color: '#ec4899' }}>{acc.password}</span>
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
            Système opérationnel · Mater-Neo · Touba, Sénégal
          </div>
        </div>
      </div>
    </div>
  );
}

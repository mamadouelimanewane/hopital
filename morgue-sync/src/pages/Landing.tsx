import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const STATS = [
  { val: '100%',    label: 'Respectueux',  icon: '🕊️' },
  { val: '24/7',     label: 'Assistance',   icon: '🛡️' },
  { val: 'Digital',  label: 'Démarches',    icon: '📝' },
];

const FEATURES = [
  { icon: '🧊', label: 'Casiers',    desc: 'Disponibilité frigorifique' },
  { icon: '📝', label: 'Admin',      desc: 'Certificats et démarches' },
  { icon: '👨‍👩‍👧‍👦', label: 'Familles', desc: 'Accompagnement' },
  { icon: '🚗', label: 'Transferts', desc: 'Logistique funéraire' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#070d1a', color: '#fff' }}>

      {/* ══ FOND ════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, #94a3b8 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -left-40 w-[600px] h-[600px] opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #334155 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #1e293b 0%, transparent 70%)' }} />
      </div>

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(148,163,184,0.1)', backdropFilter: 'blur(10px)', background: 'rgba(7,13,26,0.7)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
            style={{ background: 'rgba(148,163,184,0.12)', border: '1px solid rgba(148,163,184,0.25)' }}>
            🕊️
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-wide">Morgue-Sync</div>
            <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#94a3b8' }}>Gestion Funéraire</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          Hôpital Ndamatou · Touba, Sénégal
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
            color: '#0f172a',
            boxShadow: '0 4px 20px rgba(148,163,184,0.25)',
          }}>
          Connexion →
        </button>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16"
        style={{ minHeight: '70vh' }}>

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold mb-8 border"
          style={{
            background: 'rgba(148,163,184,0.08)',
            borderColor: 'rgba(148,163,184,0.25)',
            color: '#94a3b8',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease',
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          République du Sénégal · Ministère de la Santé · Région de Diourbel
        </div>

        <h1
          className="font-black leading-tight mb-4"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.1s',
          }}>
          Morgue-Sync
        </h1>

        <div
          className="flex items-center gap-4 mb-4"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}>
          <div className="h-px w-20 opacity-40" style={{ background: '#94a3b8' }} />
          <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: '#94a3b8' }}>
            Hôpital Ndamatou · Touba
          </span>
          <div className="h-px w-20 opacity-40" style={{ background: '#94a3b8' }} />
        </div>

        <p
          className="text-slate-400 max-w-2xl text-base leading-relaxed mb-10"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
          Administration numérisée, respectueuse et transparente des décès à l'Hôpital Ndamatou de Touba.
          Un accompagnement digne pour les familles et une gestion rigoureuse pour les équipes.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 0.45s',
          }}>
          <button
            onClick={() => navigate('/login')}
            className="group px-10 py-4 rounded-2xl font-black text-base transition-all active:scale-95 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)',
              color: '#0f172a',
              boxShadow: '0 8px 40px rgba(148,163,184,0.25)',
            }}>
            Accéder au système
            <span className="text-xl group-hover:translate-x-1 transition-transform inline-block">→</span>
          </button>

          <a
            href="#fonctionnalites"
            className="px-8 py-4 rounded-2xl font-semibold text-sm border transition-all"
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.03)',
            }}>
            Découvrir les fonctionnalités ↓
          </a>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl p-6 text-center border"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(148,163,184,0.15)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s ease ${0.1 + i * 0.1}s`,
              }}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-black text-3xl mb-1" style={{ color: '#94a3b8' }}>{s.val}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FONCTIONNALITÉS ══════════════════════════════════════ */}
      <section id="fonctionnalites" className="relative z-10 px-6 py-16">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-16 opacity-30" style={{ background: '#94a3b8' }} />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: '#94a3b8' }}>
                Fonctionnalités
              </span>
              <div className="h-px w-16 opacity-30" style={{ background: '#94a3b8' }} />
            </div>
            <h2 className="text-2xl font-black text-white">Une gestion funéraire structurée</h2>
            <p className="text-slate-500 text-sm mt-2">Du registre des défunts à l'accompagnement des familles</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((m, i) => (
              <div
                key={m.label}
                className="rounded-2xl p-5 border transition-all group cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: 'rgba(255,255,255,0.07)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease ${0.05 * i}s`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(148,163,184,0.06)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                }}>
                <div className="text-2xl mb-3">{m.icon}</div>
                <div className="font-bold text-white text-sm mb-1">{m.label}</div>
                <div className="text-xs text-slate-600">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ APPEL À L'ACTION ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 py-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#94a3b8' }}>Engagement</div>
            <p className="text-slate-400 text-sm max-w-md">
              Une administration digitale au service de la dignité des familles et de la rigueur du service mortuaire.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
              color: '#0f172a',
              boxShadow: '0 4px 24px rgba(148,163,184,0.2)',
            }}>
            → Accéder au système
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer className="relative z-10 px-8 py-5 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <p className="text-[10px] text-slate-600">
          Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
        </p>
      </footer>
    </div>
  );
}

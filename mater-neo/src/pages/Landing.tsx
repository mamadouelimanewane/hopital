import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const STATS = [
  { val: '15',   label: 'Lits Néonatologie',    icon: '🛏️' },
  { val: '100%', label: 'Traçabilité',           icon: '📋' },
  { val: '24/7', label: 'Soins Intensifs',       icon: '❤️' },
  { val: '12',   label: 'Accouchements / sem.',  icon: '👶' },
];

const MODULES = [
  { icon: '🤰', label: 'Grossesse',   desc: 'Dossier de suivi' },
  { icon: '📈', label: 'Partogramme', desc: 'Suivi électronique du travail' },
  { icon: '🛏️', label: 'Couveuses',   desc: 'Gestion des 15 lits néonatals' },
  { icon: '❤️', label: 'Monitoring',  desc: 'Rythme cardiaque fœtal' },
  { icon: '👶', label: 'Néonatologie', desc: 'Soins intensifs nouveau-nés' },
  { icon: '📊', label: 'Accouchements', desc: 'Registre & statistiques' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Compteur animé
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setCounter(c => c < 15 ? c + 1 : 15), 60);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0c0614', color: '#fff' }}>

      {/* ══ FOND ANIMÉ ════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Halo principal rose */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, #ec4899 0%, transparent 70%)' }} />
        {/* Halo violet gauche */}
        <div className="absolute bottom-0 -left-40 w-[600px] h-[600px] opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #a21caf 0%, transparent 70%)' }} />
        {/* Halo bleu droit */}
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #1a4d8a 0%, transparent 70%)' }} />

        {/* Grille perspectivique */}
        <svg className="absolute bottom-0 left-0 w-full h-[50vh] opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ec4899" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        {/* Motifs rotatifs */}
        <svg className="absolute top-10 right-10 w-72 h-72 opacity-[0.05]"
          style={{ animation: 'spin 60s linear infinite' }}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          {[0,45,90,135].map(a => (
            <g key={a} transform={`rotate(${a} 100 100)`}>
              <polygon points="100,10 190,55 190,145 100,190 10,145 10,55"
                fill="none" stroke="#ec4899" strokeWidth="1"/>
              <polygon points="100,35 165,68 165,132 100,165 35,132 35,68"
                fill="none" stroke="#ec4899" strokeWidth="0.6"/>
            </g>
          ))}
          <circle cx="100" cy="100" r="20" fill="none" stroke="#ec4899" strokeWidth="1"/>
          <circle cx="100" cy="100" r="8" fill="#ec4899" opacity="0.3"/>
        </svg>
      </div>

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(236,72,153,0.1)', backdropFilter: 'blur(10px)', background: 'rgba(12,6,20,0.7)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f9a8d4)' }}>
            👶
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-wide">Mater-Neo</div>
            <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#ec4899' }}>Touba · Sénégal</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Système opérationnel · Maternité & Néonatologie
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #f9a8d4)',
            color: '#3d0a2e',
            boxShadow: '0 4px 20px rgba(236,72,153,0.3)',
          }}>
          Connexion →
        </button>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16"
        style={{ minHeight: '80vh' }}>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold mb-8 border"
          style={{
            background: 'rgba(236,72,153,0.08)',
            borderColor: 'rgba(236,72,153,0.25)',
            color: '#ec4899',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease',
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          République du Sénégal · Ministère de la Santé · Région de Diourbel
        </div>

        {/* Titre principal */}
        <h1
          className="font-black leading-none mb-4"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #ec4899 70%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.1s',
          }}>
          MATER-NEO
        </h1>

        <div
          className="flex items-center gap-4 mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.2s',
          }}>
          <div className="h-px w-20 opacity-40" style={{ background: '#ec4899' }} />
          <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: '#ec4899' }}>
            Hôpital Ndamatou · Touba
          </span>
          <div className="h-px w-20 opacity-40" style={{ background: '#ec4899' }} />
        </div>

        <p
          className="text-slate-400 max-w-2xl text-base leading-relaxed mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}>
          Maternité & Néonatologie
        </p>
        <p
          className="text-lg font-semibold mb-10"
          style={{
            color: 'rgba(255,255,255,0.7)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.35s',
          }}>
          Suivi des grossesses, accouchements et soins intensifs néonatals
        </p>

        {/* CTA */}
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
              background: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 50%, #ec4899 100%)',
              color: '#3d0a2e',
              boxShadow: '0 8px 40px rgba(236,72,153,0.35)',
            }}>
            <span className="text-xl">👶</span>
            Accéder au système Mater-Neo
            <span className="text-xl group-hover:translate-x-1 transition-transform inline-block">→</span>
          </button>

          <a
            href="#modules"
            className="px-8 py-4 rounded-2xl font-semibold text-sm border transition-all"
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.03)',
            }}>
            Découvrir les modules ↓
          </a>
        </div>

        {/* Compteur animé */}
        <div
          className="mt-14 flex items-center gap-2 text-sm"
          style={{
            color: 'rgba(255,255,255,0.3)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.6s',
          }}>
          <span className="font-black text-2xl" style={{ color: '#ec4899' }}>{counter}</span>
          <span>lits néonatals suivis en temps réel</span>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl p-6 text-center border"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(236,72,153,0.15)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s ease ${0.1 + i * 0.1}s`,
              }}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-black text-3xl mb-1" style={{ color: '#ec4899' }}>{s.val}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MODULES ══════════════════════════════════════════════ */}
      <section id="modules" className="relative z-10 px-6 py-16">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-16 opacity-30" style={{ background: '#ec4899' }} />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: '#ec4899' }}>
                Fonctionnalités
              </span>
              <div className="h-px w-16 opacity-30" style={{ background: '#ec4899' }} />
            </div>
            <h2 className="text-2xl font-black text-white">Modules intégrés</h2>
            <p className="text-slate-500 text-sm mt-2">Une plateforme complète pour la gestion de la maternité et de la néonatologie</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MODULES.map((m, i) => (
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
                  (e.currentTarget as HTMLElement).style.background = 'rgba(236,72,153,0.06)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,72,153,0.2)';
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

      {/* ══ CERTIFICATIONS ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 py-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#ec4899' }}>Certifications</div>
            <div className="flex flex-wrap gap-2">
              {['OMS Partenaire', 'ISO 13485', 'Normes Néonat. WHO', 'Protocole Kangourou'].map(c => (
                <span key={c} className="px-3 py-1 rounded-full text-[10px] font-bold border"
                  style={{ borderColor: 'rgba(236,72,153,0.25)', color: '#ec4899', background: 'rgba(236,72,153,0.05)' }}>
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #f9a8d4)',
              color: '#3d0a2e',
              boxShadow: '0 4px 24px rgba(236,72,153,0.25)',
            }}>
            → Accéder à Mater-Neo
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer className="relative z-10 px-8 py-5 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <p className="text-[10px] text-slate-700">
          Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
        </p>
      </footer>

      {/* Style animation spin */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"

const APPS = [
  { id: "connect", name: "CHNCAK Connect", url: "http://localhost:3001", icon: "🏥", desc: "Portail Patient & Télémédecine", color: "from-blue-600 to-blue-400", bg: "bg-blue-50" },
  { id: "predict", name: "Predict-IA", url: "http://localhost:3002", icon: "🧠", desc: "Tableau de Bord Direction & IA", color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-50" },
  { id: "pharma", name: "SmartPharma", url: "http://localhost:3003", icon: "💊", desc: "Pharmacie, Stocks & Blockchain", color: "from-teal-600 to-teal-400", bg: "bg-teal-50" },
  { id: "learn", name: "Med-Learn", url: "http://localhost:3004", icon: "🎓", desc: "Université & Staffs Médicaux", color: "from-indigo-600 to-indigo-400", bg: "bg-indigo-50" },
  { id: "blood", name: "Blood-Sync", url: "http://localhost:3005", icon: "🩸", desc: "Banque de Sang Connectée", color: "from-red-600 to-red-400", bg: "bg-red-50" },
  { id: "ambu", name: "Ambu-Track", url: "http://localhost:3006", icon: "🚑", desc: "Contrôle Aérien des Urgences", color: "from-orange-600 to-orange-400", bg: "bg-orange-50" },
  { id: "neuro", name: "NeuroScan-IA", url: "http://localhost:3007", icon: "🧬", desc: "Assistant Radiologique par IA", color: "from-violet-600 to-violet-400", bg: "bg-violet-50" },
  { id: "touba", name: "Touba-Med-Care", url: "http://localhost:3008", icon: "🌟", desc: "Tourisme Médical VIP", color: "from-yellow-600 to-yellow-400", bg: "bg-yellow-50" },
  { id: "eco", name: "Eco-Hôpital", url: "http://localhost:3009", icon: "⚡", desc: "Smart Grid & Jumeau Énergétique", color: "from-lime-600 to-lime-400", bg: "bg-lime-50" },
]

const BG = "#0f2d6b"
const BG_HEADER = "rgba(15,45,107,0.92)"

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() > 0.8 ? "2px" : "1px",
          height: Math.random() > 0.8 ? "2px" : "1px",
          borderRadius: "50%",
          background: Math.random() > 0.7 ? "#C9A84C" : "rgba(255,255,255,0.5)",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 4}s ${Math.random() * 3}s infinite`,
          opacity: Math.random() * 0.8 + 0.2,
        }} />
      ))}
    </div>
  )
}

function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
      <div style={{
        width: "100%", height: "100%",
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />
    </div>
  )
}

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.1); }
          50%       { box-shadow: 0 0 40px rgba(201,168,76,0.25); }
        }
        @keyframes badge-glow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes scan-line {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        .card-hover { transition: all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-6px); }
        .animate-up-1 { animation: fadeSlideUp 0.7s 0.1s both; }
        .animate-up-2 { animation: fadeSlideUp 0.7s 0.25s both; }
        .animate-up-3 { animation: fadeSlideUp 0.7s 0.4s both; }
        .animate-up-4 { animation: fadeSlideUp 0.7s 0.55s both; }
        .slogan-card  { animation: fadeSlideUp 0.7s 0.7s both; }
        .grid-card-0 { animation: fadeSlideUp 0.6s 0.8s both; }
        .grid-card-1 { animation: fadeSlideUp 0.6s 0.9s both; }
        .grid-card-2 { animation: fadeSlideUp 0.6s 1.0s both; }
        .grid-card-3 { animation: fadeSlideUp 0.6s 1.1s both; }
        .grid-card-4 { animation: fadeSlideUp 0.6s 1.2s both; }
        .grid-card-5 { animation: fadeSlideUp 0.6s 1.3s both; }
        .grid-card-6 { animation: fadeSlideUp 0.6s 1.4s both; }
        .grid-card-7 { animation: fadeSlideUp 0.6s 1.5s both; }
        .grid-card-8 { animation: fadeSlideUp 0.6s 1.6s both; }
        .grid-card-9 { animation: fadeSlideUp 0.6s 1.7s both; }
        .grid-card-10 { animation: fadeSlideUp 0.6s 1.8s both; }
        .logo-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .scan { animation: scan-line 3s linear infinite; }
      `}</style>

      <div style={{ minHeight: "100vh", background: BG, color: "#fff", position: "relative" }}>

        {mounted && <Particles />}
        <GridLines />
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(50,110,200,0.45), transparent)",
        }} />
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(201,168,76,0.05), transparent)",
        }} />

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: BG_HEADER,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="logo-glow" style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #2a5298, #1a3a6b)",
                border: "1px solid rgba(201,168,76,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>🏛️</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>CNRA</p>
                <p style={{ fontSize: 9, color: "#C9A84C", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>République du Sénégal</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "badge-glow 2s infinite" }} />
              <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em" }}>SYSTÈME EN LIGNE</span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "5rem 2rem 4rem", textAlign: "center", position: "relative" }}>

          <div className="animate-up-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 100, padding: "6px 16px",
            }}>
              <span style={{ fontSize: 12 }}>🇸🇳</span>
              <span style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Conseil National de Régulation de l&apos;Audiovisuel
              </span>
            </div>
          </div>

          <div className="animate-up-2" style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              <span style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.45em", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Le Nouveau
              </span>
              <span style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #C9A84C 70%, #f0d080 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Système d&apos;Information
              </span>
              <span style={{ display: "block", color: "#C9A84C", fontSize: "0.7em", fontWeight: 700, marginTop: "0.3rem" }}>
                du CNRA
              </span>
            </h1>
          </div>

          {/* Slogan */}
          <p className="animate-up-3" style={{
            fontSize: "clamp(1.4rem, 3vw, 1.75rem)", fontWeight: 700,
            color: "#fff", maxWidth: 720, margin: "0 auto 2.5rem", lineHeight: 1.6,
            letterSpacing: "-0.01em",
          }}>
            Réguler l&apos;audiovisuel.{" "}
            <span style={{ color: "#C9A84C" }}>Protéger les citoyens.</span>{" "}
            Éduquer aux médias.
          </p>

          {/* CTA */}
          <div className="animate-up-4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#applications" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #1A3A6B, #2a5298)",
              border: "1px solid rgba(201,168,76,0.4)",
              color: "#fff", padding: "16px 36px", borderRadius: 14,
              fontSize: 17, fontWeight: 700, textDecoration: "none",
              transition: "all 0.2s",
            }}>
              Découvrir les applications <span>↓</span>
            </a>
          </div>

          {/* Description */}
          <div className="slogan-card" style={{
            maxWidth: 800, margin: "4rem auto 0",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 16, padding: "2.5rem 3rem",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.06), transparent)",
            }} />
            <p style={{ fontSize: 13, color: "#C9A84C", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
              Notre raison d&apos;être
            </p>
            <p style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.3rem)", color: "#c8d8ee",
              lineHeight: 1.8, margin: 0,
            }}>
              Une plateforme <strong style={{ color: "#ffffff" }}>d&apos;applications digitales d&apos;avant‑garde</strong> pour
              surveiller, réguler et éduquer dans le paysage audiovisuel sénégalais.
            </p>
          </div>
        </section>

        {/* Ligne décorative */}
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: BG, padding: "0 12px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A84C", margin: "0 auto" }} />
          </div>
        </div>

        {/* Grille des applications */}
        <section id="applications" style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontSize: 13, color: "#C9A84C", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
              — Portail d&apos;accès —
            </p>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff" }}>Choisissez votre application</h2>
            <p style={{ fontSize: 18, color: "#94b8d8", marginTop: 10 }}>
              Cliquez sur une application pour y accéder directement
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
            {APPS.map((app, i) => (
              <a key={app.id} href={app.url} target="_blank" rel="noopener noreferrer"
                className={`card-hover grid-card-${i}`}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textDecoration: "none", display: "block",
                  background: hovered === app.id
                    ? `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, ${app.glow} 100%)`
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${hovered === app.id ? app.border : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 20, padding: "1.75rem",
                  position: "relative", overflow: "hidden",
                  boxShadow: hovered === app.id ? `0 20px 60px ${app.glow}, 0 0 0 1px ${app.border}` : "none",
                }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${app.color}, transparent)`,
                  opacity: hovered === app.id ? 1 : 0.4, transition: "opacity 0.3s",
                }} />
                {hovered === app.id && (
                  <div style={{
                    position: "absolute", left: 0, right: 0, height: 60,
                    background: `linear-gradient(180deg, transparent, ${app.glow}, transparent)`,
                    pointerEvents: "none",
                  }} className="scan" />
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `linear-gradient(135deg, ${app.glow}, rgba(255,255,255,0.03))`,
                    border: `1px solid ${app.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, transition: "transform 0.3s",
                    transform: hovered === app.id ? "scale(1.1) rotate(-5deg)" : "scale(1)",
                  }}>
                    {app.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{app.name}</h3>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                        color: app.color, background: app.glow, border: `1px solid ${app.border}`,
                        letterSpacing: "0.05em",
                      }}>{app.tag}</span>
                    </div>
                    <p style={{ fontSize: 15, color: app.color, fontWeight: 600, marginBottom: 10, opacity: 0.9 }}>{app.tagline}</p>
                    <p style={{ fontSize: 15, color: "#c8d8ee", lineHeight: 1.7 }}>{app.desc}</p>
                  </div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: app.color, animation: "badge-glow 2s infinite" }} />
                    <span style={{ fontSize: 13, color: "#7aaac8", fontFamily: "monospace" }}>
                      cnra-{app.id}.vercel.app
                    </span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700,
                    color: hovered === app.id ? app.color : "rgba(255,255,255,0.3)", transition: "color 0.3s",
                  }}>
                    Accéder <span style={{ fontSize: 16 }}>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section mission */}
        <section style={{ maxWidth: 1280, margin: "3rem auto", padding: "0 2rem" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(42,82,152,0.45) 0%, rgba(201,168,76,0.08) 100%)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: 24, padding: "3rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,168,76,0.08), transparent)", pointerEvents: "none",
            }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13, color: "#C9A84C", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                  Notre mission
                </p>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16, lineHeight: 1.3 }}>
                  Réguler, Protéger, Éduquer
                </h2>
                <p style={{ fontSize: 17, color: "#c8d8ee", lineHeight: 1.85, maxWidth: 520 }}>
                  Le CNRA veille au respect du pluralisme, à la protection des auditeurs et téléspectateurs,
                  et à la qualité de l&apos;information diffusée sur les ondes sénégalaises.
                  Ce système numérique place ces missions au cœur de la gouvernance moderne.
                </p>
              </div>
              <div style={{ textAlign: "center", padding: "1rem 2rem" }}>
                <p style={{ fontSize: 48, fontWeight: 800, color: "#C9A84C", lineHeight: 1 }}>2025</p>
                <p style={{ fontSize: 11, color: "#94b8d8", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Mise en service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem", marginTop: "2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>🇸🇳</span>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#ddeaf7" }}>République du Sénégal</p>
                <p style={{ fontSize: 13, color: "#94b8d8" }}>Conseil National de Régulation de l&apos;Audiovisuel</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {APPS.map(app => (
                <a key={app.id} href={app.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = app.color)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                  {app.name}
                </a>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#7aaac8" }}>
              Développé par <span style={{ color: "#c8d8ee", fontWeight: 600 }}>Processingenierie</span>
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}

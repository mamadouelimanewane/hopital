"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

const APPS = [
  { id: "connect", name: "CHNCAK Connect", href: "/connect", icon: "🏥", desc: "Portail Patient & Télémédecine", hexColor: "#2563eb" },
  { id: "predict", name: "Predict-IA", href: "/predict", icon: "🧠", desc: "Tableau de Bord Direction & IA", hexColor: "#10b981" },
  { id: "pharma", name: "SmartPharma", href: "/pharma", icon: "💊", desc: "Pharmacie, Stocks & Blockchain", hexColor: "#14b8a6" },
  { id: "learn", name: "Med-Learn", href: "/learn", icon: "🎓", desc: "Université & Staffs Médicaux", hexColor: "#6366f1" },
  { id: "blood", name: "Blood-Sync", href: "/blood", icon: "🩸", desc: "Banque de Sang Connectée", hexColor: "#ef4444" },
  { id: "ambu", name: "Ambu-Track", href: "/ambu", icon: "🚑", desc: "Contrôle Aérien des Urgences", hexColor: "#f97316" },
  { id: "neuro", name: "NeuroScan-IA", href: "/neuro", icon: "🧬", desc: "Assistant Radiologique par IA", hexColor: "#8b5cf6" },
  { id: "touba", name: "Touba-Med-Care", href: "/touba", icon: "🌟", desc: "Tourisme Médical VIP", hexColor: "#eab308" },
  { id: "eco", name: "Eco-Hôpital", href: "/eco", icon: "⚡", desc: "Smart Grid & Jumeau Énergétique", hexColor: "#84cc16" },
  { id: "magal", name: "Magal-Surge", href: "/magal", icon: "🕌", desc: "Gestion de Crise Grand Magal", hexColor: "#7c3aed" },
  { id: "nutri", name: "Nutri-Care", href: "/nutri", icon: "🍽️", desc: "Suivi Nutritionnel Médical", hexColor: "#d97706" },
  { id: "psych", name: "Psych-Care", href: "/psych", icon: "🧘", desc: "Santé Mentale Anonyme & IA", hexColor: "#0891b2" },
  { id: "rehab", name: "Rehab-Track", href: "/rehab", icon: "🦴", desc: "Rééducation Post-Opératoire", hexColor: "#16a34a" },
  { id: "organes", name: "Don-Organes", href: "/organes", icon: "❤️", desc: "Registre National Donneurs", hexColor: "#e11d48" },
]

const BG = "#0a1628"
const ACCENT = "#10b981"

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() > 0.8 ? "2px" : "1px",
          height: Math.random() > 0.8 ? "2px" : "1px",
          borderRadius: "50%",
          background: Math.random() > 0.6 ? "#10b981" : "rgba(255,255,255,0.4)",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 4}s ${Math.random() * 3}s infinite`,
          opacity: Math.random() * 0.7 + 0.2,
        }} />
      ))}
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
        .au1 { animation: fadeUp 0.7s 0.1s both; } .au2 { animation: fadeUp 0.7s 0.25s both; }
        .au3 { animation: fadeUp 0.7s 0.4s both; } .au4 { animation: fadeUp 0.7s 0.55s both; }
        .au5 { animation: fadeUp 0.7s 0.7s both; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-5px); }
        .scan-fx { animation: scan-line 3s linear infinite; }
      `}</style>

      <div style={{ minHeight: "100vh", background: BG, color: "#fff", position: "relative" }}>
        {mounted && <Particles />}

        {/* Ambient gradients */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.15), transparent)" }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 50% 40% at 90% 90%, rgba(37,99,235,0.08), transparent)" }} />

        {/* HEADER */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(10,22,40,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(16,185,129,0.15)",
        }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, fontSize: 20,
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(16,185,129,0.3)",
              }}>🏥</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "0.03em" }}>
                  CHNCAK <span style={{ color: ACCENT }}>Suite</span>
                </p>
                <p style={{ fontSize: 9, color: "rgba(16,185,129,0.7)", fontWeight: 600,
                  letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Centre Hospitalier National · Touba
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: ACCENT,
                display: "inline-block", animation: "pulse-dot 2s infinite",
              }} />
              <span style={{ fontSize: 11, color: ACCENT, fontWeight: 700, letterSpacing: "0.1em" }}>
                SYSTÈME EN LIGNE
              </span>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section style={{ maxWidth: 1300, margin: "0 auto", padding: "5rem 1.5rem 4rem", textAlign: "center", position: "relative" }}>
          <div className="au1" style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 100, padding: "6px 18px",
            }}>
              <span style={{ fontSize: 13 }}>🇸🇳</span>
              <span style={{ fontSize: 11, color: ACCENT, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase" }}>
                République du Sénégal · MSAS
              </span>
            </div>
          </div>

          <div className="au2" style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              <span style={{ display: "block", fontSize: "0.42em", fontWeight: 500,
                color: "rgba(255,255,255,0.45)", letterSpacing: "0.18em",
                textTransform: "uppercase", marginBottom: "0.7rem" }}>
                L'Écosystème Digital
              </span>
              <span style={{
                background: "linear-gradient(135deg, #fff 0%, #d1fae5 50%, #10b981 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Hôpital CHNCAK
              </span>
              <span style={{ display: "block", fontSize: "0.65em", fontWeight: 700,
                color: ACCENT, marginTop: "0.4rem" }}>
                Touba · Sénégal
              </span>
            </h1>
          </div>

          <p className="au3" style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 600,
            color: "rgba(255,255,255,0.75)", maxWidth: 680, margin: "0 auto 2.5rem", lineHeight: 1.7,
          }}>
            Soigner. <span style={{ color: ACCENT }}>Innover.</span> Protéger chaque citoyen sénégalais.
          </p>

          <div className="au4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#applications" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff", padding: "14px 32px", borderRadius: 12,
              fontSize: 16, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 0 30px rgba(16,185,129,0.3)", transition: "all 0.2s",
            }}>
              Voir les 14 applications ↓
            </a>
          </div>

          <div className="au5" style={{
            maxWidth: 780, margin: "3.5rem auto 0",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 16, padding: "2rem 2.5rem",
          }}>
            <p style={{ fontSize: 12, color: ACCENT, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
              Notre Mission
            </p>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              Le CHNCAK de Touba est une infrastructure de référence nationale.
              Cet écosystème digital de <strong style={{ color: "#fff" }}>14 applications d'avant-garde</strong> place
              l'excellence médicale au cœur de la transformation numérique sénégalaise.
            </p>
          </div>
        </section>

        {/* DIVIDER */}
        <div style={{ position: "relative", maxWidth: 1300, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            background: BG, padding: "0 10px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, margin: "0 auto" }} />
          </div>
        </div>

        {/* APPS GRID */}
        <section id="applications" style={{ maxWidth: 1300, margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontSize: 12, color: ACCENT, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
              — Portail d'accès —
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, color: "#fff" }}>
              14 Applications Médicales d'État
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
              Cliquez pour accéder à chaque application
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 14 }}>
            {APPS.map((app) => (
              <Link key={app.id} href={app.href}
                className="card-hover"
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textDecoration: "none", display: "block",
                  background: hovered === app.id
                    ? `rgba(255,255,255,0.05)`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${hovered === app.id ? app.hexColor + "55" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 16, padding: "1.5rem",
                  position: "relative", overflow: "hidden",
                  boxShadow: hovered === app.id ? `0 12px 40px ${app.hexColor}22` : "none",
                }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${app.hexColor}, transparent)`,
                  opacity: hovered === app.id ? 1 : 0.3, transition: "opacity 0.3s",
                }} />
                {hovered === app.id && (
                  <div style={{
                    position: "absolute", left: 0, right: 0, height: 40,
                    background: `linear-gradient(180deg, transparent, ${app.hexColor}15, transparent)`,
                    pointerEvents: "none",
                  }} className="scan-fx" />
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0, fontSize: 22,
                    background: `${app.hexColor}15`,
                    border: `1px solid ${app.hexColor}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.3s",
                    transform: hovered === app.id ? "scale(1.1) rotate(-5deg)" : "scale(1)",
                  }}>{app.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{app.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{app.desc}</p>
                  </div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%",
                      background: app.hexColor, animation: "pulse-dot 2s infinite" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>
                      chncak/{app.id}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700,
                    color: hovered === app.id ? app.hexColor : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s" }}>
                    Ouvrir →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* MISSION BLOCK */}
        <section style={{ maxWidth: 1300, margin: "3rem auto", padding: "0 1.5rem" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(37,99,235,0.08) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 20, padding: "2.5rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{ fontSize: 12, color: ACCENT, fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                  Notre Vision 2030
                </p>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>
                  Soigner, Innover, Protéger
                </h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}>
                  Le CHNCAK de Touba est le fleuron de la santé sénégalaise.
                  Avec cet écosystème de <strong style={{ color: "#fff" }}>14 applications</strong>,
                  Processingenierie propulse l'hôpital au rang des établissements
                  hospitaliers les plus avancés technologiquement d'Afrique de l'Ouest.
                </p>
              </div>
              <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
                <p style={{ fontSize: 52, fontWeight: 900, color: ACCENT, lineHeight: 1 }}>14</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4,
                  letterSpacing: "0.1em", textTransform: "uppercase" }}>Applications</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2rem 1.5rem", marginTop: "2rem" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🇸🇳</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#ddeaf7" }}>CHNCAK · Touba</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Centre Hospitalier National Cheikh Ahmadoul Khadim</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              Développé par <span style={{ color: ACCENT, fontWeight: 700 }}>Processingenierie</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

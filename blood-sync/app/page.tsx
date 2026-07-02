"use client"
import { useState } from "react"
import Link from "next/link"

const FEATURES = [
  { icon: "🩸", title: "Poches Disponibles", desc: "Inventaire par groupe sanguin, suivi en temps réel des volumes et des dates de péremption." },
  { icon: "❤️", title: "Donneurs", desc: "Appels aux dons ciblés selon les besoins et l'éligibilité des donneurs enregistrés." },
  { icon: "🚑", title: "Urgences", desc: "Acheminement rapide des poches vers les services en cas de demande critique." },
  { icon: "❄️", title: "Conservation", desc: "Monitoring de la chaîne du froid pour garantir la sécurité transfusionnelle." },
]

const COLOR = "#ef4444"
const GLOW = "rgba(239,68,68,0.18)"

export default function LandingPage() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .25s both}
        .au3{animation:fadeUp .6s .4s both}  .au4{animation:fadeUp .6s .55s both}
        .fc{animation:fadeUp .5s both} .fc1{animation-delay:.7s} .fc2{animation-delay:.8s} .fc3{animation-delay:.9s} .fc4{animation-delay:1s}
        .card{transition:all .3s cubic-bezier(.4,0,.2,1)} .card:hover{transform:translateY(-4px)}
        .pulse{animation:pulse 2s infinite} a{text-decoration:none}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#080f20", color:"#fff", fontFamily:"system-ui,sans-serif", position:"relative", overflow:"hidden" }}>

        <div style={{ position:"fixed", inset:0, pointerEvents:"none",
          background:`radial-gradient(ellipse 80% 60% at 50% -10%, rgba(239,68,68,0.12), transparent)` }} />
        <div style={{ position:"fixed", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 50% 50% at 90% 90%, rgba(107,26,26,0.15), transparent)" }} />

        <header style={{ position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.06)",
          background:"rgba(8,15,32,0.88)", backdropFilter:"blur(20px)" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 2rem", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#7f1d1d,#ef4444)",
                border:`1px solid rgba(239,68,68,0.4)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🩸</div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"#fff", margin:0 }}>Blood-Sync</p>
                <p style={{ fontSize:9, color:COLOR, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", margin:0 }}>Banque de Sang Connectée</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="pulse" style={{ width:6, height:6, borderRadius:"50%", background:"#0ea5e9" }} />
              <span style={{ fontSize:11, color:"#0ea5e9", fontWeight:600 }}>SYSTÈME ACTIF</span>
            </div>
          </div>
        </header>

        <section style={{ maxWidth:1100, margin:"0 auto", padding:"5rem 2rem 4rem", textAlign:"center" }}>
          <div className="au1" style={{ display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(239,68,68,0.08)", border:`1px solid rgba(239,68,68,0.25)`,
            borderRadius:100, padding:"5px 14px", marginBottom:"2rem" }}>
            <span style={{ fontSize:10 }}>🇸🇳</span>
            <span style={{ fontSize:10, color:COLOR, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              Hôpital Ndamatou de Touba
            </span>
          </div>

          <div className="au2">
            <h1 style={{ fontSize:"clamp(2.2rem,5vw,4rem)", fontWeight:900, lineHeight:1.05, letterSpacing:"-0.03em", margin:"0 0 1.25rem" }}>
              <span style={{ display:"block", color:"rgba(255,255,255,0.45)", fontSize:".42em", fontWeight:500, letterSpacing:".15em", textTransform:"uppercase", marginBottom:".5rem" }}>
                Application
              </span>
              <span style={{ background:`linear-gradient(135deg,#fff 0%,#fecaca 50%,${COLOR} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Blood-Sync
              </span>
            </h1>
          </div>

          <p className="au3" style={{ fontSize:"clamp(1rem,2vw,1.2rem)", color:"rgba(255,255,255,0.5)",
            maxWidth:560, margin:"0 auto 2.5rem", lineHeight:1.8 }}>
            Système de gestion optimisée pour <strong style={{ color:"rgba(255,255,255,0.85)" }}>la banque de sang</strong> —
            suivez les stocks, les donneurs et les urgences transfusionnelles de l&apos;Hôpital Ndamatou de Touba en temps réel.
          </p>

          <div className="au4" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/dashboard" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:`linear-gradient(135deg,#7f1d1d,${COLOR})`,
              border:`1px solid rgba(239,68,68,0.5)`,
              color:"#fff", padding:"13px 32px", borderRadius:12, fontSize:15, fontWeight:700,
              boxShadow:`0 8px 30px rgba(239,68,68,0.3)`,
            }}>
              Accéder au tableau de bord →
            </Link>
          </div>
        </section>

        <section style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 2rem 3rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className={`card fc fc${i+1}`}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered===i ? `linear-gradient(135deg,rgba(255,255,255,0.05),${GLOW})` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${hovered===i ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius:16, padding:"1.5rem",
                  boxShadow: hovered===i ? `0 16px 40px ${GLOW}` : "none",
                }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#fff", margin:"0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.7, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 2rem 5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16,
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"2rem" }}>
            {[
              { value:"100%", label:"Sécurité Transfusion" },
              { value:"24/7", label:"Monitoring" },
              { value:"10K+", label:"Donneurs Inscrits" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <p style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:900, margin:"0 0 4px", color:COLOR }}>{s.value}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:0, letterSpacing:"0.04em", textTransform:"uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"1.5rem 2rem", textAlign:"center" }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", margin:0 }}>
            © 2026 Hôpital Ndamatou de Touba 🇸🇳 · Blood-Sync · Développé par <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Processingenierie</span> · contact@processingenierie.sn
          </p>
        </footer>
      </div>
    </>
  )
}

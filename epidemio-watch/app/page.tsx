"use client"
import { useState } from "react"

const STATS = [
  { label: "Cas signalés aujourd'hui", value: "47", icon: "🦠", color: "#ef4444" },
  { label: "Maladies surveillées", value: "8", icon: "📊", color: "#f59e0b" },
  { label: "Régions couvertes", value: "14", icon: "🗺️", color: "#0ea5e9" },
  { label: "Alertes actives", value: "2", icon: "🚨", color: "#dc2626" },
]

const MALADIES = [
  { nom: "Paludisme", cas: 1240, tendance: "+23%", up: true, gravite: "élevée", region: "Touba, Diourbel" },
  { nom: "Méningite", cas: 8, tendance: "stable", up: false, gravite: "critique", region: "Saint-Louis" },
  { nom: "Choléra", cas: 0, tendance: "✓ Zéro", up: false, gravite: "surveillée", region: "—" },
  { nom: "Dengue", cas: 34, tendance: "+5%", up: true, gravite: "modérée", region: "Dakar, Thiès" },
  { nom: "Rougeole", cas: 2, tendance: "-80%", up: false, gravite: "faible", region: "Ziguinchor" },
  { nom: "Tuberculose", cas: 67, tendance: "+2%", up: true, gravite: "élevée", region: "Dakar, Touba" },
  { nom: "COVID-19", cas: 12, tendance: "-45%", up: false, gravite: "faible", region: "Dakar" },
  { nom: "Fièvre jaune", cas: 0, tendance: "✓ Zéro", up: false, gravite: "surveillée", region: "—" },
]

const REGIONS = [
  { nom: "Touba / Diourbel", statut: "ALERTE", cas: 487, color: "#ef4444" },
  { nom: "Dakar", statut: "VIGILANCE", cas: 234, color: "#f59e0b" },
  { nom: "Thiès", statut: "NORMAL", cas: 67, color: "#10b981" },
  { nom: "Saint-Louis", statut: "ALERTE", cas: 89, color: "#ef4444" },
  { nom: "Ziguinchor", statut: "NORMAL", cas: 23, color: "#10b981" },
  { nom: "Kaolack", statut: "VIGILANCE", cas: 56, color: "#f59e0b" },
]

const COLOR = "#ef4444"

export default function EpidemioPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .blink{animation:blink 1s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04) !important}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <div style={{ background:"#7f1d1d", padding:"10px 1.5rem", textAlign:"center" }}>
          <p className="blink" style={{ fontSize:13, fontWeight:700, color:"#fecaca", margin:0 }}>
            🚨 ALERTE ACTIVE : Cas de paludisme en hausse de 23% — Région de Touba / Diourbel
          </p>
        </div>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(239,68,68,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#ef4444,#991b1b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🦠</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Épidémio<span style={{color:COLOR}}>-Watch</span></p>
                <p style={{ fontSize:9, color:"rgba(239,68,68,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Surveillance Épidémique · Sénégal</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:`${i*0.1}s`, background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}30`, borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 0" }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden", marginBottom:"2rem" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Tableau de surveillance par maladie</h2>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["Maladie","Cas / semaine","Tendance","Gravité","Régions"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {MALADIES.map(m => (
                  <tr key={m.nom} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{m.nom}</td>
                    <td style={{ padding:"14px 16px", fontSize:16, fontWeight:800, color: m.cas > 100 ? "#ef4444" : m.cas > 0 ? "#f59e0b" : "#10b981" }}>{m.cas.toLocaleString()}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:600, color: m.up ? "#ef4444" : "#10b981" }}>{m.tendance}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: m.gravite==="critique" ? "#ef444418" : m.gravite==="élevée" ? "#f59e0b18" : m.gravite==="modérée" ? "#0ea5e918" : m.gravite==="surveillée" ? "#6366f118" : "#10b98118", color: m.gravite==="critique" ? "#ef4444" : m.gravite==="élevée" ? "#f59e0b" : m.gravite==="modérée" ? "#0ea5e9" : m.gravite==="surveillée" ? "#6366f1" : "#10b981", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{m.gravite}</span>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{m.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Statut par région</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
            {REGIONS.map(r => (
              <div key={r.nom} className="fade" style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${r.color}30`, borderRadius:12, padding:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{r.nom}</span>
                  <span style={{ background:`${r.color}18`, color:r.color, padding:"2px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{r.statut}</span>
                </div>
                <p style={{ fontSize:24, fontWeight:800, color:r.color, margin:0 }}>{r.cas} <span style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.35)" }}>cas</span></p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

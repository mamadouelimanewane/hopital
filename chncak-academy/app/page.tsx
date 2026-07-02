"use client"
import { useState } from "react"

const STATS = [
  { label: "Apprenants actifs", value: "247", icon: "👨‍⚕️", color: "#6366f1" },
  { label: "Modules disponibles", value: "34", icon: "📚", color: "#0ea5e9" },
  { label: "Taux complétion", value: "89%", icon: "📊", color: "#10b981" },
  { label: "Formateurs", value: "12", icon: "🎓", color: "#f59e0b" },
]

const FORMATIONS = [
  { titre: "Gestion des urgences cardiaques", formateur: "Pr. Ibrahima Ndiaye", duree: "24h", niveau: "Expert", inscrits: 34, statut: "En cours", progress: 67, color: "#ef4444" },
  { titre: "Soins en néonatologie", formateur: "Dr. Fatou Mbaye", duree: "18h", niveau: "Intermédiaire", inscrits: 28, statut: "En cours", progress: 45, color: "#ec4899" },
  { titre: "Techniques de dialyse", formateur: "Dr. Ousmane Fall", duree: "16h", niveau: "Expert", inscrits: 19, statut: "Disponible", progress: 0, color: "#0ea5e9" },
  { titre: "Radiologie numérique & IA", formateur: "Pr. Amadou Diallo", duree: "20h", niveau: "Expert", inscrits: 42, statut: "En cours", progress: 82, color: "#8b5cf6" },
  { titre: "Gestion médicale du Magal", formateur: "Dr. Serigne Bamba Ndiaye", duree: "12h", niveau: "Débutant", inscrits: 67, statut: "Disponible", progress: 0, color: "#d97706" },
  { titre: "Santé mentale en milieu hospitalier", formateur: "Dr. Aïssatou Diop", duree: "14h", niveau: "Intermédiaire", inscrits: 23, statut: "À venir", progress: 0, color: "#06b6d4" },
  { titre: "Pharmacovigilance avancée", formateur: "Dr. Moussa Sow", duree: "10h", niveau: "Intermédiaire", inscrits: 31, statut: "Disponible", progress: 0, color: "#14b8a6" },
  { titre: "Chirurgie mini-invasive", formateur: "Pr. Cheikh Tidiane Dieng", duree: "30h", niveau: "Expert", inscrits: 12, statut: "À venir", progress: 0, color: "#16a34a" },
]

const COLOR = "#6366f1"

export default function AcademyPage() {
  const [filter, setFilter] = useState("Tous")
  const filtered = filter === "Tous" ? FORMATIONS : FORMATIONS.filter(f => f.statut === filter)

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .card{transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer} .card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(99,102,241,0.15)}
        button{cursor:pointer;border:none}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"'Inter',system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(99,102,241,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 0 20px rgba(99,102,241,0.3)" }}>🎓</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Ndamatou <span style={{color:COLOR}}>Academy</span></p>
                <p style={{ fontSize:9, color:"rgba(99,102,241,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Formation Médicale Continue · Touba</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:COLOR }} />
              <span style={{ fontSize:11, color:COLOR, fontWeight:700 }}>PLATEFORME ACTIVE</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2.5rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:`${i*0.1}s`, background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}30`, borderRadius:16, padding:"1.5rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                    <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 0" }}>{s.value}</p>
                  </div>
                  <span style={{ fontSize:28 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:12 }}>
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, margin:0 }}>Catalogue des Formations</h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", margin:0 }}>{filtered.length} formations</p>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {["Tous","En cours","Disponible","À venir"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ background: filter===f ? COLOR+"22" : "rgba(255,255,255,0.04)", color: filter===f ? COLOR : "rgba(255,255,255,0.5)", border:`1px solid ${filter===f ? COLOR+"50" : "rgba(255,255,255,0.08)"}`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, transition:"all 0.2s" }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,340px), 1fr))", gap:16 }}>
            {filtered.map((f, i) => (
              <div key={f.titre} className="card fade" style={{ animationDelay:`${i*0.08}s`, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${f.color}, transparent)`, opacity:0.5 }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, color:"#fff", margin:0, lineHeight:1.4, flex:1, marginRight:12 }}>{f.titre}</h3>
                  <span style={{ background:`${f.statut==="En cours" ? "#0ea5e9" : f.statut==="Disponible" ? "#10b981" : "#f59e0b"}18`, color: f.statut==="En cours" ? "#0ea5e9" : f.statut==="Disponible" ? "#10b981" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>{f.statut}</span>
                </div>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:"0 0 12px" }}>👤 {f.formateur} · ⏱ {f.duree} · 📊 {f.niveau}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{f.inscrits} inscrits</span>
                  {f.progress > 0 && <span style={{ fontSize:11, color:f.color, fontWeight:700 }}>{f.progress}%</span>}
                </div>
                {f.progress > 0 && (
                  <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                    <div style={{ width:`${f.progress}%`, height:"100%", background:f.color, borderRadius:100, transition:"width 1s" }} />
                  </div>
                )}
                <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", gap:8 }}>
                  {f.statut === "En cours" && <button style={{ background:`${f.color}18`, color:f.color, border:`1px solid ${f.color}30`, borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700 }}>Continuer</button>}
                  {f.statut === "Disponible" && <button style={{ background:`${COLOR}18`, color:COLOR, border:`1px solid ${COLOR}30`, borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700 }}>S'inscrire</button>}
                  {f.statut === "À venir" && <button style={{ background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700 }}>Bientôt</button>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

"use client"
const STATS = [
  { label: "Score Qualité Global", value: "87.3%", icon: "🏆", color: "#1d4ed8" },
  { label: "Indicateurs suivis", value: "234", icon: "📊", color: "#0ea5e9" },
  { label: "Non-conformités actives", value: "12", icon: "⚠️", color: "#f59e0b" },
  { label: "Audits planifiés", value: "3", icon: "📋", color: "#10b981" },
]

const DEPARTEMENTS = [
  { nom: "Urgences", score: 82, tendance: "+2%", nc: 4, resp: "Dr. Ndiaye", color: "#ef4444" },
  { nom: "Chirurgie", score: 91, tendance: "+1%", nc: 1, resp: "Pr. Fall", color: "#10b981" },
  { nom: "Maternité", score: 85, tendance: "-1%", nc: 3, resp: "Dr. Diop", color: "#ec4899" },
  { nom: "Hémodialyse", score: 94, tendance: "stable", nc: 0, resp: "Dr. Mbaye", color: "#0ea5e9" },
  { nom: "Pharmacie", score: 88, tendance: "+3%", nc: 2, resp: "Dr. Sow", color: "#8b5cf6" },
  { nom: "Laboratoire", score: 96, tendance: "+1%", nc: 0, resp: "Dr. Diallo", color: "#0369a1" },
  { nom: "Radiologie", score: 89, tendance: "stable", nc: 2, resp: "Pr. Kane", color: "#f59e0b" },
]

const ACTIONS = [
  { action: "Révision des protocoles d'hygiène des mains", dept: "Urgences", prio: "Haute", deadline: "15 Juil. 2026", resp: "Fatou Bintou (Infirmière Chef)" },
  { action: "Mise à jour de la cartographie des risques", dept: "Hôpital entier", prio: "Moyenne", deadline: "30 Juil. 2026", resp: "Comité Qualité" },
  { action: "Calibration des équipements d'imagerie", dept: "Radiologie", prio: "Critique", deadline: "10 Juil. 2026", resp: "Service Biomédical" },
]

const COLOR = "#1d4ed8"

export default function QualitePage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(29,78,216,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#1d4ed8,#1e3a8a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏆</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Qualité<span style={{color:"#60a5fa"}}>-JCI</span></p>
                <p style={{ fontSize:9, color:"rgba(96,165,250,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Direction Qualité · Hôpital Ndamatou</p>
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

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,600px), 1fr))", gap:20 }}>
            <div className="fade" style={{ animationDelay:"0.3s", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Performances par département</h2>
              {DEPARTEMENTS.map(d => (
                <div key={d.nom} style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                    <span style={{ fontWeight:700, color:"#fff" }}>{d.nom}</span>
                    <span style={{ color:d.color, fontWeight:700 }}>{d.score}%</span>
                  </div>
                  <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden", marginBottom:6 }}>
                    <div style={{ width:`${d.score}%`, height:"100%", background:d.color, borderRadius:100 }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)" }}>
                    <span>Resp: {d.resp}</span>
                    <span>Tendance: {d.tendance} | NC: <span style={{color: d.nc>0?"#ef4444":"#10b981", fontWeight:700}}>{d.nc}</span></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="fade" style={{ animationDelay:"0.4s", display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem" }}>
                <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Satisfaction Patient (NPS)</h2>
                <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ width:80, height:80, borderRadius:"50%", border:"4px solid #10b981", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#10b981" }}>67</div>
                  <div>
                    <p style={{ fontSize:14, color:"rgba(255,255,255,0.7)", margin:"0 0 4px" }}>Note moyenne : <strong style={{color:"#fff"}}>4.2 / 5</strong></p>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>Sur 1 240 enquêtes ce mois-ci.</p>
                    <div style={{ display:"flex", gap:4, marginTop:8 }}>
                      {["⭐","⭐","⭐","⭐","☆"].map((s,i) => <span key={i} style={{fontSize:16}}>{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem", flex:1 }}>
                <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Actions correctives prioritaires</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {ACTIONS.map(a => (
                    <div key={a.action} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <h4 style={{ fontSize:13, fontWeight:700, color:"#fff", margin:0 }}>{a.action}</h4>
                        <span style={{ background: a.prio==="Critique" ? "#ef444418" : a.prio==="Haute" ? "#f59e0b18" : "#3b82f618", color: a.prio==="Critique" ? "#ef4444" : a.prio==="Haute" ? "#f59e0b" : "#3b82f6", padding:"2px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{a.prio}</span>
                      </div>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0 }}>Département: {a.dept} · Resp: {a.resp} · 🕒 {a.deadline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

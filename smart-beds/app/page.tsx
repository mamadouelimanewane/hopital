"use client"
const STATS = [
  { label: "Lits Total", value: "487", icon: "🛏️", color: "#3b82f6" },
  { label: "Occupés (Taux)", value: "423 (87%)", icon: "👤", color: "#ef4444" },
  { label: "Disponibles", value: "52", icon: "✅", color: "#10b981" },
  { label: "En nettoyage", value: "12", icon: "🧹", color: "#f59e0b" },
]

const SERVICES = [
  { nom: "Médecine Interne", total: 60, occ: 58, net: 0, color: "#ef4444", status: "Saturé" },
  { nom: "Chirurgie", total: 48, occ: 35, net: 4, color: "#10b981", status: "Fluide" },
  { nom: "Urgences", total: 24, occ: 24, net: 0, color: "#ef4444", status: "Saturé (Priorité)" },
  { nom: "Maternité", total: 40, occ: 32, net: 2, color: "#3b82f6", status: "Normal" },
  { nom: "Hémodialyse", total: 32, occ: 28, net: 1, color: "#3b82f6", status: "Normal" },
]

export default function BedsPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(59,130,246,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#1e40af)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🛏️</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Smart <span style={{color:"#60a5fa"}}>Beds</span></p>
                <p style={{ fontSize:9, color:"rgba(96,165,250,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Gestion des Lits · Hôpital Ndamatou</p>
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

          <h2 style={{ fontSize:20, fontWeight:800, margin:"0 0 1rem" }}>Occupation par Service</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,350px), 1fr))", gap:20 }}>
            {SERVICES.map(s => {
              const libre = s.total - s.occ - s.net;
              return (
                <div key={s.nom} className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div>
                      <h3 style={{ fontSize:16, fontWeight:700, margin:0 }}>{s.nom}</h3>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>{s.total} lits totaux</p>
                    </div>
                    <span style={{ background:`${s.color}18`, color:s.color, padding:"3px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{s.status}</span>
                  </div>
                  
                  {/* Visual grid of beds (max 60 blocks for display) */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:16 }}>
                    {Array.from({length: Math.min(s.total, 60)}).map((_, i) => {
                      let bg = "#10b981"; // libre
                      if (i < s.occ) bg = "#ef4444"; // occupe
                      else if (i < s.occ + s.net) bg = "#f59e0b"; // nettoyage
                      return <div key={i} style={{ width:12, height:12, borderRadius:3, background:bg, opacity:0.8 }} />
                    })}
                  </div>
                  
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:12 }}>
                    <span style={{ color:"#ef4444", fontWeight:600 }}>{s.occ} Occupés</span>
                    <span style={{ color:"#f59e0b", fontWeight:600 }}>{s.net} Nettoyage</span>
                    <span style={{ color:"#10b981", fontWeight:600 }}>{libre} Libres</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  )
}

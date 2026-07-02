"use client"
const STATS = [
  { label: "Établissements connectés", value: "14", icon: "🏥", color: "#0891b2" },
  { label: "Dossiers partagés", value: "12.8k", icon: "📁", color: "#8b5cf6" },
  { label: "Médecins réseau", value: "342", icon: "👨‍⚕️", color: "#10b981" },
  { label: "Uptime réseau", value: "99.9%", icon: "⚡", color: "#0ea5e9" },
]

const RESEAU = [
  { nom: "Hôpital Ndamatou (Principal)", ville: "Touba", type: "Niveau 3", statut: "EN LIGNE", latence: "12ms", patients: 8470, color: "#10b981" },
  { nom: "Hôpital Principal", ville: "Dakar", type: "Niveau 3", statut: "EN LIGNE", latence: "18ms", patients: 12400, color: "#10b981" },
  { nom: "Hôpital de Fann", ville: "Dakar", type: "Niveau 3", statut: "EN LIGNE", latence: "22ms", patients: 6500, color: "#10b981" },
  { nom: "Hôpital Régional", ville: "Thiès", type: "Niveau 2", statut: "EN LIGNE", latence: "15ms", patients: 4200, color: "#10b981" },
  { nom: "Centre de Santé Gare", ville: "Touba", type: "Niveau 1", statut: "EN LIGNE", latence: "5ms", patients: 850, color: "#10b981" },
  { nom: "Poste de Santé Darou Khoudoss", ville: "Touba", type: "Niveau 0", statut: "MAINTENANCE", latence: "—", patients: 120, color: "#f59e0b" },
  { nom: "Hôpital Régional", ville: "Saint-Louis", type: "Niveau 2", statut: "HORS LIGNE", latence: "—", patients: 3100, color: "#ef4444" },
]

export default function ReseauPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(8,145,178,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0891b2,#0f766e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌐</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Réseau <span style={{color:"#22d3ee"}}>Santé SN</span></p>
                <p style={{ fontSize:9, color:"rgba(34,211,238,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Interconnexion Hospitalière du Sénégal</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:"#10b981" }} />
              <span style={{ fontSize:11, color:"#10b981", fontWeight:700 }}>SYNCHRONISÉ</span>
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

          <div className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden", marginBottom:"2rem" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Centres et Hôpitaux Connectés</h2>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>Mise à jour en temps réel via DVPN Médical</p>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["Établissement","Ville","Type","Patients Suivis","Latence API","Statut"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {RESEAU.map(r => (
                  <tr key={r.nom} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{r.nom}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{r.ville}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{r.type}</td>
                    <td style={{ padding:"14px 16px", fontSize:14, color:"#0891b2", fontWeight:600 }}>{r.patients.toLocaleString()}</td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"monospace" }}>{r.latence}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background:`${r.color}18`, color:r.color, padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:800 }}>{r.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  )
}

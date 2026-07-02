"use client"
const STATS = [
  { label: "Effectif Total", value: "847", icon: "👥", color: "#4338ca" },
  { label: "Médecins & Spécialistes", value: "142", icon: "🩺", color: "#0ea5e9" },
  { label: "Taux de présence", value: "94.2%", icon: "✅", color: "#10b981" },
  { label: "Postes vacants", value: "12", icon: "💼", color: "#f59e0b" },
]

const PERSONNEL = [
  { nom: "Dr. Ibrahima Ndiaye", grade: "Médecin Chef / Cardiologue", service: "Cardiologie", statut: "Présent", color: "#10b981" },
  { nom: "Pr. Fatou Mbaye", grade: "Chirurgienne", service: "Bloc Opératoire", statut: "Au Bloc", color: "#3b82f6" },
  { nom: "Sokhna Fall", grade: "Infirmière Diplômée d'État (IDE)", service: "Urgences", statut: "Présent", color: "#10b981" },
  { nom: "Moussa Diop", grade: "Aide-soignant", service: "Médecine Interne", statut: "Congé", color: "#f59e0b" },
  { nom: "Dr. Ousmane Sy", grade: "Néphrologue", service: "Hémodialyse", statut: "Garde de Nuit", color: "#8b5cf6" },
  { nom: "Aminata Kane", grade: "Technicienne de Labo", service: "Laboratoire", statut: "Présent", color: "#10b981" },
]

const RECRUTEMENTS = [
  { poste: "Médecin Urgentiste", type: "CDI", service: "Urgences", deadline: "30 Juil. 2026" },
  { poste: "Infirmier(e) Réanimation", type: "CDD 6 mois", service: "Réanimation", deadline: "15 Juil. 2026" },
  { poste: "Technicien Biomédical", type: "CDI", service: "Maintenance", deadline: "01 Août 2026" },
]

const COLOR = "#4338ca"

export default function RHPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(67,56,202,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#4338ca,#312e81)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👥</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>RH <span style={{color:"#818cf8"}}>Médical</span></p>
                <p style={{ fontSize:9, color:"rgba(129,140,248,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Ressources Humaines · Hôpital Ndamatou</p>
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

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,700px), 1fr))", gap:20 }}>
            <div className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
              <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Annuaire du Personnel</h2>
                <button style={{ background:"#4338ca", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700 }}>+ Nouveau</button>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                  {["Nom","Grade / Spécialité","Service","Statut"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {PERSONNEL.map(p => (
                    <tr key={p.nom} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{p.nom}</td>
                      <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{p.grade}</td>
                      <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{p.service}</td>
                      <td style={{ padding:"14px 16px" }}>
                        <span style={{ background:`${p.color}18`, color:p.color, padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{p.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="fade" style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem" }}>
                <h2 style={{ fontSize:16, fontWeight:800, margin:"0 0 1rem" }}>📅 Planning des Gardes (Aujourd'hui)</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ background:"rgba(255,255,255,0.03)", padding:"12px", borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><p style={{margin:0, fontSize:14, fontWeight:700}}>Urgences</p><p style={{margin:0, fontSize:12, color:"rgba(255,255,255,0.4)"}}>20h00 - 08h00</p></div>
                    <div style={{textAlign:"right"}}><p style={{margin:0, fontSize:13, color:"#fff"}}>Dr. Oumar Sall</p><p style={{margin:0, fontSize:11, color:"#10b981"}}>+ 3 IDE</p></div>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.03)", padding:"12px", borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><p style={{margin:0, fontSize:14, fontWeight:700}}>Maternité</p><p style={{margin:0, fontSize:12, color:"rgba(255,255,255,0.4)"}}>20h00 - 08h00</p></div>
                    <div style={{textAlign:"right"}}><p style={{margin:0, fontSize:13, color:"#fff"}}>Dr. Awa Diagne</p><p style={{margin:0, fontSize:11, color:"#10b981"}}>+ 2 Sages-femmes</p></div>
                  </div>
                </div>
              </div>

              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem", flex:1 }}>
                <h2 style={{ fontSize:16, fontWeight:800, margin:"0 0 1rem" }}>🎯 Recrutements ouverts</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {RECRUTEMENTS.map(r => (
                    <div key={r.poste} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <div>
                        <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>{r.poste}</p>
                        <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>{r.service} · Clôture : {r.deadline}</p>
                      </div>
                      <span style={{ background:"#4338ca18", color:"#818cf8", padding:"3px 8px", borderRadius:6, fontSize:11, fontWeight:700 }}>{r.type}</span>
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

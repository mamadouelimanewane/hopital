"use client"
const STATS = [
  { label: "Analyses en attente", value: "342", icon: "⏳", color: "#f59e0b" },
  { label: "Résultats prêts", value: "89", icon: "✅", color: "#10b981" },
  { label: "Automates connectés", value: "12", icon: "🔬", color: "#0ea5e9" },
  { label: "Délai moyen", value: "4.2h", icon: "⏱️", color: "#6366f1" },
]

const ANALYSES = [
  { num: "PRE-4827", patient: "Mame Diarra Seck", type: "NFS complète", automate: "Sysmex XN-550", priorite: "Normale", temps: "45 min", statut: "En cours" },
  { num: "PRE-4828", patient: "Ibrahima Koné", type: "Biochimie", automate: "Cobas c311", priorite: "Urgente", temps: "20 min", statut: "En cours" },
  { num: "PRE-4829", patient: "Sokhna Mbaye", type: "Sérologie VIH/VHB", automate: "Architect i1000", priorite: "Normale", temps: "2h", statut: "En attente" },
  { num: "PRE-4830", patient: "Oumar Ndiaye", type: "Bactériologie (ECBU)", automate: "BacT/ALERT", priorite: "Normale", temps: "24h", statut: "En culture" },
  { num: "PRE-4831", patient: "Fatou Diallo", type: "Glycémie à jeun", automate: "Cobas c311", priorite: "Normale", temps: "—", statut: "Résultat prêt" },
  { num: "PRE-4832", patient: "Cheikh Tidiane Sy", type: "Bilan rénal complet", automate: "Cobas c311", priorite: "Urgente", temps: "15 min", statut: "En cours" },
  { num: "PRE-4833", patient: "Aminata Touré", type: "TSH / T3 / T4", automate: "Architect i1000", priorite: "Normale", temps: "3h", statut: "En attente" },
]

const CRITIQUES = [
  { patient: "Ibrahima Koné", analyse: "Créatinine", valeur: "487 µmol/L", ref: "60-110", gravite: "CRITIQUE" },
  { patient: "Cheikh T. Sy", analyse: "Kaliémie", valeur: "6.8 mmol/L", ref: "3.5-5.0", gravite: "DANGER" },
  { patient: "Ousmane Faye", analyse: "Hémoglobine", valeur: "5.2 g/dL", ref: "12-17", gravite: "CRITIQUE" },
]

const COLOR = "#0369a1"

export default function LabPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(3,105,161,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0369a1,#075985)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🧪</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Lab <span style={{color:COLOR}}>Connect</span></p>
                <p style={{ fontSize:9, color:"rgba(3,105,161,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Laboratoire Connecté · Hôpital Ndamatou</p>
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
          {CRITIQUES.length > 0 && (
            <div className="fade" style={{ animationDelay:"0.4s", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:"#ef4444", margin:"0 0 12px" }}>🚨 Résultats critiques à valider</h3>
              {CRITIQUES.map(c => (
                <div key={c.patient+c.analyse} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(239,68,68,0.1)" }}>
                  <div>
                    <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{c.patient}</span>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>{c.analyse}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:14, fontWeight:800, color:"#ef4444" }}>{c.valeur}</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>réf: {c.ref}</span>
                    <span style={{ background:"#ef444418", color:"#ef4444", padding:"2px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{c.gravite}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Analyses en cours</h2>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["N° Prélèvement","Patient","Type","Automate","Priorité","Temps","Statut"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ANALYSES.map(a => (
                  <tr key={a.num} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:12, fontWeight:600, color:COLOR, fontFamily:"monospace" }}>{a.num}</td>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{a.patient}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{a.type}</td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:"rgba(255,255,255,0.45)" }}>{a.automate}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: a.priorite==="Urgente" ? "#ef444418" : "rgba(255,255,255,0.04)", color: a.priorite==="Urgente" ? "#ef4444" : "rgba(255,255,255,0.5)", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{a.priorite}</span>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{a.temps}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: a.statut==="Résultat prêt" ? "#10b98118" : a.statut.includes("cours") ? "#0ea5e918" : a.statut==="En culture" ? "#8b5cf618" : "#f59e0b18", color: a.statut==="Résultat prêt" ? "#10b981" : a.statut.includes("cours") ? "#0ea5e9" : a.statut==="En culture" ? "#8b5cf6" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{a.statut}</span>
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

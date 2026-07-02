"use client"
const STATS = [
  { label: "Encaissé Aujourd'hui", value: "2.4M", unit: "FCFA", icon: "💳", color: "#15803d" },
  { label: "Actes facturés", value: "312", unit: "actes", icon: "📄", color: "#0ea5e9" },
  { label: "Dossiers en attente", value: "47", unit: "dossiers", icon: "⏳", color: "#f59e0b" },
  { label: "Taux recouvrement", value: "89%", unit: "ce mois", icon: "📈", color: "#8b5cf6" },
]

const FACTURES = [
  { num: "F26-07-001", patient: "Abdoulaye Diop", acte: "Scanner Cérébral (Forfait)", montant: 45000, assurance: "CMU (Couverture Maladie Univ.)", priseEnCharge: 80, reste: 9000, statut: "Payé" },
  { num: "F26-07-002", patient: "Aminata Sall", acte: "Césarienne + Séjour 3J", montant: 150000, assurance: "IPM Privé (Sonatel)", priseEnCharge: 100, reste: 0, statut: "En cours" },
  { num: "F26-07-003", patient: "Moussa Sène", acte: "Consultation Cardiologie", montant: 10000, assurance: "Aucune (Paiement direct)", priseEnCharge: 0, reste: 10000, statut: "Payé" },
  { num: "F26-07-004", patient: "Fatou Kane", acte: "Séance Hémodialyse", montant: 10000, assurance: "Aar Li Nu Bokk / Gratuité", priseEnCharge: 100, reste: 0, statut: "Payé" },
  { num: "F26-07-005", patient: "Oumar Ndiaye", acte: "Intervention Orthopédique", montant: 250000, assurance: "IPM Privé (CSS)", priseEnCharge: 80, reste: 50000, statut: "Impayé (Relance 1)" },
]

const COLOR = "#15803d"

export default function FactuPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade{animation:fadeUp .5s both}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(21,128,61,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#15803d,#14532d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💳</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Factu<span style={{color:"#4ade80"}}>Care</span></p>
                <p style={{ fontSize:9, color:"rgba(74,222,128,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Facturation & Recouvrement · Hôpital Ndamatou</p>
              </div>
            </div>
            <button style={{ background:COLOR, color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Nouvelle Facture</button>
          </div>
        </header>
        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:`${i*0.1}s`, background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}30`, borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 2px" }}>{s.value}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:0 }}>{s.unit}</p>
              </div>
            ))}
          </div>

          <div className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Factures Récentes</h2>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                  {["N° Facture","Patient / Acte","Montant Total","Couverture (Assurance)","Reste à Payer","Statut"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {FACTURES.map(f => (
                    <tr key={f.num} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding:"14px 16px", fontSize:12, fontWeight:600, color:COLOR, fontFamily:"monospace" }}>{f.num}</td>
                      <td style={{ padding:"14px 16px" }}>
                        <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:"0 0 2px" }}>{f.patient}</p>
                        <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:0 }}>{f.acte}</p>
                      </td>
                      <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{f.montant.toLocaleString()} F</td>
                      <td style={{ padding:"14px 16px" }}>
                        <p style={{ fontSize:13, color:"#fff", margin:"0 0 2px" }}>{f.assurance}</p>
                        <span style={{ background:"rgba(255,255,255,0.1)", padding:"2px 6px", borderRadius:4, fontSize:10, color:"#4ade80" }}>{f.priseEnCharge}% pris en charge</span>
                      </td>
                      <td style={{ padding:"14px 16px", fontSize:14, fontWeight:800, color: f.reste > 0 ? "#ef4444" : "#10b981" }}>{f.reste.toLocaleString()} F</td>
                      <td style={{ padding:"14px 16px" }}>
                        <span style={{ background: f.statut==="Payé" ? "#10b98118" : f.statut==="En cours" ? "#0ea5e918" : "#ef444418", color: f.statut==="Payé" ? "#10b981" : f.statut==="En cours" ? "#0ea5e9" : "#ef4444", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{f.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

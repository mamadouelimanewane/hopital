"use client"
import { useState, useEffect } from "react"

const STATS = [
  { label: "Analyses aujourd'hui", value: "1 240", icon: "🧠", color: "#7c3aed" },
  { label: "Précision IA", value: "94.7%", icon: "🎯", color: "#10b981" },
  { label: "Temps moyen", value: "3.2s", icon: "⚡", color: "#f59e0b" },
  { label: "Modèles IA actifs", value: "8", icon: "🤖", color: "#0ea5e9" },
]

const ANALYSES = [
  { patient: "Ousmane Diop", type: "Radio thoracique", resultat: "Pneumonie suspectée", confiance: 89, medecin: "Dr. Ndiaye", statut: "validé" },
  { patient: "Aïssatou Fall", type: "ECG 12 dérivations", resultat: "Rythme sinusal normal", confiance: 97, medecin: "Dr. Mbaye", statut: "validé" },
  { patient: "Amadou Ndour", type: "IRM cérébrale", resultat: "Micro-anévrisme détecté", confiance: 92, medecin: "Pr. Diallo", statut: "en attente" },
  { patient: "Sokhna Mbaye", type: "Dermatoscopie", resultat: "Lésion bénigne", confiance: 85, medecin: "Dr. Sow", statut: "validé" },
  { patient: "Ibrahima Sy", type: "Fond d'œil", resultat: "Rétinopathie diabétique stade 2", confiance: 91, medecin: "Dr. Fall", statut: "en attente" },
  { patient: "Mariama Bâ", type: "Radio thoracique", resultat: "Normal — RAS", confiance: 98, medecin: "Dr. Ndiaye", statut: "validé" },
]

const MODELES = [
  { nom: "ChestXpert v3", domaine: "Radiologie thoracique", precision: "94.2%", maj: "28/06/2026" },
  { nom: "CardioNet-SN", domaine: "ECG & cardiologie", precision: "96.1%", maj: "15/06/2026" },
  { nom: "NeuroScan-AI", domaine: "IRM cérébrale", precision: "92.8%", maj: "01/07/2026" },
  { nom: "DermaScope-ML", domaine: "Dermatologie", precision: "88.5%", maj: "20/06/2026" },
  { nom: "RetinAI", domaine: "Ophtalmologie", precision: "91.3%", maj: "10/06/2026" },
  { nom: "BioMarker-Detect", domaine: "Analyses biologiques", precision: "95.7%", maj: "25/06/2026" },
  { nom: "PathFinder v2", domaine: "Anatomopathologie", precision: "89.4%", maj: "05/06/2026" },
  { nom: "MalarIA", domaine: "Détection paludisme", precision: "97.3%", maj: "30/06/2026" },
]

const COLOR = "#7c3aed"

export default function IADiagPage() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setProgress(p => p < 100 ? p + 2 : 100), 150)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes scan { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
        .scanbar{background:linear-gradient(90deg,transparent,#7c3aed,transparent);background-size:200% 100%;animation:scan 2s linear infinite}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(124,58,237,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#7c3aed,#5b21b6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 0 20px rgba(124,58,237,0.3)" }}>🧠</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Ndamatou <span style={{color:COLOR}}>IA</span></p>
                <p style={{ fontSize:9, color:"rgba(124,58,237,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Intelligence Artificielle Médicale · Touba</p>
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
          <div className="fade" style={{ animationDelay:"0.4s", background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>🔬 Analyse IRM en cours — Patient: Amadou Ndour</p>
              <span style={{ fontSize:16, fontWeight:800, color:COLOR }}>{progress}%</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", borderRadius:100, transition:"width 0.15s" }} className="scanbar" />
            </div>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"8px 0 0" }}>{progress < 100 ? "Analyse des coupes axiales, sagittales et coronales..." : "✅ Analyse terminée — Résultats transmis au Pr. Diallo"}</p>
          </div>
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden", marginBottom:"2rem" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Analyses récentes</h2>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["Patient","Type","Résultat IA","Confiance","Médecin","Statut"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ANALYSES.map(a => (
                  <tr key={a.patient+a.type} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{a.patient}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{a.type}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:600, color: a.resultat.includes("Normal") || a.resultat.includes("bénigne") ? "#10b981" : "#f59e0b" }}>{a.resultat}</td>
                    <td style={{ padding:"14px 16px" }}><span style={{ fontSize:14, fontWeight:800, color: a.confiance > 90 ? "#10b981" : "#f59e0b" }}>{a.confiance}%</span></td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{a.medecin}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: a.statut==="validé" ? "#10b98118" : "#f59e0b18", color: a.statut==="validé" ? "#10b981" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{a.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Modèles IA déployés</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:12 }}>
            {MODELES.map(m => (
              <div key={m.nom} className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>{m.nom}</p>
                  <span style={{ fontSize:13, fontWeight:800, color:"#10b981" }}>{m.precision}</span>
                </div>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:"4px 0 0" }}>{m.domaine} · Mis à jour le {m.maj}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

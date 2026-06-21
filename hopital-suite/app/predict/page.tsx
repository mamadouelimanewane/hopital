"use client"
import { useState, useEffect } from "react"

const joursData = [
  { jour: "Lun", admissions: 45, isToday: false },
  { jour: "Mar", admissions: 38, isToday: false },
  { jour: "Mer", admissions: 52, isToday: true },
  { jour: "Jeu", admissions: 61, isToday: false },
  { jour: "Ven", admissions: 49, isToday: false },
  { jour: "Sam", admissions: 33, isToday: false },
  { jour: "Dim", admissions: 28, isToday: false },
]

const alertesPredictives = [
  { id: 1, type: "SEPSIS", patient: "Patient #4821", message: "Risque sepsis détecté — Score SOFA en hausse", probabilite: 87, couleur: "#ef4444", urgence: "CRITIQUE" },
  { id: 2, type: "RÉADMISSION", patient: "Patient #3942", message: "Réadmission probable dans 72h post-chirurgie", probabilite: 74, couleur: "#f59e0b", urgence: "ÉLEVÉ" },
  { id: 3, type: "PIC DEMANDE", patient: "Service Urgences", message: "Pic de demande prévu dans 48h (+40% volume)", probabilite: 91, couleur: "#6366f1", urgence: "PLANIFICATION" },
  { id: 4, type: "ÉQUIPEMENT", patient: "IRM Principal", message: "Défaillance équipement IRM — Maintenance requise", probabilite: 68, couleur: "#f59e0b", urgence: "MAINTENANCE" },
]

const modelesIA = [
  { nom: "PredSepsis v3.2", type: "Classification binaire", precision: 94.2, update: "21/06/2026", statut: "actif" },
  { nom: "ReAdmit-30 v2.1", type: "Régression logistique", precision: 88.7, update: "19/06/2026", statut: "actif" },
  { nom: "DemandePred v1.8", type: "Séries temporelles LSTM", precision: 91.5, update: "20/06/2026", statut: "actif" },
  { nom: "EquipMaint v1.3", type: "Forêt aléatoire", precision: 82.4, update: "18/06/2026", statut: "actif" },
  { nom: "MortalitéICU v2.0", type: "XGBoost", precision: 96.1, update: "21/06/2026", statut: "entraînement" },
]

export default function PredictPage() {
  const [loading, setLoading] = useState(false)
  const [precision, setPrecision] = useState(94.2)
  const [analyseComplete, setAnalyseComplete] = useState(false)

  const maxAdmissions = Math.max(...joursData.map(j => j.admissions))

  useEffect(() => {
    const interval = setInterval(() => {
      setPrecision(prev => {
        const next = Math.round((prev + 0.1) * 10) / 10
        return next > 99.9 ? 94.2 : next
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  function lancerAnalyse() {
    setLoading(true)
    setAnalyseComplete(false)
    setTimeout(() => {
      setLoading(false)
      setAnalyseComplete(true)
    }, 2800)
  }

  return (
    <div style={{ background: "#050d1a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(99,102,241,0.03))", borderBottom:"1px solid rgba(99,102,241,0.2)", padding:"2rem 1.5rem" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:40, padding:"4px 14px", marginBottom:12 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1", display:"inline-block", animation:"pulse 2s infinite" }}></span>
                <span style={{ color:"#818cf8", fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>INTELLIGENCE ARTIFICIELLE ACTIVE</span>
              </div>
              <h1 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:800, color:"#e2e8f0", margin:0, lineHeight:1.2 }}>
                Predict IA — <span style={{ color:"#6366f1" }}>Intelligence Artificielle</span> CHNCAK
              </h1>
              <p style={{ color:"#64748b", fontSize:14, marginTop:6 }}>Prédictions temps réel pour la gestion hospitalière optimisée</p>
            </div>
            <button
              onClick={lancerAnalyse}
              disabled={loading}
              style={{
                background: loading ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#4f46e5)",
                color:"white", border:"none", borderRadius:10, padding:"10px 20px",
                fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", gap:8, transition:"all 0.2s"
              }}>
              {loading ? (
                <>
                  <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}></span>
                  Analyse en cours...
                </>
              ) : analyseComplete ? "✓ Relancer l'analyse" : "Lancer nouvelle analyse"}
            </button>
          </div>

          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
            {[
              { label:"Précision modèle", value:`${precision}%`, icon:"🎯", sub:"Modèle PredSepsis actif", couleur:"#6366f1" },
              { label:"Prédictions / jour", value:"1 247", icon:"🔮", sub:"+12% vs hier", couleur:"#818cf8" },
              { label:"Alertes précoces", value:"23", icon:"⚡", sub:"dont 3 critiques", couleur:"#a78bfa" },
              { label:"Économies estimées", value:"12M FCFA", icon:"💰", sub:"Ce mois-ci", couleur:"#22c55e" },
            ].map((k, i) => (
              <div key={i} style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"1rem 1.25rem", animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:20 }}>{k.icon}</span>
                  <span style={{ fontSize:12, color:"#64748b" }}>{k.label}</span>
                </div>
                <div style={{ fontSize:26, fontWeight:800, color:k.couleur }}>{k.value}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem 1.5rem", display:"flex", flexDirection:"column", gap:24 }}>

        {/* GRAPHIQUE ADMISSIONS */}
        <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem", animation:"fadeUp 0.4s ease 0.1s both" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:8 }}>
            <div>
              <h2 style={{ color:"#e2e8f0", fontWeight:700, fontSize:17, margin:0 }}>Prédictions d'Admissions</h2>
              <p style={{ color:"#64748b", fontSize:13, margin:"4px 0 0" }}>Prévisions IA sur 7 jours — Semaine du 23 au 29 Juin 2026</p>
            </div>
            <span style={{ background:"rgba(99,102,241,0.12)", color:"#818cf8", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, border:"1px solid rgba(99,102,241,0.25)" }}>MODÈLE LSTM v2.3</span>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:180, padding:"0 8px" }}>
            {joursData.map((j, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:12, fontWeight:700, color: j.isToday ? "#6366f1" : "#64748b" }}>{j.admissions}</span>
                <div style={{
                  width:"100%", borderRadius:"6px 6px 0 0",
                  height:`${(j.admissions / maxAdmissions) * 140}px`,
                  background: j.isToday
                    ? "linear-gradient(180deg,#6366f1,#4f46e5)"
                    : "linear-gradient(180deg,rgba(99,102,241,0.45),rgba(99,102,241,0.15))",
                  border: j.isToday ? "1px solid rgba(99,102,241,0.7)" : "1px solid rgba(99,102,241,0.15)",
                  position:"relative"
                }}>
                  {j.isToday && (
                    <div style={{ position:"absolute", top:-22, left:"50%", transform:"translateX(-50%)", background:"#6366f1", color:"white", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4, whiteSpace:"nowrap" }}>AUJOURD'HUI</div>
                  )}
                </div>
                <span style={{ fontSize:11, color: j.isToday ? "#818cf8" : "#64748b", fontWeight: j.isToday ? 700 : 400 }}>{j.jour}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:20, marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid rgba(255,255,255,0.06)", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:12, height:12, borderRadius:2, background:"linear-gradient(180deg,#6366f1,#4f46e5)" }}></div>
              <span style={{ fontSize:11, color:"#64748b" }}>Jour actuel</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:12, height:12, borderRadius:2, background:"rgba(99,102,241,0.35)" }}></div>
              <span style={{ fontSize:11, color:"#64748b" }}>Prédictions IA</span>
            </div>
            <span style={{ marginLeft:"auto", fontSize:11, color:"#64748b" }}>Intervalle de confiance: 95%</span>
          </div>
        </div>

        {/* ALERTES PREDICTIVES */}
        <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem", animation:"fadeUp 0.4s ease 0.2s both" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:8 }}>
            <div>
              <h2 style={{ color:"#e2e8f0", fontWeight:700, fontSize:17, margin:0 }}>Alertes Prédictives</h2>
              <p style={{ color:"#64748b", fontSize:13, margin:"4px 0 0" }}>{alertesPredictives.length} alertes actives générées par l'IA</p>
            </div>
            <span style={{ background:"rgba(239,68,68,0.12)", color:"#f87171", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, border:"1px solid rgba(239,68,68,0.25)", animation:"pulse 2s infinite" }}>TEMPS RÉEL</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {alertesPredictives.map(a => (
              <div key={a.id} style={{
                background:"rgba(255,255,255,0.02)", border:`1px solid ${a.couleur}22`,
                borderLeft:`3px solid ${a.couleur}`, borderRadius:10, padding:"1rem 1.25rem",
                display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ background:`${a.couleur}20`, color:a.couleur, fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:4, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{a.type}</span>
                  <div>
                    <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:14 }}>{a.patient}</div>
                    <div style={{ color:"#64748b", fontSize:12, marginTop:2 }}>{a.message}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:a.couleur, fontWeight:800, fontSize:18 }}>{a.probabilite}%</div>
                    <div style={{ color:"#64748b", fontSize:10 }}>probabilité</div>
                  </div>
                  <span style={{ background:`${a.couleur}18`, color:a.couleur, fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:6 }}>{a.urgence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODÈLES ACTIFS */}
        <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem", animation:"fadeUp 0.4s ease 0.3s both" }}>
          <div style={{ marginBottom:"1.25rem" }}>
            <h2 style={{ color:"#e2e8f0", fontWeight:700, fontSize:17, margin:0 }}>Modèles Actifs</h2>
            <p style={{ color:"#64748b", fontSize:13, margin:"4px 0 0" }}>5 modèles de machine learning en production</p>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  {["Modèle", "Type", "Précision", "Dernière MAJ", "Statut"].map(h => (
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:"#64748b", fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelesIA.map((m, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"12px", color:"#e2e8f0", fontWeight:600 }}>{m.nom}</td>
                    <td style={{ padding:"12px", color:"#64748b" }}>{m.type}</td>
                    <td style={{ padding:"12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:80, background:"rgba(255,255,255,0.06)", borderRadius:4, height:6 }}>
                          <div style={{ height:"100%", borderRadius:4, background:"#6366f1", width:`${m.precision}%` }}></div>
                        </div>
                        <span style={{ color:"#6366f1", fontWeight:700 }}>{m.precision}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px", color:"#64748b", fontFamily:"monospace", fontSize:12 }}>{m.update}</td>
                    <td style={{ padding:"12px" }}>
                      <span style={{
                        background: m.statut === "actif" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                        color: m.statut === "actif" ? "#22c55e" : "#f59e0b",
                        padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700
                      }}>
                        {m.statut === "actif" ? "● Actif" : "⟳ Entraînement"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {analyseComplete && (
          <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:12, padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:12, animation:"fadeUp 0.4s ease both" }}>
            <span style={{ fontSize:20 }}>✅</span>
            <div>
              <div style={{ color:"#818cf8", fontWeight:700, fontSize:14 }}>Analyse IA complétée avec succès</div>
              <div style={{ color:"#64748b", fontSize:12, marginTop:2 }}>Tous les modèles ont été rechargés. Prédictions mises à jour pour les 48 prochaines heures.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

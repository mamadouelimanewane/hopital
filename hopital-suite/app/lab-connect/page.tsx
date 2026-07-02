"use client"
import { useState } from "react"

const analyses = [
  { id: "LAB-2847", patient: "Awa Diop", type: "Numération Formule Sanguine", resultat: "Hémoglobine 9.2 g/dL", normal: "12-16 g/dL", statut: "Anormal", medecin: "Dr. Ndiaye", urgence: true },
  { id: "LAB-2846", patient: "Moussa Sow", type: "Glycémie à Jeun", resultat: "1.87 g/L", normal: "0.70-1.10 g/L", statut: "Critique", medecin: "Dr. Ba", urgence: true },
  { id: "LAB-2845", patient: "Fatou Fall", type: "Créatinine Sanguine", resultat: "8.2 mg/L", normal: "6-12 mg/L", statut: "Normal", medecin: "Dr. Diallo", urgence: false },
  { id: "LAB-2844", patient: "Ibrahima Ly", type: "Transaminases ALAT", resultat: "187 UI/L", normal: "7-56 UI/L", statut: "Critique", medecin: "Dr. Ndiaye", urgence: true },
  { id: "LAB-2843", patient: "Mariama Gueye", type: "PCR Paludisme", resultat: "Positif — Plasmodium falciparum", normal: "Négatif", statut: "Anormal", medecin: "Dr. Seck", urgence: true },
  { id: "LAB-2842", patient: "Cheikh Mbaye", type: "Cholestérol Total", resultat: "1.95 g/L", normal: "<2.00 g/L", statut: "Normal", medecin: "Dr. Ba", urgence: false },
  { id: "LAB-2841", patient: "Rokhaya Cissé", type: "Groupe Sanguin + Rhésus", resultat: "B Rhésus Négatif", normal: "—", statut: "Normal", medecin: "Dr. Diallo", urgence: false },
  { id: "LAB-2840", patient: "Omar Sarr", type: "Protéine C-Réactive (CRP)", resultat: "142 mg/L", normal: "<5 mg/L", statut: "Critique", medecin: "Dr. Ndiaye", urgence: true },
]

const enCours = [
  { id: "LAB-2848", patient: "Aissatou Barry", type: "Bilan Rénal Complet", etape: 3, total: 5, debut: "09:15" },
  { id: "LAB-2849", patient: "Lamine Diagne", type: "Sérologie VIH", etape: 2, total: 5, debut: "09:42" },
  { id: "LAB-2850", patient: "Ndèye Thiam", type: "Test de Grossesse Sérique", etape: 4, total: 5, debut: "10:05" },
  { id: "LAB-2851", patient: "Aliou Koné", type: "Ionogramme Sanguin", etape: 1, total: 5, debut: "10:30" },
]

const etapes = ["Prélèvement", "Centrifugation", "Analyse", "Validation", "Transmission"]

const accent = "#0369a1"
const card = "#0a1628"
const border = "rgba(255,255,255,0.06)"

export default function LabConnect() {
  const [onglet, setOnglet] = useState<"resultats" | "encours" | "critiques" | "historique">("resultats")
  const [recherche, setRecherche] = useState("")

  const critiques = analyses.filter(a => a.statut === "Critique")
  const filtres = analyses.filter(a =>
    a.patient.toLowerCase().includes(recherche.toLowerCase()) ||
    a.type.toLowerCase().includes(recherche.toLowerCase())
  )

  const statutStyle = (statut: string) => {
    if (statut === "Critique") return { color:"#f87171", bg:"rgba(239,68,68,0.12)" }
    if (statut === "Anormal") return { color:"#fb923c", bg:"rgba(251,146,60,0.12)" }
    return { color:"#22c55e", bg:"rgba(34,197,94,0.12)" }
  }

  return (
    <div style={{ background:"#050d1a", minHeight:"100vh", color:"#e2e8f0", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/#applications" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail Ndamatou</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>Ndamatou Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,rgba(3,105,161,0.18),rgba(3,105,161,0.04))", borderBottom:"1px solid rgba(3,105,161,0.25)", padding:"1.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(3,105,161,0.12)", border:"1px solid rgba(3,105,161,0.3)", borderRadius:40, padding:"4px 14px", marginBottom:10 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#38bdf8", display:"inline-block", animation:"pulse 2s infinite" }}></span>
                <span style={{ color:"#38bdf8", fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>LABORATOIRE CONNECTÉ</span>
              </div>
              <h1 style={{ fontSize:"clamp(20px,2.5vw,28px)", fontWeight:800, color:"#e2e8f0", margin:0 }}>
                Lab Connect — <span style={{ color:"#38bdf8" }}>Analyses en Temps Réel</span>
              </h1>
              <p style={{ color:"#64748b", fontSize:13, marginTop:4 }}>Laboratoire d'analyses médicales connecté Ndamatou</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:20, padding:"6px 14px" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", display:"inline-block", animation:"pulse 2s infinite" }}></span>
              <span style={{ fontSize:13, fontWeight:600, color:"#22c55e" }}>Système Actif</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
            {[
              { label:"En cours", val:"47", color:"#38bdf8" },
              { label:"Résultats prêts", val:"12", color:"#22c55e" },
              { label:"Alertes critiques", val:"4", color:"#f87171" },
              { label:"Délai moyen", val:"2h15", color:"#8b5cf6" },
            ].map((s, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"1rem", textAlign:"center", animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"1.5rem", display:"flex", flexDirection:"column", gap:20 }}>

        {/* ONGLETS */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[
            { id:"resultats" as const, label:"📋 Résultats prêts" },
            { id:"encours" as const, label:"⏳ En cours (47)" },
            { id:"critiques" as const, label:`🚨 Critiques (${critiques.length})` },
            { id:"historique" as const, label:"📁 Historique" },
          ].map(t => (
            <button key={t.id} onClick={() => setOnglet(t.id)} style={{
              background: onglet === t.id ? "rgba(3,105,161,0.2)" : card,
              color: onglet === t.id ? "#38bdf8" : "rgba(255,255,255,0.5)",
              border: `1px solid ${onglet === t.id ? "rgba(3,105,161,0.5)" : border}`,
              borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* RÉSULTATS */}
        {onglet === "resultats" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ position:"relative", marginBottom:16 }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#64748b", fontSize:14 }}>🔍</span>
              <input value={recherche} onChange={e => setRecherche(e.target.value)}
                placeholder="Rechercher patient ou type d'examen..."
                style={{ width:"100%", paddingLeft:36, paddingRight:16, paddingTop:10, paddingBottom:10, background:card, border:`1px solid ${border}`, borderRadius:10, color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${border}` }}>
                      {["ID","Patient","Examen","Résultat","Valeurs Normales","Statut","Médecin","Action"].map(h => (
                        <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtres.map((a, i) => {
                      const ss = statutStyle(a.statut)
                      return (
                        <tr key={i} style={{ borderBottom:`1px solid ${border}` }}>
                          <td style={{ padding:"10px 14px", fontFamily:"monospace", fontSize:11, color:"#64748b" }}>{a.id}</td>
                          <td style={{ padding:"10px 14px", fontWeight:600, color:"#e2e8f0" }}>{a.patient}</td>
                          <td style={{ padding:"10px 14px", fontSize:12, color:"rgba(255,255,255,0.6)" }}>{a.type}</td>
                          <td style={{ padding:"10px 14px", fontSize:12, fontWeight:600, color:ss.color }}>{a.resultat}</td>
                          <td style={{ padding:"10px 14px", fontSize:11, color:"#64748b" }}>{a.normal}</td>
                          <td style={{ padding:"10px 14px" }}>
                            <span style={{ background:ss.bg, color:ss.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                              {a.statut === "Critique" && "🚨 "}{a.statut}
                            </span>
                          </td>
                          <td style={{ padding:"10px 14px", fontSize:12, color:"rgba(255,255,255,0.6)" }}>{a.medecin}</td>
                          <td style={{ padding:"10px 14px" }}>
                            <button style={{ color:"#38bdf8", background:"none", border:"none", fontSize:12, fontWeight:600, cursor:"pointer" }}>Transmettre →</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EN COURS */}
        {onglet === "encours" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"fadeUp 0.3s ease both" }}>
            {enCours.map((a, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
                  <div>
                    <div style={{ fontFamily:"monospace", fontSize:11, color:"#64748b", marginBottom:4 }}>{a.id}</div>
                    <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:15 }}>{a.patient}</div>
                    <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>{a.type}</div>
                  </div>
                  <div style={{ fontSize:12, color:"#64748b" }}>⏱ Début {a.debut}</div>
                </div>
                <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                  {etapes.map((e, j) => (
                    <div key={j} style={{ flex:1 }}>
                      <div style={{ height:6, borderRadius:4, marginBottom:4, background: j < a.etape ? "#0ea5e9" : j === a.etape-1 ? "#38bdf8" : "rgba(255,255,255,0.08)" }}></div>
                      <span style={{ fontSize:9, color:"#64748b", display:"block", textAlign:"center", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{e}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize:12, color:"#38bdf8", fontWeight:600, margin:0 }}>Étape {a.etape}/{a.total} — {etapes[a.etape-1]}</p>
              </div>
            ))}
          </div>
        )}

        {/* CRITIQUES */}
        {onglet === "critiques" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:18 }}>⚠️</span>
              <p style={{ color:"#f87171", fontSize:13, fontWeight:600, margin:0 }}>{critiques.length} résultats critiques nécessitent une action immédiate</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {critiques.map((a, i) => (
                <div key={i} style={{ background:card, borderLeft:"3px solid #ef4444", border:`1px solid rgba(239,68,68,0.2)`, borderRadius:14, padding:"1.25rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                    <div>
                      <span style={{ background:"rgba(239,68,68,0.12)", color:"#f87171", fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:4 }}>🚨 CRITIQUE</span>
                      <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14, marginTop:8 }}>{a.patient} — {a.type}</div>
                      <div style={{ color:"#f87171", fontWeight:600, fontSize:13, marginTop:4 }}>{a.resultat}</div>
                      <div style={{ color:"#64748b", fontSize:11, marginTop:2 }}>Valeur normale: {a.normal}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      <button style={{ background:"rgba(239,68,68,0.8)", color:"white", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Appeler {a.medecin}</button>
                      <button style={{ background:"rgba(255,255,255,0.06)", color:"#e2e8f0", border:`1px solid ${border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:600, cursor:"pointer" }}>Voir dossier</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIQUE */}
        {onglet === "historique" && (
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.5rem", animation:"fadeUp 0.3s ease both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:0 }}>Historique des analyses</h3>
              <button style={{ background:"linear-gradient(135deg,#0369a1,#0ea5e9)", color:"white", border:"none", borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>📥 Exporter</button>
            </div>
            <div style={{ textAlign:"center", padding:"3rem 0", color:"#64748b" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>⚗️</div>
              <p style={{ fontWeight:600, fontSize:15, color:"#e2e8f0", margin:"0 0 8px" }}>Historique — 3 847 analyses archivées</p>
              <p style={{ fontSize:13, margin:0 }}>Utilisez la recherche pour filtrer par patient ou période</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

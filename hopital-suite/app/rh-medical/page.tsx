"use client"
import { useState } from "react"

type Onglet = "personnel" | "gardes" | "competences" | "conges" | "evaluations"

const personnel = [
  { nom: "Dr. Ousmane Ndiaye", matricule: "MED-001", specialite: "Cardiologie", service: "Cardiologie", statut: "En service", tel: "+221 77 123 45 67", email: "o.ndiaye@ndamatou.sn" },
  { nom: "Dr. Fatou Ba", matricule: "MED-002", specialite: "Pédiatrie", service: "Pédiatrie", statut: "En garde", tel: "+221 77 234 56 78", email: "f.ba@ndamatou.sn" },
  { nom: "Dr. Ibrahima Diallo", matricule: "MED-003", specialite: "Chirurgie Générale", service: "Bloc Opératoire", statut: "En service", tel: "+221 77 345 67 89", email: "i.diallo@ndamatou.sn" },
  { nom: "Inf. Moussa Seck", matricule: "INF-001", specialite: "Urgences", service: "Urgences", statut: "En service", tel: "+221 77 456 78 90", email: "m.seck@ndamatou.sn" },
  { nom: "Dr. Aissatou Fall", matricule: "MED-004", specialite: "Gynécologie-Obstétrique", service: "Maternité", statut: "En congé", tel: "+221 77 567 89 01", email: "a.fall@ndamatou.sn" },
  { nom: "Dr. Cheikh Mbaye", matricule: "MED-005", specialite: "Neurologie", service: "Neurologie", statut: "Formation", tel: "+221 77 678 90 12", email: "c.mbaye@ndamatou.sn" },
  { nom: "Inf. Mariama Gueye", matricule: "INF-002", specialite: "Réanimation", service: "Réanimation", statut: "En garde", tel: "+221 77 789 01 23", email: "m.gueye@ndamatou.sn" },
  { nom: "Dr. Lamine Diagne", matricule: "MED-006", specialite: "Radiologie", service: "Imagerie Médicale", statut: "En service", tel: "+221 77 890 12 34", email: "l.diagne@ndamatou.sn" },
  { nom: "Dr. Rokhaya Cissé", matricule: "MED-007", specialite: "Anesthésie-Réanimation", service: "Bloc Opératoire", statut: "En service", tel: "+221 77 901 23 45", email: "r.cisse@ndamatou.sn" },
  { nom: "Inf. Omar Sarr", matricule: "INF-003", specialite: "Pédiatrie", service: "Pédiatrie", statut: "En service", tel: "+221 77 012 34 56", email: "o.sarr@ndamatou.sn" },
]

const gardes = [
  { service: "Urgences", jours: ["Dr. Diallo", "Inf. Seck", "Dr. Ndiaye", "Inf. Gueye", "—", "Dr. Ba", "Inf. Seck"] },
  { service: "Réanimation", jours: ["Dr. Cissé", "Dr. Cissé", "Dr. Mbaye", "Dr. Diallo", "Dr. Cissé", "Dr. Diagne", "—"] },
  { service: "Maternité", jours: ["Dr. Fall", "Dr. Fall", "Sage-f. Ly", "Sage-f. Ly", "Dr. Fall", "Sage-f. Ndao", "Sage-f. Ly"] },
  { service: "Cardiologie", jours: ["Dr. Ndiaye", "—", "Dr. Ndiaye", "—", "Dr. Ndiaye", "—", "Dr. Ndiaye"] },
]

const jours = ["Lun 23", "Mar 24", "Mer 25", "Jeu 26", "Ven 27", "Sam 28", "Dim 29"]

const conges = [
  { nom: "Dr. Aissatou Fall", periode: "15/06 — 30/06/2026", motif: "Congé annuel", statut: "Approuvé", couvert: true },
  { nom: "Inf. Moussa Seck", periode: "25/06 — 02/07/2026", motif: "Maladie", statut: "En attente", couvert: false },
  { nom: "Dr. Cheikh Mbaye", periode: "20/06 — 25/06/2026", motif: "Formation DU", statut: "Approuvé", couvert: true },
  { nom: "Inf. Omar Sarr", periode: "01/07 — 15/07/2026", motif: "Congé annuel", statut: "En attente", couvert: true },
]

const evaluations = [
  { nom: "Dr. Ousmane Ndiaye", score: 94, dernier: "Mars 2026", prochain: "Sept 2026", commentaire: "Excellent technicien, très apprécié des patients" },
  { nom: "Dr. Fatou Ba", score: 88, dernier: "Avril 2026", prochain: "Oct 2026", commentaire: "Bonne maîtrise, quelques axes d'amélioration en urgences" },
  { nom: "Inf. Moussa Seck", score: 91, dernier: "Fév 2026", prochain: "Août 2026", commentaire: "Réactivité exemplaire aux urgences" },
  { nom: "Dr. Ibrahima Diallo", score: 96, dernier: "Mai 2026", prochain: "Nov 2026", commentaire: "Chirurgien de référence, formateur reconnu" },
]

const statutStyle: Record<string, { color: string; bg: string }> = {
  "En service": { color:"#22c55e", bg:"rgba(34,197,94,0.12)" },
  "En garde": { color:"#3b82f6", bg:"rgba(59,130,246,0.12)" },
  "En congé": { color:"#f59e0b", bg:"rgba(245,158,11,0.12)" },
  "Formation": { color:"#8b5cf6", bg:"rgba(139,92,246,0.12)" },
}

const accent = "#4338ca"
const card = "#0a1628"
const border = "rgba(255,255,255,0.06)"

const competencesList = [
  ["Urgences", "Réanimation", "Chirurgie"],
  ["Pédiatrie", "Néonatologie", "Urgences pédiatriques"],
  ["Chirurgie générale", "Laparoscopie", "Transplantation"],
  ["Soins intensifs", "Triage", "Cathétérisme"],
  ["Obstétrique", "Gynécologie", "Echographie"],
  ["Neurochirurgie", "IRM", "EEG"],
  ["Réa adulte", "Ventilation", "Monitoring"],
  ["Scanner", "IRM", "Radiologie interventionnelle"],
]

export default function RHMedical() {
  const [onglet, setOnglet] = useState<Onglet>("personnel")

  const tabs: { id: Onglet; label: string; icon: string }[] = [
    { id:"personnel", label:"Personnel", icon:"👥" },
    { id:"gardes", label:"Planning Gardes", icon:"📅" },
    { id:"competences", label:"Compétences", icon:"🏅" },
    { id:"conges", label:"Congés", icon:"✈️" },
    { id:"evaluations", label:"Évaluations", icon:"⭐" },
  ]

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
      <div style={{ background:`linear-gradient(135deg,rgba(67,56,202,0.18),rgba(67,56,202,0.04))`, borderBottom:`1px solid rgba(67,56,202,0.25)`, padding:"1.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(67,56,202,0.12)", border:`1px solid rgba(67,56,202,0.3)`, borderRadius:40, padding:"4px 14px", marginBottom:10 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1", display:"inline-block", animation:"pulse 2s infinite" }}></span>
                <span style={{ color:"#818cf8", fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>RH MÉDICAL Ndamatou</span>
              </div>
              <h1 style={{ fontSize:"clamp(20px,2.5vw,28px)", fontWeight:800, color:"#e2e8f0", margin:0 }}>
                RH Médical — <span style={{ color:"#818cf8" }}>Ressources Humaines</span>
              </h1>
              <p style={{ color:"#64748b", fontSize:13, marginTop:4 }}>Gestion du personnel médical et paramédical Ndamatou</p>
            </div>
            <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600, color:"#f87171" }}>
              ⚠️ Sous-effectif Urgences — Mer 25/06
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
            {[
              { label:"Effectif total", val:"247", alert:false },
              { label:"En garde ce soir", val:"12", alert:false },
              { label:"Congés non couverts", val:"1", alert:true },
              { label:"En formation", val:"8", alert:false },
            ].map((s, i) => (
              <div key={i} style={{ background: s.alert ? "rgba(239,68,68,0.1)" : card, border:`1px solid ${s.alert ? "rgba(239,68,68,0.25)" : border}`, borderRadius:12, padding:"1rem", textAlign:"center", animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ fontSize:28, fontWeight:800, color: s.alert ? "#f87171" : "#e2e8f0" }}>{s.val}</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"1.5rem", display:"flex", flexDirection:"column", gap:20 }}>

        {/* ONGLETS */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setOnglet(t.id)} style={{
              background: onglet === t.id ? "rgba(67,56,202,0.2)" : card,
              color: onglet === t.id ? "#818cf8" : "rgba(255,255,255,0.5)",
              border: `1px solid ${onglet === t.id ? "rgba(67,56,202,0.5)" : border}`,
              borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:6
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* PERSONNEL */}
        {onglet === "personnel" && (
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, overflow:"hidden", animation:"fadeUp 0.3s ease both" }}>
            <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:0 }}>Liste du personnel médical ({personnel.length} affichés)</h3>
              </div>
              <button style={{ background:"linear-gradient(135deg,#4338ca,#6366f1)", color:"white", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Ajouter</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${border}` }}>
                    {["Nom","Matricule","Spécialité","Service","Statut","Contact","Actions"].map(h => (
                      <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {personnel.map((p, i) => {
                    const ss = statutStyle[p.statut] || { color:"#64748b", bg:"rgba(100,116,139,0.12)" }
                    return (
                      <tr key={i} style={{ borderBottom:`1px solid ${border}` }}>
                        <td style={{ padding:"10px 14px", fontWeight:600, color:"#e2e8f0", fontSize:13 }}>{p.nom}</td>
                        <td style={{ padding:"10px 14px", fontFamily:"monospace", fontSize:11, color:"#64748b" }}>{p.matricule}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"rgba(255,255,255,0.6)" }}>{p.specialite}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"rgba(255,255,255,0.6)" }}>{p.service}</td>
                        <td style={{ padding:"10px 14px" }}>
                          <span style={{ background:ss.bg, color:ss.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{p.statut}</span>
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ display:"flex", gap:8 }}>
                            <a href={`tel:${p.tel}`} style={{ color:"#64748b", textDecoration:"none", fontSize:13 }}>📞</a>
                            <a href={`mailto:${p.email}`} style={{ color:"#64748b", textDecoration:"none", fontSize:13 }}>✉️</a>
                          </div>
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          <button style={{ color:"#818cf8", background:"none", border:"none", fontSize:12, fontWeight:600, cursor:"pointer" }}>Voir profil →</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PLANNING GARDES */}
        {onglet === "gardes" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:0 }}>Planning des gardes — Semaine du 23 au 29 Juin 2026</h3>
              <button style={{ background:"linear-gradient(135deg,#4338ca,#6366f1)", color:"white", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>✨ Générer planning IA</button>
            </div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${border}` }}>
                      <th style={{ padding:"10px 16px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Service</th>
                      {jours.map(j => <th key={j} style={{ padding:"10px 12px", textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>{j}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {gardes.map((g, i) => (
                      <tr key={i} style={{ borderBottom:`1px solid ${border}` }}>
                        <td style={{ padding:"12px 16px", fontWeight:600, color:"#e2e8f0" }}>{g.service}</td>
                        {g.jours.map((j, k) => (
                          <td key={k} style={{ padding:"12px", textAlign:"center" }}>
                            {j === "—" ? (
                              <span style={{ color:"#f87171", fontWeight:700 }}>⚠️</span>
                            ) : (
                              <span style={{ background:"rgba(67,56,202,0.15)", color:"#818cf8", padding:"4px 8px", borderRadius:6, fontSize:11, fontWeight:600 }}>{j}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p style={{ fontSize:11, color:"#64748b", marginTop:8 }}>⚠️ Les cellules avec ⚠️ indiquent un poste non couvert</p>
          </div>
        )}

        {/* COMPÉTENCES */}
        {onglet === "competences" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16, animation:"fadeUp 0.3s ease both" }}>
            {personnel.slice(0, 8).map((p, i) => {
              const ss = statutStyle[p.statut] || { color:"#64748b", bg:"rgba(100,116,139,0.12)" }
              return (
                <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem" }}>
                    <div>
                      <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14 }}>{p.nom}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{p.service}</div>
                    </div>
                    <span style={{ background:ss.bg, color:ss.color, padding:"3px 8px", borderRadius:12, fontSize:10, fontWeight:700 }}>{p.statut}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {(competencesList[i] || []).map((c, j) => (
                      <span key={j} style={{ background:"rgba(67,56,202,0.12)", color:"#818cf8", padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:600, border:"1px solid rgba(67,56,202,0.2)" }}>{c}</span>
                    ))}
                  </div>
                  {i === 0 && <p style={{ fontSize:11, color:"#f59e0b", marginTop:10, fontWeight:600 }}>⚠️ Certification ACLS — Expire dans 30 jours</p>}
                </div>
              )
            })}
          </div>
        )}

        {/* CONGÉS */}
        {onglet === "conges" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:0 }}>Demandes de congés</h3>
              <button style={{ background:"linear-gradient(135deg,#4338ca,#6366f1)", color:"white", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Nouvelle demande</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {conges.map((c, i) => (
                <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem", display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14 }}>{c.nom}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>📅 {c.periode} — {c.motif}</div>
                      <div style={{ fontSize:11, color: c.couvert ? "#22c55e" : "#f87171", marginTop:6, fontWeight:600 }}>
                        {c.couvert ? "✓ Service couvert" : "⚠️ Couverture requise"}
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{
                        background: c.statut === "Approuvé" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                        color: c.statut === "Approuvé" ? "#22c55e" : "#f59e0b",
                        padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700
                      }}>{c.statut}</span>
                      {c.statut === "En attente" && (
                        <div style={{ display:"flex", gap:8 }}>
                          <button style={{ background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Approuver</button>
                          <button style={{ background:"rgba(239,68,68,0.1)", color:"#f87171", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Refuser</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ÉVALUATIONS */}
        {onglet === "evaluations" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"fadeUp 0.3s ease both" }}>
            {evaluations.map((e, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.5rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:15, marginBottom:6 }}>{e.nom}</div>
                    <p style={{ fontSize:13, color:"#64748b", fontStyle:"italic", margin:"0 0 8px" }}>"{e.commentaire}"</p>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", margin:0 }}>Dernière évaluation: {e.dernier} | Prochaine: {e.prochain}</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:36, fontWeight:800, color: e.score >= 90 ? "#22c55e" : e.score >= 75 ? "#f59e0b" : "#ef4444" }}>{e.score}</div>
                      <div style={{ fontSize:11, color:"#64748b" }}>/ 100</div>
                    </div>
                    <div style={{ width:8, height:80, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden", display:"flex", flexDirection:"column-reverse" }}>
                      <div style={{ width:"100%", borderRadius:4, background: e.score >= 90 ? "#22c55e" : "#f59e0b", height:`${e.score}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

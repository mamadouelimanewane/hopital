"use client"
import { useState } from "react"

const ACCENT = "#10b981"

const medicaments = [
  { nom: "Amoxicilline 500mg", categorie: "Antibiotique", stock: 1240, seuil: 200, statut: "OK" },
  { nom: "Paracétamol 1g", categorie: "Analgésique", stock: 3200, seuil: 500, statut: "OK" },
  { nom: "Métformine 500mg", categorie: "Antidiabétique", stock: 180, seuil: 200, statut: "Bas" },
  { nom: "Amlodipine 10mg", categorie: "Antihypertenseur", stock: 45, seuil: 100, statut: "Critique" },
  { nom: "Ibuprofène 400mg", categorie: "Anti-inflammatoire", stock: 890, seuil: 150, statut: "OK" },
  { nom: "Oméprazole 20mg", categorie: "Gastroprotecteur", stock: 310, seuil: 100, statut: "OK" },
  { nom: "Insuline Glargine", categorie: "Antidiabétique", stock: 60, seuil: 80, statut: "Bas" },
  { nom: "Warfarine 5mg", categorie: "Anticoagulant", stock: 125, seuil: 50, statut: "OK" },
]

const ordonnancesData = [
  { id: "ORD-2024-001", patient: "Awa Diop", medecin: "Dr. Aminata Sarr", medicaments: "Amlodipine 10mg, Aspirine 75mg", statut: "En attente", date: "21 Jun 2026" },
  { id: "ORD-2024-002", patient: "Moussa Ndoye", medecin: "Dr. Oumar Diallo", medicaments: "Métformine 500mg, Insuline Glargine", statut: "Validé", date: "21 Jun 2026" },
  { id: "ORD-2024-003", patient: "Fatou Diallo", medecin: "Dr. Fatou Ndiaye", medicaments: "Oméprazole 20mg, Ibuprofène 400mg", statut: "Dispensé", date: "20 Jun 2026" },
  { id: "ORD-2024-004", patient: "Ibrahima Seck", medecin: "Dr. Aminata Sarr", medicaments: "Amoxicilline 500mg", statut: "Dispensé", date: "20 Jun 2026" },
  { id: "ORD-2024-005", patient: "Mariama Ba", medecin: "Dr. Cheikh Fall", medicaments: "Paracétamol 1g, Warfarine 5mg", statut: "En attente", date: "19 Jun 2026" },
]

const dernieresDispensations = [
  { patient: "Awa Diop", medicament: "Amoxicilline 500mg", qte: 21, heure: "14h32", pharmacien: "Ph. Ndiaye" },
  { patient: "Oumar Sy", medicament: "Paracétamol 1g", qte: 30, heure: "13h55", pharmacien: "Ph. Diallo" },
  { patient: "Aissatou Kane", medicament: "Oméprazole 20mg", qte: 14, heure: "12h10", pharmacien: "Ph. Ndiaye" },
  { patient: "Mamadou Gaye", medicament: "Insuline Glargine", qte: 2, heure: "10h45", pharmacien: "Ph. Fall" },
]

const alertes = [
  {
    titre: "Péremption imminente",
    desc: "Amoxicilline 500mg — lot #LOT2024-A12 expire dans 8 jours (450 unités concernées)",
    niveau: "Urgent",
    icon: "⏰",
    color: "#ef4444",
  },
  {
    titre: "Stock bas",
    desc: "Amlodipine 10mg — stock actuel 45 unités, seuil critique atteint. Commande recommandée.",
    niveau: "Attention",
    icon: "📦",
    color: "#f59e0b",
  },
  {
    titre: "Interaction médicamenteuse",
    desc: "Ordonnance ORD-2024-005 — Association Warfarine + Ibuprofène détectée. Validation médecin requise.",
    niveau: "Critique",
    icon: "⚠️",
    color: "#ef4444",
  },
]

type Tab = "inventaire" | "ordonnances" | "dispensation" | "alertes"

export default function PharmaPage() {
  const [tab, setTab] = useState<Tab>("inventaire")
  const [patientId, setPatientId] = useState("")
  const [medicament, setMedicament] = useState("")
  const [quantite, setQuantite] = useState("")

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "inventaire", label: "Inventaire", icon: "📦" },
    { key: "ordonnances", label: "Ordonnances", icon: "📋" },
    { key: "dispensation", label: "Dispensation", icon: "💊" },
    { key: "alertes", label: "Alertes", icon: "🔔" },
  ]

  const statutColor = (s: string) => {
    if (s === "OK") return { bg: "rgba(16,185,129,0.1)", color: "#10b981" }
    if (s === "Bas") return { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" }
    return { bg: "rgba(239,68,68,0.1)", color: "#ef4444" }
  }

  const ordStatutColor = (s: string) => {
    if (s === "Dispensé") return { bg: "rgba(16,185,129,0.1)", color: "#10b981" }
    if (s === "Validé") return { bg: "rgba(14,165,233,0.1)", color: "#0ea5e9" }
    return { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .fade { animation: fadeUp .5s ease both }
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}
        .card-hover { transition: all .25s ease }
        .card-hover:hover { transform: translateY(-2px); border-color: rgba(16,185,129,0.3) !important }
        .pulse-dot { animation: pulse 2s infinite }
        input:focus, select:focus { outline: none; border-color: rgba(16,185,129,0.5) !important }
        ::-webkit-scrollbar { width:6px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:3px }
      `}</style>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(16,185,129,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg, #071a12 0%, #0a2419 50%, #071a12 100%)", borderBottom:"1px solid rgba(16,185,129,0.15)", padding:"28px 32px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="fade" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:56, height:56, borderRadius:18, background:"linear-gradient(135deg, #10b981, #059669)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>💊</div>
              <div>
                <div style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" as const, marginBottom:3 }}>Pharmacie Centrale</div>
                <div style={{ fontSize:24, fontWeight:800, color:"#fff" }}>SmartPharma CHNCAK</div>
                <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>Gestion des médicaments et prescriptions en temps réel</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[
                { label: "Médicaments", val: "1,247", color: ACCENT },
                { label: "Ordonnances/jour", val: "89", color: "#0ea5e9" },
                { label: "Rupture critique", val: "0", color: "#10b981" },
              ].map((s, i) => (
                <div key={i} style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:14, padding:"14px 22px", textAlign:"center" as const }}>
                  <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:0 }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                background:"none", border:"none", cursor:"pointer",
                padding:"12px 24px", fontSize:13, fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? ACCENT : "#64748b",
                borderBottom: tab === t.key ? `2px solid ${ACCENT}` : "2px solid transparent",
                display:"flex", alignItems:"center", gap:7, transition:"all .2s"
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 32px" }}>

        {/* INVENTAIRE */}
        {tab === "inventaire" && (
          <div className="fade">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#e2e8f0" }}>Inventaire des médicaments</h2>
              <button style={{ background:ACCENT, border:"none", color:"#000", padding:"10px 22px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13 }}>+ Commander</button>
            </div>
            <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" as const }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    {["Médicament", "Catégorie", "Stock", "Seuil min.", "Statut", "Action"].map(h => (
                      <th key={h} style={{ padding:"14px 20px", textAlign:"left" as const, fontSize:11, color:"#475569", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medicaments.map((m, i) => {
                    const sc = statutColor(m.statut)
                    const pct = Math.min(100, Math.round((m.stock / (m.seuil * 5)) * 100))
                    const barColor = m.statut === "OK" ? ACCENT : m.statut === "Bas" ? "#f59e0b" : "#ef4444"
                    return (
                      <tr key={i} className="card-hover" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer" }}>
                        <td style={{ padding:"14px 20px" }}>
                          <div style={{ fontSize:14, fontWeight:600, color:"#e2e8f0" }}>{m.nom}</div>
                        </td>
                        <td style={{ padding:"14px 20px" }}>
                          <span style={{ fontSize:12, color:"#64748b", background:"rgba(255,255,255,0.04)", padding:"3px 10px", borderRadius:8 }}>{m.categorie}</span>
                        </td>
                        <td style={{ padding:"14px 20px" }}>
                          <div style={{ fontSize:14, fontWeight:700, color: barColor }}>{m.stock.toLocaleString()}</div>
                          <div style={{ marginTop:4, background:"rgba(255,255,255,0.06)", borderRadius:4, height:4, width:80 }}>
                            <div style={{ width:`${pct}%`, height:"100%", background: barColor, borderRadius:4 }} />
                          </div>
                        </td>
                        <td style={{ padding:"14px 20px", fontSize:13, color:"#64748b" }}>{m.seuil}</td>
                        <td style={{ padding:"14px 20px" }}>
                          <span style={{ padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color }}>{m.statut}</span>
                        </td>
                        <td style={{ padding:"14px 20px" }}>
                          <button style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:ACCENT, padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}>Commander</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDONNANCES */}
        {tab === "ordonnances" && (
          <div className="fade" style={{ display:"grid", gap:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#e2e8f0" }}>Ordonnances récentes</h2>
              <div style={{ display:"flex", gap:8 }}>
                {["Toutes", "En attente", "Validé", "Dispensé"].map(f => (
                  <button key={f} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#94a3b8", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12 }}>{f}</button>
                ))}
              </div>
            </div>
            {ordonnancesData.map((o, i) => {
              const sc = ordStatutColor(o.statut)
              return (
                <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"18px 22px", display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:11, color:"#475569", fontFamily:"monospace" }}>{o.id}</span>
                      <span style={{ fontSize:11, color:"#334155" }}>•</span>
                      <span style={{ fontSize:12, color:"#64748b" }}>{o.date}</span>
                    </div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0", marginBottom:4 }}>👤 {o.patient}</div>
                    <div style={{ fontSize:13, color:"#64748b", marginBottom:6 }}>Prescrit par {o.medecin}</div>
                    <div style={{ fontSize:12, color:"#10b981", background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.12)", padding:"5px 12px", borderRadius:8, display:"inline-block" }}>💊 {o.medicaments}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column" as const, gap:8, alignItems:"flex-end" }}>
                    <span style={{ padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, background:sc.bg, color:sc.color }}>{o.statut}</span>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#94a3b8", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:12 }}>Voir</button>
                      {o.statut === "En attente" && (
                        <button style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", color:ACCENT, padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}>Valider</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* DISPENSATION */}
        {tab === "dispensation" && (
          <div className="fade" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div>
              <h2 style={{ margin:"0 0 18px", fontSize:18, fontWeight:700, color:"#e2e8f0" }}>Nouvelle dispensation</h2>
              <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:24, display:"flex", flexDirection:"column" as const, gap:14 }}>
                <div>
                  <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>ID Patient</label>
                  <input value={patientId} onChange={e => setPatientId(e.target.value)} placeholder="Ex: SN-2024-00847"
                    style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const }} />
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Médicament</label>
                  <select value={medicament} onChange={e => setMedicament(e.target.value)}
                    style={{ width:"100%", background:"#0d1f35", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const, cursor:"pointer" }}>
                    <option value="">Sélectionner un médicament...</option>
                    {medicaments.map(m => <option key={m.nom} value={m.nom}>{m.nom} (Stock: {m.stock})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Quantité</label>
                  <input value={quantite} onChange={e => setQuantite(e.target.value)} type="number" placeholder="Nombre d'unités"
                    style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const }} />
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Remarques</label>
                  <textarea placeholder="Instructions particulières..." rows={3}
                    style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, resize:"vertical" as const, boxSizing:"border-box" as const }} />
                </div>
                <button onClick={() => { setPatientId(""); setMedicament(""); setQuantite("") }}
                  style={{ background:"linear-gradient(135deg, #10b981, #059669)", border:"none", color:"#fff", padding:"13px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14 }}>
                  ✓ Valider la dispensation
                </button>
              </div>
            </div>
            <div>
              <h2 style={{ margin:"0 0 18px", fontSize:18, fontWeight:700, color:"#e2e8f0" }}>Dernières dispensations</h2>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:12 }}>
                {dernieresDispensations.map((d, i) => (
                  <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"16px 20px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:4 }}>{d.patient}</div>
                        <div style={{ fontSize:13, color:ACCENT }}>{d.medicament}</div>
                        <div style={{ fontSize:12, color:"#475569", marginTop:4 }}>Par {d.pharmacien}</div>
                      </div>
                      <div style={{ textAlign:"right" as const }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{d.qte} unités</div>
                        <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{d.heure}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ALERTES */}
        {tab === "alertes" && (
          <div className="fade" style={{ display:"grid", gap:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#e2e8f0" }}>Alertes pharmacie</h2>
              <span style={{ background:"rgba(239,68,68,0.1)", color:"#ef4444", padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:700 }}>3 alertes actives</span>
            </div>
            {alertes.map((a, i) => (
              <div key={i} className="card-hover" style={{ background:"#0a1628", borderTop:"1px solid rgba(255,255,255,0.04)", borderRight:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.04)", borderLeft:`3px solid ${a.color}`, borderRadius:14, padding:"20px 24px", display:"grid", gridTemplateColumns:"auto 1fr auto", gap:16, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`rgba(0,0,0,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{a.icon}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>{a.titre}</span>
                    <span style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:"rgba(239,68,68,0.1)", color:a.color }}>{a.niveau}</span>
                  </div>
                  <div style={{ fontSize:13, color:"#64748b", lineHeight:1.5 }}>{a.desc}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column" as const, gap:8 }}>
                  <button style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", color:ACCENT, padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap" as const }}>Traiter</button>
                  <button style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#64748b", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12 }}>Ignorer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

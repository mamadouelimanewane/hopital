"use client"
import { useState, useEffect } from "react"

type Tab = "dashboard" | "rdv" | "dossier" | "ordonnances"

const ACCENT = "#0ea5e9"
const rdvList = [
  { id: 1, date: "24 Juin 2026", heure: "09h30", dr: "Dr. Aminata Sarr", spec: "Cardiologie", salle: "B-204", statut: "confirmé" },
  { id: 2, date: "02 Juil 2026", heure: "11h00", dr: "Dr. Oumar Diallo", spec: "Médecine interne", salle: "A-102", statut: "attente" },
  { id: 3, date: "15 Juil 2026", heure: "08h15", dr: "Dr. Fatou Ndiaye", spec: "Ophtalmologie", salle: "C-310", statut: "confirmé" },
]
const resultats = [
  { type: "NFS complète", date: "18 Jun 2026", statut: "disponible", service: "Laboratoire" },
  { type: "Radiographie thorax", date: "12 Jun 2026", statut: "lu", service: "Radiologie" },
  { type: "Échocardiographie", date: "05 Jun 2026", statut: "lu", service: "Cardiologie" },
  { type: "Bilan lipidique", date: "28 Mai 2026", statut: "lu", service: "Laboratoire" },
]
const ordonnances = [
  { med: "Amlodipine 10mg", posologie: "1 cp/jour le matin", duree: "30 jours", dr: "Dr. Sarr", date: "18 Jun 2026", stock: 18 },
  { med: "Metformine 500mg", posologie: "2 cp/jour au repas", duree: "90 jours", dr: "Dr. Diallo", date: "15 Jun 2026", stock: 54 },
  { med: "Aspirine 75mg", posologie: "1 cp/jour", duree: "Continu", dr: "Dr. Sarr", date: "18 Jun 2026", stock: 90 },
]
const constantes = [
  { label: "Tension", valeur: "128/82", unite: "mmHg", icon: "❤️", ok: true },
  { label: "Glycémie", valeur: "5.8", unite: "mmol/L", icon: "🩸", ok: true },
  { label: "IMC", valeur: "24.7", unite: "kg/m²", icon: "⚖️", ok: true },
  { label: "Fréq. card.", valeur: "72", unite: "bpm", icon: "💓", ok: true },
]

export default function ConnectPage() {
  const [tab, setTab] = useState<Tab>("dashboard")
  const [heure, setHeure] = useState("")
  const [showRdvForm, setShowRdvForm] = useState(false)

  useEffect(() => {
    const u = () => setHeure(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
    u(); const iv = setInterval(u, 1000); return () => clearInterval(iv)
  }, [])

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "dashboard", label: "Tableau de bord", icon: "🏠" },
    { key: "rdv", label: "Rendez-vous", icon: "📅" },
    { key: "dossier", label: "Dossier Médical", icon: "📋" },
    { key: "ordonnances", label: "Ordonnances", icon: "💊" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(14,165,233,0.3)} 50%{box-shadow:0 0 40px rgba(14,165,233,0.6)} }
        .fade { animation: fadeUp .5s ease both }
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}
        .pulse-dot{animation:pulse 2s infinite}
        .card-hover { transition: all .25s ease }
        .card-hover:hover { transform: translateY(-2px); border-color: rgba(14,165,233,0.4) !important }
        input::placeholder { color: #334155 }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600, transition:"color .2s" }}>
          ← Portail CHNCAK
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div className="pulse-dot" style={{ width:7, height:7, borderRadius:"50%", background:"#10b981" }} />
          <span style={{ fontSize:11, color:"#10b981", fontWeight:700, letterSpacing:".05em" }}>EN LIGNE</span>
          <span style={{ fontSize:12, color:"#475569", marginLeft:8 }}>{heure}</span>
        </div>
      </div>

      {/* HERO HEADER */}
      <div style={{ background:"linear-gradient(135deg, #0c1929 0%, #0f2744 50%, #0c1929 100%)", borderBottom:"1px solid rgba(14,165,233,0.15)", padding:"28px 32px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="fade" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg, #0ea5e9, #6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👤</div>
              <div>
                <div style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:3 }}>Portail Patient CHNCAK</div>
                <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Bonjour, Awa Diop 👋</div>
                <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>Dossier #SN-2024-00847 • Groupe A+ • Cardiologie suivie</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ background:"rgba(14,165,233,0.08)", border:"1px solid rgba(14,165,233,0.2)", borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color:ACCENT }}>3</div>
                <div style={{ fontSize:11, color:"#64748b" }}>RDV à venir</div>
              </div>
              <div style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#10b981" }}>4</div>
                <div style={{ fontSize:11, color:"#64748b" }}>Résultats prêts</div>
              </div>
              <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#818cf8" }}>3</div>
                <div style={{ fontSize:11, color:"#64748b" }}>Ordonnances</div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display:"flex", gap:0, borderBottom:"none" }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                background:"none", border:"none", cursor:"pointer",
                padding:"12px 24px", fontSize:13, fontWeight: tab===t.key ? 700 : 500,
                color: tab===t.key ? ACCENT : "#64748b",
                borderBottom: tab===t.key ? `2px solid ${ACCENT}` : "2px solid transparent",
                display:"flex", alignItems:"center", gap:7, transition:"all .2s"
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 32px" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={{ display:"grid", gap:20 }}>

            {/* NEXT RDV */}
            <div className="fade d1" style={{ background:"linear-gradient(135deg, #0c1f3a, #0f2a4a)", border:"1px solid rgba(14,165,233,0.25)", borderRadius:18, padding:24, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                <div style={{ width:64, height:64, borderRadius:16, background:"rgba(14,165,233,0.12)", border:"1px solid rgba(14,165,233,0.3)", display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:10, color:ACCENT, fontWeight:700, textTransform:"uppercase" as const }}>JUN</div>
                  <div style={{ fontSize:26, fontWeight:900, color:"#fff", lineHeight:1 }}>24</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase" as const, marginBottom:4 }}>Prochain Rendez-vous</div>
                  <div style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Dr. Aminata Sarr — Cardiologie</div>
                  <div style={{ fontSize:14, color:"#64748b", marginTop:3 }}>📍 Salle B-204 &nbsp;•&nbsp; ⏰ 09h30</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ background:"rgba(14,165,233,0.12)", border:"1px solid rgba(14,165,233,0.3)", color:ACCENT, padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600 }}>📍 Itinéraire</button>
                <button style={{ background:ACCENT, border:"none", color:"#000", padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>Confirmer ma présence</button>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {/* CONSTANTES */}
              <div className="fade d2" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:18, padding:24 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:16 }}>Mes Constantes Vitales</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {constantes.map((c, i) => (
                    <div key={i} className="card-hover" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"14px" }}>
                      <div style={{ fontSize:20, marginBottom:6 }}>{c.icon}</div>
                      <div style={{ fontSize:22, fontWeight:800, color:"#10b981" }}>{c.valeur}</div>
                      <div style={{ fontSize:11, color:"#475569" }}>{c.unite}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DERNIERS RÉSULTATS */}
              <div className="fade d3" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:18, padding:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Résultats Récents</div>
                  <button onClick={() => setTab("dossier")} style={{ background:"none", border:"none", color:ACCENT, fontSize:12, cursor:"pointer", fontWeight:600 }}>Tout voir →</button>
                </div>
                {resultats.map((r, i) => (
                  <div key={i} className="card-hover" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.04)", marginBottom:8, cursor:"pointer" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background: r.statut==="disponible" ? "#10b981" : "#334155" }} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#cbd5e1" }}>{r.type}</div>
                        <div style={{ fontSize:11, color:"#475569" }}>{r.service} • {r.date}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700, background: r.statut==="disponible" ? "rgba(16,185,129,0.1)" : "rgba(71,85,105,0.2)", color: r.statut==="disponible" ? "#10b981" : "#64748b" }}>
                      {r.statut==="disponible" ? "NOUVEAU" : "Lu"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS RAPIDES */}
            <div className="fade d4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {[
                { icon:"📅", label:"Prendre RDV", desc:"Choisir spécialiste", color:"#0ea5e9", onClick: () => { setTab("rdv"); setShowRdvForm(true) } },
                { icon:"📹", label:"Téléconsultation", desc:"Consulter en ligne", color:"#6366f1", onClick: () => {} },
                { icon:"🔬", label:"Mes Résultats", desc:"Voir les analyses", color:"#10b981", onClick: () => setTab("dossier") },
                { icon:"📱", label:"App Mobile", desc:"Scanner mon QR", color:"#f59e0b", onClick: () => {} },
              ].map((a, i) => (
                <button key={i} onClick={a.onClick} className="card-hover" style={{
                  background:"#0a1628", border:`1px solid rgba(255,255,255,0.06)`, borderRadius:16, padding:"20px 16px",
                  cursor:"pointer", textAlign:"left" as const, display:"flex", flexDirection:"column" as const, gap:8
                }}>
                  <div style={{ fontSize:28 }}>{a.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>{a.label}</div>
                  <div style={{ fontSize:12, color:"#475569" }}>{a.desc}</div>
                  <div style={{ fontSize:12, color:a.color, fontWeight:600, marginTop:4 }}>Accéder →</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RENDEZ-VOUS */}
        {tab === "rdv" && (
          <div className="fade" style={{ display:"grid", gap:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:"#e2e8f0" }}>Mes Rendez-vous</h2>
              <button onClick={() => setShowRdvForm(!showRdvForm)} style={{ background:ACCENT, border:"none", color:"#000", padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>+ Nouveau RDV</button>
            </div>

            {showRdvForm && (
              <div style={{ background:"#0c1929", border:`1px solid rgba(14,165,233,0.25)`, borderRadius:18, padding:24 }}>
                <div style={{ fontSize:16, fontWeight:700, color:ACCENT, marginBottom:16 }}>Demander un Rendez-vous</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {[
                    { placeholder:"Spécialité souhaitée (ex: Cardiologie)", type:"text" },
                    { placeholder:"Médecin préféré (optionnel)", type:"text" },
                    { placeholder:"Date souhaitée", type:"date" },
                    { placeholder:"Créneau horaire", type:"time" },
                  ].map((f, i) => (
                    <input key={i} type={f.type} placeholder={f.placeholder} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, outline:"none", width:"100%", boxSizing:"border-box" as const }} />
                  ))}
                </div>
                <div style={{ marginTop:14 }}>
                  <textarea placeholder="Motif de consultation..." rows={2} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, outline:"none", resize:"vertical" as const, boxSizing:"border-box" as const }} />
                </div>
                <div style={{ display:"flex", gap:10, marginTop:14 }}>
                  <button style={{ background:ACCENT, border:"none", color:"#000", padding:"12px 28px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14 }}>Envoyer la demande</button>
                  <button onClick={() => setShowRdvForm(false)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"12px 20px", borderRadius:10, cursor:"pointer", fontSize:13 }}>Annuler</button>
                </div>
              </div>
            )}

            {rdvList.map((r, i) => (
              <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:"rgba(14,165,233,0.1)", border:"1px solid rgba(14,165,233,0.2)", display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontSize:9, color:ACCENT, fontWeight:700 }}>{r.date.split(" ")[1]?.toUpperCase()}</div>
                    <div style={{ fontSize:22, fontWeight:900, color:"#fff", lineHeight:1 }}>{r.date.split(" ")[0]}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#e2e8f0" }}>{r.dr}</div>
                    <div style={{ fontSize:13, color:"#64748b" }}>{r.spec} • {r.heure} • Salle {r.salle}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, background: r.statut==="confirmé" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: r.statut==="confirmé" ? "#10b981" : "#f59e0b" }}>{r.statut==="confirmé" ? "✓ Confirmé" : "⏳ En attente"}</span>
                  <button style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12 }}>Annuler</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DOSSIER MÉDICAL */}
        {tab === "dossier" && (
          <div className="fade" style={{ display:"grid", gap:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:20 }}>
              <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:18, padding:24 }}>
                <div style={{ textAlign:"center" as const, marginBottom:20 }}>
                  <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 12px", color:"#fff", fontWeight:700 }}>A</div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>Awa Diop</div>
                  <div style={{ fontSize:12, color:"#64748b" }}>Née le 14 Mars 1984 — 42 ans</div>
                  <div style={{ marginTop:10, display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" as const }}>
                    <span style={{ background:"rgba(239,68,68,0.1)", color:"#f87171", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>A+</span>
                    <span style={{ background:"rgba(245,158,11,0.1)", color:"#fbbf24", padding:"3px 10px", borderRadius:20, fontSize:11 }}>Pénicilline ⚠️</span>
                  </div>
                </div>
                <div style={{ fontSize:12, color:"#475569", borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14 }}>
                  {[
                    { label:"N° Dossier", val:"SN-2024-00847" },
                    { label:"Médecin référent", val:"Dr. A. Sarr" },
                    { label:"Service", val:"Cardiologie" },
                    { label:"Mutuelle", val:"IPRES" },
                  ].map((i, k) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ color:"#475569" }}>{i.label}</span>
                      <span style={{ color:"#cbd5e1", fontWeight:600, fontSize:12 }}>{i.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column" as const, gap:14 }}>
                {resultats.map((r, i) => (
                  <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:"rgba(14,165,233,0.08)", border:"1px solid rgba(14,165,233,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📄</div>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>{r.type}</div>
                        <div style={{ fontSize:12, color:"#475569" }}>{r.service} • {r.date}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, background: r.statut==="disponible" ? "rgba(16,185,129,0.1)" : "rgba(71,85,105,0.15)", color: r.statut==="disponible" ? "#10b981" : "#64748b" }}>{r.statut==="disponible" ? "Nouveau" : "Consulté"}</span>
                      <button style={{ background:"rgba(14,165,233,0.1)", border:"1px solid rgba(14,165,233,0.2)", color:ACCENT, padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}>📥 Voir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDONNANCES */}
        {tab === "ordonnances" && (
          <div className="fade" style={{ display:"grid", gap:16 }}>
            <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:"#e2e8f0" }}>Mes Ordonnances Actives</h2>
            {ordonnances.map((o, i) => (
              <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"20px 24px", display:"grid", gridTemplateColumns:"1fr auto", gap:16 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ fontSize:20 }}>💊</div>
                    <div style={{ fontSize:17, fontWeight:700, color:"#e2e8f0" }}>{o.med}</div>
                    <span style={{ background:"rgba(16,185,129,0.1)", color:"#10b981", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>Active</span>
                  </div>
                  <div style={{ fontSize:13, color:"#64748b", marginBottom:4 }}>📋 {o.posologie} • Durée : {o.duree}</div>
                  <div style={{ fontSize:12, color:"#475569" }}>Prescrit par {o.dr} le {o.date}</div>
                  <div style={{ marginTop:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#475569", marginBottom:4 }}>
                      <span>Stock restant</span><span style={{ color:"#10b981", fontWeight:600 }}>{o.stock} jours</span>
                    </div>
                    <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, height:6, overflow:"hidden" }}>
                      <div style={{ width:`${Math.min(100, o.stock)}%`, height:"100%", background:"linear-gradient(90deg, #10b981, #0ea5e9)", borderRadius:6 }} />
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column" as const, gap:8, justifyContent:"center", minWidth:140 }}>
                  <button style={{ background:ACCENT, border:"none", color:"#000", padding:"10px 16px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>Renouveler</button>
                  <button style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"8px 16px", borderRadius:10, cursor:"pointer", fontSize:12 }}>📥 Télécharger</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

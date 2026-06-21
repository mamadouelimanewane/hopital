"use client"
import { useState, useEffect } from "react"

const ACCENT = "#f59e0b"

type AmbulanceStatut = "Disponible" | "En mission" | "Maintenance"

interface Ambulance {
  id: string
  equipage: string
  statut: AmbulanceStatut
  position: string
  dernierAppel: string
  x: number
  y: number
}

const initialAmbulances: Ambulance[] = [
  { id: "AMB-001", equipage: "Dr. Diallo + Inf. Sarr", statut: "Disponible", position: "Base centrale", dernierAppel: "08h15", x: 50, y: 45 },
  { id: "AMB-002", equipage: "Dr. Ndiaye + Inf. Fall", statut: "En mission", position: "Quartier Darou", dernierAppel: "11h42", x: 25, y: 30 },
  { id: "AMB-003", equipage: "Dr. Ba + Inf. Kane", statut: "En mission", position: "Route Mbacké", dernierAppel: "12h05", x: 70, y: 25 },
  { id: "AMB-004", equipage: "Dr. Mbaye + Inf. Diop", statut: "Disponible", position: "Base Nord", dernierAppel: "07h30", x: 40, y: 70 },
  { id: "AMB-005", equipage: "Dr. Seck + Inf. Sy", statut: "Maintenance", position: "Garage central", dernierAppel: "Hier", x: 60, y: 60 },
  { id: "AMB-006", equipage: "Dr. Gaye + Inf. Diouf", statut: "En mission", position: "Médina Baye", dernierAppel: "12h28", x: 20, y: 65 },
  { id: "AMB-007", equipage: "Dr. Cisse + Inf. Wade", statut: "Disponible", position: "Base Sud", dernierAppel: "09h00", x: 80, y: 75 },
]

const missionsEnCours = [
  { patient: "Amadou Diallo, 67 ans", adresse: "Rue 12, Quartier Darou Khoudoss", ambulance: "AMB-002", depart: "11h42", eta: "12h18", urgence: "Cardiaque" },
  { patient: "Fatou Sene, 34 ans", adresse: "Route de Mbacké, km 4", ambulance: "AMB-003", depart: "12h05", eta: "12h35", urgence: "Accident" },
  { patient: "Bamba Ndoye, 45 ans", adresse: "Médina Baye, secteur 3", ambulance: "AMB-006", depart: "12h28", eta: "12h55", urgence: "AVC" },
]

const statutColor = (s: AmbulanceStatut) => {
  if (s === "Disponible") return { bg: "rgba(16,185,129,0.1)", color: "#10b981", dot: "#10b981" }
  if (s === "En mission") return { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", dot: "#f59e0b" }
  return { bg: "rgba(100,116,139,0.15)", color: "#64748b", dot: "#475569" }
}

export default function AmbuPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances)
  const [blinkId, setBlinkId] = useState<string | null>(null)
  const [adresse, setAdresse] = useState("")
  const [typeUrgence, setTypeUrgence] = useState("")
  const [priorite, setPriorite] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      const missionIds = ambulances.filter(a => a.statut === "En mission").map(a => a.id)
      if (missionIds.length > 0) {
        const id = missionIds[Math.floor(Math.random() * missionIds.length)]
        setBlinkId(id)
        setTimeout(() => setBlinkId(null), 2500)
      }
    }, 3000)
    return () => clearInterval(iv)
  }, [ambulances])

  const stats = {
    total: ambulances.length,
    mission: ambulances.filter(a => a.statut === "En mission").length,
    dispo: ambulances.filter(a => a.statut === "Disponible").length,
  }

  const handleSend = () => {
    setSent(true)
    setAdresse("")
    setTypeUrgence("")
    setPriorite("")
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div style={{ minHeight:"100vh", background:"#050d1a", color:"#e2e8f0", fontFamily:"system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes blink { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.4; transform:scale(1.4)} }
        @keyframes ripple { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.5);opacity:0} }
        .fade { animation: fadeUp .5s ease both }
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}
        .card-hover { transition: all .25s ease }
        .card-hover:hover { transform: translateY(-2px); border-color: rgba(245,158,11,0.3) !important }
        .pulse-dot { animation: pulse 2s infinite }
        .amb-blink { animation: blink .6s ease infinite }
        input:focus, select:focus { outline: none; border-color: rgba(245,158,11,0.5) !important }
      `}</style>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(245,158,11,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg, #1a1207 0%, #231a08 50%, #1a1207 100%)", borderBottom:"1px solid rgba(245,158,11,0.15)", padding:"28px 32px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="fade" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:56, height:56, borderRadius:18, background:"linear-gradient(135deg, #f59e0b, #d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🚑</div>
              <div>
                <div style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" as const, marginBottom:3 }}>Gestion Ambulances</div>
                <div style={{ fontSize:24, fontWeight:800, color:"#fff" }}>AmbuTrack CHNCAK</div>
                <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>Système de suivi et coordination des ambulances — Touba</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[
                { label: "Total flotte", val: stats.total.toString(), color: "#e2e8f0" },
                { label: "En mission", val: stats.mission.toString(), color: ACCENT },
                { label: "Disponibles", val: stats.dispo.toString(), color: "#10b981" },
                { label: "Temps moy.", val: "8 min", color: "#0ea5e9" },
              ].map((s, i) => (
                <div key={i} style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.12)", borderRadius:14, padding:"12px 20px", textAlign:"center" as const }}>
                  <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 32px", display:"grid", gap:24 }}>

        {/* CARTE + TABLEAU */}
        <div style={{ display:"grid", gridTemplateColumns:"420px 1fr", gap:24 }}>

          {/* CARTE SVG TOUBA */}
          <div className="fade d1" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:14 }}>📍 Carte de Touba — Vue en direct</div>
            <div style={{ position:"relative", width:"100%", paddingBottom:"75%", background:"#060f1e", borderRadius:12, overflow:"hidden" }}>
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 400 300">
                {/* Routes principales */}
                <line x1="50" y1="150" x2="350" y2="150" stroke="rgba(100,116,139,0.3)" strokeWidth="2"/>
                <line x1="200" y1="30" x2="200" y2="270" stroke="rgba(100,116,139,0.3)" strokeWidth="2"/>
                <line x1="80" y1="80" x2="320" y2="220" stroke="rgba(100,116,139,0.2)" strokeWidth="1.5"/>
                <line x1="320" y1="80" x2="80" y2="220" stroke="rgba(100,116,139,0.2)" strokeWidth="1.5"/>
                {/* Zones */}
                <circle cx="200" cy="150" r="60" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="1.5" strokeDasharray="6,4"/>
                <circle cx="200" cy="150" r="110" fill="none" stroke="rgba(245,158,11,0.07)" strokeWidth="1" strokeDasharray="4,6"/>
                {/* Hôpital central */}
                <rect x="188" y="138" width="24" height="24" rx="4" fill="rgba(14,165,233,0.15)" stroke="rgba(14,165,233,0.4)" strokeWidth="1.5"/>
                <text x="200" y="154" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontWeight="bold">H</text>
                {/* Ambulances */}
                {ambulances.map(a => {
                  const sc = statutColor(a.statut)
                  const cx = (a.x / 100) * 380 + 10
                  const cy = (a.y / 100) * 280 + 10
                  const isBlinking = blinkId === a.id
                  return (
                    <g key={a.id}>
                      {isBlinking && (
                        <circle cx={cx} cy={cy} r="12" fill="none" stroke={ACCENT} strokeWidth="2" style={{ animation:"ripple 1s ease-out infinite" }}/>
                      )}
                      <circle
                        cx={cx} cy={cy} r="7"
                        fill={sc.dot}
                        stroke="#050d1a"
                        strokeWidth="2"
                        className={isBlinking ? "amb-blink" : ""}
                      />
                      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">{a.id.replace("AMB-", "A")}</text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <div style={{ display:"flex", gap:16, marginTop:14, justifyContent:"center" }}>
              {[{ color:"#10b981", label:"Disponible" }, { color:"#f59e0b", label:"En mission" }, { color:"#475569", label:"Maintenance" }, { color:"#0ea5e9", label:"Hôpital" }].map(l => (
                <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:l.color }} />
                  <span style={{ fontSize:11, color:"#64748b" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TABLEAU AMBULANCES */}
          <div className="fade d2">
            <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:14 }}>Flotte complète</div>
            <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" as const }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    {["ID", "Équipage", "Statut", "Position", "Dernier appel"].map(h => (
                      <th key={h} style={{ padding:"12px 14px", textAlign:"left" as const, fontSize:10, color:"#475569", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ambulances.map((a, i) => {
                    const sc = statutColor(a.statut)
                    const isBlinking = blinkId === a.id
                    return (
                      <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.03)", background: isBlinking ? "rgba(245,158,11,0.04)" : "transparent", transition:"background .3s" }}>
                        <td style={{ padding:"12px 14px" }}>
                          <span style={{ fontSize:13, fontWeight:800, color:ACCENT, fontFamily:"monospace" }}>{a.id}</span>
                        </td>
                        <td style={{ padding:"12px 14px", fontSize:12, color:"#94a3b8" }}>{a.equipage}</td>
                        <td style={{ padding:"12px 14px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:7, height:7, borderRadius:"50%", background:sc.dot }} className={isBlinking ? "pulse-dot" : ""} />
                            <span style={{ fontSize:12, fontWeight:600, color:sc.color }}>{a.statut}</span>
                          </div>
                        </td>
                        <td style={{ padding:"12px 14px", fontSize:12, color:"#64748b" }}>{a.position}</td>
                        <td style={{ padding:"12px 14px", fontSize:12, color:"#475569" }}>{a.dernierAppel}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MISSIONS EN COURS + APPEL D'URGENCE */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24 }}>

          {/* MISSIONS */}
          <div className="fade d3">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:"#e2e8f0" }}>Missions en cours</h2>
              <span style={{ background:"rgba(245,158,11,0.1)", color:ACCENT, padding:"3px 12px", borderRadius:20, fontSize:11, fontWeight:700 }}>3 actives</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column" as const, gap:12 }}>
              {missionsEnCours.map((m, i) => (
                <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(245,158,11,0.12)", borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:3 }}>👤 {m.patient}</div>
                      <div style={{ fontSize:12, color:"#64748b" }}>📍 {m.adresse}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:"#ef4444", background:"rgba(239,68,68,0.1)", padding:"3px 10px", borderRadius:6 }}>{m.urgence}</span>
                  </div>
                  <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                    <span style={{ fontSize:12, color:ACCENT, fontWeight:700 }}>{m.ambulance}</span>
                    <span style={{ fontSize:11, color:"#475569" }}>Départ {m.depart}</span>
                    <span style={{ fontSize:11, color:"#475569" }}>•</span>
                    <span style={{ fontSize:11, color:"#10b981" }}>ETA {m.eta}</span>
                    <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.06)", borderRadius:4, marginLeft:8 }}>
                      <div style={{ width:`${40 + i * 20}%`, height:"100%", background:"linear-gradient(90deg, #f59e0b, #10b981)", borderRadius:4 }} />
                    </div>
                    <button style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", color:ACCENT, padding:"5px 12px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:600, whiteSpace:"nowrap" as const }}>Suivre</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORMULAIRE URGENCE */}
          <div className="fade d4">
            <h2 style={{ margin:"0 0 16px", fontSize:16, fontWeight:700, color:"#e2e8f0" }}>Appel d'urgence</h2>
            <div style={{ background:"#0a1628", border:"1px solid rgba(245,158,11,0.15)", borderRadius:14, padding:20, display:"flex", flexDirection:"column" as const, gap:14 }}>
              {sent && (
                <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:10, padding:"12px 16px", fontSize:13, color:"#10b981", fontWeight:600, textAlign:"center" as const }}>
                  ✓ Demande envoyée — ambulance en route
                </div>
              )}
              <div>
                <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Adresse de l'urgence</label>
                <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Rue, quartier, point de repère..."
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"11px 14px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const }} />
              </div>
              <div>
                <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Type d'urgence</label>
                <select value={typeUrgence} onChange={e => setTypeUrgence(e.target.value)}
                  style={{ width:"100%", background:"#0d1f35", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"11px 14px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const, cursor:"pointer" }}>
                  <option value="">Sélectionner...</option>
                  {["Accident de la route","Cardiaque / AVC","Accouchement","Traumatisme","Intoxication","Autre"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Priorité</label>
                <div style={{ display:"flex", gap:8 }}>
                  {["P1 Critique","P2 Urgent","P3 Normal"].map(p => (
                    <button key={p} onClick={() => setPriorite(p)}
                      style={{ flex:1, padding:"9px 4px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700, border:`1px solid ${priorite === p ? ACCENT : "rgba(255,255,255,0.1)"}`, background: priorite === p ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)", color: priorite === p ? ACCENT : "#64748b", transition:"all .2s" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSend}
                style={{ background:"linear-gradient(135deg, #f59e0b, #d97706)", border:"none", color:"#000", padding:"13px", borderRadius:10, cursor:"pointer", fontWeight:800, fontSize:14, marginTop:4 }}>
                🚑 Envoyer l'urgence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

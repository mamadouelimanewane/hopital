"use client"
import { useState, useEffect } from "react"

const ACCENT = "#ef4444"

type BloodGroup = { groupe: string; poches: number; critique: number }

const initialStocks: BloodGroup[] = [
  { groupe: "A+", poches: 48, critique: 20 },
  { groupe: "A-", poches: 12, critique: 8 },
  { groupe: "B+", poches: 35, critique: 15 },
  { groupe: "B-", poches: 6, critique: 5 },
  { groupe: "AB+", poches: 22, critique: 10 },
  { groupe: "AB-", poches: 4, critique: 4 },
  { groupe: "O+", poches: 61, critique: 25 },
  { groupe: "O-", poches: 9, critique: 8 },
]

const demandesUrgentes = [
  { nom: "Boubacar Diallo", service: "Chirurgie", groupe: "O-", qte: 3, priorite: "CRITIQUE" },
  { nom: "Adja Ndiaye", service: "Maternité", groupe: "AB-", qte: 2, priorite: "URGENT" },
  { nom: "Cheikh Mbaye", service: "Réanimation", groupe: "B-", qte: 4, priorite: "URGENT" },
]

const derniersDons = [
  { donneur: "D***ou T.", groupe: "O+", date: "21 Jun 2026 - 14h20", lieu: "Banque de sang" },
  { donneur: "F***u D.", groupe: "A+", date: "21 Jun 2026 - 11h05", lieu: "Collecte mobile" },
  { donneur: "M***a S.", groupe: "B+", date: "20 Jun 2026 - 16h30", lieu: "Banque de sang" },
  { donneur: "I***m B.", groupe: "AB+", date: "20 Jun 2026 - 09h15", lieu: "Banque de sang" },
  { donneur: "A***e K.", groupe: "O-", date: "19 Jun 2026 - 14h50", lieu: "Collecte externe" },
]

export default function BloodPage() {
  const [stocks, setStocks] = useState<BloodGroup[]>(initialStocks)
  const [showModal, setShowModal] = useState(false)
  const [formGroupe, setFormGroupe] = useState("")
  const [formQte, setFormQte] = useState("")
  const [formService, setFormService] = useState("")
  const [formMotif, setFormMotif] = useState("")
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setStocks(prev => prev.map((s, i) => {
        if (i === tick % prev.length) {
          const delta = Math.random() > 0.5 ? 1 : -1
          return { ...s, poches: Math.max(0, s.poches + delta) }
        }
        return s
      }))
      setTick(t => t + 1)
    }, 4000)
    return () => clearInterval(iv)
  }, [tick])

  const niveauColor = (s: BloodGroup) => {
    const ratio = s.poches / (s.critique * 2)
    if (s.poches <= s.critique) return "#ef4444"
    if (ratio < 1.5) return "#f59e0b"
    return "#10b981"
  }

  const pct = (s: BloodGroup) => Math.min(100, Math.round((s.poches / (s.critique * 3)) * 100))

  return (
    <div style={{ minHeight:"100vh", background:"#050d1a", color:"#e2e8f0", fontFamily:"system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .fade { animation: fadeUp .5s ease both }
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}
        .card-hover { transition: all .25s ease }
        .card-hover:hover { transform: translateY(-2px); border-color: rgba(239,68,68,0.3) !important }
        .pulse-dot { animation: pulse 2s infinite }
        .blink { animation: blink 1.5s infinite }
        input:focus, select:focus { outline: none; border-color: rgba(239,68,68,0.5) !important }
      `}</style>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(239,68,68,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg, #1a0707 0%, #240a0a 50%, #1a0707 100%)", borderBottom:"1px solid rgba(239,68,68,0.15)", padding:"28px 32px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="fade" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:56, height:56, borderRadius:18, background:"linear-gradient(135deg, #ef4444, #b91c1c)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🩸</div>
              <div>
                <div style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" as const, marginBottom:3 }}>Banque de Sang</div>
                <div style={{ fontSize:24, fontWeight:800, color:"#fff" }}>BloodSync CHNCAK</div>
                <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>Gestion des stocks et dons de sang en temps réel</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"8px 14px" }}>
                <div className="pulse-dot" style={{ width:7, height:7, borderRadius:"50%", background:ACCENT }} />
                <span style={{ fontSize:12, color:ACCENT, fontWeight:700 }}>TEMPS RÉEL</span>
              </div>
              {[
                { label: "Dons aujourd'hui", val: "12", color: "#10b981" },
                { label: "Demandes urgentes", val: "3", color: ACCENT },
                { label: "Donneurs enregistrés", val: "847", color: "#0ea5e9" },
              ].map((s, i) => (
                <div key={i} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.12)", borderRadius:14, padding:"12px 20px", textAlign:"center" as const }}>
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

        {/* STOCKS PAR GROUPE */}
        <div className="fade d1">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#e2e8f0" }}>Stocks par groupe sanguin</h2>
            <span style={{ fontSize:12, color:"#64748b" }}>Mis à jour toutes les 4 secondes</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {stocks.map((s, i) => {
              const c = niveauColor(s)
              const p = pct(s)
              const isCrit = s.poches <= s.critique
              return (
                <div key={i} className="card-hover" style={{ background:"#0a1628", border:`1px solid ${isCrit ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius:16, padding:"20px 18px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ fontSize:28, fontWeight:900, color:c }}>{s.groupe}</div>
                    {isCrit && <span className="blink" style={{ fontSize:10, color:ACCENT, fontWeight:700, background:"rgba(239,68,68,0.1)", padding:"2px 8px", borderRadius:6 }}>CRITIQUE</span>}
                  </div>
                  <div style={{ fontSize:32, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>{s.poches}</div>
                  <div style={{ fontSize:12, color:"#64748b", marginBottom:12 }}>poches disponibles</div>
                  <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, height:6, overflow:"hidden" }}>
                    <div style={{ width:`${p}%`, height:"100%", background:c, borderRadius:6, transition:"width .5s ease" }} />
                  </div>
                  <div style={{ fontSize:11, color:"#475569", marginTop:6 }}>Seuil critique : {s.critique} poches</div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>

          {/* DEMANDES URGENTES */}
          <div className="fade d2">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:"#e2e8f0" }}>Demandes urgentes</h2>
              <span style={{ background:"rgba(239,68,68,0.1)", color:ACCENT, padding:"3px 12px", borderRadius:20, fontSize:11, fontWeight:700 }}>3 en attente</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column" as const, gap:12 }}>
              {demandesUrgentes.map((d, i) => (
                <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(239,68,68,0.15)", borderRadius:14, padding:"16px 18px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>{d.nom}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Service : {d.service}</div>
                    </div>
                    <span style={{ fontSize:10, fontWeight:800, color:ACCENT, background:"rgba(239,68,68,0.12)", padding:"3px 10px", borderRadius:6 }}>{d.priorite}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:10 }}>
                      <span style={{ fontSize:18, fontWeight:900, color:ACCENT }}>{d.groupe}</span>
                      <span style={{ fontSize:13, color:"#64748b" }}>— {d.qte} poches</span>
                    </div>
                    <button style={{ background:ACCENT, border:"none", color:"#fff", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700 }}>Attribuer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DERNIERS DONS */}
          <div className="fade d3">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:"#e2e8f0" }}>Derniers dons enregistrés</h2>
              <div style={{ fontSize:13, color:"#64748b" }}>847 donneurs</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column" as const, gap:10, marginBottom:16 }}>
              {derniersDons.map((d, i) => (
                <div key={i} className="card-hover" style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:ACCENT }}>
                    {d.groupe}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{d.donneur}</div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{d.date} — {d.lieu}</div>
                  </div>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981" }} />
                </div>
              ))}
            </div>
            <button style={{ width:"100%", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:ACCENT, padding:"12px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13 }}>
              📢 Lancer un appel aux dons
            </button>
          </div>
        </div>

        {/* BOUTON SOS */}
        <div className="fade d4" style={{ display:"flex", justifyContent:"center" }}>
          <button onClick={() => setShowModal(true)} style={{ background:"linear-gradient(135deg, #ef4444, #b91c1c)", border:"none", color:"#fff", padding:"16px 48px", borderRadius:14, cursor:"pointer", fontWeight:800, fontSize:16, letterSpacing:".04em", boxShadow:"0 0 32px rgba(239,68,68,0.4)" }}>
            🚨 Demande d'urgence sanguine
          </button>
        </div>
      </div>

      {/* MODAL SOS */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#0a1628", border:"1px solid rgba(239,68,68,0.3)", borderRadius:20, padding:32, width:480, maxWidth:"90vw" }}>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:6 }}>🩸 Demande d'urgence sanguine</div>
            <div style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>Formulaire de demande prioritaire — traitement immédiat</div>
            <div style={{ display:"flex", flexDirection:"column" as const, gap:14 }}>
              <div>
                <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Service demandeur</label>
                <input value={formService} onChange={e => setFormService(e.target.value)} placeholder="Ex: Réanimation, Chirurgie..."
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Groupe sanguin</label>
                  <select value={formGroupe} onChange={e => setFormGroupe(e.target.value)}
                    style={{ width:"100%", background:"#0d1f35", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const, cursor:"pointer" }}>
                    <option value="">Sélectionner...</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Quantité (poches)</label>
                  <input value={formQte} onChange={e => setFormQte(e.target.value)} type="number" placeholder="0"
                    style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, boxSizing:"border-box" as const }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, color:"#64748b", fontWeight:600, display:"block", marginBottom:6 }}>Motif médical</label>
                <textarea value={formMotif} onChange={e => setFormMotif(e.target.value)} placeholder="Décrire l'urgence médicale..." rows={3}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"12px 16px", borderRadius:10, fontSize:13, resize:"vertical" as const, boxSizing:"border-box" as const }} />
              </div>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button onClick={() => { setShowModal(false); setFormGroupe(""); setFormQte(""); setFormService(""); setFormMotif("") }}
                  style={{ flex:1, background:"linear-gradient(135deg, #ef4444, #b91c1c)", border:"none", color:"#fff", padding:"13px", borderRadius:10, cursor:"pointer", fontWeight:800, fontSize:14 }}>
                  🚨 Envoyer demande urgente
                </button>
                <button onClick={() => setShowModal(false)}
                  style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"13px 20px", borderRadius:10, cursor:"pointer", fontSize:13 }}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

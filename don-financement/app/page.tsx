"use client"
import { useState, useEffect } from "react"

const STATS = [
  { label: "Collectés", value: "142M", unit: "FCFA", icon: "💰", color: "#f59e0b" },
  { label: "Donateurs", value: "2 847", unit: "personnes", icon: "🤝", color: "#10b981" },
  { label: "Projets financés", value: "12", unit: "terminés", icon: "✅", color: "#0ea5e9" },
  { label: "Pays représentés", value: "34", unit: "diaspora", icon: "🌍", color: "#8b5cf6" },
]

const PROJETS = [
  { nom: "Scanner IRM 3 Tesla", objectif: 85000000, collecte: 67150000, urgent: true, icon: "🧲", desc: "Acquisition d'un scanner IRM haute résolution pour le service de radiologie" },
  { nom: "Unité Pédiatrique", objectif: 45000000, collecte: 31050000, urgent: false, icon: "👶", desc: "Construction et équipement du nouveau pavillon pédiatrique" },
  { nom: "Générateurs hémodialyse", objectif: 28000000, collecte: 17920000, urgent: true, icon: "🩸", desc: "4 générateurs de dialyse Fresenius pour le centre d'hémodialyse" },
  { nom: "Ambulance médicalisée", objectif: 15000000, collecte: 15000000, urgent: false, icon: "🚑", desc: "Ambulance SAMU tout-terrain pour les zones rurales de Touba" },
  { nom: "Bloc opératoire modulaire", objectif: 120000000, collecte: 42000000, urgent: true, icon: "🏥", desc: "2ème bloc opératoire avec salle de réveil et matériel de chirurgie" },
]

const DONATEURS_RECENTS = [
  { nom: "Modou Ndiaye", pays: "🇮🇹 Italie", montant: "250 000 FCFA", date: "il y a 2h" },
  { nom: "Fatou Diallo", pays: "🇫🇷 France", montant: "500 000 FCFA", date: "il y a 5h" },
  { nom: "Cheikh Fall", pays: "🇺🇸 USA", montant: "1 000 000 FCFA", date: "il y a 8h" },
  { nom: "Mariama Bâ", pays: "🇪🇸 Espagne", montant: "100 000 FCFA", date: "il y a 12h" },
  { nom: "Ibrahima Sy", pays: "🇸🇳 Sénégal", montant: "50 000 FCFA", date: "il y a 1j" },
]

const COLOR = "#f59e0b"

export default function DonPage() {
  const [montant, setMontant] = useState("")
  const [methode, setMethode] = useState("")

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes progressFill { from{width:0} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .card{transition:all .3s} .card:hover{transform:translateY(-3px)}
        .prog{animation:progressFill 1.5s ease-out}
        button{cursor:pointer;border:none}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(245,158,11,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌍</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Don & <span style={{color:COLOR}}>Diaspora</span></p>
                <p style={{ fontSize:9, color:"rgba(245,158,11,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Financement Participatif · Hôpital Ndamatou</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:COLOR }} />
              <span style={{ fontSize:11, color:COLOR, fontWeight:700 }}>DONS OUVERTS</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2.5rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:`${i*0.1}s`, background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}30`, borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 2px" }}>{s.value}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:0 }}>{s.unit}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 1.5rem" }}>Projets en cours</h2>
          <div style={{ display:"grid", gap:16, marginBottom:"2.5rem" }}>
            {PROJETS.map((p, i) => {
              const pct = Math.round((p.collecte / p.objectif) * 100);
              const done = pct >= 100;
              return (
                <div key={p.nom} className="card fade" style={{ animationDelay:`${i*0.1}s`, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <span style={{ fontSize:28 }}>{p.icon}</span>
                      <div>
                        <h3 style={{ fontSize:16, fontWeight:700, color:"#fff", margin:0 }}>{p.nom}</h3>
                        <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:0 }}>{p.desc}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      {p.urgent && <span style={{ background:"#ef444418", color:"#ef4444", padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:700 }}>URGENT</span>}
                      {done && <span style={{ background:"#10b98118", color:"#10b981", padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:700 }}>✅ FINANCÉ</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
                    <span style={{ color:"rgba(255,255,255,0.5)" }}>{(p.collecte/1000000).toFixed(1)}M collectés</span>
                    <span style={{ color:COLOR, fontWeight:700 }}>{pct}%</span>
                    <span style={{ color:"rgba(255,255,255,0.35)" }}>Objectif: {(p.objectif/1000000).toFixed(0)}M FCFA</span>
                  </div>
                  <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                    <div className="prog" style={{ width:`${Math.min(pct,100)}%`, height:"100%", background: done ? "#10b981" : `linear-gradient(90deg, ${COLOR}, #d97706)`, borderRadius:100 }} />
                  </div>
                  {!done && <button style={{ marginTop:14, background:`${COLOR}18`, color:COLOR, border:`1px solid ${COLOR}40`, borderRadius:10, padding:"8px 20px", fontSize:13, fontWeight:700, transition:"all 0.2s" }}>Contribuer à ce projet</button>}
                </div>
              );
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,380px), 1fr))", gap:20 }}>
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem" }}>
              <h3 style={{ fontSize:16, fontWeight:700, margin:"0 0 16px" }}>💳 Faire un don</h3>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {["5 000","25 000","100 000","500 000"].map(m => (
                  <button key={m} onClick={() => setMontant(m)} style={{ background: montant===m ? COLOR+"22" : "rgba(255,255,255,0.04)", color: montant===m ? COLOR : "rgba(255,255,255,0.6)", border:`1px solid ${montant===m ? COLOR+"50" : "rgba(255,255,255,0.08)"}`, borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:600 }}>{m} FCFA</button>
                ))}
              </div>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:"0 0 12px" }}>Méthode de paiement</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {["🟠 Orange Money","🔵 Wave","💳 Carte bancaire","🏦 Virement"].map(m => (
                  <button key={m} onClick={() => setMethode(m)} style={{ background: methode===m ? "#0ea5e918" : "rgba(255,255,255,0.04)", color: methode===m ? "#0ea5e9" : "rgba(255,255,255,0.6)", border:`1px solid ${methode===m ? "#0ea5e950" : "rgba(255,255,255,0.08)"}`, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:600 }}>{m}</button>
                ))}
              </div>
              <button style={{ width:"100%", background:`linear-gradient(135deg, ${COLOR}, #d97706)`, color:"#fff", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, transition:"all 0.2s" }}>Valider mon don 🤲</button>
            </div>

            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem" }}>
              <h3 style={{ fontSize:16, fontWeight:700, margin:"0 0 16px" }}>🕐 Derniers donateurs</h3>
              {DONATEURS_RECENTS.map(d => (
                <div key={d.nom} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:600, color:"#fff", margin:0 }}>{d.nom}</p>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:0 }}>{d.pays} · {d.date}</p>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:COLOR }}>{d.montant}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

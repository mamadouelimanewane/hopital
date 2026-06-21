"use client"
import { useState } from "react"

type Tab = "catalogue" | "mes-cours" | "certifications" | "classement"

const cours = [
  { titre:"Cardiologie Avancée", duree:"24h", niveau:"Expert", participants:312, categorie:"Cardiologie", icone:"❤️" },
  { titre:"Protocoles Urgences", duree:"16h", niveau:"Intermédiaire", participants:487, categorie:"Urgences", icone:"🚨" },
  { titre:"Contrôle des Infections", duree:"8h", niveau:"Tous niveaux", participants:621, categorie:"Hygiène", icone:"🦠" },
  { titre:"Pharmacologie Clinique", duree:"32h", niveau:"Avancé", participants:198, categorie:"Pharmacie", icone:"💊" },
  { titre:"Pédiatrie Pratique", duree:"20h", niveau:"Intermédiaire", participants:274, categorie:"Pédiatrie", icone:"👶" },
  { titre:"Chirurgie Mini-invasive", duree:"40h", niveau:"Expert", participants:89, categorie:"Chirurgie", icone:"🔪" },
]

const mesCours = [
  { titre:"Cardiologie Avancée", progression:68, prochaine:"Module 7 — Insuffisance cardiaque", badges:["Cardio I","Cardio II"], couleur:"#f59e0b" },
  { titre:"Contrôle des Infections", progression:45, prochaine:"Module 5 — Désinfection bloc opératoire", badges:["Hygiène I"], couleur:"#f59e0b" },
  { titre:"Réanimation de base", progression:92, prochaine:"Module 12 — Évaluation finale", badges:["Réa I","Réa II","Réa III"], couleur:"#22c55e" },
]

const certifications = [
  { titre:"ACLS — Soins Avancés Cardiaques", statut:"obtenu", date:"15/03/2025", expire:"15/03/2027", score:94, progress:100 },
  { titre:"Protocoles Hygiène Hospitalière", statut:"obtenu", date:"10/01/2026", expire:"10/01/2028", score:88, progress:100 },
  { titre:"RCP Nouveau-né CHNCAK", statut:"obtenu", date:"05/06/2026", expire:"05/06/2028", score:97, progress:100 },
  { titre:"Pharmacovigilance OMS", statut:"en_cours", date:"—", expire:"—", score:0, progress:61 },
  { titre:"Gestion Sepsis Sévère", statut:"en_cours", date:"—", expire:"—", score:0, progress:33 },
]

const classement = [
  { rang:1, initiales:"ON", nom:"Dr. O. Ndiaye", score:4820, badges:12, variation:"+2" },
  { rang:2, initiales:"FB", nom:"Dr. F. Ba", score:4650, badges:10, variation:"=" },
  { rang:3, initiales:"ID", nom:"Dr. I. Diallo", score:4480, badges:9, variation:"+1" },
  { rang:4, initiales:"MS", nom:"Inf. M. Seck", score:4210, badges:8, variation:"-1" },
  { rang:5, initiales:"RC", nom:"Dr. R. Cissé", score:3990, badges:7, variation:"+3" },
]

const accent = "#f59e0b"

export default function LearnPage() {
  const [tab, setTab] = useState<Tab>("catalogue")
  const [inscriptions, setInscriptions] = useState<Set<number>>(new Set([0, 2]))

  function toggleInscription(i: number) {
    setInscriptions(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id:"catalogue", label:"Catalogue", icon:"📚" },
    { id:"mes-cours", label:"Mes Cours", icon:"📖" },
    { id:"certifications", label:"Certifications", icon:"🏆" },
    { id:"classement", label:"Classement", icon:"🥇" },
  ]

  return (
    <div style={{ background:"#050d1a", minHeight:"100vh", color:"#e2e8f0", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.03))", borderBottom:"1px solid rgba(245,158,11,0.2)", padding:"2rem 1.5rem" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:40, padding:"4px 14px", marginBottom:12 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:accent, display:"inline-block", animation:"pulse 2s infinite" }}></span>
                <span style={{ color:accent, fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>PLATEFORME E-LEARNING MÉDICALE</span>
              </div>
              <h1 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:800, color:"#e2e8f0", margin:0 }}>
                MedLearn <span style={{ color:accent }}>CHNCAK</span>
              </h1>
              <p style={{ color:"#64748b", fontSize:14, marginTop:6 }}>Développez vos compétences médicales avec notre plateforme certifiante</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:10, padding:"8px 14px" }}>
              <span style={{ fontSize:16 }}>⭐</span>
              <div>
                <div style={{ color:accent, fontWeight:700, fontSize:13 }}>Niveau Expert</div>
                <div style={{ color:"#64748b", fontSize:11 }}>2 847 XP accumulés</div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
            {[
              { label:"Modules disponibles", value:"234", icon:"📚", couleur:accent },
              { label:"Apprenants actifs", value:"1 247", icon:"👥", couleur:"#fbbf24" },
              { label:"Taux de complétion", value:"89%", icon:"✅", couleur:"#22c55e" },
              { label:"Certifications / mois", value:"8", icon:"🏆", couleur:"#fb923c" },
            ].map((s, i) => (
              <div key={i} style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"1rem 1.25rem", animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  <span style={{ fontSize:11, color:"#64748b" }}>{s.label}</span>
                </div>
                <div style={{ fontSize:26, fontWeight:800, color:s.couleur }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem 1.5rem" }}>

        {/* TABS */}
        <div style={{ display:"flex", gap:8, marginBottom:"1.5rem", flexWrap:"wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? "rgba(245,158,11,0.15)" : "#0a1628",
              color: tab === t.id ? accent : "#64748b",
              border: `1px solid ${tab === t.id ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.06)"}`,
              borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s"
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* CATALOGUE */}
        {tab === "catalogue" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:20, animation:"fadeUp 0.3s ease both" }}>
            {cours.map((c, i) => (
              <div key={i} style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1.25rem", display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <span style={{ fontSize:32 }}>{c.icone}</span>
                  <span style={{ background:"rgba(245,158,11,0.1)", color:accent, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:12, border:"1px solid rgba(245,158,11,0.2)" }}>{c.categorie}</span>
                </div>
                <div>
                  <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:15, marginBottom:4 }}>{c.titre}</div>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    <span style={{ color:"#64748b", fontSize:12 }}>⏱ {c.duree}</span>
                    <span style={{ color:"#64748b", fontSize:12 }}>📊 {c.niveau}</span>
                    <span style={{ color:"#64748b", fontSize:12 }}>👥 {c.participants} participants</span>
                  </div>
                </div>
                <button onClick={() => toggleInscription(i)} style={{
                  background: inscriptions.has(i) ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                  color: inscriptions.has(i) ? "#22c55e" : accent,
                  border: `1px solid ${inscriptions.has(i) ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                  borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s", marginTop:"auto"
                }}>
                  {inscriptions.has(i) ? "✓ Inscrit — Accéder au cours" : "S'inscrire →"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MES COURS */}
        {tab === "mes-cours" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"fadeUp 0.3s ease both" }}>
            {mesCours.map((c, i) => (
              <div key={i} style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1.5rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:16, marginBottom:4 }}>{c.titre}</div>
                    <div style={{ color:"#64748b", fontSize:12 }}>
                      Prochaine leçon: <span style={{ color:"#e2e8f0" }}>{c.prochaine}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:c.couleur, fontWeight:800, fontSize:22 }}>{c.progression}%</div>
                    <div style={{ color:"#64748b", fontSize:11 }}>Complétion</div>
                  </div>
                </div>
                <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, height:8, marginBottom:"1rem", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:6, background: c.progression >= 90 ? "#22c55e" : accent, width:`${c.progression}%`, transition:"width 0.6s ease" }}></div>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                  {c.badges.map((b, j) => (
                    <span key={j} style={{ background:"rgba(245,158,11,0.12)", color:accent, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, border:"1px solid rgba(245,158,11,0.25)" }}>🏅 {b}</span>
                  ))}
                  <button style={{ marginLeft:"auto", background:"rgba(245,158,11,0.12)", color:accent, border:"1px solid rgba(245,158,11,0.25)", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Continuer →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {tab === "certifications" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16, animation:"fadeUp 0.3s ease both" }}>
            {certifications.map((c, i) => (
              <div key={i} style={{ background:"#0a1628", border:`1px solid ${c.statut === "obtenu" ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.15)"}`, borderRadius:14, padding:"1.25rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:8 }}>
                  <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, flex:1 }}>{c.titre}</div>
                  <span style={{
                    background: c.statut === "obtenu" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                    color: c.statut === "obtenu" ? "#22c55e" : accent,
                    fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:12, whiteSpace:"nowrap"
                  }}>
                    {c.statut === "obtenu" ? "✓ OBTENU" : "⟳ EN COURS"}
                  </span>
                </div>
                {c.statut === "obtenu" ? (
                  <>
                    <div style={{ display:"flex", gap:16, marginBottom:10 }}>
                      <div><div style={{ color:"#64748b", fontSize:11 }}>Obtenu le</div><div style={{ color:"#e2e8f0", fontSize:12, fontWeight:600 }}>{c.date}</div></div>
                      <div><div style={{ color:"#64748b", fontSize:11 }}>Expire le</div><div style={{ color:"#e2e8f0", fontSize:12, fontWeight:600 }}>{c.expire}</div></div>
                      <div><div style={{ color:"#64748b", fontSize:11 }}>Score</div><div style={{ color:"#22c55e", fontSize:14, fontWeight:800 }}>{c.score}/100</div></div>
                    </div>
                    <button style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.25)", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>📄 Télécharger PDF</button>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#64748b", marginBottom:4 }}>
                        <span>Progression</span><span style={{ color:accent }}>{c.progress}%</span>
                      </div>
                      <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:4, height:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:4, background:accent, width:`${c.progress}%` }}></div>
                      </div>
                    </div>
                    <button style={{ background:"rgba(245,158,11,0.12)", color:accent, border:"1px solid rgba(245,158,11,0.25)", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Continuer la formation →</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CLASSEMENT */}
        {tab === "classement" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ background:"#0a1628", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, overflow:"hidden" }}>
              <div style={{ padding:"1.25rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <h2 style={{ color:"#e2e8f0", fontWeight:700, fontSize:17, margin:0 }}>Top Apprenants du Mois — Juin 2026</h2>
                <p style={{ color:"#64748b", fontSize:13, margin:"4px 0 0" }}>Classement basé sur les points XP et modules complétés</p>
              </div>
              <div>
                {classement.map((a, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:16, padding:"1rem 1.5rem",
                    borderBottom: i < classement.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: i === 0 ? "rgba(245,158,11,0.05)" : "transparent"
                  }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span style={{ color:"#64748b", fontWeight:800, fontSize:14 }}>#{a.rang}</span>}
                    </div>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(245,158,11,0.15)", border:`2px solid ${i===0?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.08)"}`, display:"flex", alignItems:"center", justifyContent:"center", color:accent, fontWeight:800, fontSize:13 }}>
                      {a.initiales}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14 }}>{a.nom}</div>
                      <div style={{ color:"#64748b", fontSize:12 }}>{a.badges} badges obtenus</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color: i === 0 ? accent : "#e2e8f0", fontWeight:800, fontSize:18 }}>{a.score.toLocaleString()}</div>
                      <div style={{ color:"#64748b", fontSize:11 }}>XP</div>
                    </div>
                    <div style={{
                      color: a.variation.startsWith("+") ? "#22c55e" : a.variation === "=" ? "#64748b" : "#ef4444",
                      fontSize:12, fontWeight:700, minWidth:32, textAlign:"right"
                    }}>{a.variation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

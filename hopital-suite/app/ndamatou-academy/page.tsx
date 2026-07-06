"use client"
import { useState } from "react"
import { manuelApps, categories, type CategorieId } from "./manuelData"

type Onglet = "formations" | "simulations" | "certifications" | "staffs" | "ressources" | "manuel"

const modules = [
  { titre: "Réanimation Cardio-Pulmonaire (RCP)", duree: "12h", niveau: "Tous niveaux", inscrits: 124, progression: 65, icone: "❤️", specialite: "Urgences" },
  { titre: "Chirurgie Laparoscopique Avancée", duree: "40h", niveau: "Chirurgiens", inscrits: 18, progression: 0, icone: "🔪", specialite: "Chirurgie" },
  { titre: "Prise en charge du Paludisme Grave", duree: "8h", niveau: "Urgentistes", inscrits: 87, progression: 100, icone: "🦟", specialite: "Infectiologie" },
  { titre: "Obstétrique d'Urgence ALSO", duree: "16h", niveau: "Sages-femmes", inscrits: 42, progression: 30, icone: "🤰", specialite: "Obstétrique" },
  { titre: "Nutrition Clinique & Dénutrition", duree: "6h", niveau: "Diéteticiens", inscrits: 29, progression: 0, icone: "🥗", specialite: "Nutrition" },
  { titre: "Santé Mentale & Premiers Secours Psy", duree: "10h", niveau: "Tous soignants", inscrits: 156, progression: 80, icone: "🧠", specialite: "Psychiatrie" },
  { titre: "Anesthésie Locorégionale Echoguidée", duree: "24h", niveau: "Anesthésistes", inscrits: 9, progression: 45, icone: "💉", specialite: "Anesthésie" },
  { titre: "Gestion des Sepsis Sévères", duree: "8h", niveau: "Réanimateurs", inscrits: 34, progression: 0, icone: "🧫", specialite: "Réanimation" },
]

const casSimulation = [
  { titre: "Patient 45 ans — Douleur thoracique aiguë", difficulte: 4, specialite: "Cardiologie", duree: "25 min", tentatives: 847 },
  { titre: "Enfant 3 ans — Fièvre 40°C + convulsions", difficulte: 3, specialite: "Pédiatrie", duree: "20 min", tentatives: 623 },
  { titre: "Femme 28 ans — Hémorragie du post-partum", difficulte: 5, specialite: "Obstétrique", duree: "35 min", tentatives: 412 },
  { titre: "Homme 67 ans — AVC ischémique aigu", difficulte: 4, specialite: "Neurologie", duree: "30 min", tentatives: 534 },
  { titre: "Enfant 8 ans — Asthme aigu grave", difficulte: 3, specialite: "Pédiatrie", duree: "18 min", tentatives: 789 },
]

const certifications = [
  { titre: "ACLS — Advanced Cardiac Life Support", statut: "Obtenu", date: "15/03/2025", expiration: "15/03/2027", score: 94 },
  { titre: "ATLS — Advanced Trauma Life Support", statut: "En cours", date: "—", expiration: "—", score: 71 },
  { titre: "RCP Nouveau-né", statut: "Expiré", date: "01/01/2024", expiration: "01/01/2026", score: 88 },
  { titre: "Gestion du Paludisme Grave OMS", statut: "Obtenu", date: "20/06/2025", expiration: "20/06/2027", score: 97 },
]

const staffsVirtuels = [
  { titre: "Cas complexe de cardiomyopathie dilatée", date: "25 Juin 2026, 14h00", participants: 12, statut: "À venir" },
  { titre: "Stratégie thérapeutique — Paludisme résistant", date: "28 Juin 2026, 10h30", participants: 8, statut: "À venir" },
  { titre: "Revue de morbi-mortalité — Maternité Juin", date: "02 Juil 2026, 08h00", participants: 15, statut: "À venir" },
  { titre: "Gestion post-opératoire laparoscopie", date: "18 Juin 2026", participants: 6, statut: "Archivé" },
]

const accent = "#6d28d9"
const card = "#0a1628"
const border = "rgba(255,255,255,0.06)"

export default function NdamatouAcademy() {
  const [onglet, setOnglet] = useState<Onglet>("formations")
  const [simActive, setSimActive] = useState<number | null>(null)
  const [reponseSim, setReponseSim] = useState<number | null>(null)
  const [manuelFiltre, setManuelFiltre] = useState<CategorieId | "toutes">("toutes")
  const [manuelRecherche, setManuelRecherche] = useState("")

  const tabs: { id: Onglet; label: string; icon: string }[] = [
    { id:"formations", label:"Formations", icon:"📚" },
    { id:"simulations", label:"Simulations", icon:"🖥️" },
    { id:"certifications", label:"Certifications", icon:"🏆" },
    { id:"staffs", label:"Staffs Virtuels", icon:"🎥" },
    { id:"manuel", label:"Manuel Applications", icon:"📘" },
    { id:"ressources", label:"Ressources", icon:"📄" },
  ]

  const manuelFiltres = manuelApps.filter(a =>
    (manuelFiltre === "toutes" || a.categorie === manuelFiltre) &&
    (manuelRecherche.trim() === "" || a.nom.toLowerCase().includes(manuelRecherche.toLowerCase()))
  )

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
      <div style={{ background:"linear-gradient(135deg,rgba(109,40,217,0.2),rgba(109,40,217,0.04))", borderBottom:"1px solid rgba(109,40,217,0.25)", padding:"1.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(109,40,217,0.12)", border:"1px solid rgba(109,40,217,0.35)", borderRadius:40, padding:"4px 14px", marginBottom:10 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#a78bfa", display:"inline-block", animation:"pulse 2s infinite" }}></span>
                <span style={{ color:"#a78bfa", fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>CENTRE DE RÉFÉRENCE MÉDICALE</span>
              </div>
              <h1 style={{ fontSize:"clamp(20px,2.5vw,28px)", fontWeight:800, color:"#e2e8f0", margin:0 }}>
                Ndamatou <span style={{ color:"#a78bfa" }}>Academy</span>
              </h1>
              <p style={{ color:"#64748b", fontSize:13, marginTop:4 }}>Afrique de l'Ouest — Plateforme de formation médicale de référence</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(109,40,217,0.12)", border:"1px solid rgba(109,40,217,0.3)", borderRadius:10, padding:"8px 14px" }}>
              <span style={{ fontSize:16 }}>⭐</span>
              <div>
                <div style={{ color:"#a78bfa", fontWeight:700, fontSize:13 }}>Niveau Expert</div>
                <div style={{ color:"#64748b", fontSize:11 }}>2 847 XP</div>
              </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
            {[
              { label:"Apprenants actifs", val:"847", icon:"👤", color:"#a78bfa" },
              { label:"Modules disponibles", val:"124", icon:"📚", color:"#818cf8" },
              { label:"Certifications délivrées", val:"1 203", icon:"🏆", color:"#22c55e" },
              { label:"Pays représentés", val:"15", icon:"🌍", color:"#f59e0b" },
            ].map((s, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"1rem", textAlign:"center", animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{s.label}</div>
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
              background: onglet === t.id ? "rgba(109,40,217,0.2)" : card,
              color: onglet === t.id ? "#a78bfa" : "rgba(255,255,255,0.5)",
              border: `1px solid ${onglet === t.id ? "rgba(109,40,217,0.5)" : border}`,
              borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s"
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* FORMATIONS */}
        {onglet === "formations" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20, animation:"fadeUp 0.3s ease both" }}>
            {modules.map((m, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem", display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <span style={{ fontSize:30 }}>{m.icone}</span>
                  <span style={{ background:"rgba(109,40,217,0.12)", color:"#a78bfa", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:12, border:"1px solid rgba(109,40,217,0.2)" }}>{m.specialite}</span>
                </div>
                <div>
                  <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14, marginBottom:4 }}>{m.titre}</div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <span style={{ color:"#64748b", fontSize:11 }}>⏱ {m.duree}</span>
                    <span style={{ color:"#64748b", fontSize:11 }}>👥 {m.inscrits} inscrits</span>
                    <span style={{ color:"#64748b", fontSize:11 }}>{m.niveau}</span>
                  </div>
                </div>
                {m.progression > 0 && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#64748b", marginBottom:4 }}>
                      <span>Progression</span><span>{m.progression}%</span>
                    </div>
                    <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:4, background: m.progression === 100 ? "#22c55e" : "#7c3aed", width:`${m.progression}%` }}></div>
                    </div>
                  </div>
                )}
                <button style={{
                  width:"100%", padding:"8px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", border:"none",
                  background: m.progression === 100 ? "rgba(34,197,94,0.15)" : m.progression > 0 ? "rgba(109,40,217,0.2)" : "rgba(255,255,255,0.06)",
                  color: m.progression === 100 ? "#22c55e" : m.progression > 0 ? "#a78bfa" : "rgba(255,255,255,0.7)",
                  marginTop:"auto"
                }}>
                  {m.progression === 100 ? "✅ Complété" : m.progression > 0 ? "Continuer →" : "Commencer"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SIMULATIONS */}
        {onglet === "simulations" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            {simActive === null ? (
              <>
                <p style={{ color:"#64748b", fontSize:13, marginBottom:16 }}>Entraînez-vous sur des cas cliniques réels anonymisés. Chaque cas est noté et contribue à votre score.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {casSimulation.map((c, i) => (
                    <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                          <span style={{ background:"rgba(59,130,246,0.12)", color:"#60a5fa", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:12 }}>{c.specialite}</span>
                          <span style={{ color:"#fbbf24", fontSize:12 }}>{"★".repeat(c.difficulte)}{"☆".repeat(5-c.difficulte)}</span>
                        </div>
                        <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14 }}>{c.titre}</div>
                        <div style={{ display:"flex", gap:12, marginTop:4 }}>
                          <span style={{ color:"#64748b", fontSize:12 }}>⏱ {c.duree}</span>
                          <span style={{ color:"#64748b", fontSize:12 }}>👥 {c.tentatives.toLocaleString()} tentatives</span>
                        </div>
                      </div>
                      <button onClick={() => { setSimActive(i); setReponseSim(null) }}
                        style={{ background:"rgba(109,40,217,0.6)", color:"white", border:"none", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                        ▶ Simuler
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.5rem", maxWidth:700, margin:"0 auto" }}>
                <button onClick={() => setSimActive(null)} style={{ color:"#a78bfa", background:"none", border:"none", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:16 }}>← Retour aux simulations</button>
                <h3 style={{ color:"#e2e8f0", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>{casSimulation[simActive].titre}</h3>
                <p style={{ color:"#64748b", fontSize:13, margin:"0 0 1.5rem" }}>Un patient se présente aux urgences. Vous êtes le médecin de garde. Quelle est votre première action ?</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {["Bilan sanguin en urgence (NFS, ionogramme, troponine)", "ECG 12 dérivations immédiat", "Administration d'aspirine 250mg", "Appel du cardiologue de garde"].map((opt, j) => (
                    <button key={j} onClick={() => setReponseSim(j)}
                      style={{
                        textAlign:"left", padding:"12px 16px", borderRadius:12, fontSize:13, cursor:"pointer", transition:"all 0.2s",
                        border: reponseSim === null ? `1px solid ${border}` : j === 1 ? "1px solid rgba(34,197,94,0.5)" : reponseSim === j ? "1px solid rgba(239,68,68,0.5)" : `1px solid ${border}`,
                        background: reponseSim === null ? "rgba(255,255,255,0.04)" : j === 1 ? "rgba(34,197,94,0.1)" : reponseSim === j ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.02)",
                        color: reponseSim === null ? "#e2e8f0" : j === 1 ? "#22c55e" : reponseSim === j ? "#f87171" : "#64748b"
                      }}>
                      {String.fromCharCode(65+j)}. {opt}
                      {reponseSim !== null && j === 1 && " ✅ Bonne réponse"}
                      {reponseSim !== null && reponseSim === j && j !== 1 && " ❌"}
                    </button>
                  ))}
                </div>
                {reponseSim !== null && (
                  <div style={{ marginTop:16, background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:12, padding:"1rem", fontSize:13, color:"#93c5fd" }}>
                    <strong>Explication :</strong> L'ECG est prioritaire devant une douleur thoracique — il permet de diagnostiquer un SCA en quelques minutes et conditionne toute la prise en charge ultérieure.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {onglet === "certifications" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16, animation:"fadeUp 0.3s ease both" }}>
            {certifications.map((c, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${c.statut === "Obtenu" ? "rgba(34,197,94,0.2)" : c.statut === "Expiré" ? "rgba(239,68,68,0.2)" : border}`, borderRadius:14, padding:"1.25rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:8 }}>
                  <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14, flex:1 }}>{c.titre}</div>
                  <span style={{
                    fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:12, whiteSpace:"nowrap",
                    background: c.statut === "Obtenu" ? "rgba(34,197,94,0.12)" : c.statut === "En cours" ? "rgba(59,130,246,0.12)" : "rgba(239,68,68,0.12)",
                    color: c.statut === "Obtenu" ? "#22c55e" : c.statut === "En cours" ? "#60a5fa" : "#f87171"
                  }}>{c.statut}</span>
                </div>
                {c.statut !== "En cours" && (
                  <div style={{ display:"flex", gap:16, marginBottom:10 }}>
                    <div><div style={{ color:"#64748b", fontSize:10 }}>Obtenu</div><div style={{ color:"#e2e8f0", fontSize:12, fontWeight:600 }}>{c.date}</div></div>
                    <div><div style={{ color:"#64748b", fontSize:10 }}>Expire</div><div style={{ color:"#e2e8f0", fontSize:12, fontWeight:600 }}>{c.expiration}</div></div>
                  </div>
                )}
                {c.statut === "En cours" && (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#64748b", marginBottom:4 }}>
                      <span>Progression</span><span style={{ color:"#60a5fa" }}>{c.score}%</span>
                    </div>
                    <div style={{ height:5, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:4, background:"#3b82f6", width:`${c.score}%` }}></div>
                    </div>
                  </div>
                )}
                {c.statut === "Obtenu" && <div style={{ color:"#22c55e", fontSize:12, fontWeight:700, marginBottom:10 }}>🏅 Score: {c.score}/100</div>}
                {c.statut === "Expiré" && <p style={{ color:"#f87171", fontSize:11, fontWeight:600, margin:"0 0 10px" }}>⚠️ Renouvellement requis</p>}
                <button style={{ color:"#a78bfa", background:"none", border:"none", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  {c.statut === "Obtenu" ? "📄 Télécharger PDF →" : c.statut === "En cours" ? "Continuer →" : "Se réinscrire →"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* STAFFS VIRTUELS */}
        {onglet === "staffs" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12, animation:"fadeUp 0.3s ease both" }}>
            <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:"0 0 4px" }}>Prochains staffs cliniques virtuels</h3>
            {staffsVirtuels.map((s, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                <div>
                  <span style={{
                    background: s.statut === "À venir" ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.06)",
                    color: s.statut === "À venir" ? "#60a5fa" : "#64748b",
                    fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:12, display:"inline-block", marginBottom:6
                  }}>{s.statut}</span>
                  <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14 }}>{s.titre}</div>
                  <div style={{ display:"flex", gap:12, marginTop:4 }}>
                    <span style={{ color:"#64748b", fontSize:12 }}>📅 {s.date}</span>
                    <span style={{ color:"#64748b", fontSize:12 }}>👥 {s.participants} participants</span>
                  </div>
                </div>
                <button style={{
                  background: s.statut === "À venir" ? "rgba(109,40,217,0.5)" : "rgba(255,255,255,0.06)",
                  color: s.statut === "À venir" ? "white" : "rgba(255,255,255,0.5)",
                  border:"none", borderRadius:10, padding:"8px 18px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap"
                }}>
                  {s.statut === "À venir" ? "S'inscrire" : "Voir l'archive"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MANUEL APPLICATIONS */}
        {onglet === "manuel" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:16 }}>
              Manuel de formation complet des 34 applications de l&apos;écosystème Ndamatou : objectif, rôles concernés, fonctionnalités clés et guide d&apos;utilisation pas à pas.
            </p>

            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
              <input
                value={manuelRecherche} onChange={e => setManuelRecherche(e.target.value)}
                placeholder="Rechercher une application…"
                style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:"8px 14px", fontSize:13, color:"#e2e8f0", outline:"none", minWidth:220 }}
              />
              <button onClick={() => setManuelFiltre("toutes")} style={{
                background: manuelFiltre === "toutes" ? "rgba(109,40,217,0.2)" : card,
                color: manuelFiltre === "toutes" ? "#a78bfa" : "rgba(255,255,255,0.5)",
                border:`1px solid ${manuelFiltre === "toutes" ? "rgba(109,40,217,0.5)" : border}`,
                borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600, cursor:"pointer"
              }}>Toutes ({manuelApps.length})</button>
              {(Object.keys(categories) as CategorieId[]).map(c => (
                <button key={c} onClick={() => setManuelFiltre(c)} style={{
                  background: manuelFiltre === c ? `${categories[c].couleur}25` : card,
                  color: manuelFiltre === c ? categories[c].couleur : "rgba(255,255,255,0.5)",
                  border:`1px solid ${manuelFiltre === c ? `${categories[c].couleur}70` : border}`,
                  borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600, cursor:"pointer"
                }}>{categories[c].label} ({manuelApps.filter(a=>a.categorie===c).length})</button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
              {manuelFiltres.map(a => {
                const coul = categories[a.categorie].couleur
                return (
                  <a key={a.id} href={`/ndamatou-academy/manuel/${a.id}`} style={{
                    background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.1rem 1.25rem",
                    display:"flex", flexDirection:"column", gap:10, textDecoration:"none", transition:"border-color 0.2s"
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontSize:26 }}>{a.icone}</span>
                      <div>
                        <div style={{ fontWeight:700, color:"#e2e8f0", fontSize:14 }}>{a.nom}</div>
                        <span style={{ background:`${coul}18`, color:coul, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10 }}>{categories[a.categorie].label}</span>
                      </div>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, lineHeight:1.6, margin:0 }}>{a.objectif}</p>
                    <span style={{ color:coul, fontSize:12, fontWeight:700, marginTop:"auto" }}>📘 Consulter le manuel →</span>
                  </a>
                )
              })}
              {manuelFiltres.length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, textAlign:"center", padding:"2rem 0", gridColumn:"1 / -1" }}>Aucune application ne correspond à cette recherche.</p>
              )}
            </div>
          </div>
        )}

        {/* RESSOURCES */}
        {onglet === "ressources" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16, animation:"fadeUp 0.3s ease both" }}>
            {["Protocoles Ndamatou 2026", "Guide Paludisme Grave — OMS", "Manuel Obstétrique d'Urgence", "Atlas Anatomique Interactif", "Pharmacopée Hospitalière", "Guides de Bonne Pratique"].map((r, i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem", display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
                <div style={{ width:44, height:44, background:"rgba(109,40,217,0.15)", border:"1px solid rgba(109,40,217,0.25)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>📄</div>
                <div>
                  <div style={{ fontWeight:600, color:"#e2e8f0", fontSize:13 }}>{r}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>PDF — Mise à jour 2026</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

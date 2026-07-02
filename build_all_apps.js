/**
 * build_all_apps.js — Génère toutes les pages d'applications manquantes pour l'Hôpital Ndamatou
 * Chaque app reçoit : layout.tsx (metadata) + page.tsx (contenu complet, dark mode, données réalistes)
 */
const fs = require('fs');
const path = require('path');
const ROOT = 'c:/gravity/hopital';

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function write(file, content) { ensureDir(path.dirname(file)); fs.writeFileSync(file, content, 'utf8'); }

function makeLayout(title, desc, kw) {
  return `import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "${title}",
  description: "${desc}",
  keywords: [${kw.map(k => `"${k}"`).join(', ')}],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}
`;
}

// ═══════════════════════════════════════════
// 1. CHATBOT-TRIAGE — déjà bon, juste layout
// ═══════════════════════════════════════════
write(path.join(ROOT, 'chatbot-triage/app/layout.tsx'),
  makeLayout("Chatbot Triage — Hôpital Ndamatou", "Assistant de triage médical IA multilingue pour l'Hôpital Ndamatou de Touba.", ["triage","chatbot","Ndamatou","urgences","IA"]));
console.log('✅ chatbot-triage layout');

// ═══════════════════════════════════════════
// 2. CHNCAK-ACADEMY → Ndamatou Academy
// ═══════════════════════════════════════════
write(path.join(ROOT, 'chncak-academy/app/layout.tsx'),
  makeLayout("Ndamatou Academy — Formation Médicale", "Plateforme de formation médicale continue de l'Hôpital Ndamatou de Touba.", ["formation","academy","Ndamatou","médical","e-learning"]));

write(path.join(ROOT, 'chncak-academy/app/page.tsx'), `"use client"
import { useState } from "react"

const STATS = [
  { label: "Apprenants actifs", value: "247", icon: "👨‍⚕️", color: "#6366f1" },
  { label: "Modules disponibles", value: "34", icon: "📚", color: "#0ea5e9" },
  { label: "Taux complétion", value: "89%", icon: "📊", color: "#10b981" },
  { label: "Formateurs", value: "12", icon: "🎓", color: "#f59e0b" },
]

const FORMATIONS = [
  { titre: "Gestion des urgences cardiaques", formateur: "Pr. Ibrahima Ndiaye", duree: "24h", niveau: "Expert", inscrits: 34, statut: "En cours", progress: 67, color: "#ef4444" },
  { titre: "Soins en néonatologie", formateur: "Dr. Fatou Mbaye", duree: "18h", niveau: "Intermédiaire", inscrits: 28, statut: "En cours", progress: 45, color: "#ec4899" },
  { titre: "Techniques de dialyse", formateur: "Dr. Ousmane Fall", duree: "16h", niveau: "Expert", inscrits: 19, statut: "Disponible", progress: 0, color: "#0ea5e9" },
  { titre: "Radiologie numérique & IA", formateur: "Pr. Amadou Diallo", duree: "20h", niveau: "Expert", inscrits: 42, statut: "En cours", progress: 82, color: "#8b5cf6" },
  { titre: "Gestion médicale du Magal", formateur: "Dr. Serigne Bamba Ndiaye", duree: "12h", niveau: "Débutant", inscrits: 67, statut: "Disponible", progress: 0, color: "#d97706" },
  { titre: "Santé mentale en milieu hospitalier", formateur: "Dr. Aïssatou Diop", duree: "14h", niveau: "Intermédiaire", inscrits: 23, statut: "À venir", progress: 0, color: "#06b6d4" },
  { titre: "Pharmacovigilance avancée", formateur: "Dr. Moussa Sow", duree: "10h", niveau: "Intermédiaire", inscrits: 31, statut: "Disponible", progress: 0, color: "#14b8a6" },
  { titre: "Chirurgie mini-invasive", formateur: "Pr. Cheikh Tidiane Dieng", duree: "30h", niveau: "Expert", inscrits: 12, statut: "À venir", progress: 0, color: "#16a34a" },
]

const COLOR = "#6366f1"

export default function AcademyPage() {
  const [filter, setFilter] = useState("Tous")
  const filtered = filter === "Tous" ? FORMATIONS : FORMATIONS.filter(f => f.statut === filter)

  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .card{transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer} .card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(99,102,241,0.15)}
        button{cursor:pointer;border:none}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"'Inter',system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(99,102,241,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 0 20px rgba(99,102,241,0.3)" }}>🎓</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Ndamatou <span style={{color:COLOR}}>Academy</span></p>
                <p style={{ fontSize:9, color:"rgba(99,102,241,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Formation Médicale Continue · Touba</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:COLOR }} />
              <span style={{ fontSize:11, color:COLOR, fontWeight:700 }}>PLATEFORME ACTIVE</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2.5rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.03)", border:\`1px solid \${s.color}30\`, borderRadius:16, padding:"1.5rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                    <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 0" }}>{s.value}</p>
                  </div>
                  <span style={{ fontSize:28 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:12 }}>
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, margin:0 }}>Catalogue des Formations</h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", margin:0 }}>{filtered.length} formations</p>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {["Tous","En cours","Disponible","À venir"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ background: filter===f ? COLOR+"22" : "rgba(255,255,255,0.04)", color: filter===f ? COLOR : "rgba(255,255,255,0.5)", border:\`1px solid \${filter===f ? COLOR+"50" : "rgba(255,255,255,0.08)"}\`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, transition:"all 0.2s" }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,340px), 1fr))", gap:16 }}>
            {filtered.map((f, i) => (
              <div key={f.titre} className="card fade" style={{ animationDelay:\`\${i*0.08}s\`, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:\`linear-gradient(90deg, \${f.color}, transparent)\`, opacity:0.5 }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, color:"#fff", margin:0, lineHeight:1.4, flex:1, marginRight:12 }}>{f.titre}</h3>
                  <span style={{ background:\`\${f.statut==="En cours" ? "#0ea5e9" : f.statut==="Disponible" ? "#10b981" : "#f59e0b"}18\`, color: f.statut==="En cours" ? "#0ea5e9" : f.statut==="Disponible" ? "#10b981" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>{f.statut}</span>
                </div>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:"0 0 12px" }}>👤 {f.formateur} · ⏱ {f.duree} · 📊 {f.niveau}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{f.inscrits} inscrits</span>
                  {f.progress > 0 && <span style={{ fontSize:11, color:f.color, fontWeight:700 }}>{f.progress}%</span>}
                </div>
                {f.progress > 0 && (
                  <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                    <div style={{ width:\`\${f.progress}%\`, height:"100%", background:f.color, borderRadius:100, transition:"width 1s" }} />
                  </div>
                )}
                <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", gap:8 }}>
                  {f.statut === "En cours" && <button style={{ background:\`\${f.color}18\`, color:f.color, border:\`1px solid \${f.color}30\`, borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700 }}>Continuer</button>}
                  {f.statut === "Disponible" && <button style={{ background:\`\${COLOR}18\`, color:COLOR, border:\`1px solid \${COLOR}30\`, borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700 }}>S'inscrire</button>}
                  {f.statut === "À venir" && <button style={{ background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700 }}>Bientôt</button>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ chncak-academy (Ndamatou Academy)');

// ═══════════════════════════════════════════
// 3. DON-FINANCEMENT
// ═══════════════════════════════════════════
write(path.join(ROOT, 'don-financement/app/layout.tsx'),
  makeLayout("Don & Diaspora — Hôpital Ndamatou", "Plateforme de dons et financement participatif pour l'Hôpital Ndamatou de Touba.", ["don","diaspora","financement","Ndamatou","Touba"]));

write(path.join(ROOT, 'don-financement/app/page.tsx'), `"use client"
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
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes progressFill { from{width:0} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .card{transition:all .3s} .card:hover{transform:translateY(-3px)}
        .prog{animation:progressFill 1.5s ease-out}
        button{cursor:pointer;border:none}
      \`}</style>
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
              <div key={s.label} className="fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.03)", border:\`1px solid \${s.color}30\`, borderRadius:16, padding:"1.5rem" }}>
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
                <div key={p.nom} className="card fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem" }}>
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
                    <div className="prog" style={{ width:\`\${Math.min(pct,100)}%\`, height:"100%", background: done ? "#10b981" : \`linear-gradient(90deg, \${COLOR}, #d97706)\`, borderRadius:100 }} />
                  </div>
                  {!done && <button style={{ marginTop:14, background:\`\${COLOR}18\`, color:COLOR, border:\`1px solid \${COLOR}40\`, borderRadius:10, padding:"8px 20px", fontSize:13, fontWeight:700, transition:"all 0.2s" }}>Contribuer à ce projet</button>}
                </div>
              );
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,380px), 1fr))", gap:20 }}>
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem" }}>
              <h3 style={{ fontSize:16, fontWeight:700, margin:"0 0 16px" }}>💳 Faire un don</h3>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {["5 000","25 000","100 000","500 000"].map(m => (
                  <button key={m} onClick={() => setMontant(m)} style={{ background: montant===m ? COLOR+"22" : "rgba(255,255,255,0.04)", color: montant===m ? COLOR : "rgba(255,255,255,0.6)", border:\`1px solid \${montant===m ? COLOR+"50" : "rgba(255,255,255,0.08)"}\`, borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:600 }}>{m} FCFA</button>
                ))}
              </div>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:"0 0 12px" }}>Méthode de paiement</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {["🟠 Orange Money","🔵 Wave","💳 Carte bancaire","🏦 Virement"].map(m => (
                  <button key={m} onClick={() => setMethode(m)} style={{ background: methode===m ? "#0ea5e918" : "rgba(255,255,255,0.04)", color: methode===m ? "#0ea5e9" : "rgba(255,255,255,0.6)", border:\`1px solid \${methode===m ? "#0ea5e950" : "rgba(255,255,255,0.08)"}\`, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:600 }}>{m}</button>
                ))}
              </div>
              <button style={{ width:"100%", background:\`linear-gradient(135deg, \${COLOR}, #d97706)\`, color:"#fff", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, transition:"all 0.2s" }}>Valider mon don 🤲</button>
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
`);
console.log('✅ don-financement (Don & Diaspora)');

// ═══════════════════════════════════════════
// 4. EPIDEMIO-WATCH
// ═══════════════════════════════════════════
write(path.join(ROOT, 'epidemio-watch/app/layout.tsx'),
  makeLayout("Épidémio-Watch — Surveillance Sénégal", "Surveillance épidémiologique temps réel — Hôpital Ndamatou de Touba.", ["épidémiologie","surveillance","Ndamatou","maladies","alerte"]));

write(path.join(ROOT, 'epidemio-watch/app/page.tsx'), `"use client"
import { useState } from "react"

const STATS = [
  { label: "Cas signalés aujourd'hui", value: "47", icon: "🦠", color: "#ef4444" },
  { label: "Maladies surveillées", value: "8", icon: "📊", color: "#f59e0b" },
  { label: "Régions couvertes", value: "14", icon: "🗺️", color: "#0ea5e9" },
  { label: "Alertes actives", value: "2", icon: "🚨", color: "#dc2626" },
]

const MALADIES = [
  { nom: "Paludisme", cas: 1240, tendance: "+23%", up: true, gravite: "élevée", region: "Touba, Diourbel" },
  { nom: "Méningite", cas: 8, tendance: "stable", up: false, gravite: "critique", region: "Saint-Louis" },
  { nom: "Choléra", cas: 0, tendance: "✓ Zéro", up: false, gravite: "surveillée", region: "—" },
  { nom: "Dengue", cas: 34, tendance: "+5%", up: true, gravite: "modérée", region: "Dakar, Thiès" },
  { nom: "Rougeole", cas: 2, tendance: "-80%", up: false, gravite: "faible", region: "Ziguinchor" },
  { nom: "Tuberculose", cas: 67, tendance: "+2%", up: true, gravite: "élevée", region: "Dakar, Touba" },
  { nom: "COVID-19", cas: 12, tendance: "-45%", up: false, gravite: "faible", region: "Dakar" },
  { nom: "Fièvre jaune", cas: 0, tendance: "✓ Zéro", up: false, gravite: "surveillée", region: "—" },
]

const REGIONS = [
  { nom: "Touba / Diourbel", statut: "ALERTE", cas: 487, color: "#ef4444" },
  { nom: "Dakar", statut: "VIGILANCE", cas: 234, color: "#f59e0b" },
  { nom: "Thiès", statut: "NORMAL", cas: 67, color: "#10b981" },
  { nom: "Saint-Louis", statut: "ALERTE", cas: 89, color: "#ef4444" },
  { nom: "Ziguinchor", statut: "NORMAL", cas: 23, color: "#10b981" },
  { nom: "Kaolack", statut: "VIGILANCE", cas: 56, color: "#f59e0b" },
]

const COLOR = "#ef4444"

export default function EpidemioPage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .blink{animation:blink 1s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04) !important}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <div style={{ background:"#7f1d1d", padding:"10px 1.5rem", textAlign:"center" }}>
          <p className="blink" style={{ fontSize:13, fontWeight:700, color:"#fecaca", margin:0 }}>
            🚨 ALERTE ACTIVE : Cas de paludisme en hausse de 23% — Région de Touba / Diourbel
          </p>
        </div>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(239,68,68,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#ef4444,#991b1b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🦠</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Épidémio<span style={{color:COLOR}}>-Watch</span></p>
                <p style={{ fontSize:9, color:"rgba(239,68,68,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Surveillance Épidémique · Sénégal</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.03)", border:\`1px solid \${s.color}30\`, borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 0" }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden", marginBottom:"2rem" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Tableau de surveillance par maladie</h2>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["Maladie","Cas / semaine","Tendance","Gravité","Régions"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {MALADIES.map(m => (
                  <tr key={m.nom} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{m.nom}</td>
                    <td style={{ padding:"14px 16px", fontSize:16, fontWeight:800, color: m.cas > 100 ? "#ef4444" : m.cas > 0 ? "#f59e0b" : "#10b981" }}>{m.cas.toLocaleString()}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:600, color: m.up ? "#ef4444" : "#10b981" }}>{m.tendance}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: m.gravite==="critique" ? "#ef444418" : m.gravite==="élevée" ? "#f59e0b18" : m.gravite==="modérée" ? "#0ea5e918" : m.gravite==="surveillée" ? "#6366f118" : "#10b98118", color: m.gravite==="critique" ? "#ef4444" : m.gravite==="élevée" ? "#f59e0b" : m.gravite==="modérée" ? "#0ea5e9" : m.gravite==="surveillée" ? "#6366f1" : "#10b981", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{m.gravite}</span>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{m.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Statut par région</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
            {REGIONS.map(r => (
              <div key={r.nom} className="fade" style={{ background:"rgba(255,255,255,0.02)", border:\`1px solid \${r.color}30\`, borderRadius:12, padding:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{r.nom}</span>
                  <span style={{ background:\`\${r.color}18\`, color:r.color, padding:"2px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{r.statut}</span>
                </div>
                <p style={{ fontSize:24, fontWeight:800, color:r.color, margin:0 }}>{r.cas} <span style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.35)" }}>cas</span></p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ epidemio-watch');

// ═══════════════════════════════════════════
// 5. IA-DIAGNOSTIC
// ═══════════════════════════════════════════
write(path.join(ROOT, 'ia-diagnostic/app/layout.tsx'),
  makeLayout("IA Diagnostic — Intelligence Artificielle Médicale", "Diagnostic assisté par IA pour l'Hôpital Ndamatou de Touba.", ["IA","diagnostic","radiologie","Ndamatou","intelligence artificielle"]));

write(path.join(ROOT, 'ia-diagnostic/app/page.tsx'), `"use client"
import { useState, useEffect } from "react"

const STATS = [
  { label: "Analyses aujourd'hui", value: "1 240", icon: "🧠", color: "#7c3aed" },
  { label: "Précision IA", value: "94.7%", icon: "🎯", color: "#10b981" },
  { label: "Temps moyen", value: "3.2s", icon: "⚡", color: "#f59e0b" },
  { label: "Modèles IA actifs", value: "8", icon: "🤖", color: "#0ea5e9" },
]

const ANALYSES = [
  { patient: "Ousmane Diop", type: "Radio thoracique", resultat: "Pneumonie suspectée", confiance: 89, medecin: "Dr. Ndiaye", statut: "validé" },
  { patient: "Aïssatou Fall", type: "ECG 12 dérivations", resultat: "Rythme sinusal normal", confiance: 97, medecin: "Dr. Mbaye", statut: "validé" },
  { patient: "Amadou Ndour", type: "IRM cérébrale", resultat: "Micro-anévrisme détecté", confiance: 92, medecin: "Pr. Diallo", statut: "en attente" },
  { patient: "Sokhna Mbaye", type: "Dermatoscopie", resultat: "Lésion bénigne", confiance: 85, medecin: "Dr. Sow", statut: "validé" },
  { patient: "Ibrahima Sy", type: "Fond d'œil", resultat: "Rétinopathie diabétique stade 2", confiance: 91, medecin: "Dr. Fall", statut: "en attente" },
  { patient: "Mariama Bâ", type: "Radio thoracique", resultat: "Normal — RAS", confiance: 98, medecin: "Dr. Ndiaye", statut: "validé" },
]

const MODELES = [
  { nom: "ChestXpert v3", domaine: "Radiologie thoracique", precision: "94.2%", maj: "28/06/2026" },
  { nom: "CardioNet-SN", domaine: "ECG & cardiologie", precision: "96.1%", maj: "15/06/2026" },
  { nom: "NeuroScan-AI", domaine: "IRM cérébrale", precision: "92.8%", maj: "01/07/2026" },
  { nom: "DermaScope-ML", domaine: "Dermatologie", precision: "88.5%", maj: "20/06/2026" },
  { nom: "RetinAI", domaine: "Ophtalmologie", precision: "91.3%", maj: "10/06/2026" },
  { nom: "BioMarker-Detect", domaine: "Analyses biologiques", precision: "95.7%", maj: "25/06/2026" },
  { nom: "PathFinder v2", domaine: "Anatomopathologie", precision: "89.4%", maj: "05/06/2026" },
  { nom: "MalarIA", domaine: "Détection paludisme", precision: "97.3%", maj: "30/06/2026" },
]

const COLOR = "#7c3aed"

export default function IADiagPage() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setProgress(p => p < 100 ? p + 2 : 100), 150)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes scan { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
        .scanbar{background:linear-gradient(90deg,transparent,#7c3aed,transparent);background-size:200% 100%;animation:scan 2s linear infinite}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(124,58,237,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#7c3aed,#5b21b6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 0 20px rgba(124,58,237,0.3)" }}>🧠</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Ndamatou <span style={{color:COLOR}}>IA</span></p>
                <p style={{ fontSize:9, color:"rgba(124,58,237,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Intelligence Artificielle Médicale · Touba</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.03)", border:\`1px solid \${s.color}30\`, borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 0" }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="fade" style={{ animationDelay:"0.4s", background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>🔬 Analyse IRM en cours — Patient: Amadou Ndour</p>
              <span style={{ fontSize:16, fontWeight:800, color:COLOR }}>{progress}%</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
              <div style={{ width:\`\${progress}%\`, height:"100%", borderRadius:100, transition:"width 0.15s" }} className="scanbar" />
            </div>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"8px 0 0" }}>{progress < 100 ? "Analyse des coupes axiales, sagittales et coronales..." : "✅ Analyse terminée — Résultats transmis au Pr. Diallo"}</p>
          </div>
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden", marginBottom:"2rem" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Analyses récentes</h2>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["Patient","Type","Résultat IA","Confiance","Médecin","Statut"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ANALYSES.map(a => (
                  <tr key={a.patient+a.type} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{a.patient}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{a.type}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:600, color: a.resultat.includes("Normal") || a.resultat.includes("bénigne") ? "#10b981" : "#f59e0b" }}>{a.resultat}</td>
                    <td style={{ padding:"14px 16px" }}><span style={{ fontSize:14, fontWeight:800, color: a.confiance > 90 ? "#10b981" : "#f59e0b" }}>{a.confiance}%</span></td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{a.medecin}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: a.statut==="validé" ? "#10b98118" : "#f59e0b18", color: a.statut==="validé" ? "#10b981" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{a.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Modèles IA déployés</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:12 }}>
            {MODELES.map(m => (
              <div key={m.nom} className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>{m.nom}</p>
                  <span style={{ fontSize:13, fontWeight:800, color:"#10b981" }}>{m.precision}</span>
                </div>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:"4px 0 0" }}>{m.domaine} · Mis à jour le {m.maj}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ ia-diagnostic');

// ═══════════════════════════════════════════
// 6. LAB-CONNECT
// ═══════════════════════════════════════════
write(path.join(ROOT, 'lab-connect/app/layout.tsx'),
  makeLayout("Lab Connect — Laboratoire Connecté Ndamatou", "Gestion du laboratoire médical de l'Hôpital Ndamatou de Touba.", ["laboratoire","analyses","Ndamatou","biologie","automates"]));

write(path.join(ROOT, 'lab-connect/app/page.tsx'), `"use client"
const STATS = [
  { label: "Analyses en attente", value: "342", icon: "⏳", color: "#f59e0b" },
  { label: "Résultats prêts", value: "89", icon: "✅", color: "#10b981" },
  { label: "Automates connectés", value: "12", icon: "🔬", color: "#0ea5e9" },
  { label: "Délai moyen", value: "4.2h", icon: "⏱️", color: "#6366f1" },
]

const ANALYSES = [
  { num: "PRE-4827", patient: "Mame Diarra Seck", type: "NFS complète", automate: "Sysmex XN-550", priorite: "Normale", temps: "45 min", statut: "En cours" },
  { num: "PRE-4828", patient: "Ibrahima Koné", type: "Biochimie", automate: "Cobas c311", priorite: "Urgente", temps: "20 min", statut: "En cours" },
  { num: "PRE-4829", patient: "Sokhna Mbaye", type: "Sérologie VIH/VHB", automate: "Architect i1000", priorite: "Normale", temps: "2h", statut: "En attente" },
  { num: "PRE-4830", patient: "Oumar Ndiaye", type: "Bactériologie (ECBU)", automate: "BacT/ALERT", priorite: "Normale", temps: "24h", statut: "En culture" },
  { num: "PRE-4831", patient: "Fatou Diallo", type: "Glycémie à jeun", automate: "Cobas c311", priorite: "Normale", temps: "—", statut: "Résultat prêt" },
  { num: "PRE-4832", patient: "Cheikh Tidiane Sy", type: "Bilan rénal complet", automate: "Cobas c311", priorite: "Urgente", temps: "15 min", statut: "En cours" },
  { num: "PRE-4833", patient: "Aminata Touré", type: "TSH / T3 / T4", automate: "Architect i1000", priorite: "Normale", temps: "3h", statut: "En attente" },
]

const CRITIQUES = [
  { patient: "Ibrahima Koné", analyse: "Créatinine", valeur: "487 µmol/L", ref: "60-110", gravite: "CRITIQUE" },
  { patient: "Cheikh T. Sy", analyse: "Kaliémie", valeur: "6.8 mmol/L", ref: "3.5-5.0", gravite: "DANGER" },
  { patient: "Ousmane Faye", analyse: "Hémoglobine", valeur: "5.2 g/dL", ref: "12-17", gravite: "CRITIQUE" },
]

const COLOR = "#0369a1"

export default function LabPage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(3,105,161,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0369a1,#075985)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🧪</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Lab <span style={{color:COLOR}}>Connect</span></p>
                <p style={{ fontSize:9, color:"rgba(3,105,161,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Laboratoire Connecté · Hôpital Ndamatou</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.03)", border:\`1px solid \${s.color}30\`, borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 0" }}>{s.value}</p>
              </div>
            ))}
          </div>
          {CRITIQUES.length > 0 && (
            <div className="fade" style={{ animationDelay:"0.4s", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:"#ef4444", margin:"0 0 12px" }}>🚨 Résultats critiques à valider</h3>
              {CRITIQUES.map(c => (
                <div key={c.patient+c.analyse} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(239,68,68,0.1)" }}>
                  <div>
                    <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{c.patient}</span>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginLeft:8 }}>{c.analyse}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:14, fontWeight:800, color:"#ef4444" }}>{c.valeur}</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>réf: {c.ref}</span>
                    <span style={{ background:"#ef444418", color:"#ef4444", padding:"2px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{c.gravite}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Analyses en cours</h2>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["N° Prélèvement","Patient","Type","Automate","Priorité","Temps","Statut"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ANALYSES.map(a => (
                  <tr key={a.num} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:12, fontWeight:600, color:COLOR, fontFamily:"monospace" }}>{a.num}</td>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{a.patient}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{a.type}</td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:"rgba(255,255,255,0.45)" }}>{a.automate}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: a.priorite==="Urgente" ? "#ef444418" : "rgba(255,255,255,0.04)", color: a.priorite==="Urgente" ? "#ef4444" : "rgba(255,255,255,0.5)", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{a.priorite}</span>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{a.temps}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background: a.statut==="Résultat prêt" ? "#10b98118" : a.statut.includes("cours") ? "#0ea5e918" : a.statut==="En culture" ? "#8b5cf618" : "#f59e0b18", color: a.statut==="Résultat prêt" ? "#10b981" : a.statut.includes("cours") ? "#0ea5e9" : a.statut==="En culture" ? "#8b5cf6" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{a.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ lab-connect');

// ═══════════════════════════════════════════
// 7. PATIENT-MOBILE
// ═══════════════════════════════════════════
write(path.join(ROOT, 'patient-mobile/app/layout.tsx'),
  makeLayout("Patient Mobile — Espace Patient Ndamatou", "Application mobile patient pour l'Hôpital Ndamatou de Touba.", ["patient","mobile","rendez-vous","Ndamatou","portail"]));

write(path.join(ROOT, 'patient-mobile/app/page.tsx'), `"use client"
import { useState } from "react"

const RDV = [
  { medecin: "Dr. Ousmane Fall", specialite: "Cardiologie", date: "15 Juil. 2026", heure: "10h30", lieu: "Bât. A, Salle 12", statut: "confirmé" },
  { medecin: "Dr. Fatou Mbaye", specialite: "Néphrologie", date: "22 Juil. 2026", heure: "14h00", lieu: "Bât. C, Hémodialyse", statut: "confirmé" },
  { medecin: "Pr. Amadou Diallo", specialite: "Radiologie", date: "28 Juil. 2026", heure: "09h00", lieu: "Bât. B, Scanner", statut: "à confirmer" },
]

const RESULTATS = [
  { type: "NFS complète", date: "01 Juil. 2026", statut: "disponible", icon: "🩸" },
  { type: "Biochimie rénale", date: "28 Juin 2026", statut: "disponible", icon: "🧪" },
  { type: "ECG 12 dérivations", date: "20 Juin 2026", statut: "disponible", icon: "❤️" },
]

const ORDONNANCES = [
  { medecin: "Dr. Fall", date: "01 Juil. 2026", medicaments: ["Amlodipine 5mg — 1cp/j matin", "Metformine 850mg — 1cp matin et soir", "Aspirine 100mg — 1cp/j"] },
  { medecin: "Dr. Mbaye", date: "15 Juin 2026", medicaments: ["EPO 4000 UI — 3x/semaine", "Fer injectable — selon protocole"] },
]

const COLOR = "#0284c7"

export default function PatientPage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .card{transition:all .3s} .card:hover{transform:translateY(-2px)}
        button{cursor:pointer;border:none}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(2,132,199,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:600, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0284c7,#0369a1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📱</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Mon Espace <span style={{color:COLOR}}>Patient</span></p>
                <p style={{ fontSize:9, color:"rgba(2,132,199,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Hôpital Ndamatou · Touba</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ maxWidth:600, margin:"0 auto", padding:"1.5rem" }}>
          <div className="fade" style={{ background:"rgba(2,132,199,0.08)", border:"1px solid rgba(2,132,199,0.2)", borderRadius:16, padding:"1.5rem", marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👤</div>
              <div>
                <p style={{ fontSize:18, fontWeight:800, color:"#fff", margin:0 }}>Modou Ndiaye</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:0 }}>45 ans · Masculin</p>
                <p style={{ fontSize:11, color:COLOR, fontWeight:600, fontFamily:"monospace", margin:0 }}>N° NDM-2024-4827</p>
              </div>
            </div>
          </div>

          <button style={{ width:"100%", background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", padding:"14px", borderRadius:12, fontSize:15, fontWeight:800, marginBottom:"1.5rem", boxShadow:"0 4px 20px rgba(239,68,68,0.3)" }}>🚨 Appeler les Urgences</button>

          <h2 style={{ fontSize:16, fontWeight:700, margin:"0 0 12px", color:"rgba(255,255,255,0.7)" }}>📅 Mes rendez-vous</h2>
          {RDV.map((r, i) => (
            <div key={r.medecin} className="card fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1rem", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>{r.medecin}</p>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:"2px 0" }}>{r.specialite} · {r.lieu}</p>
                  <p style={{ fontSize:13, color:COLOR, fontWeight:600, margin:0 }}>{r.date} à {r.heure}</p>
                </div>
                <span style={{ background: r.statut==="confirmé" ? "#10b98118" : "#f59e0b18", color: r.statut==="confirmé" ? "#10b981" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:700 }}>{r.statut}</span>
              </div>
            </div>
          ))}

          <h2 style={{ fontSize:16, fontWeight:700, margin:"1.5rem 0 12px", color:"rgba(255,255,255,0.7)" }}>📋 Mes résultats</h2>
          {RESULTATS.map(r => (
            <div key={r.type} className="card" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1rem", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{r.icon}</span>
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:"#fff", margin:0 }}>{r.type}</p>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0 }}>{r.date}</p>
                </div>
              </div>
              <button style={{ background:\`\${COLOR}18\`, color:COLOR, border:\`1px solid \${COLOR}30\`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700 }}>Voir</button>
            </div>
          ))}

          <h2 style={{ fontSize:16, fontWeight:700, margin:"1.5rem 0 12px", color:"rgba(255,255,255,0.7)" }}>💊 Ordonnances actives</h2>
          {ORDONNANCES.map((o, i) => (
            <div key={i} className="card" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1rem", marginBottom:10 }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#fff", margin:"0 0 4px" }}>{o.medecin} — {o.date}</p>
              {o.medicaments.map(m => (
                <p key={m} style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:"3px 0", paddingLeft:12, borderLeft:"2px solid rgba(2,132,199,0.3)" }}>{m}</p>
              ))}
            </div>
          ))}

          <button style={{ width:"100%", background:\`\${COLOR}15\`, color:COLOR, border:\`1px solid \${COLOR}30\`, padding:"14px", borderRadius:12, fontSize:14, fontWeight:700, marginTop:"1rem" }}>📅 Prendre un nouveau rendez-vous</button>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ patient-mobile');

console.log('\\n🎉 BATCH 1 TERMINÉ: 7 apps reconstruites (chatbot-triage, academy, don, epidemio, ia-diag, lab, patient)');

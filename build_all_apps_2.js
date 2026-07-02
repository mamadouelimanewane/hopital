/**
 * build_all_apps_2.js — Génère les pages d'applications restantes pour l'Hôpital Ndamatou
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
// 8. QUALITE-ACCRED
// ═══════════════════════════════════════════
write(path.join(ROOT, 'qualite-accred/app/layout.tsx'),
  makeLayout("Qualité-JCI — Accréditation Hôpital Ndamatou", "Système de suivi qualité et accréditation JCI pour l'Hôpital Ndamatou de Touba.", ["qualité","JCI","accréditation","Ndamatou","ISO"]));

write(path.join(ROOT, 'qualite-accred/app/page.tsx'), `"use client"
const STATS = [
  { label: "Score Qualité Global", value: "87.3%", icon: "🏆", color: "#1d4ed8" },
  { label: "Indicateurs suivis", value: "234", icon: "📊", color: "#0ea5e9" },
  { label: "Non-conformités actives", value: "12", icon: "⚠️", color: "#f59e0b" },
  { label: "Audits planifiés", value: "3", icon: "📋", color: "#10b981" },
]

const DEPARTEMENTS = [
  { nom: "Urgences", score: 82, tendance: "+2%", nc: 4, resp: "Dr. Ndiaye", color: "#ef4444" },
  { nom: "Chirurgie", score: 91, tendance: "+1%", nc: 1, resp: "Pr. Fall", color: "#10b981" },
  { nom: "Maternité", score: 85, tendance: "-1%", nc: 3, resp: "Dr. Diop", color: "#ec4899" },
  { nom: "Hémodialyse", score: 94, tendance: "stable", nc: 0, resp: "Dr. Mbaye", color: "#0ea5e9" },
  { nom: "Pharmacie", score: 88, tendance: "+3%", nc: 2, resp: "Dr. Sow", color: "#8b5cf6" },
  { nom: "Laboratoire", score: 96, tendance: "+1%", nc: 0, resp: "Dr. Diallo", color: "#0369a1" },
  { nom: "Radiologie", score: 89, tendance: "stable", nc: 2, resp: "Pr. Kane", color: "#f59e0b" },
]

const ACTIONS = [
  { action: "Révision des protocoles d'hygiène des mains", dept: "Urgences", prio: "Haute", deadline: "15 Juil. 2026", resp: "Fatou Bintou (Infirmière Chef)" },
  { action: "Mise à jour de la cartographie des risques", dept: "Hôpital entier", prio: "Moyenne", deadline: "30 Juil. 2026", resp: "Comité Qualité" },
  { action: "Calibration des équipements d'imagerie", dept: "Radiologie", prio: "Critique", deadline: "10 Juil. 2026", resp: "Service Biomédical" },
]

const COLOR = "#1d4ed8"

export default function QualitePage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(29,78,216,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#1d4ed8,#1e3a8a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏆</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Qualité<span style={{color:"#60a5fa"}}>-JCI</span></p>
                <p style={{ fontSize:9, color:"rgba(96,165,250,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Direction Qualité · Hôpital Ndamatou</p>
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

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,600px), 1fr))", gap:20 }}>
            <div className="fade" style={{ animationDelay:"0.3s", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Performances par département</h2>
              {DEPARTEMENTS.map(d => (
                <div key={d.nom} style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                    <span style={{ fontWeight:700, color:"#fff" }}>{d.nom}</span>
                    <span style={{ color:d.color, fontWeight:700 }}>{d.score}%</span>
                  </div>
                  <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden", marginBottom:6 }}>
                    <div style={{ width:\`\${d.score}%\`, height:"100%", background:d.color, borderRadius:100 }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)" }}>
                    <span>Resp: {d.resp}</span>
                    <span>Tendance: {d.tendance} | NC: <span style={{color: d.nc>0?"#ef4444":"#10b981", fontWeight:700}}>{d.nc}</span></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="fade" style={{ animationDelay:"0.4s", display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem" }}>
                <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Satisfaction Patient (NPS)</h2>
                <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ width:80, height:80, borderRadius:"50%", border:"4px solid #10b981", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#10b981" }}>67</div>
                  <div>
                    <p style={{ fontSize:14, color:"rgba(255,255,255,0.7)", margin:"0 0 4px" }}>Note moyenne : <strong style={{color:"#fff"}}>4.2 / 5</strong></p>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>Sur 1 240 enquêtes ce mois-ci.</p>
                    <div style={{ display:"flex", gap:4, marginTop:8 }}>
                      {["⭐","⭐","⭐","⭐","☆"].map((s,i) => <span key={i} style={{fontSize:16}}>{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem", flex:1 }}>
                <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 1rem" }}>Actions correctives prioritaires</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {ACTIONS.map(a => (
                    <div key={a.action} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <h4 style={{ fontSize:13, fontWeight:700, color:"#fff", margin:0 }}>{a.action}</h4>
                        <span style={{ background: a.prio==="Critique" ? "#ef444418" : a.prio==="Haute" ? "#f59e0b18" : "#3b82f618", color: a.prio==="Critique" ? "#ef4444" : a.prio==="Haute" ? "#f59e0b" : "#3b82f6", padding:"2px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{a.prio}</span>
                      </div>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0 }}>Département: {a.dept} · Resp: {a.resp} · 🕒 {a.deadline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ qualite-accred');

// ═══════════════════════════════════════════
// 9. RH-MEDICAL
// ═══════════════════════════════════════════
write(path.join(ROOT, 'rh-medical/app/layout.tsx'),
  makeLayout("RH Médical — Ressources Humaines Hôpital Ndamatou", "Gestion du personnel médical et administratif de l'Hôpital Ndamatou.", ["rh","ressources humaines","médical","planning","Ndamatou"]));

write(path.join(ROOT, 'rh-medical/app/page.tsx'), `"use client"
const STATS = [
  { label: "Effectif Total", value: "847", icon: "👥", color: "#4338ca" },
  { label: "Médecins & Spécialistes", value: "142", icon: "🩺", color: "#0ea5e9" },
  { label: "Taux de présence", value: "94.2%", icon: "✅", color: "#10b981" },
  { label: "Postes vacants", value: "12", icon: "💼", color: "#f59e0b" },
]

const PERSONNEL = [
  { nom: "Dr. Ibrahima Ndiaye", grade: "Médecin Chef / Cardiologue", service: "Cardiologie", statut: "Présent", color: "#10b981" },
  { nom: "Pr. Fatou Mbaye", grade: "Chirurgienne", service: "Bloc Opératoire", statut: "Au Bloc", color: "#3b82f6" },
  { nom: "Sokhna Fall", grade: "Infirmière Diplômée d'État (IDE)", service: "Urgences", statut: "Présent", color: "#10b981" },
  { nom: "Moussa Diop", grade: "Aide-soignant", service: "Médecine Interne", statut: "Congé", color: "#f59e0b" },
  { nom: "Dr. Ousmane Sy", grade: "Néphrologue", service: "Hémodialyse", statut: "Garde de Nuit", color: "#8b5cf6" },
  { nom: "Aminata Kane", grade: "Technicienne de Labo", service: "Laboratoire", statut: "Présent", color: "#10b981" },
]

const RECRUTEMENTS = [
  { poste: "Médecin Urgentiste", type: "CDI", service: "Urgences", deadline: "30 Juil. 2026" },
  { poste: "Infirmier(e) Réanimation", type: "CDD 6 mois", service: "Réanimation", deadline: "15 Juil. 2026" },
  { poste: "Technicien Biomédical", type: "CDI", service: "Maintenance", deadline: "01 Août 2026" },
]

const COLOR = "#4338ca"

export default function RHPage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(67,56,202,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#4338ca,#312e81)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👥</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>RH <span style={{color:"#818cf8"}}>Médical</span></p>
                <p style={{ fontSize:9, color:"rgba(129,140,248,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Ressources Humaines · Hôpital Ndamatou</p>
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

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,700px), 1fr))", gap:20 }}>
            <div className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
              <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Annuaire du Personnel</h2>
                <button style={{ background:"#4338ca", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700 }}>+ Nouveau</button>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                  {["Nom","Grade / Spécialité","Service","Statut"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {PERSONNEL.map(p => (
                    <tr key={p.nom} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{p.nom}</td>
                      <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{p.grade}</td>
                      <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{p.service}</td>
                      <td style={{ padding:"14px 16px" }}>
                        <span style={{ background:\`\${p.color}18\`, color:p.color, padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{p.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="fade" style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem" }}>
                <h2 style={{ fontSize:16, fontWeight:800, margin:"0 0 1rem" }}>📅 Planning des Gardes (Aujourd'hui)</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ background:"rgba(255,255,255,0.03)", padding:"12px", borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><p style={{margin:0, fontSize:14, fontWeight:700}}>Urgences</p><p style={{margin:0, fontSize:12, color:"rgba(255,255,255,0.4)"}}>20h00 - 08h00</p></div>
                    <div style={{textAlign:"right"}}><p style={{margin:0, fontSize:13, color:"#fff"}}>Dr. Oumar Sall</p><p style={{margin:0, fontSize:11, color:"#10b981"}}>+ 3 IDE</p></div>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.03)", padding:"12px", borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><p style={{margin:0, fontSize:14, fontWeight:700}}>Maternité</p><p style={{margin:0, fontSize:12, color:"rgba(255,255,255,0.4)"}}>20h00 - 08h00</p></div>
                    <div style={{textAlign:"right"}}><p style={{margin:0, fontSize:13, color:"#fff"}}>Dr. Awa Diagne</p><p style={{margin:0, fontSize:11, color:"#10b981"}}>+ 2 Sages-femmes</p></div>
                  </div>
                </div>
              </div>

              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"1.5rem", flex:1 }}>
                <h2 style={{ fontSize:16, fontWeight:800, margin:"0 0 1rem" }}>🎯 Recrutements ouverts</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {RECRUTEMENTS.map(r => (
                    <div key={r.poste} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <div>
                        <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>{r.poste}</p>
                        <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>{r.service} · Clôture : {r.deadline}</p>
                      </div>
                      <span style={{ background:"#4338ca18", color:"#818cf8", padding:"3px 8px", borderRadius:6, fontSize:11, fontWeight:700 }}>{r.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ rh-medical');

// ═══════════════════════════════════════════
// 10. SANTE-RESEAU
// ═══════════════════════════════════════════
write(path.join(ROOT, 'sante-reseau/app/layout.tsx'),
  makeLayout("Réseau Santé SN — Réseau Hospitalier Sénégal", "Portail d'interconnexion des hôpitaux et centres de santé du Sénégal.", ["réseau","santé","hôpitaux","Sénégal","interconnexion"]));

write(path.join(ROOT, 'sante-reseau/app/page.tsx'), `"use client"
const STATS = [
  { label: "Établissements connectés", value: "14", icon: "🏥", color: "#0891b2" },
  { label: "Dossiers partagés", value: "12.8k", icon: "📁", color: "#8b5cf6" },
  { label: "Médecins réseau", value: "342", icon: "👨‍⚕️", color: "#10b981" },
  { label: "Uptime réseau", value: "99.9%", icon: "⚡", color: "#0ea5e9" },
]

const RESEAU = [
  { nom: "Hôpital Ndamatou (Principal)", ville: "Touba", type: "Niveau 3", statut: "EN LIGNE", latence: "12ms", patients: 8470, color: "#10b981" },
  { nom: "Hôpital Principal", ville: "Dakar", type: "Niveau 3", statut: "EN LIGNE", latence: "18ms", patients: 12400, color: "#10b981" },
  { nom: "Hôpital de Fann", ville: "Dakar", type: "Niveau 3", statut: "EN LIGNE", latence: "22ms", patients: 6500, color: "#10b981" },
  { nom: "Hôpital Régional", ville: "Thiès", type: "Niveau 2", statut: "EN LIGNE", latence: "15ms", patients: 4200, color: "#10b981" },
  { nom: "Centre de Santé Gare", ville: "Touba", type: "Niveau 1", statut: "EN LIGNE", latence: "5ms", patients: 850, color: "#10b981" },
  { nom: "Poste de Santé Darou Khoudoss", ville: "Touba", type: "Niveau 0", statut: "MAINTENANCE", latence: "—", patients: 120, color: "#f59e0b" },
  { nom: "Hôpital Régional", ville: "Saint-Louis", type: "Niveau 2", statut: "HORS LIGNE", latence: "—", patients: 3100, color: "#ef4444" },
]

export default function ReseauPage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(8,145,178,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0891b2,#0f766e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌐</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Réseau <span style={{color:"#22d3ee"}}>Santé SN</span></p>
                <p style={{ fontSize:9, color:"rgba(34,211,238,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Interconnexion Hospitalière du Sénégal</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:"#10b981" }} />
              <span style={{ fontSize:11, color:"#10b981", fontWeight:700 }}>SYNCHRONISÉ</span>
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

          <div className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden", marginBottom:"2rem" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Centres et Hôpitaux Connectés</h2>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>Mise à jour en temps réel via DVPN Médical</p>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                {["Établissement","Ville","Type","Patients Suivis","Latence API","Statut"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {RESEAU.map(r => (
                  <tr key={r.nom} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{r.nom}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.6)" }}>{r.ville}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{r.type}</td>
                    <td style={{ padding:"14px 16px", fontSize:14, color:"#0891b2", fontWeight:600 }}>{r.patients.toLocaleString()}</td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"monospace" }}>{r.latence}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background:\`\${r.color}18\`, color:r.color, padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:800 }}>{r.statut}</span>
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
console.log('✅ sante-reseau');

// ═══════════════════════════════════════════
// 11. SMART-BEDS
// ═══════════════════════════════════════════
write(path.join(ROOT, 'smart-beds/app/layout.tsx'),
  makeLayout("Smart Beds — Gestion Intelligente des Lits", "Suivi en temps réel de l'occupation des lits de l'Hôpital Ndamatou.", ["lits","hospitalisation","Ndamatou","occupation","smart beds"]));

write(path.join(ROOT, 'smart-beds/app/page.tsx'), `"use client"
const STATS = [
  { label: "Lits Total", value: "487", icon: "🛏️", color: "#3b82f6" },
  { label: "Occupés (Taux)", value: "423 (87%)", icon: "👤", color: "#ef4444" },
  { label: "Disponibles", value: "52", icon: "✅", color: "#10b981" },
  { label: "En nettoyage", value: "12", icon: "🧹", color: "#f59e0b" },
]

const SERVICES = [
  { nom: "Médecine Interne", total: 60, occ: 58, net: 0, color: "#ef4444", status: "Saturé" },
  { nom: "Chirurgie", total: 48, occ: 35, net: 4, color: "#10b981", status: "Fluide" },
  { nom: "Urgences", total: 24, occ: 24, net: 0, color: "#ef4444", status: "Saturé (Priorité)" },
  { nom: "Maternité", total: 40, occ: 32, net: 2, color: "#3b82f6", status: "Normal" },
  { nom: "Hémodialyse", total: 32, occ: 28, net: 1, color: "#3b82f6", status: "Normal" },
]

export default function BedsPage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(59,130,246,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#1e40af)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🛏️</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Smart <span style={{color:"#60a5fa"}}>Beds</span></p>
                <p style={{ fontSize:9, color:"rgba(96,165,250,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Gestion des Lits · Hôpital Ndamatou</p>
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

          <h2 style={{ fontSize:20, fontWeight:800, margin:"0 0 1rem" }}>Occupation par Service</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%,350px), 1fr))", gap:20 }}>
            {SERVICES.map(s => {
              const libre = s.total - s.occ - s.net;
              return (
                <div key={s.nom} className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"1.5rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div>
                      <h3 style={{ fontSize:16, fontWeight:700, margin:0 }}>{s.nom}</h3>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>{s.total} lits totaux</p>
                    </div>
                    <span style={{ background:\`\${s.color}18\`, color:s.color, padding:"3px 8px", borderRadius:100, fontSize:10, fontWeight:700 }}>{s.status}</span>
                  </div>
                  
                  {/* Visual grid of beds (max 60 blocks for display) */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:16 }}>
                    {Array.from({length: Math.min(s.total, 60)}).map((_, i) => {
                      let bg = "#10b981"; // libre
                      if (i < s.occ) bg = "#ef4444"; // occupe
                      else if (i < s.occ + s.net) bg = "#f59e0b"; // nettoyage
                      return <div key={i} style={{ width:12, height:12, borderRadius:3, background:bg, opacity:0.8 }} />
                    })}
                  </div>
                  
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:12 }}>
                    <span style={{ color:"#ef4444", fontWeight:600 }}>{s.occ} Occupés</span>
                    <span style={{ color:"#f59e0b", fontWeight:600 }}>{s.net} Nettoyage</span>
                    <span style={{ color:"#10b981", fontWeight:600 }}>{libre} Libres</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ smart-beds');

// ═══════════════════════════════════════════
// 12. FACTU-CARE
// ═══════════════════════════════════════════
write(path.join(ROOT, 'factu-care/app/layout.tsx'),
  makeLayout("FactuCare — Facturation & Assurance", "Système de facturation, recouvrement et assurance maladie de l'Hôpital Ndamatou.", ["facturation","assurance","Ndamatou","CMU","finances"]));

write(path.join(ROOT, 'factu-care/app/page.tsx'), `"use client"
const STATS = [
  { label: "Encaissé Aujourd'hui", value: "2.4M", unit: "FCFA", icon: "💳", color: "#15803d" },
  { label: "Actes facturés", value: "312", unit: "actes", icon: "📄", color: "#0ea5e9" },
  { label: "Dossiers en attente", value: "47", unit: "dossiers", icon: "⏳", color: "#f59e0b" },
  { label: "Taux recouvrement", value: "89%", unit: "ce mois", icon: "📈", color: "#8b5cf6" },
]

const FACTURES = [
  { num: "F26-07-001", patient: "Abdoulaye Diop", acte: "Scanner Cérébral (Forfait)", montant: 45000, assurance: "CMU (Couverture Maladie Univ.)", priseEnCharge: 80, reste: 9000, statut: "Payé" },
  { num: "F26-07-002", patient: "Aminata Sall", acte: "Césarienne + Séjour 3J", montant: 150000, assurance: "IPM Privé (Sonatel)", priseEnCharge: 100, reste: 0, statut: "En cours" },
  { num: "F26-07-003", patient: "Moussa Sène", acte: "Consultation Cardiologie", montant: 10000, assurance: "Aucune (Paiement direct)", priseEnCharge: 0, reste: 10000, statut: "Payé" },
  { num: "F26-07-004", patient: "Fatou Kane", acte: "Séance Hémodialyse", montant: 10000, assurance: "Aar Li Nu Bokk / Gratuité", priseEnCharge: 100, reste: 0, statut: "Payé" },
  { num: "F26-07-005", patient: "Oumar Ndiaye", acte: "Intervention Orthopédique", montant: 250000, assurance: "IPM Privé (CSS)", priseEnCharge: 80, reste: 50000, statut: "Impayé (Relance 1)" },
]

const COLOR = "#15803d"

export default function FactuPage() {
  return (
    <>
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade{animation:fadeUp .5s both}
        .row{transition:background .2s} .row:hover{background:rgba(255,255,255,0.04)!important}
      \`}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(21,128,61,0.3)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#15803d,#14532d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💳</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Factu<span style={{color:"#4ade80"}}>Care</span></p>
                <p style={{ fontSize:9, color:"rgba(74,222,128,0.8)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Facturation & Recouvrement · Hôpital Ndamatou</p>
              </div>
            </div>
            <button style={{ background:COLOR, color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Nouvelle Facture</button>
          </div>
        </header>
        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.03)", border:\`1px solid \${s.color}30\`, borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 2px" }}>{s.value}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:0 }}>{s.unit}</p>
              </div>
            ))}
          </div>

          <div className="fade" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>Factures Récentes</h2>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                <thead><tr style={{ background:"rgba(255,255,255,0.03)" }}>
                  {["N° Facture","Patient / Acte","Montant Total","Couverture (Assurance)","Reste à Payer","Statut"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {FACTURES.map(f => (
                    <tr key={f.num} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding:"14px 16px", fontSize:12, fontWeight:600, color:COLOR, fontFamily:"monospace" }}>{f.num}</td>
                      <td style={{ padding:"14px 16px" }}>
                        <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:"0 0 2px" }}>{f.patient}</p>
                        <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:0 }}>{f.acte}</p>
                      </td>
                      <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{f.montant.toLocaleString()} F</td>
                      <td style={{ padding:"14px 16px" }}>
                        <p style={{ fontSize:13, color:"#fff", margin:"0 0 2px" }}>{f.assurance}</p>
                        <span style={{ background:"rgba(255,255,255,0.1)", padding:"2px 6px", borderRadius:4, fontSize:10, color:"#4ade80" }}>{f.priseEnCharge}% pris en charge</span>
                      </td>
                      <td style={{ padding:"14px 16px", fontSize:14, fontWeight:800, color: f.reste > 0 ? "#ef4444" : "#10b981" }}>{f.reste.toLocaleString()} F</td>
                      <td style={{ padding:"14px 16px" }}>
                        <span style={{ background: f.statut==="Payé" ? "#10b98118" : f.statut==="En cours" ? "#0ea5e918" : "#ef444418", color: f.statut==="Payé" ? "#10b981" : f.statut==="En cours" ? "#0ea5e9" : "#ef4444", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{f.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
`);
console.log('✅ factu-care');

console.log('\\n🎉 BATCH 2 TERMINÉ: 5 apps reconstruites (qualite-accred, rh-medical, sante-reseau, smart-beds, factu-care)');

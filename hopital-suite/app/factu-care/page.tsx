"use client"
import { useState } from "react"

type Onglet = "factures" | "assurances" | "remboursements" | "stats"

const factures = [
  { num: "FAC-2026-0847", patient: "Ibrahima Diallo", date: "20/06/2026", actes: "Consultation + ECG + Écho", montant: 85000, couverture: 68000, reste: 17000, statut: "paye" },
  { num: "FAC-2026-0846", patient: "Fatou Ndiaye", date: "20/06/2026", actes: "Chirurgie appendicectomie", montant: 450000, couverture: 360000, reste: 90000, statut: "attente" },
  { num: "FAC-2026-0845", patient: "Moussa Sarr", date: "19/06/2026", actes: "Consultation pédiatrique + Labo", montant: 32000, couverture: 0, reste: 32000, statut: "impaye" },
  { num: "FAC-2026-0844", patient: "Aissatou Ba", date: "19/06/2026", actes: "Accouchement + Séjour 3 jours", montant: 120000, couverture: 96000, reste: 24000, statut: "paye" },
  { num: "FAC-2026-0843", patient: "Omar Fall", date: "18/06/2026", actes: "IRM cérébrale + Neurologie", montant: 275000, couverture: 220000, reste: 55000, statut: "attente" },
  { num: "FAC-2026-0842", patient: "Rokhaya Diallo", date: "18/06/2026", actes: "Dialyse rénale (3 séances)", montant: 195000, couverture: 156000, reste: 39000, statut: "paye" },
  { num: "FAC-2026-0841", patient: "Lamine Mbaye", date: "17/06/2026", actes: "Consultation + Rx thorax", montant: 28000, couverture: 0, reste: 28000, statut: "impaye" },
]

const assurances = [
  { nom: "CMU (Couverture Maladie Universelle)", icon: "🏛️", taux: 80, beneficiaires: 12450, couleur: "#22c55e" },
  { nom: "IPM Sénégal", icon: "🏢", taux: 75, beneficiaires: 8320, couleur: "#3b82f6" },
  { nom: "IPRES (Retraités)", icon: "👴", taux: 70, beneficiaires: 4180, couleur: "#8b5cf6" },
  { nom: "Mutuelles Privées", icon: "🤝", taux: 60, beneficiaires: 2950, couleur: "#06b6d4" },
  { nom: "TOKIWA Assurance", icon: "🛡️", taux: 85, beneficiaires: 1640, couleur: "#f59e0b" },
  { nom: "AXA Sénégal", icon: "⭐", taux: 90, beneficiaires: 890, couleur: "#ec4899" },
]

const remboursements = [
  { ref: "REM-0234", patient: "Fatou Ndiaye", assurance: "CMU", montant: 360000, date: "15/06/2026", etat: "en_traitement" },
  { ref: "REM-0233", patient: "Ibrahima Diallo", assurance: "IPM Sénégal", montant: 68000, date: "14/06/2026", etat: "approuve" },
  { ref: "REM-0232", patient: "Aissatou Ba", assurance: "IPRES", montant: 96000, date: "12/06/2026", etat: "rembourse" },
  { ref: "REM-0231", patient: "Omar Fall", assurance: "CMU", montant: 220000, date: "11/06/2026", etat: "en_traitement" },
  { ref: "REM-0230", patient: "Rokhaya Diallo", assurance: "AXA Sénégal", montant: 156000, date: "10/06/2026", etat: "rembourse" },
  { ref: "REM-0229", patient: "Seydou Camara", assurance: "Mutuelles Privées", montant: 45000, date: "08/06/2026", etat: "rejete" },
]

const moisStats = [
  { mois: "Jan", montant: 38.5 },
  { mois: "Fév", montant: 41.2 },
  { mois: "Mar", montant: 35.8 },
  { mois: "Avr", montant: 48.1 },
  { mois: "Mai", montant: 43.6 },
  { mois: "Jun", montant: 45.2 },
]

const statutFacture: Record<string, { label: string; color: string; bg: string }> = {
  paye: { label: "Payé", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  attente: { label: "En attente", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  impaye: { label: "Impayé", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
}

const statutRem: Record<string, { label: string; color: string; bg: string }> = {
  en_traitement: { label: "En traitement", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  approuve: { label: "Approuvé", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  rembourse: { label: "Remboursé", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  rejete: { label: "Rejeté", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
}

const green = "#22c55e"
const card = "#0a1628"
const border = "rgba(255,255,255,0.06)"

export default function FactuCarePage() {
  const [onglet, setOnglet] = useState<Onglet>("factures")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ patient: "", actes: "", assurance: "" })
  const [montantCalc, setMontantCalc] = useState<number | null>(null)

  function calculerMontant() {
    if (!formData.actes) return
    const base = Math.floor(Math.random() * 300000) + 30000
    setMontantCalc(base)
  }

  const onglets: { id: Onglet; label: string; icon: string }[] = [
    { id: "factures", label: "Factures", icon: "📄" },
    { id: "assurances", label: "Assurances", icon: "🛡️" },
    { id: "remboursements", label: "Remboursements", icon: "💸" },
    { id: "stats", label: "Statistiques", icon: "📊" },
  ]

  const maxMontant = Math.max(...moisStats.map(m => m.montant))

  return (
    <div style={{ background: "#050d1a", minHeight: "100vh", color: "#e2e8f0", fontFamily:"'Inter',system-ui,sans-serif" }}>
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
      <div style={{ background:"linear-gradient(135deg,rgba(21,128,61,0.18),rgba(21,128,61,0.04))", borderBottom:"1px solid rgba(21,128,61,0.25)", padding:"1.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(21,128,61,0.12)", border:"1px solid rgba(21,128,61,0.3)", borderRadius:40, padding:"4px 14px", marginBottom:10 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:green, display:"inline-block", animation:"pulse 2s infinite" }}></span>
                <span style={{ color:green, fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>GESTION FINANCIÈRE Ndamatou</span>
              </div>
              <h1 style={{ fontSize:"clamp(20px,2.5vw,28px)", fontWeight:800, color:"#e2e8f0", margin:0 }}>
                FactuCare — <span style={{ color:green }}>Facturation & Assurances</span>
              </h1>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
            {[
              { label: "Recettes ce mois", value: "45.2M FCFA", icon: "💰", color: green },
              { label: "Taux Recouvrement", value: "78%", icon: "📈", color: "#06b6d4" },
              { label: "Impayés", value: "9.8M FCFA", icon: "⚠️", color: "#ef4444" },
              { label: "Remboursements en cours", value: "23", icon: "🔄", color: "#f59e0b" },
            ].map((s, i) => (
              <div key={s.label} style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:12, animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ fontSize:22 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"1.5rem", display:"flex", flexDirection:"column", gap:20 }}>

        {/* Onglets */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {onglets.map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)} style={{
              background: onglet === o.id ? "rgba(34,197,94,0.15)" : card,
              color: onglet === o.id ? green : "rgba(255,255,255,0.5)",
              border: `1px solid ${onglet === o.id ? "rgba(34,197,94,0.4)" : border}`,
              borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:500, cursor:"pointer", transition:"all 0.2s"
            }}>
              {o.icon} {o.label}
            </button>
          ))}
          <button onClick={() => setShowForm(!showForm)} style={{
            background:"linear-gradient(135deg,#16a34a,#15803d)", color:"white", border:"none", borderRadius:10,
            padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", marginLeft:"auto"
          }}>
            + Nouvelle Facture
          </button>
        </div>

        {/* Formulaire nouvelle facture */}
        {showForm && (
          <div style={{ background:"rgba(22,163,74,0.06)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:16, padding:"1.25rem" }}>
            <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:"0 0 1rem" }}>Créer une nouvelle facture</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginBottom:16 }}>
              {[
                { label:"Patient", value:formData.patient, key:"patient", options:factures.map(f => ({ v:f.patient, l:f.patient })) },
                { label:"Actes médicaux", value:formData.actes, key:"actes", options:[
                  { v:"consultation", l:"Consultation générale" },{ v:"chirurgie", l:"Chirurgie" },
                  { v:"biologie", l:"Biologie / Labo" },{ v:"imagerie", l:"Imagerie médicale" },{ v:"hospitalisation", l:"Hospitalisation" }
                ]},
                { label:"Assurance", value:formData.assurance, key:"assurance", options:assurances.map(a => ({ v:a.nom, l:`${a.nom} (${a.taux}%)` })) },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:12, color:"rgba(255,255,255,0.5)", display:"block", marginBottom:6 }}>{f.label}</label>
                  <select value={f.value} onChange={e => setFormData({...formData, [f.key]: e.target.value})}
                    style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${border}`, borderRadius:8, color:"#e2e8f0", padding:"8px 12px", fontSize:13, width:"100%", outline:"none" }}>
                    <option value="">Sélectionner…</option>
                    {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <button onClick={calculerMontant} style={{ background:"rgba(34,197,94,0.15)", color:green, border:"1px solid rgba(34,197,94,0.3)", borderRadius:8, padding:"8px 16px", fontSize:13, cursor:"pointer" }}>
                Calculer automatiquement
              </button>
              {montantCalc && (
                <div style={{ fontSize:13 }}>
                  <span style={{ color:"rgba(255,255,255,0.5)" }}>Montant: </span>
                  <span style={{ fontWeight:800, color:green }}>{montantCalc.toLocaleString()} FCFA</span>
                  {formData.assurance && (
                    <>
                      <span style={{ color:"rgba(255,255,255,0.5)" }}> | Couverture: </span>
                      <span style={{ fontWeight:800, color:"#06b6d4" }}>
                        {Math.round(montantCalc * (assurances.find(a => a.nom === formData.assurance)?.taux || 0) / 100).toLocaleString()} FCFA
                      </span>
                    </>
                  )}
                </div>
              )}
              <button onClick={() => { setShowForm(false); setMontantCalc(null); setFormData({ patient:"", actes:"", assurance:"" }) }}
                style={{ marginLeft:"auto", background:"rgba(239,68,68,0.1)", color:"#f87171", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"8px 16px", fontSize:13, cursor:"pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Factures */}
        {onglet === "factures" && (
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16 }}>
            <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${border}` }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:0 }}>Liste des Factures</h3>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:"4px 0 0" }}>{factures.length} factures récentes</p>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${border}` }}>
                    {["N° Facture","Patient","Date","Actes","Montant Total","Couverture","Reste à Payer","Statut"].map(h => (
                      <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {factures.map(f => {
                    const s = statutFacture[f.statut]
                    return (
                      <tr key={f.num} style={{ borderBottom:`1px solid ${border}` }}>
                        <td style={{ padding:"10px 14px", fontFamily:"monospace", fontSize:11, color:"#4ade80" }}>{f.num}</td>
                        <td style={{ padding:"10px 14px", fontWeight:600, color:"#e2e8f0", fontSize:12 }}>{f.patient}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"rgba(255,255,255,0.5)" }}>{f.date}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"rgba(255,255,255,0.6)" }}>{f.actes}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{f.montant.toLocaleString()} FCFA</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"#06b6d4" }}>{f.couverture.toLocaleString()} FCFA</td>
                        <td style={{ padding:"10px 14px", fontSize:12, fontWeight:600, color: f.reste > 0 ? "#f87171" : green }}>{f.reste.toLocaleString()} FCFA</td>
                        <td style={{ padding:"10px 14px" }}>
                          <span style={{ background:s.bg, color:s.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{s.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assurances */}
        {onglet === "assurances" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {assurances.map(a => (
              <div key={a.nom} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"1rem" }}>
                  <div style={{ fontSize:28 }}>{a.icon}</div>
                  <div>
                    <div style={{ fontWeight:600, color:"#e2e8f0", fontSize:13 }}>{a.nom}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{a.beneficiaires.toLocaleString()} bénéficiaires</div>
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                    <span style={{ color:"rgba(255,255,255,0.5)" }}>Taux de couverture</span>
                    <span style={{ fontWeight:800, color:a.couleur }}>{a.taux}%</span>
                  </div>
                  <div style={{ height:6, borderRadius:4, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:4, background:a.couleur, width:`${a.taux}%` }}></div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { label:"Prise en charge", val:`${a.taux}%`, color:a.couleur },
                    { label:"Ticket modérateur", val:`${100-a.taux}%`, color:"#e2e8f0" },
                  ].map(item => (
                    <div key={item.label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"8px", textAlign:"center" }}>
                      <div style={{ fontWeight:800, fontSize:14, color:item.color }}>{item.val}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Remboursements */}
        {onglet === "remboursements" && (
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16 }}>
            <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${border}` }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:0 }}>Suivi des Remboursements</h3>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${border}` }}>
                    {["Référence","Patient","Assurance","Montant","Date","État"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", textAlign:"left", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {remboursements.map(r => {
                    const s = statutRem[r.etat]
                    return (
                      <tr key={r.ref} style={{ borderBottom:`1px solid ${border}` }}>
                        <td style={{ padding:"10px 16px", fontFamily:"monospace", fontSize:11, color:"#4ade80" }}>{r.ref}</td>
                        <td style={{ padding:"10px 16px", fontWeight:600, color:"#e2e8f0", fontSize:12 }}>{r.patient}</td>
                        <td style={{ padding:"10px 16px", fontSize:12, color:"rgba(255,255,255,0.6)" }}>{r.assurance}</td>
                        <td style={{ padding:"10px 16px", fontSize:12, fontWeight:600, color:green }}>{r.montant.toLocaleString()} FCFA</td>
                        <td style={{ padding:"10px 16px", fontSize:12, color:"rgba(255,255,255,0.45)" }}>{r.date}</td>
                        <td style={{ padding:"10px 16px" }}>
                          <span style={{ background:s.bg, color:s.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{s.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats */}
        {onglet === "stats" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(400px,1fr))", gap:24 }}>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.25rem" }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:"0 0 4px" }}>Revenus par mois (M FCFA)</h3>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:"0 0 1.25rem" }}>Janvier – Juin 2026</p>
              <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:160 }}>
                {moisStats.map(m => (
                  <div key={m.mois} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:green }}>{m.montant}</span>
                    <div style={{ width:"100%", borderRadius:"4px 4px 0 0", height:`${(m.montant / maxMontant) * 120}px`, background:"linear-gradient(180deg,#22c55e,#15803d)" }}></div>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{m.mois}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.25rem" }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:"0 0 1.25rem" }}>Indicateurs de Recouvrement</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { label:"Taux de recouvrement", value:78, color:green, desc:"Paiements reçus / Facturé" },
                  { label:"Taux d'impayés", value:22, color:"#ef4444", desc:"Montant non recouvré" },
                  { label:"Couverture assurance moy.", value:65, color:"#06b6d4", desc:"Prise en charge moyenne" },
                  { label:"Dossiers traités ce mois", value:91, color:"#8b5cf6", desc:"Taux de traitement" },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                      <span style={{ color:"rgba(255,255,255,0.7)" }}>{item.label}</span>
                      <span style={{ fontWeight:700, color:item.color }}>{item.value}%</span>
                    </div>
                    <div style={{ height:6, borderRadius:4, background:"rgba(255,255,255,0.08)", overflow:"hidden", marginBottom:2 }}>
                      <div style={{ height:"100%", borderRadius:4, background:item.color, width:`${item.value}%` }}></div>
                    </div>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.25rem", gridColumn:"1 / -1" }}>
              <h3 style={{ color:"#e2e8f0", fontWeight:600, margin:"0 0 1rem" }}>Répartition des Factures par Statut</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
                {[
                  { label:"Payées", count:factures.filter(f=>f.statut==="paye").length, montant:factures.filter(f=>f.statut==="paye").reduce((s,f)=>s+f.montant,0), color:green },
                  { label:"En attente", count:factures.filter(f=>f.statut==="attente").length, montant:factures.filter(f=>f.statut==="attente").reduce((s,f)=>s+f.montant,0), color:"#f59e0b" },
                  { label:"Impayées", count:factures.filter(f=>f.statut==="impaye").length, montant:factures.filter(f=>f.statut==="impaye").reduce((s,f)=>s+f.montant,0), color:"#ef4444" },
                ].map(item => (
                  <div key={item.label} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${border}`, borderRadius:12, padding:"1rem", textAlign:"center" }}>
                    <div style={{ fontSize:36, fontWeight:800, color:item.color }}>{item.count}</div>
                    <div style={{ fontWeight:600, fontSize:13, color:"#e2e8f0", margin:"4px 0" }}>{item.label}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{item.montant.toLocaleString()} FCFA</div>
                    <div style={{ height:3, borderRadius:2, background:item.color, opacity:0.6, marginTop:8 }}></div>
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

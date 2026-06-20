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

export default function FactuCarePage() {
  const [onglet, setOnglet] = useState<Onglet>("factures")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ patient: "", actes: "", assurance: "" })
  const [montantCalc, setMontantCalc] = useState<number | null>(null)

  const bg = "#050f0a"
  const card = "rgba(255,255,255,0.04)"
  const border = "rgba(255,255,255,0.08)"
  const green = "#22c55e"

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
    <div style={{ background: bg, minHeight: "100vh", color: "white" }}>
      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,22,40,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13, fontWeight:600 }}>
          ← Retour au Portail CHNCAK
        </a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* Stats Header */}
      <div style={{ background: "rgba(34,197,94,0.05)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}
        className="px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Recettes ce mois", value: "45.2M FCFA", icon: "💰", color: green },
            { label: "Taux Recouvrement", value: "78%", icon: "📈", color: "#06b6d4" },
            { label: "Impayés", value: "9.8M FCFA", icon: "⚠️", color: "#ef4444" },
            { label: "Remboursements en cours", value: "23", icon: "🔄", color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12 }}
              className="px-4 py-3 flex items-center gap-3">
              <div className="text-2xl">{s.icon}</div>
              <div>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Onglets */}
        <div className="flex gap-2 flex-wrap">
          {onglets.map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              style={{
                background: onglet === o.id ? "rgba(34,197,94,0.15)" : card,
                color: onglet === o.id ? green : "rgba(255,255,255,0.5)",
                border: `1px solid ${onglet === o.id ? "rgba(34,197,94,0.4)" : border}`,
                borderRadius: 10, padding: "8px 16px", fontSize: 13,
                fontWeight: 500, cursor: "pointer", transition: "all 0.2s"
              }}>
              {o.icon} {o.label}
            </button>
          ))}
          <button onClick={() => setShowForm(!showForm)}
            style={{
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              color: "white", border: "none", borderRadius: 10,
              padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginLeft: "auto"
            }}>
            + Nouvelle Facture
          </button>
        </div>

        {/* Formulaire nouvelle facture */}
        {showForm && (
          <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16 }}
            className="p-5 space-y-4">
            <h3 className="font-semibold text-white">Créer une nouvelle facture</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Patient</label>
                <select value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})}
                  style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`, borderRadius: 8, color: "white", padding: "8px 12px", fontSize: 13, width: "100%", outline: "none" }}>
                  <option value="">Sélectionner un patient</option>
                  {factures.map(f => <option key={f.num} value={f.patient}>{f.patient}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Actes médicaux</label>
                <select value={formData.actes} onChange={e => setFormData({...formData, actes: e.target.value})}
                  style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`, borderRadius: 8, color: "white", padding: "8px 12px", fontSize: 13, width: "100%", outline: "none" }}>
                  <option value="">Sélectionner les actes</option>
                  <option value="consultation">Consultation générale</option>
                  <option value="chirurgie">Chirurgie</option>
                  <option value="biologie">Biologie / Labo</option>
                  <option value="imagerie">Imagerie médicale</option>
                  <option value="hospitalisation">Hospitalisation</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Assurance</label>
                <select value={formData.assurance} onChange={e => setFormData({...formData, assurance: e.target.value})}
                  style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`, borderRadius: 8, color: "white", padding: "8px 12px", fontSize: 13, width: "100%", outline: "none" }}>
                  <option value="">Sans assurance</option>
                  {assurances.map(a => <option key={a.nom} value={a.nom}>{a.nom} ({a.taux}%)</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={calculerMontant}
                style={{ background: "rgba(34,197,94,0.15)", color: green, border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                Calculer automatiquement
              </button>
              {montantCalc && (
                <div className="text-sm">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Montant total: </span>
                  <span className="font-bold" style={{ color: green }}>{montantCalc.toLocaleString()} FCFA</span>
                  {formData.assurance && (
                    <>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}> | Couverture: </span>
                      <span className="font-bold" style={{ color: "#06b6d4" }}>
                        {Math.round(montantCalc * (assurances.find(a => a.nom === formData.assurance)?.taux || 0) / 100).toLocaleString()} FCFA
                      </span>
                    </>
                  )}
                </div>
              )}
              <button onClick={() => { setShowForm(false); setMontantCalc(null); setFormData({ patient: "", actes: "", assurance: "" }) }}
                style={{ marginLeft: "auto", background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Contenu onglet Factures */}
        {onglet === "factures" && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
              <h3 className="font-semibold text-white">Liste des Factures</h3>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{factures.length} factures récentes</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}`, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                    {["N° Facture", "Patient", "Date", "Actes", "Montant Total", "Couverture", "Reste à Payer", "Statut"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {factures.map(f => {
                    const s = statutFacture[f.statut]
                    return (
                      <tr key={f.num} style={{ borderBottom: `1px solid ${border}` }}
                        className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "#4ade80" }}>{f.num}</td>
                        <td className="px-4 py-3 font-medium text-white text-xs">{f.patient}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{f.date}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{f.actes}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-white">{f.montant.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#06b6d4" }}>{f.couverture.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3 text-xs font-semibold" style={{ color: f.reste > 0 ? "#f87171" : green }}>{f.reste.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenu onglet Assurances */}
        {onglet === "assurances" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assurances.map(a => (
              <div key={a.nom} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14 }} className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{a.icon}</div>
                  <div>
                    <div className="font-semibold text-white text-sm leading-tight">{a.nom}</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{a.beneficiaires.toLocaleString()} bénéficiaires</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Taux de couverture</span>
                    <span className="font-bold" style={{ color: a.couleur }}>{a.taux}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${a.taux}%`, background: a.couleur }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8 }} className="py-2">
                    <div className="font-bold text-sm" style={{ color: a.couleur }}>{a.taux}%</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Prise en charge</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8 }} className="py-2">
                    <div className="font-bold text-sm text-white">{100 - a.taux}%</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Ticket modérateur</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenu onglet Remboursements */}
        {onglet === "remboursements" && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
              <h3 className="font-semibold text-white">Suivi des Remboursements</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}`, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                    {["Référence", "Patient", "Assurance", "Montant", "Date", "État"].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {remboursements.map(r => {
                    const s = statutRem[r.etat]
                    return (
                      <tr key={r.ref} style={{ borderBottom: `1px solid ${border}` }}
                        className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                        <td className="px-5 py-3 font-mono text-xs" style={{ color: "#4ade80" }}>{r.ref}</td>
                        <td className="px-5 py-3 font-medium text-white text-xs">{r.patient}</td>
                        <td className="px-5 py-3 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{r.assurance}</td>
                        <td className="px-5 py-3 text-xs font-semibold" style={{ color: green }}>{r.montant.toLocaleString()} FCFA</td>
                        <td className="px-5 py-3 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{r.date}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenu onglet Stats */}
        {onglet === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique revenus */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }} className="p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-white">Revenus par mois (M FCFA)</h3>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Janvier – Juin 2026</p>
              </div>
              <div className="flex items-end gap-3 h-40">
                {moisStats.map(m => (
                  <div key={m.mois} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold" style={{ color: green }}>{m.montant}</span>
                    <div className="w-full rounded-t-md transition-all"
                      style={{ height: `${(m.montant / maxMontant) * 120}px`, background: `linear-gradient(180deg, #22c55e, #15803d)` }} />
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{m.mois}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicateurs clés */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }} className="p-5 space-y-4">
              <h3 className="font-semibold text-white">Indicateurs de Recouvrement</h3>
              <div className="space-y-4">
                {[
                  { label: "Taux de recouvrement", value: 78, color: green, desc: "Paiements reçus / Facturé" },
                  { label: "Taux d'impayés", value: 22, color: "#ef4444", desc: "Montant non recouvré" },
                  { label: "Couverture assurance moy.", value: 65, color: "#06b6d4", desc: "Prise en charge moyenne" },
                  { label: "Dossiers traités ce mois", value: 91, color: "#8b5cf6", desc: "Taux de traitement" },
                ].map(item => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${item.value}%`, background: item.color }} />
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Répartition par statut */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }} className="p-5 space-y-4 lg:col-span-2">
              <h3 className="font-semibold text-white">Répartition des Factures par Statut</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Payées", count: factures.filter(f => f.statut === "paye").length, montant: factures.filter(f => f.statut === "paye").reduce((s,f) => s+f.montant, 0), color: green },
                  { label: "En attente", count: factures.filter(f => f.statut === "attente").length, montant: factures.filter(f => f.statut === "attente").reduce((s,f) => s+f.montant, 0), color: "#f59e0b" },
                  { label: "Impayées", count: factures.filter(f => f.statut === "impaye").length, montant: factures.filter(f => f.statut === "impaye").reduce((s,f) => s+f.montant, 0), color: "#ef4444" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${border}`, borderRadius: 12 }}
                    className="p-4 text-center space-y-2">
                    <div className="text-3xl font-bold" style={{ color: item.color }}>{item.count}</div>
                    <div className="font-medium text-sm text-white">{item.label}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.montant.toLocaleString()} FCFA</div>
                    <div className="h-1 rounded-full" style={{ background: item.color, opacity: 0.6 }} />
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

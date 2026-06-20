"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"

const services = [
  { id: "cardio", nom: "Cardiologie", total: 42, occupes: 38, nettoyage: 1, couleur: "#ef4444" },
  { id: "urgences", nom: "Urgences", total: 30, occupes: 29, nettoyage: 1, couleur: "#f97316" },
  { id: "pediatrie", nom: "Pédiatrie", total: 50, occupes: 32, nettoyage: 2, couleur: "#06b6d4" },
  { id: "reanimation", nom: "Réanimation", total: 20, occupes: 18, nettoyage: 0, couleur: "#8b5cf6" },
  { id: "chirurgie", nom: "Chirurgie", total: 60, occupes: 45, nettoyage: 3, couleur: "#6366f1" },
  { id: "maternite", nom: "Maternité", total: 82, occupes: 69, nettoyage: 1, couleur: "#ec4899" },
]

const lits = [
  { num: "CH-001", service: "Cardiologie", patient: "Ibrahima Diallo", statut: "occupe", duree: "5 jours" },
  { num: "CH-002", service: "Cardiologie", patient: "Aminata Sow", statut: "occupe", duree: "2 jours" },
  { num: "CH-003", service: "Cardiologie", patient: "—", statut: "nettoyage", duree: "—" },
  { num: "URG-001", service: "Urgences", patient: "Ousmane Diop", statut: "occupe", duree: "1 jour" },
  { num: "URG-002", service: "Urgences", patient: "—", statut: "libre", duree: "—" },
  { num: "URG-003", service: "Urgences", patient: "Fatou Ndiaye", statut: "reserve", duree: "—" },
  { num: "PED-001", service: "Pédiatrie", patient: "Moussa Sarr (8 ans)", statut: "occupe", duree: "3 jours" },
  { num: "PED-002", service: "Pédiatrie", patient: "—", statut: "libre", duree: "—" },
  { num: "REA-001", service: "Réanimation", patient: "Aissatou Ba", statut: "occupe", duree: "12 jours" },
  { num: "REA-002", service: "Réanimation", patient: "Omar Faye", statut: "occupe", duree: "7 jours" },
  { num: "CHI-001", service: "Chirurgie", patient: "Lamine Mbaye", statut: "occupe", duree: "1 jour" },
  { num: "MAT-001", service: "Maternité", patient: "Rokhaya Diallo", statut: "occupe", duree: "2 jours" },
]

const statutLit: Record<string, { label: string; color: string; bg: string }> = {
  occupe: { label: "Occupé", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  libre: { label: "Libre", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  nettoyage: { label: "Nettoyage", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  reserve: { label: "Réservé", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
}

const predictions = [
  { label: "Dans 24h", libres: 18, couleur: "#22c55e" },
  { label: "Dans 48h", libres: 31, couleur: "#06b6d4" },
  { label: "Dans 72h", libres: 47, couleur: "#6366f1" },
]

export default function SmartBedsPage() {
  const [filtreService, setFiltreService] = useState("tous")
  const [filtreStatut, setFiltreStatut] = useState("tous")
  const [actionLit, setActionLit] = useState<string | null>(null)

  const bg = "#08122a"
  const card = "rgba(255,255,255,0.04)"
  const border = "rgba(255,255,255,0.08)"

  const litsFiltres = lits.filter((l) => {
    const matchService = filtreService === "tous" || l.service === filtreService
    const matchStatut = filtreStatut === "tous" || l.statut === filtreStatut
    return matchService && matchStatut
  })

  const totalOccupes = services.reduce((s, sv) => s + sv.occupes, 0)
  const totalTotal = services.reduce((s, sv) => s + sv.total, 0)
  const totalNettoyage = services.reduce((s, sv) => s + sv.nettoyage, 0)
  const totalLibres = totalTotal - totalOccupes - totalNettoyage

  function handleAction(num: string, action: string) {
    setActionLit(`${num}:${action}`)
    setTimeout(() => setActionLit(null), 1500)
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", color: "white" }}>
      <Navbar />

      {/* Stats Header */}
      <div style={{ background: "rgba(59,130,246,0.06)", borderBottom: "1px solid rgba(59,130,246,0.15)" }}
        className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Lits Total", value: totalTotal.toString(), icon: "🏥", color: "#3b82f6" },
              { label: `Occupés (${Math.round(totalOccupes / totalTotal * 100)}%)`, value: totalOccupes.toString(), icon: "🛏️", color: "#ef4444" },
              { label: "Libres", value: totalLibres.toString(), icon: "✅", color: "#22c55e" },
              { label: "En Nettoyage", value: totalNettoyage.toString(), icon: "🧹", color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12 }}
                className="px-4 py-3 flex items-center gap-3">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Alertes critiques */}
        {services.some(s => s.occupes / s.total > 0.9) && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12, padding: "12px 16px"
          }} className="flex items-center gap-3">
            <span className="text-red-400 text-xl animate-pulse">⚠️</span>
            <div>
              <span className="font-semibold text-red-400">Alerte capacité — </span>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {services.filter(s => s.occupes / s.total > 0.9).map(s => s.nom).join(", ")} dépassent 90% d'occupation. Action requise immédiatement.
              </span>
            </div>
          </div>
        )}

        {/* Vue par services */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>Vue par Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => {
              const pct = Math.round(s.occupes / s.total * 100)
              const barColor = pct < 70 ? "#22c55e" : pct < 90 ? "#f59e0b" : "#ef4444"
              const libres = s.total - s.occupes - s.nettoyage
              return (
                <div key={s.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14 }}
                  className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: s.couleur }} />
                      <span className="font-semibold text-white">{s.nom}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: barColor }}>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Total", val: s.total, c: "rgba(255,255,255,0.6)" },
                      { label: "Occupés", val: s.occupes, c: "#ef4444" },
                      { label: "Libres", val: libres, c: "#22c55e" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="font-bold text-lg" style={{ color: item.c }}>{item.val}</div>
                        <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tableau des lits */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
          <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3" style={{ borderColor: border }}>
            <div>
              <h3 className="font-semibold text-white">Tableau des Lits</h3>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{litsFiltres.length} lit(s) affiché(s)</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={filtreService} onChange={(e) => setFiltreService(e.target.value)}
                style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`, borderRadius: 8, color: "white", padding: "6px 10px", fontSize: 12, outline: "none" }}>
                <option value="tous">Tous services</option>
                {services.map(s => <option key={s.id} value={s.nom}>{s.nom}</option>)}
              </select>
              <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}
                style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`, borderRadius: 8, color: "white", padding: "6px 10px", fontSize: 12, outline: "none" }}>
                <option value="tous">Tous statuts</option>
                <option value="occupe">Occupé</option>
                <option value="libre">Libre</option>
                <option value="nettoyage">Nettoyage</option>
                <option value="reserve">Réservé</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}`, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  {["N° Lit", "Service", "Patient", "Statut", "Durée séjour", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {litsFiltres.map((l) => {
                  const s = statutLit[l.statut]
                  return (
                    <tr key={l.num} style={{ borderBottom: `1px solid ${border}` }}
                      className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: "#60a5fa" }}>{l.num}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{l.service}</td>
                      <td className="px-5 py-3 font-medium text-white text-xs">{l.patient}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{l.duree}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {["Affecter", "Libérer", "Nettoyage"].map(action => (
                            <button key={action}
                              onClick={() => handleAction(l.num, action)}
                              style={{
                                background: actionLit === `${l.num}:${action}` ? "#3b82f6" : "rgba(59,130,246,0.1)",
                                color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)",
                                borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer"
                              }}>
                              {actionLit === `${l.num}:${action}` ? "✓" : action}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prédictions IA */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🤖</span>
              <h3 className="font-semibold text-white">Prédictions IA — Libérations estimées</h3>
            </div>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Basé sur durées moyennes de séjour par pathologie et historique</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {predictions.map((p) => (
                <div key={p.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{p.label}</span>
                    <span className="font-bold" style={{ color: p.couleur }}>+{p.libres} lits</span>
                  </div>
                  <div className="h-8 rounded-lg relative overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-lg transition-all"
                      style={{ width: `${(p.libres / totalTotal) * 100}%`, background: `linear-gradient(90deg, ${p.couleur}66, ${p.couleur})` }} />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {Math.round(p.libres / totalTotal * 100)}% du parc
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {p.libres} patients estimés à la sortie
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

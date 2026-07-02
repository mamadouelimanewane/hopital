"use client"
import { useState } from "react"

const STATS = [
  { label: "Patients VIP sur place", value: "18", unit: "actuellement", icon: "🌟", color: "#eab308" },
  { label: "Transferts aujourd'hui", value: "6", unit: "aéroport / suites", icon: "✈️", color: "#0ea5e9" },
  { label: "Suites disponibles", value: "9", unit: "sur 24", icon: "🏨", color: "#10b981" },
  { label: "Interprètes actifs", value: "5", unit: "langues couvertes", icon: "🌍", color: "#8b5cf6" },
]

const PATIENTS_VIP = [
  { nom: "M. Al-Hassan Ndoye", nationalite: "🇸🇳 Sénégal", programme: "Cardiologie interventionnelle", concierge: "Astou Fall", arrivee: "28 Juin 2026", statut: "Sur place" },
  { nom: "Mme. Fatima Al-Rashid", nationalite: "🇦🇪 Émirats", programme: "Chirurgie orthopédique", concierge: "Modou Diagne", arrivee: "30 Juin 2026", statut: "Sur place" },
  { nom: "M. Cheikh Ahmed Diallo", nationalite: "🇫🇷 France", programme: "Bilan de santé complet", concierge: "Astou Fall", arrivee: "02 Juil. 2026", statut: "Attendu" },
  { nom: "Mme. Aïcha Ben Salem", nationalite: "🇲🇦 Maroc", programme: "Suivi post-opératoire", concierge: "Ibrahima Sarr", arrivee: "25 Juin 2026", statut: "Sur place" },
  { nom: "M. Omar Sy Diop", nationalite: "🇺🇸 États-Unis", programme: "Consultation spécialisée", concierge: "Modou Diagne", arrivee: "04 Juil. 2026", statut: "Attendu" },
  { nom: "Mme. Khady Diouf", nationalite: "🇬🇲 Gambie", programme: "Néphrologie / Dialyse", concierge: "Ibrahima Sarr", arrivee: "20 Juin 2026", statut: "Parti" },
]

const COLOR = "#eab308"

export default function ToubaMedCarePage() {
  const [search, setSearch] = useState("")
  const filtered = PATIENTS_VIP.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.programme.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both}
        .pulse{animation:pulse 2s infinite}
        .row:hover{background:rgba(255,255,255,0.04) !important}
        input:focus{outline:2px solid #eab308;border-color:transparent}
        button{cursor:pointer;border:none}
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", fontFamily: "system-ui,sans-serif" }}>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem" }}>

          {/* Hero */}
          <div className="fade" style={{ marginBottom: "2rem" }}>
            <span style={{ fontSize: 11, color: COLOR, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: `${COLOR}15`, padding: "3px 10px", borderRadius: 6, border: `1px solid ${COLOR}30` }}>
              Conciergerie Médicale VIP
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, margin: "12px 0 6px" }}>Touba-Med-Care</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 600, lineHeight: 1.6 }}>
              Services premium et conciergerie pour les patients internationaux et VIP de l&apos;Hôpital Ndamatou de Touba.
            </p>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: "2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay: `${i * 0.1}s`, background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}30`, borderRadius: 16, padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{s.label}</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: s.color, margin: "8px 0 2px" }}>{s.value}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{s.unit}</p>
                  </div>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Table */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>Patients VIP</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{filtered.length} patients affichés</p>
              </div>
              <input
                type="text"
                placeholder="🔍  Rechercher un patient ou programme..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", color: "#fff", fontSize: 13, width: 280 }}
              />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                    {["Patient", "Nationalité", "Programme de soins", "Concierge assigné", "Arrivée", "Statut"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const statutColor = p.statut === "Sur place" ? "#10b981" : p.statut === "Attendu" ? "#0ea5e9" : "#64748b"
                    return (
                      <tr key={p.nom} className="row" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s", cursor: "pointer" }}>
                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#fff" }}>{p.nom}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{p.nationalite}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{p.programme}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{p.concierge}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{p.arrivee}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ background: `${statutColor}18`, color: statutColor, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{p.statut}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions rapides */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: "1.5rem" }}>
            {[
              { label: "Nouveau patient VIP", icon: "🛎️", color: "#eab308" },
              { label: "Planifier transfert", icon: "✈️", color: "#0ea5e9" },
              { label: "Assigner une suite", icon: "🏨", color: "#10b981" },
              { label: "Demander interprète", icon: "🌍", color: "#8b5cf6" },
            ].map(a => (
              <button key={a.label} style={{ background: `${a.color}15`, border: `1px solid ${a.color}30`, borderRadius: 12, padding: "14px", color: a.color, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

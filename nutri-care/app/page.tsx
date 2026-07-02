"use client"
import { useState } from "react"

const STATS = [
  { label: "Repas Personnalisés", value: "100%", unit: "adaptés aux pathologies", icon: "🥗", color: "#d97706" },
  { label: "Patients Suivis", value: "214", unit: "dossiers actifs", icon: "👩‍⚕️", color: "#0ea5e9" },
  { label: "Cas de Dénutrition", value: "8", unit: "sous surveillance", icon: "📊", color: "#ef4444" },
  { label: "Repas / Jour / Patient", value: "3", unit: "petit-déj, déjeuner, dîner", icon: "🏭", color: "#10b981" },
]

const PATIENTS = [
  { nom: "Aïda Ndiaye", chambre: "204", regime: "Diabétique", risque: "Faible" },
  { nom: "Modou Fall", chambre: "112", regime: "Sans sel", risque: "Modéré" },
  { nom: "Bineta Sarr", chambre: "308", regime: "Hypocalorique", risque: "Faible" },
  { nom: "Ousmane Diagne", chambre: "115", regime: "Enrichi protéines", risque: "Élevé" },
  { nom: "Fatoumata Diallo", chambre: "221", regime: "Sans gluten", risque: "Faible" },
  { nom: "Cheikh Mbaye", chambre: "119", regime: "Enrichi protéines", risque: "Élevé" },
]

const COLOR = "#d97706"

export default function NutriCarePage() {
  const [search, setSearch] = useState("")
  const filtered = PATIENTS.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.chambre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade{animation:fadeUp .5s both}
        .row:hover{background:rgba(255,255,255,0.04) !important}
        input:focus{outline:2px solid #d97706;border-color:transparent}
        button{cursor:pointer;border:none}
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", fontFamily: "system-ui,sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem" }}>

          <div className="fade" style={{ marginBottom: "2rem" }}>
            <span style={{ fontSize: 11, color: COLOR, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: `${COLOR}15`, padding: "3px 10px", borderRadius: 6, border: `1px solid ${COLOR}30` }}>
              Suivi Nutritionnel Médical
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, margin: "12px 0 6px" }}>Nutri-Care</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 600, lineHeight: 1.6 }}>
              Gestion personnalisée de la nutrition des patients hospitalisés à l&apos;Hôpital Ndamatou de Touba.
            </p>
          </div>

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

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>Patients suivis</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{filtered.length} patients affichés</p>
              </div>
              <input
                type="text"
                placeholder="🔍  Rechercher un patient ou une chambre..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", color: "#fff", fontSize: 13, width: 300 }}
              />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                    {["Patient", "Chambre", "Régime Spécial", "Risque Dénutrition"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const risqueColor = p.risque === "Faible" ? "#10b981" : p.risque === "Modéré" ? "#f59e0b" : "#ef4444"
                    return (
                      <tr key={p.nom} className="row" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s", cursor: "pointer" }}>
                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#fff" }}>{p.nom}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{p.chambre}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{p.regime}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ background: `${risqueColor}18`, color: risqueColor, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{p.risque}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: "1.5rem" }}>
            {[
              { label: "Nouveau menu", icon: "🥗", color: "#d97706" },
              { label: "Dépistage dénutrition", icon: "📊", color: "#ef4444" },
              { label: "Contacter cuisine", icon: "🏭", color: "#0ea5e9" },
              { label: "Bilan diététique", icon: "👩‍⚕️", color: "#10b981" },
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

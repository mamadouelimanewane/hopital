"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"

type Section = "indicateurs" | "evenements" | "audits" | "prescriptions" | "jci"

const kpis = [
  { label: "Taux infection nosocomiale", valeur: 2.3, cible: 2.0, unite: "%", cibleLabel: "< 2%", statut: "danger", sens: "bas" },
  { label: "Mortalité post-opératoire", valeur: 0.8, cible: 1.0, unite: "%", cibleLabel: "< 1%", statut: "ok", sens: "bas" },
  { label: "Délai attente urgences", valeur: 38, cible: 30, unite: " min", cibleLabel: "< 30 min", statut: "warning", sens: "bas" },
  { label: "Satisfaction patients", valeur: 87, cible: 85, unite: "%", cibleLabel: "> 85%", statut: "ok", sens: "haut" },
  { label: "Erreurs médicamenteuses", valeur: 0.12, cible: 0.1, unite: "%", cibleLabel: "< 0.1%", statut: "warning", sens: "bas" },
  { label: "Taux réadmission 30j", valeur: 4.2, cible: 5.0, unite: "%", cibleLabel: "< 5%", statut: "ok", sens: "bas" },
]

const evenements = [
  { date: "18/06/2026", service: "Chirurgie B", type: "Chute patient", gravite: 2, statut: "Analysé" },
  { date: "15/06/2026", service: "Urgences", type: "Erreur médicamenteuse", gravite: 3, statut: "En cours" },
  { date: "12/06/2026", service: "Maternité", type: "Infection nosocomiale", gravite: 4, statut: "Clôturé" },
  { date: "08/06/2026", service: "Réanimation", type: "Incident matériel", gravite: 1, statut: "Analysé" },
  { date: "03/06/2026", service: "Pédiatrie", type: "Erreur identification", gravite: 2, statut: "Clôturé" },
]

const audits = [
  { date: "25/06/2026", type: "Interne", service: "Bloc opératoire", auditeur: "Equipe QSS", statut: "Planifié" },
  { date: "10/07/2026", type: "Externe", service: "Pharmacie", auditeur: "Ordre Pharmaciens", statut: "Planifié" },
  { date: "15/07/2026", type: "JCI", service: "Tous services", auditeur: "Commission JCI Accra", statut: "Planifié" },
  { date: "20/05/2026", type: "Interne", service: "Urgences", auditeur: "Equipe QSS", statut: "Réalisé", score: "84/100" },
  { date: "05/05/2026", type: "Interne", service: "Maternité", auditeur: "Equipe QSS", statut: "Réalisé", score: "91/100" },
]

const standardsJCI = [
  { code: "ACC", nom: "Accès aux soins et continuité", progression: 78, chapitres: 6 },
  { code: "AOP", nom: "Évaluation des patients", progression: 85, chapitres: 8 },
  { code: "COP", nom: "Soins aux patients", progression: 72, chapitres: 7 },
  { code: "ASC", nom: "Anesthésie et chirurgie", progression: 65, chapitres: 5 },
  { code: "MMU", nom: "Gestion des médicaments", progression: 58, chapitres: 9 },
  { code: "PFR", nom: "Droits des patients", progression: 90, chapitres: 4 },
  { code: "QPS", nom: "Amélioration qualité", progression: 67, chapitres: 6 },
  { code: "PCI", nom: "Prévention des infections", progression: 55, chapitres: 7 },
  { code: "GLD", nom: "Gouvernance et direction", progression: 80, chapitres: 5 },
  { code: "MCI", nom: "Gestion de l'information", progression: 63, chapitres: 8 },
  { code: "FMS", nom: "Gestion des installations", progression: 70, chapitres: 6 },
  { code: "SQE", nom: "Qualifications du personnel", progression: 75, chapitres: 7 },
  { code: "IPSG", nom: "Objectifs de sécurité", progression: 82, chapitres: 6 },
  { code: "MPE", nom: "Programme médical", progression: 60, chapitres: 4 },
]

const etapesAccred = [
  { nom: "Candidature", fait: true },
  { nom: "Auto-évaluation", fait: true },
  { nom: "Plan d'amélioration", fait: true },
  { nom: "Audit sur site", fait: false },
  { nom: "Rapport JCI", fait: false },
  { nom: "Décision", fait: false },
]

function StatutBadge({ statut }: { statut: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    ok: { bg: "#064e3b", color: "#10b981" },
    warning: { bg: "#78350f", color: "#fbbf24" },
    danger: { bg: "#7f1d1d", color: "#f87171" },
  }
  const s = map[statut] || map.ok
  return <span style={{ fontSize: 16 }}>{statut === "ok" ? "✅" : statut === "warning" ? "⚠️" : "❌"}</span>
}

function GraviteBadge({ n }: { n: number }) {
  const colors = ["", "#10b981", "#fbbf24", "#fb923c", "#ef4444", "#7c3aed"]
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= n ? colors[i] : "#374151" }} />
      ))}
    </div>
  )
}

export default function QualiteAccredPage() {
  const [activeSection, setActiveSection] = useState<Section>("indicateurs")
  const [exportMsg, setExportMsg] = useState("")

  const progressionGlobale = Math.round(standardsJCI.reduce((s, st) => s + st.progression, 0) / standardsJCI.length)

  const handleExport = () => {
    setExportMsg("Export PDF en cours de génération...")
    setTimeout(() => setExportMsg("Rapport_JCI_CHNCAK_Juin2026.pdf téléchargé ✓"), 1500)
  }

  const sections: { key: Section; label: string; icon: string }[] = [
    { key: "indicateurs", label: "Indicateurs OMS", icon: "📊" },
    { key: "evenements", label: "Événements Indésirables", icon: "⚠️" },
    { key: "audits", label: "Audits", icon: "🔍" },
    { key: "prescriptions", label: "Prescriptions", icon: "💊" },
    { key: "jci", label: "Standards JCI", icon: "🏅" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", color: "#1a202c" }}>
      <Navbar />

      {/* Header accréditation */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e3a5f" }}>Qualité & Accréditation CHNCAK</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>Centre Hospitalier National Cheikh Ahmadou Khadim — Touba, Sénégal</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: "#1e3a5f", color: "#fff", padding: "6px 16px", borderRadius: 24, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
              Niveau 2 / 5 — En progression
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Candidature JCI soumise — Mars 2026</div>
          </div>
        </div>

        {/* Barre de progression JCI */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>Progression vers accréditation JCI</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#3b82f6" }}>{progressionGlobale}%</span>
          </div>
          <div style={{ background: "#e2e8f0", borderRadius: 10, height: 12, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: `${progressionGlobale}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #6366f1)", borderRadius: 10, transition: "width 1s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {etapesAccred.map((e, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: e.fait ? "#3b82f6" : "#e2e8f0",
                  color: e.fait ? "#fff" : "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700
                }}>{e.fait ? "✓" : i + 1}</div>
                <span style={{ fontSize: 10, color: e.fait ? "#3b82f6" : "#94a3b8", textAlign: "center", maxWidth: 70 }}>{e.nom}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation sections */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px", display: "flex", gap: 4 }}>
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "12px 16px", fontSize: 13, fontWeight: activeSection === s.key ? 700 : 400,
            color: activeSection === s.key ? "#3b82f6" : "#64748b",
            borderBottom: activeSection === s.key ? "2px solid #3b82f6" : "2px solid transparent",
            display: "flex", alignItems: "center", gap: 6
          }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 32px" }}>

        {/* INDICATEURS OMS */}
        {activeSection === "indicateurs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: "#1e3a5f" }}>Indicateurs de Qualité OMS</h2>
              <div style={{ fontSize: 12, color: "#64748b" }}>Période : Juin 2026 • Mise à jour : 20/06/2026</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {kpis.map((k, i) => {
                const ok = k.statut === "ok"
                const warn = k.statut === "warning"
                const bg = ok ? "#f0fdf4" : warn ? "#fffbeb" : "#fef2f2"
                const border = ok ? "#bbf7d0" : warn ? "#fde68a" : "#fecaca"
                const val_color = ok ? "#16a34a" : warn ? "#d97706" : "#dc2626"
                return (
                  <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, lineHeight: 1.3, flex: 1, marginRight: 8 }}>{k.label}</div>
                      <StatutBadge statut={k.statut} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: val_color, marginBottom: 4 }}>
                      {k.valeur}{k.unite}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Cible OMS : <strong>{k.cibleLabel}</strong></div>
                    {/* Mini progress bar */}
                    <div style={{ background: "#e5e7eb", borderRadius: 4, height: 4, marginTop: 10, overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(100, (k.valeur / (k.cible * 1.5)) * 100)}%`,
                        height: "100%",
                        background: ok ? "#22c55e" : warn ? "#f59e0b" : "#ef4444",
                        borderRadius: 4
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* EVENEMENTS */}
        {activeSection === "evenements" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: "#1e3a5f" }}>Événements Indésirables</h2>
              <button style={{ background: "#1e3a5f", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>+ Déclarer un événement</button>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["Date", "Service", "Type", "Gravité (1-5)", "Statut", "Actions"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "#64748b", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evenements.map((e, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{e.date}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{e.service}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{e.type}</td>
                      <td style={{ padding: "12px 16px" }}><GraviteBadge n={e.gravite} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                          background: e.statut === "Clôturé" ? "#f0fdf4" : e.statut === "Analysé" ? "#eff6ff" : "#fffbeb",
                          color: e.statut === "Clôturé" ? "#16a34a" : e.statut === "Analysé" ? "#2563eb" : "#d97706"
                        }}>{e.statut}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button style={{ background: "#eff6ff", color: "#2563eb", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Voir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AUDITS */}
        {activeSection === "audits" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#1e3a5f" }}>Calendrier des Audits</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#3b82f6", marginBottom: 12 }}>Prochains audits</div>
                {audits.filter(a => a.statut === "Planifié").map((a, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{a.service}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: a.type === "JCI" ? "#eff6ff" : a.type === "Externe" ? "#f5f3ff" : "#f0fdf4", color: a.type === "JCI" ? "#2563eb" : a.type === "Externe" ? "#7c3aed" : "#16a34a", fontWeight: 700 }}>{a.type}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>📅 {a.date}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>👤 {a.auditeur}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", marginBottom: 12 }}>Derniers résultats</div>
                {audits.filter(a => a.statut === "Réalisé").map((a, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{a.service}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#16a34a" }}>{a.score}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>📅 {a.date} • {a.auditeur}</div>
                    <div style={{ background: "#e5e7eb", borderRadius: 4, height: 6, marginTop: 8, overflow: "hidden" }}>
                      <div style={{ width: `${parseInt((a.score || "0").split("/")[0])}%`, height: "100%", background: "#22c55e", borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRESCRIPTIONS */}
        {activeSection === "prescriptions" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#1e3a5f" }}>Analyse des Prescriptions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Prescriptions auditées", valeur: "1,247", icon: "📋", color: "#3b82f6" },
                { label: "Conformes", valeur: "1,138", pct: "91.3%", icon: "✅", color: "#16a34a" },
                { label: "Non conformes", valeur: "109", pct: "8.7%", icon: "⚠️", color: "#d97706" },
              ].map((c, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.valeur}</div>
                  {c.pct && <div style={{ fontSize: 14, color: c.color, fontWeight: 700 }}>{c.pct}</div>}
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{c.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 16 }}>Motifs de non-conformité</div>
              {[
                { motif: "Dosage non justifié", nb: 42, pct: 39 },
                { motif: "Absence de diagnostic", nb: 31, pct: 28 },
                { motif: "Interaction médicamenteuse", nb: 21, pct: 19 },
                { motif: "Durée non précisée", nb: 15, pct: 14 },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: "#374151" }}>{m.motif}</span>
                    <span style={{ color: "#64748b", fontWeight: 600 }}>{m.nb} cas ({m.pct}%)</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${m.pct}%`, height: "100%", background: "linear-gradient(90deg, #f59e0b, #d97706)", borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STANDARDS JCI */}
        {activeSection === "jci" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, color: "#1e3a5f" }}>Standards JCI — 14 Chapitres</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>Conformité globale : {progressionGlobale}% — Objectif : 80% pour candidature</p>
              </div>
              <div>
                <button onClick={handleExport} style={{ background: "#1e3a5f", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                  Exporter PDF (Rapport JCI)
                </button>
                {exportMsg && <div style={{ fontSize: 12, color: "#16a34a", marginTop: 6, textAlign: "right" }}>{exportMsg}</div>}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {standardsJCI.map((s, i) => {
                const color = s.progression >= 80 ? "#16a34a" : s.progression >= 60 ? "#d97706" : "#dc2626"
                const bg = s.progression >= 80 ? "#f0fdf4" : s.progression >= 60 ? "#fffbeb" : "#fef2f2"
                const icon = s.progression >= 80 ? "✅" : s.progression >= 60 ? "⚠️" : "❌"
                return (
                  <div key={i} style={{ background: bg, border: `1px solid ${s.progression >= 80 ? "#bbf7d0" : s.progression >= 60 ? "#fde68a" : "#fecaca"}`, borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 20, minWidth: 24 }}>{icon}</div>
                    <div style={{ minWidth: 60 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#1e3a5f" }}>{s.code}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{s.chapitres} ch.</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", marginBottom: 6 }}>{s.nom}</div>
                      <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${s.progression}%`, height: "100%", background: color, borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color, minWidth: 48, textAlign: "right" }}>{s.progression}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

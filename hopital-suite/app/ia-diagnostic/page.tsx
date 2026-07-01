"use client"
import { useState } from "react"

const modules = [
  {
    id: "cardio",
    icon: "🫀",
    title: "Cardiologie",
    subtitle: "Analyse ECG",
    description: "Détection d'arythmies, infarctus, anomalies cardiaques via analyse d'électrocardiogrammes.",
    precision: "96.1%",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
  {
    id: "ophta",
    icon: "👁️",
    title: "Ophtalmologie",
    subtitle: "Fond d'œil",
    description: "Analyse de rétinopathie diabétique, glaucome et DMLA sur clichés de fond d'œil.",
    precision: "94.7%",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
  {
    id: "bio",
    icon: "🧪",
    title: "Biologie",
    subtitle: "Bilans sanguins",
    description: "Interprétation automatisée des bilans biologiques avec détection de valeurs critiques.",
    precision: "93.8%",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
  },
  {
    id: "neuro",
    icon: "🧠",
    title: "Neurologie",
    subtitle: "IRM cérébrale",
    description: "Détection de tumeurs, AVC, lésions démyélinisantes sur images IRM cérébrales.",
    precision: "92.5%",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
]

const recentAnalyses = [
  { id: "ANA-2024-1247", patient: "Ibrahima Diallo", module: "Cardiologie", date: "20/06/2026 09:14", statut: "alerte", resultat: "Fibrillation auriculaire détectée — Consultation urgente" },
  { id: "ANA-2024-1246", patient: "Fatou Ndiaye", module: "Biologie", date: "20/06/2026 08:47", statut: "termine", resultat: "Bilan normal — Aucune anomalie significative" },
  { id: "ANA-2024-1245", patient: "Moussa Sarr", module: "Ophtalmologie", date: "20/06/2026 08:31", statut: "surveillance", resultat: "Rétinopathie stade 1 — Surveillance recommandée dans 3 mois" },
  { id: "ANA-2024-1244", patient: "Aissatou Ba", module: "Neurologie", date: "20/06/2026 07:55", statut: "termine", resultat: "IRM sans particularité — Résultat normal" },
  { id: "ANA-2024-1243", patient: "Oumar Fall", module: "Cardiologie", date: "19/06/2026 17:22", statut: "en_cours", resultat: "Analyse en cours..." },
]

const statutConfig: Record<string, { label: string; color: string; bg: string }> = {
  alerte: { label: "Alerte", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  termine: { label: "Terminé", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  surveillance: { label: "Surveillance", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  en_cours: { label: "En cours", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
}

const secondAvisReponse = `**Second Avis IA — Analyse des symptômes**

Basé sur les symptômes décrits, voici mon analyse différentielle :

**Probabilités diagnostiques :**
1. Insuffisance cardiaque congestive (68%) — Dyspnée d'effort + oedèmes
2. Embolie pulmonaire (18%) — À exclure en urgence
3. Pneumopathie infectieuse (14%) — Fièvre associée possible

**Recommandations immédiates :**
- ECG + Troponines urgentes
- BNP / NT-proBNP
- Radiographie thoracique
- SpO2 continue

**Niveau d'urgence : ÉLEVÉ** — Consultation cardiologue dans les 2h.

*Cette analyse est un support décisionnel — le diagnostic final reste de la compétence du médecin.*`

export default function IADiagnosticPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [symptomes, setSymptomes] = useState("")
  const [secondAvis, setSecondAvis] = useState<string | null>(null)
  const [loadingAvis, setLoadingAvis] = useState(false)
  const [analyseActive, setAnalyseActive] = useState<string | null>(null)

  function handleSecondAvis() {
    if (!symptomes.trim()) return
    setLoadingAvis(true)
    setSecondAvis(null)
    setTimeout(() => {
      setLoadingAvis(false)
      setSecondAvis(secondAvisReponse)
    }, 2000)
  }

  function handleAnalyser(moduleId: string) {
    setAnalyseActive(moduleId)
    setTimeout(() => setAnalyseActive(null), 3000)
  }

  const bg = "#0a0f1e"
  const card = "rgba(255,255,255,0.04)"
  const border = "rgba(255,255,255,0.08)"

  return (
    <div style={{ background: bg, minHeight: "100vh", color: "white" }}>
      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,22,40,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13, fontWeight:600 }}>
          ← Retour au Portail Ndamatou
        </a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>Ndamatou Suite</span>
      </div>

      {/* Scanlines overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.015) 2px, rgba(99,102,241,0.015) 4px)"
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Stats Header */}
        <div style={{ background: "rgba(99,102,241,0.06)", borderBottom: "1px solid rgba(99,102,241,0.15)" }}
          className="px-6 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Analyses", value: "1 247", icon: "📊", color: "#6366f1" },
              { label: "Alertes Critiques", value: "3", icon: "🚨", color: "#ef4444", pulse: true },
              { label: "Précision Moyenne", value: "94.2%", icon: "🎯", color: "#22c55e" },
              { label: "Temps Moyen", value: "2.3 min", icon: "⚡", color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12 }}
                className="px-4 py-3 flex items-center gap-3">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold" style={{ color: s.color }}>{s.value}</span>
                    {s.pulse && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

          {/* Modules de diagnostic */}
          <div>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
              Modules de Diagnostic IA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((m) => (
                <div key={m.id}
                  onClick={() => setActiveModule(activeModule === m.id ? null : m.id)}
                  style={{
                    background: activeModule === m.id ? m.bg : card,
                    border: `1px solid ${activeModule === m.id ? m.color : border}`,
                    borderRadius: 16, cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: activeModule === m.id ? `0 0 20px ${m.color}22` : "none"
                  }}
                  className="p-5 space-y-3 hover:border-opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{m.icon}</div>
                    <div className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: `${m.color}22`, color: m.color, border: `1px solid ${m.color}44` }}>
                      {m.precision} précision
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{m.title}</div>
                    <div className="text-xs font-medium mt-0.5" style={{ color: m.color }}>{m.subtitle}</div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{m.description}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnalyser(m.id) }}
                    style={{
                      background: analyseActive === m.id ? m.color : `${m.color}22`,
                      color: analyseActive === m.id ? "#fff" : m.color,
                      border: `1px solid ${m.color}`,
                      borderRadius: 8, width: "100%", padding: "8px 0",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s"
                    }}>
                    {analyseActive === m.id ? "⚡ Analyse en cours..." : "Analyser"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analyses récentes */}
            <div className="lg:col-span-2" style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
                <h3 className="font-semibold text-white">Analyses Récentes</h3>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>5 dernières analyses effectuées</p>
              </div>
              <div className="divide-y" style={{ borderColor: border }}>
                {recentAnalyses.map((a) => {
                  const s = statutConfig[a.statut]
                  return (
                    <div key={a.id} className="px-5 py-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{a.id}</span>
                          <span className="w-1 h-1 rounded-full inline-block" style={{ background: "rgba(255,255,255,0.2)" }} />
                          <span className="text-xs font-medium" style={{ color: "#6366f1" }}>{a.module}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: s.bg, color: s.color }}>
                          {a.statut === "alerte" && <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: s.color }} />}
                          {s.label}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white text-sm">{a.patient}</span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{a.date}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{a.resultat}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Second Avis IA */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-xs"
                    style={{ background: "rgba(99,102,241,0.2)", color: "#6366f1" }}>🤖</div>
                  <h3 className="font-semibold text-white">Second Avis IA</h3>
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Décrivez les symptômes pour obtenir une analyse différentielle</p>
              </div>
              <div className="p-5 space-y-3">
                <textarea
                  value={symptomes}
                  onChange={(e) => setSymptomes(e.target.value)}
                  placeholder="Ex: Patient de 58 ans, dyspnée d'effort, oedèmes des membres inférieurs, tension 150/95, antécédents HTA..."
                  rows={5}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${border}`,
                    borderRadius: 10, color: "white",
                    fontSize: 13, padding: "10px 12px",
                    width: "100%", resize: "none", outline: "none",
                    fontFamily: "inherit"
                  }}
                />
                <button
                  onClick={handleSecondAvis}
                  disabled={loadingAvis || !symptomes.trim()}
                  style={{
                    background: loadingAvis ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "white", border: "none", borderRadius: 10,
                    padding: "10px 16px", width: "100%", fontSize: 13,
                    fontWeight: 600, cursor: loadingAvis ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}>
                  {loadingAvis ? "⚡ Analyse en cours..." : "🤖 Obtenir second avis IA"}
                </button>

                {secondAvis && (
                  <div style={{
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: 10, padding: "12px 14px",
                    fontSize: 12, lineHeight: 1.7,
                    color: "rgba(255,255,255,0.75)",
                    maxHeight: 300, overflowY: "auto"
                  }}>
                    {secondAvis.split("\n").map((line, i) => (
                      <p key={i} className={line.startsWith("**") ? "font-semibold" : ""} style={{ color: line.startsWith("**") ? "#a5b4fc" : undefined }}>
                        {line.replace(/\*\*/g, "")}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

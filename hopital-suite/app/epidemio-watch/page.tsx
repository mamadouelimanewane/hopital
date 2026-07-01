"use client"
import { useState, useEffect } from "react"
import { AlertTriangle, Activity, Globe, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react"

const maladies = [
  { nom: "Paludisme", cas: 127, variation: "+23%", trend: "up", couleur: "#ef4444", alerte: true },
  { nom: "Choléra", cas: 0, variation: "0%", trend: "stable", couleur: "#22c55e", alerte: false },
  { nom: "Dengue", cas: 8, variation: "0%", trend: "stable", couleur: "#f59e0b", alerte: false },
  { nom: "Méningite", cas: 3, variation: "-12%", trend: "down", couleur: "#22c55e", alerte: false },
  { nom: "COVID variants", cas: 15, variation: "+2%", trend: "stable", couleur: "#f59e0b", alerte: false },
  { nom: "Rougeole", cas: 2, variation: "-8%", trend: "down", couleur: "#22c55e", alerte: false },
]

const regions = [
  { nom: "Dakar", niveau: "normal", cases: 23 },
  { nom: "Thiès", niveau: "surveillance", cases: 47 },
  { nom: "Kaolack", niveau: "alerte", cases: 89 },
  { nom: "Diourbel/Touba", niveau: "normal", cases: 12 },
  { nom: "Saint-Louis", niveau: "normal", cases: 8 },
  { nom: "Ziguinchor", niveau: "normal", cases: 6 },
  { nom: "Tambacounda", niveau: "surveillance", cases: 31 },
]

const niveauCouleur: Record<string, { bg: string; text: string; label: string }> = {
  normal: { bg: "#14532d", text: "#4ade80", label: "Normal" },
  surveillance: { bg: "#713f12", text: "#fbbf24", label: "Surveillance" },
  alerte: { bg: "#7f1d1d", text: "#f87171", label: "Alerte" },
}

const logs = [
  "SENSOR_KAOLACK: paludisme +3 cas confirmés",
  "SYNC_DAKAR_CHU: données reçues — 847 patients",
  "ALERT_THIÈS: cluster dengue en investigation",
  "REPORT_OMS: transmission hebdomadaire OK",
  "SENSOR_TAMBACOUNDA: surveillance active",
  "AI_MODEL: prédiction flux → normal dans 48h",
  "SYNC_MINISTERE: indicateurs nationaux transmis",
  "ALERT_KAOLACK: paludisme — seuil épidémique",
  "LAB_RESULTS: 12 frottis positifs Plasmodium",
  "WEATHER_CORR: précipitations +40mm → risque ↑",
]

export default function EpidémioWatch() {
  const [heure, setHeure] = useState("")
  const [logIndex, setLogIndex] = useState(3)
  const [alerteVisible, setAlerteVisible] = useState(true)

  useEffect(() => {
    const tick = () => setHeure(new Date().toLocaleTimeString("fr-FR"))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setLogIndex(i => (i + 1) % logs.length)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <style>{`
        body { margin:0; background:#050a14; color:#e2e8f0; font-family:'Inter',system-ui,sans-serif; }
        .pulse { animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .blink { animation:blink 1s step-end infinite; }
        @keyframes blink { 50%{opacity:0} }
        .log-line { animation:logFade 0.5s ease-out; }
        @keyframes logFade { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .card-dark { background:rgba(10,15,30,0.8); border:1px solid rgba(255,255,255,0.06); border-radius:12px; }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,22,40,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13, fontWeight:600 }}>
          ← Retour au Portail Ndamatou
        </a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>Ndamatou Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#1a0000,#3b0d0d)" }} className="px-6 py-4 border-b border-red-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-900/50 rounded-xl flex items-center justify-center text-xl">🦠</div>
            <div>
              <h1 className="text-xl font-black text-white">Épidémio-Watch <span className="font-light text-red-300">Ndamatou — Sénégal</span></h1>
              <p className="text-red-400 text-xs">Système de surveillance épidémiologique en temps réel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm font-mono">{heure}</span>
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/40 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse"></span>
              <span className="text-green-400 text-xs font-bold">Surveillance Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ALERTE BANNIÈRE */}
      {alerteVisible && (
        <div className="bg-red-900/40 border-b border-red-700/50 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 pulse" />
            <span className="text-red-300 text-sm font-semibold">
              ⚠️ ALERTE — Cluster Paludisme détecté — Région de Kaolack — <strong>+47 cas en 48h</strong> — Seuil épidémique atteint
            </span>
          </div>
          <button onClick={() => setAlerteVisible(false)} className="text-red-500 hover:text-red-300 text-lg">×</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* CARTE SÉNÉGAL + MALADIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CARTE STYLISÉE */}
          <div className="card-dark p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" />Carte Épidémique — Sénégal</h2>
            <div className="relative" style={{ height: 280 }}>
              {/* Carte CSS stylisée */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 300 250" className="w-full h-full">
                  {/* Forme simplifiée Sénégal */}
                  <path d="M 20 40 L 80 20 L 160 15 L 230 30 L 260 60 L 250 110 L 230 140 L 200 160 L 170 170 L 140 165 L 100 155 L 60 140 L 30 110 L 15 70 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2"/>
                  {regions.map((r, i) => {
                    const pos = [[160,85],[120,95],[165,115],[100,70],[60,50],[120,165],[220,90]]
                    const c = niveauCouleur[r.niveau]
                    return (
                      <g key={i}>
                        <circle cx={pos[i][0]} cy={pos[i][1]} r={r.niveau === "alerte" ? 14 : 10} fill={c.bg} stroke={c.text} strokeWidth={r.niveau === "alerte" ? 2 : 1} />
                        {r.niveau === "alerte" && <circle cx={pos[i][0]} cy={pos[i][1]} r={18} fill="none" stroke={c.text} strokeWidth="1" opacity="0.4" className="pulse" />}
                        <text x={pos[i][0]} y={pos[i][1]+1} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill={c.text} fontWeight="bold">{r.cases}</text>
                        <text x={pos[i][0]} y={pos[i][1]+16} textAnchor="middle" fontSize="6" fill="#94a3b8">{r.nom.split("/")[0]}</text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>
            {/* Légende */}
            <div className="flex gap-4 mt-2 justify-center">
              {Object.entries(niveauCouleur).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: v.text }}></div>
                  <span className="text-xs text-gray-400">{v.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MALADIES */}
          <div className="card-dark p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" />Maladies Surveillées — Cette semaine</h2>
            <div className="space-y-3">
              {maladies.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: m.couleur }}></div>
                    <span className="font-semibold text-gray-200 text-sm">{m.nom}</span>
                    {m.alerte && <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full pulse">ALERTE</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-white text-lg">{m.cas}</span>
                    <span className="text-xs">cas/sem</span>
                    <div className="flex items-center gap-1" style={{ color: m.trend === "up" ? "#ef4444" : m.trend === "down" ? "#22c55e" : "#94a3b8" }}>
                      {m.trend === "up" ? <TrendingUp className="w-4 h-4" /> : m.trend === "down" ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      <span className="text-xs font-bold">{m.variation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TERMINAL + RAPPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TERMINAL LIVE */}
          <div className="lg:col-span-2 card-dark p-5">
            <h2 className="font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full pulse"></span>
              Terminal de surveillance — Données live
            </h2>
            <div className="font-mono text-xs" style={{ background: "#000", borderRadius: 8, padding: "12px 16px", minHeight: 180 }}>
              {logs.slice(logIndex > 5 ? logIndex - 5 : 0, logIndex + 1).map((l, i) => (
                <div key={i} className={i === (logIndex > 5 ? 5 : logIndex) ? "log-line" : ""}>
                  <span style={{ color: "#4ade80" }}>[{new Date().toLocaleTimeString("fr-FR")}] </span>
                  <span style={{ color: "#93c5fd" }}>{l}</span>
                </div>
              ))}
              <span style={{ color: "#4ade80" }} className="blink">█</span>
            </div>
          </div>

          {/* RAPPORT OMS */}
          <div className="card-dark p-5 flex flex-col gap-4">
            <h2 className="font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" />Rapport OMS</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Dernière transmission</span>
                <span className="text-green-400 font-semibold">18 Juin 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prochaine</span>
                <span className="text-white font-semibold">25 Juin 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Statut Ministère</span>
                <span className="text-green-400 font-semibold">✅ À jour</span>
              </div>
            </div>
            <button className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold transition">
              📄 Générer rapport hebdomadaire
            </button>
            <div className="border-t border-white/5 pt-4">
              <h3 className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wide">Corrélations détectées</h3>
              <div className="space-y-2 text-xs text-gray-400">
                <div>🌧️ Pluies +40mm → Paludisme ↑ 23%</div>
                <div>📅 Grand Magal J-60 → Préparer surge</div>
                <div>🚌 Mobilité élevée → Dengue stable</div>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTES FLUX */}
        <div className="card-dark p-5">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" />Flux d'alertes en temps réel</h2>
          <div className="space-y-2">
            {[
              { region: "Kaolack", type: "Paludisme", gravite: "Élevée", action: "Déploiement équipe mobile", time: "Il y a 2h", color: "border-red-500 bg-red-900/10" },
              { region: "Thiès", type: "Dengue", gravite: "Modérée", action: "Investigation en cours", time: "Il y a 5h", color: "border-yellow-500 bg-yellow-900/10" },
              { region: "Tambacounda", type: "Paludisme", gravite: "Faible", action: "Surveillance renforcée", time: "Il y a 12h", color: "border-yellow-500 bg-yellow-900/10" },
              { region: "National", type: "Surveillance COVID", gravite: "Minimale", action: "Monitoring passif", time: "Il y a 24h", color: "border-gray-600 bg-gray-900/10" },
            ].map((a, i) => (
              <div key={i} className={`border-l-2 ${a.color} pl-4 py-2 rounded-r-lg flex flex-col md:flex-row justify-between gap-2`}>
                <div>
                  <span className="font-bold text-white text-sm">{a.region} — {a.type}</span>
                  <span className="text-gray-400 text-xs ml-3">Gravité : {a.gravite}</span>
                  <p className="text-gray-500 text-xs mt-1">→ {a.action}</p>
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

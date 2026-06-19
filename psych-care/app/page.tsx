"use client"
import { useState, useEffect } from "react"
import { Activity, ShieldAlert, Zap, Globe, BarChart4, Target, Cpu, Radio } from "lucide-react"

// --- Données Mockées pour l'effet "Temps Réel" ---
const AI_ALERTS = [
  "🚨 [IA-DETECT] Pic de temps de parole non déclaré (RTS1) - +45% (12:00)",
  "⚠️ [DEEPFAKE] Contenu suspect détecté sur TikTok (Score: 89%) - Source: DakarLive",
  "🛡️ [KIDS-PROTECT] Programme inadapté signalé sur SenTV à 14h30",
  "📊 [AD-WATCH] Infraction: Dépassement volume publicitaire TFM (+12 min)",
  "🤖 [IA-PREDICT] Risque de désinformation élevé (Secteur Nord) - Mots clés: 'Fraude'",
  "📡 [STREAM-REGUL] 3 nouvelles Web-TVs non déclarées détectées sur YouTube",
]

const STATS = [
  { label: "Heures TV Analysées (24h)", value: 1420, suffix: "h", color: "#14b8a6" },
  { label: "Deepfakes Bloqués", value: 47, suffix: "", color: "#a855f7" },
  { label: "Alertes Pluralisme", value: 12, suffix: "", color: "#eab308" },
  { label: "Fiabilité Globale", value: 98, suffix: "%", color: "#10b981" },
]

export default function CommandCenter() {
  const [mounted, setMounted] = useState(false)
  const [alertIndex, setAlertIndex] = useState(0)
  const [randomData, setRandomData] = useState<number[]>([40, 60, 45, 80, 55, 90, 65, 85, 50, 75])

  // Simulation Temps Réel
  useEffect(() => {
    setMounted(true)
    const alertInterval = setInterval(() => {
      setAlertIndex(prev => (prev + 1) % AI_ALERTS.length)
    }, 4500)
    
    const chartInterval = setInterval(() => {
      setRandomData(prev => prev.map(v => Math.max(20, Math.min(100, v + (Math.random() * 20 - 10)))))
    }, 2000)

    return () => {
      clearInterval(alertInterval)
      clearInterval(chartInterval)
    }
  }, [])

  return (
    <>
      <style>{`
        body { margin: 0; background: #030712; color: #fff; font-family: 'Inter', system-ui, sans-serif; overflow-x: hidden; }
        
        /* Animations CSS pures */
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(20, 184, 166, 0.2); }
          50% { box-shadow: 0 0 35px rgba(20, 184, 166, 0.6); }
        }
        @keyframes typing {
          from { width: 0; opacity: 0; }
          to { width: 100%; opacity: 1; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #14b8a6; }
        }
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .grid-bg {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(20, 184, 166, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(20, 184, 166, 0.05) 1px, transparent 1px);
        }
        
        .glass-panel {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(20, 184, 166, 0.15);
          border-radius: 16px;
        }

        .cyber-text {
          color: #5eead4;
          text-shadow: 0 0 10px rgba(94, 234, 212, 0.5);
        }
        
        .typewriter {
          overflow: hidden;
          border-right: .15em solid #14b8a6;
          white-space: nowrap;
          margin: 0 auto;
          letter-spacing: .05em;
          animation: 
            typing 3s steps(40, end),
            blink-caret .75s step-end infinite;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #14b8a6; border-radius: 10px; }
      `}</style>

      <div className="min-h-screen relative grid-bg">
        {/* Ligne de scan radar style matrice */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'linear-gradient(to bottom, transparent, #14b8a6, transparent)',
            height: '2px',
            animation: 'scanline 8s linear infinite'
          }}
        />

        {/* Effet lueur radiale globale */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(circle at 50% 30%, rgba(20,184,166,0.1), transparent 60%)"
        }} />

        {/* --- HEADER --- */}
        <header className="glass-panel sticky top-0 z-50 flex items-center justify-between px-6 py-4 mx-4 mt-4 border-b-0 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Cpu className="w-8 h-8 text-teal-400" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-widest">
                CHNCAK <span className="cyber-text">ANALYTICS</span>
              </h1>
              <p className="text-[10px] text-teal-500 tracking-[0.2em] uppercase font-bold">
                Santé Mentale Connectée
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-mono">SYSTEM ONLINE</span>
            </div>
            <div className="px-3 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs">
              v2.0.4-AI-CORE
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="max-w-[1400px] mx-auto p-4 md:p-6 mt-4 grid gap-6 grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* Section 1 : Flux d'alerte IA & Radar (Top Left) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Terminal AI Feed */}
            <div className="glass-panel p-6 border-l-4 border-l-red-500 flex flex-col" style={{ animation: "floatUp 0.6s ease-out" }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-red-400" />
                  Flux Cerveau IA - Temps Réel
                </h2>
                <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded">LIVE SECURE</span>
              </div>
              <div className="bg-gray-950/80 rounded-xl p-4 min-h-[80px] flex items-center font-mono text-sm border border-gray-800 relative overflow-hidden">
                {mounted && (
                  <p key={alertIndex} className="text-red-400 typewriter m-0">
                    {AI_ALERTS[alertIndex]}
                  </p>
                )}
              </div>
            </div>

            {/* Statistiques Clés Dynamiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <div key={i} className="glass-panel p-5 relative overflow-hidden group" style={{ animation: `floatUp 0.6s ${i * 0.1}s ease-out both` }}>
                  <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20" style={{ background: stat.color, filter: 'blur(15px)' }} />
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    {mounted ? (
                      <span className="text-3xl font-black text-white" style={{ textShadow: `0 0 20px ${stat.color}` }}>
                        <AnimatedNumber value={stat.value} />
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-white">0</span>
                    )}
                    <span className="text-sm font-bold" style={{ color: stat.color }}>{stat.suffix}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphique Big Data Simulé */}
            <div className="glass-panel p-6 flex-1 min-h-[300px]" style={{ animation: "floatUp 0.6s 0.5s ease-out both" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
                  <BarChart4 className="w-4 h-4 text-teal-400" />
                  Densité de Flux Audiovisuel (Toute Bande)
                </h2>
              </div>
              
              <div className="h-48 flex items-end gap-2 justify-between px-2">
                {randomData.map((val, idx) => (
                  <div key={idx} className="relative w-full bg-teal-950/40 rounded-t-sm group">
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-teal-600 to-teal-300 rounded-t-sm transition-all duration-700 ease-out"
                      style={{ 
                        height: `${val}%`,
                        boxShadow: '0 0 10px rgba(20,184,166,0.3)'
                      }}
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono bg-teal-900 px-2 py-1 rounded text-teal-300 transition-opacity">
                      {Math.round(val)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Section 2 : Analyse Sectorielle & Radar (Right Sidebar) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Composant Radar Visuel */}
            <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden" style={{ animation: "pulse-glow 4s infinite" }}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-6 w-full flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Cartographie Réseau
              </h2>
              
              {/* Cercle Radar */}
              <div className="relative w-48 h-48 rounded-full border border-teal-500/30 flex items-center justify-center">
                <div className="absolute inset-2 rounded-full border border-teal-500/20" />
                <div className="absolute inset-8 rounded-full border border-teal-500/10" />
                <div className="absolute w-full h-full rounded-full border-t border-teal-400" style={{ animation: "radar-spin 4s linear infinite" }}>
                  <div className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-transparent to-teal-500/20 origin-left" />
                </div>
                {/* Blips */}
                <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <div className="absolute bottom-[40%] right-[20%] w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
                <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: "2s" }} />
                <Target className="w-6 h-6 text-teal-500/50 absolute z-10" />
              </div>
              
              <div className="mt-6 w-full space-y-2 font-mono text-xs">
                <div className="flex justify-between text-gray-400"><span>Canaux Numériques:</span><span className="text-teal-400">42 Actifs</span></div>
                <div className="flex justify-between text-gray-400"><span>Charge Serveurs IA:</span><span className="text-yellow-400">78%</span></div>
                <div className="flex justify-between text-gray-400"><span>Dernier Scan:</span><span className="text-white">Il y a 0.4s</span></div>
              </div>
            </div>

            {/* Modules d'action rapide */}
            <div className="glass-panel p-6 flex-1">
               <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                Modules Sous-Systèmes
              </h2>
              <div className="space-y-3">
                {['ElectroWatch', 'MediaWatch', 'AntiDeep', 'KidsProtect', 'AdWatch'].map((sys, idx) => (
                  <button key={idx} className="w-full text-left px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-teal-500/50 hover:bg-teal-900/20 transition-all flex justify-between items-center group">
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{sys}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}

// Composant pour animer les nombres
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1500
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return <>{displayValue}</>
}

"use client"
import { useState, useEffect } from "react"
import { BrainCircuit, Activity, ShieldAlert, Cpu, ZoomIn, Scan, Layers, Server } from "lucide-react"

const AI_ANALYSIS = [
  "INITIALISATION DU SCAN...",
  "CALIBRATION DES CAPTEURS IRM... [OK]",
  "ANALYSE DE LA DENSITÉ TISSULAIRE...",
  "DÉTECTION DE MICRO-ANOMALIES EN COURS...",
  "[ALERTE] ANOMALIE DÉTECTÉE - SECTEUR FRONTAL GAUCHE",
  "PROBABILITÉ TUMEUR BÉNIGNE : 12%",
  "PROBABILITÉ MICRO-ANÉVRISME : 94.2%",
  "GÉNÉRATION DU RAPPORT NEUROLOGIQUE...",
  "RAPPORT TRANSMIS AU DR. NDIAYE."
]

export default function NeuroScan() {
  const [mounted, setMounted] = useState(false)
  const [logIndex, setLogIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    // Simulate AI log feed
    const logInterval = setInterval(() => {
      setLogIndex(prev => {
        if (prev < AI_ANALYSIS.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);
    
    // Simulate progress bar
    const progInterval = setInterval(() => {
      setProgress(p => (p < 100 ? p + 2 : 100));
    }, 200);

    return () => {
      clearInterval(logInterval);
      clearInterval(progInterval);
    }
  }, [])

  return (
    <>
      <style>{`
        body { margin: 0; background: #050505; color: #fff; font-family: 'Inter', monospace, system-ui; overflow-x: hidden; }
        
        @keyframes scanline {
          0% { top: 0; box-shadow: 0 0 20px rgba(139, 92, 246, 0.8); }
          50% { top: 100%; box-shadow: 0 0 40px rgba(139, 92, 246, 1); }
          100% { top: 0; box-shadow: 0 0 20px rgba(139, 92, 246, 0.8); }
        }
        
        @keyframes pulse-box {
          0%, 100% { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.1); }
          50% { border-color: rgba(239, 68, 68, 0.8); background: rgba(239, 68, 68, 0.3); }
        }

        .mri-bg {
          background-image: 
            radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%),
            url('https://www.transparenttextures.com/patterns/cubes.png');
          background-color: #0a0a0a;
        }

        .glass-panel {
          background: rgba(15, 15, 20, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
        }

        .typewriter {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #8b5cf6;
          animation: typing 1s steps(40, end), blink 0.75s step-end infinite;
        }

        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes blink { 50% { border-color: transparent } }
      `}</style>

      {/* HEADER */}
      <header className="glass-panel sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 mx-2 sm:mx-4 mt-4 border-b-0">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <BrainCircuit className="w-8 h-8 text-violet-500 animate-pulse" />
          <div>
            <h1 className="text-xl font-black text-white tracking-widest">
              NEURO<span className="text-violet-500">SCAN</span>-IA
            </h1>
            <p className="text-[9px] sm:text-[10px] text-violet-400 tracking-[0.2em] uppercase font-bold">
              Unité de Radiologie Assistée (CHNCAK)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-violet-900/30 rounded border border-violet-500/30">
            <Server className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-300 font-mono">NODE_CLUSTER_7</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">IA ACTIVE</span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-[1600px] mx-auto p-2 sm:p-4 mt-2 sm:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto min-h-[calc(100vh-120px)]">
        
        {/* LEFT PANEL: IMAGE SCANNER */}
        <div className="lg:col-span-8 flex flex-col gap-4 h-[50vh] sm:h-[60vh] lg:h-auto">
          <div className="glass-panel flex-1 relative overflow-hidden flex items-center justify-center mri-bg">
            
            {/* The MRI Image Simulation (Abstract Brain shape) */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 opacity-60">
              <div className="absolute inset-0 rounded-[40%_60%_70%_30%] border-4 border-violet-800/50 shadow-[0_0_30px_rgba(139,92,246,0.2)] mix-blend-screen" style={{ transform: 'rotate(15deg)' }}></div>
              <div className="absolute inset-4 rounded-[60%_40%_30%_70%] border-2 border-violet-600/60 shadow-[inset_0_0_20px_rgba(139,92,246,0.3)] mix-blend-screen" style={{ transform: 'rotate(-10deg)' }}></div>
              <div className="absolute inset-8 rounded-[50%_50%_40%_60%] border-2 border-violet-400/80 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
              
              {/* Bounding Box (Anomaly detection) */}
              {logIndex >= 4 && (
                <div className="absolute top-[20%] right-[30%] w-12 h-12 sm:w-16 sm:h-16 border-2 border-red-500" style={{ animation: 'pulse-box 1.5s infinite' }}>
                  <div className="absolute -top-6 -right-6 text-[10px] text-red-500 font-mono bg-red-950/80 px-1 border border-red-900">
                    ANOMALIE
                  </div>
                  <Scan className="absolute -inset-2 w-full h-full text-red-500 opacity-50 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
              )}
            </div>

            {/* Scanning Line */}
            <div 
              className="absolute left-0 w-full h-[2px] bg-violet-400 z-10"
              style={{ animation: 'scanline 3s linear infinite' }}
            />

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 text-[10px] sm:text-xs font-mono text-violet-300">
              <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> T1-WEIGHTED MRI</span>
              <span>SLICE: 42/128</span>
              <span>THICKNESS: 2.0mm</span>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="p-2 bg-violet-900/50 border border-violet-500/50 rounded hover:bg-violet-600/50 transition">
                <ZoomIn className="w-4 h-4 text-violet-200" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: ANALYTICS & LOGS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Patient Info */}
          <div className="glass-panel p-4 sm:p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Dossier Patient
            </h2>
            <div className="space-y-3 text-xs sm:text-sm font-mono">
              <div className="flex justify-between"><span className="text-gray-500">ID:</span><span className="text-white">CHN-2026-9482</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sexe:</span><span className="text-white">M</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Âge:</span><span className="text-white">54 ans</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Service:</span><span className="text-violet-400 font-bold">Neurologie</span></div>
            </div>
          </div>

          {/* AI Live Feed */}
          <div className="glass-panel p-4 sm:p-5 flex flex-col flex-1 min-h-[250px]">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2 flex justify-between items-center">
              <span>Terminal IA</span>
              <span className="text-violet-500 text-[10px] animate-pulse">PROCESSING...</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 font-mono text-[10px] sm:text-xs">
              {mounted && AI_ANALYSIS.slice(0, logIndex + 1).map((log, i) => {
                const isAlert = log.includes("[ALERTE]");
                const isComplete = i === logIndex;
                return (
                  <div key={i} className={`p-2 rounded border-l-2 ${isAlert ? 'border-red-500 bg-red-950/30 text-red-400' : 'border-violet-500 bg-violet-950/20 text-violet-300'} ${isComplete ? 'typewriter' : ''}`}>
                    {log}
                  </div>
                )
              })}
            </div>

            {/* Global Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                <span>Progression de l'Analyse</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden border border-gray-800">
                <div 
                  className="bg-violet-500 h-1.5 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_#8b5cf6]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
        </div>

      </main>
    </>
  )
}

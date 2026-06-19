"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { AlertTriangle, Activity, Zap, Shield, TrendingUp, Radio, Tv, Globe, Clock } from "lucide-react"

interface LiveIntervention {
  id: string
  parti_nom: string
  parti_couleur: string
  media_nom: string
  media_type: string
  duree_secondes: number
  date_intervention: string
  programme: string | null
}

interface LiveAlerte {
  id: string
  niveau: string
  message: string
  media_nom: string
  created_at: string
}

interface StatLive {
  media_nom: string
  parti_nom: string
  pct: number
  secondes: number
  couleur: string
}

function formatDuree(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}`
  return `${m}min${(s % 60).toString().padStart(2, "0")}s`
}

function PulsingDot({ color = "#ef4444" }: { color?: string }) {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: color }} />
      <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: color }} />
    </span>
  )
}

function LiveCounter({ value, label, color, icon: Icon }: { value: number | string; label: string; color: string; icon: React.ElementType }) {
  const [display, setDisplay] = useState(0)
  const target = typeof value === "number" ? value : 0

  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 30)
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setDisplay(start)
      if (start >= target) clearInterval(timer)
    }, 40)
    return () => clearInterval(timer)
  }, [target])

  return (
    <div className="relative overflow-hidden rounded-2xl border p-6" style={{ borderColor: color + "40", background: color + "08" }}>
      <div className="absolute top-3 right-3 opacity-10">
        <Icon className="size-16" style={{ color }} />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>{label}</p>
      <p className="text-5xl font-black text-white tabular-nums">
        {typeof value === "string" ? value : display.toLocaleString()}
      </p>
    </div>
  )
}

export function SalleDeCriseClient() {
  const supabase = createClient()
  const [interventions, setInterventions] = useState<LiveIntervention[]>([])
  const [alertes, setAlertes] = useState<LiveAlerte[]>([])
  const [stats, setStats] = useState<StatLive[]>([])
  const [totalSecondes, setTotalSecondes] = useState(0)
  const [nbInterventions, setNbInterventions] = useState(0)
  const [nbAlertes, setNbAlertes] = useState(0)
  const [now, setNow] = useState(new Date())
  const [newAlert, setNewAlert] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)
  const [campagneNom, setCampagneNom] = useState("Chargement…")
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    load()

    // Realtime subscription
    const channel = supabase
      .channel("salle-de-crise")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "interventions" }, () => load())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alertes" }, () => {
        setNewAlert(true)
        setTimeout(() => setNewAlert(false), 3000)
        load()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function load() {
    const { data: campagne } = await supabase
      .from("campagnes").select("id, nom").eq("statut", "en_cours").limit(1).single()

    if (!campagne) return
    setCampagneNom(campagne.nom)

    const [intv, alrt, statsData] = await Promise.all([
      supabase.from("interventions")
        .select("id, duree_secondes, date_intervention, programme, parti:partis(nom,couleur), media:medias(nom,type)")
        .eq("campagne_id", campagne.id)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("alertes")
        .select("id, niveau, message, created_at, media:medias(nom)")
        .eq("campagne_id", campagne.id)
        .in("statut", ["non_lue", "en_cours"])
        .order("created_at", { ascending: false }),
      supabase.from("v_stats_parti_media")
        .select("media_nom, parti_nom, pourcentage_sur_media, total_secondes, parti:partis(couleur)")
        .eq("campagne_id", campagne.id)
        .order("pourcentage_sur_media", { ascending: false })
        .limit(20),
    ])

    const mapped = (intv.data ?? []).map((i: Record<string, unknown>) => ({
      id: i.id as string,
      parti_nom: (i.parti as { nom: string })?.nom ?? "?",
      parti_couleur: (i.parti as { couleur: string })?.couleur ?? "#888",
      media_nom: (i.media as { nom: string })?.nom ?? "?",
      media_type: (i.media as { type: string })?.type ?? "?",
      duree_secondes: i.duree_secondes as number,
      date_intervention: i.date_intervention as string,
      programme: i.programme as string | null,
    }))

    const mappedAlerts = (alrt.data ?? []).map((a: Record<string, unknown>) => ({
      id: a.id as string,
      niveau: a.niveau as string,
      message: a.message as string,
      media_nom: (a.media as { nom: string })?.nom ?? "?",
      created_at: a.created_at as string,
    }))

    const mappedStats = (statsData.data ?? []).map((s: Record<string, unknown>) => ({
      media_nom: s.media_nom as string,
      parti_nom: s.parti_nom as string,
      pct: Number(s.pourcentage_sur_media ?? 0),
      secondes: Number(s.total_secondes ?? 0),
      couleur: (s.parti as { couleur: string })?.couleur ?? "#888",
    }))

    setInterventions(mapped)
    setAlertes(mappedAlerts)
    setStats(mappedStats)
    setTotalSecondes(mapped.reduce((s, i) => s + i.duree_secondes, 0))
    setNbInterventions(mapped.length)
    setNbAlertes(mappedAlerts.length)
  }

  const niveauColor = (n: string) => n === "critique" ? "#ef4444" : n === "avertissement" ? "#f59e0b" : "#3b82f6"

  return (
    <div
      className={`bg-[#020b18] text-white min-h-screen ${fullscreen ? "fixed inset-0 z-50 overflow-auto" : ""}`}
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-4">
          <PulsingDot color="#22c55e" />
          <span className="text-green-400 text-xs font-bold tracking-widest uppercase">SYSTÈME ACTIF — MONITORING EN COURS</span>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Campagne surveillée</p>
          <p className="text-white font-bold text-sm">{campagneNom}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-black text-white tabular-nums">{now.toLocaleTimeString("fr-FR")}</p>
            <p className="text-xs text-gray-500">{now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="px-3 py-1.5 rounded border border-white/10 text-xs text-gray-400 hover:border-white/30 hover:text-white transition-colors"
          >
            {fullscreen ? "↙ Réduire" : "↗ Plein écran"}
          </button>
        </div>
      </div>

      {/* Alerte flash */}
      {newAlert && (
        <div className="bg-red-600 text-white text-center py-3 animate-pulse font-bold tracking-widest uppercase text-sm">
          ⚠ NOUVELLE ALERTE DÉTECTÉE — DÉSÉQUILIBRE CONSTATÉ
        </div>
      )}

      <div className="p-8 space-y-8">
        {/* KPIs animés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LiveCounter value={nbInterventions} label="Interventions" color="#3b82f6" icon={Activity} />
          <LiveCounter value={formatDuree(totalSecondes)} label="Temps total" color="#22c55e" icon={Clock} />
          <LiveCounter value={nbAlertes} label="Alertes actives" color="#ef4444" icon={AlertTriangle} />
          <LiveCounter value={6} label="Médias surveillés" color="#a855f7" icon={Shield} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Flux interventions en temps réel */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <PulsingDot color="#3b82f6" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Flux interventions — temps réel</h2>
            </div>
            <div ref={tickerRef} className="space-y-2 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {interventions.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-8">En attente d&apos;interventions…</p>
              ) : interventions.map((i, idx) => (
                <div
                  key={i.id}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 border transition-all"
                  style={{
                    borderColor: i.parti_couleur + "30",
                    background: i.parti_couleur + "08",
                    opacity: 1 - idx * 0.015,
                  }}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: i.parti_couleur }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{i.parti_nom}</span>
                      <span className="text-gray-500 text-xs">sur</span>
                      <span className="text-gray-300 text-sm">{i.media_nom}</span>
                      {i.media_type === "television" ? <Tv className="size-3 text-gray-500" /> :
                       i.media_type === "radio" ? <Radio className="size-3 text-gray-500" /> :
                       <Globe className="size-3 text-gray-500" />}
                    </div>
                    <p className="text-xs text-gray-500">{i.programme ?? "Programme non précisé"} · {i.date_intervention}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black tabular-nums" style={{ color: i.parti_couleur }}>
                      {formatDuree(i.duree_secondes)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Barres de déséquilibre par média */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="size-4 text-yellow-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-400">Répartition par média — déséquilibres</h2>
              </div>
              <div className="space-y-4">
                {Array.from(new Set(stats.map(s => s.media_nom))).slice(0, 5).map(media => {
                  const mediaStats = stats.filter(s => s.media_nom === media).slice(0, 6)
                  return (
                    <div key={media}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400 w-20 truncate">{media}</span>
                        <div className="flex-1 flex h-6 rounded-lg overflow-hidden">
                          {mediaStats.map((s, i) => (
                            <div key={i}
                              className="h-full flex items-center justify-center transition-all duration-700"
                              style={{ width: `${s.pct}%`, background: s.couleur, minWidth: s.pct > 5 ? undefined : "0" }}
                              title={`${s.parti_nom}: ${s.pct.toFixed(1)}%`}
                            >
                              {s.pct > 12 && <span className="text-[10px] font-bold text-white/90">{s.pct.toFixed(0)}%</span>}
                            </div>
                          ))}
                        </div>
                        {mediaStats.some(s => s.pct > 40) && (
                          <span className="text-red-500 text-xs font-bold animate-pulse">⚠ DÉSÉQUILIBRE</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Panel alertes */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <PulsingDot color="#ef4444" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-400">Alertes actives</h2>
            </div>
            <div className="space-y-3">
              {alertes.length === 0 ? (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
                  <Shield className="size-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-400 text-sm font-bold">Aucune alerte</p>
                  <p className="text-green-700 text-xs">Pluralisme respecté</p>
                </div>
              ) : alertes.map(a => (
                <div key={a.id} className="rounded-xl border p-4 space-y-2"
                  style={{ borderColor: niveauColor(a.niveau) + "40", background: niveauColor(a.niveau) + "08" }}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <PulsingDot color={niveauColor(a.niveau)} />
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: niveauColor(a.niveau) }}>
                        {a.niveau}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{new Date(a.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{a.message}</p>
                  <p className="text-xs text-gray-600">📺 {a.media_nom}</p>
                </div>
              ))}
            </div>

            {/* Mini légende partis */}
            <div className="mt-6">
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Partis monitorés</p>
              <div className="space-y-2">
                {Array.from(new Map(stats.map(s => [s.parti_nom, s.couleur])).entries()).map(([nom, couleur]) => (
                  <div key={nom} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: couleur }} />
                    <span className="text-xs text-gray-400 truncate">{nom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer ticker */}
        <div className="border-t border-white/5 pt-4 flex items-center gap-4 overflow-hidden">
          <span className="text-xs text-blue-400 font-bold uppercase tracking-widest shrink-0 flex items-center gap-2">
            <Zap className="size-3" /> EN DIRECT
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-8 animate-[scroll_20s_linear_infinite]" style={{ whiteSpace: "nowrap" }}>
              {interventions.slice(0, 8).map(i => (
                <span key={i.id} className="text-xs text-gray-500">
                  <span style={{ color: i.parti_couleur }}>■ {i.parti_nom}</span>
                  {" "}→ {i.media_nom} · {formatDuree(i.duree_secondes)}
                  {" · "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

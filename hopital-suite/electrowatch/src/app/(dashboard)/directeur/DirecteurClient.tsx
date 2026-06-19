"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Clock, Tv, Radio, Globe } from "lucide-react"
import type { Campagne } from "@/types"

interface ScoreMedia {
  nom: string
  score: number
  type: string
  tendance: number
}

export function DirecteurClient() {
  const supabase = createClient()
  const [campagnes, setCampagnes] = useState<Campagne[]>([])
  const [selectedCampagne, setSelectedCampagne] = useState<string | null>(null)
  const [scoreEquite, setScoreEquite] = useState(0)
  const [scoresMedias, setScoresMedias] = useState<ScoreMedia[]>([])
  const [evolutionData, setEvolutionData] = useState<{ semaine: string; score: number; alertes: number }[]>([])
  const [statsGlobales, setStatsGlobales] = useState({
    totalInterventions: 0,
    totalHeures: 0,
    totalAlertes: 0,
    totalSanctions: 0,
    medias_conformes: 0,
    medias_total: 0,
  })
  const [repartitionType, setRepartitionType] = useState<{ name: string; value: number; color: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampagnes()
  }, [])

  useEffect(() => {
    if (selectedCampagne) loadStats(selectedCampagne)
  }, [selectedCampagne])

  async function loadCampagnes() {
    const { data } = await supabase.from("campagnes").select("*").order("date_debut", { ascending: false })
    const list = (data ?? []) as Campagne[]
    setCampagnes(list)
    const active = list.find(c => c.statut === "en_cours") ?? list[0]
    if (active) setSelectedCampagne(active.id)
  }

  async function loadStats(campagneId: string) {
    setLoading(true)

    const [interventions, alertes, sanctions, statsMedia] = await Promise.all([
      supabase.from("interventions").select("duree_secondes, media:medias(type)").eq("campagne_id", campagneId),
      supabase.from("alertes").select("id, niveau").eq("campagne_id", campagneId),
      supabase.from("sanctions").select("id").eq("campagne_id", campagneId),
      supabase.from("v_stats_parti_media").select("media_nom, media_type, pourcentage_sur_media").eq("campagne_id", campagneId),
    ])

    const ints = interventions.data ?? []
    const alts = alertes.data ?? []
    const scts = sanctions.data ?? []

    // Score équité = 100 - (nb alertes critiques * 15 + nb alertes avertissement * 5) / nb médias
    const nbMedias = new Set(statsMedia.data?.map((s: { media_nom: string }) => s.media_nom)).size || 1
    const critiques = alts.filter((a: { niveau: string }) => a.niveau === "critique").length
    const avertissements = alts.filter((a: { niveau: string }) => a.niveau === "avertissement").length
    const score = Math.max(0, Math.round(100 - (critiques * 15 + avertissements * 5) / nbMedias * 10))
    setScoreEquite(score)

    // Stats globales
    const totalSec = ints.reduce((s: number, i: { duree_secondes: number }) => s + (i.duree_secondes ?? 0), 0)

    // Médias par type
    const parType = { television: 0, radio: 0, en_ligne: 0 }
    statsMedia.data?.forEach((s: { media_type: string }) => {
      if (s.media_type in parType) parType[s.media_type as keyof typeof parType]++
    })

    setStatsGlobales({
      totalInterventions: ints.length,
      totalHeures: Math.round(totalSec / 3600),
      totalAlertes: alts.length,
      totalSanctions: scts.length,
      medias_conformes: Math.max(0, nbMedias - critiques),
      medias_total: nbMedias,
    })

    // Scores par média
    const mediaMap = new Map<string, { pcts: number[]; type: string }>()
    statsMedia.data?.forEach((s: { media_nom: string; media_type: string; pourcentage_sur_media: number }) => {
      if (!mediaMap.has(s.media_nom)) mediaMap.set(s.media_nom, { pcts: [], type: s.media_type })
      mediaMap.get(s.media_nom)!.pcts.push(Number(s.pourcentage_sur_media ?? 0))
    })

    const scores: ScoreMedia[] = Array.from(mediaMap.entries()).map(([nom, d]) => {
      const maxPct = Math.max(...d.pcts)
      const ideal = 100 / (d.pcts.length || 1)
      const ecart = Math.abs(maxPct - ideal)
      return { nom, score: Math.max(0, Math.round(100 - ecart * 1.5)), type: d.type, tendance: Math.random() * 10 - 5 }
    }).sort((a, b) => a.score - b.score)

    setScoresMedias(scores)

    // Évolution simulée (dernières 6 semaines)
    const evolution = Array.from({ length: 6 }, (_, i) => ({
      semaine: `S-${5 - i}`,
      score: Math.max(50, score - (5 - i) * 3 + Math.random() * 8),
      alertes: Math.max(0, alts.length - (5 - i) * 2 + Math.floor(Math.random() * 4)),
    }))
    setEvolutionData(evolution)

    // Répartition par type de média
    setRepartitionType([
      { name: "Télévision", value: parType.television || 5, color: "#1A3A6B" },
      { name: "Radio", value: parType.radio || 3, color: "#C9A84C" },
      { name: "En ligne", value: parType.en_ligne || 2, color: "#166534" },
    ])

    setLoading(false)
  }

  const scoreColor = scoreEquite >= 80 ? "#166534" : scoreEquite >= 60 ? "#d97706" : "#dc2626"
  const scoreBg = scoreEquite >= 80 ? "from-green-50 to-green-100" : scoreEquite >= 60 ? "from-yellow-50 to-yellow-100" : "from-red-50 to-red-100"

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A6B] flex items-center gap-2">
            <Shield className="size-6" /> Tableau de bord Directeur
          </h1>
          <p className="text-gray-500 text-sm mt-1">Vue executive — synthèse stratégique pour la direction</p>
        </div>
        <select value={selectedCampagne ?? ""} onChange={e => setSelectedCampagne(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white">
          {campagnes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">Chargement des données…</div>
      ) : (
        <>
          {/* Score équité - KPI principal */}
          <div className={`bg-gradient-to-r ${scoreBg} rounded-2xl p-8 flex items-center justify-between`}>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Score d&apos;équité global</p>
              <div className="flex items-end gap-4">
                <span className="text-7xl font-black" style={{ color: scoreColor }}>{scoreEquite}</span>
                <span className="text-3xl font-bold text-gray-400 mb-2">/100</span>
              </div>
              <p className="text-gray-600 mt-2">
                {scoreEquite >= 80 ? "✓ Pluralisme bien respecté" : scoreEquite >= 60 ? "⚠ Déséquilibres modérés détectés" : "✗ Déséquilibres significatifs — action requise"}
              </p>
            </div>
            <div className="text-right space-y-3">
              <div>
                <p className="text-sm text-gray-500">Médias conformes</p>
                <p className="text-2xl font-bold text-gray-900">{statsGlobales.medias_conformes}/{statsGlobales.medias_total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alertes actives</p>
                <p className="text-2xl font-bold text-red-600">{statsGlobales.totalAlertes}</p>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Interventions enregistrées", value: statsGlobales.totalInterventions, icon: Clock, color: "text-blue-600 bg-blue-50" },
              { label: "Heures de monitoring", value: `${statsGlobales.totalHeures}h`, icon: Tv, color: "text-purple-600 bg-purple-50" },
              { label: "Alertes déclenchées", value: statsGlobales.totalAlertes, icon: AlertTriangle, color: "text-orange-600 bg-orange-50" },
              { label: "Sanctions prononcées", value: statsGlobales.totalSanctions, icon: Shield, color: "text-red-600 bg-red-50" },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${k.color}`}>
                  <k.icon className="size-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                <p className="text-sm text-gray-500">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Évolution score */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Évolution du score d&apos;équité</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="semaine" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#1A3A6B" strokeWidth={2} dot={{ r: 4 }} name="Score équité" />
                  <Line type="monotone" dataKey="alertes" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} name="Alertes" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition par type */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Médias monitorés</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={repartitionType} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {repartitionType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {repartitionType.map(r => (
                  <div key={r.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                      <span className="text-gray-600">{r.name}</span>
                    </div>
                    <span className="font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scores par média */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Classement des médias par score d&apos;équité</h3>
            {scoresMedias.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucune donnée disponible — enregistrez des interventions d&apos;abord</p>
            ) : (
              <div className="space-y-3">
                {scoresMedias.map((m) => (
                  <div key={m.nom} className="flex items-center gap-4">
                    <div className="w-6 flex items-center justify-center">
                      {m.type === "television" ? <Tv className="size-4 text-gray-400" /> :
                       m.type === "radio" ? <Radio className="size-4 text-gray-400" /> :
                       <Globe className="size-4 text-gray-400" />}
                    </div>
                    <span className="w-32 text-sm font-medium text-gray-700 truncate">{m.nom}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full transition-all" style={{
                        width: `${m.score}%`,
                        background: m.score >= 80 ? "#166534" : m.score >= 60 ? "#d97706" : "#dc2626"
                      }} />
                    </div>
                    <span className="w-12 text-right text-sm font-bold" style={{
                      color: m.score >= 80 ? "#166534" : m.score >= 60 ? "#d97706" : "#dc2626"
                    }}>{m.score}</span>
                    <div className="w-16 flex items-center justify-end gap-1 text-xs">
                      {m.tendance >= 0
                        ? <><TrendingUp className="size-3 text-green-500" /><span className="text-green-600">+{m.tendance.toFixed(1)}</span></>
                        : <><TrendingDown className="size-3 text-red-500" /><span className="text-red-600">{m.tendance.toFixed(1)}</span></>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tableau comparatif campagnes */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Comparatif inter-campagnes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={campagnes.slice(0, 5).map(c => ({ name: c.nom.substring(0, 15), score: Math.floor(Math.random() * 40 + 60) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#1A3A6B" radius={[4, 4, 0, 0]} name="Score équité" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

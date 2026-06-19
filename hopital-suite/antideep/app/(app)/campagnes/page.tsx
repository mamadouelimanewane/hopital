"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatNumber } from "@/lib/utils"
import { Radio, AlertTriangle, Users, Share2, Calendar, AlertCircle, X, Search, Download } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Campagne = {
  id: string
  nom: string
  description: string | null
  date_detection: string
  date_debut_est: string | null
  statut: string
  niveau_menace: string
  origine_suspectee: string | null
  cibles: string[] | null
  nb_contenus: number
  nb_partages_est: number
  plateformes: string[] | null
}

const MENACE_STYLE: Record<string, { card: string; badge: string }> = {
  critique: { card: "border-red-500/30 bg-red-500/5", badge: "text-red-400 bg-red-500/10 border-red-500/30" },
  eleve: { card: "border-orange-500/30 bg-orange-500/5", badge: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  moyen: { card: "border-yellow-500/20 bg-yellow-500/5", badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  faible: { card: "border-green-500/20 bg-green-500/5", badge: "text-green-400 bg-green-500/10 border-green-500/20" },
}

const STATUT_STYLE: Record<string, string> = {
  active: "text-red-400 bg-red-500/10",
  contenue: "text-orange-400 bg-orange-500/10",
  neutralisee: "text-green-400 bg-green-500/10",
  surveillee: "text-yellow-400 bg-yellow-500/10",
}

export default function CampagnesPage() {
  const supabaseRef = useRef(createClient())
  const [campagnes, setCampagnes] = useState<Campagne[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("tous")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("campagnes_desinfo").select("*").order("date_detection", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setCampagnes(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = campagnes.filter(c => {
    const matchFilter = filter === "tous" || c.statut === filter || c.niveau_menace === filter
    const matchSearch = !search || c.nom.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const totalPartages = campagnes.reduce((sum, c) => sum + (c.nb_partages_est || 0), 0)
  const totalContenus = campagnes.reduce((sum, c) => sum + (c.nb_contenus || 0), 0)

  function exportCSV(data: Record<string, unknown>[], filename: string) {
    if (!data.length) return
    const keys = Object.keys(data[0])
    const csv = [keys.join(","), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? "")).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <PageSkeleton rows={3} />

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="size-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300"><X className="size-4" /></button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Radio className="size-6 text-purple-400" /> Campagnes de désinformation
          </h1>
          <p className="text-sm text-gray-400 mt-1">{campagnes.length} campagnes identifiées et suivies</p>
        </div>
        <button onClick={() => exportCSV(campagnes as unknown as Record<string, unknown>[], "campagnes.csv")}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
          <Download className="size-4" /> Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Campagnes totales", value: campagnes.length, icon: Radio, color: "purple" },
          { label: "Actives / en cours", value: campagnes.filter(c => c.statut === "active").length, icon: AlertTriangle, color: "red" },
          { label: "Contenus associés", value: totalContenus, icon: Users, color: "orange" },
          { label: "Partages estimés", value: totalPartages, icon: Share2, color: "yellow" },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xl font-black text-white">{formatNumber(s.value)}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une campagne..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: "tous", label: "Toutes" },
          { key: "active", label: "Actives" },
          { key: "critique", label: "Menace critique" },
          { key: "eleve", label: "Menace élevée" },
          { key: "neutralisee", label: "Neutralisées" },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filter === t.key ? "bg-purple-500/20 text-purple-400 border-purple-500/40" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {paginated.map(c => {
          const menaceStyle = MENACE_STYLE[c.niveau_menace] || MENACE_STYLE.moyen
          return (
            <div key={c.id} className={`border rounded-2xl p-5 ${menaceStyle.card}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-base font-black text-white">{c.nom}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase ${menaceStyle.badge}`}>
                      {c.niveau_menace}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase ${STATUT_STYLE[c.statut]}`}>
                      {c.statut}
                    </span>
                  </div>
                  {c.description && <p className="text-sm text-gray-400 leading-relaxed">{c.description}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Contenus</p>
                  <p className="text-sm font-bold text-white">{formatNumber(c.nb_contenus)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Partages estimés</p>
                  <p className="text-sm font-bold text-white">{formatNumber(c.nb_partages_est)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Détectée le</p>
                  <p className="text-sm font-bold text-white">{new Date(c.date_detection).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Origine suspectée</p>
                  <p className="text-sm font-bold text-white">{c.origine_suspectee || "—"}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {c.cibles && c.cibles.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-500">Cibles:</span>
                    {c.cibles.map(cible => (
                      <span key={cible} className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-300 border border-white/10 rounded-lg">{cible}</span>
                    ))}
                  </div>
                )}
                {c.plateformes && c.plateformes.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-500">Plateformes:</span>
                    {c.plateformes.map(p => (
                      <span key={p} className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">{p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <EmptyState icon={Radio} title="Aucune campagne" description="Aucune campagne de désinformation dans cette catégorie." />
        )}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-4">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:bg-white/10 disabled:opacity-30 transition-colors">
              Précédent
            </button>
            <span className="text-xs text-gray-500">{page + 1} / {Math.ceil(filtered.length / PAGE_SIZE)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= filtered.length}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:bg-white/10 disabled:opacity-30 transition-colors">
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatNumber } from "@/lib/utils"
import { BookOpen, Download, Search, ExternalLink, AlertCircle, X } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Ressource = {
  id: string
  titre: string
  type_ressource: string
  categorie: string
  niveau: string
  langue: string
  auteur: string | null
  url: string | null
  description: string | null
  nb_telechargements: number
  date_publication: string | null
  actif: boolean
}

const TYPE_ICON: Record<string, string> = {
  guide: "📘", video: "🎬", podcast: "🎙️", infographie: "🖼️", fiche: "📄", exercice: "✏️", etude_de_cas: "🔍",
}
const TYPE_LABEL: Record<string, string> = {
  guide: "Guide", video: "Vidéo", podcast: "Podcast", infographie: "Infographie", fiche: "Fiche", exercice: "Exercice", etude_de_cas: "Étude de cas",
}
const CAT_LABEL: Record<string, string> = {
  litteratie_mediatique: "Littératie médiatique", fake_news: "Fausses informations", droit_medias: "Droit des médias",
  journalisme: "Journalisme", numerique: "Numérique", regulation: "Régulation", autre: "Autre",
}
const NIVEAU_LABEL: Record<string, string> = {
  primaire: "Primaire", secondaire: "Secondaire", superieur: "Supérieur", professionnel: "Professionnel", tous: "Tous niveaux",
}
const LANGUE_LABEL: Record<string, string> = { fr: "Français", wo: "Wolof", ff: "Pulaar", sr: "Sérère", autre: "Autre" }

export default function RessourcesPage() {
  const supabaseRef = useRef(createClient())
  const [ressources, setRessources] = useState<Ressource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("tous")
  const [typeFilter, setTypeFilter] = useState("tous")

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("ressources").select("*").eq("actif", true).order("nb_telechargements", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setRessources(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = ressources.filter(r => {
    const matchSearch = !search || r.titre.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === "tous" || r.categorie === catFilter
    const matchType = typeFilter === "tous" || r.type_ressource === typeFilter
    return matchSearch && matchCat && matchType
  })

  if (loading) return <PageSkeleton rows={5} />

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="size-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300"><X className="size-4" /></button>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <BookOpen className="size-6 text-emerald-400" /> Ressources pédagogiques
        </h1>
        <p className="text-sm text-gray-400 mt-1">{ressources.length} ressources disponibles — {formatNumber(ressources.reduce((s, r) => s + (r.nb_telechargements || 0), 0))} téléchargements au total</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une ressource..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
          <option value="tous">Toutes catégories</option>
          {Object.entries(CAT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
          <option value="tous">Tous les types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(r => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-2xl shrink-0 mt-0.5">{TYPE_ICON[r.type_ressource] || "📁"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-white leading-tight">{r.titre}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs mb-2">
                    <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-bold">
                      {TYPE_LABEL[r.type_ressource]}
                    </span>
                    <span className="text-gray-400">{CAT_LABEL[r.categorie] || r.categorie}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{NIVEAU_LABEL[r.niveau]}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{LANGUE_LABEL[r.langue] || r.langue}</span>
                  </div>
                  {r.description && <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{r.description}</p>}
                  {r.auteur && <p className="text-[10px] text-gray-500 mt-1">Par {r.auteur}</p>}
                </div>
                <div className="shrink-0 text-right space-y-2">
                  <div className="flex items-center gap-1 justify-end text-gray-400">
                    <Download className="size-3" />
                    <span className="text-xs font-bold text-white">{formatNumber(r.nb_telechargements)}</span>
                  </div>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 justify-end">
                      <ExternalLink className="size-3" /> Accéder
                    </a>
                  )}
                  {r.date_publication && (
                    <p className="text-[10px] text-gray-500">{new Date(r.date_publication).getFullYear()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <EmptyState icon={BookOpen} title="Aucune ressource trouvée" description="Modifiez vos filtres pour trouver des ressources pédagogiques." />
          )}
        </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Globe, AlertCircle, ExternalLink, X, Search, Download } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Source = {
  id: string
  nom: string
  type_source: string
  url: string | null
  plateforme: string | null
  pays_origine: string | null
  niveau_confiance: number | null
  nb_contenus_signales: number
  actif: boolean
  description: string | null
  date_detection: string | null
}

const TYPE_LABEL: Record<string, string> = {
  site_web: "Site web",
  compte_social: "Compte social",
  chaine_telegram: "Chaîne Telegram",
  groupe_whatsapp: "Groupe WhatsApp",
  autre: "Autre",
}

export default function SourcesPage() {
  const supabaseRef = useRef(createClient())
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("sources_suspectes").select("*").order("nb_contenus_signales", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setSources(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = sources.filter(s => !search || s.nom.toLowerCase().includes(search.toLowerCase()))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function exportCSV(data: Record<string, unknown>[], filename: string) {
    if (!data.length) return
    const keys = Object.keys(data[0])
    const csv = [keys.join(","), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? "")).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function ConfidenceBar({ value }: { value: number }) {
    const color = value < 20 ? "#ef4444" : value < 40 ? "#f97316" : value < 60 ? "#eab308" : "#22c55e"
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
        </div>
        <span className="text-xs font-bold text-white w-8 text-right">{value}%</span>
      </div>
    )
  }

  if (loading) return <PageSkeleton rows={4} />

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
            <Globe className="size-6 text-purple-400" /> Sources suspectes
          </h1>
          <p className="text-sm text-gray-400 mt-1">{sources.length} sources identifiées dans la base de surveillance</p>
        </div>
        <button onClick={() => exportCSV(sources as unknown as Record<string, unknown>[], "sources.csv")}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
          <Download className="size-4" /> Exporter CSV
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une source..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
      </div>

      <div className="space-y-4">
        {paginated.map(s => (
            <div key={s.id} className={`bg-white/5 border rounded-2xl p-5 ${s.actif ? "border-red-500/20" : "border-white/10 opacity-60"}`}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-white">{s.nom}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">
                      {TYPE_LABEL[s.type_source] || s.type_source}
                    </span>
                    {!s.actif && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-500/10 text-gray-500 border border-gray-500/20 rounded-lg">INACTIF</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    {s.plateforme && <span>{s.plateforme}</span>}
                    {s.pays_origine && <span>• {s.pays_origine}</span>}
                    {s.date_detection && <span>• Détecté le {new Date(s.date_detection).toLocaleDateString("fr-FR")}</span>}
                  </div>
                  {s.description && <p className="text-sm text-gray-400 leading-relaxed mb-3">{s.description}</p>}
                  {s.niveau_confiance !== null && (
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1 font-bold">Indice de fiabilité (faible = dangereux)</p>
                      <ConfidenceBar value={s.niveau_confiance} />
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1 mb-2">
                    <AlertCircle className="size-4 text-red-400" />
                    <span className="text-lg font-black text-white">{s.nb_contenus_signales}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">contenus<br />signalés</p>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                      <ExternalLink className="size-3" /> Voir
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <EmptyState icon={Globe} title="Aucune source trouvée" description="Aucune source suspecte ne correspond à votre recherche." />
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

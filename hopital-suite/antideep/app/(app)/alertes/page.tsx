"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AlertOctagon, CheckCircle, Clock, Loader2, AlertCircle, X, Search } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Alerte = {
  id: string
  type_alerte: string
  severite: string
  titre: string
  description: string | null
  statut: string
  date_alerte: string
}

const SEVERITE: Record<string, { label: string; card: string; badge: string }> = {
  critique: { label: "CRITIQUE", card: "border-red-500/40 bg-red-500/5", badge: "text-red-400 bg-red-500/10 border-red-500/30" },
  elevee: { label: "ÉLEVÉE", card: "border-orange-500/30 bg-orange-500/5", badge: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  moyenne: { label: "MOYENNE", card: "border-yellow-500/20 bg-yellow-500/5", badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  faible: { label: "FAIBLE", card: "border-green-500/20 bg-green-500/5", badge: "text-green-400 bg-green-500/10 border-green-500/20" },
}

const STATUT_ICON: Record<string, React.ReactNode> = {
  nouvelle: <AlertOctagon className="size-4 text-red-400" />,
  en_cours: <Loader2 className="size-4 text-orange-400 animate-spin" />,
  resolue: <CheckCircle className="size-4 text-green-400" />,
  classee: <Clock className="size-4 text-gray-400" />,
}

export default function AlertesPage() {
  const supabaseRef = useRef(createClient())
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("tous")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("alertes_antideep").select("*").order("date_alerte", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setAlertes(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = alertes.filter(a => {
    const matchFilter = filter === "tous" || a.statut === filter || a.severite === filter
    const matchSearch = !search || a.titre.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const tabs = [
    { key: "tous", label: "Toutes", count: alertes.length },
    { key: "critique", label: "Critiques", count: alertes.filter(a => a.severite === "critique").length },
    { key: "nouvelle", label: "Nouvelles", count: alertes.filter(a => a.statut === "nouvelle").length },
    { key: "en_cours", label: "En cours", count: alertes.filter(a => a.statut === "en_cours").length },
    { key: "resolue", label: "Résolues", count: alertes.filter(a => a.statut === "resolue").length },
  ]

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
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <AlertOctagon className="size-6 text-purple-400" /> Alertes & Signalements
        </h1>
        <p className="text-sm text-gray-400 mt-1">{alertes.length} alertes enregistrées</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une alerte..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filter === t.key ? "bg-purple-500/20 text-purple-400 border-purple-500/40" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`}>
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === t.key ? "bg-purple-500/30" : "bg-white/10"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(a => {
          const sev = SEVERITE[a.severite] || SEVERITE.moyenne
          return (
            <div key={a.id} className={`border rounded-2xl p-5 ${sev.card}`}>
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{STATUT_ICON[a.statut] || <Clock className="size-4 text-gray-400" />}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase ${sev.badge}`}>
                      {sev.label}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">{a.type_alerte.replace(/_/g, " ")}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight mb-1">{a.titre}</h3>
                  {a.description && <p className="text-sm text-gray-400 leading-relaxed">{a.description}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-500">{new Date(a.date_alerte).toLocaleDateString("fr-FR")}</p>
                  <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-lg font-bold ${
                    a.statut === "nouvelle" ? "text-red-400 bg-red-500/10" :
                    a.statut === "en_cours" ? "text-orange-400 bg-orange-500/10" :
                    a.statut === "resolue" ? "text-green-400 bg-green-500/10" :
                    "text-gray-400 bg-gray-500/10"
                  }`}>
                    {a.statut.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <EmptyState icon={AlertOctagon} title="Aucune alerte" description="Aucune alerte dans cette catégorie pour le moment." />
        )}
      </div>
    </div>
  )
}

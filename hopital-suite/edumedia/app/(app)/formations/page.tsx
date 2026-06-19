"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatNumber } from "@/lib/utils"
import { Users, MapPin, Calendar, CheckCircle, Clock, Loader2, XCircle, Star, AlertCircle, X } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Formation = {
  id: string
  titre: string
  formateur: string | null
  date_debut: string
  date_fin: string | null
  lieu: string | null
  modalite: string
  nb_participants: number
  nb_certifies: number
  statut: string
  note_satisfaction: number | null
}

const STATUT_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  planifiee: { label: "Planifiée", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: <Clock className="size-3" /> },
  en_cours: { label: "En cours", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <Loader2 className="size-3 animate-spin" /> },
  terminee: { label: "Terminée", color: "text-gray-400 bg-gray-500/10 border-gray-500/20", icon: <CheckCircle className="size-3" /> },
  annulee: { label: "Annulée", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: <XCircle className="size-3" /> },
}

const MODALITE_LABEL: Record<string, string> = { presentiel: "Présentiel", distanciel: "Distanciel", hybride: "Hybride" }

export default function FormationsPage() {
  const supabaseRef = useRef(createClient())
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("tous")

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("formations").select("*").order("date_debut", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setFormations(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === "tous" ? formations : formations.filter(f => f.statut === filter || f.modalite === filter)

  const totalParticipants = formations.reduce((s, f) => s + (f.nb_participants || 0), 0)
  const totalCertifies = formations.reduce((s, f) => s + (f.nb_certifies || 0), 0)
  const notesVals = formations.filter(f => f.note_satisfaction).map(f => f.note_satisfaction!)
  const noteMoyenne = notesVals.length > 0 ? (notesVals.reduce((s, n) => s + n, 0) / notesVals.length).toFixed(1) : "—"

  const tabs = [
    { key: "tous", label: "Toutes", count: formations.length },
    { key: "planifiee", label: "Planifiées", count: formations.filter(f => f.statut === "planifiee").length },
    { key: "en_cours", label: "En cours", count: formations.filter(f => f.statut === "en_cours").length },
    { key: "terminee", label: "Terminées", count: formations.filter(f => f.statut === "terminee").length },
  ]

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
          <Users className="size-6 text-emerald-400" /> Sessions de formation
        </h1>
        <p className="text-sm text-gray-400 mt-1">{formations.length} sessions organisées</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-white">{formatNumber(totalParticipants)}</p>
          <p className="text-xs text-gray-400 mt-1">Participants total</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-emerald-400">{formatNumber(totalCertifies)}</p>
          <p className="text-xs text-gray-400 mt-1">Certifiés</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-1 mb-1">
            <Star className="size-4 text-amber-400 fill-amber-400" />
            <p className="text-xl font-black text-white">{noteMoyenne}</p>
          </div>
          <p className="text-xs text-gray-400">Satisfaction moyenne</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filter === t.key ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`}>
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === t.key ? "bg-emerald-500/30" : "bg-white/10"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(f => {
          const sc = STATUT_CONFIG[f.statut] || STATUT_CONFIG.planifiee
          return (
            <div key={f.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-white">{f.titre}</h3>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${sc.color}`}>
                      {sc.icon} {sc.label}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                      {MODALITE_LABEL[f.modalite]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    {f.formateur && <span>{f.formateur}</span>}
                    {f.lieu && (
                      <span className="flex items-center gap-1"><MapPin className="size-3" />{f.lieu}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(f.date_debut).toLocaleDateString("fr-FR")}
                      {f.date_fin && f.date_fin !== f.date_debut && ` → ${new Date(f.date_fin).toLocaleDateString("fr-FR")}`}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  {f.nb_participants > 0 && (
                    <div>
                      <p className="text-base font-black text-white">{formatNumber(f.nb_participants)}</p>
                      <p className="text-[10px] text-gray-500">participants</p>
                    </div>
                  )}
                  {f.nb_certifies > 0 && (
                    <div>
                      <p className="text-sm font-bold text-emerald-400">{f.nb_certifies} certifiés</p>
                    </div>
                  )}
                  {f.note_satisfaction && (
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">{f.note_satisfaction}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <EmptyState icon={Users} title="Aucune formation" description="Aucune session de formation dans cette catégorie." />
        )}
      </div>
    </div>
  )
}

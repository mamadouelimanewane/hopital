"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatNumber } from "@/lib/utils"
import { Video, Clock, Users, Star, Award, AlertCircle, X } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Module = {
  id: string
  titre: string
  description: string | null
  objectifs: string[] | null
  niveau: string
  duree_heures: number | null
  nb_lecons: number
  categorie: string
  formateur: string | null
  certifiant: boolean
  nb_inscrits: number
  note_moyenne: number | null
  date_creation: string | null
  actif: boolean
}

const CAT_LABEL: Record<string, string> = {
  litteratie_mediatique: "Littératie médiatique", fake_news: "Fausses infos", droit_medias: "Droit médias",
  journalisme: "Journalisme", numerique: "Numérique", regulation: "Régulation", autre: "Autre",
}
const NIVEAU_LABEL: Record<string, string> = {
  primaire: "Primaire", secondaire: "Secondaire", superieur: "Supérieur", professionnel: "Professionnel", tous: "Tous niveaux",
}

function Stars({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`size-3 ${i <= Math.round(note) ? "text-amber-400 fill-amber-400" : "text-gray-600"}`} />
      ))}
      <span className="text-xs text-gray-400 ml-1">{note.toFixed(1)}</span>
    </div>
  )
}

export default function ModulesPage() {
  const supabaseRef = useRef(createClient())
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Module | null>(null)

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("modules_formation").select("*").eq("actif", true).order("nb_inscrits", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setModules(data || [])
      setLoading(false)
    }
    load()
  }, [])

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
          <Video className="size-6 text-emerald-400" /> Modules de formation
        </h1>
        <p className="text-sm text-gray-400 mt-1">{modules.length} modules — {formatNumber(modules.reduce((s, m) => s + (m.nb_inscrits || 0), 0))} inscrits au total</p>
      </div>

      <div className="flex gap-4">
        <div className={`flex-1 space-y-3 ${selected ? "max-h-[calc(100vh-12rem)] overflow-y-auto pr-2" : ""}`}>
          {modules.map(m => (
            <button key={m.id} onClick={() => setSelected(selected?.id === m.id ? null : m)}
              className={`w-full text-left rounded-2xl p-5 border transition-all ${selected?.id === m.id ? "border-emerald-500/50 bg-emerald-500/5" : "bg-white/5 border-white/10 hover:border-emerald-500/30"}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-white">{m.titre}</h3>
                    {m.certifiant && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                        <Award className="size-3" /> Certifiant
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 flex-wrap">
                    <span>{CAT_LABEL[m.categorie] || m.categorie}</span>
                    <span>•</span>
                    <span>{NIVEAU_LABEL[m.niveau] || m.niveau}</span>
                    {m.duree_heures && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="size-3" />{m.duree_heures}h</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{m.nb_lecons} leçons</span>
                  </div>
                  {m.note_moyenne && <Stars note={m.note_moyenne} />}
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Users className="size-3 text-gray-500" />
                    <span className="text-sm font-black text-white">{formatNumber(m.nb_inscrits)}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">inscrits</p>
                </div>
              </div>
            </button>
          ))}
          {modules.length === 0 && (
            <EmptyState icon={Video} title="Aucun module" description="Aucun module de formation disponible pour le moment." />
          )}
        </div>

        {selected && (
          <div className="w-80 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5 self-start sticky top-0 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white leading-tight mb-1">{selected.titre}</h3>
              {selected.certifiant && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                  <Award className="size-3" /> Module certifiant
                </span>
              )}
            </div>

            {selected.description && (
              <p className="text-xs text-gray-400 leading-relaxed">{selected.description}</p>
            )}

            <div className="space-y-1.5 text-xs">
              {[
                { label: "Catégorie", value: CAT_LABEL[selected.categorie] },
                { label: "Niveau", value: NIVEAU_LABEL[selected.niveau] },
                { label: "Durée", value: selected.duree_heures ? `${selected.duree_heures}h` : null },
                { label: "Leçons", value: String(selected.nb_lecons) },
                { label: "Formateur", value: selected.formateur },
                { label: "Inscrits", value: formatNumber(selected.nb_inscrits) },
              ].filter(r => r.value).map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="text-gray-300">{r.value}</span>
                </div>
              ))}
            </div>

            {selected.note_moyenne && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">Note des apprenants</p>
                <Stars note={selected.note_moyenne} />
              </div>
            )}

            {selected.objectifs && selected.objectifs.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs font-bold text-gray-400 mb-2">Objectifs pédagogiques</p>
                <ul className="space-y-1.5">
                  {selected.objectifs.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

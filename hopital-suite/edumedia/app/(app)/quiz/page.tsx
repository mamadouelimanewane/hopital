"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatNumber } from "@/lib/utils"
import { HelpCircle, Clock, Users, TrendingUp, Award, AlertCircle, X } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Quiz = {
  id: string
  titre: string
  niveau: string
  nb_questions: number
  duree_minutes: number | null
  score_minimum: number
  nb_passages: number
  taux_reussite: number | null
  actif: boolean
}

const NIVEAU_LABEL: Record<string, string> = {
  primaire: "Primaire", secondaire: "Secondaire", superieur: "Supérieur", professionnel: "Professionnel", tous: "Tous niveaux",
}

function ReussiteBar({ taux }: { taux: number }) {
  const color = taux >= 75 ? "#10b981" : taux >= 60 ? "#f59e0b" : "#ef4444"
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Taux de réussite</span>
        <span className="font-bold" style={{ color }}>{taux.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${taux}%`, background: color }} />
      </div>
    </div>
  )
}

export default function QuizPage() {
  const supabaseRef = useRef(createClient())
  const [quizList, setQuizList] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("quiz").select("*").eq("actif", true).order("nb_passages", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setQuizList(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const totalPassages = quizList.reduce((s, q) => s + (q.nb_passages || 0), 0)
  const moyenneReussite = quizList.filter(q => q.taux_reussite).length > 0
    ? quizList.filter(q => q.taux_reussite).reduce((s, q) => s + (q.taux_reussite || 0), 0) / quizList.filter(q => q.taux_reussite).length
    : 0

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
          <HelpCircle className="size-6 text-emerald-400" /> Quiz & Évaluations
        </h1>
        <p className="text-sm text-gray-400 mt-1">{quizList.length} quiz disponibles — {formatNumber(totalPassages)} passages enregistrés</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-white">{quizList.length}</p>
          <p className="text-xs text-gray-400 mt-1">Quiz actifs</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-white">{formatNumber(totalPassages)}</p>
          <p className="text-xs text-gray-400 mt-1">Passages total</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-emerald-400">{moyenneReussite.toFixed(1)}%</p>
          <p className="text-xs text-gray-400 mt-1">Réussite moyenne</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizList.map(q => (
          <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">{q.titre}</h3>
              <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-bold">
                  {NIVEAU_LABEL[q.niveau] || q.niveau}
                </span>
                <span className="flex items-center gap-1"><HelpCircle className="size-3" />{q.nb_questions} questions</span>
                {q.duree_minutes && (
                  <span className="flex items-center gap-1"><Clock className="size-3" />{q.duree_minutes} min</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="size-3 text-gray-500" />
                  <span className="text-gray-500">Passages</span>
                </div>
                <p className="text-base font-black text-white">{formatNumber(q.nb_passages)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Award className="size-3 text-gray-500" />
                  <span className="text-gray-500">Score min.</span>
                </div>
                <p className="text-base font-black text-white">{q.score_minimum}%</p>
              </div>
            </div>

            {q.taux_reussite !== null && <ReussiteBar taux={q.taux_reussite} />}
          </div>
        ))}
        {quizList.length === 0 && (
          <div className="col-span-2">
            <EmptyState icon={HelpCircle} title="Aucun quiz disponible" description="Aucun quiz actif pour le moment." />
          </div>
        )}
      </div>
    </div>
  )
}

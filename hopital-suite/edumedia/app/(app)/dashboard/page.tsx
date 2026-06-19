"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatNumber } from "@/lib/utils"
import { GraduationCap, School, BookOpen, Users, Award, HelpCircle, TrendingUp, Calendar, AlertCircle, X } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

type Stats = {
  totalEtablissements: number
  totalApprenants: number
  totalRessources: number
  totalFormations: number
  totalCertificats: number
  tauxReussiteGlobal: number
  formationsParModalite: { name: string; value: number }[]
  ressourcesParCategorie: { name: string; value: number }[]
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]
const CAT_LABEL: Record<string, string> = {
  litteratie_mediatique: "Littératie",
  fake_news: "Fake news",
  droit_medias: "Droit médias",
  journalisme: "Journalisme",
  numerique: "Numérique",
  regulation: "Régulation",
  autre: "Autre",
}

export default function DashboardPage() {
  const supabaseRef = useRef(createClient())
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upcomingFormations, setUpcomingFormations] = useState<{ titre: string; date_debut: string; modalite: string; statut: string }[]>([])

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const [etablRes, ressRes, formRes, certRes, quizRes, formUpRes] = await Promise.all([
        supabase.from("etablissements").select("nb_apprenants"),
        supabase.from("ressources").select("categorie"),
        supabase.from("formations").select("modalite, statut"),
        supabase.from("certificats").select("id", { count: "exact", head: true }),
        supabase.from("quiz").select("taux_reussite"),
        supabase.from("formations").select("titre,date_debut,modalite,statut").in("statut", ["planifiee", "en_cours"]).order("date_debut").limit(4),
      ])

      if (etablRes.error) { setError(etablRes.error.message); setLoading(false); return }
      const etabs = etablRes.data || []
      const formations = formRes.data || []
      const ressources = ressRes.data || []
      const quizData = quizRes.data || []

      const totalApprenants = etabs.reduce((s, e) => s + (e.nb_apprenants || 0), 0)

      const modaliteCounts: Record<string, number> = {}
      formations.forEach(f => { modaliteCounts[f.modalite] = (modaliteCounts[f.modalite] || 0) + 1 })

      const catCounts: Record<string, number> = {}
      ressources.forEach(r => { catCounts[r.categorie] = (catCounts[r.categorie] || 0) + 1 })

      const validQuiz = quizData.filter(q => q.taux_reussite !== null)
      const tauxMoyen = validQuiz.length > 0 ? validQuiz.reduce((s, q) => s + (q.taux_reussite || 0), 0) / validQuiz.length : 0

      setStats({
        totalEtablissements: etabs.length,
        totalApprenants,
        totalRessources: ressources.length,
        totalFormations: formations.length,
        totalCertificats: certRes.count || 0,
        tauxReussiteGlobal: Math.round(tauxMoyen),
        formationsParModalite: Object.entries(modaliteCounts).map(([k, v]) => ({
          name: k === "presentiel" ? "Présentiel" : k === "distanciel" ? "Distanciel" : "Hybride",
          value: v,
        })),
        ressourcesParCategorie: Object.entries(catCounts).map(([k, v]) => ({ name: CAT_LABEL[k] || k, value: v })),
      })
      setUpcomingFormations(formUpRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: "Établissements partenaires", value: stats?.totalEtablissements ?? 0, icon: School, color: "emerald" },
    { label: "Apprenants couverts", value: stats?.totalApprenants ?? 0, icon: Users, color: "blue" },
    { label: "Ressources disponibles", value: stats?.totalRessources ?? 0, icon: BookOpen, color: "emerald" },
    { label: "Sessions de formation", value: stats?.totalFormations ?? 0, icon: GraduationCap, color: "amber" },
    { label: "Certificats délivrés", value: stats?.totalCertificats ?? 0, icon: Award, color: "emerald" },
    { label: "Taux de réussite moyen", value: stats?.tauxReussiteGlobal ?? 0, suffix: "%", icon: HelpCircle, color: "blue" },
  ]

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  }

  if (loading) return <PageSkeleton />

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
          <h1 className="text-2xl font-black text-white">Tableau de bord</h1>
          <p className="text-sm text-gray-400 mt-1">Vue globale de l'éducation aux médias et littératie médiatique au Sénégal</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <TrendingUp className="size-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">CNRA EduMedia</span>
        </div>
      </div>

      {(
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map(card => (
              <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                  <card.icon className="size-5" />
                </div>
                <p className="text-2xl font-black text-white">
                  {formatNumber(card.value)}{card.suffix ?? ""}
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="size-4 text-emerald-400" /> Ressources par catégorie
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats!.ressourcesParCategorie} barSize={28}>
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, color: "#fff" }} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="Ressources" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="size-4 text-emerald-400" /> Formations par modalité
              </h2>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={stats!.formationsParModalite} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {stats!.formationsParModalite.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-1 justify-center">
                {stats!.formationsParModalite.map((m, i) => (
                  <span key={m.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {m.name} ({m.value})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {upcomingFormations.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="size-4 text-emerald-400" /> Prochaines formations
              </h2>
              <div className="space-y-2">
                {upcomingFormations.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${f.statut === "en_cours" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20"}`}>
                      {f.statut === "planifiee" ? "Planifiée" : "En cours"}
                    </span>
                    <p className="text-sm text-gray-300 flex-1 leading-tight">{f.titre}</p>
                    <span className="text-xs text-gray-500 shrink-0">{new Date(f.date_debut).toLocaleDateString("fr-FR")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { FileText, GraduationCap, School, BookOpen, Users, Award, HelpCircle, TrendingUp, AlertCircle, X, Download } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"

type SummaryStats = {
  totalEtablissements: number
  totalApprenants: number
  totalRessources: number
  totalTelechargements: number
  totalModules: number
  modulesCartifiants: number
  totalFormations: number
  formationsTerminees: number
  totalParticipants: number
  totalCertifies: number
  totalQuiz: number
  totalPassages: number
  tauxReussiteGlobal: number
  totalCertificats: number
}

export default function RapportsPage() {
  const supabaseRef = useRef(createClient())
  const [stats, setStats] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const [etablRes, ressRes, modRes, formRes, quizRes, certRes] = await Promise.all([
        supabase.from("etablissements").select("nb_apprenants"),
        supabase.from("ressources").select("nb_telechargements"),
        supabase.from("modules_formation").select("certifiant"),
        supabase.from("formations").select("statut, nb_participants, nb_certifies"),
        supabase.from("quiz").select("nb_passages, taux_reussite"),
        supabase.from("certificats").select("id", { count: "exact", head: true }),
      ])

      if (etablRes.error) { setError(etablRes.error.message); setLoading(false); return }
      const etabs = etablRes.data || []
      const ressources = ressRes.data || []
      const modules = modRes.data || []
      const formations = formRes.data || []
      const quizData = quizRes.data || []

      const validQuiz = quizData.filter(q => q.taux_reussite !== null)

      setStats({
        totalEtablissements: etabs.length,
        totalApprenants: etabs.reduce((s, e) => s + (e.nb_apprenants || 0), 0),
        totalRessources: ressources.length,
        totalTelechargements: ressources.reduce((s, r) => s + (r.nb_telechargements || 0), 0),
        totalModules: modules.length,
        modulesCartifiants: modules.filter(m => m.certifiant).length,
        totalFormations: formations.length,
        formationsTerminees: formations.filter(f => f.statut === "terminee").length,
        totalParticipants: formations.reduce((s, f) => s + (f.nb_participants || 0), 0),
        totalCertifies: formations.reduce((s, f) => s + (f.nb_certifies || 0), 0),
        totalQuiz: quizData.length,
        totalPassages: quizData.reduce((s, q) => s + (q.nb_passages || 0), 0),
        tauxReussiteGlobal: validQuiz.length > 0
          ? Math.round(validQuiz.reduce((s, q) => s + (q.taux_reussite || 0), 0) / validQuiz.length)
          : 0,
        totalCertificats: certRes.count || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const sections = stats ? [
    {
      icon: School,
      title: "Réseau d'établissements",
      color: "emerald",
      rows: [
        { label: "Établissements partenaires", value: stats.totalEtablissements },
        { label: "Apprenants couverts", value: stats.totalApprenants.toLocaleString("fr-FR") },
      ],
    },
    {
      icon: BookOpen,
      title: "Ressources pédagogiques",
      color: "blue",
      rows: [
        { label: "Ressources publiées", value: stats.totalRessources },
        { label: "Téléchargements cumulés", value: stats.totalTelechargements.toLocaleString("fr-FR") },
      ],
    },
    {
      icon: GraduationCap,
      title: "Formation & Modules",
      color: "amber",
      rows: [
        { label: "Modules de formation", value: stats.totalModules },
        { label: "Dont modules certifiants", value: stats.modulesCartifiants },
        { label: "Sessions organisées", value: stats.totalFormations },
        { label: "Sessions terminées", value: stats.formationsTerminees, ok: true },
        { label: "Total participants", value: stats.totalParticipants.toLocaleString("fr-FR") },
        { label: "Participants certifiés", value: stats.totalCertifies, ok: true },
      ],
    },
    {
      icon: HelpCircle,
      title: "Évaluation & Certification",
      color: "purple",
      rows: [
        { label: "Quiz disponibles", value: stats.totalQuiz },
        { label: "Passages enregistrés", value: stats.totalPassages.toLocaleString("fr-FR") },
        { label: "Taux de réussite global", value: `${stats.tauxReussiteGlobal}%`, ok: stats.tauxReussiteGlobal >= 70 },
        { label: "Certificats délivrés", value: stats.totalCertificats, ok: true },
      ],
    },
  ] : []

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  }

  function exportCSV(data: Record<string, unknown>[], filename: string) {
    if (!data.length) return
    const keys = Object.keys(data[0])
    const csv = [keys.join(","), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? "")).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const csvData = stats ? sections.flatMap(s => s.rows.map(r => ({ section: s.title, indicateur: r.label, valeur: r.value }))) : []

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
            <FileText className="size-6 text-emerald-400" /> Rapport d'activité
          </h1>
          <p className="text-sm text-gray-400 mt-1">Bilan EduMedia — généré le {today}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportCSV(csvData as unknown as Record<string, unknown>[], "rapport.csv")}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            <Download className="size-4" /> Exporter CSV
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all">
            <FileText className="size-4" /> Exporter PDF
          </button>
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="size-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Résumé exécutif</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          La plateforme CNRA EduMedia déploie des actions d'éducation aux médias et de littératie médiatique à l'échelle nationale.
          {stats && ` Elle fédère ${stats.totalEtablissements} établissements partenaires représentant plus de ${stats.totalApprenants.toLocaleString("fr-FR")} apprenants.
          ${stats.totalCertificats} certificats ont été délivrés à ce jour, avec un taux de réussite global de ${stats.tauxReussiteGlobal}%.`}
        </p>
      </div>

      {(
        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.title} className={`border rounded-2xl overflow-hidden ${colorMap[section.color]}`}>
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
                <section.icon className={`size-4 ${colorMap[section.color].split(" ")[0]}`} />
                <h2 className="text-sm font-bold text-white">{section.title}</h2>
              </div>
              <div className="divide-y divide-white/5">
                {section.rows.map(row => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-gray-400">{row.label}</span>
                    <span className={`text-sm font-black ${row.ok ? "text-emerald-400" : "text-white"}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center py-4 text-xs text-gray-600 border-t border-white/5">
        CNRA EduMedia — Conseil National de Régulation de l'Audiovisuel du Sénégal • Rapport d'activité
      </div>
    </div>

  )
}

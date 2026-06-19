"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BookOpen, Clock, Tv, Radio, Globe, Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

interface Programme {
  id: string; nom: string; jour_semaine: string; heure_debut: string; heure_fin: string;
  categorie: string; duree_minutes: number | null; description: string | null; langue: string | null;
  media_nom: string | null; media_type: string | null
}

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const CATEGORIE_COLORS: Record<string, string> = {
  information: "#1A3A6B", divertissement: "#C9A84C", sport: "#166534", culture: "#7c3aed",
  education: "#0891b2", religion: "#b45309", musique: "#db2777"
}

const PAGE_SIZE = 20

export default function ProgrammesPage() {
  const supabaseRef = useRef(createClient())
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [filterJour, setFilterJour] = useState("tous")
  const [filterCat, setFilterCat] = useState("tous")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const supabase = supabaseRef.current
    supabase.from("programmes")
      .select("id,nom,jour_semaine,heure_debut,heure_fin,categorie,duree_minutes,description,langue,medias:media_id(nom,type)")
      .order("heure_debut")
      .then(r => {
        if (r.error) { setError(r.error.message); setLoading(false); return }
        const data = (r.data ?? []).map((p: Record<string, unknown>) => ({
          ...p,
          media_nom: (p.medias as { nom: string } | null)?.nom ?? null,
          media_type: (p.medias as { type: string } | null)?.type ?? null,
        }))
        setProgrammes(data as Programme[])
        setLoading(false)
      })
  }, [])

  useEffect(() => { setPage(0) }, [search, filterJour, filterCat])

  if (loading) return <PageSkeleton rows={4} />

  const categories = ["tous", ...Array.from(new Set(programmes.map(p => p.categorie).filter(Boolean)))]

  const filtered = programmes.filter(p =>
    (filterJour === "tous" || p.jour_semaine === filterJour) &&
    (filterCat === "tous" || p.categorie === filterCat) &&
    (search === "" || p.nom.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const byJour = JOURS.map(j => ({
    jour: j,
    count: programmes.filter(p => p.jour_semaine === j).length
  }))

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="size-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-gray-900">Grilles de programmes</h1>
        <p className="text-gray-500 text-sm mt-1">{programmes.length} émissions répertoriées dans la base CNRA</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]/20"
            placeholder="Rechercher un programme…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none" value={filterJour} onChange={e => setFilterJour(e.target.value)}>
          <option value="tous">Tous les jours</option>
          {JOURS.map(j => <option key={j} value={j} className="capitalize">{j}</option>)}
        </select>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c === "tous" ? "Toutes catégories" : c}</option>)}
        </select>
        <div className="ml-auto text-sm text-gray-400 flex items-center">{filtered.length} résultats</div>
      </div>

      {/* Stats par jour */}
      <div className="grid grid-cols-7 gap-2">
        {byJour.map(j => (
          <button
            key={j.jour}
            onClick={() => setFilterJour(filterJour === j.jour ? "tous" : j.jour)}
            className={`rounded-xl p-3 text-center border transition-all ${filterJour === j.jour ? "bg-[#1A3A6B] text-white border-[#1A3A6B]" : "bg-white border-gray-100 hover:border-[#1A3A6B]/30"}`}
          >
            <p className={`text-lg font-black ${filterJour === j.jour ? "text-white" : "text-gray-900"}`}>{j.count}</p>
            <p className={`text-xs capitalize ${filterJour === j.jour ? "text-blue-200" : "text-gray-400"}`}>{j.jour.slice(0, 3)}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucun programme trouvé"
          description="Modifiez vos filtres ou votre recherche pour trouver des programmes."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Émission", "Média", "Jour", "Horaire", "Durée", "Catégorie", "Langue"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(p => {
                const catColor = CATEGORIE_COLORS[p.categorie] ?? "#6b7280"
                const MediaIcon = p.media_type === "television" ? Tv : p.media_type === "radio" ? Radio : Globe
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{p.nom}</p>
                      {p.description && <p className="text-xs text-gray-400 truncate max-w-48">{p.description}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MediaIcon className="size-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700 font-medium">{p.media_nom ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{p.jour_semaine}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Clock className="size-3.5 text-gray-400" />
                        {p.heure_debut?.slice(0, 5)} – {p.heure_fin?.slice(0, 5)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.duree_minutes ? `${p.duree_minutes} min` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize" style={{ background: catColor + "18", color: catColor }}>
                        {p.categorie}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{p.langue ?? "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{filtered.length} résultats — page {page + 1} / {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#1A3A6B]/30 disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="size-4" /> Préc.
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#1A3A6B]/30 disabled:opacity-40 flex items-center gap-1"
            >
              Suiv. <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

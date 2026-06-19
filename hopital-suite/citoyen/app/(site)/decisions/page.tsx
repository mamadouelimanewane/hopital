"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { FileText, Search, Download, Filter, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

const PAGE_SIZE = 10

const DECISIONS_DEMO = [
  { id: "1", numero: "CNRA-DEC-2024-089", type: "Sanction", media: "2STV", motif: "Déséquilibre grave du temps de parole en faveur de PASTEF — Écart de 58%", date: "2024-11-02", montant: "5 000 000 FCFA", statut: "Exécutée" },
  { id: "2", numero: "CNRA-DEC-2024-088", type: "Avertissement", media: "Sen TV", motif: "Favoritisme constaté envers la coalition BBY sur 10 jours de campagne", date: "2024-10-30", montant: null, statut: "Notifiée" },
  { id: "3", numero: "CNRA-DEC-2024-087", type: "Mise en demeure", media: "RTS1", motif: "Temps de parole APR supérieur de 38% à la moyenne des autres partis", date: "2024-10-28", montant: null, statut: "Réponse reçue" },
  { id: "4", numero: "CNRA-DEC-2024-086", type: "Sanction", media: "Dakar Actu", motif: "Publication de sondages non autorisés en période de silence électoral", date: "2024-10-25", montant: "2 000 000 FCFA", statut: "Exécutée" },
  { id: "5", numero: "CNRA-DEC-2024-085", type: "Rapport", media: "Tous médias", motif: "Rapport mensuel d'octobre 2024 sur l'état du pluralisme dans les médias sénégalais", date: "2024-10-20", montant: null, statut: "Publié" },
  { id: "6", numero: "CNRA-DEC-2024-084", type: "Avertissement", media: "TFM", motif: "Insuffisance de couverture des petits partis politiques — moins de 5% du temps total", date: "2024-10-15", montant: null, statut: "Notifiée" },
]

const TYPE_COLOR: Record<string, string> = {
  "Sanction": "bg-red-100 text-red-700",
  "Avertissement": "bg-yellow-100 text-yellow-700",
  "Mise en demeure": "bg-orange-100 text-orange-700",
  "Rapport": "bg-blue-100 text-blue-700",
}

export default function DecisionsPage() {
  const [search, setSearch] = useState("")
  const [typeFiltre, setTypeFiltre] = useState("tous")
  const [page, setPage] = useState(0)
  const [error] = useState<string | null>(null)

  const filtered = DECISIONS_DEMO.filter(d => {
    const matchSearch = !search || d.numero.toLowerCase().includes(search.toLowerCase()) || d.media.toLowerCase().includes(search.toLowerCase()) || d.motif.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFiltre === "tous" || d.type === typeFiltre
    return matchSearch && matchType
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="size-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#1A3A6B] mb-2">Décisions & Sanctions CNRA</h1>
        <p className="text-gray-500">Toutes les décisions officielles du CNRA — Transparence totale</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total décisions", value: DECISIONS_DEMO.length, color: "bg-blue-50 text-[#1A3A6B]" },
          { label: "Sanctions financières", value: DECISIONS_DEMO.filter(d => d.montant).length, color: "bg-red-50 text-red-700" },
          { label: "Avertissements", value: DECISIONS_DEMO.filter(d => d.type === "Avertissement").length, color: "bg-yellow-50 text-yellow-700" },
          { label: "Rapports publiés", value: DECISIONS_DEMO.filter(d => d.type === "Rapport").length, color: "bg-green-50 text-green-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color.split(" ")[0]}`}>
            <p className={`text-3xl font-black ${s.color.split(" ")[1]}`}>{s.value}</p>
            <p className="text-sm text-gray-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par numéro, média, motif…"
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["tous", "Sanction", "Avertissement", "Mise en demeure", "Rapport"].map(t => (
            <button key={t} onClick={() => setTypeFiltre(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${typeFiltre === t ? "bg-[#1A3A6B] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#1A3A6B]"}`}>
              {t === "tous" ? "Tous" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-3 text-left">N° Décision</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Média</th>
            <th className="px-6 py-3 text-left">Motif</th>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-right">Sanction</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Aucune décision trouvée</td></tr>
            ) : paginated.map(d => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-600">{d.numero}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLOR[d.type] ?? "bg-gray-100 text-gray-600"}`}>{d.type}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{d.media}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  <p className="truncate">{d.motif}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(d.date).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-red-600">
                  {d.montant ?? "—"}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-[#1A3A6B] hover:text-[#1A3A6B]/70 transition-colors" title="Télécharger la décision">
                    <Download className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">{filtered.length} décision(s) affichée(s) · Source officielle CNRA</p>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page + 1}/{totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A3A6B] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#0f2347] transition-colors"
            >
              <ChevronLeft className="size-4" /> Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A3A6B] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#0f2347] transition-colors"
            >
              Suivant <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-center pt-2">
        <a
          href="#"
          className="flex items-center gap-2 px-6 py-3 bg-[#1A3A6B] text-white font-bold rounded-xl text-sm hover:bg-[#0f2347] transition-colors"
        >
          <Download className="size-4" /> Télécharger tous les rapports CNRA
        </a>
      </div>
    </div>
  )
}

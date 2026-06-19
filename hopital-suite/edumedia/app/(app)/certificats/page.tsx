"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Award, Search, CheckCircle, XCircle, Clock, AlertCircle, X } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Certificat = {
  id: string
  numero: string
  beneficiaire: string
  etablissement: string | null
  score_obtenu: number | null
  date_delivrance: string
  valide_jusqu_au: string | null
  statut: string
}

const STATUT_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  valide: { label: "Valide", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle className="size-3" /> },
  expire: { label: "Expiré", color: "text-gray-400 bg-gray-500/10 border-gray-500/20", icon: <Clock className="size-3" /> },
  revoque: { label: "Révoqué", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: <XCircle className="size-3" /> },
}

export default function CertificatsPage() {
  const supabaseRef = useRef(createClient())
  const [certificats, setCertificats] = useState<Certificat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("certificats").select("*").order("date_delivrance", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setCertificats(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = certificats.filter(c =>
    !search ||
    c.beneficiaire.toLowerCase().includes(search.toLowerCase()) ||
    c.numero.toLowerCase().includes(search.toLowerCase()) ||
    (c.etablissement || "").toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageSkeleton rows={3} />

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
          <Award className="size-6 text-emerald-400" /> Certificats délivrés
        </h1>
        <p className="text-sm text-gray-400 mt-1">{certificats.length} certificats — {certificats.filter(c => c.statut === "valide").length} valides</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-emerald-400">{certificats.filter(c => c.statut === "valide").length}</p>
          <p className="text-xs text-gray-400 mt-1">Valides</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-gray-400">{certificats.filter(c => c.statut === "expire").length}</p>
          <p className="text-xs text-gray-400 mt-1">Expirés</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-white">
            {certificats.filter(c => c.score_obtenu).length > 0
              ? Math.round(certificats.filter(c => c.score_obtenu).reduce((s, c) => s + (c.score_obtenu || 0), 0) / certificats.filter(c => c.score_obtenu).length)
              : "—"}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Score moyen</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, numéro, établissement..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {["Numéro", "Bénéficiaire", "Établissement", "Score", "Délivré le", "Valide jusqu'au", "Statut"].map(h => (
                <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="py-3"><div className="h-5 rounded bg-white/5 animate-pulse" /></td></tr>
              ))
            ) : loading ? null : filtered.map(c => {
              const sc = STATUT_CONFIG[c.statut] || STATUT_CONFIG.valide
              return (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <code className="text-[11px] text-emerald-400 font-mono">{c.numero}</code>
                  </td>
                  <td className="py-3 pr-4 font-medium text-white">{c.beneficiaire}</td>
                  <td className="py-3 pr-4 text-gray-400">{c.etablissement || "—"}</td>
                  <td className="py-3 pr-4">
                    {c.score_obtenu !== null ? (
                      <span className={`font-bold ${c.score_obtenu >= 80 ? "text-emerald-400" : c.score_obtenu >= 60 ? "text-amber-400" : "text-red-400"}`}>
                        {c.score_obtenu}%
                      </span>
                    ) : "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{new Date(c.date_delivrance).toLocaleDateString("fr-FR")}</td>
                  <td className="py-3 pr-4 text-gray-400">
                    {c.valide_jusqu_au ? new Date(c.valide_jusqu_au).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border w-fit ${sc.color}`}>
                      {sc.icon} {sc.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState icon={Award} title="Aucun certificat trouvé" description="Aucun certificat ne correspond à votre recherche." />
        )}
      </div>
    </div>
  )
}

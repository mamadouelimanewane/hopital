"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatNumber } from "@/lib/utils"
import { School, MapPin, Users, Mail, Phone, Calendar, AlertCircle, X } from "lucide-react"
import { PageSkeleton } from "@/components/PageSkeleton"
import { EmptyState } from "@/components/EmptyState"

type Etablissement = {
  id: string
  nom: string
  type_etab: string
  region: string
  ville: string | null
  directeur: string | null
  contact_email: string | null
  contact_tel: string | null
  nb_apprenants: number
  partenaire_depuis: string | null
  actif: boolean
}

const TYPE_LABEL: Record<string, string> = {
  universite: "Université",
  lycee: "Lycée",
  college: "Collège",
  ecole_primaire: "École primaire",
  centre_formation: "Centre de formation",
  ong: "ONG",
  media: "Média",
  autre: "Autre",
}

const TYPE_COLOR: Record<string, string> = {
  universite: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  lycee: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  college: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  ecole_primaire: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  centre_formation: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  ong: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  media: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  autre: "text-gray-400 bg-gray-500/10 border-gray-500/20",
}

const REGIONS = ["Dakar", "Saint-Louis", "Thiès", "Ziguinchor", "Kaolack", "Diourbel", "Fatick", "Kolda", "Matam", "Kaffrine", "Kédougou", "Louga", "Sédhiou", "Tambacounda"]

export default function EtablissementsPage() {
  const supabaseRef = useRef(createClient())
  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState("toutes")
  const [typeFilter, setTypeFilter] = useState("tous")

  useEffect(() => {
    const supabase = supabaseRef.current
    async function load() {
      const { data, error: err } = await supabase.from("etablissements").select("*").order("nb_apprenants", { ascending: false })
      if (err) { setError(err.message); setLoading(false); return }
      setEtablissements(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = etablissements.filter(e => {
    const matchRegion = regionFilter === "toutes" || e.region === regionFilter
    const matchType = typeFilter === "tous" || e.type_etab === typeFilter
    return matchRegion && matchType
  })

  const totalApprenants = filtered.reduce((s, e) => s + (e.nb_apprenants || 0), 0)
  const regionsPresentes = [...new Set(etablissements.map(e => e.region))]

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
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <School className="size-6 text-emerald-400" /> Établissements partenaires
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {etablissements.length} établissements — {formatNumber(etablissements.reduce((s, e) => s + (e.nb_apprenants || 0), 0))} apprenants couverts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-white">{filtered.length}</p>
          <p className="text-xs text-gray-400 mt-1">Établissements</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-white">{formatNumber(totalApprenants)}</p>
          <p className="text-xs text-gray-400 mt-1">Apprenants</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xl font-black text-white">{regionsPresentes.length}</p>
          <p className="text-xs text-gray-400 mt-1">Régions</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
          <option value="toutes">Toutes les régions</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
          <option value="tous">Tous les types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(e => (
            <div key={e.id} className={`bg-white/5 border rounded-2xl p-5 ${e.actif ? "border-white/10" : "border-white/5 opacity-60"}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-white leading-tight">{e.nom}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${TYPE_COLOR[e.type_etab] || TYPE_COLOR.autre}`}>
                    {TYPE_LABEL[e.type_etab] || e.type_etab}
                  </span>
                </div>
                {e.nb_apprenants > 0 && (
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-emerald-400">{formatNumber(e.nb_apprenants)}</p>
                    <p className="text-[10px] text-gray-500">apprenants</p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="size-3 text-gray-500 shrink-0" />
                  <span>{e.ville ? `${e.ville}, ` : ""}{e.region}</span>
                </div>
                {e.directeur && (
                  <div className="flex items-center gap-2">
                    <Users className="size-3 text-gray-500 shrink-0" />
                    <span>{e.directeur}</span>
                  </div>
                )}
                {e.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-3 text-gray-500 shrink-0" />
                    <span>{e.contact_email}</span>
                  </div>
                )}
                {e.partenaire_depuis && (
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3 text-gray-500 shrink-0" />
                    <span>Partenaire depuis {new Date(e.partenaire_depuis).getFullYear()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2">
              <EmptyState icon={School} title="Aucun établissement" description="Aucun établissement ne correspond aux filtres sélectionnés." />
            </div>
          )}
        </div>
    </div>
  )
}

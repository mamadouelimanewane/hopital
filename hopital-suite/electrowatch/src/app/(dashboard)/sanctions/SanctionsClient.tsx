"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Sanction, MiseEnDemeure, Media, Campagne } from "@/types"
import { AlertTriangle, FileText, Gavel, Plus, ChevronRight, AlertCircle } from "lucide-react"

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  avertissement:       { label: "Avertissement",         color: "bg-yellow-100 text-yellow-800" },
  suspension_temporaire:{ label: "Suspension temporaire", color: "bg-orange-100 text-orange-800" },
  amende:              { label: "Amende",                 color: "bg-red-100 text-red-800" },
  retrait_agrement:    { label: "Retrait d'agrément",     color: "bg-red-200 text-red-900" },
}
const STATUT_LABELS: Record<string, string> = {
  prononcee: "Prononcée", notifiee: "Notifiée", executee: "Exécutée", annulee: "Annulée",
}

export function SanctionsClient() {
  const supabase = createClient()
  const [sanctions, setSanctions] = useState<Sanction[]>([])
  const [mises, setMises] = useState<MiseEnDemeure[]>([])
  const [medias, setMedias] = useState<Media[]>([])
  const [campagnes, setCampagnes] = useState<Campagne[]>([])
  const [tab, setTab] = useState<"sanctions" | "mises_en_demeure">("sanctions")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formType, setFormType] = useState<"sanction" | "mise_en_demeure">("sanction")
  const [selectedMedia, setSelectedMedia] = useState("")
  const [selectedCampagne, setSelectedCampagne] = useState("")
  const [typeSanction, setTypeSanction] = useState("avertissement")
  const [montant, setMontant] = useState("")
  const [duree, setDuree] = useState("")
  const [motif, setMotif] = useState("")
  const [decisionNum, setDecisionNum] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [s, m, med, camp] = await Promise.all([
      supabase.from("sanctions").select("*, media:medias(*), campagne:campagnes(*)").order("created_at", { ascending: false }),
      supabase.from("mises_en_demeure").select("*, media:medias(*), campagne:campagnes(*)").order("created_at", { ascending: false }),
      supabase.from("medias").select("*").eq("statut", "actif"),
      supabase.from("campagnes").select("*").order("date_debut", { ascending: false }),
    ])
    if (s.error) setError("Impossible de charger les sanctions")
    setSanctions((s.data ?? []) as Sanction[])
    setMises((m.data ?? []) as MiseEnDemeure[])
    setMedias((med.data ?? []) as Media[])
    setCampagnes((camp.data ?? []) as Campagne[])
    setLoading(false)
  }

  async function saveSanction() {
    if (!selectedMedia || !selectedCampagne || !motif) return
    setSaving(true)
    await supabase.from("sanctions").insert({
      media_id: selectedMedia,
      campagne_id: selectedCampagne,
      type_sanction: typeSanction,
      montant_fcfa: montant ? parseInt(montant) : null,
      duree_jours: duree ? parseInt(duree) : null,
      motif,
      decision_numero: decisionNum || null,
    })
    setSaving(false)
    setShowForm(false)
    setMotif(""); setMontant(""); setDuree(""); setDecisionNum("")
    load()
  }

  async function saveMiseEnDemeure() {
    if (!selectedMedia || !selectedCampagne || !motif) return
    setSaving(true)
    await supabase.from("mises_en_demeure").insert({
      media_id: selectedMedia,
      campagne_id: selectedCampagne,
      alerte_id: (await supabase.from("alertes").select("id").eq("campagne_id", selectedCampagne).eq("media_id", selectedMedia).limit(1).single()).data?.id,
      motif,
      contenu: `Mise en demeure adressée à ${medias.find(m => m.id === selectedMedia)?.nom} concernant un déséquilibre du temps de parole. ${motif}`,
    })
    setSaving(false)
    setShowForm(false)
    setMotif("")
    load()
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A6B] flex items-center gap-2">
            <Gavel className="size-6" /> Sanctions & Procédures
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des mises en demeure et sanctions prononcées par le CNRA</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#1A3A6B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A3A6B]/90"
        >
          <Plus className="size-4" /> Nouvelle procédure
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total sanctions", value: sanctions.length, icon: Gavel, color: "text-red-600 bg-red-50" },
          { label: "Mises en demeure", value: mises.length, icon: FileText, color: "text-orange-600 bg-orange-50" },
          { label: "Amendes prononcées", value: sanctions.filter(s => s.type_sanction === "amende").length, icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50" },
          { label: "En cours", value: sanctions.filter(s => s.statut === "prononcee" || s.statut === "notifiee").length, icon: ChevronRight, color: "text-blue-600 bg-blue-50" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="size-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex border-b border-gray-100">
          {(["sanctions", "mises_en_demeure"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-[#1A3A6B] text-[#1A3A6B]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "sanctions" ? `Sanctions (${sanctions.length})` : `Mises en demeure (${mises.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Chargement…</div>
        ) : tab === "sanctions" ? (
          <table className="w-full">
            <thead><tr className="text-xs text-gray-400 uppercase border-b border-gray-50">
              <th className="px-6 py-3 text-left">Décision</th>
              <th className="px-6 py-3 text-left">Média</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Montant / Durée</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Statut</th>
            </tr></thead>
            <tbody>
              {sanctions.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Aucune sanction prononcée</td></tr>
              ) : sanctions.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{s.decision_numero ?? "—"}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{(s.media as Media)?.nom}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_LABELS[s.type_sanction]?.color}`}>
                      {TYPE_LABELS[s.type_sanction]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {s.montant_fcfa ? `${s.montant_fcfa.toLocaleString()} FCFA` : s.duree_jours ? `${s.duree_jours} jours` : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(s.date_decision).toLocaleDateString("fr-FR")}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {STATUT_LABELS[s.statut]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead><tr className="text-xs text-gray-400 uppercase border-b border-gray-50">
              <th className="px-6 py-3 text-left">Média</th>
              <th className="px-6 py-3 text-left">Motif</th>
              <th className="px-6 py-3 text-left">Date envoi</th>
              <th className="px-6 py-3 text-left">Délai réponse</th>
              <th className="px-6 py-3 text-left">Statut</th>
            </tr></thead>
            <tbody>
              {mises.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Aucune mise en demeure</td></tr>
              ) : mises.map(m => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{(m.media as Media)?.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{m.motif}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(m.date_envoi).toLocaleDateString("fr-FR")}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{m.delai_reponse} jours</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      m.statut === "envoyee" ? "bg-blue-100 text-blue-700" :
                      m.statut === "reponse_recue" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{m.statut === "envoyee" ? "Envoyée" : m.statut === "reponse_recue" ? "Réponse reçue" : "Sans suite"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#1A3A6B]">Nouvelle procédure</h2>
              <div className="flex gap-2 mt-3">
                {(["sanction", "mise_en_demeure"] as const).map(t => (
                  <button key={t} onClick={() => setFormType(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${formType === t ? "bg-[#1A3A6B] text-white" : "bg-gray-100 text-gray-600"}`}>
                    {t === "sanction" ? "Sanction" : "Mise en demeure"}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Média *</label>
                  <select value={selectedMedia} onChange={e => setSelectedMedia(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">Sélectionner…</option>
                    {medias.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Campagne *</label>
                  <select value={selectedCampagne} onChange={e => setSelectedCampagne(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">Sélectionner…</option>
                    {campagnes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
              </div>

              {formType === "sanction" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Type de sanction</label>
                    <select value={typeSanction} onChange={e => setTypeSanction(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Montant (FCFA)</label>
                      <input type="number" value={montant} onChange={e => setMontant(e.target.value)}
                        placeholder="Ex: 5000000"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Durée (jours)</label>
                      <input type="number" value={duree} onChange={e => setDuree(e.target.value)}
                        placeholder="Ex: 7"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">N° décision</label>
                    <input value={decisionNum} onChange={e => setDecisionNum(e.target.value)}
                      placeholder="Ex: CNRA-2024-001"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Motif *</label>
                <textarea value={motif} onChange={e => setMotif(e.target.value)} rows={3}
                  placeholder="Motif de la procédure…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Annuler</button>
              <button
                onClick={formType === "sanction" ? saveSanction : saveMiseEnDemeure}
                disabled={saving || !selectedMedia || !selectedCampagne || !motif}
                className="px-6 py-2 bg-[#1A3A6B] text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-[#1A3A6B]/90"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

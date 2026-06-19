"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Users, Plus, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface Petition {
  id: string
  titre: string
  description: string
  objectif_signatures: number
  nb_signatures: number
  statut: string
  categorie: string
  created_at: string
  auteur: string | null
}

export default function PetitionsPage() {
  const supabase = createClient()
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [signing, setSigning] = useState<string | null>(null)
  const [signed, setSigned] = useState<Set<string>>(new Set())
  const [filtre, setFiltre] = useState("toutes")

  useEffect(() => {
    supabase.from("petitions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setPetitions((data ?? []) as Petition[])
      setLoading(false)
    })
  }, [])

  // Formulaire nouvelle pétition
  const [titre, setTitre] = useState("")
  const [desc, setDesc] = useState("")
  const [objectif, setObjectif] = useState("1000")
  const [auteur, setAuteur] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function signer(id: string) {
    setSigning(id)
    // Hash de l'IP simulée (en prod : à faire côté serveur)
    const ipHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("citizen-" + Date.now()))
    const hashHex = Array.from(new Uint8Array(ipHash)).map(b => b.toString(16).padStart(2, "0")).join("")
    await supabase.from("signatures_petition").insert({ petition_id: id, ip_hash: hashHex })
    setSigned(prev => new Set([...prev, id]))
    // Refresh local count
    setPetitions(ps => ps.map(p => p.id === id ? { ...p, nb_signatures: p.nb_signatures + 1 } : p))
    setSigning(null)
  }

  async function soumettrePetition() {
    if (!titre || !desc) return
    await supabase.from("petitions").insert({
      titre, description: desc, auteur: auteur || null,
      objectif_signatures: parseInt(objectif) || 1000,
      categorie: "Pluralisme", statut: "en_attente",
    })
    setSubmitted(true)
  }

  const filtered = filtre === "toutes" ? petitions : petitions.filter(p => p.statut === filtre)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A3A6B] mb-2">Pétitions citoyennes</h1>
          <p className="text-gray-500">Signalez vos préoccupations médiatiques et soutenez les causes en cours</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#1A3A6B] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#1A3A6B]/90 transition-colors">
          <Plus className="size-5" /> Créer une pétition
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pétitions actives", value: petitions.filter(p => p.statut === "active").length, icon: TrendingUp, color: "text-[#1A3A6B] bg-blue-50" },
          { label: "Total signatures", value: petitions.reduce((s, p) => s + p.nb_signatures, 0).toLocaleString("fr-FR"), icon: Users, color: "text-purple-700 bg-purple-50" },
          { label: "Pétitions acceptées", value: petitions.filter(p => p.statut === "acceptee").length, icon: CheckCircle, color: "text-green-700 bg-green-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color.split(" ")[1]}`}>
            <s.icon className={`size-6 mb-2 ${s.color.split(" ")[0]}`} />
            <p className={`text-3xl font-black ${s.color.split(" ")[0]}`}>{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[["toutes", "Toutes"], ["active", "Actives"], ["acceptee", "Acceptées"]].map(([v, l]) => (
          <button key={v} onClick={() => setFiltre(v)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filtre === v ? "bg-[#1A3A6B] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#1A3A6B]"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Liste pétitions */}
      {loading && <div className="text-center py-12 text-gray-400 animate-pulse">Chargement des pétitions…</div>}
      <div className="space-y-5">
        {filtered.map(p => {
          const progress = Math.min(100, Math.round(p.nb_signatures / p.objectif_signatures * 100))
          const isSigned = signed.has(p.id)
          const isAccepted = p.statut === "acceptee"

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs bg-blue-100 text-[#1A3A6B] px-2 py-0.5 rounded-full font-medium">{p.categorie}</span>
                        {isAccepted && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><CheckCircle className="size-3" />Acceptée par le CNRA</span>}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg leading-snug">{p.titre}</h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users className="size-3" /> {p.auteur}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {new Date(p.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>

                {/* Compteur + bouton */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-3 sm:min-w-40">
                  <div className="text-right">
                    <p className="text-3xl font-black text-[#1A3A6B]">{(p.nb_signatures + (isSigned ? 1 : 0)).toLocaleString("fr-FR")}</p>
                    <p className="text-xs text-gray-400">sur {p.objectif_signatures.toLocaleString("fr-FR")} objectif</p>
                  </div>
                  {!isAccepted && (
                    <button
                      onClick={() => !isSigned && signer(p.id)}
                      disabled={isSigned || signing === p.id}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        isSigned ? "bg-green-100 text-green-700 cursor-default" :
                        "bg-[#1A3A6B] text-white hover:bg-[#1A3A6B]/90 active:scale-95"
                      }`}
                    >
                      {signing === p.id ? "…" : isSigned ? "✓ Signé" : "Signer"}
                    </button>
                  )}
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>{progress}% de l&apos;objectif atteint</span>
                  <span>{p.objectif_signatures - p.nb_signatures > 0 ? `${(p.objectif_signatures - p.nb_signatures).toLocaleString("fr-FR")} signatures restantes` : "Objectif atteint ✓"}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: isAccepted ? "#166534" : progress >= 100 ? "#C9A84C" : "#1A3A6B" }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal nouvelle pétition */}
      {showForm && !submitted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#1A3A6B]">Lancer une pétition</h2>
              <p className="text-sm text-gray-500 mt-1">Votre pétition sera examinée par le CNRA avant publication</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Titre de la pétition *</label>
                <input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Pour l'équité du temps de parole…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description *</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Décrivez votre demande en détail…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Votre nom / Organisation</label>
                  <input value={auteur} onChange={e => setAuteur(e.target.value)} placeholder="Ex: Association X"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Objectif signatures</label>
                  <input type="number" value={objectif} onChange={e => setObjectif(e.target.value)} min="100"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
              <button onClick={soumettrePetition} disabled={!titre || !desc}
                className="px-6 py-2.5 bg-[#1A3A6B] text-white font-bold rounded-xl text-sm disabled:opacity-40 hover:bg-[#1A3A6B]/90">
                Soumettre au CNRA
              </button>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-10">
            <CheckCircle className="size-14 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pétition soumise !</h3>
            <p className="text-gray-500 text-sm mb-6">Votre pétition sera examinée par le CNRA dans les 5 jours ouvrables.</p>
            <button onClick={() => { setSubmitted(false); setShowForm(false); setTitre(""); setDesc("") }}
              className="w-full bg-[#1A3A6B] text-white font-bold py-3 rounded-xl">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}

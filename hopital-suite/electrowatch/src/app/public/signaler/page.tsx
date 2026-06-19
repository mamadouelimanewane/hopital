"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, AlertCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function SignalerPage() {
  const supabase = createClient()
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [tel, setTel] = useState("")
  const [type, setType] = useState("desequilibre")
  const [desc, setDesc] = useState("")
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!desc.trim()) return
    setSending(true)
    setError(null)
    const { error: err } = await supabase.from("signalements").insert({
      nom_signalant: nom || null,
      email_signalant: email || null,
      telephone: tel || null,
      type_infraction: type,
      description: desc,
    })
    setSending(false)
    if (err) setError("Une erreur est survenue. Veuillez réessayer.")
    else setDone(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A3A6B] to-[#0f2347] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <Link href="/public/observatoire" className="text-blue-300 hover:text-white text-sm flex items-center gap-1 transition-colors">
            <ChevronLeft className="size-4" /> Retour à l&apos;observatoire
          </Link>
        </div>

        {done ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-2xl">
            <CheckCircle className="size-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Signalement enregistré</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Votre signalement a été transmis au CNRA. Il sera examiné dans les meilleurs délais.
              Nous vous informerons par email si vous avez renseigné une adresse de contact.
            </p>
            <Link href="/public/observatoire"
              className="mt-6 inline-block bg-[#1A3A6B] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A3A6B]/90 transition-colors">
              Retour à l&apos;observatoire
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#1A3A6B] p-8 text-white">
              <h1 className="text-xl font-bold mb-1">Signaler une infraction</h1>
              <p className="text-blue-300 text-sm">Conseil National de Régulation de l&apos;Audiovisuel du Sénégal</p>
            </div>

            <form onSubmit={submit} className="p-8 space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                <AlertCircle className="size-4 inline mr-2" />
                Votre signalement est traité de manière confidentielle. Les informations personnelles sont facultatives.
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Type d&apos;infraction *</label>
                <select value={type} onChange={e => setType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                  <option value="desequilibre">Déséquilibre du temps de parole</option>
                  <option value="contenu_partisan">Contenu partisan / propagande</option>
                  <option value="temps_non_declare">Temps de parole non déclaré</option>
                  <option value="autre">Autre infraction</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Description détaillée *</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} required rows={4}
                  placeholder="Décrivez précisément l'infraction observée (média, date, heure, contenu)…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none" />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 uppercase font-medium mb-3">Coordonnées (facultatif)</p>
                <div className="space-y-3">
                  <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Votre nom"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre adresse email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                  <input value={tel} onChange={e => setTel(e.target.value)} placeholder="Votre téléphone"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button type="submit" disabled={sending || !desc.trim()}
                className="w-full bg-[#1A3A6B] text-white py-3 rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-[#1A3A6B]/90 transition-colors">
                {sending ? "Envoi en cours…" : "Soumettre le signalement"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

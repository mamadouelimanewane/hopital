"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react"
import type { Campagne } from "@/types"

interface Message {
  role: "user" | "assistant"
  content: string
  ts: Date
}

const SUGGESTIONS = [
  "Quel média présente le plus grand déséquilibre actuellement ?",
  "Quel parti bénéficie du plus de temps de parole sur RTS1 ?",
  "Résume l'état du pluralisme médiatique cette semaine",
  "Dois-je émettre une mise en demeure contre 2STV ?",
  "Compare les temps de parole de PASTEF et APR",
  "Quels médias respectent le seuil d'équité de 20% ?",
]

export function IAAssistantClient() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour. Je suis l'Assistant IA du CNRA, alimenté par l'intelligence artificielle Claude. J'analyse en temps réel les données de monitoring du temps de parole électoral. Posez-moi vos questions sur la campagne en cours — déséquilibres, recommandations, synthèses, aide à la décision.",
      ts: new Date(),
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [campagne, setCampagne] = useState<Campagne | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from("campagnes").select("*").eq("statut", "en_cours").limit(1).single()
      .then(({ data }) => setCampagne(data as Campagne))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send(question?: string) {
    const q = question ?? input.trim()
    if (!q || !campagne) return
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: q, ts: new Date() }])
    setLoading(true)

    try {
      const res = await fetch("/api/ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, campagne_id: campagne.id }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reponse ?? data.error ?? "Erreur de traitement.",
        ts: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Une erreur est survenue. Vérifiez la configuration de la clé API Anthropic.",
        ts: new Date(),
      }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A3A6B] to-[#0f2347] px-8 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Sparkles className="size-6 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg flex items-center gap-2">
              Assistant IA CNRA
              <span className="bg-[#C9A84C]/20 text-[#C9A84C] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Powered by Claude</span>
            </h1>
            <p className="text-blue-300 text-sm">Analyse intelligente du monitoring électoral</p>
          </div>
        </div>
        {campagne && (
          <div className="text-right">
            <p className="text-blue-300 text-xs uppercase tracking-wide">Campagne analysée</p>
            <p className="text-white font-semibold">{campagne.nom}</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === "assistant" ? "bg-[#1A3A6B]" : "bg-gray-200"
            }`}>
              {msg.role === "assistant"
                ? <Bot className="size-5 text-white" />
                : <User className="size-5 text-gray-600" />
              }
            </div>

            {/* Bulle */}
            <div className={`max-w-2xl ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm"
                  : "bg-[#1A3A6B] text-white rounded-tr-sm"
              }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 px-1">
                {msg.ts.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {/* Indicateur de frappe */}
        {loading && (
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#1A3A6B] flex items-center justify-center shrink-0">
              <Bot className="size-5 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
              <Loader2 className="size-4 text-gray-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !loading && (
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Suggestions de questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-full hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6 shrink-0">
        <form onSubmit={e => { e.preventDefault(); send() }}
          className="flex gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#1A3A6B] transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={campagne ? `Posez une question sur "${campagne.nom}"…` : "Aucune campagne active…"}
            disabled={!campagne || loading}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none disabled:opacity-50"
          />
          <button type="submit" disabled={!input.trim() || !campagne || loading}
            className="w-9 h-9 rounded-xl bg-[#1A3A6B] flex items-center justify-center disabled:opacity-30 hover:bg-[#1A3A6B]/90 transition-colors shrink-0">
            <Send className="size-4 text-white" />
          </button>
        </form>
        <p className="text-[10px] text-gray-300 text-center mt-2">
          Les analyses sont basées sur les données en temps réel d&apos;ElectroWatch
        </p>
      </div>
    </div>
  )
}

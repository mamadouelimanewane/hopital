"use client"
import { useState, useRef, useEffect } from "react"
import { Send, Phone, Calendar, MapPin, Mic, AlertTriangle, CheckCircle, Clock } from "lucide-react"

type Langue = "fr" | "wo" | "pu"
type Urgence = "P1" | "P2" | "P3" | "Non urgent" | null

interface Message {
  role: "bot" | "user"
  text: string
  time: string
}

const conversationFr: Message[] = [
  { role: "bot", text: "Bonjour ! Je suis l'assistant de triage Ndamatou. Décrivez vos symptômes ou choisissez une catégorie ci-dessous.", time: "10:02" },
  { role: "user", text: "J'ai des douleurs thoraciques depuis 1 heure", time: "10:03" },
  { role: "bot", text: "⚠️ Symptômes cardiaques potentiels détectés. Avez-vous également des douleurs dans le bras gauche ou la mâchoire ?", time: "10:03" },
  { role: "user", text: "Oui, et je transpire beaucoup, j'ai du mal à respirer", time: "10:04" },
  { role: "bot", text: "🚨 URGENCE P1 — Ces symptômes sont compatibles avec un syndrome coronarien aigu (infarctus). Appelez le 15 (SAMU) immédiatement ou rendez-vous aux Urgences Ndamatou. Ne conduisez pas vous-même.", time: "10:04" },
]

const conversationWo: Message[] = [
  { role: "bot", text: "Asalaamu aleekum ! Maa ngi ci Ndamatou yi wax ñu ci ak yéen ci mbind bu kanam. Wax ma ci sa yaram yi doy sa yaram.", time: "10:02" },
  { role: "user", text: "Dafa may daw biir sama xol ci diggante ak biir yoon wu ndaw bi.", time: "10:03" },
  { role: "bot", text: "⚠️ Mbëggël — Dafa di bind ci xol bi. Ndax dafa dëgël ak sa kanam wala sa bakkan ci kanam?", time: "10:03" },
  { role: "user", text: "Waaw, dafa may daw ak dafa wëñ ci sama yaram", time: "10:04" },
  { role: "bot", text: "🚨 TOGG TOPP P1 — Dem ci kër si yu ndaw ndaw! Woo li 15 (SAMU) wala dem ci Urgences bi ci Ndamatou. Bul dem ak sa kanam.", time: "10:04" },
]

const suggestions = {
  fr: ["🤒 Fièvre", "💔 Douleur thoracique", "🤕 Accident / Blessure", "👶 Enfant malade", "🤰 Femme enceinte", "🤢 Vomissements"],
  wo: ["🤒 Fiiwru", "💔 Daw biir xol", "🤕 Accident", "👶 Dom bu ndaw", "🤰 Jabar yu ndaw"],
  pu: ["🤒 Yidde", "💔 Heɓɓere yiite", "🤕 Mberlere", "👶 Sukaabe"],
}

const langueLabel = { fr: "Français 🇫🇷", wo: "Wolof 🇸🇳", pu: "Pulaar" }

export default function ChatbotTriage() {
  const [langue, setLangue] = useState<Langue>("fr")
  const [messages, setMessages] = useState<Message[]>(conversationFr)
  const [input, setInput] = useState("")
  const [urgence, setUrgence] = useState<Urgence>("P1")
  const [service, setService] = useState("Urgences Cardiologie")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleLangue = (l: Langue) => {
    setLangue(l)
    setMessages(l === "wo" ? conversationWo : conversationFr)
  }

  const envoyer = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    const newMessages: Message[] = [...messages, { role: "user", text: input, time: now }]
    setMessages(newMessages)
    setInput("")
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "bot",
        text: langue === "wo"
          ? "Jërejëf — Maa ngi xam sa problem. Dem ci urgences bi ci kanam ndaw ndaw."
          : "Je comprends votre situation. Je vous oriente vers le service approprié. Un médecin va vous contacter.",
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      }])
    }, 1000)
  }

  const urgenceConfig = {
    P1: { color: "bg-red-600", label: "🚨 URGENCE P1", text: "Danger immédiat — Appel 15" },
    P2: { color: "bg-orange-500", label: "⚠️ URGENCE P2", text: "Consultation rapide requise" },
    P3: { color: "bg-yellow-500", label: "🔔 URGENCE P3", text: "Consultation dans la journée" },
    "Non urgent": { color: "bg-green-500", label: "✅ Non urgent", text: "Prendre rendez-vous" },
  }

  const uc = urgence ? urgenceConfig[urgence] : null

  return (
    <>
      <style>{`
        body { margin:0; background:#f8fafc; color:#1e293b; font-family:'Inter',system-ui,sans-serif; }
        .msg-bot { background:#dcfce7; border-radius:0 12px 12px 12px; }
        .msg-user { background:#2563eb; color:white; border-radius:12px 12px 0 12px; }
        .chat-area { overflow-y:auto; scroll-behavior:smooth; }
        .pulse { animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#065f46,#0f766e)" }} className="text-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🏥</div>
            <div>
              <h1 className="font-black text-lg">Assistant Triage Ndamatou</h1>
              <p className="text-green-200 text-xs">IA de triage médical 24h/7j</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(["fr", "wo", "pu"] as Langue[]).map(l => (
              <button key={l} onClick={() => handleLangue(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${langue === l ? "bg-white text-green-800" : "bg-white/20 hover:bg-white/30"}`}>
                {langueLabel[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: "calc(100vh - 88px)" }}>

        {/* SIDEBAR */}
        <div className="space-y-4">
          {/* NIVEAU URGENCE */}
          {uc && (
            <div className={`${uc.color} text-white rounded-xl p-4`}>
              <div className="font-black text-lg">{uc.label}</div>
              <div className="text-sm opacity-90 mt-1">{uc.text}</div>
              <div className="mt-3 text-sm font-semibold">→ {service}</div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Actions recommandées</h3>
            <button className="w-full flex items-center gap-3 bg-red-600 text-white rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-red-700 transition">
              <Phone className="w-4 h-4" /> Appeler le 15 (SAMU)
            </button>
            <button className="w-full flex items-center gap-3 bg-blue-600 text-white rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-blue-700 transition">
              <MapPin className="w-4 h-4" /> Aller aux Urgences
            </button>
            <button className="w-full flex items-center gap-3 bg-gray-100 text-gray-700 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-gray-200 transition">
              <Calendar className="w-4 h-4" /> Prendre un RDV
            </button>
          </div>

          {/* STATS */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Aujourd'hui</h3>
            <div className="space-y-2">
              {[
                { icon: <CheckCircle className="w-4 h-4 text-green-500" />, label: "Triages effectués", val: "127" },
                { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, label: "Urgences P1 détectées", val: "23" },
                { icon: <Clock className="w-4 h-4 text-blue-500" />, label: "Temps moyen triage", val: "4 min" },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">{s.icon}{s.label}</div>
                  <span className="font-bold text-gray-900">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 flex flex-col shadow-sm" style={{ maxHeight: "80vh" }}>
          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 chat-area overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs md:max-w-sm lg:max-w-md`}>
                  {m.role === "bot" && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-bold text-green-700">🤖 IA Triage</span>
                      <span className="text-xs text-gray-400">{m.time}</span>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 text-sm leading-relaxed ${m.role === "bot" ? "msg-bot text-gray-800" : "msg-user"}`}>
                    {m.text}
                  </div>
                  {m.role === "user" && <div className="text-xs text-gray-400 text-right mt-1">{m.time}</div>}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions rapides */}
          <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-gray-50">
            {suggestions[langue].map((s, i) => (
              <button key={i} onClick={() => setInput(s.replace(/^\S+\s/, ""))}
                className="px-3 py-1 bg-gray-100 hover:bg-green-100 text-gray-600 rounded-full text-xs font-medium transition">
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <button className="p-2.5 text-gray-400 hover:text-gray-600 transition">
              <Mic className="w-5 h-5" />
            </button>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && envoyer()}
              placeholder={langue === "wo" ? "Wax ma ci sa yaram..." : "Décrivez vos symptômes..."}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button onClick={envoyer}
              className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 transition">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

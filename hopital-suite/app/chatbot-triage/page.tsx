"use client"
import { useState, useRef, useEffect } from "react"

type Langue = "fr" | "wo" | "pu"
type Urgence = "P1" | "P2" | "P3" | "Non urgent" | null

interface Message {
  role: "bot" | "user"
  text: string
  time: string
}

const conversationFr: Message[] = [
  { role: "bot", text: "Bonjour ! Je suis l'assistant de triage CHNCAK. Décrivez vos symptômes ou choisissez une catégorie ci-dessous.", time: "10:02" },
  { role: "user", text: "J'ai des douleurs thoraciques depuis 1 heure", time: "10:03" },
  { role: "bot", text: "⚠️ Symptômes cardiaques potentiels détectés. Avez-vous également des douleurs dans le bras gauche ou la mâchoire ?", time: "10:03" },
  { role: "user", text: "Oui, et je transpire beaucoup, j'ai du mal à respirer", time: "10:04" },
  { role: "bot", text: "🚨 URGENCE P1 — Ces symptômes sont compatibles avec un syndrome coronarien aigu (infarctus). Appelez le 15 (SAMU) immédiatement ou rendez-vous aux Urgences CHNCAK. Ne conduisez pas vous-même.", time: "10:04" },
]

const conversationWo: Message[] = [
  { role: "bot", text: "Asalaamu aleekum ! Maa ngi ci CHNCAK yi wax ñu ci ak yéen ci mbind bu kanam. Wax ma ci sa yaram yi doy sa yaram.", time: "10:02" },
  { role: "user", text: "Dafa may daw biir sama xol ci diggante ak biir yoon wu ndaw bi.", time: "10:03" },
  { role: "bot", text: "⚠️ Mbëggël — Dafa di bind ci xol bi. Ndax dafa dëgël ak sa kanam wala sa bakkan ci kanam?", time: "10:03" },
  { role: "user", text: "Waaw, dafa may daw ak dafa wëñ ci sama yaram", time: "10:04" },
  { role: "bot", text: "🚨 TOGG TOPP P1 — Dem ci kër si yu ndaw ndaw! Woo li 15 (SAMU) wala dem ci Urgences bi ci CHNCAK. Bul dem ak sa kanam.", time: "10:04" },
]

const suggestions = {
  fr: ["🤒 Fièvre", "💔 Douleur thoracique", "🤕 Accident / Blessure", "👶 Enfant malade", "🤰 Femme enceinte", "🤢 Vomissements"],
  wo: ["🤒 Fiiwru", "💔 Daw biir xol", "🤕 Accident", "👶 Dom bu ndaw", "🤰 Jabar yu ndaw"],
  pu: ["🤒 Yidde", "💔 Heɓɓere yiite", "🤕 Mberlere", "👶 Sukaabe"],
}

const langueLabel: Record<Langue, string> = { fr: "Français 🇫🇷", wo: "Wolof 🇸🇳", pu: "Pulaar" }

const urgenceConfig = {
  P1: { color: "#ef4444", bg:"rgba(239,68,68,0.15)", label: "🚨 URGENCE P1", text: "Danger immédiat — Appel 15" },
  P2: { color: "#f59e0b", bg:"rgba(245,158,11,0.15)", label: "⚠️ URGENCE P2", text: "Consultation rapide requise" },
  P3: { color: "#eab308", bg:"rgba(234,179,8,0.15)", label: "🔔 URGENCE P3", text: "Consultation dans la journée" },
  "Non urgent": { color: "#22c55e", bg:"rgba(34,197,94,0.15)", label: "✅ Non urgent", text: "Prendre rendez-vous" },
}

const card = "#0a1628"
const border = "rgba(255,255,255,0.06)"
const accent = "#065f46"

export default function ChatbotTriage() {
  const [langue, setLangue] = useState<Langue>("fr")
  const [messages, setMessages] = useState<Message[]>(conversationFr)
  const [input, setInput] = useState("")
  const [urgence, setUrgence] = useState<Urgence>("P1")
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

  const uc = urgence ? urgenceConfig[urgence] : null

  return (
    <div style={{ background:"#050d1a", minHeight:"100vh", color:"#e2e8f0", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,rgba(6,95,70,0.2),rgba(6,95,70,0.05))", borderBottom:"1px solid rgba(6,95,70,0.3)", padding:"1rem 1.5rem" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, background:"rgba(6,95,70,0.3)", border:"1px solid rgba(6,95,70,0.5)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏥</div>
            <div>
              <h1 style={{ fontWeight:800, fontSize:18, color:"#e2e8f0", margin:0 }}>Assistant Triage CHNCAK</h1>
              <p style={{ color:"#64748b", fontSize:12, margin:0 }}>IA de triage médical 24h/7j — Trilingue</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {(["fr", "wo", "pu"] as Langue[]).map(l => (
              <button key={l} onClick={() => handleLangue(l)} style={{
                padding:"6px 14px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", border:"none", transition:"all 0.2s",
                background: langue === l ? "rgba(6,95,70,0.5)" : "rgba(255,255,255,0.06)",
                color: langue === l ? "#6ee7b7" : "rgba(255,255,255,0.5)"
              }}>
                {langueLabel[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"1.5rem", display:"grid", gridTemplateColumns:"280px 1fr", gap:20, minHeight:"calc(100vh - 140px)" }}>

        {/* SIDEBAR */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* URGENCE */}
          {uc && (
            <div style={{ background:uc.bg, border:`1px solid ${uc.color}44`, borderRadius:14, padding:"1.25rem" }}>
              <div style={{ fontWeight:800, fontSize:18, color:uc.color }}>{uc.label}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:6 }}>{uc.text}</div>
              <div style={{ marginTop:10, fontSize:12, fontWeight:600, color:"#e2e8f0" }}>→ Service Urgences Cardiologie</div>
            </div>
          )}

          {/* ACTIONS */}
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem" }}>
            <h3 style={{ color:"#e2e8f0", fontWeight:700, fontSize:13, margin:"0 0 12px" }}>Actions recommandées</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button style={{ width:"100%", display:"flex", alignItems:"center", gap:10, background:"rgba(239,68,68,0.8)", color:"white", border:"none", borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                📞 Appeler le 15 (SAMU)
              </button>
              <button style={{ width:"100%", display:"flex", alignItems:"center", gap:10, background:"rgba(59,130,246,0.6)", color:"white", border:"none", borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                📍 Aller aux Urgences
              </button>
              <button style={{ width:"100%", display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.06)", color:"#e2e8f0", border:`1px solid ${border}`, borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                📅 Prendre un RDV
              </button>
            </div>
          </div>

          {/* STATS */}
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"1.25rem" }}>
            <h3 style={{ color:"#e2e8f0", fontWeight:700, fontSize:13, margin:"0 0 12px" }}>Aujourd'hui</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { icon:"✅", label:"Triages effectués", val:"127", color:"#22c55e" },
                { icon:"🚨", label:"Urgences P1 détectées", val:"23", color:"#f87171" },
                { icon:"⏱", label:"Temps moyen triage", val:"4 min", color:"#38bdf8" },
              ].map((s, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#64748b" }}>
                    <span>{s.icon}</span>{s.label}
                  </div>
                  <span style={{ fontWeight:800, color:s.color, fontSize:13 }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, display:"flex", flexDirection:"column", maxHeight:"80vh", overflow:"hidden" }}>
          {/* Messages */}
          <div style={{ flex:1, padding:"1.25rem", overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth:"70%" }}>
                  {m.role === "bot" && (
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#6ee7b7" }}>🤖 IA Triage</span>
                      <span style={{ fontSize:10, color:"#64748b" }}>{m.time}</span>
                    </div>
                  )}
                  <div style={{
                    padding:"10px 14px", fontSize:13, lineHeight:1.5, borderRadius: m.role === "bot" ? "0 12px 12px 12px" : "12px 12px 0 12px",
                    background: m.role === "bot" ? "rgba(6,95,70,0.2)" : "rgba(59,130,246,0.5)",
                    color: "#e2e8f0", border: m.role === "bot" ? "1px solid rgba(6,95,70,0.3)" : "1px solid rgba(59,130,246,0.3)"
                  }}>
                    {m.text}
                  </div>
                  {m.role === "user" && <div style={{ fontSize:10, color:"#64748b", textAlign:"right", marginTop:4 }}>{m.time}</div>}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding:"10px 1.25rem", display:"flex", gap:8, flexWrap:"wrap", borderTop:`1px solid ${border}` }}>
            {suggestions[langue].map((s, i) => (
              <button key={i} onClick={() => setInput(s.replace(/^\S+\s/, ""))}
                style={{ padding:"5px 12px", background:"rgba(255,255,255,0.06)", border:`1px solid ${border}`, color:"rgba(255,255,255,0.6)", borderRadius:20, fontSize:12, fontWeight:500, cursor:"pointer" }}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:"1rem 1.25rem", borderTop:`1px solid ${border}`, display:"flex", gap:8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && envoyer()}
              placeholder={langue === "wo" ? "Wax ma ci sa yaram..." : "Décrivez vos symptômes..."}
              style={{ flex:1, background:"rgba(255,255,255,0.06)", border:`1px solid ${border}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:"#e2e8f0", outline:"none" }} />
            <button onClick={envoyer} style={{ background:"rgba(6,95,70,0.8)", color:"white", border:"none", borderRadius:10, padding:"10px 16px", fontSize:18, cursor:"pointer" }}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

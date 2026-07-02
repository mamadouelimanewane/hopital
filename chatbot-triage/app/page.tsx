"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Send, Phone, Calendar, MapPin, Mic, AlertTriangle,
  CheckCircle, Clock, Activity, BarChart3, Users, Zap,
  ChevronRight, X, RefreshCw, Heart, Thermometer, ShieldPlus,
  TrendingUp, MessageSquare, ArrowRight, Info
} from "lucide-react"

/* ─────────────── TYPES ─────────────── */
type Langue = "fr" | "wo" | "pu"
type Priorite = "P1" | "P2" | "P3" | "NON_URGENT"

interface Message {
  role: "bot" | "user"
  text: string
  time: string
  priorite?: Priorite
}

interface Consultation {
  id: string
  patient: string
  symptomes: string
  priorite: Priorite
  service: string
  heure: string
  duree: string
}

interface StatJour {
  total: number
  p1: number
  p2: number
  p3: number
  nonUrgent: number
  tempsMoyen: number // en secondes
}

/* ─────────────── DONNÉES FICTIVES RÉALISTES ─────────────── */
const historiqueInitial: Consultation[] = [
  { id: "T-2341", patient: "Amadou Ndiaye", symptomes: "Douleur thoracique + dyspnée", priorite: "P1", service: "Cardiologie / Réa", heure: "08:14", duree: "3 min" },
  { id: "T-2342", patient: "Mariama Diallo", symptomes: "Convulsions chez enfant 3 ans", priorite: "P1", service: "Pédiatrie Urgences", heure: "08:31", duree: "2 min" },
  { id: "T-2343", patient: "Ousmane Faye", symptomes: "Plaie profonde à la main", priorite: "P2", service: "Chirurgie", heure: "08:47", duree: "5 min" },
  { id: "T-2344", patient: "Fatou Mbaye", symptomes: "Fièvre 39.5°C + vomissements", priorite: "P2", service: "Médecine interne", heure: "09:02", duree: "4 min" },
  { id: "T-2345", patient: "Ibrahima Sow", symptomes: "Mal de gorge + toux", priorite: "P3", service: "Consultation générale", heure: "09:18", duree: "6 min" },
  { id: "T-2346", patient: "Rokhaya Sarr", symptomes: "Grossesse 8 mois — contractions", priorite: "P1", service: "Maternité Urgences", heure: "09:33", duree: "2 min" },
  { id: "T-2347", patient: "Cheikh Diop", symptomes: "Hypertension artérielle 180/110", priorite: "P2", service: "Cardiologie", heure: "09:51", duree: "5 min" },
  { id: "T-2348", patient: "Aïssatou Ba", symptomes: "Rhinite allergique", priorite: "NON_URGENT", service: "ORL", heure: "10:04", duree: "7 min" },
  { id: "T-2349", patient: "Modou Fall", symptomes: "Diabète — glycémie 320 mg/dL", priorite: "P2", service: "Endocrinologie", heure: "10:22", duree: "4 min" },
  { id: "T-2350", patient: "Coumba Thiaw", symptomes: "Maux de dos chroniques", priorite: "P3", service: "Rhumatologie", heure: "10:38", duree: "6 min" },
  { id: "T-2351", patient: "Pape Diagne", symptomes: "Traumatisme crânien AVC suspect", priorite: "P1", service: "Neurologie Urgences", heure: "10:54", duree: "2 min" },
  { id: "T-2352", patient: "Ndèye Gaye", symptomes: "Infection urinaire sévère", priorite: "P2", service: "Gynécologie", heure: "11:07", duree: "5 min" },
]

const statsInitiales: StatJour = {
  total: 127,
  p1: 23,
  p2: 48,
  p3: 39,
  nonUrgent: 17,
  tempsMoyen: 262,
}

/* ─────────────── LOGIQUE DE TRIAGE IA ─────────────── */
const motsClesPriorite: Record<Priorite, string[]> = {
  P1: [
    "infarctus", "thoracique", "cardiaque", "convulsion", "épilepsie",
    "inconscient", "arrêt", "avc", "stroke", "respiration", "étouffer",
    "hémorragie", "sang", "traumatisme", "brûlure grave", "anaphylaxie",
    "allergie grave", "accouchement", "bébé", "contraction",
    "douleur bras gauche", "mâchoire", "transpire", "vertiges sévères",
    "perte connaissance", "coma", "sepsis"
  ],
  P2: [
    "fièvre élevée", "39", "40", "plaie", "fracture", "cassé",
    "hypertension", "tension", "diabète", "glycémie", "vomissement",
    "déshydratation", "douleur abdominale", "appendicite", "urinaire",
    "infection sévère", "asthme", "crise", "douleur forte"
  ],
  P3: [
    "fièvre modérée", "38", "toux", "grippe", "rhume", "gorge",
    "douleur dos", "migraine", "entorse", "bleu", "contusion",
    "diarrhée légère", "fatigue", "insomnie", "anxiété"
  ],
  NON_URGENT: [
    "rhinite", "allergie légère", "renouvellement", "ordonnance",
    "certificat", "visite", "bilan", "contrôle", "rendez-vous"
  ],
}

const serviceOrientations: Record<Priorite, string> = {
  P1: "Urgences immédiates — Salle de réanimation",
  P2: "Urgences semi-urgentes — Consultation rapide",
  P3: "Consultation externe — Médecine générale",
  NON_URGENT: "Accueil — Prise de rendez-vous",
}

function analyserTexte(texte: string): Priorite {
  const t = texte.toLowerCase()
  for (const mot of motsClesPriorite.P1) { if (t.includes(mot)) return "P1" }
  for (const mot of motsClesPriorite.P2) { if (t.includes(mot)) return "P2" }
  for (const mot of motsClesPriorite.P3) { if (t.includes(mot)) return "P3" }
  return "NON_URGENT"
}

/* ─────────────── CONVERSATIONS INITIALES ─────────────── */
const convInit: Record<Langue, Message[]> = {
  fr: [
    { role: "bot", text: "Bonjour ! Je suis l'assistant IA de triage de l'Hôpital Ndamatou. 🏥\n\nDécrivez vos symptômes et je vous orientera vers le bon service.", time: "–", priorite: undefined },
  ],
  wo: [
    { role: "bot", text: "Asalaamu aleekum ! Maa ngi ci kër boppam bi yi Ndamatou. 🏥\n\nWax ma ci sa yaram — maa ngi wax ak yow ci wolof.", time: "–", priorite: undefined },
  ],
  pu: [
    { role: "bot", text: "Jam waali ! Mi woni jaaɓndirɗo nder hopitaaru Ndamatou. 🏥\n\nHol ko huɓɓi e maaɗa ? Haala am, mi faalii yiyde maa.", time: "–", priorite: undefined },
  ],
}

const suggestions: Record<Langue, string[]> = {
  fr: ["🫀 Douleur thoracique", "🌡️ Fièvre élevée", "🤕 Accident / Blessure", "👶 Enfant malade", "🤰 Urgence maternité", "🤢 Vomissements sévères", "🧠 Maux de tête intenses", "💊 Ordonnance / RDV"],
  wo: ["🫀 Daw biir xol", "🌡️ Fiiwru bu dëkk", "🤕 Accident", "👶 Dom bu ndaw", "🤰 Jabar yu ndaw", "🤢 Reetaan"],
  pu: ["🫀 Heɓɓere yiite", "🌡️ Yidde", "🤕 Mberlere", "👶 Sukaabe", "🤰 Debbo junngo"],
}

const langueLabel: Record<Langue, string> = {
  fr: "Français 🇫🇷",
  wo: "Wolof 🇸🇳",
  pu: "Pulaar",
}

/* ─────────────── RÉPONSES BOT ─────────────── */
function genererReponse(texte: string, priorite: Priorite, langue: Langue): string {
  const service = serviceOrientations[priorite]
  if (langue === "wo") {
    if (priorite === "P1") return `🚨 TOGG TOPP P1 — Sa yaram dafa yomb lool. Dem ci kër si yu ndaw ndaw!\n\n📞 Woo li 15 (SAMU) kanam\n📍 ${service}\n\nBul dem ak sa kanam — gëstu ci kër Ndamatou.`
    if (priorite === "P2") return `⚠️ PRIORITÉ P2 — Xam naa sa problem. Dem ci kër si — ci kanam.\n\n📍 ${service}\n\nYobu say daawu yëgël yi.`
    return `✅ PRIORITÉ ${priorite} — Deedet, yomb. ${service}.\n\nXam naa sa problem — ci kanam.`
  }
  if (langue === "pu") {
    if (priorite === "P1") return `🚨 URGENCE P1 — Ko mawɗo. Yah e wéllitaare ɓurnde yaawde!\n\n📞 Noddu 15 (SAMU)\n📍 ${service}`
    return `✅ Priorité ${priorite} — ${service}. Yah e laawɗe.`
  }
  // Français
  if (priorite === "P1") return `🚨 URGENCE VITALE — P1\n\nVos symptômes nécessitent une prise en charge immédiate.\n\n📞 Appelez le 15 (SAMU) maintenant\n🏥 Ou rendez-vous immédiatement :\n→ ${service}\n\n⚠️ Ne conduisez pas vous-même. Demandez de l'aide.`
  if (priorite === "P2") return `⚠️ URGENCE — P2\n\nVotre état nécessite une consultation rapide dans les 2 heures.\n\n🏥 Dirigez-vous vers :\n→ ${service}\n\nApportez votre carnet de santé et vos médicaments actuels.`
  if (priorite === "P3") return `🔔 SEMI-URGENT — P3\n\nUne consultation est recommandée dans la journée.\n\n🏥 Service recommandé :\n→ ${service}\n\nPuis-je avoir plus de détails sur vos symptômes ?`
  return `✅ NON URGENT\n\nVotre situation ne nécessite pas une urgence immédiate.\n\n📅 Prenez rendez-vous avec :\n→ ${service}\n\nSouhaitez-vous que je vous aide à planifier une consultation ?`
}

/* ─────────────── CONFIGS VISUELLES ─────────────── */
const prioriteConfig = {
  P1: {
    bg: "rgba(239,68,68,0.15)",
    border: "#ef4444",
    badge: "#ef4444",
    label: "🚨 P1 — CRITIQUE",
    text: "Danger immédiat de mort",
    pulse: true,
  },
  P2: {
    bg: "rgba(249,115,22,0.15)",
    border: "#f97316",
    badge: "#f97316",
    label: "⚠️ P2 — URGENT",
    text: "Consultation < 2 heures",
    pulse: false,
  },
  P3: {
    bg: "rgba(234,179,8,0.12)",
    border: "#eab308",
    badge: "#eab308",
    label: "🔔 P3 — SEMI-URGENT",
    text: "Consultation dans la journée",
    pulse: false,
  },
  NON_URGENT: {
    bg: "rgba(34,197,94,0.12)",
    border: "#22c55e",
    badge: "#22c55e",
    label: "✅ NON URGENT",
    text: "Prendre rendez-vous",
    pulse: false,
  },
}

/* ─────────────── COMPOSANT PRINCIPAL ─────────────── */
export default function ChatbotTriage() {
  const [langue, setLangue] = useState<Langue>("fr")
  const [messages, setMessages] = useState<Message[]>(convInit.fr)
  const [input, setInput] = useState("")
  const [prioriteActuelle, setPrioriteActuelle] = useState<Priorite | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [historique, setHistorique] = useState<Consultation[]>(historiqueInitial)
  const [stats, setStats] = useState<StatJour>(statsInitiales)
  const [onglet, setOnglet] = useState<"chat" | "historique">("chat")
  const [filtreP, setFiltreP] = useState<Priorite | "TOUS">("TOUS")
  const [compteur, setCompteur] = useState(0) // pour animer les stats
  const [showModal, setShowModal] = useState(false)
  const [modalConsult, setModalConsult] = useState<Consultation | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Animation des stats au démarrage
  useEffect(() => {
    let frame = 0
    const target = stats.total
    const interval = setInterval(() => {
      frame += 3
      setCompteur(Math.min(frame, target))
      if (frame >= target) clearInterval(interval)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (onglet === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, onglet])

  const handleLangue = useCallback((l: Langue) => {
    setLangue(l)
    setMessages(convInit[l])
    setPrioriteActuelle(null)
  }, [])

  const envoyer = useCallback(() => {
    if (!input.trim() || isTyping) return
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    const priorite = analyserTexte(input)
    const userMsg: Message = { role: "user", text: input, time: now }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    const delay = 800 + Math.random() * 600
    setTimeout(() => {
      const rep = genererReponse(input, priorite, langue)
      const botMsg: Message = { role: "bot", text: rep, time: now, priorite }
      setMessages(prev => [...prev, botMsg])
      setPrioriteActuelle(priorite)
      setIsTyping(false)
      // Ajouter dans l'historique
      const nouvelleConsult: Consultation = {
        id: `T-${2353 + historique.length - 11}`,
        patient: "Nouveau patient",
        symptomes: input.slice(0, 60) + (input.length > 60 ? "…" : ""),
        priorite,
        service: serviceOrientations[priorite],
        heure: now,
        duree: `${Math.floor(delay / 1000 + 2)} min`,
      }
      setHistorique(prev => [nouvelleConsult, ...prev])
      // Mettre à jour les stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        p1: priorite === "P1" ? prev.p1 + 1 : prev.p1,
        p2: priorite === "P2" ? prev.p2 + 1 : prev.p2,
        p3: priorite === "P3" ? prev.p3 + 1 : prev.p3,
        nonUrgent: priorite === "NON_URGENT" ? prev.nonUrgent + 1 : prev.nonUrgent,
      }))
    }, delay)
  }, [input, isTyping, langue, historique.length])

  const reset = useCallback(() => {
    setMessages(convInit[langue])
    setPrioriteActuelle(null)
  }, [langue])

  const uc = prioriteActuelle ? prioriteConfig[prioriteActuelle] : null
  const historiqueFiltre = filtreP === "TOUS" ? historique : historique.filter(c => c.priorite === filtreP)

  const tauxP = (n: number) => stats.total > 0 ? Math.round((n / stats.total) * 100) : 0
  const tempsMoyenFmt = `${Math.floor(stats.tempsMoyen / 60)} min ${stats.tempsMoyen % 60}s`

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 4px; }
        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .glass-bright {
          background: rgba(14,165,233,0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(14,165,233,0.2);
        }
        .msg-bot {
          background: rgba(14,165,233,0.1);
          border: 1px solid rgba(14,165,233,0.2);
          border-radius: 4px 16px 16px 16px;
          white-space: pre-wrap;
        }
        .msg-user {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border-radius: 16px 16px 4px 16px;
          box-shadow: 0 4px 15px rgba(14,165,233,0.25);
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes fade-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes dot-bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .animate-in { animation: fade-in 0.35s ease forwards; }
        .pulse-critical { animation: pulse-ring 2s infinite; }
        .dot { animation: dot-bounce 1.4s infinite ease-in-out; display: inline-block; width:7px; height:7px; border-radius:50%; background:#0ea5e9; margin: 0 2px; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .stat-bar { transition: width 1.2s cubic-bezier(0.25, 1, 0.5, 1); }
        input:focus { outline: none; box-shadow: 0 0 0 2px rgba(14,165,233,0.4); }
        button { cursor: pointer; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────── */}
      <header style={{
        background: "linear-gradient(135deg, #0c1f3f 0%, #0a1628 100%)",
        borderBottom: "1px solid rgba(14,165,233,0.2)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              boxShadow: "0 0 20px rgba(14,165,233,0.4)",
            }}>🏥</div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, color: "#f0f9ff", margin: 0, lineHeight: 1.2 }}>
                Assistant Triage IA — Ndamatou
              </h1>
              <p style={{ fontSize: 11, color: "#7dd3fc", margin: 0 }}>
                Hôpital Ndamatou · Touba, Sénégal · Classification P1/P2/P3
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Indicateur live */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 20, padding: "4px 12px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse-ring 2s infinite" }} />
              <span style={{ fontSize: 11, color: "#86efac", fontWeight: 600 }}>IA Active 24h/7j</span>
            </div>
            {/* Sélecteur langue */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["fr", "wo", "pu"] as Langue[]).map(l => (
                <button key={l} onClick={() => handleLangue(l)} style={{
                  padding: "5px 12px", borderRadius: 8, border: "none",
                  fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                  background: langue === l ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "rgba(255,255,255,0.06)",
                  color: langue === l ? "#fff" : "#94a3b8",
                }}>
                  {langueLabel[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENU PRINCIPAL ────────────────────────────── */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 20px 24px", display: "grid", gridTemplateColumns: "280px 1fr 260px", gap: 16, minHeight: "calc(100vh - 64px)" }}>

        {/* ═══ SIDEBAR GAUCHE ═══════════════════════════════ */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Niveau urgence actuel */}
          {uc && (
            <div className="animate-in" style={{
              borderRadius: 16, padding: "16px",
              background: uc.bg, border: `1px solid ${uc.border}`,
              ...(prioriteActuelle === "P1" ? {} : {}),
            }}>
              <div className={prioriteActuelle === "P1" ? "pulse-critical" : ""} style={{
                display: "inline-block", padding: "5px 12px", borderRadius: 20,
                background: uc.badge, color: "#fff", fontSize: 11, fontWeight: 800,
                marginBottom: 8,
              }}>
                {uc.label}
              </div>
              <p style={{ fontSize: 12, color: "#cbd5e1", margin: "0 0 10px" }}>{uc.text}</p>
              <div style={{ fontSize: 11, color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
                → {serviceOrientations[prioriteActuelle!]}
              </div>
            </div>
          )}

          {/* Actions recommandées */}
          <div className="glass" style={{ borderRadius: 16, padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#7dd3fc", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
              Actions rapides
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: <Phone size={14} />, label: "Appeler 15 (SAMU)", bg: "#ef4444", hover: "#dc2626" },
                { icon: <MapPin size={14} />, label: "Urgences Ndamatou", bg: "#0ea5e9", hover: "#0284c7" },
                { icon: <Heart size={14} />, label: "Soins intensifs", bg: "#8b5cf6", hover: "#7c3aed" },
                { icon: <Calendar size={14} />, label: "Prendre rendez-vous", bg: "rgba(255,255,255,0.06)", hover: "rgba(255,255,255,0.1)", textColor: "#94a3b8" },
              ].map((a, i) => (
                <button key={i} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  background: a.bg, color: (a as { textColor?: string }).textColor || "#fff",
                  border: "none", borderRadius: 10, padding: "9px 14px",
                  fontSize: 12, fontWeight: 600, transition: "all 0.2s",
                  textAlign: "left",
                }}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Infos hôpital */}
          <div className="glass" style={{ borderRadius: 16, padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#7dd3fc", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
              Contacts Ndamatou
            </h3>
            {[
              { label: "Urgences", val: "+221 33 975 24 00" },
              { label: "SAMU National", val: "15" },
              { label: "Maternité", val: "+221 33 975 24 11" },
              { label: "Adresse", val: "Route de Touba, Dakar" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11 }}>
                <span style={{ color: "#64748b" }}>{c.label}</span>
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{c.val}</span>
              </div>
            ))}
          </div>

          {/* Nouveauté : reset conversation */}
          <button onClick={reset} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
            color: "#7dd3fc", borderRadius: 12, padding: "10px",
            fontSize: 12, fontWeight: 600, transition: "all 0.2s",
          }}>
            <RefreshCw size={13} /> Nouvelle consultation
          </button>
        </aside>

        {/* ═══ ZONE CENTRALE CHAT / HISTORIQUE ═══════════════ */}
        <section className="glass" style={{ borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Onglets */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 20px" }}>
            {([
              { id: "chat", icon: <MessageSquare size={14} />, label: "Chatbot Triage" },
              { id: "historique", icon: <Activity size={14} />, label: `Historique (${historique.length})` },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setOnglet(t.id)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "14px 16px", fontSize: 12, fontWeight: 700, border: "none",
                background: "transparent", cursor: "pointer", transition: "all 0.2s",
                color: onglet === t.id ? "#0ea5e9" : "#475569",
                borderBottom: onglet === t.id ? "2px solid #0ea5e9" : "2px solid transparent",
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ─── ONGLET CHAT ─── */}
          {onglet === "chat" && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
                {messages.map((m, i) => (
                  <div key={i} className="animate-in" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    {m.role === "bot" && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: "78%" }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                        }}>🤖</div>
                        <div>
                          <div style={{ fontSize: 10, color: "#7dd3fc", fontWeight: 700, marginBottom: 4 }}>
                            IA Triage Ndamatou · {m.time}
                          </div>
                          <div className="msg-bot" style={{ padding: "12px 16px", fontSize: 13, color: "#e2e8f0", lineHeight: 1.7 }}>
                            {m.text}
                          </div>
                          {m.priorite && (
                            <div style={{
                              display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6,
                              background: prioriteConfig[m.priorite].bg,
                              border: `1px solid ${prioriteConfig[m.priorite].border}`,
                              borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700,
                              color: prioriteConfig[m.priorite].badge,
                            }}>
                              {prioriteConfig[m.priorite].label}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {m.role === "user" && (
                      <div style={{ maxWidth: "70%" }}>
                        <div className="msg-user" style={{ padding: "12px 16px", fontSize: 13, color: "#fff", lineHeight: 1.6 }}>
                          {m.text}
                        </div>
                        <div style={{ fontSize: 10, color: "#475569", textAlign: "right", marginTop: 4 }}>{m.time}</div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicateur de frappe */}
                {isTyping && (
                  <div className="animate-in" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>🤖</div>
                    <div className="msg-bot" style={{ padding: "12px 18px" }}>
                      <span className="dot" /><span className="dot" /><span className="dot" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {suggestions[langue].map((s, i) => (
                  <button key={i} onClick={() => setInput(s.replace(/^[^\s]+\s/, ""))} style={{
                    padding: "5px 12px", borderRadius: 20,
                    background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
                    color: "#7dd3fc", fontSize: 11, fontWeight: 600,
                    transition: "all 0.2s",
                  }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Zone de saisie */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 10, alignItems: "center" }}>
                <button style={{ padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#475569" }}>
                  <Mic size={16} />
                </button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && envoyer()}
                  placeholder={langue === "wo" ? "Wax ma ci sa yaram..." : langue === "pu" ? "Haala am ko huɓɓi..." : "Décrivez vos symptômes..."}
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, padding: "11px 16px", fontSize: 13, color: "#e2e8f0",
                    transition: "all 0.2s",
                  }}
                />
                <button onClick={envoyer} disabled={isTyping} style={{
                  padding: "10px 16px", borderRadius: 12, border: "none",
                  background: isTyping ? "rgba(14,165,233,0.3)" : "linear-gradient(135deg,#0ea5e9,#0284c7)",
                  color: "#fff", display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                  boxShadow: isTyping ? "none" : "0 4px 15px rgba(14,165,233,0.35)",
                }}>
                  <Send size={15} /> Envoyer
                </button>
              </div>
            </>
          )}

          {/* ─── ONGLET HISTORIQUE ─── */}
          {onglet === "historique" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Filtres */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(["TOUS", "P1", "P2", "P3", "NON_URGENT"] as const).map(f => (
                  <button key={f} onClick={() => setFiltreP(f)} style={{
                    padding: "5px 14px", borderRadius: 20, border: "none",
                    fontSize: 11, fontWeight: 700,
                    background: filtreP === f
                      ? (f === "P1" ? "#ef4444" : f === "P2" ? "#f97316" : f === "P3" ? "#eab308" : f === "NON_URGENT" ? "#22c55e" : "#0ea5e9")
                      : "rgba(255,255,255,0.06)",
                    color: filtreP === f ? "#fff" : "#64748b",
                    transition: "all 0.2s",
                  }}>
                    {f === "NON_URGENT" ? "Non urgent" : f === "TOUS" ? `Tous (${historique.length})` : f}
                  </button>
                ))}
              </div>

              {/* Tableau */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ color: "#475569", textAlign: "left" }}>
                      {["ID", "Patient", "Symptômes", "Priorité", "Service", "Heure", "Durée"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historiqueFiltre.map((c, i) => {
                      const pc = prioriteConfig[c.priorite]
                      return (
                        <tr key={c.id} className="animate-in" onClick={() => { setModalConsult(c); setShowModal(true) }} style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(14,165,233,0.06)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <td style={{ padding: "10px 10px", color: "#7dd3fc", fontWeight: 700 }}>{c.id}</td>
                          <td style={{ padding: "10px 10px", color: "#e2e8f0" }}>{c.patient}</td>
                          <td style={{ padding: "10px 10px", color: "#94a3b8", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.symptomes}</td>
                          <td style={{ padding: "10px 10px" }}>
                            <span style={{
                              display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                              background: pc.bg, border: `1px solid ${pc.border}`, color: pc.badge,
                            }}>
                              {c.priorite === "NON_URGENT" ? "Non urgent" : c.priorite}
                            </span>
                          </td>
                          <td style={{ padding: "10px 10px", color: "#64748b", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.service}</td>
                          <td style={{ padding: "10px 10px", color: "#94a3b8" }}>{c.heure}</td>
                          <td style={{ padding: "10px 10px", color: "#94a3b8" }}>{c.duree}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ═══ SIDEBAR DROITE — STATS ═══════════════════════ */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* KPI Principal */}
          <div className="glass-bright" style={{ borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#7dd3fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Triages aujourd'hui</span>
              <BarChart3 size={14} style={{ color: "#0ea5e9" }} />
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#0ea5e9", lineHeight: 1 }}>{compteur}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>+12% vs hier (113)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              <TrendingUp size={11} style={{ color: "#22c55e" }} />
              <span style={{ fontSize: 10, color: "#22c55e" }}>Journée active</span>
            </div>
          </div>

          {/* Répartition P1/P2/P3 */}
          <div className="glass" style={{ borderRadius: 16, padding: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#7dd3fc", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 }}>
              Répartition des priorités
            </h3>
            {[
              { label: "P1 — Critique", count: stats.p1, color: "#ef4444" },
              { label: "P2 — Urgent", count: stats.p2, color: "#f97316" },
              { label: "P3 — Semi-urgent", count: stats.p3, color: "#eab308" },
              { label: "Non urgent", count: stats.nonUrgent, color: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.count} <span style={{ color: "#475569", fontWeight: 400 }}>({tauxP(s.count)}%)</span></span>
                </div>
                <div style={{ height: 5, borderRadius: 4, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div className="stat-bar" style={{
                    height: "100%", borderRadius: 4, background: s.color,
                    width: `${tauxP(s.count)}%`, opacity: 0.85,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Métriques clés */}
          <div className="glass" style={{ borderRadius: 16, padding: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#7dd3fc", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
              Métriques clés
            </h3>
            {[
              { icon: <Clock size={14} style={{ color: "#0ea5e9" }} />, label: "Temps moyen triage", val: tempsMoyenFmt },
              { icon: <Users size={14} style={{ color: "#8b5cf6" }} />, label: "En attente", val: "8 patients" },
              { icon: <Zap size={14} style={{ color: "#f97316" }} />, label: "Taux P1 détecté", val: `${tauxP(stats.p1)}%` },
              { icon: <ShieldPlus size={14} style={{ color: "#22c55e" }} />, label: "Taux résolution", val: "94.3%" },
              { icon: <Thermometer size={14} style={{ color: "#ef4444" }} />, label: "Cas fièvre haute", val: "31" },
              { icon: <CheckCircle size={14} style={{ color: "#22c55e" }} />, label: "Pris en charge", val: `${stats.total - 8}` },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748b" }}>
                  {m.icon} {m.label}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{m.val}</span>
              </div>
            ))}
          </div>

          {/* Services les plus sollicités */}
          <div className="glass" style={{ borderRadius: 16, padding: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#7dd3fc", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
              Top services
            </h3>
            {[
              { service: "Urgences / Réa", n: 42 },
              { service: "Cardiologie", n: 28 },
              { service: "Pédiatrie", n: 21 },
              { service: "Maternité", n: 18 },
              { service: "Médecine interne", n: 14 },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: "#0ea5e9", fontWeight: 800, width: 14 }}>{i + 1}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", flex: 1 }}>{s.service}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{s.n}</span>
              </div>
            ))}
          </div>
        </aside>
      </main>

      {/* ═══ MODAL DÉTAIL CONSULTATION ═══════════════════════ */}
      {showModal && modalConsult && (
        <div onClick={() => setShowModal(false)} style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div className="animate-in glass" onClick={e => e.stopPropagation()} style={{
            borderRadius: 20, padding: 28, width: 420, maxWidth: "90vw",
            border: "1px solid rgba(14,165,233,0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#f0f9ff", margin: 0 }}>Détail Consultation {modalConsult.id}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#475569", padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            {[
              { label: "Patient", val: modalConsult.patient },
              { label: "Symptômes", val: modalConsult.symptomes },
              { label: "Priorité", val: modalConsult.priorite },
              { label: "Service orienté", val: modalConsult.service },
              { label: "Heure triage", val: modalConsult.heure },
              { label: "Durée analyse", val: modalConsult.duree },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 13 }}>
                <span style={{ color: "#475569", width: 120, flexShrink: 0 }}>{f.label}</span>
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                  {f.label === "Priorité"
                    ? <span style={{ color: prioriteConfig[modalConsult.priorite].badge, fontWeight: 800 }}>{f.val}</span>
                    : f.val}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontWeight: 600, fontSize: 12,
              }}>Fermer</button>
              <button style={{
                flex: 1, padding: "10px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#0ea5e9,#0284c7)", color: "#fff", fontWeight: 700, fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <ArrowRight size={13} /> Ouvrir dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BARRE STATS BAS DE PAGE ═══════════════════════ */}
      <footer style={{
        background: "linear-gradient(90deg, rgba(14,165,233,0.06) 0%, rgba(2,132,199,0.06) 100%)",
        borderTop: "1px solid rgba(14,165,233,0.15)",
        padding: "14px 20px",
        position: "sticky", bottom: 0,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#475569", fontWeight: 700, marginRight: 8 }}>
            📊 STATS DU JOUR — Hôpital Ndamatou
          </span>
          {[
            { label: "Total triages", val: stats.total, color: "#0ea5e9" },
            { label: "🚨 P1 critiques", val: stats.p1, color: "#ef4444" },
            { label: "⚠️ P2 urgents", val: stats.p2, color: "#f97316" },
            { label: "🔔 P3 semi-urgents", val: stats.p3, color: "#eab308" },
            { label: "✅ Non urgents", val: stats.nonUrgent, color: "#22c55e" },
            { label: "⏱️ Tps moyen", val: tempsMoyenFmt, color: "#7dd3fc" },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "4px 12px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, fontSize: 11,
            }}>
              <span style={{ color: "#475569" }}>{s.label}</span>
              <span style={{ color: s.color, fontWeight: 800 }}>{s.val}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <Info size={10} style={{ color: "#334155" }} />
            <span style={{ fontSize: 10, color: "#334155" }}>IA Triage v2.4 · Hôpital Ndamatou · Touba, Sénégal</span>
          </div>
        </div>
      </footer>
    </>
  )
}

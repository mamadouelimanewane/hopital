"use client"
import { useState } from "react"
import { BookOpen, Cpu, Award, Video, FileText, Star, Users, Clock, ChevronRight, Play } from "lucide-react"

type Onglet = "formations" | "simulations" | "certifications" | "staffs" | "ressources"

const modules = [
  { titre: "Réanimation Cardio-Pulmonaire (RCP)", duree: "12h", niveau: "Tous niveaux", inscrits: 124, progression: 65, icone: "❤️", specialite: "Urgences" },
  { titre: "Chirurgie Laparoscopique Avancée", duree: "40h", niveau: "Chirurgiens", inscrits: 18, progression: 0, icone: "🔪", specialite: "Chirurgie" },
  { titre: "Prise en charge du Paludisme Grave", duree: "8h", niveau: "Urgentistes", inscrits: 87, progression: 100, icone: "🦟", specialite: "Infectiologie" },
  { titre: "Obstétrique d'Urgence ALSO", duree: "16h", niveau: "Sages-femmes", inscrits: 42, progression: 30, icone: "🤰", specialite: "Obstétrique" },
  { titre: "Nutrition Clinique & Dénutrition", duree: "6h", niveau: "Dietéticiens", inscrits: 29, progression: 0, icone: "🥗", specialite: "Nutrition" },
  { titre: "Santé Mentale & Premiers Secours Psy", duree: "10h", niveau: "Tous soignants", inscrits: 156, progression: 80, icone: "🧠", specialite: "Psychiatrie" },
  { titre: "Anesthésie Locorégionale Echoguidée", duree: "24h", niveau: "Anesthésistes", inscrits: 9, progression: 45, icone: "💉", specialite: "Anesthésie" },
  { titre: "Gestion des Sepsis Sévères", duree: "8h", niveau: "Réanimateurs", inscrits: 34, progression: 0, icone: "🧫", specialite: "Réanimation" },
]

const casSimulation = [
  { titre: "Patient 45 ans — Douleur thoracique aiguë", difficulte: 4, specialite: "Cardiologie", duree: "25 min", tentatives: 847 },
  { titre: "Enfant 3 ans — Fièvre 40°C + convulsions", difficulte: 3, specialite: "Pédiatrie", duree: "20 min", tentatives: 623 },
  { titre: "Femme 28 ans — Hémorragie du post-partum", difficulte: 5, specialite: "Obstétrique", duree: "35 min", tentatives: 412 },
  { titre: "Homme 67 ans — AVC ischémique aigu", difficulte: 4, specialite: "Neurologie", duree: "30 min", tentatives: 534 },
  { titre: "Enfant 8 ans — Asthme aigu grave", difficulte: 3, specialite: "Pédiatrie", duree: "18 min", tentatives: 789 },
]

const certifications = [
  { titre: "ACLS — Advanced Cardiac Life Support", statut: "Obtenu", date: "15/03/2025", expiration: "15/03/2027", score: 94 },
  { titre: "ATLS — Advanced Trauma Life Support", statut: "En cours", date: "—", expiration: "—", score: 71 },
  { titre: "RCP Nouveau-né", statut: "Expiré", date: "01/01/2024", expiration: "01/01/2026", score: 88 },
  { titre: "Gestion du Paludisme Grave OMS", statut: "Obtenu", date: "20/06/2025", expiration: "20/06/2027", score: 97 },
]

const staffsVirtuels = [
  { titre: "Cas complexe de cardiomyopathie dilatée", date: "25 Juin 2026, 14h00", participants: 12, statut: "À venir" },
  { titre: "Stratégie thérapeutique — Paludisme résistant", date: "28 Juin 2026, 10h30", participants: 8, statut: "À venir" },
  { titre: "Revue de morbi-mortalité — Maternité Juin", date: "02 Juil 2026, 08h00", participants: 15, statut: "À venir" },
  { titre: "Gestion post-opératoire laparoscopie", date: "18 Juin 2026", participants: 6, statut: "Archivé" },
]

export default function CHNCAKAcademy() {
  const [onglet, setOnglet] = useState<Onglet>("formations")
  const [simActive, setSimActive] = useState<number | null>(null)
  const [reponseSim, setReponseSim] = useState<number | null>(null)

  return (
    <>
      <style>{`
        body { margin:0; background:#0d0721; color:#e2e8f0; font-family:'Inter',system-ui,sans-serif; }
        .card { background:rgba(30,20,60,0.8); border:1px solid rgba(124,58,237,0.2); border-radius:14px; transition:border-color 0.2s,transform 0.2s; }
        .card:hover { border-color:rgba(124,58,237,0.6); transform:translateY(-2px); }
        .fade { animation:fade 0.3s ease-out; }
        @keyframes fade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .star { color:#fbbf24; }
        .star-empty { color:#374151; }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,22,40,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13, fontWeight:600 }}>
          ← Retour au Portail CHNCAK
        </a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed,#6d28d9)" }} className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🎓</div>
              <div>
                <h1 className="text-2xl font-black text-white">CHNCAK <span className="font-light">Academy</span></h1>
                <p className="text-purple-200 text-xs">Centre de Référence Médicale — Afrique de l'Ouest</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Niveau Expert</span>
              <span className="text-purple-300 text-xs">2,847 XP</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Apprenants actifs", val: "847", icon: "👤" },
              { label: "Modules disponibles", val: "124", icon: "📚" },
              { label: "Certifications délivrées", val: "1,203", icon: "🏆" },
              { label: "Pays représentés", val: "15", icon: "🌍" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-purple-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 pb-10">
        {/* ONGLETS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "formations", icon: <BookOpen className="w-4 h-4" />, label: "Formations" },
            { key: "simulations", icon: <Cpu className="w-4 h-4" />, label: "Simulations" },
            { key: "certifications", icon: <Award className="w-4 h-4" />, label: "Certifications" },
            { key: "staffs", icon: <Video className="w-4 h-4" />, label: "Staffs Virtuels" },
            { key: "ressources", icon: <FileText className="w-4 h-4" />, label: "Ressources" },
          ] as { key: Onglet; icon: React.ReactNode; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setOnglet(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${onglet === t.key ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300 hover:bg-purple-900/40"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* FORMATIONS */}
        {onglet === "formations" && (
          <div className="fade grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {modules.map((m, i) => (
              <div key={i} className="card p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">{m.icone}</span>
                  <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full font-semibold">{m.specialite}</span>
                </div>
                <h3 className="font-bold text-white mb-1 text-sm leading-snug">{m.titre}</h3>
                <div className="flex gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.duree}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.inscrits} inscrits</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{m.niveau}</div>
                {m.progression > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progression</span><span>{m.progression}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full">
                      <div className={`h-full rounded-full ${m.progression === 100 ? "bg-green-500" : "bg-purple-500"}`} style={{ width: `${m.progression}%` }}></div>
                    </div>
                  </div>
                )}
                <button className={`w-full py-2 rounded-lg text-sm font-bold transition ${m.progression === 100 ? "bg-green-600 hover:bg-green-700 text-white" : m.progression > 0 ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"}`}>
                  {m.progression === 100 ? "✅ Complété" : m.progression > 0 ? "Continuer →" : "Commencer"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SIMULATIONS */}
        {onglet === "simulations" && (
          <div className="fade space-y-4">
            {simActive === null ? (
              <>
                <p className="text-gray-400 text-sm mb-4">Entraînez-vous sur des cas cliniques réels anonymisés. Chaque cas est noté et contribue à votre score.</p>
                {casSimulation.map((c, i) => (
                  <div key={i} className="card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-900/40 text-blue-300 text-xs px-2 py-0.5 rounded-full">{c.specialite}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= c.difficulte ? "star" : "star-empty"}`} />)}
                        </div>
                      </div>
                      <h3 className="font-bold text-white">{c.titre}</h3>
                      <div className="flex gap-4 text-xs text-gray-400 mt-1">
                        <span>⏱ {c.duree}</span>
                        <span>👥 {c.tentatives.toLocaleString()} tentatives</span>
                      </div>
                    </div>
                    <button onClick={() => { setSimActive(i); setReponseSim(null) }}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition whitespace-nowrap">
                      <Play className="w-4 h-4" /> Simuler
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <div className="card p-6 max-w-2xl mx-auto">
                <button onClick={() => setSimActive(null)} className="text-purple-400 text-sm mb-4 hover:underline">← Retour aux simulations</button>
                <h3 className="font-black text-white text-lg mb-2">{casSimulation[simActive].titre}</h3>
                <p className="text-gray-400 text-sm mb-6">Un patient se présente aux urgences. Vous êtes le médecin de garde. Quelle est votre première action ?</p>
                <div className="space-y-3">
                  {["Bilan sanguin en urgence (NFS, ionogramme, troponine)", "ECG 12 dérivations immédiat", "Administration d'aspirine 250mg", "Appel du cardiologue de garde"].map((opt, j) => (
                    <button key={j} onClick={() => setReponseSim(j)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${reponseSim === null ? "border-gray-600 hover:border-purple-500 text-gray-300" : j === 1 ? "border-green-500 bg-green-900/30 text-green-300" : reponseSim === j ? "border-red-500 bg-red-900/30 text-red-300" : "border-gray-700 text-gray-500"}`}>
                      {String.fromCharCode(65+j)}. {opt}
                      {reponseSim !== null && j === 1 && " ✅ Bonne réponse"}
                      {reponseSim !== null && reponseSim === j && j !== 1 && " ❌"}
                    </button>
                  ))}
                </div>
                {reponseSim !== null && (
                  <div className="mt-4 bg-blue-900/30 border border-blue-700/40 rounded-xl p-4 text-sm text-blue-200">
                    <strong>Explication :</strong> L'ECG est prioritaire devant une douleur thoracique — il permet de diagnostiquer un SCA en quelques minutes et conditionne toute la prise en charge ultérieure.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {onglet === "certifications" && (
          <div className="fade grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((c, i) => (
              <div key={i} className="card p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white text-sm leading-snug flex-1 pr-2">{c.titre}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap ${c.statut === "Obtenu" ? "bg-green-900/50 text-green-400" : c.statut === "En cours" ? "bg-blue-900/50 text-blue-400" : "bg-red-900/50 text-red-400"}`}>
                    {c.statut}
                  </span>
                </div>
                {c.statut !== "En cours" && (
                  <div className="flex gap-4 text-xs text-gray-400 mb-3">
                    <span>Obtenu: {c.date}</span>
                    <span>Expire: {c.expiration}</span>
                  </div>
                )}
                {c.statut === "En cours" && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progression</span><span>{c.score}%</span></div>
                    <div className="h-1.5 bg-gray-700 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.score}%` }}></div></div>
                  </div>
                )}
                {c.statut === "Obtenu" && (
                  <div className="flex items-center gap-2 text-green-400 text-xs font-semibold mb-3">
                    <Award className="w-4 h-4" /> Score: {c.score}/100
                  </div>
                )}
                {c.statut === "Expiré" && (
                  <p className="text-red-400 text-xs mb-3 font-semibold">⚠️ Renouvellement requis</p>
                )}
                <button className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center gap-1 transition">
                  {c.statut === "Obtenu" ? "Télécharger PDF" : c.statut === "En cours" ? "Continuer →" : "Se réinscrire"} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* STAFFS VIRTUELS */}
        {onglet === "staffs" && (
          <div className="fade space-y-4">
            <h3 className="font-bold text-white mb-2">Prochains staffs cliniques virtuels</h3>
            {staffsVirtuels.map((s, i) => (
              <div key={i} className="card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.statut === "À venir" ? "bg-blue-900/50 text-blue-300" : "bg-gray-700 text-gray-400"}`}>{s.statut}</span>
                  </div>
                  <h4 className="font-bold text-white">{s.titre}</h4>
                  <div className="flex gap-4 text-xs text-gray-400 mt-1">
                    <span>📅 {s.date}</span>
                    <span>👥 {s.participants} participants</span>
                  </div>
                </div>
                <button className={`px-5 py-2.5 rounded-lg text-sm font-bold transition whitespace-nowrap ${s.statut === "À venir" ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-white/10 hover:bg-white/20 text-gray-300"}`}>
                  {s.statut === "À venir" ? "S'inscrire" : "Voir l'archive"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* RESSOURCES */}
        {onglet === "ressources" && (
          <div className="fade grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Protocoles CHNCAK 2026", "Guide Paludisme Grave — OMS", "Manuel Obstétrique d'Urgence", "Atlas Anatomique Interactif", "Pharmacopée Hospitalière", "Guides de Bonne Pratique"].map((r, i) => (
              <div key={i} className="card p-5 flex items-center gap-4 cursor-pointer hover:border-purple-500">
                <div className="w-10 h-10 bg-purple-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{r}</h4>
                  <p className="text-xs text-gray-500">PDF — Mise à jour 2026</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

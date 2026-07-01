"use client"
import { useState } from "react"
import { FlaskConical, AlertTriangle, Clock, CheckCircle, ChevronRight, Search, Download, Zap } from "lucide-react"

const analyses = [
  { id: "LAB-2847", patient: "Awa Diop", type: "Numération Formule Sanguine", resultat: "Hémoglobine 9.2 g/dL", normal: "12-16 g/dL", statut: "Anormal", medecin: "Dr. Ndiaye", urgence: true },
  { id: "LAB-2846", patient: "Moussa Sow", type: "Glycémie à Jeun", resultat: "1.87 g/L", normal: "0.70-1.10 g/L", statut: "Critique", medecin: "Dr. Ba", urgence: true },
  { id: "LAB-2845", patient: "Fatou Fall", type: "Créatinine Sanguine", resultat: "8.2 mg/L", normal: "6-12 mg/L", statut: "Normal", medecin: "Dr. Diallo", urgence: false },
  { id: "LAB-2844", patient: "Ibrahima Ly", type: "Transaminases ALAT", resultat: "187 UI/L", normal: "7-56 UI/L", statut: "Critique", medecin: "Dr. Ndiaye", urgence: true },
  { id: "LAB-2843", patient: "Mariama Gueye", type: "PCR Paludisme", resultat: "Positif — Plasmodium falciparum", normal: "Négatif", statut: "Anormal", medecin: "Dr. Seck", urgence: true },
  { id: "LAB-2842", patient: "Cheikh Mbaye", type: "Cholestérol Total", resultat: "1.95 g/L", normal: "<2.00 g/L", statut: "Normal", medecin: "Dr. Ba", urgence: false },
  { id: "LAB-2841", patient: "Rokhaya Cissé", type: "Groupe Sanguin + Rhésus", resultat: "B Rhésus Négatif", normal: "—", statut: "Normal", medecin: "Dr. Diallo", urgence: false },
  { id: "LAB-2840", patient: "Omar Sarr", type: "Protéine C-Réactive (CRP)", resultat: "142 mg/L", normal: "<5 mg/L", statut: "Critique", medecin: "Dr. Ndiaye", urgence: true },
]

const enCours = [
  { id: "LAB-2848", patient: "Aissatou Barry", type: "Bilan Rénal Complet", etape: 3, total: 5, debut: "09:15" },
  { id: "LAB-2849", patient: "Lamine Diagne", type: "Sérologie VIH", etape: 2, total: 5, debut: "09:42" },
  { id: "LAB-2850", patient: "Ndèye Thiam", type: "Test de Grossesse Sérique", etape: 4, total: 5, debut: "10:05" },
  { id: "LAB-2851", patient: "Aliou Koné", type: "Ionogramme Sanguin", etape: 1, total: 5, debut: "10:30" },
]

const etapes = ["Prélèvement", "Centrifugation", "Analyse", "Validation", "Transmission"]

export default function LabConnect() {
  const [onglet, setOnglet] = useState<"resultats" | "encours" | "critiques" | "historique">("resultats")
  const [recherche, setRecherche] = useState("")

  const critiques = analyses.filter(a => a.statut === "Critique")
  const filtres = analyses.filter(a =>
    a.patient.toLowerCase().includes(recherche.toLowerCase()) ||
    a.type.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <>
      <style>{`
        body { margin:0; background:#f0f7ff; color:#1e293b; font-family:'Inter',system-ui,sans-serif; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .fade { animation: fade 0.4s ease-out; }
        @keyframes fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .progress-bar { transition: width 0.6s ease; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)" }} className="text-white px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">Lab Connect <span className="font-light">Ndamatou</span></h1>
                <p className="text-blue-200 text-xs">Laboratoire d'analyses connecté en temps réel</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse"></span>
              <span className="text-sm font-semibold">Système Actif</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "En cours", val: "47", color: "bg-blue-500/30" },
              { label: "Résultats prêts", val: "12", color: "bg-green-500/30" },
              { label: "Alertes critiques", val: "4", color: "bg-red-500/30" },
              { label: "Délai moyen", val: "2h15", color: "bg-purple-500/30" },
            ].map((s, i) => (
              <div key={i} className={`${s.color} backdrop-blur-sm rounded-xl p-3 text-center`}>
                <div className="text-2xl font-black">{s.val}</div>
                <div className="text-xs text-blue-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ONGLETS */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["resultats", "encours", "critiques", "historique"] as const).map(t => (
            <button key={t} onClick={() => setOnglet(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${onglet === t ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-blue-50"}`}>
              {t === "resultats" && "📋 Résultats prêts"}
              {t === "encours" && "⏳ En cours (47)"}
              {t === "critiques" && <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-red-500" />Critiques ({critiques.length})</span>}
              {t === "historique" && "📁 Historique"}
            </button>
          ))}
        </div>

        {/* RÉSULTATS */}
        {onglet === "resultats" && (
          <div className="fade">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={recherche} onChange={e => setRecherche(e.target.value)}
                placeholder="Rechercher patient ou type d'examen..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["ID", "Patient", "Examen", "Résultat", "Valeurs Normales", "Statut", "Médecin", "Action"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtres.map((a, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.id}</td>
                      <td className="px-4 py-3 font-semibold">{a.patient}</td>
                      <td className="px-4 py-3 text-gray-600">{a.type}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${a.statut === "Critique" ? "text-red-600" : a.statut === "Anormal" ? "text-orange-600" : "text-green-600"}`}>
                          {a.resultat}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{a.normal}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${a.statut === "Critique" ? "bg-red-100 text-red-700" : a.statut === "Anormal" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                          {a.statut === "Critique" && "🚨 "}{a.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.medecin}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:underline text-xs font-semibold flex items-center gap-1">
                          Transmettre <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EN COURS */}
        {onglet === "encours" && (
          <div className="fade space-y-4">
            {enCours.map((a, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-mono text-xs text-gray-400">{a.id}</span>
                    <h3 className="font-bold text-gray-900">{a.patient}</h3>
                    <p className="text-sm text-gray-500">{a.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" /> Début {a.debut}
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {etapes.map((e, j) => (
                    <div key={j} className="flex-1 text-center">
                      <div className={`h-2 rounded-full mb-1 ${j < a.etape ? "bg-blue-500" : j === a.etape ? "bg-blue-300 pulse" : "bg-gray-100"}`}></div>
                      <span className="text-xs text-gray-400 hidden md:block">{e}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-600 font-semibold">Étape {a.etape}/{a.total} — {etapes[a.etape - 1]}</p>
              </div>
            ))}
          </div>
        )}

        {/* CRITIQUES */}
        {onglet === "critiques" && (
          <div className="fade space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm font-semibold">{critiques.length} résultats critiques nécessitent une action immédiate</p>
            </div>
            {critiques.map((a, i) => (
              <div key={i} className="bg-white border-l-4 border-red-500 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">🚨 CRITIQUE</span>
                    <h3 className="font-bold text-gray-900 mt-2">{a.patient} — {a.type}</h3>
                    <p className="text-red-600 font-semibold text-sm mt-1">{a.resultat}</p>
                    <p className="text-gray-400 text-xs">Valeur normale : {a.normal}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition">Appeler {a.medecin}</button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">Voir dossier</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HISTORIQUE */}
        {onglet === "historique" && (
          <div className="fade bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Historique des analyses</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                <Download className="w-4 h-4" /> Exporter
              </button>
            </div>
            <div className="text-center py-12 text-gray-400">
              <Zap className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="font-semibold">Historique — 3,847 analyses archivées</p>
              <p className="text-sm mt-1">Utilisez la recherche ci-dessus pour filtrer par patient ou période</p>
            </div>
          </div>
        )}

        <div className="h-10"></div>
      </div>
    </>
  )
}

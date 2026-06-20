"use client"
import { useState } from "react"
import { Users, Calendar, Award, Plane, Star, AlertTriangle, Phone, Mail, CheckCircle } from "lucide-react"

type Onglet = "personnel" | "gardes" | "competences" | "conges" | "evaluations"

const personnel = [
  { nom: "Dr. Ousmane Ndiaye", matricule: "MED-001", specialite: "Cardiologie", service: "Cardiologie", statut: "En service", tel: "+221 77 123 45 67", email: "o.ndiaye@chncak.sn" },
  { nom: "Dr. Fatou Ba", matricule: "MED-002", specialite: "Pédiatrie", service: "Pédiatrie", statut: "En garde", tel: "+221 77 234 56 78", email: "f.ba@chncak.sn" },
  { nom: "Dr. Ibrahima Diallo", matricule: "MED-003", specialite: "Chirurgie Générale", service: "Bloc Opératoire", statut: "En service", tel: "+221 77 345 67 89", email: "i.diallo@chncak.sn" },
  { nom: "Inf. Moussa Seck", matricule: "INF-001", specialite: "Urgences", service: "Urgences", statut: "En service", tel: "+221 77 456 78 90", email: "m.seck@chncak.sn" },
  { nom: "Dr. Aissatou Fall", matricule: "MED-004", specialite: "Gynécologie-Obstétrique", service: "Maternité", statut: "En congé", tel: "+221 77 567 89 01", email: "a.fall@chncak.sn" },
  { nom: "Dr. Cheikh Mbaye", matricule: "MED-005", specialite: "Neurologie", service: "Neurologie", statut: "Formation", tel: "+221 77 678 90 12", email: "c.mbaye@chncak.sn" },
  { nom: "Inf. Mariama Gueye", matricule: "INF-002", specialite: "Réanimation", service: "Réanimation", statut: "En garde", tel: "+221 77 789 01 23", email: "m.gueye@chncak.sn" },
  { nom: "Dr. Lamine Diagne", matricule: "MED-006", specialite: "Radiologie", service: "Imagerie Médicale", statut: "En service", tel: "+221 77 890 12 34", email: "l.diagne@chncak.sn" },
  { nom: "Dr. Rokhaya Cissé", matricule: "MED-007", specialite: "Anesthésie-Réanimation", service: "Bloc Opératoire", statut: "En service", tel: "+221 77 901 23 45", email: "r.cisse@chncak.sn" },
  { nom: "Inf. Omar Sarr", matricule: "INF-003", specialite: "Pédiatrie", service: "Pédiatrie", statut: "En service", tel: "+221 77 012 34 56", email: "o.sarr@chncak.sn" },
]

const gardes = [
  { service: "Urgences", jours: ["Dr. Diallo", "Inf. Seck", "Dr. Ndiaye", "Inf. Gueye", "—", "Dr. Ba", "Inf. Seck"] },
  { service: "Réanimation", jours: ["Dr. Cissé", "Dr. Cissé", "Dr. Mbaye", "Dr. Diallo", "Dr. Cissé", "Dr. Diagne", "—"] },
  { service: "Maternité", jours: ["Dr. Fall", "Dr. Fall", "Sage-f. Ly", "Sage-f. Ly", "Dr. Fall", "Sage-f. Ndao", "Sage-f. Ly"] },
  { service: "Cardiologie", jours: ["Dr. Ndiaye", "—", "Dr. Ndiaye", "—", "Dr. Ndiaye", "—", "Dr. Ndiaye"] },
]

const jours = ["Lun 23", "Mar 24", "Mer 25", "Jeu 26", "Ven 27", "Sam 28", "Dim 29"]

const conges = [
  { nom: "Dr. Aissatou Fall", periode: "15/06 — 30/06/2026", motif: "Congé annuel", statut: "Approuvé", couvert: true },
  { nom: "Inf. Moussa Seck", periode: "25/06 — 02/07/2026", motif: "Maladie", statut: "En attente", couvert: false },
  { nom: "Dr. Cheikh Mbaye", periode: "20/06 — 25/06/2026", motif: "Formation DU", statut: "Approuvé", couvert: true },
  { nom: "Inf. Omar Sarr", periode: "01/07 — 15/07/2026", motif: "Congé annuel", statut: "En attente", couvert: true },
]

const evaluations = [
  { nom: "Dr. Ousmane Ndiaye", score: 94, dernier: "Mars 2026", prochain: "Sept 2026", commentaire: "Excellent technicien, très apprécié des patients" },
  { nom: "Dr. Fatou Ba", score: 88, dernier: "Avril 2026", prochain: "Oct 2026", commentaire: "Bonne maîtrise, quelques axes d'amélioration en urgences" },
  { nom: "Inf. Moussa Seck", score: 91, dernier: "Fév 2026", prochain: "Août 2026", commentaire: "Réactivité exemplaire aux urgences" },
  { nom: "Dr. Ibrahima Diallo", score: 96, dernier: "Mai 2026", prochain: "Nov 2026", commentaire: "Chirurgien de référence, formateur reconnu" },
]

const statutColor: Record<string, string> = {
  "En service": "bg-green-100 text-green-700",
  "En garde": "bg-blue-100 text-blue-700",
  "En congé": "bg-yellow-100 text-yellow-700",
  "Formation": "bg-purple-100 text-purple-700",
}

export default function RHMedical() {
  const [onglet, setOnglet] = useState<Onglet>("personnel")

  return (
    <>
      <style>{`
        body { margin:0; background:#f8fafc; color:#1e293b; font-family:'Inter',system-ui,sans-serif; }
        .fade { animation:fade 0.3s ease-out; }
        @keyframes fade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,22,40,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13, fontWeight:600 }}>
          ← Retour au Portail CHNCAK
        </a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#4338ca,#7c3aed)" }} className="text-white px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black">RH Médical <span className="font-light">CHNCAK</span></h1>
                <p className="text-indigo-200 text-xs">Gestion des ressources humaines médicales</p>
              </div>
            </div>
            <div className="bg-red-500/20 border border-red-400/30 px-3 py-2 rounded-lg text-xs font-semibold">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Sous-effectif Urgences — Mer 25/06
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Effectif total", val: "247" },
              { label: "En garde ce soir", val: "12" },
              { label: "Congés non couverts", val: "1", alert: true },
              { label: "En formation", val: "8" },
            ].map((s, i) => (
              <div key={i} className={`${s.alert ? "bg-red-500/30" : "bg-white/10"} backdrop-blur-sm rounded-xl p-3 text-center`}>
                <div className="text-2xl font-black">{s.val}</div>
                <div className="text-xs text-indigo-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 pb-10">
        {/* ONGLETS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "personnel", icon: <Users className="w-4 h-4" />, label: "Personnel" },
            { key: "gardes", icon: <Calendar className="w-4 h-4" />, label: "Planning Gardes" },
            { key: "competences", icon: <Award className="w-4 h-4" />, label: "Compétences" },
            { key: "conges", icon: <Plane className="w-4 h-4" />, label: "Congés" },
            { key: "evaluations", icon: <Star className="w-4 h-4" />, label: "Évaluations" },
          ] as { key: Onglet; icon: React.ReactNode; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setOnglet(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${onglet === t.key ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-indigo-50"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* PERSONNEL */}
        {onglet === "personnel" && (
          <div className="fade bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Liste du personnel médical ({personnel.length} affichés)</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">+ Ajouter</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Nom", "Matricule", "Spécialité", "Service", "Statut", "Contact", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {personnel.map((p, i) => (
                  <tr key={i} className="hover:bg-indigo-50/20 transition">
                    <td className="px-4 py-3 font-semibold">{p.nom}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.matricule}</td>
                    <td className="px-4 py-3 text-gray-600">{p.specialite}</td>
                    <td className="px-4 py-3 text-gray-600">{p.service}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statutColor[p.statut]}`}>{p.statut}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <a href={`tel:${p.tel}`} className="text-gray-400 hover:text-indigo-600 transition"><Phone className="w-4 h-4" /></a>
                        <a href={`mailto:${p.email}`} className="text-gray-400 hover:text-indigo-600 transition"><Mail className="w-4 h-4" /></a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-indigo-600 hover:underline text-xs font-semibold">Voir profil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PLANNING GARDES */}
        {onglet === "gardes" && (
          <div className="fade">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Planning des gardes — Semaine du 23 au 29 Juin 2026</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                ✨ Générer planning IA
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Service</th>
                    {jours.map(j => <th key={j} className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase">{j}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gardes.map((g, i) => (
                    <tr key={i} className="hover:bg-indigo-50/10">
                      <td className="px-4 py-4 font-semibold text-gray-800">{g.service}</td>
                      {g.jours.map((j, k) => (
                        <td key={k} className="px-3 py-4 text-center">
                          {j === "—" ? (
                            <span className="text-red-400 font-bold">⚠️</span>
                          ) : (
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg font-medium">{j}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">⚠️ Les cellules rouges indiquent un poste non couvert</p>
          </div>
        )}

        {/* COMPÉTENCES */}
        {onglet === "competences" && (
          <div className="fade grid grid-cols-1 md:grid-cols-2 gap-4">
            {personnel.slice(0, 8).map((p, i) => {
              const competences = [
                ["Urgences", "Réanimation", "Chirurgie"],
                ["Pédiatrie", "Néonatologie", "Urgences pédiatriques"],
                ["Chirurgie générale", "Laparoscopie", "Transplantation"],
                ["Soins intensifs", "Triage", "Cathétérisme"],
                ["Obstétrique", "Gynécologie", "Echographie"],
                ["Neurochirurgie", "IRM", "EEG"],
                ["Réa adulte", "Ventilation", "Monitoring"],
                ["Scanner", "IRM", "Radiologie interventionnelle"],
              ]
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{p.nom}</h4>
                      <p className="text-sm text-gray-500">{p.service}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statutColor[p.statut]}`}>{p.statut}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(competences[i] || []).map((c, j) => (
                      <span key={j} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-medium">{c}</span>
                    ))}
                  </div>
                  {i === 0 && <p className="text-xs text-orange-600 mt-3 font-semibold">⚠️ Certification ACLS — Expire dans 30 jours</p>}
                </div>
              )
            })}
          </div>
        )}

        {/* CONGÉS */}
        {onglet === "conges" && (
          <div className="fade">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Demandes de congés</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">+ Nouvelle demande</button>
            </div>
            <div className="space-y-3">
              {conges.map((c, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{c.nom}</h4>
                    <p className="text-sm text-gray-500 mt-1">📅 {c.periode} — {c.motif}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {c.couvert ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-semibold"><CheckCircle className="w-3 h-3" />Service couvert</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-semibold"><AlertTriangle className="w-3 h-3" />Couverture requise</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.statut === "Approuvé" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {c.statut}
                    </span>
                    {c.statut === "En attente" && (
                      <div className="flex gap-2">
                        <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition">Approuver</button>
                        <button className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition">Refuser</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ÉVALUATIONS */}
        {onglet === "evaluations" && (
          <div className="fade space-y-4">
            {evaluations.map((e, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{e.nom}</h4>
                    <p className="text-sm text-gray-500 mt-1 italic">"{e.commentaire}"</p>
                    <p className="text-xs text-gray-400 mt-2">Dernière évaluation: {e.dernier} | Prochaine: {e.prochain}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className={`text-3xl font-black ${e.score >= 90 ? "text-green-600" : e.score >= 75 ? "text-orange-500" : "text-red-600"}`}>{e.score}</div>
                      <div className="text-xs text-gray-400">/ 100</div>
                    </div>
                    <div className="w-3 h-20 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`w-full rounded-full ${e.score >= 90 ? "bg-green-500" : "bg-orange-500"}`} style={{ height: `${e.score}%`, marginTop: `${100 - e.score}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

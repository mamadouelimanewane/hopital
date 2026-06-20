"use client"
import { useState, useEffect } from "react"

const hopitaux = [
  { id: 1, nom: "CHNCAK Touba", region: "Diourbel", statut: "en-ligne", patients: 1247, sync: "il y a 2 min", lat: 48, lng: 52 },
  { id: 2, nom: "CHU Fann Dakar", region: "Dakar", statut: "en-ligne", patients: 2834, sync: "il y a 1 min", lat: 78, lng: 20 },
  { id: 3, nom: "Hôpital Principal Dakar", region: "Dakar", statut: "en-ligne", patients: 1956, sync: "il y a 3 min", lat: 76, lng: 22 },
  { id: 4, nom: "CHR Thiès", region: "Thiès", statut: "en-ligne", patients: 876, sync: "il y a 5 min", lat: 65, lng: 28 },
  { id: 5, nom: "CHR Ziguinchor", region: "Ziguinchor", statut: "hors-ligne", patients: 0, sync: "il y a 2h", lat: 82, lng: 75 },
  { id: 6, nom: "CHR Saint-Louis", region: "Saint-Louis", statut: "en-ligne", patients: 634, sync: "il y a 8 min", lat: 55, lng: 8 },
  { id: 7, nom: "CHR Kaolack", region: "Kaolack", statut: "en-ligne", patients: 412, sync: "il y a 4 min", lat: 65, lng: 45 },
]

const transferts = [
  { patient: "Fatou Diallo", origine: "CHR Thiès", destination: "CHU Fann Dakar", motif: "Chirurgie cardiaque", statut: "En transit" },
  { patient: "Moussa Sow", origine: "CHR Kaolack", destination: "CHNCAK Touba", motif: "Dialyse urgente", statut: "Confirmé" },
  { patient: "Aminata Ba", origine: "CHR Saint-Louis", destination: "Hôpital Principal", motif: "Neurologie", statut: "En attente" },
  { patient: "Ibrahim Ndiaye", origine: "CHU Fann Dakar", destination: "CHR Thiès", motif: "Rééducation", statut: "En transit" },
  { patient: "Rokhaya Ciss", origine: "CHNCAK Touba", destination: "CHU Fann Dakar", motif: "Oncologie pédiatrique", statut: "Confirmé" },
]

const indicateursNationaux = [
  { label: "Taux de couverture sanitaire", valeur: "68.4%", tendance: "↑" },
  { label: "Taux de mortalité maternelle", valeur: "2.1‰", tendance: "↓" },
  { label: "Naissances enregistrées (mois)", valeur: "14,203", tendance: "↑" },
  { label: "Consultations totales (mois)", valeur: "87,421", tendance: "↑" },
]

export default function HomePage() {
  const [searchId, setSearchId] = useState("")
  const [dossierTrouve, setDossierTrouve] = useState<null | { nom: string; age: number; etablissements: string[] }>(null)
  const [tick, setTick] = useState(0)
  const [horaireSync] = useState(() => new Date().toLocaleTimeString("fr-FR"))

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(iv)
  }, [])

  const nbConnectes = hopitaux.filter(h => h.statut === "en-ligne").length

  const handleSearch = () => {
    if (searchId.trim()) {
      setDossierTrouve({
        nom: "Mamadou Diop",
        age: 42,
        etablissements: ["CHU Fann Dakar (2023)", "CHR Thiès (2024)", "CHNCAK Touba (2025)"],
      })
    }
  }

  const pulse = tick % 2 === 0

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#e2e8f0" }}>
      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,22,40,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13, fontWeight:600 }}>
          ← Retour au Portail CHNCAK
        </a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* Header Stats Bar */}
      <div style={{ background: "#064e3b", borderBottom: "1px solid #065f46", padding: "10px 24px", display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: pulse ? "#10b981" : "#059669", boxShadow: pulse ? "0 0 8px #10b981" : "none", transition: "all 0.5s" }} />
          <span style={{ fontSize: 13, color: "#6ee7b7" }}>{nbConnectes} hôpitaux connectés</span>
        </div>
        <StatChip label="Dossiers partagés" valeur="12,847" />
        <StatChip label="Transferts actifs" valeur="23" />
        <StatChip label="Uptime réseau" valeur="99.2%" />
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#6ee7b7" }}>Dernière sync : {horaireSync}</div>
      </div>

      <div style={{ padding: "24px", display: "grid", gap: 24 }}>

        {/* Carte Sénégal + Liste hôpitaux */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
          {/* Carte CSS */}
          <div style={{ background: "#0f1f15", border: "1px solid #065f46", borderRadius: 16, padding: 20 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#10b981", fontWeight: 700 }}>Carte du Réseau National</h2>
            <div style={{ position: "relative", height: 320, background: "#0a2e1a", borderRadius: 12, overflow: "hidden", border: "1px solid #064e3b" }}>
              {/* Forme Sénégal simplifiée */}
              <svg viewBox="0 0 120 100" style={{ width: "100%", height: "100%", position: "absolute" }}>
                <polygon points="10,15 55,10 95,18 110,35 105,55 90,70 75,80 60,85 40,82 20,70 8,50 5,30" fill="#0d3320" stroke="#1a5c35" strokeWidth="1.5" />
                {/* Gambie */}
                <rect x="28" y="52" width="30" height="8" fill="#0a2e1a" stroke="#10b981" strokeWidth="0.5" rx="2" />
                {/* Points hôpitaux */}
                {hopitaux.map(h => (
                  <g key={h.id}>
                    <circle
                      cx={h.lng}
                      cy={h.lat}
                      r={5}
                      fill={h.statut === "en-ligne" ? "#10b981" : "#ef4444"}
                      opacity={pulse && h.statut === "en-ligne" ? 0.9 : 0.6}
                    />
                    <circle
                      cx={h.lng}
                      cy={h.lat}
                      r={8}
                      fill="none"
                      stroke={h.statut === "en-ligne" ? "#10b981" : "#ef4444"}
                      strokeWidth="1"
                      opacity={pulse ? 0.5 : 0.1}
                    />
                    <text x={h.lng + 7} y={h.lat + 3} fontSize="5" fill="#a7f3d0" style={{ fontSize: 5 }}>{h.region}</text>
                  </g>
                ))}
              </svg>
              {/* Légende */}
              <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 12, fontSize: 11 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ color: "#6ee7b7" }}>En ligne</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                  <span style={{ color: "#fca5a5" }}>Hors ligne</span>
                </div>
              </div>
            </div>
          </div>

          {/* Liste hôpitaux */}
          <div style={{ background: "#0f1f15", border: "1px solid #065f46", borderRadius: 16, padding: 20 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#10b981", fontWeight: 700 }}>Hôpitaux du Réseau</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {hopitaux.map(h => (
                <div key={h.id} style={{
                  background: "#0a1a10",
                  border: `1px solid ${h.statut === "en-ligne" ? "#065f46" : "#7f1d1d"}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: h.statut === "en-ligne" ? "#10b981" : "#ef4444",
                      boxShadow: h.statut === "en-ligne" && pulse ? "0 0 6px #10b981" : "none"
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{h.nom}</div>
                      <div style={{ fontSize: 11, color: "#6ee7b7" }}>{h.region}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: h.statut === "en-ligne" ? "#10b981" : "#ef4444" }}>
                      {h.statut === "en-ligne" ? `${h.patients.toLocaleString()} patients` : "Hors ligne"}
                    </div>
                    <div style={{ fontSize: 10, color: "#6ee7b7" }}>Sync {h.sync}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transferts en cours */}
        <div style={{ background: "#0f1f15", border: "1px solid #065f46", borderRadius: 16, padding: 20 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#10b981", fontWeight: 700 }}>Transferts en Cours <span style={{ background: "#064e3b", color: "#6ee7b7", fontSize: 12, padding: "2px 10px", borderRadius: 10, marginLeft: 8 }}>{transferts.length} actifs</span></h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #065f46" }}>
                  {["Patient", "Hôpital Origine", "Hôpital Destination", "Motif", "Statut", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6ee7b7", fontWeight: 600, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transferts.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #0a1a10" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{t.patient}</td>
                    <td style={{ padding: "10px 12px", color: "#6ee7b7" }}>{t.origine}</td>
                    <td style={{ padding: "10px 12px", color: "#6ee7b7" }}>{t.destination}</td>
                    <td style={{ padding: "10px 12px" }}>{t.motif}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: t.statut === "En transit" ? "#064e3b" : t.statut === "Confirmé" ? "#1e3a5f" : "#3f2000",
                        color: t.statut === "En transit" ? "#10b981" : t.statut === "Confirmé" ? "#60a5fa" : "#fb923c"
                      }}>{t.statut}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button style={{ background: "#065f46", color: "#10b981", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, marginRight: 6 }}>Voir</button>
                      <button style={{ background: "#1e3a5f", color: "#60a5fa", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Recherche dossier */}
          <div style={{ background: "#0f1f15", border: "1px solid #065f46", borderRadius: 16, padding: 20 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#10b981", fontWeight: 700 }}>Dossiers Partagés Inter-Etablissements</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Rechercher par ID national (ex: SN-2024-00123)"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                style={{ flex: 1, background: "#0a1a10", border: "1px solid #065f46", color: "#fff", padding: "10px 14px", borderRadius: 8, fontSize: 13, outline: "none" }}
              />
              <button
                onClick={handleSearch}
                style={{ background: "#10b981", color: "#000", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
              >Rechercher</button>
            </div>
            {dossierTrouve && (
              <div style={{ background: "#0a2e1a", border: "1px solid #10b981", borderRadius: 10, padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{dossierTrouve.nom} <span style={{ fontSize: 13, color: "#6ee7b7" }}>• {dossierTrouve.age} ans</span></div>
                <div style={{ fontSize: 12, color: "#6ee7b7", marginBottom: 8 }}>Historique inter-établissements :</div>
                {dossierTrouve.etablissements.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ fontSize: 13 }}>{e}</span>
                  </div>
                ))}
                <button style={{ marginTop: 12, background: "#064e3b", color: "#10b981", border: "1px solid #10b981", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                  Voir dossier complet
                </button>
              </div>
            )}
            {!dossierTrouve && (
              <div style={{ textAlign: "center", padding: "30px", color: "#374151", fontSize: 13 }}>
                Entrez un ID national pour rechercher le dossier patient unifié
              </div>
            )}
          </div>

          {/* Reporting Ministère */}
          <div style={{ background: "#0f1f15", border: "1px solid #065f46", borderRadius: 16, padding: 20 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 16, color: "#10b981", fontWeight: 700 }}>Reporting Ministère de la Santé</h2>
            <div style={{ fontSize: 11, color: "#6ee7b7", marginBottom: 16 }}>Dernière transmission : 19/06/2026 à 08h00</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {indicateursNationaux.map((ind, i) => (
                <div key={i} style={{ background: "#0a1a10", border: "1px solid #064e3b", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "#6ee7b7", marginBottom: 4 }}>{ind.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>{ind.valeur} <span style={{ fontSize: 14 }}>{ind.tendance}</span></div>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", background: "linear-gradient(135deg, #10b981, #059669)", color: "#000", border: "none", padding: "12px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
              Exporter Rapport Mensuel (PDF)
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatChip({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#6ee7b7" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{valeur}</div>
    </div>
  )
}

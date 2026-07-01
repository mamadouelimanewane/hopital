"use client"
import { useState, useEffect } from "react"

type Tab = "accueil" | "rdv" | "sante" | "paiement" | "profil"

const rdvList = [
  { date: "24 Juin 2026", heure: "09h30", medecin: "Dr. Aminata Sarr", service: "Cardiologie", statut: "Confirmé" },
  { date: "02 Juil 2026", heure: "11h00", medecin: "Dr. Oumar Diallo", service: "Médecine interne", statut: "En attente" },
  { date: "15 Juil 2026", heure: "08h15", medecin: "Dr. Fatou Ndiaye", service: "Ophtalmologie", statut: "Confirmé" },
]

const transactions = [
  { date: "18 Jun", desc: "Consultation cardiologie", montant: -15000, moyen: "Wave" },
  { date: "10 Jun", desc: "Analyses biologiques", montant: -8500, moyen: "Orange Money" },
  { date: "05 Jun", desc: "Remboursement CNAM", montant: 12000, moyen: "Virement" },
  { date: "28 Mai", desc: "Radiologie thorax", montant: -22000, moyen: "Wave" },
]

const constantes = [
  { label: "Tension artérielle", valeur: "128/82", unite: "mmHg", icon: "❤️", couleur: "#ef4444" },
  { label: "Poids", valeur: "74.2", unite: "kg", icon: "⚖️", couleur: "#f59e0b" },
  { label: "Glycémie", valeur: "5.8", unite: "mmol/L", icon: "🩸", couleur: "#8b5cf6" },
  { label: "Fréquence cardiaque", valeur: "72", unite: "bpm", icon: "💗", couleur: "#ec4899" },
]

const vaccins = [
  { nom: "Hépatite B", date: "Mars 2024", statut: "OK" },
  { nom: "Tétanos", date: "Jan 2023", statut: "OK" },
  { nom: "Fièvre jaune", date: "Juin 2020", statut: "À renouveler" },
  { nom: "COVID-19", date: "Dec 2022", statut: "OK" },
]

export default function PatientMobilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("accueil")
  const [showQR, setShowQR] = useState(false)
  const [heure, setHeure] = useState("")
  const [rdvItems, setRdvItems] = useState(rdvList)
  const [showSOS, setShowSOS] = useState(false)
  const [newRdv, setNewRdv] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setHeure(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
    }
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [])

  const annulerRdv = (i: number) => {
    setRdvItems(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      {/* Phone wrapper */}
      <div style={{
        width: 390,
        minHeight: 844,
        background: "#0d0d1a",
        borderRadius: 48,
        border: "3px solid #2d2d4e",
        boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px #1a1a3e inset",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}>
        {/* Status bar */}
        <div style={{ background: "#0d0d1a", padding: "12px 24px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{heure || "09:41"}</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 1 }}>
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} style={{ width: 3, height: h, background: i < 3 ? "#fff" : "#444", borderRadius: 1 }} />
              ))}
            </div>
            <span style={{ fontSize: 10, color: "#fff" }}>5G</span>
            <div style={{ width: 22, height: 11, border: "1px solid #fff", borderRadius: 3, display: "flex", alignItems: "center", padding: "1px" }}>
              <div style={{ width: "75%", height: "100%", background: "#22c55e", borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* App Header */}
        <div style={{ background: "#12123a", padding: "10px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: "#8888bb" }}>Bonjour 👋</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Mamadou</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>M</div>
          </div>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

          {/* QR Modal */}
          {showQR && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#fff", padding: 24, borderRadius: 16, marginBottom: 16 }}>
                {/* QR CSS Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 14px)", gap: 1 }}>
                  {[1,1,1,1,1,0,1,0,1,1,
                    1,0,0,0,1,0,0,1,0,1,
                    1,0,1,0,1,1,0,0,1,0,
                    1,0,0,0,1,0,1,0,0,1,
                    1,1,1,1,1,0,1,1,1,0,
                    0,1,0,1,0,1,0,1,0,0,
                    1,0,1,1,1,1,0,1,0,1,
                    0,1,0,0,1,0,1,1,1,0,
                    1,1,1,0,1,1,0,0,1,1,
                    0,1,0,1,0,0,1,0,1,1].map((v, i) => (
                    <div key={i} style={{ width: 14, height: 14, background: v ? "#000" : "#fff" }} />
                  ))}
                </div>
              </div>
              <div style={{ color: "#fff", fontSize: 14, marginBottom: 8 }}>SN-2024-00847-DIOP</div>
              <div style={{ color: "#8888bb", fontSize: 12, marginBottom: 20 }}>Scannez ce code à l&apos;accueil Ndamatou</div>
              <button onClick={() => setShowQR(false)} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "12px 32px", borderRadius: 24, cursor: "pointer", fontWeight: 700 }}>Fermer</button>
            </div>
          )}

          {/* SOS Modal */}
          {showSOS && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(180,0,0,0.95)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🚨</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>ALERTE SOS ENVOYÉE</div>
              <div style={{ fontSize: 14, color: "#ffaaaa", marginBottom: 8 }}>SAMU : 15 • Police : 17 • Pompiers : 18</div>
              <div style={{ fontSize: 13, color: "#fff", marginBottom: 24 }}>Votre position GPS a été partagée avec les services d&apos;urgence</div>
              <div style={{ background: "rgba(255,255,255,0.1)", padding: "10px 24px", borderRadius: 12, marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#ffaaaa" }}>En route vers vous</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Ambulance Ndamatou — ~8 min</div>
              </div>
              <button onClick={() => setShowSOS(false)} style={{ background: "#fff", color: "#c00", border: "none", padding: "12px 32px", borderRadius: 24, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>Annuler l&apos;alerte</button>
            </div>
          )}

          {/* ACCUEIL */}
          {activeTab === "accueil" && (
            <div>
              {/* Prochain RDV */}
              <div style={{ background: "linear-gradient(135deg, #1e1e5e, #2d1b69)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#a78bfa", marginBottom: 4 }}>PROCHAIN RENDEZ-VOUS</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Dr. Aminata Sarr</div>
                <div style={{ fontSize: 13, color: "#c4b5fd" }}>Cardiologie • 24 Juin 2026, 09h30</div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button style={{ flex: 1, background: "#7c3aed", color: "#fff", border: "none", padding: "8px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Rappel</button>
                  <button style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "8px", borderRadius: 10, cursor: "pointer", fontSize: 12 }}>Itinéraire</button>
                </div>
              </div>

              {/* Raccourcis */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                <Raccourci icon="📱" label="QR Code" color="#6366f1" onClick={() => setShowQR(true)} />
                <Raccourci icon="🔬" label="Résultats" color="#0891b2" onClick={() => {}} />
                <Raccourci icon="💊" label="Médicaments" color="#0284c7" onClick={() => {}} />
              </div>

              {/* Actualités santé */}
              <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>Actualités Santé</div>
              {[
                { titre: "Campagne vaccination rougeole — Touba", date: "Aujourd'hui" },
                { titre: "Nouvelles horaires consultations Cardiologie", date: "Hier" },
                { titre: "Don de sang — Centre Ndamatou", date: "20 Jun" },
              ].map((a, i) => (
                <div key={i} style={{ background: "#15152a", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: "#e2e8f0", flex: 1, marginRight: 8 }}>{a.titre}</div>
                  <div style={{ fontSize: 11, color: "#6366f1", whiteSpace: "nowrap" }}>{a.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* RDV */}
          {activeTab === "rdv" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Mes Rendez-vous</div>
                <button onClick={() => setNewRdv(!newRdv)} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+ Nouveau RDV</button>
              </div>
              {newRdv && (
                <div style={{ background: "#1e1e5e", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>Nouveau Rendez-vous</div>
                  {["Service", "Médecin", "Date souhaitée"].map(f => (
                    <input key={f} placeholder={f} style={{ width: "100%", background: "#0d0d2e", border: "1px solid #4c4c8f", color: "#fff", padding: "8px 12px", borderRadius: 8, marginBottom: 8, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                  ))}
                  <button style={{ width: "100%", background: "#6366f1", color: "#fff", border: "none", padding: 10, borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Demander RDV</button>
                </div>
              )}
              {rdvItems.map((r, i) => (
                <div key={i} style={{ background: "#12123a", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid #2d2d6e" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{r.medecin}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: r.statut === "Confirmé" ? "#064e3b" : "#3f2000", color: r.statut === "Confirmé" ? "#0ea5e9" : "#fb923c" }}>{r.statut}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#8888bb" }}>{r.service}</div>
                  <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 4 }}>📅 {r.date} à {r.heure}</div>
                  <button onClick={() => annulerRdv(i)} style={{ marginTop: 10, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>Annuler</button>
                </div>
              ))}
            </div>
          )}

          {/* SANTÉ */}
          {activeTab === "sante" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Mes Constantes Vitales</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {constantes.map((c, i) => (
                  <div key={i} style={{ background: "#12123a", borderRadius: 14, padding: "14px", border: `1px solid ${c.couleur}44` }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{c.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: c.couleur }}>{c.valeur}</div>
                    <div style={{ fontSize: 11, color: "#8888bb" }}>{c.unite}</div>
                    <div style={{ fontSize: 11, color: "#555577", marginTop: 2 }}>{c.label}</div>
                  </div>
                ))}
              </div>
              {/* Courbe poids stylisée */}
              <div style={{ background: "#12123a", borderRadius: 14, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 8 }}>Évolution du poids (6 mois)</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                  {[76, 75.5, 75.2, 74.8, 74.5, 74.2].map((v, i) => {
                    const max = 77, min = 73.5
                    const pct = ((v - min) / (max - min)) * 100
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{ width: "100%", height: `${pct}%`, background: "linear-gradient(to top, #7c3aed, #a78bfa)", borderRadius: "3px 3px 0 0", minHeight: 8 }} />
                        <div style={{ fontSize: 9, color: "#6666aa" }}>{["J", "F", "M", "A", "M", "J"][i]}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PAIEMENT */}
          {activeTab === "paiement" && (
            <div>
              <div style={{ background: "linear-gradient(135deg, #0f4c15, #1a6b24)", borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#86efac" }}>Solde Compte Santé</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>47 500 <span style={{ fontSize: 18 }}>FCFA</span></div>
                <div style={{ fontSize: 11, color: "#86efac" }}>Mis à jour le 20/06/2026</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Payer une facture</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[{ logo: "🌊", nom: "Wave", color: "#0ea5e9" }, { logo: "🟠", nom: "Orange Money", color: "#f97316" }].map(op => (
                  <button key={op.nom} style={{ background: "#12123a", border: `2px solid ${op.color}`, borderRadius: 12, padding: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{op.logo}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{op.nom}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Historique</div>
              {transactions.map((t, i) => (
                <div key={i} style={{ background: "#12123a", borderRadius: 10, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#e2e8f0" }}>{t.desc}</div>
                    <div style={{ fontSize: 11, color: "#555577" }}>{t.date} • {t.moyen}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: t.montant > 0 ? "#22c55e" : "#f87171", fontSize: 14 }}>
                    {t.montant > 0 ? "+" : ""}{t.montant.toLocaleString()} F
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFIL */}
          {activeTab === "profil" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 10px" }}>M</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Mamadou Diop</div>
                <div style={{ fontSize: 12, color: "#8888bb" }}>N° Patient : SN-2024-00847-DIOP</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  <span style={{ background: "#7f1d1d", color: "#fca5a5", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>A+</span>
                  <span style={{ background: "#1e3a5f", color: "#93c5fd", padding: "3px 10px", borderRadius: 20, fontSize: 11 }}>Allergies: Pénicilline</span>
                </div>
              </div>

              <div style={{ background: "#12123a", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>Informations personnelles</div>
                {[["Date de naissance", "15 Mars 1984"], ["Téléphone", "+221 77 456 78 90"], ["Adresse", "Médina, Dakar"], ["Médecin traitant", "Dr. Oumar Diallo"]].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1a1a3e" }}>
                    <span style={{ fontSize: 12, color: "#8888bb" }}>{label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0" }}>{val}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#12123a", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>Carnet de Vaccination</div>
                {vaccins.map((v, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a1a3e" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#e2e8f0" }}>{v.nom}</div>
                      <div style={{ fontSize: 11, color: "#555577" }}>{v.date}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: v.statut === "OK" ? "#064e3b" : "#7f3000", color: v.statut === "OK" ? "#0ea5e9" : "#fb923c" }}>{v.statut}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div style={{ background: "#0d0d1a", borderTop: "1px solid #1e1e3e", padding: "8px 0 16px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          {[
            { key: "accueil", icon: "🏠", label: "Accueil" },
            { key: "rdv", icon: "📅", label: "RDV" },
            { key: "sante", icon: "❤️", label: "Santé" },
            { key: "paiement", icon: "💳", label: "Paiement" },
            { key: "profil", icon: "👤", label: "Profil" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as Tab)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, color: activeTab === tab.key ? "#6366f1" : "#555577", fontWeight: activeTab === tab.key ? 700 : 400 }}>{tab.label}</span>
              {activeTab === tab.key && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#6366f1" }} />}
            </button>
          ))}
        </div>

        {/* SOS Button */}
        <button onClick={() => setShowSOS(true)} style={{
          position: "absolute", bottom: 80, right: 16,
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #dc2626, #991b1b)",
          border: "2px solid #ef4444",
          color: "#fff", fontSize: 18, cursor: "pointer",
          boxShadow: "0 0 16px rgba(220,38,38,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>🆘</button>
      </div>
    </div>
  )
}

function Raccourci({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "#12123a", border: `1px solid ${color}44`, borderRadius: 14, padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 600 }}>{label}</span>
    </button>
  )
}

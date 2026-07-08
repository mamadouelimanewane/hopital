"use client"

import { useState, useEffect } from "react"

const campaigns = [
  { id: 1, title: "Acquisition Scanner IRM", goal: 150_000_000, raised: 102_000_000, color: "#f59e0b" },
  { id: 2, title: "Bloc Opératoire Moderne", goal: 200_000_000, raised: 84_000_000, color: "#0ea5e9" },
  { id: 3, title: "Unité Soins Intensifs Pédiatriques", goal: 80_000_000, raised: 72_800_000, color: "#6366f1" },
  { id: 4, title: "Formation 50 Infirmiers", goal: 25_000_000, raised: 25_000_000, color: "#22c55e" },
]

const recentDons = [
  { id: 1, montant: 500_000, pays: "France", flag: "🇫🇷", date: "20/06/2026", message: "Pour la santé de Touba !", anonyme: false, nom: "Mamadou D." },
  { id: 2, montant: 1_000_000, pays: "USA", flag: "🇺🇸", date: "19/06/2026", message: "Que Dieu bénisse le Ndamatou", anonyme: false, nom: "Fatou N." },
  { id: 3, montant: 250_000, pays: "Italie", flag: "🇮🇹", date: "19/06/2026", message: "", anonyme: true, nom: "Anonyme" },
  { id: 4, montant: 100_000, pays: "Gabon", flag: "🇬🇦", date: "18/06/2026", message: "Solidarité depuis Libreville", anonyme: false, nom: "Ibrahima S." },
  { id: 5, montant: 2_000_000, pays: "UAE", flag: "🇦🇪", date: "18/06/2026", message: "Bismillah", anonyme: false, nom: "Sheikh M." },
  { id: 6, montant: 75_000, pays: "Sénégal", flag: "🇸🇳", date: "17/06/2026", message: "Petit geste grand cœur", anonyme: false, nom: "Aïssatou B." },
]

const SUGGESTED = [5_000, 25_000, 100_000, 500_000]
const MODES = [
  { id: "wave", label: "Wave", icon: "📱" },
  { id: "orange", label: "Orange Money", icon: "📱" },
  { id: "carte", label: "Carte Bancaire", icon: "💳" },
  { id: "virement", label: "Virement International", icon: "🌐" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
]

function fmt(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA"
}

export default function DonFinancement() {
  const [montant, setMontant] = useState<number | "">("")
  const [montantLibre, setMontantLibre] = useState("")
  const [mode, setMode] = useState("wave")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [anonyme, setAnonyme] = useState(false)
  const [certificat, setCertificat] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [animBar, setAnimBar] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimBar(57), 600)
    return () => clearTimeout(t)
  }, [])

  const finalMontant = montant !== "" ? montant : Number(montantLibre) || 0

  function handleDon() {
    if (!finalMontant || !nom || !email) return
    setShowModal(true)
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0d1b2a 100%)", minHeight: "100vh", color: "#e5e7eb" }}>

      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/#applications" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail Ndamatou</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>Ndamatou Suite</span>
      </div>

      {/* HEADER HERO */}
      <header style={{ background: "linear-gradient(135deg, #1a2035 0%, #0f2027 100%)", borderBottom: "1px solid #d97706" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 36px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(217,119,6,0.12)", border: "1px solid #d97706", borderRadius: 40, padding: "6px 20px", marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0ea5e9", display: "inline-block", animation: "pulse 2s infinite" }}></span>
            <span style={{ color: "#d97706", fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>PLATEFORME OFFICIELLE Ndamatou</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
            <span style={{ color: "#fbbf24" }}>Investissez dans la Santé</span><br />
            <span style={{ color: "#e5e7eb" }}>de Touba </span>
            <span style={{ fontSize: "0.8em" }}>🌍</span>
          </h1>
          <p style={{ fontSize: 20, color: "#9ca3af", marginBottom: 8 }}>
            Centre Hospitalier National Ndamatou — Touba, Sénégal
          </p>
          <p style={{ fontSize: 17, color: "#d97706", fontStyle: "italic", marginBottom: 32 }}>
            "Sëgël sa dëkk" — Construis ton pays
          </p>

          {/* COMPTEURS */}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[
              { val: "1 247", label: "Donateurs" },
              { val: "15", label: "Pays représentés" },
              { val: "287M", label: "FCFA collectés" },
            ].map(c => (
              <div key={c.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#fbbf24" }}>{c.val}</div>
                <div style={{ fontSize: 13, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* THERMOMETRE */}
        <section style={{ background: "linear-gradient(135deg, #1f2937,#111827)", border: "1px solid #374151", borderRadius: 16, padding: 32, marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }}>Objectif Global de Financement</h2>
              <p style={{ color: "#6b7280", fontSize: 14 }}>Campagne 2025-2026 — Phase I de modernisation</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#0ea5e9" }}>287 M</div>
              <div style={{ color: "#6b7280", fontSize: 14 }}>sur 500 M FCFA</div>
            </div>
          </div>
          <div style={{ background: "#374151", borderRadius: 12, height: 28, overflow: "hidden", position: "relative" }}>
            <div style={{
              height: "100%", borderRadius: 12,
              background: "linear-gradient(90deg, #d97706, #fbbf24, #0ea5e9)",
              width: `${animBar}%`,
              transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
              position: "relative"
            }}>
              <span style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                color: "#000", fontWeight: 800, fontSize: 14
              }}>57%</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, color: "#6b7280" }}>
            <span>0 FCFA</span>
            <span style={{ color: "#0ea5e9", fontWeight: 600 }}>287 000 000 collectés</span>
            <span>500 000 000 FCFA</span>
          </div>
        </section>

        {/* CAMPAGNES */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#e5e7eb", marginBottom: 24 }}>
            <span style={{ color: "#d97706" }}>◆</span> Campagnes en cours
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {campaigns.map(c => {
              const pct = Math.round((c.raised / c.goal) * 100)
              const done = pct >= 100
              return (
                <div key={c.id} style={{
                  background: "#1f2937", border: `1px solid ${done ? "#22c55e" : "#374151"}`,
                  borderRadius: 12, padding: 20, position: "relative", overflow: "hidden"
                }}>
                  {done && (
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "#22c55e", color: "#000", fontSize: 11, fontWeight: 700,
                      borderRadius: 20, padding: "3px 10px"
                    }}>✅ FINANCÉ</div>
                  )}
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e5e7eb", marginBottom: 12, paddingRight: done ? 80 : 0 }}>{c.title}</h3>
                  <div style={{ background: "#374151", borderRadius: 6, height: 8, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", borderRadius: 6, background: c.color, width: `${pct}%`, transition: "width 1s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: c.color, fontWeight: 700 }}>{pct}% financé</span>
                    <span style={{ color: "#6b7280" }}>{(c.raised / 1_000_000).toFixed(0)}M / {(c.goal / 1_000_000).toFixed(0)}M</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* FORMULAIRE */}
          <section style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fbbf24", marginBottom: 20 }}>
              💛 Faire un Don
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 8 }}>Montant suggéré</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SUGGESTED.map(s => (
                  <button key={s} onClick={() => { setMontant(s); setMontantLibre("") }}
                    style={{
                      padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "2px solid",
                      borderColor: montant === s ? "#fbbf24" : "#374151",
                      background: montant === s ? "rgba(251,191,36,0.12)" : "#111827",
                      color: montant === s ? "#fbbf24" : "#9ca3af"
                    }}>
                    {s.toLocaleString("fr-FR")}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 6 }}>Montant libre (FCFA)</label>
              <input type="number" value={montantLibre} onChange={e => { setMontantLibre(e.target.value); setMontant("") }}
                placeholder="Ex: 50000"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#111827", border: "1px solid #374151", color: "#e5e7eb", fontSize: 15, boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: "#9ca3af", display: "block", marginBottom: 8 }}>Mode de paiement</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {MODES.map(m => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    style={{
                      padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "2px solid",
                      borderColor: mode === m.id ? "#0ea5e9" : "#374151",
                      background: mode === m.id ? "rgba(16,185,129,0.12)" : "#111827",
                      color: mode === m.id ? "#0ea5e9" : "#9ca3af"
                    }}>
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)}
                placeholder="Votre nom complet *"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#111827", border: "1px solid #374151", color: "#e5e7eb", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Votre email *"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#111827", border: "1px solid #374151", color: "#e5e7eb", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Message optionnel..."
                rows={3}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#111827", border: "1px solid #374151", color: "#e5e7eb", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#9ca3af" }}>
                <input type="checkbox" checked={anonyme} onChange={e => setAnonyme(e.target.checked)}
                  style={{ accentColor: "#fbbf24" }} />
                Don anonyme
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#9ca3af" }}>
                <input type="checkbox" checked={certificat} onChange={e => setCertificat(e.target.checked)}
                  style={{ accentColor: "#fbbf24" }} />
                Certificat fiscal
              </label>
            </div>

            <button onClick={handleDon}
              disabled={!finalMontant || !nom || !email}
              style={{
                width: "100%", padding: "14px", borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: "pointer",
                background: (!finalMontant || !nom || !email) ? "#374151" : "linear-gradient(135deg, #d97706, #fbbf24)",
                color: (!finalMontant || !nom || !email) ? "#6b7280" : "#000",
                border: "none", transition: "all 0.2s"
              }}>
              💛 Faire un Don {finalMontant ? `— ${fmt(finalMontant)}` : ""}
            </button>
          </section>

          {/* DONATEURS + TRANSPARENCE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <section style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e5e7eb", marginBottom: 16 }}>🌍 Derniers Dons</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recentDons.map(d => (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#111827", borderRadius: 8, gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{d.flag}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb" }}>{d.anonyme ? "Anonyme" : d.nom}</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{d.pays} · {d.date}</div>
                        {d.message && <div style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic" }}>"{d.message}"</div>}
                      </div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fbbf24", whiteSpace: "nowrap" }}>
                      +{(d.montant / 1000).toFixed(0)}K
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e5e7eb", marginBottom: 16 }}>📊 Transparence des Fonds</h2>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: 90, height: 90, transform: "rotate(-90deg)" }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3.8" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0ea5e9" strokeWidth="3.8"
                      strokeDasharray="60 40" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fbbf24" strokeWidth="3.8"
                      strokeDasharray="25 75" strokeDashoffset="-60" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3.8"
                      strokeDasharray="15 85" strokeDashoffset="-85" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    { label: "Équipements médicaux", pct: 60, color: "#0ea5e9" },
                    { label: "Infrastructures", pct: 25, color: "#fbbf24" },
                    { label: "Formation personnels", pct: 15, color: "#6366f1" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#9ca3af", flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#6b7280", marginTop: 12, textAlign: "center" }}>
                Rapport d'utilisation certifié · Audité par cabinet international
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* MODAL SUCCES */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "linear-gradient(135deg, #1f2937, #111827)", border: "2px solid #0ea5e9",
            borderRadius: 20, padding: 48, maxWidth: 420, width: "90%", textAlign: "center"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0ea5e9", marginBottom: 12 }}>Merci pour votre don !</h2>
            <p style={{ color: "#9ca3af", marginBottom: 8 }}>
              Don de <strong style={{ color: "#fbbf24" }}>{fmt(finalMontant)}</strong> enregistré avec succès.
            </p>
            <p style={{ color: "#9ca3af", marginBottom: 24 }}>
              Vous recevrez un reçu de confirmation à <strong style={{ color: "#e5e7eb" }}>{email}</strong>
              {certificat && " ainsi que votre certificat fiscal"}.
            </p>
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid #0ea5e9", borderRadius: 10, padding: 14, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#0ea5e9", margin: 0 }}>
                "Jazak Allah khayr" — Que Dieu vous récompense au centuple 🤲
              </p>
            </div>
            <button onClick={() => setShowModal(false)}
              style={{ padding: "12px 32px", borderRadius: 8, background: "#0ea5e9", color: "#000", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        input::placeholder, textarea::placeholder { color: #4b5563; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

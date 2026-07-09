"use client"
import Link from "next/link"
import { useState } from "react"

type Lang = "fr" | "wo"

const t = {
  fr: {
    desc: "L'application centrale pour tous les patients de l'hôpital Ndamatou de Touba.",
    statPatients: "Patients Actifs", statDispo: "Disponibilité", statSecu: "Sécurisé",
    features: "Fonctionnalités Clés",
    rdvTitle: "Prise de RDV", rdvDesc: "Consultations en ligne",
    resTitle: "Résultats", resDesc: "Analyses et radiologies",
    teleTitle: "Téléconsultation", teleDesc: "Vidéo avec les médecins",
    payTitle: "Paiement", payDesc: "Factures en ligne",
    upcoming: "Prochains Rendez-vous",
    thPatient: "Patient", thMedecin: "Médecin", thService: "Service", thDate: "Date & Heure", thStatut: "Statut",
    resModalTitle: "Mes résultats", resDispo: "Disponible", resAttente: "En attente", resTelecharger: "📄 Télécharger",
    teleConnexion: "Connexion à la téléconsultation…", teleConnecte: "En consultation avec",
    teleTerminer: "Terminer l'appel", teleFerme: "Fermer",
  },
  wo: {
    desc: "Aplikasioŋ bi gën a am solo ci pasyaŋ yépp bu opitaal Ndamatu Tuubaa.",
    statPatients: "Pasyaŋ yu Dox", statDispo: "Am na Ndoo", statSecu: "Kaaraange 100%",
    features: "Jumtukaay yu Ci Am Solo",
    rdvTitle: "Jël Randevu", rdvDesc: "Konsultasioŋ ci Internet",
    resTitle: "Rezilta yi", resDesc: "Analiis ak Radiyoloji",
    teleTitle: "Telekonsultasioŋ", teleDesc: "Wideyo ak Doktoor yi",
    payTitle: "Fey", payDesc: "Fakti ci Internet",
    upcoming: "Randevu yiy Ñëw",
    thPatient: "Pasyaŋ", thMedecin: "Doktoor", thService: "Sarwiis", thDate: "Bis ak Waxtu", thStatut: "Sax",
    resModalTitle: "Sama rezilta yi", resDispo: "Am na", resAttente: "Ñu ngi xaar", resTelecharger: "📄 Yeksi",
    teleConnexion: "Jokkoo ci telekonsultasioŋ bi…", teleConnecte: "Ci konsultasioŋ ak",
    teleTerminer: "Jeexal woote bi", teleFerme: "Tëj",
  },
}

const RESULTATS = [
  { patient: "Mamadou Diop", examen: "ECG + Bilan lipidique", date: "20/06/2026", statut: "Disponible" },
  { patient: "Aïssatou Ndour", examen: "Radiographie thoracique", date: "22/06/2026", statut: "Disponible" },
  { patient: "Cheikh Fall", examen: "Fond d'œil", date: "26/06/2026", statut: "En attente" },
  { patient: "Rokhaya Sy", examen: "Bilan sanguin complet", date: "27/06/2026", statut: "Disponible" },
]

export default function NdamatouConnectPage() {
  const [lang, setLang] = useState<Lang>("fr")
  const L = t[lang]

  const [resultatsOuvert, setResultatsOuvert] = useState(false)
  const [teleOuvert, setTeleOuvert] = useState(false)
  const [teleEtape, setTeleEtape] = useState<"connexion" | "connecte">("connexion")

  function demarrerTele() {
    setTeleOuvert(true)
    setTeleEtape("connexion")
    setTimeout(() => setTeleEtape("connecte"), 1400)
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #0a1628; color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .2s both}
        .au3{animation:fadeUp .6s .3s both} .au4{animation:fadeUp .6s .4s both}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
        .stat-card:hover { border-color: #2563eb44; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: #2563eb44; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
      `}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/#applications" className="back-btn">← Retour au Portail Ndamatou</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 3 }}>
            {(["fr", "wo"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                border: "none", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                background: lang === l ? "#2563eb" : "transparent", color: lang === l ? "#fff" : "rgba(255,255,255,0.5)"
              }}>
                {l === "fr" ? "🇫🇷 Français" : "Wolof"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
            <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 700, letterSpacing: "0.1em" }}>SYSTÈME ACTIF</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* HERO */}
        <div className="au1" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: "3rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "#2563eb20", border: "2px solid #2563eb40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, boxShadow: "0 0 30px #2563eb30" }}>
            🏥
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#2563eb", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: "#2563eb15", padding: "3px 10px", borderRadius: 6, border: "1px solid #2563eb30" }}>
                Application Hospitalière
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
              <span style={{ background: "linear-gradient(135deg, #fff, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Ndamatou Connect
              </span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 600 }}>
              {L.desc}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="au2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#2563eb", marginBottom: 4 }}>10K+</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{L.statPatients}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#2563eb", marginBottom: 4 }}>24/7</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{L.statDispo}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#2563eb", marginBottom: 4 }}>100%</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{L.statSecu}</p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="au3" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>{L.features}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563eb18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📅</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{L.rdvTitle}</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{L.rdvDesc}</p>
            </div>
            <button onClick={() => setResultatsOuvert(true)} className="feat-card" style={{ textAlign: "left", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563eb18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📄</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{L.resTitle}</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{L.resDesc}</p>
            </button>
            <button onClick={demarrerTele} className="feat-card" style={{ textAlign: "left", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563eb18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📞</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{L.teleTitle}</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{L.teleDesc}</p>
            </button>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563eb18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💳</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{L.payTitle}</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{L.payDesc}</p>
            </div>
          </div>
        </div>

        {/* DONNÉES EN TEMPS RÉEL */}
        <div className="au3" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>{L.upcoming}</h2>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {[L.thPatient, L.thMedecin, L.thService, L.thDate, L.thStatut].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { patient: "Mamadou Diop", medecin: "Dr. Aminata Sarr", service: "Cardiologie", date: "24/06/2026 — 09h30", statut: "Confirmé", color: "#22c55e" },
                    { patient: "Aïssatou Ndour", medecin: "Dr. Oumar Diallo", service: "Médecine interne", date: "25/06/2026 — 11h00", statut: "Confirmé", color: "#22c55e" },
                    { patient: "Cheikh Fall", medecin: "Dr. Fatou Ndiaye", service: "Ophtalmologie", date: "27/06/2026 — 08h15", statut: "En attente", color: "#f59e0b" },
                    { patient: "Rokhaya Sy", medecin: "Dr. Ibrahima Ba", service: "Pédiatrie", date: "28/06/2026 — 14h00", statut: "Confirmé", color: "#22c55e" },
                    { patient: "Modou Gueye", medecin: "Dr. Aminata Sarr", service: "Cardiologie", date: "30/06/2026 — 10h30", statut: "Annulé", color: "#ef4444" },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#fff" }}>{r.patient}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{r.medecin}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{r.service}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{r.date}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: `${r.color}22`, color: r.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{r.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="au4" style={{ background: "#2563eb10", border: "1px solid #2563eb25", borderRadius: 16, padding: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 800, marginBottom: 8 }}>Prêt à intégrer ce module ?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Contactez Processingenierie pour déployer Ndamatou Connect dans votre infrastructure.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="mailto:contact@processingenierie.sn" style={{ background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              ✉️ Nous contacter
            </a>
            <Link href="/#applications" style={{ background: "rgba(255,255,255,0.05)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              ← Retour Portail
            </Link>
          </div>
        </div>

      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem", marginTop: "3rem", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Développé par <span style={{ color: "#2563eb", fontWeight: 700 }}>Processingenierie</span> · Hôpital Ndamatou Touba 🇸🇳</p>
      </footer>

      {/* MODALE RÉSULTATS */}
      {resultatsOuvert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>📄 {L.resModalTitle}</h3>
              <button onClick={() => setResultatsOuvert(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RESULTATS.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{r.examen}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{r.patient} · {r.date}</div>
                  </div>
                  {r.statut === "Disponible" ? (
                    <button style={{ background: "rgba(37,99,235,0.15)", color: "#60a5fa", border: "1px solid #2563eb44", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {L.resTelecharger}
                    </button>
                  ) : (
                    <span style={{ background: "rgba(245,158,11,0.12)", color: "#fcd34d", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                      {L.resAttente}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALE TÉLÉCONSULTATION */}
      {teleOuvert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 480 }}>
            {teleEtape === "connexion" ? (
              <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📞</div>
                <p style={{ color: "#e5e7eb", fontWeight: 600 }}>{L.teleConnexion}</p>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontWeight: 800, fontSize: 22 }}>
                    AS
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 2 }}>{L.teleConnecte}</p>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Dr. Aminata Sarr — Cardiologie</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "4px 12px", marginTop: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                    <span style={{ fontSize: 12, color: "#86efac", fontWeight: 600 }}>🎙️ 📹 Connecté</span>
                  </div>
                </div>
                <button onClick={() => setTeleOuvert(false)} style={{ width: "100%", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  {L.teleTerminer}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

"use client"
import Link from "next/link"

const COUL = "#f97316"

const BOX = [
  { id: "BOX-01", patient: "Mame Diarra Seck", triage: "Rouge — Urgence Vitale", medecin: "Dr. Oumar Sall", statut: "En cours de prise en charge", attente: "0 min" },
  { id: "BOX-02", patient: "Ibrahima Ba",       triage: "Orange — Urgence Relative", medecin: "Dr. Fatou Mbaye",  statut: "En attente d'examen", attente: "18 min" },
  { id: "BOX-03", patient: "Aminata Diop",       triage: "Orange — Urgence Relative", medecin: "Dr. Cheikh Sy",    statut: "Résultats labo en attente", attente: "34 min" },
  { id: "BOX-04", patient: "Modou Fall",          triage: "Vert — Urgence Simple",    medecin: "IDE Aïda Kane",    statut: "Consultation en cours", attente: "47 min" },
  { id: "BOX-05", patient: "Rokhaya Sow",         triage: "Vert — Urgence Simple",    medecin: "IDE Moussa Dieng", statut: "En attente de médecin", attente: "62 min" },
  { id: "COULOIR", patient: "Queue d'attente",     triage: "Blanc — Non urgent",       medecin: "—",                statut: "12 patients en salle d'attente", attente: "~90 min" },
]

const triageCoul: Record<string, string> = {
  "Rouge — Urgence Vitale":    "#ef4444",
  "Orange — Urgence Relative": "#f97316",
  "Vert — Urgence Simple":     "#22c55e",
  "Blanc — Non urgent":        "#94a3b8",
}

export default function UrgencesPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #0a1628; color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .2s both}
        .au3{animation:fadeUp .6s .3s both} .au4{animation:fadeUp .6s .4s both}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
        .stat-card:hover { border-color: ${COUL}44; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: ${COUL}44; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
        .live-dot { animation: blink 1.5s infinite; }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/#applications" className="back-btn">← Retour au Portail Ndamatou</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
          <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, letterSpacing: "0.1em" }}>URGENCES EN DIRECT</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        <div className="au1" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: "3rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: `${COUL}20`, border: `2px solid ${COUL}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, boxShadow: `0 0 30px ${COUL}30` }}>🚨</div>
          <div>
            <span style={{ fontSize: 11, color: COUL, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: `${COUL}15`, padding: "3px 10px", borderRadius: 6, border: `1px solid ${COUL}30` }}>Application Hospitalière</span>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, margin: "10px 0" }}>
              <span style={{ background: `linear-gradient(135deg, #fff, ${COUL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Tableau de Bord SAU</span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 600 }}>
              Pilotage central du Service d'Accueil des Urgences en temps réel — occupation des box, triage et coordination des équipes.
            </p>
          </div>
        </div>

        <div className="au2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          {[
            { val: "42", label: "Patients Admis Aujourd'hui" },
            { val: "5/6", label: "Box Occupés" },
            { val: "34 min", label: "Temps Attente Moyen" },
            { val: "3", label: "Urgences Vitales (Rouge)" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: COUL, marginBottom: 4 }}>{s.val}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="au3" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>Fonctionnalités Clés</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
            {[
              { icon: "📊", titre: "Vue Temps Réel des Box", desc: "Occupation, statut patient et médecin assigné pour chaque box d'examen" },
              { icon: "🎯", titre: "Triage Intégré", desc: "Synchronisation avec le ChatBot Triage IA pour une orientation immédiate" },
              { icon: "⏱️", titre: "Chronomètre de Prise en Charge", desc: "Alerte automatique si le délai de prise en charge dépasse le seuil réglementaire" },
              { icon: "📡", titre: "Coordination Brancardiers", desc: "Dispatch en temps réel des brancardiers vers les services demandeurs" },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${COUL}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{f.titre}</h3>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="au3" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>État des Box — En Direct</h2>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Box", "Patient", "Triage", "Médecin", "Statut", "Attente"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BOX.map((b, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{b.id}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{b.patient}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: `${triageCoul[b.triage]}22`, color: triageCoul[b.triage], padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{b.triage}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{b.medecin}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{b.statut}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: i < 3 ? "#ef4444" : "rgba(255,255,255,0.4)" }}>{b.attente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="au4" style={{ background: `${COUL}10`, border: `1px solid ${COUL}25`, borderRadius: 16, padding: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 800, marginBottom: 8 }}>Prêt à intégrer ce module ?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Contactez Processingenierie pour déployer le Tableau de Bord SAU dans votre infrastructure.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="mailto:contact@processingenierie.sn" style={{ background: COUL, color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>✉️ Nous contacter</a>
            <Link href="/#applications" style={{ background: "rgba(255,255,255,0.05)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>← Retour Portail</Link>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem", marginTop: "3rem", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Développé par <span style={{ color: COUL, fontWeight: 700 }}>Processingenierie</span> · Hôpital Ndamatou Touba 🇸🇳</p>
      </footer>
    </>
  )
}

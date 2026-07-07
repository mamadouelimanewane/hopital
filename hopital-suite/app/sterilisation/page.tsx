"use client"
import Link from "next/link"

const COUL = "#06b6d4"

const LOTS = [
  { lot: "STE-0341", contenu: "Plateau chirurgie générale", cycle: "Autoclave 134°C", statut: "Conforme", date: "06/07/2026 08h12" },
  { lot: "STE-0342", contenu: "Instruments orthopédie", cycle: "Autoclave 134°C", statut: "Conforme", date: "06/07/2026 09h05" },
  { lot: "STE-0343", contenu: "Endoscopes souples", cycle: "Basse température", statut: "En cours", date: "06/07/2026 10h30" },
  { lot: "STE-0344", contenu: "Plateau maternité", cycle: "Autoclave 134°C", statut: "Non-conforme", date: "06/07/2026 07h40" },
]

const statutCouleur: Record<string, string> = { "Conforme": "#22c55e", "En cours": "#f59e0b", "Non-conforme": "#ef4444" }

export default function SterilisationPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #0a1628; color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .2s both}
        .au3{animation:fadeUp .6s .3s both} .au4{animation:fadeUp .6s .4s both}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
        .stat-card:hover { border-color: ${COUL}44; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: ${COUL}44; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/#applications" className="back-btn">← Retour au Portail Ndamatou</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COUL }} />
          <span style={{ fontSize: 12, color: COUL, fontWeight: 700, letterSpacing: "0.1em" }}>SYSTÈME ACTIF</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        <div className="au1" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: "3rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: `${COUL}20`, border: `2px solid ${COUL}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, boxShadow: `0 0 30px ${COUL}30` }}>🧼</div>
          <div>
            <span style={{ fontSize: 11, color: COUL, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: `${COUL}15`, padding: "3px 10px", borderRadius: 6, border: `1px solid ${COUL}30` }}>Application Hospitalière</span>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, margin: "10px 0" }}>
              <span style={{ background: `linear-gradient(135deg, #fff, ${COUL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Stérilisation</span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 600 }}>
              Traçabilité complète du matériel stérilisé, du prélavage jusqu&apos;au bloc opératoire.
            </p>
          </div>
        </div>

        <div className="au2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          {[
            { val: "34", label: "Cycles du Jour" },
            { val: "99.4%", label: "Taux de Conformité" },
            { val: "2 847", label: "Instruments Tracés" },
            { val: "2", label: "Non-Conformités Signalées" },
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
              { icon: "🔁", titre: "Traçabilité Complète", desc: "Du prélavage à la stérilisation puis au stockage" },
              { icon: "🧫", titre: "Contrôle Biologique", desc: "Suivi des indicateurs de chaque cycle" },
              { icon: "⏳", titre: "Alerte Rupture de Charge", desc: "Notification en cas de stock stérile insuffisant" },
              { icon: "📎", titre: "Historique par Intervention", desc: "Lien direct entre lot stérile et intervention chirurgicale" },
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
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>Lots Récents</h2>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Lot", "Contenu", "Cycle", "Date", "Statut"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOTS.map((l, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 600, color: COUL }}>{l.lot}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{l.contenu}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{l.cycle}</td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.45)" }}>{l.date}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: `${statutCouleur[l.statut]}22`, color: statutCouleur[l.statut], padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{l.statut}</span>
                      </td>
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
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Contactez Processingenierie pour déployer le module Stérilisation dans votre infrastructure.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="mailto:contact@processingenierie.sn" style={{ background: COUL, color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>✉️ Nous contacter</a>
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

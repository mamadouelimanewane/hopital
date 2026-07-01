"use client"
import Link from "next/link"

export default function MagalSurgePage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #0a1628; color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .2s both}
        .au3{animation:fadeUp .6s .3s both} .au4{animation:fadeUp .6s .4s both}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
        .stat-card:hover { border-color: #7c3aed44; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: #7c3aed44; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
      `}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" className="back-btn">← Retour au Portail Ndamatou</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
          <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, letterSpacing: "0.1em" }}>SYSTÈME ACTIF</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* HERO */}
        <div className="au1" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: "3rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "#7c3aed20", border: "2px solid #7c3aed40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, boxShadow: "0 0 30px #7c3aed30" }}>
            🕌
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: "#7c3aed15", padding: "3px 10px", borderRadius: 6, border: "1px solid #7c3aed30" }}>
                Application Hospitalière
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
              <span style={{ background: "linear-gradient(135deg, #fff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Magal-Surge
              </span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 600 }}>
              Module spécifique de préparation et réponse aux afflux massifs lors du Grand Magal de Touba.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="au2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#7c3aed", marginBottom: 4 }}>3M+</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pèlerins Protégés</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#7c3aed", marginBottom: 4 }}>100+</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Postes Coordonnés</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#7c3aed", marginBottom: 4 }}>Live</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Monitoring</p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="au3" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>Fonctionnalités Clés</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7c3aed18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📈</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Prédiction</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Modélisation de l'afflux</p>
            </div>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7c3aed18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏕️</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Postes Avancés</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Gestion des hôpitaux de campagne</p>
            </div>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7c3aed18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚨</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Alerte</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Coordination des secours</p>
            </div>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7c3aed18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📊</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Dashboard</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Vue temps réel de la situation</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="au4" style={{ background: "#7c3aed10", border: "1px solid #7c3aed25", borderRadius: 16, padding: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 800, marginBottom: 8 }}>Prêt à intégrer ce module ?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Contactez Processingenierie pour déployer Magal-Surge dans votre infrastructure.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="mailto:contact@processingenierie.sn" style={{ background: "#7c3aed", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              ✉️ Nous contacter
            </a>
            <Link href="/" style={{ background: "rgba(255,255,255,0.05)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              ← Retour Portail
            </Link>
          </div>
        </div>

      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem", marginTop: "3rem", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Développé par <span style={{ color: "#7c3aed", fontWeight: 700 }}>Processingenierie</span> · Hôpital Ndamatou Touba 🇸🇳</p>
      </footer>
    </>
  )
}

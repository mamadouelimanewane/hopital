"use client"
import Link from "next/link"

export default function NutriCarePage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #0a1628; color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .2s both}
        .au3{animation:fadeUp .6s .3s both} .au4{animation:fadeUp .6s .4s both}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
        .stat-card:hover { border-color: #d9770644; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: #d9770644; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
      `}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" className="back-btn">← Retour au Portail CHNCAK</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d97706" }} />
          <span style={{ fontSize: 12, color: "#d97706", fontWeight: 700, letterSpacing: "0.1em" }}>SYSTÈME ACTIF</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* HERO */}
        <div className="au1" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: "3rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "#d9770620", border: "2px solid #d9770640", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, boxShadow: "0 0 30px #d9770630" }}>
            🍽️
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#d97706", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: "#d9770615", padding: "3px 10px", borderRadius: 6, border: "1px solid #d9770630" }}>
                Application Hospitalière
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
              <span style={{ background: "linear-gradient(135deg, #fff, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Nutri-Care
              </span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 600 }}>
              Gestion personnalisée de la nutrition des patients hospitalisés.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="au2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#d97706", marginBottom: 4 }}>100%</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Repas Personnalisés</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#d97706", marginBottom: 4 }}>0</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Erreur Allergie</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#d97706", marginBottom: 4 }}>3</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Repas/Jour/Patient</p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="au3" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>Fonctionnalités Clés</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#d9770618", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🥗</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Menus</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Adaptés aux pathologies</p>
            </div>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#d9770618", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👩‍⚕️</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Diététique</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Suivi par les spécialistes</p>
            </div>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#d9770618", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏭</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Cuisine</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Lien direct avec la restauration</p>
            </div>
            <div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#d9770618", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📊</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Dénutrition</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Dépistage et prévention</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="au4" style={{ background: "#d9770610", border: "1px solid #d9770625", borderRadius: 16, padding: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 800, marginBottom: 8 }}>Prêt à intégrer ce module ?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Contactez Processingenierie pour déployer Nutri-Care dans votre infrastructure.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="mailto:contact@processingenierie.sn" style={{ background: "#d97706", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              ✉️ Nous contacter
            </a>
            <Link href="/" style={{ background: "rgba(255,255,255,0.05)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              ← Retour Portail
            </Link>
          </div>
        </div>

      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem", marginTop: "3rem", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Développé par <span style={{ color: "#d97706", fontWeight: 700 }}>Processingenierie</span> · Hôpital CHNCAK Touba 🇸🇳</p>
      </footer>
    </>
  )
}

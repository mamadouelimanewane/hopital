export function Footer() {
  return (
    <footer style={{ background: "#0a1628", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1.5rem", marginTop: "auto" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🧠</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Predict-IA</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>IA Médicale Prédictive — Hôpital Ndamatou</p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          © {new Date().getFullYear()} Hôpital Ndamatou — Touba, Sénégal · Tous droits réservés
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>SYSTÈME ACTIF</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

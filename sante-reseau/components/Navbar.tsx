"use client"
export default function Navbar() {
  return (
    <nav style={{ background: "#064e3b", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #10b981" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏥</div>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#10b981" }}>Réseau Santé 🇸🇳</span>
        <span style={{ background: "#10b981", color: "#000", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>RÉSEAU NATIONAL</span>
      </div>
      <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#6ee7b7" }}>
        <span style={{ cursor: "pointer" }}>Hôpitaux</span>
        <span style={{ cursor: "pointer" }}>Transferts</span>
        <span style={{ cursor: "pointer" }}>Dossiers</span>
        <span style={{ cursor: "pointer" }}>Rapports</span>
      </div>
    </nav>
  )
}

"use client"
export default function Navbar() {
  return (
    <nav style={{ background: "#1e3a5f", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "3px solid #3b82f6" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, background: "#3b82f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏅</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Qualité & Accréditation</div>
          <div style={{ fontSize: 11, color: "#93c5fd" }}>CHNCAK — Centre Hospitalier National Cheikh Ahmadou Khadim</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#bfdbfe" }}>
        <span style={{ cursor: "pointer" }}>Indicateurs</span>
        <span style={{ cursor: "pointer" }}>Audits</span>
        <span style={{ cursor: "pointer" }}>Standards JCI</span>
        <span style={{ cursor: "pointer" }}>Rapports</span>
      </div>
    </nav>
  )
}

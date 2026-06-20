"use client"
export default function Navbar() {
  return (
    <nav style={{ background: "rgba(5,20,15,0.97)", borderBottom: "1px solid rgba(34,197,94,0.3)" }}
      className="sticky top-0 z-50 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}>
          <span className="text-white text-sm font-bold">FC</span>
        </div>
        <span className="font-semibold text-white text-lg">FactuCare <span style={{ color: "#22c55e" }}>CHNCAK</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
          Système Actif
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}>CF</div>
      </div>
    </nav>
  )
}

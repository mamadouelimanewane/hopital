"use client"
export default function Navbar() {
  return (
    <nav style={{ background: "rgba(10,15,30,0.95)", borderBottom: "1px solid rgba(99,102,241,0.3)" }}
      className="sticky top-0 z-50 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <span className="text-white text-sm font-bold">IA</span>
        </div>
        <span className="font-semibold text-white text-lg">IA-Diagnostic <span style={{ color: "#6366f1" }}>Ndamatou</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
          IA Active
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>Dr</div>
      </div>
    </nav>
  )
}

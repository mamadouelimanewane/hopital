"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Hospital } from "lucide-react"

const nav = [
  { label: "Tableau de bord", href: "/" },
  { label: "Gestion",         href: "/gestion" },
  { label: "Patients",        href: "/patients" },
  { label: "Statistiques",    href: "/stats" },
  { label: "Rapports",        href: "/rapports" },
  { label: "Paramètres",      href: "/parametres" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: "#0ea5e9", boxShadow: "0 2px 12px rgba(0,0,0,0.15)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ background: "#0a1628", padding: "4px 16px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#0ea5e9", margin: 0, letterSpacing: "0.08em" }}>
          🇸🇳 République du Sénégal · Hôpital Ndamatou de Touba · Ministère de la Santé
        </p>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏥</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>Ndamatou Connect</p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Hôpital Ndamatou · Touba</p>
          </div>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden lg:flex">
          {nav.map(item => (
            <Link key={item.href} href={item.href}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
                background: pathname === item.href ? "rgba(255,255,255,0.2)" : "transparent",
                color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.75)",
                transition: "all 0.2s",
              }}
            >{item.label}</Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: 0.9, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, letterSpacing: "0.1em" }}>EN LIGNE</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar

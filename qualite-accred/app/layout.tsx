import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Qualité & Accréditation — CHNCAK",
  description: "Tableau de bord qualité OMS et accréditation JCI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: "#f0f4f8", color: "#1a202c", fontFamily: "'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}

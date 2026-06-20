import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Réseau Santé Sénégal — CHNCAK",
  description: "Plateforme nationale de partage inter-hôpitaux",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0a", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}

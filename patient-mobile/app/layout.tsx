import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CHNCAK Mobile — Votre santé en poche",
  description: "Application mobile patient CHNCAK",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: "#111", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CNRA Suite — Plateforme numérique intégrée",
  description: "Suite de 6 applications gouvernementales pour le Conseil National de Régulation de l'Audiovisuel du Sénégal. Surveillance électorale, médias, deepfakes, éducation aux médias.",
  keywords: ["CNRA", "Sénégal", "audiovisuel", "médias", "régulation", "gouvernement"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen" style={{ fontFamily: "var(--font-sans)", background: "#060e1f" }}>
        {children}
      </body>
    </html>
  )
}

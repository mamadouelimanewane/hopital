import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ndamatou Connect — Portail Patient",
  description: "L'application centrale pour tous les patients de l'Hôpital Ndamatou de Touba : rendez-vous, résultats, téléconsultation et paiement en ligne.",
  openGraph: {
    title: "Ndamatou Connect",
    description: "Portail Patient & Télémédecine — Hôpital Ndamatou de Touba",
    locale: "fr_SN",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50" style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  )
}

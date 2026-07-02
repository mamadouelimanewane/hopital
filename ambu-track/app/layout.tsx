import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ambu-Track — Hôpital Ndamatou de Touba",
  description: "Gestion de flotte et régulation des ambulances en temps réel pour l'Hôpital Ndamatou de Touba.",
  openGraph: {
    title: "Ambu-Track — Hôpital Ndamatou",
    description: "Contrôle aérien des urgences et suivi GPS des ambulances",
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

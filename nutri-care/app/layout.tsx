import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nutri-Care — Hôpital Ndamatou de Touba",
  description: "Gestion personnalisée de la nutrition des patients hospitalisés à l'Hôpital Ndamatou de Touba.",
  openGraph: {
    title: "Nutri-Care — Hôpital Ndamatou",
    description: "Suivi Nutritionnel Médical",
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

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Predict-IA — Hôpital Ndamatou de Touba",
  description: "Intelligence artificielle pour la gestion prédictive des ressources hospitalières de l'Hôpital Ndamatou de Touba : flux patients, lits, personnel et budget.",
  openGraph: {
    title: "Predict-IA — Hôpital Ndamatou",
    description: "Tableau de bord IA prédictif de l'Hôpital Ndamatou de Touba",
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

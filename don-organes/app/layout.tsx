import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Don-Organes — Registre National Donneurs",
  description: "Gestion sécurisée, éthique et transparente des dons et transplantations d'organes à l'Hôpital Ndamatou de Touba.",
  openGraph: {
    title: "Don-Organes — Hôpital Ndamatou",
    description: "Registre National Donneurs",
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

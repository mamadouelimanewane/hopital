import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NeuroScan-IA — Hôpital Ndamatou de Touba",
  description: "Outil d'aide au diagnostic pour l'imagerie médicale (IRM, Scanner) de l'Hôpital Ndamatou de Touba.",
  openGraph: {
    title: "NeuroScan-IA — Hôpital Ndamatou",
    description: "Assistant Radiologique par IA",
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

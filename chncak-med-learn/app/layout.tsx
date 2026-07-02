import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Med-Learn — Hôpital Ndamatou de Touba",
  description: "Plateforme de formation continue pour le personnel médical de l'Hôpital Ndamatou de Touba.",
  openGraph: {
    title: "Med-Learn — Hôpital Ndamatou",
    description: "Université & Staffs Médicaux — Formation continue",
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

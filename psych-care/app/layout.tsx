import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Psych-Care — Hôpital Ndamatou de Touba",
  description: "Soutien psychologique accessible, confidentiel et assisté par intelligence artificielle à l'Hôpital Ndamatou de Touba.",
  openGraph: {
    title: "Psych-Care — Hôpital Ndamatou",
    description: "Santé Mentale Anonyme & IA",
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

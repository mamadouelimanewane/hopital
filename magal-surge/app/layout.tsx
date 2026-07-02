import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Magal-Surge — Hôpital Ndamatou de Touba",
  description: "Module de préparation et réponse aux afflux massifs lors du Grand Magal de Touba.",
  openGraph: {
    title: "Magal-Surge — Hôpital Ndamatou",
    description: "Gestion de Crise Grand Magal",
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

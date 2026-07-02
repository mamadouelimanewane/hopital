import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Éco-Hôpital — Hôpital Ndamatou de Touba",
  description: "Gestion intelligente de la consommation énergétique et écologique de l'Hôpital Ndamatou de Touba.",
  openGraph: {
    title: "Éco-Hôpital — Hôpital Ndamatou",
    description: "Smart Grid & Jumeau Énergétique",
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

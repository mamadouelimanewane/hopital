import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ndamatou Suite — Hôpital de Référence",
  description: "Suite de 34 applications médicales pour l'Hôpital Ndamatou de Touba au Sénégal. Gestion hospitalière, IA médicale, dossiers partagés et suivi patient.",
  keywords: ["Ndamatou", "Touba", "Sénégal", "hôpital", "santé", "médical", "IA"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen" style={{ fontFamily: "var(--font-sans)", background: "#060e1f" }}>
        {children}
      </body>
    </html>
  )
}

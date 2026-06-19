import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    template: "%s — CNRA ElectroWatch",
    default: "CNRA ElectroWatch",
  },
  description: "Surveillance du temps de parole et de l'équité médiatique électorale",
  keywords: ["CNRA", "Sénégal", "élections", "médias", "pluralisme", "régulation audiovisuelle"],
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased min-h-screen bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}

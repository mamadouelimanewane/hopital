import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })
export const metadata: Metadata = { title: "FactuCare CHNCAK", description: "Module de facturation et assurance maladie" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: { template: '%s — CNRA EduMedia', default: 'CNRA EduMedia' },
  description: 'Éducation aux médias et littératie médiatique',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950" style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  )
}

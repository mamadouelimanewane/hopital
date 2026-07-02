import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Qualité-JCI — Accréditation Hôpital Ndamatou",
  description: "Système de suivi qualité et accréditation JCI pour l'Hôpital Ndamatou de Touba.",
  keywords: ["qualité", "JCI", "accréditation", "Ndamatou", "ISO"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

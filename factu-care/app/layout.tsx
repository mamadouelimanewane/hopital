import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "FactuCare — Facturation & Assurance",
  description: "Système de facturation, recouvrement et assurance maladie de l'Hôpital Ndamatou.",
  keywords: ["facturation", "assurance", "Ndamatou", "CMU", "finances"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

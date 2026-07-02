import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Don & Diaspora — Hôpital Ndamatou",
  description: "Plateforme de dons et financement participatif pour l'Hôpital Ndamatou de Touba.",
  keywords: ["don", "diaspora", "financement", "Ndamatou", "Touba"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

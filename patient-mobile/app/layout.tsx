import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Patient Mobile — Espace Patient Ndamatou",
  description: "Application mobile patient pour l'Hôpital Ndamatou de Touba.",
  keywords: ["patient", "mobile", "rendez-vous", "Ndamatou", "portail"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

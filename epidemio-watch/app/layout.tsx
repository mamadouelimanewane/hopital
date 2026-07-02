import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Épidémio-Watch — Surveillance Sénégal",
  description: "Surveillance épidémiologique temps réel — Hôpital Ndamatou de Touba.",
  keywords: ["épidémiologie", "surveillance", "Ndamatou", "maladies", "alerte"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

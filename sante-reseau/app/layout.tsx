import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Réseau Santé SN — Réseau Hospitalier Sénégal",
  description: "Portail d'interconnexion des hôpitaux et centres de santé du Sénégal.",
  keywords: ["réseau", "santé", "hôpitaux", "Sénégal", "interconnexion"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

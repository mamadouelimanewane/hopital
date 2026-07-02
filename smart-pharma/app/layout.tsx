import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "SmartPharma — Pharmacie Centrale Hôpital Ndamatou",
  description: "Gestion des stocks médicamenteux, ordonnances et fournisseurs pour l'Hôpital Ndamatou de Touba.",
  keywords: ["pharmacie", "Ndamatou", "Touba", "médicaments", "stocks"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

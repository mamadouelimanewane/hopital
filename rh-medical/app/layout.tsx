import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "RH Médical — Ressources Humaines Hôpital Ndamatou",
  description: "Gestion du personnel médical et administratif de l'Hôpital Ndamatou.",
  keywords: ["rh", "ressources humaines", "médical", "planning", "Ndamatou"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

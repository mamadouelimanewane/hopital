import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Smart Beds — Gestion Intelligente des Lits",
  description: "Suivi en temps réel de l'occupation des lits de l'Hôpital Ndamatou.",
  keywords: ["lits", "hospitalisation", "Ndamatou", "occupation", "smart beds"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

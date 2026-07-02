import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Lab Connect — Laboratoire Connecté Ndamatou",
  description: "Gestion du laboratoire médical de l'Hôpital Ndamatou de Touba.",
  keywords: ["laboratoire", "analyses", "Ndamatou", "biologie", "automates"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

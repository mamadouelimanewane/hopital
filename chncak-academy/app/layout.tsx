import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Ndamatou Academy — Formation Médicale",
  description: "Plateforme de formation médicale continue de l'Hôpital Ndamatou de Touba.",
  keywords: ["formation", "academy", "Ndamatou", "médical", "e-learning"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

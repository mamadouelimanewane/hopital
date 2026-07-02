import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "IA Diagnostic — Intelligence Artificielle Médicale",
  description: "Diagnostic assisté par IA pour l'Hôpital Ndamatou de Touba.",
  keywords: ["IA", "diagnostic", "radiologie", "Ndamatou", "intelligence artificielle"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

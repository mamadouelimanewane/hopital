import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Chatbot Triage — Hôpital Ndamatou",
  description: "Assistant de triage médical IA multilingue pour l'Hôpital Ndamatou de Touba.",
  keywords: ["triage", "chatbot", "Ndamatou", "urgences", "IA"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

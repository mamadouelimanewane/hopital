import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Touba MedCare — Médecine du Grand Magal",
  description: "Système de gestion médicale pour le Grand Magal de Touba — Hôpital Ndamatou.",
  keywords: ["Magal", "Touba", "Ndamatou", "santé", "pèlerinage"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}

import type { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: { template: "%s — CNRA Citoyen", default: "CNRA Citoyen" },
  description: "Portail officiel de participation citoyenne du Conseil National de Régulation de l'Audiovisuel du Sénégal",
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

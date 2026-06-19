import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { envoyerAlerteDesequilibre } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const { alerte_id } = body

    // Récupérer l'alerte avec ses relations
    const { data: alerte } = await supabase
      .from("alertes")
      .select("*, media:medias(*), parti:partis(*), campagne:campagnes(*)")
      .eq("id", alerte_id)
      .single()

    if (!alerte) return NextResponse.json({ error: "Alerte introuvable" }, { status: 404 })

    // Récupérer les contacts qui veulent les notifications d'alertes
    const { data: contacts } = await supabase
      .from("contacts_cnra")
      .select("email")
      .eq("actif", true)
      .eq("notif_alertes", true)

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ message: "Aucun destinataire configuré" })
    }

    const ecartPct = parseFloat(alerte.details?.match(/(\d+\.?\d*)%/)?.[1] ?? "0")

    await envoyerAlerteDesequilibre({
      destinataires: contacts.map((c: { email: string }) => c.email),
      medianom: alerte.media?.nom ?? "Inconnu",
      partiNom: alerte.parti?.nom ?? "Inconnu",
      ecartPct,
      campagneNom: alerte.campagne?.nom ?? "Inconnue",
    })

    // Logger la notification
    await supabase.from("notifications_log").insert({
      type: "email",
      destinataire: contacts.map((c: { email: string }) => c.email).join(", "),
      sujet: `Alerte déséquilibre — ${alerte.media?.nom}`,
      contenu: alerte.message,
      statut: "envoye",
      reference_id: alerte_id,
      reference_type: "alerte",
    })

    return NextResponse.json({ success: true, destinataires: contacts.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur envoi notification" }, { status: 500 })
  }
}

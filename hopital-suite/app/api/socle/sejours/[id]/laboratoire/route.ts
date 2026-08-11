import { NextRequest, NextResponse } from "next/server"
import {
  prescrireBiologie, enregistrerPrelevement, saisirResultat, validerBiologiquement,
} from "@/lib/laboratoire"
import { cloturerEtFacturer } from "@/lib/facturation"
import { exiger, ErreurAcces } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Chaque action correspond à un geste réel, avec le rôle qui l'exerce. */
const DROIT: Record<string, string> = {
  prescrire: "labo.prescrire",
  prelever:  "labo.prelever",
  resultat:  "labo.resultat",
  valider:   "labo.valider",
  cloturer:  "sejour.cloturer",
}

/**
 * POST /api/socle/sejours/:id/laboratoire
 *
 * Le nom du prescripteur, du préleveur et du biologiste n'est plus
 * accepté depuis le client : il vient de la session. C'est ce qui
 * rend le journal opposable.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const sejourId = Number(id)
    if (!Number.isInteger(sejourId)) {
      return NextResponse.json({ erreur: "Identifiant invalide" }, { status: 400 })
    }

    const b = await req.json()
    const action = String(b?.action || "")
    const droit = DROIT[action]
    if (!droit) return NextResponse.json({ erreur: "Action inconnue" }, { status: 400 })

    const session = exiger(req, droit)
    const moi = session.nom || session.identifiant

    switch (action) {
      case "prescrire":
        return NextResponse.json(
          await prescrireBiologie(sejourId, {
            prescripteur: moi,
            codes: b.codes || [],
            indication: b.indication,
            urgence: b.urgence,
          }, session.identifiant),
          { status: 201 },
        )

      case "prelever":
        return NextResponse.json(
          await enregistrerPrelevement(Number(b.acteId), moi, session.identifiant),
        )

      case "resultat":
        return NextResponse.json(
          await saisirResultat(Number(b.acteId), {
            valeur: String(b.valeur ?? ""),
            unite: b.unite, reference: b.reference,
            critique: b.critique === true, commentaire: b.commentaire,
          }, session.identifiant),
          { status: 201 },
        )

      case "valider":
        return NextResponse.json(
          await validerBiologiquement(Number(b.acteId), moi, session.identifiant),
        )

      case "cloturer":
        return NextResponse.json(
          await cloturerEtFacturer(sejourId, b.modeSortie || "domicile", {
            forcer: b.forcer === true,
            acteur: session.identifiant,
          }),
        )

      default:
        return NextResponse.json({ erreur: "Action inconnue" }, { status: 400 })
    }
  } catch (e) {
    if (e instanceof ErreurAcces) {
      return NextResponse.json({ erreur: e.message }, { status: e.statut })
    }
    return NextResponse.json(
      { erreur: e instanceof Error ? e.message : "Erreur" }, { status: 400 },
    )
  }
}

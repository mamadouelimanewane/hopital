import { NextRequest, NextResponse } from "next/server"
import {
  demanderImagerie, programmer, realiser, interpreter, signerCompteRendu,
} from "@/lib/imagerie"
import { exiger, ErreurAcces } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DROIT: Record<string, string> = {
  demander:    "imagerie.demander",
  programmer:  "imagerie.programmer",
  realiser:    "imagerie.realiser",
  interpreter: "imagerie.interpreter",
  signer:      "imagerie.signer",
}

/**
 * POST /api/socle/sejours/:id/imagerie
 *
 * Comme au laboratoire, l'identité de l'opérateur vient de la
 * session : le nom du manipulateur et celui du radiologue signataire
 * ne sont jamais acceptés depuis le client.
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
      case "demander":
        return NextResponse.json(
          await demanderImagerie(sejourId, {
            prescripteur: moi,
            codes: b.codes || [],
            indication: String(b.indication ?? ""),
            urgence: b.urgence,
          }, session.identifiant),
          { status: 201 },
        )

      case "programmer":
        return NextResponse.json(
          await programmer(Number(b.acteId), b.creneau || new Date(), session.identifiant),
        )

      case "realiser":
        return NextResponse.json(
          await realiser(Number(b.acteId), {
            manipulateur: moi,
            dose: b.dose === undefined || b.dose === null ? undefined : Number(b.dose),
            doseUnite: b.doseUnite,
            contrasteUtilise: b.contrasteUtilise,
          }, session.identifiant),
          { status: 201 },
        )

      case "interpreter":
        return NextResponse.json(
          await interpreter(Number(b.acteId), {
            compteRendu: String(b.compteRendu ?? ""),
            conclusion: b.conclusion,
            anomalie: b.anomalie === true,
          }, session.identifiant),
          { status: 201 },
        )

      case "signer":
        return NextResponse.json(
          await signerCompteRendu(Number(b.acteId), moi, session.identifiant),
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

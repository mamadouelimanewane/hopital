import { NextRequest, NextResponse } from "next/server"
import {
  prescrireMedicaments, analyserPrescription, dispenser,
  administrer, retourner, arreter,
} from "@/lib/pharmacie"
import { exiger, ErreurAcces } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DROIT: Record<string, string> = {
  prescrire:   "pharma.prescrire",
  analyser:    "pharma.analyser",
  dispenser:   "pharma.dispenser",
  administrer: "pharma.administrer",
  retourner:   "pharma.retourner",
  arreter:     "pharma.arreter",
}

/**
 * POST /api/socle/sejours/:id/pharmacie
 *
 * Comme sur les autres plateaux, l'identité de l'opérateur vient de
 * la session : ni le prescripteur, ni le pharmacien analysant, ni le
 * soignant administrant ne sont acceptés depuis le client.
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
          await prescrireMedicaments(sejourId, {
            prescripteur: moi,
            lignes: b.lignes || [],
            indication: b.indication,
            urgence: b.urgence,
          }, session.identifiant),
          { status: 201 },
        )

      case "analyser":
        return NextResponse.json(
          await analyserPrescription(Number(b.prescriptionId), {
            avis: b.avis, motif: b.motif, pharmacien: moi,
          }, session.identifiant),
        )

      case "dispenser":
        return NextResponse.json(
          await dispenser(Number(b.ligneId), Number(b.quantite ?? 1), session.identifiant),
        )

      case "administrer":
        return NextResponse.json(
          await administrer(Number(b.ligneId), {
            soignant: moi,
            quantite: b.quantite === undefined ? undefined : Number(b.quantite),
            commentaire: b.commentaire,
          }, session.identifiant),
          { status: 201 },
        )

      case "retourner":
        return NextResponse.json(
          await retourner(
            Number(b.ligneId), Number(b.quantite ?? 1),
            String(b.motif ?? ""), session.identifiant,
          ),
        )

      case "arreter":
        return NextResponse.json(
          await arreter(Number(b.ligneId), String(b.motif ?? ""), session.identifiant),
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

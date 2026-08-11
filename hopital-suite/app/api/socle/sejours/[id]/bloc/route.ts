import { NextRequest, NextResponse } from "next/server"
import {
  recueillirConsentement, consultationAnesthesie, programmerIntervention,
  validerVerification, induire, inciser, poserImplant, sortirDeSalle,
  type Temps,
} from "@/lib/bloc"
import { exiger, ErreurAcces } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DROIT: Record<string, string> = {
  consentement: "bloc.consentement",
  anesthesie:   "bloc.anesthesie",
  programmer:   "bloc.programmer",
  verifier:     "bloc.verifier",
  induire:      "bloc.induire",
  inciser:      "bloc.inciser",
  implant:      "bloc.implant",
  sortie:       "bloc.sortie",
}

/**
 * POST /api/socle/sejours/:id/bloc
 *
 * Chaque action correspond à un moment réel de la prise en charge
 * chirurgicale, exercé par le rôle qui l'exerce en salle. L'identité
 * du signataire vient de la session.
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
      case "consentement":
        return NextResponse.json(
          await recueillirConsentement(sejourId, {
            objet: String(b.objet ?? ""),
            signePar: String(b.signePar ?? ""),
            qualite: b.qualite,
            recueilliPar: moi,
          }, session.identifiant),
          { status: 201 },
        )

      case "anesthesie":
        return NextResponse.json(
          await consultationAnesthesie(sejourId, moi, session.identifiant),
          { status: 201 },
        )

      case "programmer":
        return NextResponse.json(
          await programmerIntervention(sejourId, {
            codeActe: String(b.codeActe ?? ""),
            chirurgien: moi,
            anesthesiste: b.anesthesiste,
            salle: b.salle,
            creneau: b.creneau,
            consentementId: b.consentementId,
            consultationAnesthesieId: b.consultationAnesthesieId,
          }, session.identifiant),
          { status: 201 },
        )

      case "verifier":
        return NextResponse.json(
          await validerVerification(
            Number(b.interventionId), b.temps as Temps,
            b.points || {}, moi, session.identifiant,
          ),
        )

      case "induire":
        return NextResponse.json(await induire(Number(b.interventionId), session.identifiant))

      case "inciser":
        return NextResponse.json(await inciser(Number(b.interventionId), session.identifiant))

      case "implant":
        return NextResponse.json(
          await poserImplant(Number(b.interventionId), {
            code: String(b.code ?? ""),
            numeroLot: String(b.numeroLot ?? ""),
            peremption: b.peremption,
            quantite: b.quantite === undefined ? undefined : Number(b.quantite),
          }, session.identifiant),
          { status: 201 },
        )

      case "sortie":
        return NextResponse.json(
          await sortirDeSalle(Number(b.interventionId), {
            compteRendu: String(b.compteRendu ?? ""),
            codeAnesthesie: b.codeAnesthesie,
            chirurgien: moi,
          }, session.identifiant),
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

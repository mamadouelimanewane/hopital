import { NextRequest, NextResponse } from "next/server"
import {
  encaisser, constituerBordereau, envoyerBordereau, enregistrerRetour,
  relancer, creancesEnCours, rejetsARetraiter, indicateurs,
  recetteParFamille, etatFacture,
} from "@/lib/recouvrement"
import { exiger, ErreurAcces } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function erreur(e: unknown) {
  if (e instanceof ErreurAcces) {
    return NextResponse.json({ erreur: e.message }, { status: e.statut })
  }
  return NextResponse.json(
    { erreur: e instanceof Error ? e.message : "Erreur" }, { status: 400 })
}

/** GET /api/socle/recouvrement — tableau de bord du service. */
export async function GET(req: NextRequest) {
  try {
    exiger(req, "recouvrement.piloter")
    const [chiffres, creances, rejets, recette] = await Promise.all([
      indicateurs(), creancesEnCours(), rejetsARetraiter(), recetteParFamille(),
    ])
    return NextResponse.json({ indicateurs: chiffres, creances, rejets, recette })
  } catch (e) { return erreur(e) }
}

const DROIT: Record<string, string> = {
  encaisser:  "recouvrement.encaisser",
  bordereau:  "recouvrement.bordereau",
  envoyer:    "recouvrement.bordereau",
  retour:     "recouvrement.bordereau",
  relancer:   "recouvrement.relancer",
  etat:       "recouvrement.piloter",
}

/** POST /api/socle/recouvrement — { action, … } */
export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const action = String(b?.action || "")
    const droit = DROIT[action]
    if (!droit) return NextResponse.json({ erreur: "Action inconnue" }, { status: 400 })

    const session = exiger(req, droit)

    switch (action) {
      case "encaisser":
        return NextResponse.json(
          await encaisser(Number(b.factureId), {
            montant: Number(b.montant), moyen: b.moyen, reference: b.reference,
          }, session.identifiant),
          { status: 201 },
        )

      case "bordereau":
        return NextResponse.json(
          await constituerBordereau(String(b.organisme ?? ""), {
            regime: b.regime, acteur: session.identifiant,
          }),
          { status: 201 },
        )

      case "envoyer":
        return NextResponse.json(
          await envoyerBordereau(Number(b.bordereauId), session.identifiant))

      case "retour":
        return NextResponse.json(
          await enregistrerRetour(
            Number(b.bordereauId), b.retours || [], session.identifiant))

      case "relancer":
        return NextResponse.json(
          await relancer(Number(b.factureId), b.niveau, b.canal, session.identifiant),
          { status: 201 },
        )

      case "etat":
        return NextResponse.json(await etatFacture(Number(b.factureId)))

      default:
        return NextResponse.json({ erreur: "Action inconnue" }, { status: 400 })
    }
  } catch (e) { return erreur(e) }
}

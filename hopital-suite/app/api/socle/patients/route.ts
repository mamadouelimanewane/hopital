import { NextRequest, NextResponse } from "next/server"
import { rechercherDoublons } from "@/lib/identite"
import { admettre } from "@/lib/admission"
import { query } from "@/lib/db"
import { exiger, ErreurAcces } from "@/lib/auth"

// Le driver Postgres impose l'exécution Node.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function erreur(e: unknown, statutParDefaut = 400) {
  if (e instanceof ErreurAcces) {
    return NextResponse.json({ erreur: e.message }, { status: e.statut })
  }
  const message = e instanceof Error ? e.message : "Erreur inattendue"
  return NextResponse.json({ erreur: message }, { status: statutParDefaut })
}

/** GET /api/socle/patients?nom=&prenom=&naissance= — rapprochements. */
export async function GET(req: NextRequest) {
  try {
    exiger(req, "patient.rechercher")
    const p = req.nextUrl.searchParams
    const nom = p.get("nom") || ""
    const prenom = p.get("prenom") || ""

    if (!nom && !prenom) {
      const recents = await query(
        `SELECT p.id, p.ipp, p.nom, p.prenom, p.date_naissance, p.statut_identite,
                s.id AS sejour_id, s.nda, s.statut AS sejour_statut
           FROM patient p
           LEFT JOIN sejour s ON s.patient_id = p.id AND s.statut = 'ouvert'
          WHERE p.statut_identite <> 'fusionnee'
          ORDER BY p.cree_le DESC LIMIT 20`,
      )
      return NextResponse.json({ recents })
    }

    const candidats = await rechercherDoublons({
      nom, prenom,
      dateNaissance: p.get("naissance"),
      sexe: p.get("sexe"),
      telephone: p.get("telephone"),
    })
    return NextResponse.json({ candidats })
  } catch (e) { return erreur(e, 500) }
}

/** POST /api/socle/patients — admission. */
export async function POST(req: NextRequest) {
  try {
    const session = exiger(req, "patient.admettre")
    const b = await req.json()
    if (!b?.traits?.nom || !b?.traits?.prenom) {
      return NextResponse.json({ erreur: "Nom et prénom requis" }, { status: 400 })
    }

    const resultat = await admettre(
      b.traits,
      b.sejour ?? { modeEntree: "consultation_programmee" },
      {
        patientExistantId: b.patientExistantId,
        forcerCreation: b.forcerCreation === true,
        couverture: b.couverture,
        // L'agent qui admet est celui qui est connecté, pas celui que
        // le navigateur déclare.
        acteur: session.identifiant,
      },
    )
    return NextResponse.json(resultat, { status: resultat.statut === "admis" ? 201 : 200 })
  } catch (e) { return erreur(e) }
}

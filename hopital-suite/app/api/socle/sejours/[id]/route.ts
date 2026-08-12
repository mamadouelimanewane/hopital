import { NextRequest, NextResponse } from "next/server"
import { one } from "@/lib/db"
import { examensDuSejour } from "@/lib/laboratoire"
import { examensImagerie, doseCumulee } from "@/lib/imagerie"
import { traitementDuSejour } from "@/lib/pharmacie"
import { interventionsDuSejour } from "@/lib/bloc"
import { journeesDuSejour } from "@/lib/hebergement"
import { compteurSejour, controlerCoherence } from "@/lib/facturation"
import { exiger, ErreurAcces } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** GET /api/socle/sejours/:id — vue complète du séjour. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    exiger(req, "sejour.consulter")
    const { id } = await ctx.params
    const sejourId = Number(id)
    if (!Number.isInteger(sejourId)) {
      return NextResponse.json({ erreur: "Identifiant invalide" }, { status: 400 })
    }

    const sejour = await one(
      `SELECT s.id, s.nda, s.mode_entree, s.motif_entree, s.triage, s.entree_le,
              s.sortie_le, s.mode_sortie, s.statut,
              p.id AS patient_id, p.ipp, p.nom, p.prenom, p.date_naissance,
              p.sexe, p.statut_identite,
              c.regime, c.organisme, c.taux_prise_en_charge, c.plafond, c.consomme
         FROM sejour s
         JOIN patient p ON p.id = s.patient_id
         LEFT JOIN couverture c ON c.id = s.couverture_id
        WHERE s.id = $1`,
      [sejourId],
    )
    if (!sejour) return NextResponse.json({ erreur: "Séjour introuvable" }, { status: 404 })

    const [examens, imagerie, traitement, interventions, journees, compteur, anomalies] =
      await Promise.all([
        examensDuSejour(sejourId),
        examensImagerie(sejourId),
        traitementDuSejour(sejourId),
        interventionsDuSejour(sejourId),
        journeesDuSejour(sejourId),
        compteurSejour(sejourId),
        controlerCoherence(sejourId),
      ])

    // La dose cumulée se lit sur la vie du patient, pas sur le séjour.
    const dose = await doseCumulee(Number((sejour as { patient_id: number }).patient_id))

    return NextResponse.json({
      sejour, examens, imagerie, traitement, interventions, journees,
      dose, compteur, anomalies,
    })
  } catch (e) {
    if (e instanceof ErreurAcces) {
      return NextResponse.json({ erreur: e.message }, { status: e.statut })
    }
    return NextResponse.json(
      { erreur: e instanceof Error ? e.message : "Erreur" }, { status: 500 },
    )
  }
}

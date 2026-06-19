import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { question, campagne_id } = await req.json()
    const supabase = await createClient()

    // Collecter les données contextuelles
    const [statsParti, statsMedia, alertes, campagne] = await Promise.all([
      supabase.from("v_stats_parti_campagne").select("*").eq("campagne_id", campagne_id),
      supabase.from("v_stats_media_campagne").select("*").eq("campagne_id", campagne_id),
      supabase.from("alertes").select("*, media:medias(nom), parti:partis(nom)").eq("campagne_id", campagne_id),
      supabase.from("campagnes").select("*").eq("id", campagne_id).single(),
    ])

    const contexte = `
Tu es l'assistant IA officiel du CNRA (Conseil National de Régulation de l'Audiovisuel du Sénégal).
Tu analyses les données de monitoring du temps de parole électoral et fournis des analyses précises et professionnelles.
Tu réponds toujours en français, de manière concise et structurée, avec un ton institutionnel.

DONNÉES DE LA CAMPAGNE : ${campagne.data?.nom ?? "Inconnue"}
Période : ${campagne.data?.date_debut} → ${campagne.data?.date_fin}
Seuil d'alerte : ${campagne.data?.seuil_alerte_pct}%

TEMPS DE PAROLE PAR PARTI :
${statsParti.data?.map((s: Record<string, unknown>) => `- ${s.parti_sigle} (${s.parti_nom}): ${Math.round(Number(s.total_secondes)/60)} min — ${s.pourcentage}% — ${s.nb_interventions} interventions`).join("\n") ?? "Aucune donnée"}

STATS PAR MÉDIA :
${statsMedia.data?.map((s: Record<string, unknown>) => `- ${s.media_nom}: ${Math.round(Number(s.total_secondes)/60)} min totales — ${s.nb_interventions} interventions`).join("\n") ?? "Aucune donnée"}

ALERTES ACTIVES (${alertes.data?.length ?? 0}) :
${alertes.data?.slice(0, 5).map((a: Record<string, unknown>) => `- [${(a.niveau as string).toUpperCase()}] ${a.message}`).join("\n") ?? "Aucune alerte"}

Réponds à la question de l'agent CNRA de manière professionnelle, factuelle et actionnable.
Si tu identifies des problèmes, propose des actions concrètes conformes aux missions du CNRA.
Limite ta réponse à 200 mots maximum.
`

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [
        { role: "user", content: `${contexte}\n\nQUESTION : ${question}` }
      ],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return NextResponse.json({ reponse: text })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur IA" }, { status: 500 })
  }
}

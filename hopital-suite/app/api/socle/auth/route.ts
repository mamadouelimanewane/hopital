import { NextRequest, NextResponse } from "next/server"
import { connecter, signer, enteteCookie, sessionDe } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** GET /api/socle/auth — session courante. */
export async function GET(req: NextRequest) {
  const s = sessionDe(req)
  if (!s) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 })
  return NextResponse.json({ session: s })
}

/** POST /api/socle/auth — connexion. */
export async function POST(req: NextRequest) {
  try {
    const { identifiant, motDePasse } = await req.json()
    if (!identifiant || !motDePasse) {
      return NextResponse.json({ erreur: "Identifiant et mot de passe requis" }, { status: 400 })
    }
    const session = await connecter(identifiant, motDePasse)
    const reponse = NextResponse.json({ session })
    reponse.headers.set("Set-Cookie", enteteCookie(signer(session)))
    return reponse
  } catch (e) {
    return NextResponse.json(
      { erreur: e instanceof Error ? e.message : "Connexion impossible" },
      { status: 401 },
    )
  }
}

/** DELETE /api/socle/auth — déconnexion. */
export async function DELETE() {
  const reponse = NextResponse.json({ ok: true })
  reponse.headers.set("Set-Cookie", enteteCookie(null))
  return reponse
}

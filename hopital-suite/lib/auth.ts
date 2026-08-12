/* ════════════════════════════════════════════════════════════════
   Authentification et rôles.

   Deux raisons d'exister, la seconde aussi importante que la
   première :

   1. Restreindre l'accès aux données de santé.
   2. Garantir l'identité de l'acteur au journal. Tant que le nom du
      biologiste venait du corps de la requête, n'importe qui pouvait
      signer une validation « Dr. Mbaye ». Un dossier de soins doit
      être opposable : l'identité vient désormais de la session.
   ════════════════════════════════════════════════════════════════ */

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { one, query, journaliser } from "./db"

export type Role =
  | "accueil" | "infirmier" | "technicien" | "medecin"
  | "biologiste" | "manipulateur" | "radiologue"
  | "chirurgien" | "anesthesiste" | "bloc"
  | "pharmacien" | "facturation" | "admin"

export interface Session {
  id: number
  identifiant: string
  nom: string
  role: Role
  unite: string
}

const COOKIE = "ndamatou_session"
const DUREE = 60 * 60 * 12          // 12 h — une garde
const COUT_BCRYPT = 12

function secret(): string {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 32) {
    throw new Error(
      "JWT_SECRET absent ou trop court (32 caractères minimum). " +
      "Générer : node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"",
    )
  }
  return s
}

export const hacher = (motDePasse: string) => bcrypt.hash(motDePasse, COUT_BCRYPT)
export const verifier = (motDePasse: string, empreinte: string) =>
  bcrypt.compare(motDePasse, empreinte || "")

export function signer(s: Session): string {
  return jwt.sign(s, secret(), { expiresIn: DUREE, issuer: "ndamatou" })
}

export function lireJeton(jeton: string): Session | null {
  try {
    return jwt.verify(jeton, secret(), { issuer: "ndamatou" }) as Session
  } catch {
    return null
  }
}

/* ── Cookie ─────────────────────────────────────────────────────── */
export function enteteCookie(jeton: string | null): string {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : ""
  if (jeton === null) {
    return `${COOKIE}=; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=0`
  }
  return `${COOKIE}=${jeton}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${DUREE}`
}

function jetonDepuisEntete(cookie: string | null): string | null {
  if (!cookie) return null
  for (const part of cookie.split(";")) {
    const i = part.indexOf("=")
    if (i === -1) continue
    if (part.slice(0, i).trim() === COOKIE) return part.slice(i + 1).trim()
  }
  return null
}

/** Session portée par la requête, ou null. */
export function sessionDe(req: { headers: { get(n: string): string | null } }): Session | null {
  const jeton = jetonDepuisEntete(req.headers.get("cookie"))
  return jeton ? lireJeton(jeton) : null
}

/* ── Connexion ──────────────────────────────────────────────────── */
export async function connecter(identifiant: string, motDePasse: string): Promise<Session> {
  const u = await one<{
    id: number; identifiant: string; mot_de_passe: string;
    nom_complet: string; role: Role; unite: string; actif: boolean;
  }>(
    `SELECT id, identifiant, mot_de_passe, nom_complet, role, unite, actif
       FROM utilisateur WHERE lower(identifiant) = lower($1)`,
    [String(identifiant || "").trim()],
  )

  // Message identique dans tous les cas : ne pas révéler quels
  // identifiants existent.
  const REFUS = "Identifiants incorrects"
  if (!u || !(await verifier(motDePasse, u.mot_de_passe))) throw new Error(REFUS)
  if (!u.actif) throw new Error("Compte désactivé. Contactez l'administration.")

  await query(`UPDATE utilisateur SET derniere_connexion = now() WHERE id = $1`, [u.id])
  await journaliser("utilisateur", u.id, "connexion", u.identifiant)

  return {
    id: u.id, identifiant: u.identifiant, nom: u.nom_complet,
    role: u.role, unite: u.unite || "",
  }
}

/* ── Permissions ────────────────────────────────────────────────── */
/**
 * Qui a le droit de faire quoi. L'admin est volontairement absent des
 * listes : il est ajouté partout par `autorise`, mais chaque geste
 * reste tracé sous son identité réelle.
 */
export const PERMISSIONS: Record<string, Role[]> = {
  "patient.rechercher": ["accueil", "medecin", "infirmier", "facturation"],
  "patient.admettre":   ["accueil"],
  "patient.fusionner":  ["accueil"],
  // Tout soignant intervenant sur le séjour doit pouvoir le consulter :
  // dispenser un médicament sans voir le dossier n'a pas de sens.
  "sejour.consulter":   ["accueil", "medecin", "infirmier", "technicien",
                         "biologiste", "manipulateur", "radiologue",
                         "chirurgien", "anesthesiste", "bloc",
                         "pharmacien", "facturation"],
  "labo.prescrire":     ["medecin"],
  "labo.prelever":      ["infirmier", "technicien"],
  "labo.resultat":      ["technicien", "biologiste"],
  "labo.valider":       ["biologiste"],

  // Imagerie : le manipulateur programme et réalise, le radiologue
  // interprète et signe. La signature déclenche la facturation.
  "imagerie.demander":  ["medecin"],
  "imagerie.programmer":["manipulateur", "radiologue", "accueil"],
  "imagerie.realiser":  ["manipulateur"],
  "imagerie.interpreter":["radiologue"],
  "imagerie.signer":    ["radiologue"],

  // Pharmacie : le médecin prescrit, le pharmacien vise et dispense,
  // l'infirmier administre. C'est l'administration qui facture.
  "pharma.prescrire":   ["medecin"],
  "pharma.analyser":    ["pharmacien"],
  "pharma.dispenser":   ["pharmacien"],
  "pharma.administrer": ["infirmier"],
  "pharma.retourner":   ["pharmacien", "infirmier"],
  "pharma.arreter":     ["medecin"],

  // Bloc : le consentement et la programmation reviennent au
  // chirurgien, l'induction à l'anesthésiste. La liste de
  // vérification est validée par qui est en salle — c'est un geste
  // d'équipe, pas une signature hiérarchique.
  "bloc.consentement":  ["chirurgien", "medecin"],
  "bloc.anesthesie":    ["anesthesiste"],
  "bloc.programmer":    ["chirurgien"],
  "bloc.verifier":      ["chirurgien", "anesthesiste", "bloc", "infirmier"],
  "bloc.induire":       ["anesthesiste"],
  "bloc.inciser":       ["chirurgien"],
  "bloc.implant":       ["chirurgien"],
  "bloc.sortie":        ["chirurgien"],

  "sejour.cloturer":    ["facturation"],

  // Recouvrement : l'encaissement et le suivi des bordereaux
  // relèvent du seul service de facturation. Le pilotage est ouvert
  // à l'administration, qui décide sur ces chiffres.
  "recouvrement.encaisser": ["facturation"],
  "recouvrement.bordereau": ["facturation"],
  "recouvrement.relancer":  ["facturation"],
  "recouvrement.piloter":   ["facturation"],
}

export function autorise(session: Session | null, action: string): boolean {
  if (!session) return false
  if (session.role === "admin") return true
  const roles = PERMISSIONS[action]
  return Array.isArray(roles) && roles.includes(session.role)
}

export class ErreurAcces extends Error {
  statut: number
  constructor(message: string, statut = 403) {
    super(message)
    this.name = "ErreurAcces"
    this.statut = statut
  }
}

/** Exige une session et le droit correspondant, sinon lève. */
export function exiger(
  req: { headers: { get(n: string): string | null } },
  action: string,
): Session {
  const s = sessionDe(req)
  if (!s) throw new ErreurAcces("Authentification requise", 401)
  if (!autorise(s, action)) {
    throw new ErreurAcces(`Votre rôle (${s.role}) ne permet pas cette action`, 403)
  }
  return s
}

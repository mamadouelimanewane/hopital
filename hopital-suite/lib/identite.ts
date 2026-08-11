/* ════════════════════════════════════════════════════════════════
   Identitovigilance.

   Un doublon créé à l'accueil se paie pendant des années : résultats
   rattachés au mauvais dossier, antécédents perdus, facture
   irrécouvrable. Mais fusionner deux personnes distinctes est plus
   grave encore.

   D'où le parti pris : la clé phonétique sert à RAPPROCHER des
   candidats, jamais à décider. La décision revient toujours à
   l'agent d'accueil, sur une liste ordonnée.
   ════════════════════════════════════════════════════════════════ */

import { query } from "./db"

/** Majuscules, sans accent, sans ponctuation, espaces réduits. */
export function normaliser(valeur: string): string {
  return (valeur || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z\s-]/g, " ")
    .replace(/[-\s]+/g, " ")
    .trim()
}

/**
 * Réduction phonétique adaptée aux transcriptions courantes des noms
 * au Sénégal, où une même personne s'écrit de plusieurs façons selon
 * l'agent qui saisit : Ndiaye/Njaay, Diop/Jop, Sarr/Sar, Gueye/Guèye,
 * Ba/Bah, Thiam/Tiam, Ndour/Ndur.
 *
 * Volontairement conservatrice : elle rapproche les graphies d'un
 * même nom sans confondre des noms différents.
 */
export function reductionPhonetique(valeur: string): string {
  let s = normaliser(valeur).replace(/\s/g, "")
  if (!s) return ""

  // Digrammes, du plus spécifique au plus général.
  s = s
    .replace(/PH/g, "F")
    .replace(/TH/g, "T")     // Thiam → TIAM
    .replace(/KH/g, "K")     // Cheikh → CHEIK
    .replace(/CH/g, "C")     // puis C sera traité plus bas
    .replace(/GU([EI])/g, "G$1")  // Gueye → GEYE
    .replace(/QU/g, "K")
    .replace(/OU/g, "U")     // Ndour → NDUR, Fatou → FATU
    .replace(/EA?U/g, "O")

  // C dur / doux
  s = s.replace(/C([EIY])/g, "S$1").replace(/C/g, "K")

  // Consonnes équivalentes à l'oreille
  s = s
    .replace(/J/g, "D")      // Njaay ≈ Ndiaye
    .replace(/Z/g, "S")
    .replace(/PH/g, "F")
    .replace(/W/g, "V")

  // Y voyelle → I ; H muet ; doubles réduites
  s = s
    .replace(/Y/g, "I")
    .replace(/H/g, "")
    .replace(/(.)\1+/g, "$1")   // SARR → SAR, SECK → SEK

  // E final muet
  s = s.replace(/E$/, "")

  return s
}

/** Clé de rapprochement d'un patient. */
export function clePhonetique(nom: string, prenom: string): string {
  return `${reductionPhonetique(nom)}|${reductionPhonetique(prenom)}`
}

/** Distance d'édition, itérative pour rester bornée en mémoire. */
export function distanceEdition(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let precedente = Array.from({ length: b.length + 1 }, (_, i) => i)
  const courante = new Array<number>(b.length + 1)

  for (let i = 1; i <= a.length; i++) {
    courante[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1
      courante[j] = Math.min(
        courante[j - 1] + 1,
        precedente[j] + 1,
        precedente[j - 1] + cout,
      )
    }
    precedente = courante.slice()
  }
  return precedente[b.length]
}

/** Similarité de 0 à 1 entre deux chaînes normalisées. */
export function similarite(a: string, b: string): number {
  const x = normaliser(a)
  const y = normaliser(b)
  if (!x && !y) return 1
  const max = Math.max(x.length, y.length)
  if (max === 0) return 1
  return 1 - distanceEdition(x, y) / max
}

/**
 * Ramène une date au format AAAA-MM-JJ.
 *
 * Le driver Postgres restitue les colonnes DATE sous forme d'objets
 * Date : un simple découpage de chaîne produirait « Fri Apr 12 » et
 * ferait échouer silencieusement toutes les comparaisons.
 */
export function jour(valeur: unknown): string | null {
  if (!valeur) return null
  if (valeur instanceof Date) {
    if (Number.isNaN(valeur.getTime())) return null
    const m = String(valeur.getMonth() + 1).padStart(2, "0")
    const d = String(valeur.getDate()).padStart(2, "0")
    return `${valeur.getFullYear()}-${m}-${d}`
  }
  const s = String(valeur).trim()
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})/)
  if (iso) return iso[1]
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : jour(d)
}

export interface TraitsPatient {
  nom: string
  prenom: string
  dateNaissance?: string | null
  sexe?: string | null
  telephone?: string | null
}

export interface Candidat {
  id: number
  ipp: string
  nom: string
  prenom: string
  date_naissance: string | null
  sexe: string | null
  telephone: string | null
  statut_identite: string
  score: number
  verdict: "identique" | "probable" | "possible"
  motifs: string[]
}

/**
 * Score de rapprochement entre des traits saisis et un patient connu.
 * Le nom et le prénom pèsent le plus, la date de naissance tranche.
 */
export function scorer(traits: TraitsPatient, candidat: {
  nom: string; prenom: string; date_naissance: string | null;
  sexe: string | null; telephone: string | null;
}): { score: number; motifs: string[] } {
  const motifs: string[] = []

  const sNom = similarite(traits.nom, candidat.nom)
  const sPrenom = similarite(traits.prenom, candidat.prenom)
  if (sNom >= 0.99) motifs.push("nom identique")
  else if (sNom >= 0.8) motifs.push("nom proche")
  if (sPrenom >= 0.99) motifs.push("prénom identique")
  else if (sPrenom >= 0.8) motifs.push("prénom proche")

  let score = sNom * 0.35 + sPrenom * 0.3

  // Date de naissance : forte quand elle concorde, pénalisante quand
  // elle diverge — c'est le trait le plus discriminant.
  const dSaisie = jour(traits.dateNaissance)
  const dConnue = jour(candidat.date_naissance)
  if (dSaisie && dConnue) {
    if (dSaisie === dConnue) { score += 0.25; motifs.push("date de naissance identique") }
    else { score -= 0.2; motifs.push("date de naissance différente") }
  }

  if (traits.sexe && candidat.sexe) {
    if (traits.sexe === candidat.sexe) score += 0.05
    else { score -= 0.15; motifs.push("sexe différent") }
  }

  const telSaisi = (traits.telephone || "").replace(/\D/g, "")
  const telConnu = (candidat.telephone || "").replace(/\D/g, "")
  if (telSaisi && telConnu && telSaisi.slice(-8) === telConnu.slice(-8)) {
    score += 0.1
    motifs.push("téléphone identique")
  }

  score = Math.max(0, Math.min(1, score))
  return { score, motifs }
}

/**
 * Cherche les patients susceptibles d'être la même personne.
 * Les candidats sont ramenés par clé phonétique, par traits
 * normalisés ou par date de naissance, puis classés.
 */
export async function rechercherDoublons(traits: TraitsPatient): Promise<Candidat[]> {
  const cle = clePhonetique(traits.nom, traits.prenom)
  const nomNorm = normaliser(traits.nom)
  const prenomNorm = normaliser(traits.prenom)
  const dateNaissance = jour(traits.dateNaissance)

  const lignes = await query<{
    id: number; ipp: string; nom: string; prenom: string;
    date_naissance: string | null; sexe: string | null;
    telephone: string | null; statut_identite: string;
  }>(
    `SELECT id, ipp, nom, prenom, date_naissance, sexe, telephone, statut_identite
       FROM patient
      WHERE statut_identite <> 'fusionnee'
        AND (cle_phonetique = $1
             OR (nom_norm = $2 AND prenom_norm = $3)
             OR ($4::date IS NOT NULL AND date_naissance = $4::date))
      LIMIT 50`,
    [cle, nomNorm, prenomNorm, dateNaissance],
  )

  return lignes
    .map((l) => {
      const { score, motifs } = scorer(traits, l)
      const verdict: Candidat["verdict"] =
        score >= 0.92 ? "identique" : score >= 0.75 ? "probable" : "possible"
      return { ...l, score: Math.round(score * 100) / 100, verdict, motifs }
    })
    .filter((c) => c.score >= 0.55)
    .sort((a, b) => b.score - a.score)
}

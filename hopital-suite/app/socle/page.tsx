"use client"
/* ════════════════════════════════════════════════════════════════
   Socle — poste de travail.

   Le parcours complet d'un séjour, de l'admission à la facture, sur
   un seul écran : admission, laboratoire, imagerie, pharmacie, bloc,
   hébergement, clôture.

   Chaque panneau montre la même chose : où en est chaque acte, et à
   partir de quel geste il devient facturable. Le compteur en tête ne
   bouge qu'à ce moment-là.
   ════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useState } from "react"
import {
  boite, etiquette, champ, bouton, petitBouton, mono, Montant,
  Panneau, Ligne, Pastille, Vide, COULEUR, fcfa,
} from "./ui"
import {
  PanneauImagerie, PanneauPharmacie, PanneauBloc, PanneauHebergement,
  type ExamenImagerie, type LigneTraitement, type InterventionVue,
} from "./plateaux"

type Candidat = {
  id: number; ipp: string; nom: string; prenom: string
  score: number; verdict: string; motifs: string[]
}
type Examen = {
  acte_id: number; code_acte: string; libelle: string; statut: string
  valeur: string | null; unite: string | null; critique: boolean | null
  montant_total: string | null
}
type Vue = {
  sejour: Record<string, unknown>
  examens: Examen[]
  imagerie: ExamenImagerie[]
  traitement: LigneTraitement[]
  interventions: InterventionVue[]
  journees: Array<{ nuit_du: string; categorie: string; unite: string; montant_total: string | null }>
  dose: { total: number; nbExamens: number; unite: string }
  compteur: {
    nda: string; total: number; partOrganisme: number; partPatient: number
    nbLignes: number; plafondAtteint: boolean
  }
  anomalies: { type: string; detail: string }[]
}
type Session = { id: number; identifiant: string; nom: string; role: string; unite: string }

const EXAMENS_BIO = [
  ["BIO-NFS", "Numération formule sanguine"],
  ["BIO-CRP", "Protéine C réactive"],
  ["BIO-GLY", "Glycémie à jeun"],
  ["BIO-TDR", "TDR paludisme"],
  ["BIO-CREAT", "Créatininémie"],
  ["BIO-IONO", "Ionogramme sanguin"],
]

/* Reflet de la matrice serveur : sert uniquement à griser ce qui est
   inaccessible. L'autorisation reste décidée côté serveur. */
const PERMIS: Record<string, string[]> = {
  "patient.admettre": ["accueil"],
  "labo.prescrire": ["medecin"],
  "labo.prelever": ["infirmier", "technicien"],
  "labo.resultat": ["technicien", "biologiste"],
  "labo.valider": ["biologiste"],
  "imagerie.demander": ["medecin"],
  "imagerie.realiser": ["manipulateur"],
  "imagerie.interpreter": ["radiologue"],
  "imagerie.signer": ["radiologue"],
  "pharma.prescrire": ["medecin"],
  "pharma.analyser": ["pharmacien"],
  "pharma.dispenser": ["pharmacien"],
  "pharma.administrer": ["infirmier"],
  "bloc.consentement": ["chirurgien", "medecin"],
  "bloc.anesthesie": ["anesthesiste"],
  "bloc.programmer": ["chirurgien"],
  "bloc.verifier": ["chirurgien", "anesthesiste", "bloc", "infirmier"],
  "bloc.induire": ["anesthesiste"],
  "bloc.inciser": ["chirurgien"],
  "bloc.sortie": ["chirurgien"],
  "sejour.cloturer": ["facturation"],
}

export default function SoclePage() {
  const [traits, setTraits] = useState({ nom: "", prenom: "", dateNaissance: "", sexe: "F", telephone: "" })
  const [modeEntree, setModeEntree] = useState("urgences")
  const [triage, setTriage] = useState("orange")
  const [regime, setRegime] = useState("payant_direct")
  const [taux, setTaux] = useState(80)

  const [candidats, setCandidats] = useState<Candidat[] | null>(null)
  const [sejourId, setSejourId] = useState<number | null>(null)
  const [vue, setVue] = useState<Vue | null>(null)
  const [message, setMessage] = useState<{ texte: string; type: "ok" | "err" } | null>(null)
  const [occupe, setOccupe] = useState(false)
  const [selection, setSelection] = useState<string[]>(["BIO-NFS", "BIO-TDR"])

  const [session, setSession] = useState<Session | null>(null)
  const [sessionChargee, setSessionChargee] = useState(false)
  const [identifiants, setIdentifiants] = useState({ identifiant: "", motDePasse: "" })

  const peut = useCallback(
    (action: string) =>
      !!session && (session.role === "admin" || (PERMIS[action] ?? []).includes(session.role)),
    [session],
  )

  const charger = useCallback(async (id: number) => {
    const r = await fetch(`/api/socle/sejours/${id}`)
    if (r.ok) setVue(await r.json())
  }, [])

  useEffect(() => { if (sejourId) charger(sejourId) }, [sejourId, charger])

  useEffect(() => {
    fetch("/api/socle/auth")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSession(d?.session ?? null))
      .catch(() => setSession(null))
      .finally(() => setSessionChargee(true))
  }, [])

  async function seConnecter() {
    setOccupe(true); setMessage(null)
    try {
      const r = await fetch("/api/socle/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identifiants),
      })
      const d = await r.json()
      if (!r.ok) { setMessage({ texte: d.erreur || "Connexion refusée", type: "err" }); return }
      setSession(d.session)
      setIdentifiants({ identifiant: "", motDePasse: "" })
    } finally { setOccupe(false) }
  }

  async function seDeconnecter() {
    await fetch("/api/socle/auth", { method: "DELETE" })
    setSession(null); setSejourId(null); setVue(null); setCandidats(null)
  }

  async function appeler(url: string, corps: unknown, methode = "POST") {
    setOccupe(true); setMessage(null)
    try {
      const r = await fetch(url, {
        method: methode, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      })
      const d = await r.json()
      if (!r.ok) { setMessage({ texte: d.erreur || "Échec", type: "err" }); return null }
      return d
    } catch {
      setMessage({ texte: "Serveur injoignable", type: "err" }); return null
    } finally { setOccupe(false) }
  }

  /** Appel sur un plateau du séjour courant, suivi d'un rafraîchissement. */
  const surPlateau = (plateau: string) => async (corps: Record<string, unknown>) => {
    if (!sejourId) return null
    const d = await appeler(`/api/socle/sejours/${sejourId}/${plateau}`, corps)
    if (d) await charger(sejourId)
    return d
  }

  const labo = surPlateau("laboratoire")

  async function admettre(forcer = false, patientExistantId?: number) {
    const couverture = regime === "payant_direct" ? undefined : { regime, taux }
    const d = await appeler("/api/socle/patients", {
      traits: { ...traits, dateNaissance: traits.dateNaissance || null },
      sejour: { modeEntree, triage: modeEntree === "urgences" ? triage : undefined, unite: "SAU" },
      couverture, forcerCreation: forcer, patientExistantId,
    })
    if (!d) return
    if (d.statut === "doublons_possibles") {
      setCandidats(d.candidats)
      setMessage({ texte: `${d.candidats.length} dossier(s) proche(s) — vérifiez avant de créer.`, type: "err" })
      return
    }
    setCandidats(null)
    setSejourId(d.sejour.id)
    setMessage({ texte: `Séjour ${d.sejour.nda} ouvert — ${d.patient.ipp}`, type: "ok" })
  }

  const c = vue?.compteur

  return (
    <>
      {/* La suite de démonstration agrandit tout pour le vidéoprojecteur ;
          un poste de travail doit rester à sa taille réelle. */}
      <style>{`body { zoom: 1 !important; background: ${COULEUR.fond} !important; }`}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 80px", color: COULEUR.encre }}>
        <header style={{
          borderBottom: `2px solid ${COULEUR.encre}`, paddingBottom: 16, marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          gap: 20, flexWrap: "wrap",
        }}>
          <div>
            <p style={{ ...mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: COULEUR.accent, margin: 0 }}>
              Socle · parcours patient
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", margin: "8px 0 4px" }}>
              Poste de travail
            </h1>
            <p style={{ fontSize: 14, color: COULEUR.doux, margin: 0 }}>
              Données réelles en base. Chaque montant apparaît au moment où l&apos;acte devient facturable.
            </p>
          </div>
          {session && (
            <div style={{ textAlign: "right", fontSize: 13 }}>
              <div style={{ fontWeight: 650 }}>{session.nom}</div>
              <div style={{ ...mono, fontSize: 11.5, color: COULEUR.accent, letterSpacing: ".08em", textTransform: "uppercase" }}>
                {session.role}
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <a href="/socle/recouvrement" style={{ fontSize: 12.5, color: COULEUR.doux }}>Recouvrement</a>
                <button onClick={seDeconnecter}
                        style={{ background: "none", border: "none", padding: 0, fontSize: 12.5, color: COULEUR.doux, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}>
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </header>

        {sessionChargee && !session && (
          <div style={{ ...boite, maxWidth: 380, margin: "40px auto" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px" }}>Connexion</h2>
            <p style={{ fontSize: 13, color: COULEUR.pale, margin: "0 0 18px" }}>
              Chaque geste est enregistré sous votre identité.
            </p>
            {message && <p style={{ fontSize: 13, color: COULEUR.erreur, margin: "0 0 14px" }}>{message.texte}</p>}
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={etiquette}>Identifiant</label>
                <input style={champ} value={identifiants.identifiant} autoComplete="username"
                       onChange={(e) => setIdentifiants({ ...identifiants, identifiant: e.target.value })} />
              </div>
              <div>
                <label style={etiquette}>Mot de passe</label>
                <input style={champ} type="password" value={identifiants.motDePasse} autoComplete="current-password"
                       onKeyDown={(e) => { if (e.key === "Enter") seConnecter() }}
                       onChange={(e) => setIdentifiants({ ...identifiants, motDePasse: e.target.value })} />
              </div>
              <button style={bouton(true, occupe)} disabled={occupe} onClick={seConnecter}>Se connecter</button>
            </div>
          </div>
        )}

        {session && message && (
          <div style={{
            ...boite, marginBottom: 20, padding: "12px 16px", fontSize: 14,
            borderLeft: `3px solid ${message.type === "ok" ? COULEUR.ok : COULEUR.erreur}`,
            color: message.type === "ok" ? COULEUR.ok : COULEUR.erreur,
          }}>{message.texte}</div>
        )}

        {session && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,380px) minmax(0,1fr)", gap: 24, alignItems: "start" }}>

            {/* ── Admission ── */}
            <section style={boite}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Admission</h2>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label style={etiquette}>Nom</label>
                  <input style={champ} value={traits.nom} placeholder="Ndiaye"
                         onChange={(e) => setTraits({ ...traits, nom: e.target.value })} />
                </div>
                <div>
                  <label style={etiquette}>Prénom</label>
                  <input style={champ} value={traits.prenom} placeholder="Fatou"
                         onChange={(e) => setTraits({ ...traits, prenom: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 10 }}>
                  <div>
                    <label style={etiquette}>Naissance</label>
                    <input style={champ} type="date" value={traits.dateNaissance}
                           onChange={(e) => setTraits({ ...traits, dateNaissance: e.target.value })} />
                  </div>
                  <div>
                    <label style={etiquette}>Sexe</label>
                    <select style={champ} value={traits.sexe}
                            onChange={(e) => setTraits({ ...traits, sexe: e.target.value })}>
                      <option value="F">F</option><option value="M">M</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={etiquette}>Entrée</label>
                  <select style={champ} value={modeEntree} onChange={(e) => setModeEntree(e.target.value)}>
                    <option value="urgences">Urgences</option>
                    <option value="consultation_programmee">Consultation programmée</option>
                    <option value="hospitalisation_programmee">Hospitalisation programmée</option>
                    <option value="maternite">Maternité</option>
                    <option value="transfert">Transfert</option>
                  </select>
                </div>
                {modeEntree === "urgences" && (
                  <div>
                    <label style={etiquette}>Triage</label>
                    <select style={champ} value={triage} onChange={(e) => setTriage(e.target.value)}>
                      <option value="rouge">Rouge — urgence vitale</option>
                      <option value="orange">Orange — urgence relative</option>
                      <option value="jaune">Jaune</option>
                      <option value="vert">Vert — urgence simple</option>
                      <option value="blanc">Blanc — non urgent</option>
                    </select>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 10 }}>
                  <div>
                    <label style={etiquette}>Couverture</label>
                    <select style={champ} value={regime} onChange={(e) => setRegime(e.target.value)}>
                      <option value="payant_direct">Payant direct</option>
                      <option value="cmu">CMU</option>
                      <option value="ipm">IPM</option>
                      <option value="mutuelle">Mutuelle</option>
                      <option value="prise_en_charge_sociale">Prise en charge sociale</option>
                    </select>
                  </div>
                  <div>
                    <label style={etiquette}>Taux</label>
                    <input style={champ} type="number" min={0} max={100} value={taux}
                           disabled={regime === "payant_direct"}
                           onChange={(e) => setTaux(Number(e.target.value))} />
                  </div>
                </div>
                <button style={bouton(true, occupe)} disabled={occupe || !peut("patient.admettre")}
                        onClick={() => admettre(false)}>
                  Rechercher puis admettre
                </button>
              </div>

              {candidats && candidats.length > 0 && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${COULEUR.traitFin}` }}>
                  <p style={{ ...etiquette, color: COULEUR.erreur }}>Dossiers proches — ne créez pas de doublon</p>
                  {candidats.map((k) => (
                    <div key={k.id} style={{ padding: "10px 0", borderBottom: `1px solid ${COULEUR.traitFin}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <strong style={{ fontSize: 14 }}>{k.prenom} {k.nom}</strong>
                        <span style={{ ...mono, fontSize: 12, color: COULEUR.accent }}>
                          {Math.round(k.score * 100)}%
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: COULEUR.pale, margin: "2px 0 6px" }}>
                        {k.ipp} · {k.motifs.join(", ")}
                      </div>
                      <button style={petitBouton(false, occupe)} onClick={() => admettre(false, k.id)}>
                        C&apos;est ce patient — ouvrir un séjour
                      </button>
                    </div>
                  ))}
                  <button style={{ ...petitBouton(false, occupe), marginTop: 12, color: COULEUR.erreur }}
                          onClick={() => admettre(true)}>
                    Aucun ne correspond — créer un nouveau dossier
                  </button>
                </div>
              )}
            </section>

            {/* ── Séjour ── */}
            <section style={{ display: "grid", gap: 20 }}>
              {!vue && (
                <div style={{ ...boite, color: COULEUR.pale, fontSize: 14 }}>
                  Admettez un patient pour ouvrir un séjour. Essayez ensuite de
                  réadmettre la même personne avec une graphie différente
                  (Ndiay / Fatu) : le rapprochement doit la retrouver.
                </div>
              )}

              {vue && c && (
                <>
                  {/* Compteur */}
                  <div style={{ ...boite, borderLeft: `3px solid ${COULEUR.accent}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <span style={{ ...mono, fontSize: 12, color: COULEUR.pale }}>{c.nda}</span>
                        <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>
                          {String(vue.sejour.prenom)} {String(vue.sejour.nom)}
                          <span style={{ fontWeight: 400, fontSize: 13, color: COULEUR.pale }}>
                            {" · "}{String(vue.sejour.ipp)}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ ...mono, fontSize: 26, fontWeight: 800, color: COULEUR.accent }}>
                          {fcfa(c.total)}
                        </div>
                        <div style={{ fontSize: 12, color: COULEUR.pale }}>
                          organisme {fcfa(c.partOrganisme)} · patient {fcfa(c.partPatient)}
                        </div>
                      </div>
                    </div>
                    {c.plafondAtteint && (
                      <p style={{ margin: "10px 0 0", fontSize: 13, color: COULEUR.alerte }}>
                        Plafond de prise en charge atteint — le reste est à la charge du patient.
                      </p>
                    )}
                  </div>

                  {/* Laboratoire */}
                  <Panneau titre="Laboratoire"
                           aide="La colonne Montant reste vide jusqu'à la validation biologique.">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                      {EXAMENS_BIO.map(([code, lib]) => {
                        const actif = selection.includes(code)
                        return (
                          <button key={code} style={{
                            ...petitBouton(actif, occupe),
                            borderColor: actif ? COULEUR.accent : "#cfdad5",
                          }} onClick={() => setSelection(
                            actif ? selection.filter((s) => s !== code) : [...selection, code])}>
                            {lib}
                          </button>
                        )
                      })}
                      <button style={bouton(true, occupe)}
                              disabled={occupe || selection.length === 0 || !peut("labo.prescrire")}
                              onClick={() => labo({ action: "prescrire", codes: selection })}>
                        Prescrire ({selection.length})
                      </button>
                    </div>

                    {vue.examens.length === 0 && <Vide texte="Aucun examen prescrit." />}
                    {vue.examens.map((e) => (
                      <Ligne key={e.acte_id}
                        titre={<>{e.libelle}{e.critique && <Pastille texte="Critique" ton="erreur" />}</>}
                        sous={`${e.code_acte} · ${e.statut}${e.valeur ? ` · ${e.valeur} ${e.unite ?? ""}` : ""}`}
                        actions={<>
                          <Montant valeur={e.montant_total} />
                          {e.statut === "prevu" && (
                            <button style={petitBouton(false, occupe)}
                                    disabled={occupe || !peut("labo.prelever")}
                                    onClick={() => labo({ action: "prelever", acteId: e.acte_id })}>
                              Prélever
                            </button>
                          )}
                          {e.statut === "realise" && !e.valeur && (
                            <button style={petitBouton(false, occupe)}
                                    disabled={occupe || !peut("labo.resultat")}
                                    onClick={() => labo({
                                      action: "resultat", acteId: e.acte_id,
                                      valeur: (Math.random() * 12 + 2).toFixed(1),
                                      unite: "g/dL", critique: Math.random() < 0.25,
                                    })}>Saisir le résultat</button>
                          )}
                          {e.statut === "realise" && e.valeur && (
                            <button style={petitBouton(true, occupe)}
                                    disabled={occupe || !peut("labo.valider")}
                                    onClick={() => labo({ action: "valider", acteId: e.acte_id })}>
                              Valider
                            </button>
                          )}
                          {e.statut === "valide" && (
                            <span style={{ fontSize: 12, color: COULEUR.ok, fontWeight: 600 }}>validé</span>
                          )}
                        </>}
                      />
                    ))}
                  </Panneau>

                  <PanneauImagerie examens={vue.imagerie} dose={vue.dose}
                                   peut={peut} occupe={occupe} appeler={surPlateau("imagerie")} />

                  <PanneauPharmacie traitement={vue.traitement}
                                    peut={peut} occupe={occupe} appeler={surPlateau("pharmacie")} />

                  <PanneauBloc interventions={vue.interventions}
                               peut={peut} occupe={occupe} appeler={surPlateau("bloc")} />

                  <PanneauHebergement journees={vue.journees} />

                  {/* Clôture */}
                  <Panneau titre="Clôture">
                    {vue.anomalies.length > 0 ? (
                      <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 13.5, color: COULEUR.alerte }}>
                        {vue.anomalies.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a.detail}</li>)}
                      </ul>
                    ) : (
                      <p style={{ fontSize: 13.5, color: COULEUR.ok, margin: "0 0 14px" }}>
                        Aucune anomalie — le séjour peut être clôturé.
                      </p>
                    )}
                    <button style={bouton(true, occupe)} disabled={occupe || !peut("sejour.cloturer")}
                            onClick={async () => {
                              const d = await labo({ action: "cloturer", modeSortie: "domicile" })
                              if (d?.facture) setMessage({
                                texte: `Facture ${d.facture.numero} — ${fcfa(Number(d.facture.total))}, dont ${fcfa(Number(d.facture.total_patient))} à la charge du patient.`,
                                type: "ok",
                              })
                            }}>
                      Clôturer et facturer
                    </button>
                  </Panneau>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  )
}

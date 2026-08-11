"use client"
/* ════════════════════════════════════════════════════════════════
   Socle — écran de travail.

   Volontairement sobre et dense : c'est un poste de travail, pas une
   maquette de démonstration. Il fait tourner le parcours réel, de
   l'admission à la facture, contre la base.
   ════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useState } from "react"

type Candidat = {
  id: number; ipp: string; nom: string; prenom: string
  date_naissance: string | null; score: number
  verdict: "identique" | "probable" | "possible"; motifs: string[]
}
type Examen = {
  acte_id: number; code_acte: string; libelle: string; statut: string
  valeur: string | null; unite: string | null; critique: boolean | null
  montant_total: string | null
}
type ExamenImagerie = {
  acte_id: number; code_acte: string; libelle: string; famille: string; statut: string
  dose_delivree: string | null; dose_unite: string | null
  compte_rendu: string | null; conclusion: string | null; anomalie: boolean | null
  montant_total: string | null
}
type Vue = {
  sejour: Record<string, unknown>
  examens: Examen[]
  imagerie: ExamenImagerie[]
  dose: { total: number; nbExamens: number; unite: string }
  compteur: { nda: string; total: number; partOrganisme: number; partPatient: number; nbLignes: number; plafondAtteint: boolean }
  anomalies: { type: string; detail: string }[]
}

const EXAMENS = [
  ["BIO-NFS", "Numération formule sanguine"],
  ["BIO-CRP", "Protéine C réactive"],
  ["BIO-GLY", "Glycémie à jeun"],
  ["BIO-TDR", "TDR paludisme"],
  ["BIO-CREAT", "Créatininémie"],
  ["BIO-IONO", "Ionogramme sanguin"],
]

const IMAGERIE = [
  ["IMG-RXT", "Radio thorax"],
  ["IMG-ECHO", "Échographie"],
  ["IMG-SCANI", "Scanner injecté"],
]

const fcfa = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " F"

type Session = { id: number; identifiant: string; nom: string; role: string; unite: string }

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
  "sejour.cloturer": ["facturation"],
}
const peut = (s: Session | null, action: string) =>
  !!s && (s.role === "admin" || (PERMIS[action] ?? []).includes(s.role))

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

  async function appeler(url: string, body: unknown, methode = "POST") {
    setOccupe(true); setMessage(null)
    try {
      const r = await fetch(url, {
        method: methode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await r.json()
      if (!r.ok) { setMessage({ texte: data.erreur || "Échec", type: "err" }); return null }
      return data
    } catch {
      setMessage({ texte: "Serveur injoignable", type: "err" }); return null
    } finally { setOccupe(false) }
  }

  async function admettre(forcer = false, patientExistantId?: number) {
    const couverture = regime === "payant_direct" ? undefined : { regime, taux }
    const data = await appeler("/api/socle/patients", {
      traits: { ...traits, dateNaissance: traits.dateNaissance || null },
      sejour: { modeEntree, triage: modeEntree === "urgences" ? triage : undefined, unite: "SAU" },
      couverture, forcerCreation: forcer, patientExistantId,
    })
    if (!data) return
    if (data.statut === "doublons_possibles") {
      setCandidats(data.candidats)
      setMessage({ texte: `${data.candidats.length} dossier(s) proche(s) — vérifiez avant de créer.`, type: "err" })
      return
    }
    setCandidats(null)
    setSejourId(data.sejour.id)
    setMessage({ texte: `Séjour ${data.sejour.nda} ouvert — ${data.patient.ipp}`, type: "ok" })
  }

  async function imagerie(body: Record<string, unknown>) {
    if (!sejourId) return
    const d = await appeler(`/api/socle/sejours/${sejourId}/imagerie`, body)
    if (d) await charger(sejourId)
    return d
  }

  async function labo(body: Record<string, unknown>) {
    if (!sejourId) return
    const d = await appeler(`/api/socle/sejours/${sejourId}/laboratoire`, body)
    if (d) await charger(sejourId)
    return d
  }

  const c = vue?.compteur
  const box = { background: "#fff", border: "1px solid #dfe5e2", borderRadius: 6, padding: 18 }
  const label: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
    textTransform: "uppercase", color: "#7d918a", marginBottom: 6,
  }
  const input: React.CSSProperties = {
    width: "100%", padding: "8px 10px", fontSize: 14, border: "1px solid #cfdad5",
    borderRadius: 4, background: "#fff", fontFamily: "inherit", color: "#14201c",
  }
  const bouton = (principal = false): React.CSSProperties => ({
    padding: "9px 16px", fontSize: 13.5, fontWeight: 650, borderRadius: 4, cursor: "pointer",
    border: principal ? "none" : "1px solid #cfdad5",
    background: principal ? "#0f6b62" : "#fff", color: principal ? "#fff" : "#14201c",
    fontFamily: "inherit", opacity: occupe ? 0.6 : 1,
  })

  return (
    <>
      {/* La suite de démonstration agrandit tout pour le vidéoprojecteur ;
          un poste de travail doit rester à sa taille réelle. */}
      <style>{`body { zoom: 1 !important; background: #f1f4f2 !important; }`}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 80px", color: "#14201c" }}>
        <header style={{
          borderBottom: "2px solid #14201c", paddingBottom: 16, marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          gap: 20, flexWrap: "wrap",
        }}>
          <div>
            <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#0f6b62", margin: 0 }}>
              Socle · parcours patient
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", margin: "8px 0 4px" }}>
              Admission et circuit du laboratoire
            </h1>
            <p style={{ fontSize: 14, color: "#4b5f58", margin: 0 }}>
              Données réelles en base. La facturation se déclenche à la validation biologique.
            </p>
          </div>
          {session && (
            <div style={{ textAlign: "right", fontSize: 13 }}>
              <div style={{ fontWeight: 650 }}>{session.nom}</div>
              <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11.5, color: "#0f6b62", letterSpacing: ".08em", textTransform: "uppercase" }}>
                {session.role}
              </div>
              <button onClick={seDeconnecter}
                      style={{ marginTop: 6, background: "none", border: "none", padding: 0, fontSize: 12.5, color: "#4b5f58", textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}>
                Se déconnecter
              </button>
            </div>
          )}
        </header>

        {/* ── Écran de connexion ── */}
        {sessionChargee && !session && (
          <div style={{ ...box, maxWidth: 380, margin: "40px auto" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px" }}>Connexion</h2>
            <p style={{ fontSize: 13, color: "#7d918a", margin: "0 0 18px" }}>
              Chaque geste est enregistré sous votre identité.
            </p>
            {message && (
              <p style={{ fontSize: 13, color: "#c0392b", margin: "0 0 14px" }}>{message.texte}</p>
            )}
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={label}>Identifiant</label>
                <input style={input} value={identifiants.identifiant} autoComplete="username"
                       onChange={(e) => setIdentifiants({ ...identifiants, identifiant: e.target.value })} />
              </div>
              <div>
                <label style={label}>Mot de passe</label>
                <input style={input} type="password" value={identifiants.motDePasse} autoComplete="current-password"
                       onKeyDown={(e) => { if (e.key === "Enter") seConnecter() }}
                       onChange={(e) => setIdentifiants({ ...identifiants, motDePasse: e.target.value })} />
              </div>
              <button style={bouton(true)} disabled={occupe} onClick={seConnecter}>Se connecter</button>
            </div>
          </div>
        )}

        {session && message && (
          <div style={{
            ...box, marginBottom: 20, padding: "12px 16px", fontSize: 14,
            borderLeft: `3px solid ${message.type === "ok" ? "#15803d" : "#c0392b"}`,
            color: message.type === "ok" ? "#15803d" : "#c0392b",
          }}>{message.texte}</div>
        )}

        {session && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,380px) minmax(0,1fr)", gap: 24, alignItems: "start" }}>

          {/* ── Admission ── */}
          <section style={box}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Admission</h2>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={label}>Nom</label>
                <input style={input} value={traits.nom} onChange={(e) => setTraits({ ...traits, nom: e.target.value })} placeholder="Ndiaye" />
              </div>
              <div>
                <label style={label}>Prénom</label>
                <input style={input} value={traits.prenom} onChange={(e) => setTraits({ ...traits, prenom: e.target.value })} placeholder="Fatou" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 10 }}>
                <div>
                  <label style={label}>Naissance</label>
                  <input style={input} type="date" value={traits.dateNaissance} onChange={(e) => setTraits({ ...traits, dateNaissance: e.target.value })} />
                </div>
                <div>
                  <label style={label}>Sexe</label>
                  <select style={input} value={traits.sexe} onChange={(e) => setTraits({ ...traits, sexe: e.target.value })}>
                    <option value="F">F</option><option value="M">M</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={label}>Entrée</label>
                <select style={input} value={modeEntree} onChange={(e) => setModeEntree(e.target.value)}>
                  <option value="urgences">Urgences</option>
                  <option value="consultation_programmee">Consultation programmée</option>
                  <option value="maternite">Maternité</option>
                  <option value="transfert">Transfert</option>
                </select>
              </div>
              {modeEntree === "urgences" && (
                <div>
                  <label style={label}>Triage</label>
                  <select style={input} value={triage} onChange={(e) => setTriage(e.target.value)}>
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
                  <label style={label}>Couverture</label>
                  <select style={input} value={regime} onChange={(e) => setRegime(e.target.value)}>
                    <option value="payant_direct">Payant direct</option>
                    <option value="cmu">CMU</option>
                    <option value="ipm">IPM</option>
                    <option value="mutuelle">Mutuelle</option>
                    <option value="prise_en_charge_sociale">Prise en charge sociale</option>
                  </select>
                </div>
                <div>
                  <label style={label}>Taux</label>
                  <input style={input} type="number" min={0} max={100} value={taux}
                         disabled={regime === "payant_direct"}
                         onChange={(e) => setTaux(Number(e.target.value))} />
                </div>
              </div>

              <button style={bouton(true)} disabled={occupe || !peut(session, "patient.admettre")}
                      onClick={() => admettre(false)}>
                Rechercher puis admettre
              </button>
            </div>

            {candidats && candidats.length > 0 && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #e3eae6" }}>
                <p style={{ ...label, color: "#c0392b" }}>Dossiers proches — ne créez pas de doublon</p>
                {candidats.map((k) => (
                  <div key={k.id} style={{ padding: "10px 0", borderBottom: "1px solid #e3eae6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <strong style={{ fontSize: 14 }}>{k.prenom} {k.nom}</strong>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#0f6b62" }}>
                        {Math.round(k.score * 100)}%
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#7d918a", margin: "2px 0 6px" }}>
                      {k.ipp} · {k.motifs.join(", ")}
                    </div>
                    <button style={{ ...bouton(), fontSize: 12, padding: "5px 10px" }}
                            onClick={() => admettre(false, k.id)}>
                      C&apos;est ce patient — ouvrir un séjour
                    </button>
                  </div>
                ))}
                <button style={{ ...bouton(), marginTop: 12, fontSize: 12, color: "#c0392b" }}
                        onClick={() => admettre(true)}>
                  Aucun ne correspond — créer un nouveau dossier
                </button>
              </div>
            )}
          </section>

          {/* ── Séjour en cours ── */}
          <section style={{ display: "grid", gap: 20 }}>
            {!vue && (
              <div style={{ ...box, color: "#7d918a", fontSize: 14 }}>
                Admettez un patient pour ouvrir un séjour. Essayez ensuite de
                réadmettre la même personne avec une graphie différente
                (Ndiay / Fatu) : le rapprochement doit la retrouver.
              </div>
            )}

            {vue && c && (
              <>
                {/* Compteur */}
                <div style={{ ...box, borderLeft: "3px solid #0f6b62" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#7d918a" }}>
                        {c.nda}
                      </span>
                      <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>
                        {String(vue.sejour.prenom)} {String(vue.sejour.nom)}
                        <span style={{ fontWeight: 400, fontSize: 13, color: "#7d918a" }}>
                          {" · "}{String(vue.sejour.ipp)}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#0f6b62" }}>
                        {fcfa(c.total)}
                      </div>
                      <div style={{ fontSize: 12, color: "#7d918a" }}>
                        organisme {fcfa(c.partOrganisme)} · patient {fcfa(c.partPatient)}
                      </div>
                    </div>
                  </div>
                  {c.plafondAtteint && (
                    <p style={{ margin: "10px 0 0", fontSize: 13, color: "#c2610a" }}>
                      Plafond de prise en charge atteint — le reste est à la charge du patient.
                    </p>
                  )}
                </div>

                {/* Prescription */}
                <div style={box}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Prescrire des examens</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {EXAMENS.map(([code, lib]) => {
                      const actif = selection.includes(code)
                      return (
                        <button key={code} onClick={() =>
                          setSelection(actif ? selection.filter((s) => s !== code) : [...selection, code])}
                          style={{
                            ...bouton(), fontSize: 12.5, padding: "6px 12px",
                            background: actif ? "#0f6b62" : "#fff",
                            color: actif ? "#fff" : "#14201c",
                            borderColor: actif ? "#0f6b62" : "#cfdad5",
                          }}>{lib}</button>
                      )
                    })}
                  </div>
                  <button style={bouton(true)} disabled={occupe || selection.length === 0 || !peut(session, "labo.prescrire")}
                          onClick={() => labo({ action: "prescrire", prescripteur: "Dr. Sall", codes: selection })}>
                    Prescrire ({selection.length})
                  </button>
                </div>

                {/* Examens */}
                <div style={box}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Laboratoire</h2>
                  <p style={{ fontSize: 13, color: "#7d918a", margin: "0 0 14px" }}>
                    La colonne Montant reste vide jusqu&apos;à la validation biologique.
                  </p>
                  {vue.examens.length === 0 && (
                    <p style={{ fontSize: 14, color: "#7d918a", margin: 0 }}>Aucun examen prescrit.</p>
                  )}
                  {vue.examens.map((e) => (
                    <div key={e.acte_id} style={{
                      display: "grid", gridTemplateColumns: "minmax(0,1fr) auto",
                      gap: 12, alignItems: "center",
                      padding: "11px 0", borderBottom: "1px solid #e3eae6",
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {e.libelle}
                          {e.critique && (
                            <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 700, color: "#c0392b", border: "1px solid #c0392b", borderRadius: 2, padding: "1px 5px" }}>
                              CRITIQUE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#7d918a", fontFamily: "ui-monospace, monospace" }}>
                          {e.code_acte} · {e.statut}
                          {e.valeur ? ` · ${e.valeur} ${e.unite ?? ""}` : ""}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          fontFamily: "ui-monospace, monospace", fontSize: 13,
                          fontVariantNumeric: "tabular-nums",
                          color: e.montant_total ? "#0f6b62" : "#c8d3ce", minWidth: 74, textAlign: "right",
                        }}>
                          {e.montant_total ? fcfa(Number(e.montant_total)) : "—"}
                        </span>
                        {e.statut === "prevu" && (
                          <button style={{ ...bouton(), fontSize: 12, padding: "5px 10px" }} disabled={occupe || !peut(session, "labo.prelever")}
                                  onClick={() => labo({ action: "prelever", acteId: e.acte_id, preleveur: "IDE Kane" })}>
                            Prélever
                          </button>
                        )}
                        {e.statut === "realise" && !e.valeur && (
                          <button style={{ ...bouton(), fontSize: 12, padding: "5px 10px" }} disabled={occupe || !peut(session, "labo.resultat")}
                                  onClick={() => labo({
                                    action: "resultat", acteId: e.acte_id,
                                    valeur: (Math.random() * 12 + 2).toFixed(1),
                                    unite: "g/dL", critique: Math.random() < 0.25,
                                  })}>
                            Saisir le résultat
                          </button>
                        )}
                        {e.statut === "realise" && e.valeur && (
                          <button style={{ ...bouton(true), fontSize: 12, padding: "5px 10px" }} disabled={occupe || !peut(session, "labo.valider")}
                                  onClick={() => labo({ action: "valider", acteId: e.acte_id, biologiste: "Dr. Mbaye" })}>
                            Valider
                          </button>
                        )}
                        {e.statut === "valide" && (
                          <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600, minWidth: 62, textAlign: "right" }}>
                            validé
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Imagerie */}
                <div style={box}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Imagerie</h2>
                    {vue.dose && vue.dose.nbExamens > 0 && (
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#c2610a" }}>
                        dose cumulée {vue.dose.total} {vue.dose.unite} · {vue.dose.nbExamens} examen(s)
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#7d918a", margin: "0 0 14px" }}>
                    La facture part à la signature du compte rendu, pas à la réalisation.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {IMAGERIE.map(([code, lib]) => (
                      <button key={code} disabled={occupe || !peut(session, "imagerie.demander")}
                        style={{ ...bouton(), fontSize: 12.5, padding: "6px 12px" }}
                        onClick={() => imagerie({
                          action: "demander", codes: [code],
                          indication: "Douleur thoracique — bilan initial",
                        })}>
                        + {lib}
                      </button>
                    ))}
                  </div>

                  {vue.imagerie?.length === 0 && (
                    <p style={{ fontSize: 14, color: "#7d918a", margin: 0 }}>Aucun examen demandé.</p>
                  )}

                  {vue.imagerie?.map((e) => (
                    <div key={e.acte_id} style={{
                      display: "grid", gridTemplateColumns: "minmax(0,1fr) auto",
                      gap: 12, alignItems: "center",
                      padding: "11px 0", borderBottom: "1px solid #e3eae6",
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {e.libelle}
                          {e.anomalie && (
                            <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 700, color: "#c0392b", border: "1px solid #c0392b", borderRadius: 2, padding: "1px 5px" }}>
                              ANOMALIE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#7d918a", fontFamily: "ui-monospace, monospace" }}>
                          {e.code_acte} · {e.statut}
                          {e.dose_delivree ? ` · ${e.dose_delivree} ${e.dose_unite}` : ""}
                        </div>
                        {e.compte_rendu && (
                          <div style={{ fontSize: 12.5, color: "#4b5f58", marginTop: 4 }}>{e.compte_rendu}</div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          fontFamily: "ui-monospace, monospace", fontSize: 13,
                          fontVariantNumeric: "tabular-nums",
                          color: e.montant_total ? "#0f6b62" : "#c8d3ce", minWidth: 80, textAlign: "right",
                        }}>
                          {e.montant_total ? fcfa(Number(e.montant_total)) : "—"}
                        </span>
                        {e.statut === "prevu" && e.famille === "imagerie" && (
                          <button style={{ ...bouton(), fontSize: 12, padding: "5px 10px" }}
                                  disabled={occupe || !peut(session, "imagerie.realiser")}
                                  onClick={() => imagerie({
                                    action: "realiser", acteId: e.acte_id,
                                    dose: ["IMG-ECHO", "IMG-IRM"].includes(e.code_acte)
                                      ? undefined : Number((Math.random() * 8 + 0.2).toFixed(2)),
                                  })}>
                            Réaliser
                          </button>
                        )}
                        {e.statut === "realise" && e.famille === "imagerie" && !e.compte_rendu && (
                          <button style={{ ...bouton(), fontSize: 12, padding: "5px 10px" }}
                                  disabled={occupe || !peut(session, "imagerie.interpreter")}
                                  onClick={() => imagerie({
                                    action: "interpreter", acteId: e.acte_id,
                                    compteRendu: "Pas de foyer parenchymateux individualisé.",
                                    conclusion: "Examen sans particularité",
                                  })}>
                            Interpréter
                          </button>
                        )}
                        {e.statut === "realise" && e.famille === "imagerie" && e.compte_rendu && (
                          <button style={{ ...bouton(true), fontSize: 12, padding: "5px 10px" }}
                                  disabled={occupe || !peut(session, "imagerie.signer")}
                                  onClick={() => imagerie({ action: "signer", acteId: e.acte_id })}>
                            Signer
                          </button>
                        )}
                        {e.statut === "valide" && (
                          <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600, minWidth: 62, textAlign: "right" }}>
                            signé
                          </span>
                        )}
                        {e.statut === "realise" && e.famille !== "imagerie" && (
                          <span style={{ fontSize: 12, color: "#7d918a", minWidth: 62, textAlign: "right" }}>
                            avec l&apos;examen
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clôture */}
                <div style={box}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Clôture</h2>
                  {vue.anomalies.length > 0 ? (
                    <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 13.5, color: "#c2610a" }}>
                      {vue.anomalies.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a.detail}</li>)}
                    </ul>
                  ) : (
                    <p style={{ fontSize: 13.5, color: "#15803d", margin: "0 0 14px" }}>
                      Aucune anomalie — le séjour peut être clôturé.
                    </p>
                  )}
                  <button style={bouton(true)} disabled={occupe || !peut(session, "sejour.cloturer")}
                          onClick={async () => {
                            const d = await labo({ action: "cloturer", modeSortie: "domicile" })
                            if (d?.facture) setMessage({
                              texte: `Facture ${d.facture.numero} — ${fcfa(Number(d.facture.total))}, dont ${fcfa(Number(d.facture.total_patient))} à la charge du patient.`,
                              type: "ok",
                            })
                          }}>
                    Clôturer et facturer
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
        )}
      </div>
    </>
  )
}

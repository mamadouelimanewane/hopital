"use client"
/* ════════════════════════════════════════════════════════════════
   Recouvrement — écran du service de facturation.

   Trois questions, dans cet ordre : que nous doit-on, qui nous le
   doit, et qu'avons-nous oublié de facturer. La dernière est celle
   qui rapporte le plus.
   ════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useState } from "react"
import {
  boite, etiquette, champ, bouton, petitBouton, mono,
  Panneau, Ligne, Pastille, Vide, COULEUR, fcfa,
} from "../ui"

type Indicateurs = {
  facture: number; encaisse: number; resteARecouvrer: number
  tauxRecouvrement: number; delaiMoyenEncaissement: number | null
  tauxRejetTiersPayant: number
  fuiteFacturation: { actes: number; sejours: number }
  resteAChargeMoyen: number
}
type Creance = {
  facture_id: number; numero: string; nda: string; patient: string
  reste_patient: string; reste_organisme: string; jours: string; relances: string
}
type Rejet = {
  bordereau: string; organisme: string; facture: string
  montant_reclame: string; motif_rejet: string
}
type Recette = { famille: string; montant: string; lignes: string }
type Tableau = {
  indicateurs: Indicateurs; creances: Creance[]; rejets: Rejet[]; recette: Recette[]
}

function Chiffre({ libelle, valeur, sous, ton }: {
  libelle: string; valeur: string; sous?: string; ton?: "ok" | "alerte" | "erreur"
}) {
  const couleur = ton === "alerte" ? COULEUR.alerte
    : ton === "erreur" ? COULEUR.erreur
    : ton === "ok" ? COULEUR.ok : COULEUR.encre
  return (
    <div style={{ ...boite, padding: "16px 18px" }}>
      <div style={{ ...etiquette, marginBottom: 8 }}>{libelle}</div>
      <div style={{ ...mono, fontSize: 24, fontWeight: 800, color: couleur, lineHeight: 1.1 }}>
        {valeur}
      </div>
      {sous && <div style={{ fontSize: 12, color: COULEUR.pale, marginTop: 4 }}>{sous}</div>}
    </div>
  )
}

export default function RecouvrementPage() {
  const [tableau, setTableau] = useState<Tableau | null>(null)
  const [message, setMessage] = useState<{ texte: string; type: "ok" | "err" } | null>(null)
  const [occupe, setOccupe] = useState(false)
  const [refuse, setRefuse] = useState(false)
  const [organisme, setOrganisme] = useState("IPM Touba")
  const [encaissement, setEncaissement] = useState<{ id: number; max: number } | null>(null)
  const [montant, setMontant] = useState("")

  const charger = useCallback(async () => {
    const r = await fetch("/api/socle/recouvrement")
    if (r.status === 401 || r.status === 403) { setRefuse(true); return }
    if (r.ok) { setRefuse(false); setTableau(await r.json()) }
  }, [])

  useEffect(() => { charger() }, [charger])

  async function agir(corps: Record<string, unknown>) {
    setOccupe(true); setMessage(null)
    try {
      const r = await fetch("/api/socle/recouvrement", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      })
      const d = await r.json()
      if (!r.ok) { setMessage({ texte: d.erreur || "Échec", type: "err" }); return null }
      await charger()
      return d
    } finally { setOccupe(false) }
  }

  if (refuse) {
    return (
      <>
        <style>{`body { zoom: 1 !important; background: ${COULEUR.fond} !important; }`}</style>
        <div style={{ maxWidth: 520, margin: "80px auto", padding: 24 }}>
          <div style={{ ...boite, color: COULEUR.doux }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Accès réservé</h1>
            <p style={{ fontSize: 14, margin: "0 0 14px" }}>
              Ce tableau de bord est réservé au service de facturation.
            </p>
            <a href="/socle" style={{ fontSize: 13.5, color: COULEUR.accent }}>← Retour au poste de travail</a>
          </div>
        </div>
      </>
    )
  }

  const i = tableau?.indicateurs

  return (
    <>
      <style>{`body { zoom: 1 !important; background: ${COULEUR.fond} !important; }`}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 80px", color: COULEUR.encre }}>
        <header style={{ borderBottom: `2px solid ${COULEUR.encre}`, paddingBottom: 16, marginBottom: 24 }}>
          <p style={{ ...mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: COULEUR.accent, margin: 0 }}>
            Socle · recouvrement
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", margin: "8px 0 4px" }}>
            Ce que l&apos;hôpital attend encore
          </h1>
          <a href="/socle" style={{ fontSize: 13.5, color: COULEUR.doux }}>← Poste de travail</a>
        </header>

        {message && (
          <div style={{
            ...boite, marginBottom: 20, padding: "12px 16px", fontSize: 14,
            borderLeft: `3px solid ${message.type === "ok" ? COULEUR.ok : COULEUR.erreur}`,
            color: message.type === "ok" ? COULEUR.ok : COULEUR.erreur,
          }}>{message.texte}</div>
        )}

        {i && (
          <>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 14, marginBottom: 24,
            }}>
              <Chiffre libelle="Facturé" valeur={fcfa(i.facture)} />
              <Chiffre libelle="Encaissé" valeur={fcfa(i.encaisse)}
                       sous={`${i.tauxRecouvrement} % de recouvrement`}
                       ton={i.tauxRecouvrement >= 80 ? "ok" : undefined} />
              <Chiffre libelle="Reste à recouvrer" valeur={fcfa(i.resteARecouvrer)}
                       ton={i.resteARecouvrer > 0 ? "alerte" : "ok"} />
              <Chiffre libelle="Délai d'encaissement"
                       valeur={i.delaiMoyenEncaissement != null ? `${i.delaiMoyenEncaissement} j` : "—"} />
              <Chiffre libelle="Rejets tiers payant" valeur={`${i.tauxRejetTiersPayant} %`}
                       ton={i.tauxRejetTiersPayant > 10 ? "erreur" : undefined} />
              <Chiffre libelle="Fuite de facturation"
                       valeur={String(i.fuiteFacturation.actes)}
                       sous={i.fuiteFacturation.actes > 0
                         ? `actes validés jamais facturés · ${i.fuiteFacturation.sejours} séjour(s)`
                         : "aucun acte oublié"}
                       ton={i.fuiteFacturation.actes > 0 ? "erreur" : "ok"} />
            </div>

            {i.fuiteFacturation.actes > 0 && (
              <div style={{
                ...boite, marginBottom: 24, borderLeft: `3px solid ${COULEUR.erreur}`,
                fontSize: 14, color: COULEUR.doux,
              }}>
                <strong style={{ color: COULEUR.erreur }}>
                  {i.fuiteFacturation.actes} acte(s) validé(s) sans ligne de facture.
                </strong>{" "}
                C&apos;est une recette perdue : elle ne sera jamais réclamée si personne
                ne la retrouve avant la clôture du séjour.
              </div>
            )}
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,340px)", gap: 24, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 20 }}>

            <Panneau titre="Créances en cours"
                     aide="Ce qui reste dû, et par qui — le patient, l'organisme, ou les deux.">
              {!tableau?.creances.length && <Vide texte="Aucune créance : tout est soldé." />}
              {tableau?.creances.map((cr) => {
                const restePatient = Number(cr.reste_patient)
                const resteOrganisme = Number(cr.reste_organisme)
                const jours = Math.round(Number(cr.jours))
                return (
                  <Ligne key={cr.facture_id}
                    titre={<>
                      {cr.patient}
                      {jours > 60 && <Pastille texte={`${jours} j`} ton="erreur" />}
                      {jours <= 60 && jours > 30 && <Pastille texte={`${jours} j`} ton="alerte" />}
                      {Number(cr.relances) > 0 && <Pastille texte={`${cr.relances} relance(s)`} />}
                    </>}
                    sous={`${cr.numero} · ${cr.nda}`}
                    extra={
                      <div style={{ fontSize: 12.5, color: COULEUR.doux, marginTop: 4 }}>
                        {restePatient > 0 && <>patient {fcfa(restePatient)}</>}
                        {restePatient > 0 && resteOrganisme > 0 && " · "}
                        {resteOrganisme > 0 && <>organisme {fcfa(resteOrganisme)}</>}
                      </div>
                    }
                    actions={<>
                      {restePatient > 0 && (
                        <>
                          <button style={petitBouton(true, occupe)} disabled={occupe}
                                  onClick={() => {
                                    setEncaissement({ id: cr.facture_id, max: restePatient })
                                    setMontant(String(restePatient))
                                  }}>Encaisser</button>
                          <button style={petitBouton(false, occupe)} disabled={occupe}
                                  onClick={() => agir({
                                    action: "relancer", factureId: cr.facture_id,
                                    niveau: Number(cr.relances) + 1, canal: "sms",
                                  })}>Relancer</button>
                        </>
                      )}
                    </>}
                  />
                )
              })}
            </Panneau>

            {tableau?.rejets.length ? (
              <Panneau titre="Rejets à retraiter"
                       aide="Chaque rejet est motivé : c'est ce qui permet de corriger et de réémettre.">
                {tableau.rejets.map((r, n) => (
                  <Ligne key={n}
                    titre={<>{r.facture} <Pastille texte={r.organisme} ton="erreur" /></>}
                    sous={`${r.bordereau} · ${fcfa(Number(r.montant_reclame))}`}
                    extra={<div style={{ fontSize: 12.5, color: COULEUR.erreur, marginTop: 4 }}>{r.motif_rejet}</div>}
                  />
                ))}
              </Panneau>
            ) : null}

            {tableau?.recette.length ? (
              <Panneau titre="Recette par famille d'actes" aide="Où se crée réellement la ressource.">
                {tableau.recette.map((r) => (
                  <Ligne key={r.famille}
                    titre={r.famille}
                    sous={`${r.lignes} ligne(s)`}
                    actions={<span style={{ ...mono, fontSize: 13, color: COULEUR.accent }}>
                      {fcfa(Number(r.montant))}
                    </span>}
                  />
                ))}
              </Panneau>
            ) : null}
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "grid", gap: 20 }}>
            {encaissement && (
              <Panneau titre="Encaisser">
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <label style={etiquette}>Montant — reste dû {fcfa(encaissement.max)}</label>
                    <input style={champ} type="number" value={montant}
                           onChange={(e) => setMontant(e.target.value)} />
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(["especes", "mobile_money", "carte", "virement"] as const).map((m) => (
                      <button key={m} style={petitBouton(false, occupe)} disabled={occupe}
                              onClick={async () => {
                                const d = await agir({
                                  action: "encaisser", factureId: encaissement.id,
                                  montant: Number(montant), moyen: m,
                                })
                                if (d) { setEncaissement(null); setMessage({ texte: "Règlement enregistré.", type: "ok" }) }
                              }}>
                        {m.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                  <button style={petitBouton(false, occupe)} onClick={() => setEncaissement(null)}>
                    Annuler
                  </button>
                </div>
              </Panneau>
            )}

            <Panneau titre="Bordereau de tiers payant"
                     aide="Regroupe toutes les factures d'un organisme non encore réclamées.">
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label style={etiquette}>Organisme</label>
                  <input style={champ} value={organisme}
                         onChange={(e) => setOrganisme(e.target.value)} />
                </div>
                <button style={bouton(true, occupe)} disabled={occupe}
                        onClick={async () => {
                          const d = await agir({ action: "bordereau", organisme })
                          if (d) setMessage({
                            texte: `Bordereau ${d.numero} — ${d.nbFactures} facture(s), ${fcfa(Number(d.montant_reclame))}.`,
                            type: "ok",
                          })
                        }}>
                  Constituer
                </button>
              </div>
            </Panneau>
          </div>
        </div>
      </div>
    </>
  )
}

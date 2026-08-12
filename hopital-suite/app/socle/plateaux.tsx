"use client"
/* ════════════════════════════════════════════════════════════════
   Panneaux des plateaux techniques.

   Chacun montre la même chose : où en est chaque acte, et à partir
   de quel geste il devient facturable. La colonne Montant reste
   vide jusqu'à ce geste — c'est le principe du socle, rendu visible.
   ════════════════════════════════════════════════════════════════ */
import {
  Panneau, Ligne, Montant, Pastille, Vide,
  petitBouton, bouton, mono, COULEUR, fcfa,
} from "./ui"

type Appel = (corps: Record<string, unknown>) => Promise<unknown>

export interface Session { role: string }

/* ── Imagerie ───────────────────────────────────────────────────── */
export interface ExamenImagerie {
  acte_id: number; code_acte: string; libelle: string; famille: string; statut: string
  dose_delivree: string | null; dose_unite: string | null
  compte_rendu: string | null; conclusion: string | null; anomalie: boolean | null
  montant_total: string | null
}

const CATALOGUE_IMAGERIE = [
  ["IMG-RXT", "Radio thorax"],
  ["IMG-ECHO", "Échographie"],
  ["IMG-SCANI", "Scanner injecté"],
]

export function PanneauImagerie({ examens, dose, peut, occupe, appeler }: {
  examens: ExamenImagerie[]
  dose?: { total: number; nbExamens: number; unite: string }
  peut: (action: string) => boolean
  occupe: boolean
  appeler: Appel
}) {
  return (
    <Panneau
      titre="Imagerie"
      aide="La facture part à la signature du compte rendu, pas à la réalisation."
      droite={dose && dose.nbExamens > 0 ? (
        <span style={{ ...mono, fontSize: 12, color: COULEUR.alerte }}>
          dose cumulée {dose.total} {dose.unite} · {dose.nbExamens} examen(s)
        </span>
      ) : undefined}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {CATALOGUE_IMAGERIE.map(([code, lib]) => (
          <button key={code} style={petitBouton(false, occupe)}
                  disabled={occupe || !peut("imagerie.demander")}
                  onClick={() => appeler({
                    action: "demander", codes: [code],
                    indication: "Douleur thoracique — bilan initial",
                  })}>
            + {lib}
          </button>
        ))}
      </div>

      {examens.length === 0 && <Vide texte="Aucun examen demandé." />}

      {examens.map((e) => (
        <Ligne key={e.acte_id}
          titre={<>{e.libelle}{e.anomalie && <Pastille texte="Anomalie" ton="erreur" />}</>}
          sous={`${e.code_acte} · ${e.statut}${e.dose_delivree ? ` · ${e.dose_delivree} ${e.dose_unite}` : ""}`}
          extra={e.compte_rendu && (
            <div style={{ fontSize: 12.5, color: COULEUR.doux, marginTop: 4 }}>{e.compte_rendu}</div>
          )}
          actions={<>
            <Montant valeur={e.montant_total} />
            {e.statut === "prevu" && e.famille === "imagerie" && (
              <button style={petitBouton(false, occupe)}
                      disabled={occupe || !peut("imagerie.realiser")}
                      onClick={() => appeler({
                        action: "realiser", acteId: e.acte_id,
                        dose: ["IMG-ECHO", "IMG-IRM"].includes(e.code_acte)
                          ? undefined : Number((Math.random() * 8 + 0.2).toFixed(2)),
                      })}>Réaliser</button>
            )}
            {e.statut === "realise" && e.famille === "imagerie" && !e.compte_rendu && (
              <button style={petitBouton(false, occupe)}
                      disabled={occupe || !peut("imagerie.interpreter")}
                      onClick={() => appeler({
                        action: "interpreter", acteId: e.acte_id,
                        compteRendu: "Pas de foyer parenchymateux individualisé.",
                        conclusion: "Examen sans particularité",
                      })}>Interpréter</button>
            )}
            {e.statut === "realise" && e.famille === "imagerie" && e.compte_rendu && (
              <button style={petitBouton(true, occupe)}
                      disabled={occupe || !peut("imagerie.signer")}
                      onClick={() => appeler({ action: "signer", acteId: e.acte_id })}>
                Signer
              </button>
            )}
            {e.statut === "valide" && (
              <span style={{ fontSize: 12, color: COULEUR.ok, fontWeight: 600 }}>signé</span>
            )}
            {e.statut === "realise" && e.famille !== "imagerie" && (
              <span style={{ fontSize: 12, color: COULEUR.pale }}>avec l&apos;examen</span>
            )}
          </>}
        />
      ))}
    </Panneau>
  )
}

/* ── Pharmacie ──────────────────────────────────────────────────── */
export interface LigneTraitement {
  ligne_id: number; code_acte: string; libelle: string
  dose: string; unite_dose: string; voie: string
  prises_par_jour: number; duree_jours: number
  dispense: string; administre: string; statut: string
  avis: string | null; avis_motif: string | null
  montant_facture: string | null
}

const CATALOGUE_MEDICAMENTS = [
  ["MED-PARA", "Paracétamol 1 g", 1000],
  ["MED-AMOX", "Amoxicilline 1 g", 1000],
  ["MED-CEFTRI", "Ceftriaxone 1 g", 1],
]

export function PanneauPharmacie({ traitement, peut, occupe, appeler }: {
  traitement: LigneTraitement[]
  peut: (action: string) => boolean
  occupe: boolean
  appeler: Appel
}) {
  // Une prescription se vise en bloc : on prend celle de la première
  // ligne encore sans avis.
  const sansAvis = traitement.find((t) => !t.avis)

  return (
    <Panneau
      titre="Pharmacie"
      aide="C'est l'administration au lit qui facture, pas la dispensation."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {CATALOGUE_MEDICAMENTS.map(([code, lib, dose]) => (
          <button key={String(code)} style={petitBouton(false, occupe)}
                  disabled={occupe || !peut("pharma.prescrire")}
                  onClick={() => appeler({
                    action: "prescrire",
                    lignes: [{ code, dose, prisesParJour: 3, dureeJours: 2 }],
                    indication: "Traitement symptomatique",
                  })}>
            + {lib}
          </button>
        ))}
        {sansAvis && (
          <button style={petitBouton(true, occupe)}
                  disabled={occupe || !peut("pharma.analyser")}
                  onClick={() => appeler({
                    action: "analyser", prescriptionId: sansAvis.ligne_id, avis: "favorable",
                  })}>
            Viser la prescription
          </button>
        )}
      </div>

      {traitement.length === 0 && <Vide texte="Aucun traitement prescrit." />}

      {traitement.map((t) => {
        const prevu = t.prises_par_jour * t.duree_jours
        const dispense = Number(t.dispense)
        const administre = Number(t.administre)
        return (
          <Ligne key={t.ligne_id}
            titre={<>
              {t.libelle}
              {t.avis === "favorable" && <Pastille texte="Visé" ton="ok" />}
              {t.avis === "reserve" && <Pastille texte="Réserve" ton="alerte" />}
              {t.avis === "refuse" && <Pastille texte="Refusé" ton="erreur" />}
              {!t.avis && <Pastille texte="Sans avis" />}
            </>}
            sous={`${t.dose} ${t.unite_dose} · ${t.voie} · ${t.prises_par_jour}×/j pendant ${t.duree_jours} j`}
            extra={
              <div style={{ fontSize: 12.5, color: COULEUR.doux, marginTop: 4 }}>
                dispensé {dispense}/{prevu} · administré {administre}/{prevu}
                {t.avis_motif ? ` · ${t.avis_motif}` : ""}
              </div>
            }
            actions={<>
              <Montant valeur={t.montant_facture} />
              {t.avis && t.avis !== "refuse" && dispense < prevu && t.statut === "active" && (
                <button style={petitBouton(false, occupe)}
                        disabled={occupe || !peut("pharma.dispenser")}
                        onClick={() => appeler({
                          action: "dispenser", ligneId: t.ligne_id, quantite: prevu - dispense,
                        })}>Dispenser</button>
              )}
              {administre < dispense && t.statut === "active" && (
                <button style={petitBouton(true, occupe)}
                        disabled={occupe || !peut("pharma.administrer")}
                        onClick={() => appeler({ action: "administrer", ligneId: t.ligne_id })}>
                  Administrer
                </button>
              )}
              {t.statut === "terminee" && (
                <span style={{ fontSize: 12, color: COULEUR.ok, fontWeight: 600 }}>terminé</span>
              )}
              {t.statut === "arretee" && (
                <span style={{ fontSize: 12, color: COULEUR.erreur, fontWeight: 600 }}>arrêté</span>
              )}
            </>}
          />
        )
      })}
    </Panneau>
  )
}

/* ── Bloc opératoire ────────────────────────────────────────────── */
export interface InterventionVue {
  id: number; code_acte: string; libelle: string; statut: string
  chirurgien: string; anesthesiste: string; salle: string
  verifications: string | number; implants: string | number
}

const TEMPS: Array<[string, string, string]> = [
  ["avant_induction", "Vérifier avant induction", "bloc.verifier"],
  ["avant_incision", "Vérifier avant incision", "bloc.verifier"],
  ["avant_sortie", "Vérifier avant sortie", "bloc.verifier"],
]

/** Points de la liste, tous cochés — l'écran ne propose pas de demi-mesure. */
const POINTS: Record<string, string[]> = {
  avant_induction: ["identite_patient_confirmee", "intervention_et_site_confirmes",
                    "consentement_verifie", "allergies_connues", "materiel_anesthesie_verifie"],
  avant_incision: ["equipe_presentee", "identite_et_site_reconfirmes",
                   "antibioprophylaxie_faite", "imagerie_disponible"],
  avant_sortie: ["intervention_enregistree", "comptage_compresses_correct",
                 "materiel_compte", "etiquetage_prelevements", "consignes_post_operatoires"],
}
const tousCoches = (temps: string) =>
  Object.fromEntries((POINTS[temps] ?? []).map((p) => [p, true]))

export function PanneauBloc({ interventions, peut, occupe, appeler }: {
  interventions: InterventionVue[]
  peut: (action: string) => boolean
  occupe: boolean
  appeler: Appel
}) {
  return (
    <Panneau
      titre="Bloc opératoire"
      aide="Chaque temps de la liste de vérification conditionne l'étape suivante."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <button style={petitBouton(false, occupe)}
                disabled={occupe || !peut("bloc.consentement")}
                onClick={() => appeler({
                  action: "consentement", objet: "Cure de hernie inguinale",
                  signePar: "Le patient",
                })}>+ Consentement</button>
        <button style={petitBouton(false, occupe)}
                disabled={occupe || !peut("bloc.anesthesie")}
                onClick={() => appeler({ action: "anesthesie" })}>
          + Consultation d&apos;anesthésie
        </button>
        <button style={petitBouton(true, occupe)}
                disabled={occupe || !peut("bloc.programmer")}
                onClick={() => appeler({
                  action: "programmer", codeActe: "CHIR-HERN", salle: "Salle 1",
                })}>Programmer l&apos;intervention</button>
      </div>

      {interventions.length === 0 && <Vide texte="Aucune intervention programmée." />}

      {interventions.map((i) => {
        const faites = Number(i.verifications)
        return (
          <Ligne key={i.id}
            titre={<>
              {i.libelle}
              <Pastille texte={i.statut} ton={i.statut === "facturee" ? "ok" : "info"} />
              <Pastille texte={`${faites}/3 vérifications`} ton={faites === 3 ? "ok" : "alerte"} />
              {Number(i.implants) > 0 && <Pastille texte={`${i.implants} implant(s)`} />}
            </>}
            sous={`${i.code_acte} · ${i.salle || "salle non affectée"} · ${i.chirurgien}`}
            actions={<>
              {TEMPS.map(([temps, libelle, droit]) => (
                <button key={temps} style={petitBouton(false, occupe)}
                        disabled={occupe || !peut(droit) || i.statut === "facturee"}
                        title={libelle}
                        onClick={() => appeler({
                          action: "verifier", interventionId: i.id, temps,
                          points: tousCoches(temps),
                        })}>{temps.replace("avant_", "")}</button>
              ))}
              {i.statut === "programmee" && (
                <button style={petitBouton(false, occupe)}
                        disabled={occupe || !peut("bloc.induire")}
                        onClick={() => appeler({ action: "induire", interventionId: i.id })}>
                  Induire
                </button>
              )}
              {i.statut === "induite" && (
                <button style={petitBouton(false, occupe)}
                        disabled={occupe || !peut("bloc.inciser")}
                        onClick={() => appeler({ action: "inciser", interventionId: i.id })}>
                  Inciser
                </button>
              )}
              {i.statut === "en_cours" && (
                <button style={petitBouton(true, occupe)}
                        disabled={occupe || !peut("bloc.sortie")}
                        onClick={() => appeler({
                          action: "sortie", interventionId: i.id,
                          compteRendu: "Intervention sans particularité, suites simples.",
                        })}>Sortie de salle</button>
              )}
            </>}
          />
        )
      })}
    </Panneau>
  )
}

/* ── Journées d'hébergement ─────────────────────────────────────── */
export function PanneauHebergement({ journees }: {
  journees?: Array<{ nuit_du: string; categorie: string; unite: string; montant_total: string | null }>
}) {
  if (!journees?.length) return null
  const total = journees.reduce((t, j) => t + Number(j.montant_total ?? 0), 0)
  return (
    <Panneau
      titre="Hébergement"
      aide="Une ligne par nuitée, au tarif de l'unité où elle a été passée."
      droite={<span style={{ ...mono, fontSize: 13, color: COULEUR.accent }}>{fcfa(total)}</span>}
    >
      {journees.map((j) => (
        <Ligne key={`${j.nuit_du}-${j.unite}`}
          titre={<>Nuit du {j.nuit_du}</>}
          sous={`${j.unite} · ${j.categorie}`}
          actions={<Montant valeur={j.montant_total} />}
        />
      ))}
    </Panneau>
  )
}

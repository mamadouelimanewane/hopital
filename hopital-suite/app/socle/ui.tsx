"use client"
/* ════════════════════════════════════════════════════════════════
   Vocabulaire visuel partagé par les écrans du socle.

   Sobre et dense à dessein : ce sont des postes de travail, pas des
   maquettes de démonstration. Rien ici ne cherche à impressionner.
   ════════════════════════════════════════════════════════════════ */
import type { CSSProperties, ReactNode } from "react"

export const COULEUR = {
  encre: "#14201c",
  doux: "#4b5f58",
  pale: "#7d918a",
  trait: "#dfe5e2",
  traitFin: "#e3eae6",
  fond: "#f1f4f2",
  accent: "#0f6b62",
  ok: "#15803d",
  alerte: "#c2610a",
  erreur: "#c0392b",
} as const

export const fcfa = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " F"

export const boite: CSSProperties = {
  background: "#fff", border: `1px solid ${COULEUR.trait}`,
  borderRadius: 6, padding: 18,
}

export const etiquette: CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
  textTransform: "uppercase", color: COULEUR.pale, marginBottom: 6,
}

export const champ: CSSProperties = {
  width: "100%", padding: "8px 10px", fontSize: 14,
  border: "1px solid #cfdad5", borderRadius: 4, background: "#fff",
  fontFamily: "inherit", color: COULEUR.encre,
}

export const bouton = (principal = false, occupe = false): CSSProperties => ({
  padding: "9px 16px", fontSize: 13.5, fontWeight: 650, borderRadius: 4,
  cursor: occupe ? "default" : "pointer",
  border: principal ? "none" : "1px solid #cfdad5",
  background: principal ? COULEUR.accent : "#fff",
  color: principal ? "#fff" : COULEUR.encre,
  fontFamily: "inherit", opacity: occupe ? 0.6 : 1,
})

export const petitBouton = (principal = false, occupe = false): CSSProperties => ({
  ...bouton(principal, occupe), fontSize: 12, padding: "5px 10px",
})

export const mono: CSSProperties = {
  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  fontVariantNumeric: "tabular-nums",
}

/** Montant aligné à droite ; grisé tant que rien n'est facturé. */
export function Montant({ valeur, largeur = 84 }: { valeur: string | number | null; largeur?: number }) {
  const n = valeur == null ? null : Number(valeur)
  return (
    <span style={{
      ...mono, fontSize: 13, minWidth: largeur, textAlign: "right",
      color: n ? COULEUR.accent : "#c8d3ce",
    }}>
      {n ? fcfa(n) : "—"}
    </span>
  )
}

export function Pastille({ texte, ton = "info" }: {
  texte: string; ton?: "info" | "ok" | "alerte" | "erreur"
}) {
  const couleur = ton === "ok" ? COULEUR.ok
    : ton === "alerte" ? COULEUR.alerte
    : ton === "erreur" ? COULEUR.erreur : COULEUR.pale
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, letterSpacing: ".04em",
      color: couleur, border: `1px solid ${couleur}`,
      borderRadius: 2, padding: "1px 6px", whiteSpace: "nowrap",
    }}>{texte}</span>
  )
}

/** Ligne d'un plateau : libellé et sous-titre à gauche, actions à droite. */
export function Ligne({ titre, sous, extra, actions }: {
  titre: ReactNode; sous?: ReactNode; extra?: ReactNode; actions?: ReactNode
}) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "minmax(0,1fr) auto",
      gap: 12, alignItems: "center",
      padding: "11px 0", borderBottom: `1px solid ${COULEUR.traitFin}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {titre}
        </div>
        {sous && (
          <div style={{ ...mono, fontSize: 12, color: COULEUR.pale, marginTop: 2 }}>{sous}</div>
        )}
        {extra}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{actions}</div>
    </div>
  )
}

export function Panneau({ titre, aide, droite, children }: {
  titre: string; aide?: string; droite?: ReactNode; children: ReactNode
}) {
  return (
    <div style={boite}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "baseline", gap: 12, flexWrap: "wrap",
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{titre}</h2>
        {droite}
      </div>
      {aide && (
        <p style={{ fontSize: 13, color: COULEUR.pale, margin: "6px 0 14px" }}>{aide}</p>
      )}
      {!aide && <div style={{ height: 14 }} />}
      {children}
    </div>
  )
}

export function Vide({ texte }: { texte: string }) {
  return <p style={{ fontSize: 14, color: COULEUR.pale, margin: 0 }}>{texte}</p>
}

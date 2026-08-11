import { describe, it, expect } from "vitest"
import {
  normaliser, reductionPhonetique, clePhonetique, similarite, scorer,
} from "@/lib/identite"

describe("normalisation des traits", () => {
  it("supprime accents, ponctuation et casse", () => {
    expect(normaliser("Ndèye-Fatou  N'diaye")).toBe("NDEYE FATOU N DIAYE")
    expect(normaliser("  cheikh   ")).toBe("CHEIKH")
  })
  it("tolère l'absence de valeur", () => {
    expect(normaliser("")).toBe("")
  })
})

describe("réduction phonétique", () => {
  // Une même personne s'écrit de plusieurs façons selon l'agent
  // qui saisit : ces graphies doivent se rapprocher.
  const memeNom: Array<[string, string]> = [
    ["Ndiaye", "Ndiay"],
    ["Sarr", "Sar"],
    ["Seck", "Sek"],
    ["Ba", "Bah"],
    ["Thiam", "Tiam"],
    ["Ndour", "Ndur"],
    ["Gueye", "Guèye"],
    ["Fatou", "Fatu"],
    ["Mamadou", "Mamadu"],
    ["Cheikh", "Cheik"],
  ]
  for (const [a, b] of memeNom) {
    it(`rapproche ${a} et ${b}`, () => {
      expect(reductionPhonetique(a)).toBe(reductionPhonetique(b))
    })
  }

  // Fusionner deux personnes distinctes est plus grave qu'un doublon :
  // la réduction ne doit pas confondre des noms différents.
  const nomsDistincts: Array<[string, string]> = [
    ["Diop", "Diouf"],
    ["Sow", "Sarr"],
    ["Fall", "Faye"],
    ["Mbaye", "Mbengue"],
    ["Kane", "Kanté"],
    ["Sy", "Sylla"],
  ]
  for (const [a, b] of nomsDistincts) {
    it(`distingue ${a} de ${b}`, () => {
      expect(reductionPhonetique(a)).not.toBe(reductionPhonetique(b))
    })
  }

  it("produit une clé combinant nom et prénom", () => {
    expect(clePhonetique("Ndiaye", "Fatou")).toBe(clePhonetique("Ndiay", "Fatu"))
    expect(clePhonetique("Ndiaye", "Fatou")).not.toBe(clePhonetique("Ndiaye", "Moussa"))
  })
})

describe("similarité", () => {
  it("vaut 1 pour deux chaînes identiques après normalisation", () => {
    expect(similarite("Diop", "DIOP")).toBe(1)
  })
  it("décroît avec la distance", () => {
    expect(similarite("Ndiaye", "Ndiay")).toBeGreaterThan(0.8)
    expect(similarite("Diop", "Sylla")).toBeLessThan(0.4)
  })
})

describe("score de rapprochement", () => {
  const connu = {
    nom: "Ndiaye", prenom: "Fatou", date_naissance: "1988-04-12",
    sexe: "F", telephone: "+221 77 123 45 67",
  }

  it("reconnaît la même personne malgré une graphie différente", () => {
    const { score } = scorer(
      { nom: "Ndiay", prenom: "Fatu", dateNaissance: "1988-04-12", sexe: "F" },
      connu,
    )
    expect(score).toBeGreaterThanOrEqual(0.75)
  })

  it("pénalise une date de naissance divergente", () => {
    const memeDate = scorer(
      { nom: "Ndiaye", prenom: "Fatou", dateNaissance: "1988-04-12" }, connu)
    const autreDate = scorer(
      { nom: "Ndiaye", prenom: "Fatou", dateNaissance: "1994-09-03" }, connu)
    expect(autreDate.score).toBeLessThan(memeDate.score)
    expect(autreDate.motifs).toContain("date de naissance différente")
  })

  it("pénalise un sexe divergent", () => {
    const r = scorer({ nom: "Ndiaye", prenom: "Fatou", sexe: "M" }, connu)
    expect(r.motifs).toContain("sexe différent")
  })

  it("remonte le score quand le téléphone concorde", () => {
    const sans = scorer({ nom: "Ndiaye", prenom: "Fatou" }, connu)
    const avec = scorer({ nom: "Ndiaye", prenom: "Fatou", telephone: "771234567" }, connu)
    expect(avec.score).toBeGreaterThan(sans.score)
  })

  it("ne rapproche pas deux personnes sans rapport", () => {
    const { score } = scorer(
      { nom: "Sylla", prenom: "Ousmane", dateNaissance: "1975-01-01", sexe: "M" },
      connu,
    )
    expect(score).toBeLessThan(0.55)
  })
})

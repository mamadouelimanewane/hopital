import { describe, it, expect } from "vitest"
import {
  cn,
  formatDuree,
  formatPourcentage,
  secondesEnHHMMSS,
  calculerDureeEntre,
  getNiveauAlerteColor,
  getStatutCampagneBadge,
} from "./utils"

describe("cn", () => {
  it("fusionne les classes simples", () => {
    expect(cn("a", "b")).toBe("a b")
  })
  it("résout les conflits Tailwind", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
  it("ignore les valeurs falsy", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b")
  })
})

describe("formatDuree", () => {
  it("retourne les secondes seules", () => {
    expect(formatDuree(0)).toBe("0s")
    expect(formatDuree(45)).toBe("45s")
  })
  it("retourne minutes + secondes", () => {
    expect(formatDuree(60)).toBe("1min 00s")
    expect(formatDuree(90)).toBe("1min 30s")
    expect(formatDuree(125)).toBe("2min 05s")
  })
  it("retourne heures + minutes", () => {
    expect(formatDuree(3600)).toBe("1h 00min")
    expect(formatDuree(3660)).toBe("1h 01min")
    expect(formatDuree(7200)).toBe("2h 00min")
  })
})

describe("formatPourcentage", () => {
  it("formate avec 1 décimale par défaut", () => {
    expect(formatPourcentage(33.333)).toBe("33.3%")
    expect(formatPourcentage(100)).toBe("100.0%")
  })
  it("respecte le nombre de décimales fourni", () => {
    expect(formatPourcentage(50, 0)).toBe("50%")
    expect(formatPourcentage(12.345, 2)).toBe("12.35%")
  })
})

describe("secondesEnHHMMSS", () => {
  it("formate 0 en 00:00:00", () => {
    expect(secondesEnHHMMSS(0)).toBe("00:00:00")
  })
  it("formate correctement heures, minutes, secondes", () => {
    expect(secondesEnHHMMSS(3661)).toBe("01:01:01")
    expect(secondesEnHHMMSS(86399)).toBe("23:59:59")
  })
  it("padde avec des zéros", () => {
    expect(secondesEnHHMMSS(65)).toBe("00:01:05")
  })
})

describe("calculerDureeEntre", () => {
  it("calcule la durée entre deux heures simples", () => {
    expect(calculerDureeEntre("08:00:00", "09:00:00")).toBe(3600)
    expect(calculerDureeEntre("00:00:00", "00:30:00")).toBe(1800)
  })
  it("gère les heures sans secondes", () => {
    expect(calculerDureeEntre("10:00", "10:45")).toBe(2700)
  })
  it("retourne 0 pour la même heure", () => {
    expect(calculerDureeEntre("12:00:00", "12:00:00")).toBe(0)
  })
})

describe("getNiveauAlerteColor", () => {
  it("retourne rouge pour critique", () => {
    expect(getNiveauAlerteColor("critique")).toContain("red")
  })
  it("retourne ambre pour avertissement", () => {
    expect(getNiveauAlerteColor("avertissement")).toContain("amber")
  })
  it("retourne bleu par défaut", () => {
    expect(getNiveauAlerteColor("info")).toContain("blue")
    expect(getNiveauAlerteColor("inconnu")).toContain("blue")
  })
})

describe("getStatutCampagneBadge", () => {
  it("retourne le bon label pour en_cours", () => {
    const badge = getStatutCampagneBadge("en_cours")
    expect(badge.label).toBe("En cours")
    expect(badge.class).toContain("green")
  })
  it("retourne le bon label pour a_venir", () => {
    const badge = getStatutCampagneBadge("a_venir")
    expect(badge.label).toBe("À venir")
    expect(badge.class).toContain("blue")
  })
  it("retourne le bon label pour terminee", () => {
    const badge = getStatutCampagneBadge("terminee")
    expect(badge.label).toBe("Terminée")
    expect(badge.class).toContain("gray")
  })
  it("retourne le statut brut pour valeur inconnue", () => {
    const badge = getStatutCampagneBadge("custom")
    expect(badge.label).toBe("custom")
  })
})

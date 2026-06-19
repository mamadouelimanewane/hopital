import { describe, it, expect } from "vitest"
import { cn, formatNumber, getRiskColor, getRiskLabel } from "./utils"

describe("cn", () => {
  it("fusionne plusieurs classes", () => {
    expect(cn("flex", "items-center", "gap-2")).toBe("flex items-center gap-2")
  })
  it("résout les conflits Tailwind", () => {
    expect(cn("rounded", "rounded-xl")).toBe("rounded-xl")
  })
})

describe("formatNumber", () => {
  it("millions avec une décimale", () => {
    expect(formatNumber(1_000_000)).toBe("1.0M")
  })
  it("milliers arrondis", () => {
    expect(formatNumber(1_499)).toBe("1k")
    expect(formatNumber(1_500)).toBe("2k")
  })
  it("nombre brut sous 1000", () => {
    expect(formatNumber(7)).toBe("7")
  })
})

describe("getRiskColor / getRiskLabel — partagés avec antideep", () => {
  const cases: [number, string, string][] = [
    [85, "#dc2626", "Critique"],
    [65, "#ea580c", "Élevé"],
    [45, "#d97706", "Modéré"],
    [20, "#16a34a", "Faible"],
  ]
  cases.forEach(([score, color, label]) => {
    it(`score ${score} → couleur ${color} et label "${label}"`, () => {
      expect(getRiskColor(score)).toBe(color)
      expect(getRiskLabel(score)).toBe(label)
    })
  })
})

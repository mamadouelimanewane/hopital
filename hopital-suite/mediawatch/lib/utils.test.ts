import { describe, it, expect } from "vitest"
import { cn, formatNumber, formatDuration } from "./utils"

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

describe("formatNumber", () => {
  it("formate les millions", () => {
    expect(formatNumber(1_500_000)).toBe("1.5M")
    expect(formatNumber(2_000_000)).toBe("2.0M")
  })
  it("formate les milliers", () => {
    expect(formatNumber(1_500)).toBe("2k")
    expect(formatNumber(999)).toBe("999")
  })
  it("retourne le nombre tel quel sous 1000", () => {
    expect(formatNumber(0)).toBe("0")
    expect(formatNumber(42)).toBe("42")
  })
})

describe("formatDuration", () => {
  it("formate les minutes seules", () => {
    expect(formatDuration(45)).toBe("45min")
    expect(formatDuration(0)).toBe("0min")
  })
  it("formate les heures avec minutes", () => {
    expect(formatDuration(90)).toBe("1h30")
  })
  it("formate les heures sans minutes restantes", () => {
    expect(formatDuration(120)).toBe("2h")
  })
})

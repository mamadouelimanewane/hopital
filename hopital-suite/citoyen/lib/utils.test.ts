import { describe, it, expect, vi } from "vitest"
import { cn, formatDuree, formatDate } from "./utils"

describe("cn", () => {
  it("fusionne les classes", () => {
    expect(cn("p-4", "m-2")).toBe("p-4 m-2")
  })
  it("résout les conflits Tailwind", () => {
    expect(cn("font-bold", "font-medium")).toBe("font-medium")
  })
})

describe("formatDuree", () => {
  it("retourne Xmin pour moins d'une heure", () => {
    expect(formatDuree(0)).toBe("0min")
    expect(formatDuree(30 * 60)).toBe("30min")
    expect(formatDuree(59 * 60)).toBe("59min")
  })
  it("retourne Xh Ymin pour >= 1 heure", () => {
    expect(formatDuree(3600)).toBe("1h 0min")
    expect(formatDuree(5400)).toBe("1h 30min")
    expect(formatDuree(7200)).toBe("2h 0min")
  })
})

describe("formatDate", () => {
  it("formate une date ISO en français", () => {
    // Fixer la locale pour la cohérence du test
    const result = formatDate("2024-01-15T00:00:00Z")
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
  })
  it("ne plante pas sur une date valide", () => {
    expect(() => formatDate("2024-12-31")).not.toThrow()
  })
})

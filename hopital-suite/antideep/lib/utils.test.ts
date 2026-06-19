import { describe, it, expect } from "vitest"
import { cn, formatNumber, getRiskColor, getRiskLabel } from "./utils"

describe("cn", () => {
  it("fusionne les classes", () => {
    expect(cn("a", "b")).toBe("a b")
  })
  it("résout les conflits Tailwind", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
  })
})

describe("formatNumber", () => {
  it("formate les millions", () => {
    expect(formatNumber(5_000_000)).toBe("5.0M")
  })
  it("formate les milliers", () => {
    expect(formatNumber(2_700)).toBe("3k")
  })
  it("valeurs inférieures à 1000", () => {
    expect(formatNumber(99)).toBe("99")
  })
})

describe("getRiskColor", () => {
  it("retourne rouge pour score >= 80", () => {
    expect(getRiskColor(80)).toBe("#dc2626")
    expect(getRiskColor(100)).toBe("#dc2626")
  })
  it("retourne orange pour score >= 60", () => {
    expect(getRiskColor(60)).toBe("#ea580c")
    expect(getRiskColor(79)).toBe("#ea580c")
  })
  it("retourne ambre pour score >= 40", () => {
    expect(getRiskColor(40)).toBe("#d97706")
    expect(getRiskColor(59)).toBe("#d97706")
  })
  it("retourne vert pour score < 40", () => {
    expect(getRiskColor(0)).toBe("#16a34a")
    expect(getRiskColor(39)).toBe("#16a34a")
  })
})

describe("getRiskLabel", () => {
  it("Critique pour >= 80", () => {
    expect(getRiskLabel(80)).toBe("Critique")
    expect(getRiskLabel(95)).toBe("Critique")
  })
  it("Élevé pour >= 60", () => {
    expect(getRiskLabel(60)).toBe("Élevé")
  })
  it("Modéré pour >= 40", () => {
    expect(getRiskLabel(40)).toBe("Modéré")
  })
  it("Faible pour < 40", () => {
    expect(getRiskLabel(0)).toBe("Faible")
    expect(getRiskLabel(39)).toBe("Faible")
  })
})

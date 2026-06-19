import { describe, it, expect } from "vitest"
import { cn, formatNumber } from "./utils"

describe("cn", () => {
  it("fusionne les classes simples", () => {
    expect(cn("a", "b")).toBe("a b")
  })
  it("résout les conflits Tailwind", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })
  it("ignore les valeurs falsy", () => {
    expect(cn("x", false, undefined)).toBe("x")
  })
})

describe("formatNumber", () => {
  it("retourne M pour les millions", () => {
    expect(formatNumber(1_200_000)).toBe("1.2M")
    expect(formatNumber(10_000_000)).toBe("10.0M")
  })
  it("retourne k pour les milliers", () => {
    expect(formatNumber(3_500)).toBe("4k")
    expect(formatNumber(1_000)).toBe("1k")
  })
  it("retourne la valeur brute sous 1000", () => {
    expect(formatNumber(500)).toBe("500")
    expect(formatNumber(0)).toBe("0")
  })
})

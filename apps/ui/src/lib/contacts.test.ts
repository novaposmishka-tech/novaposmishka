import { describe, expect, it } from "vitest"

import { contactHref } from "./contacts"

describe("contactHref", () => {
  it("strips the spacing the clinic writes its numbers with", () => {
    expect(contactHref("phone", "093 762 05 00")).toBe("tel:0937620500")
  })

  it("keeps a leading plus so international numbers stay dialable", () => {
    expect(contactHref("phone", "+380 67 762 55 00")).toBe("tel:+380677625500")
  })

  it("drops punctuation from a formatted number", () => {
    expect(contactHref("phone", "(067) 762-55-00")).toBe("tel:0677625500")
  })

  it("builds a mailto for an email", () => {
    expect(contactHref("email", "novaposmishka@gmail.com")).toBe(
      "mailto:novaposmishka@gmail.com"
    )
  })

  it("trims an email that was pasted with surrounding space", () => {
    expect(contactHref("email", "  novaposmishka@gmail.com ")).toBe(
      "mailto:novaposmishka@gmail.com"
    )
  })

  it("leaves plain text unlinked", () => {
    // The clinic's address starts with digits, so guessing from the value
    // rather than the kind would turn it into a phone link.
    expect(
      contactHref("text", "вулиця Івана Сльоти, 50а, м. Житомир")
    ).toBeUndefined()
  })

  it("leaves a value unlinked when the kind is missing", () => {
    expect(contactHref(undefined, "093 762 05 00")).toBeUndefined()
    expect(contactHref(null, "093 762 05 00")).toBeUndefined()
  })
})

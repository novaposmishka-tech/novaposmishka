import { describe, expect, it } from "vitest"

import { jsonLdText } from "./json-ld"

/** The JSON escape for "<", as six characters. */
const ESCAPED_LT = String.fromCodePoint(92) + "u003c"

describe("jsonLdText", () => {
  it("escapes text that would close the tag early", () => {
    const text = jsonLdText({ name: "</script><script>alert(1)</script>" })

    expect(text).not.toContain("<")
    expect(text).toContain(`${ESCAPED_LT}/script>`)
  })

  it("reads back as the same object", () => {
    const schema = { name: "a < b", items: ["<x>"] }

    expect(JSON.parse(jsonLdText(schema))).toEqual(schema)
  })
})

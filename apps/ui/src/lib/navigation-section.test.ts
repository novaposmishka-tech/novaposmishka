import type { Data } from "@repo/strapi-types"
import { describe, expect, it } from "vitest"

import { currentLink } from "./navigation-section"

const page = (fullPath: string) =>
  ({ type: "page", page: { fullPath } }) as Data.Component<"utilities.link">

const all = page("/poslugy")
const therapy = page("/poslugy/terapiia")
const surgery = page("/poslugy/khirurhiia")
const rows = [all, therapy, surgery]

describe("currentLink", () => {
  it("lights the direction, not the index, on a direction", () => {
    expect(currentLink(rows, "/poslugy/terapiia")).toBe(therapy)
  })

  it("keeps the direction lit on a procedure under it", () => {
    expect(currentLink(rows, "/poslugy/terapiia/likuvannia-kariiesu")).toBe(
      therapy
    )
  })

  it("lights the index on the index itself", () => {
    expect(currentLink(rows, "/poslugy")).toBe(all)
  })

  it("lights the first of two rows for the same page", () => {
    const twice = page("/poslugy")

    expect(currentLink([all, twice], "/poslugy")).toBe(all)
  })

  it("passes over links that lead off the site", () => {
    const external = {
      type: "external",
      href: "https://example.com",
    } as Data.Component<"utilities.link">

    expect(currentLink([external, therapy], "/poslugy/terapiia")).toBe(therapy)
  })

  it("lights nothing outside the list", () => {
    expect(currentLink(rows, "/likari")).toBeUndefined()
  })
})

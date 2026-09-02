import { describe, expect, it, vi } from "vitest"

// defaults.ts reads routing.defaultLocale; importing the real module pulls in
// next-intl's navigation helpers, which need a Next runtime this suite has not.
vi.mock("@/lib/navigation", () => ({
  routing: { defaultLocale: "uk" },
}))

import {
  getDefaultMetadata,
  getDefaultOgMeta,
  getDefaultTwitterMeta,
} from "./defaults"

/**
 * Stands in for next-intl's translate function: it just looks a key up in a
 * flat catalog, which is all these builders use it for.
 */
const translator = (catalog: Record<string, string>) =>
  ((key: string) => catalog[key] ?? "") as unknown as Parameters<
    typeof getDefaultMetadata
  >[1]

const SITE = "https://example.com"

describe("default metadata", () => {
  it("passes the catalog values through", () => {
    const meta = getDefaultMetadata(
      SITE,
      translator({
        metaTitle: "Нова Посмішка",
        metaDescription: "Стоматологія в Житомирі",
        keywords: "стоматологія",
        metaRobots: "index, follow",
        applicationName: "Нова Посмішка",
      })
    )

    expect(meta.title).toBe("Нова Посмішка")
    expect(meta.robots).toBe("index, follow")
    expect(meta.keywords).toBe("стоматологія")
  })

  it("omits fields the catalog leaves blank", () => {
    // The starter shipped placeholders here; blank now means "no such tag"
    // rather than an empty one in the head.
    const meta = getDefaultMetadata(
      SITE,
      translator({
        metaTitle: "Нова Посмішка",
        metaDescription: "Стоматологія в Житомирі",
        keywords: "",
        metaRobots: " ".repeat(3),
        applicationName: "",
      })
    )

    expect(meta.keywords).toBeUndefined()
    expect(meta.robots).toBeUndefined()
    expect(meta.applicationName).toBeUndefined()
  })

  it("leaves the Open Graph image out when none is set", () => {
    const og = getDefaultOgMeta(
      "uk",
      "/",
      translator({
        "og.siteName": "Нова Посмішка",
        "og.title": "Нова Посмішка",
        "og.description": "Стоматологія в Житомирі",
        "og.image": "",
      })
    )

    expect(og).not.toHaveProperty("images")
    expect(og?.siteName).toBe("Нова Посмішка")
  })

  it("keeps the Open Graph image when one is set", () => {
    const og = getDefaultOgMeta(
      "uk",
      "/",
      translator({
        "og.siteName": "Нова Посмішка",
        "og.image": "/images/og.png",
      })
    )

    expect(og?.images).toEqual(["/images/og.png"])
  })

  it("omits the Twitter account fields the clinic does not have", () => {
    const twitter = getDefaultTwitterMeta(
      translator({
        "twitter.card": "summary_large_image",
        "twitter.title": "Нова Посмішка",
        "twitter.description": "Стоматологія в Житомирі",
        "twitter.siteId": "",
        "twitter.creator": "",
        "twitter.creatorId": "",
        "twitter.imageUrl": "",
      })
    )

    // Next's Twitter type is a union keyed on `card`, so it is read back as a
    // plain record rather than narrowing it in a test.
    const fields = twitter as Record<string, unknown>

    expect(fields.card).toBe("summary_large_image")
    expect(fields.siteId).toBeUndefined()
    expect(fields.creator).toBeUndefined()
    expect(twitter).not.toHaveProperty("images")
  })
})

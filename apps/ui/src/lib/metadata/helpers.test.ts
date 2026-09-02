import { describe, expect, it, vi } from "vitest"

// helpers.ts reads routing.defaultLocale; importing the real module pulls in
// next-intl's navigation helpers, which need a Next runtime this suite has not.
vi.mock("@/lib/navigation", () => ({
  routing: { defaultLocale: "uk" },
}))

import { getMetaAlternates } from "./helpers"

describe("getMetaAlternates", () => {
  it("leaves the default locale unprefixed", () => {
    // Routing uses localePrefix: "as-needed", so "/uk" only ever redirects to
    // "/" — pointing the canonical there would send crawlers through a 307.
    const { canonical } = getMetaAlternates({
      seo: null,
      fullPath: "/",
      locale: "uk",
    })

    expect(canonical).toBe("/")
  })

  it("keeps the page path when the page is not the homepage", () => {
    const { canonical } = getMetaAlternates({
      seo: null,
      fullPath: "/poslugy/implantaciya",
      locale: "uk",
    })

    expect(canonical).toBe("/poslugy/implantaciya")
  })

  it("prefers the SEO component's canonical over the page path", () => {
    const { canonical } = getMetaAlternates({
      seo: {
        canonicalUrl: "/poslugy",
      } as Parameters<typeof getMetaAlternates>[0]["seo"],
      fullPath: "/poslugy/implantaciya",
      locale: "uk",
    })

    expect(canonical).toBe("/poslugy")
  })

  it("prefixes every locale except the default one", () => {
    const { languages } = getMetaAlternates({
      seo: null,
      fullPath: "/poslugy",
      locale: "uk",
      localizations: [{ locale: "en" }, { locale: "uk" }] as Parameters<
        typeof getMetaAlternates
      >[0]["localizations"],
    })

    expect(languages).toMatchObject({
      en: "/en/poslugy",
      uk: "/poslugy",
      "x-default": "/poslugy",
    })
  })
})

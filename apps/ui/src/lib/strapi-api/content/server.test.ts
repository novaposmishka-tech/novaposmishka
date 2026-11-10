import { beforeEach, describe, expect, it, vi } from "vitest"

const { draftModeMock, fetchOneMock, fetchOneByFullPathMock } = vi.hoisted(
  () => ({
    draftModeMock: vi.fn(),
    fetchOneMock: vi.fn(),
    fetchOneByFullPathMock: vi.fn(),
  })
)

vi.mock("server-only", () => ({}))
vi.mock("next/headers", () => ({ draftMode: draftModeMock }))
vi.mock("@/lib/logging", () => ({ logNonBlockingError: vi.fn() }))
vi.mock("@/lib/strapi-api", () => ({
  PublicStrapiClient: {
    fetchOne: fetchOneMock,
    fetchOneByFullPath: fetchOneByFullPathMock,
  },
}))

import { fetchFooter, fetchNavbar, fetchPage } from "./server"

const PAGE_TAG = "strapi:api::page.page"

/** The request options the Strapi client was handed on its last call. */
const lastRequestInit = (mock: ReturnType<typeof vi.fn>) =>
  mock.mock.lastCall?.[3] as RequestInit

beforeEach(() => {
  vi.clearAllMocks()
})

describe("fetchPage", () => {
  it("caches a published page for a day under the page tag", async () => {
    draftModeMock.mockResolvedValue({ isEnabled: false })

    await fetchPage("/about", "uk")

    expect(lastRequestInit(fetchOneByFullPathMock)).toEqual({
      next: { revalidate: 86_400, tags: [PAGE_TAG] },
    })
  })

  it("never caches a draft, whatever the caller passed", async () => {
    draftModeMock.mockResolvedValue({ isEnabled: true })

    await fetchPage("/about", "uk", {
      cache: "force-cache",
      next: { revalidate: 86_400, tags: ["t"] },
    })

    expect(lastRequestInit(fetchOneByFullPathMock)).toEqual({
      cache: "no-store",
    })
  })
})

describe("navbar and footer", () => {
  // Their links point at pages by path, so a renamed page has to clear them.
  it.each([
    ["fetchNavbar", fetchNavbar, "strapi:api::navbar.navbar"],
    ["fetchFooter", fetchFooter, "strapi:api::footer.footer"],
  ])("%s carries its own tag and the page tag", async (_, fetch, ownTag) => {
    await fetch("uk")

    expect(lastRequestInit(fetchOneMock).next?.tags).toEqual([ownTag, PAGE_TAG])
  })
})

describe("a failed Strapi read", () => {
  // Returning nothing would let Next cache a 404, or a page without its menu,
  // for a day. A thrown error leaves the last good copy in place.
  it("is thrown on, not turned into an empty page", async () => {
    draftModeMock.mockResolvedValue({ isEnabled: false })
    fetchOneByFullPathMock.mockRejectedValue(new Error("Strapi is down"))
    fetchOneMock.mockRejectedValue(new Error("Strapi is down"))

    await expect(fetchPage("/about", "uk")).rejects.toThrow("Strapi is down")
    await expect(fetchNavbar("uk")).rejects.toThrow("Strapi is down")
    await expect(fetchFooter("uk")).rejects.toThrow("Strapi is down")
  })

  it("is not what a missing page is: that still comes back empty", async () => {
    draftModeMock.mockResolvedValue({ isEnabled: false })
    fetchOneByFullPathMock.mockResolvedValue({ data: null, meta: {} })

    await expect(fetchPage("/missing", "uk")).resolves.toEqual({
      data: null,
      meta: {},
    })
  })
})

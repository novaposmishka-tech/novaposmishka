import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/env-vars", () => ({ getEnvVar: vi.fn() }))
vi.mock("@/lib/logging", () => ({ logError: vi.fn() }))

import { strapiCacheOptions } from "./base"

describe("strapiCacheOptions", () => {
  it("defaults to a minute when the caller sets neither option", () => {
    expect(strapiCacheOptions(undefined, false)).toEqual({
      cache: undefined,
      next: { revalidate: 60 },
    })
  })

  it("keeps the caller's revalidate and tags", () => {
    expect(
      strapiCacheOptions({ next: { revalidate: 86_400, tags: ["t"] } }, false)
    ).toEqual({ cache: undefined, next: { revalidate: 86_400, tags: ["t"] } })
  })

  it.each(["no-store", "force-cache"] as const)(
    "never sends revalidate beside cache: %s, even the caller's own",
    (cache) => {
      const options = strapiCacheOptions(
        { cache, next: { revalidate: 86_400, tags: ["t"] } },
        false
      )

      expect(options).toEqual({ cache, next: { tags: ["t"] } })
      expect(options.next).not.toHaveProperty("revalidate")
    }
  )

  it("caches nothing in development, whatever the caller asked", () => {
    expect(
      strapiCacheOptions(
        { cache: "force-cache", next: { revalidate: 86_400, tags: ["t"] } },
        true
      )
    ).toEqual({ cache: undefined, next: { revalidate: 0, tags: ["t"] } })
  })
})

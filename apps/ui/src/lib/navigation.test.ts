import { beforeEach, describe, expect, it, vi } from "vitest"

const { getEnvVarMock } = vi.hoisted(() => ({ getEnvVarMock: vi.fn() }))

vi.mock("@/lib/env-vars", () => ({ getEnvVar: getEnvVarMock }))

// The module builds next-intl navigation helpers at import time, which reach
// for next/navigation — not resolvable outside the Next runtime. formatHref
// itself needs none of it.
vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: () => null,
    redirect: () => {},
    usePathname: () => "/",
    useRouter: () => ({}),
  }),
}))

import { formatHref } from "./navigation"

/**
 * `formatHref` used to give every path a leading slash, which turned a bare
 * fragment into a link to the homepage — so "Записатися на прийом" left the
 * page instead of scrolling to the form at the foot of it. Every anchor on the
 * site went through this.
 */
describe("formatHref", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getEnvVarMock.mockReturnValue("http://localhost:3000")
  })

  it("leaves a bare fragment alone so it scrolls the current page", () => {
    expect(formatHref("#lead-form-section")).toBe("#lead-form-section")
  })

  it("still gives a bare path its leading slash", () => {
    expect(formatHref("kontakty")).toBe("/kontakty")
  })

  it("leaves an absolute path as it is", () => {
    expect(formatHref("/kontakty")).toBe("/kontakty")
  })

  it("leaves an external address as it is", () => {
    expect(formatHref("https://example.com/x")).toBe("https://example.com/x")
  })

  it("answers an empty href with a hash rather than an empty link", () => {
    expect(formatHref(undefined)).toBe("#")
    expect(formatHref("")).toBe("#")
  })
})

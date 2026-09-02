import { expect, test } from "@playwright/test"

/**
 * Guards against the most common responsive regression: a section that is wider
 * than the viewport and makes the whole page scroll sideways.
 *
 * The showcase renders every page-builder section at once, so one page covers
 * them all. Only the document's own scroll width is asserted — a marquee or a
 * table is free to overflow inside its own clipping container, which is how the
 * logo row is built.
 */
const WIDTHS = [
  { name: "mobile", width: 375 },
  { name: "tablet", width: 768 },
  { name: "desktop", width: 1440 },
]

test.describe("Layout has no horizontal overflow", () => {
  // The showcase is the heaviest route in the app and the dev server compiles
  // it on demand, with every browser project asking for it at once. The
  // default 30s is not enough for the first worker through the door.
  test.describe.configure({ timeout: 60_000 })

  for (const { name, width } of WIDTHS) {
    test(`showcase fits the viewport at ${name} (${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })

      // Waiting for `load` (the default) means waiting on every subresource the
      // dev server is still compiling, and networkidle never arrives at all —
      // the HMR socket keeps the page busy. Fonts are what the measurement
      // actually depends on: a fallback face has different metrics and can
      // change how wide a row lays out. Images cannot be waited on here — the
      // ones below the fold are lazy and never load at all — but every image
      // component carries explicit width and height, so none of them reflow
      // the page when they eventually arrive.
      await page.goto("/dev/showcase", { waitUntil: "domcontentloaded" })
      await page.evaluate(() => document.fonts.ready)

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))

      // One pixel of slack: sub-pixel rounding can add a fraction at some widths.
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }
})

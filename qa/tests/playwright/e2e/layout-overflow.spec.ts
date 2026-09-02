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
  for (const { name, width } of WIDTHS) {
    test(`showcase fits the viewport at ${name} (${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/dev/showcase")
      await page.waitForLoadState("networkidle")

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))

      // One pixel of slack: sub-pixel rounding can add a fraction at some widths.
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }
})

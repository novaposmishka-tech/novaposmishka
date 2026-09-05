import { expect, test } from "@playwright/test"

/**
 * Guards against the most common responsive regression: a section that is wider
 * than the viewport and makes the whole page scroll sideways.
 *
 * The showcase renders every page-builder section at once, but only with its
 * mocked content. The clinic's real pages are checked too, because the copy is
 * what actually stretches a layout — a long Ukrainian service name or a
 * two-line address behaves differently from the mock.
 *
 * Only the document's own scroll width is asserted — a marquee, a table or a
 * scrolling row is free to overflow inside its own clipping container, which is
 * how the carousels are built.
 */
const WIDTHS = [
  // 360 is the width the design's mobile frames are drawn at.
  { name: "small phone", width: 360 },
  { name: "mobile", width: 375 },
  { name: "tablet", width: 768 },
  { name: "desktop", width: 1440 },
]

const PAGES = [
  { name: "showcase", path: "/dev/showcase" },
  { name: "home", path: "/" },
  { name: "services", path: "/poslugy/terapiia" },
  { name: "team", path: "/likari" },
  { name: "cases", path: "/nashi-roboty" },
  { name: "reviews", path: "/vidhuky" },
  { name: "contacts", path: "/kontakty" },
]

test.describe("Layout has no horizontal overflow", () => {
  for (const { name: pageName, path } of PAGES) {
    for (const { name, width } of WIDTHS) {
      test(`${pageName} fits the viewport at ${name} (${width}px)`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 })

        // Waiting for `load` (the default) means waiting on every subresource
        // the dev server is still compiling, and networkidle never arrives at
        // all — the HMR socket keeps the page busy. Fonts are what the
        // measurement actually depends on: a fallback face has different
        // metrics and can change how wide a row lays out. Images cannot be
        // waited on here — the ones below the fold are lazy and never load at
        // all — but every image component carries explicit width and height, so
        // none of them reflow the page when they eventually arrive.
        await page.goto(path, { waitUntil: "domcontentloaded" })
        await page.evaluate(() => document.fonts.ready)

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))

        // One pixel of slack: sub-pixel rounding can add a fraction at some
        // widths.
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
      })
    }
  }
})

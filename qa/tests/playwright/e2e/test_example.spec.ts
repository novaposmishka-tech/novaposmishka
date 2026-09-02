import { expect, test } from "@playwright/test"

test.describe("Example E2E Test", () => {
  test("Should navigate to the homepage and check title on the page", async ({
    page,
  }) => {
    // The title is in the document head, so there is no reason to wait for
    // the homepage's photographs to finish downloading first.
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveTitle(/.+/)
  })
})

import { expect, test } from "@playwright/test"

/**
 * The CTA block replaces the clinic's pitch with the outcome once the form has
 * been submitted, rather than a toast that is gone before it is read.
 *
 * The success path is driven by a stubbed response: Telegram is not configured
 * in this environment, so a real submission always fails.
 */
test.describe("Lead form outcome", () => {
  test("shows the thank-you when the request is accepted", async ({ page }) => {
    await page.route("**/api/lead", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      })
    )

    await page.goto("/")
    const block = page.locator("#lead-form-section")

    // The button only becomes a submit button once React owns the form.
    const submit = block.locator("button[data-hydrated]")
    await expect(submit).toBeVisible()

    await block.locator("input[name=phone]").fill("0937620500")
    await submit.click()

    await expect(block.getByRole("heading")).toHaveText(
      "Дякуємо, ваш запит надіслано!"
    )
    await expect(block.getByRole("link", { name: /головну/ })).toBeVisible()
    // The form is cleared, so a second person on the same device starts fresh.
    await expect(block.locator("input[name=phone]")).toHaveValue("")
  })

  test("explains the failure and keeps what was typed", async ({ page }) => {
    await page.route("**/api/lead", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "unavailable" }),
      })
    )

    await page.goto("/")
    const block = page.locator("#lead-form-section")

    // The button only becomes a submit button once React owns the form.
    const submit = block.locator("button[data-hydrated]")
    await expect(submit).toBeVisible()

    await block.locator("input[name=phone]").fill("0937620500")
    await submit.click()

    await expect(block.getByRole("heading")).toHaveText("Щось пішло не так!")
    // Nothing was sent, so the number stays for a retry.
    await expect(block.locator("input[name=phone]")).toHaveValue("0937620500")
  })
})

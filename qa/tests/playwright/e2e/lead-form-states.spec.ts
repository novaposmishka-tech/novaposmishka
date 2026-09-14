import { expect, test } from "@playwright/test"

/**
 * The CTA block replaces the clinic's pitch — and the fields with it — once the
 * form has been submitted, rather than a toast that is gone before it is read.
 * The design draws both outcomes that way: a mark, a line saying what happened,
 * and one button under it. What that button does follows the outcome: home
 * after a send that worked, back to the filled-in form after one that did not.
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
    // Nothing is left to fill in: the request is with the clinic.
    await expect(block.locator("input[name=phone]")).toBeHidden()
  })

  test("offers the clinic's numbers when the request fails", async ({
    page,
  }) => {
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
    // The apology tells the reader to call, so the numbers are there to call.
    await expect(block.locator("a[href^='tel:']")).not.toHaveCount(0)

    // Nothing was sent, so another go costs a press rather than a retype.
    const retry = block.getByRole("button", { name: /ще раз/ })
    await expect(retry).toBeVisible()
    await retry.click()
    await expect(block.locator("input[name=phone]")).toHaveValue("0937620500")
  })
})

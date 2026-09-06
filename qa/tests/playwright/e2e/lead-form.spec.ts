import { expect, test } from "@playwright/test"

/**
 * Exercises the lead endpoint against a running server, so unlike the unit
 * tests in apps/UI these go through the real Next.js runtime, the real schema
 * and the real rate limiter.
 *
 * A submission that reaches the end of the handler sends a Telegram message
 * for real once credentials are set, so these tests take care not to. Every
 * case that does not exist to prove delivery fills the honeypot, which the
 * handler answers 200 to and notifies nobody — and which it checks *after* the
 * throttle, so the rate limiter is still exercised.
 *
 * Delivery itself is covered by the unit tests in apps/UI, where fetch is
 * stubbed. The one case here that runs the whole path is deliberately the only
 * one, and the suite is pinned to a single project: none of this touches a
 * browser — it is the request fixture throughout — so running it three times
 * over would only mean three times the messages.
 */

/**
 * The endpoint throttles per IP over a rolling minute, so every request set
 * needs an address nobody else is spending.
 *
 * A shared counter will not do: Playwright runs tests in parallel workers that
 * each import this module afresh, so the counter restarts in every worker and
 * the tests collide. Fixed literals will not do either — the throttle outlives
 * the run, so a second run inside the same minute would inherit the first run's
 * budget. Hence a fresh random address each time.
 */
const freshHeaders = () => ({
  "Content-Type": "application/json",
  // 2001:db8:: is the documentation range; the timestamp and random suffix keep
  // every request set on an address of its own.
  "x-forwarded-for": `2001:db8::${Date.now().toString(16)}:${Math.floor(Math.random() * 0xff_ff).toString(16)}`,
})

test.describe("Lead form endpoint", () => {
  // Server-side behaviour, identical in every engine; see the note above.
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "API-only, and each run of it messages Telegram"
  )

  test("rejects a submission with no usable phone number", async ({
    request,
  }) => {
    const response = await request.post("/api/lead", {
      headers: freshHeaders(),
      data: { phone: "12" },
    })

    expect(response.status()).toBe(400)
  })

  test("rejects a body that is not JSON", async ({ request }) => {
    const response = await request.post("/api/lead", {
      headers: freshHeaders(),
      data: "not-json",
    })

    expect(response.status()).toBe(400)
  })

  test("accepts a bot silently when the honeypot is filled", async ({
    request,
  }) => {
    const response = await request.post("/api/lead", {
      headers: freshHeaders(),
      data: { phone: "+380671234567", company: "bot inc" },
    })

    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
  })

  test("takes a valid submission past validation", async ({ request }) => {
    // The one case that runs to the end of the handler. With credentials set
    // it delivers a message, which every environment but production prefixes
    // with a "тестове повідомлення" banner.
    const response = await request.post("/api/lead", {
      headers: freshHeaders(),
      data: { name: "Іван", phone: "+380671234567" },
    })

    // 200 once Telegram is configured, 503 until then — either way the payload
    // was accepted, which is what this test is about.
    expect([200, 503]).toContain(response.status())
  })

  test("throttles a single IP after five submissions", async ({ request }) => {
    const headers = freshHeaders()
    // Honeypot filled on purpose: the throttle runs before that check, so the
    // limiter is exercised in full while Telegram hears nothing.
    const asBot = { phone: "+380671234567", company: "bot inc" }

    for (let attempt = 0; attempt < 5; attempt++) {
      const allowed = await request.post("/api/lead", {
        headers,
        data: asBot,
      })
      expect(allowed.status()).not.toBe(429)
    }

    const blocked = await request.post("/api/lead", {
      headers,
      data: asBot,
    })

    expect(blocked.status()).toBe(429)
  })
})

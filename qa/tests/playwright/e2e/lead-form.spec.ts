import { expect, test } from "@playwright/test"

/**
 * Exercises the lead endpoint against a running server, so unlike the unit
 * tests in apps/UI these go through the real Next.js runtime, the real schema
 * and the real rate limiter.
 *
 * Telegram credentials are not set in dev, so a valid submission answers 503
 * rather than delivering anything — that is the documented behaviour and it
 * still proves the request got past validation, the honeypot and the throttle.
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

    for (let attempt = 0; attempt < 5; attempt++) {
      const allowed = await request.post("/api/lead", {
        headers,
        data: { phone: "+380671234567" },
      })
      expect(allowed.status()).not.toBe(429)
    }

    const blocked = await request.post("/api/lead", {
      headers,
      data: { phone: "+380671234567" },
    })

    expect(blocked.status()).toBe(429)
  })
})

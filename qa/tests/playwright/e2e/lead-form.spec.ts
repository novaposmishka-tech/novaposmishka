import { expect, test } from "@playwright/test"

/**
 * Exercises the lead endpoint against a running server, so unlike the unit
 * tests in apps/UI these go through the real Next.js runtime, the real schema
 * and the real rate limiter.
 *
 * Nothing here delivers. A submission that reaches the end of the handler
 * writes into the clinic's own chat, and a suite that runs on every change
 * would fill it with requests nobody is meant to answer. So every case fills
 * the honeypot, which the handler answers 200 to and notifies nobody.
 *
 * That costs no coverage, because of the order the handler works in: the
 * throttle, then the schema, then the honeypot, then Telegram. A filled
 * honeypot still runs the limiter and still runs validation in full — a
 * malformed phone is a 400 whether or not the honeypot is set — and only the
 * last step is skipped.
 *
 * Delivery itself is covered by the unit tests in apps/UI, where fetch is
 * stubbed and the message can be read back.
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
    "API-only: the same server answers whatever engine asked"
  )

  test("rejects a submission with no usable phone number", async ({
    request,
  }) => {
    // Honeypot filled, as everywhere here — and it changes nothing, because
    // the schema runs first. A 400 rather than the honeypot's 200 says so.
    const response = await request.post("/api/lead", {
      headers: freshHeaders(),
      data: { phone: "12", company: "bot inc" },
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

  test("takes a well-formed submission past validation", async ({
    request,
  }) => {
    // The honeypot is what stops this at the doorstep of Telegram, and it
    // stops it *after* the schema has had the whole payload — so reaching the
    // honeypot's 200 is itself the proof that name and phone were accepted.
    // The rejection above, sent the same way, is what makes that meaningful:
    // a bad phone never gets this far.
    const response = await request.post("/api/lead", {
      headers: freshHeaders(),
      data: { name: "Іван", phone: "+380671234567", company: "bot inc" },
    })

    expect(response.status()).toBe(200)
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

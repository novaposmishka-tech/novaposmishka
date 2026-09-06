import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { getEnvVar } from "@/lib/env-vars"
import { isProduction } from "@/lib/general-helpers"
import { logError, logger } from "@/lib/logging"

/**
 * Receives a consultation request from the site's lead form and forwards it to
 * Telegram, which is what actually gets a human to call the patient back.
 *
 * Telegram is the whole of it: the clinic answers there, so a lead is not
 * copied into the CMS. That keeps one place to look and no second store to
 * keep in step.
 *
 * The bot token never reaches the browser: the form posts here, and only this
 * route (server-side) talks to Telegram.
 */
const leadSchema = z.object({
  name: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(6).max(30),
  // Honeypot: a real person leaves this empty; bots fill every field. It is
  // accepted by the schema on purpose — rejecting it here would answer 400 and
  // tell the bot which field gave it away.
  company: z.string().max(200).optional(),
})

type Lead = z.infer<typeof leadSchema>

/** Telegram renders HTML — escape anything the user typed. */
const esc = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

/**
 * Everything that is not production (local, preview, staging) is loud about it:
 * the same bot writes into the same chat, and a test lead that looks real is a
 * phone call to someone who never asked for one.
 */
function testBanner(): string[] {
  if (isProduction()) {
    return []
  }

  // APP_ENV is only ever "testing" or "production"; unset means someone is
  // running the site on their own machine, which is worth saying plainly
  // rather than reporting a missing variable at a reader who cannot fix it.
  const where = getEnvVar("APP_ENV") ?? "локальна розробка"

  return [
    "⚠️ <b>ТЕСТОВЕ ПОВІДОМЛЕННЯ</b> — не реагуйте на нього",
    `<i>Середовище: ${esc(where)}</i>`,
    "",
  ]
}

function buildMessage(lead: Lead): string {
  return [
    ...testBanner(),
    "<b>📩 Нова заявка на консультацію</b>",
    "",
    `<b>Ім'я:</b> ${lead.name ? esc(lead.name) : "—"}`,
    `<b>Телефон:</b> ${esc(lead.phone)}`,
  ].join("\n")
}

// A crude per-IP throttle. Enough to stop a form being hammered; it lives in
// process memory, so it resets on deploy and is per-instance — good enough for
// a clinic's lead form, not a substitute for a real rate limiter.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  )

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent)

    return true
  }

  recent.push(now)
  hits.set(ip, recent)

  return false
}

/** A malformed body is a 400, not a crash. */
async function readBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ??
    "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Забагато спроб. Спробуйте за хвилину." },
      { status: 429 }
    )
  }

  const parsed = leadSchema.safeParse(await readBody(request))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Перевірте заповнені поля." },
      { status: 400 }
    )
  }

  // The honeypot was filled — a bot. Answer 200 so it learns nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    logger.error(
      "Telegram is not configured — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID"
    )

    return NextResponse.json(
      { error: "Форма тимчасово недоступна. Зателефонуйте нам, будь ласка." },
      { status: 503 }
    )
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessage(parsed.data),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Telegram responded ${response.status}: ${await response.text()}`
      )
    }
  } catch (error) {
    logError(error, "Failed to deliver a lead to Telegram")

    return NextResponse.json(
      { error: "Не вдалося надіслати. Спробуйте ще раз або зателефонуйте." },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}

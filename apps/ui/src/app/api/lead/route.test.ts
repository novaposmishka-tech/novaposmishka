import { beforeEach, describe, expect, it, vi } from "vitest"

const { getEnvVarMock, isProductionMock, logErrorMock, loggerMock } =
  vi.hoisted(() => ({
    getEnvVarMock: vi.fn(),
    isProductionMock: vi.fn(),
    logErrorMock: vi.fn(),
    loggerMock: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
  }))

vi.mock("@/lib/env-vars", () => ({
  getEnvVar: getEnvVarMock,
}))

vi.mock("@/lib/general-helpers", () => ({
  isProduction: isProductionMock,
}))

vi.mock("@/lib/logging", () => ({
  logError: logErrorMock,
  logger: loggerMock,
}))

import { POST } from "./route"

/**
 * The rate limiter keeps per-IP state in module scope, so every test uses its
 * own IP — otherwise cases leak into each other through the shared Map.
 */
let ipCounter = 0
const nextIp = () => `10.0.0.${++ipCounter}`

const request = (body: unknown, ip = nextIp()) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
  }) as unknown as Parameters<typeof POST>[0]

const TELEGRAM_URL = "https://api.telegram.org/botbot-token/sendMessage"

const telegramCall = (fetchMock: ReturnType<typeof vi.fn>) =>
  fetchMock.mock.calls.find(([url]) => url === TELEGRAM_URL) as
    | [string, RequestInit]
    | undefined

const sentText = (fetchMock: ReturnType<typeof vi.fn>) => {
  const call = telegramCall(fetchMock)

  return JSON.parse(call?.[1].body as string).text as string
}

describe("POST /api/lead", () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", fetchMock)

    process.env.TELEGRAM_BOT_TOKEN = "bot-token"
    process.env.TELEGRAM_CHAT_ID = "chat-id"

    isProductionMock.mockReturnValue(true)
    getEnvVarMock.mockReturnValue("production")
    fetchMock.mockResolvedValue(Response.json({ ok: true }))
  })

  it("rejects a phone number that is too short", async () => {
    const response = await POST(request({ phone: "12" }))

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects a malformed body without throwing", async () => {
    const response = await POST(request("not-json"))

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("answers 200 but stays silent when the honeypot is filled", async () => {
    const response = await POST(
      request({ phone: "+380671234567", company: "bot inc" })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("returns 503 when the Telegram bot is not configured", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN

    const response = await POST(request({ phone: "+380671234567" }))

    expect(response.status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("notifies Telegram with the submitted details", async () => {
    const response = await POST(
      request({ name: "Іван", phone: "+380671234567" })
    )

    expect(response.status).toBe(200)

    const text = sentText(fetchMock)
    expect(text).toContain("Іван")
    expect(text).toContain("+380671234567")
  })

  it("shows a dash instead of the name when none was given", async () => {
    await POST(request({ phone: "+380671234567" }))

    expect(sentText(fetchMock)).toContain("—")
  })

  it("escapes HTML so a typed tag cannot break the Telegram markup", async () => {
    await POST(request({ name: "<b>bold</b>", phone: "+380671234567" }))

    const text = sentText(fetchMock)
    expect(text).toContain("&lt;b&gt;bold&lt;/b&gt;")
    expect(text).not.toContain("<b>bold</b>")
  })

  it("marks the message as a test outside production", async () => {
    isProductionMock.mockReturnValue(false)
    getEnvVarMock.mockReturnValue("local")

    await POST(request({ phone: "+380671234567" }))

    expect(sentText(fetchMock)).toContain("ТЕСТОВЕ ПОВІДОМЛЕННЯ")
  })

  it("returns 502 when Telegram rejects the message", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 400 }))

    const response = await POST(request({ phone: "+380671234567" }))

    expect(response.status).toBe(502)
    expect(logErrorMock).toHaveBeenCalled()
  })

  it("rate limits a single IP after five submissions in the window", async () => {
    const ip = nextIp()

    for (let attempt = 0; attempt < 5; attempt++) {
      const allowed = await POST(request({ phone: "+380671234567" }, ip))
      expect(allowed.status).toBe(200)
    }

    const blocked = await POST(request({ phone: "+380671234567" }, ip))

    expect(blocked.status).toBe(429)
  })
})

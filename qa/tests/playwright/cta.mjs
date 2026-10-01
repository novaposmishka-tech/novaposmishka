import { chromium } from "@playwright/test"
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })).newPage()
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" })
await page.evaluate(() => document.fonts.ready)
await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 2000)); window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 500)) })
const el = page.locator("h3", { hasText: "з чого почати" }).first()
await el.scrollIntoViewIfNeeded()
await page.waitForTimeout(1200)
console.log(await page.evaluate(() => {
  const h = [...document.querySelectorAll("h1,h2,h3,p,div,span")].find((e) => /Не знаєте, з чого почати/.test((e.textContent || "").trim()) && !e.children.length)
  if (!h) return "заголовок не найден"
  const card = h.closest("li")
  const cb = card.getBoundingClientRect()
  const rel = (e, name) => {
    const r = document.createRange(); r.selectNodeContents(e)
    const rect = e.tagName === "IMG" || e.tagName === "A" ? e.getBoundingClientRect() : r.getBoundingClientRect()
    const s = getComputedStyle(e)
    return name.padEnd(12) + "x=" + Math.round(rect.x - cb.x) + " y=" + Math.round(rect.y - cb.y) + " " + Math.round(rect.width) + "x" + Math.round(rect.height) + "  " + s.fontSize + "/" + s.fontWeight
  }
  const out = ["карточка    " + Math.round(cb.width) + "x" + Math.round(cb.height) + "  radius=" + getComputedStyle(card).borderRadius + "  fill=" + getComputedStyle(card).backgroundColor]
  out.push(rel(h, "заголовок"))
  const p = [...card.querySelectorAll("p")].find((e) => /Запишіться/.test(e.textContent || ""))
  if (p) out.push(rel(p, "описание"))
  const a = card.querySelector("a")
  if (a) out.push(rel(a, "кнопка") + "  radius=" + getComputedStyle(a).borderRadius + " border=" + getComputedStyle(a).borderWidth + " " + getComputedStyle(a).borderColor + " стрелка=" + (a.querySelector("svg") ? "есть" : "нет"))
  const img = card.querySelector("img")
  if (img) { const r = img.getBoundingClientRect(); out.push("картинка    x=" + Math.round(r.x - cb.x) + " y=" + Math.round(r.y - cb.y) + " " + Math.round(r.width) + "x" + Math.round(r.height) + "  natural=" + img.naturalWidth + "x" + img.naturalHeight) }
  return out.join("\n")
}))
await browser.close()

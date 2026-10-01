import { chromium } from "@playwright/test"
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" })
await page.evaluate(() => document.fonts.ready)
await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 2000)); window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 500)) })
for (const w of [1024, 1100, 1180, 1280, 1366, 1440, 1600, 1920]) {
  await page.setViewportSize({ width: w, height: 1000 })
  await page.waitForTimeout(400)
  console.log(String(w).padStart(5) + ": " + await page.evaluate(() => {
    const h = [...document.querySelectorAll("*")].find((e) => /^Не знаєте, з чого почати/.test((e.textContent || "").trim()) && !e.children.length)
    if (!h) return "блок не найден"
    const card = h.closest("li")
    const img = card.querySelector("img")
    if (!img || img.getBoundingClientRect().width === 0) return "иллюстрация скрыта"
    const ir = img.getBoundingClientRect(), cb = card.getBoundingClientRect()
    let worst = -1e9, who = ""
    for (const el of [h, ...card.querySelectorAll("p"), ...card.querySelectorAll("a")]) {
      const r = document.createRange(); r.selectNodeContents(el)
      for (const rect of (el.tagName === "A" ? [el.getBoundingClientRect()] : [...r.getClientRects()])) {
        if (rect.width < 2) continue
        if (rect.bottom < ir.top || rect.top > ir.bottom) continue
        const d = rect.right - ir.left
        if (d > worst) { worst = d; who = (el.textContent || "").trim().slice(0, 22) }
      }
    }
    return "карточка " + Math.round(cb.width) + "  картинка с x=" + Math.round(ir.x - cb.x) +
      (worst > 0 ? "   НАХЛЁСТ " + Math.round(worst) + "px  («" + who + "»)" : "   зазор " + Math.round(-worst))
  }))
}
await browser.close()

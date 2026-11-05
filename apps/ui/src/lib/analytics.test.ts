import { describe, expect, it } from "vitest"

import { linkEvent } from "./analytics"

describe("linkEvent", () => {
  it("reports a call with the number dialled", () => {
    expect(linkEvent("tel:0937620500")).toEqual({
      event: "phone_click",
      params: { phone_number: "0937620500" },
    })
  })

  it("reports a step towards the form, wherever the anchor is written", () => {
    expect(linkEvent("#lead-form-section")?.event).toBe("booking_click")
    expect(linkEvent("/#lead-form-section")?.event).toBe("booking_click")
  })

  it("names the messenger a link opens", () => {
    expect(linkEvent("https://t.me/novaposmishka")?.params).toEqual({
      messenger: "telegram",
    })
    expect(linkEvent("https://wa.me/380937620500")?.params).toEqual({
      messenger: "whatsapp",
    })
    expect(linkEvent("viber://chat?number=380937620500")?.params).toEqual({
      messenger: "viber",
    })
    expect(
      linkEvent("https://www.instagram.com/novaposmishka/")?.params
    ).toEqual({ messenger: "instagram" })
  })

  it("reports an email", () => {
    expect(linkEvent("mailto:novaposmishka@gmail.com")?.event).toBe(
      "email_click"
    )
  })

  it("leaves the site's own pages to page views", () => {
    expect(linkEvent("/nashi-roboty")).toBeNull()
    expect(linkEvent("https://novaposmishka.dental/likari")).toBeNull()
  })
})

import { describe, expect, it } from "vitest"

import { clinicSchema, internationalPhone, profileLinks } from "./clinic"

describe("internationalPhone", () => {
  it("writes a local number in the international form", () => {
    expect(internationalPhone("093 762 05 00")).toBe("+380937620500")
    expect(internationalPhone("+38 (067) 762-55-00")).toBe("+380677625500")
  })

  it("leaves a number it does not recognise as it was", () => {
    expect(internationalPhone(" 112 ")).toBe("112")
  })
})

describe("profileLinks", () => {
  it("keeps profiles and drops chat links", () => {
    expect(
      profileLinks([
        "https://www.instagram.com/novaposmishka",
        "https://t.me/+380937620500",
        "https://wa.me/380937620500",
        null,
        "#lead-form-section",
      ])
    ).toEqual(["https://www.instagram.com/novaposmishka"])
  })
})

describe("clinicSchema", () => {
  const schema = clinicSchema({
    baseUrl: "https://novaposmishka.dental/",
    phones: ["093 762 05 00", "067 762 55 00"],
    email: "clinic@example.com",
    description: "Сімейна стоматологія",
    sameAs: [],
  })
  const [clinic, site] = schema["@graph"]

  it("describes the clinic with the site as its publication", () => {
    expect(clinic).toMatchObject({
      "@type": "Dentist",
      "@id": "https://novaposmishka.dental/#clinic",
      telephone: "+380937620500",
      email: "clinic@example.com",
    })
    expect(site).toMatchObject({
      "@type": "WebSite",
      publisher: { "@id": "https://novaposmishka.dental/#clinic" },
    })
  })

  it("leaves out sameAs when there are no profiles", () => {
    expect(clinic).not.toHaveProperty("sameAs")
  })
})

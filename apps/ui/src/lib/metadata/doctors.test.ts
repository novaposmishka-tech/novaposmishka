import { describe, expect, it } from "vitest"

import { doctorsSchema } from "./doctors"

describe("doctorsSchema", () => {
  const schema = doctorsSchema(
    [
      {
        name: "Шевчук Сергій Миколайович",
        specialty: "Ортодонт",
        photoUrl: "https://cdn.example.com/shevchuk.png",
        credentials: [
          { label: "Місце навчання:", value: "НМУ ім. О.О. Богомольця" },
          { label: "Інтернатура:", value: "НМАПО ім. П.Л. Шупика" },
        ],
      },
      { name: "Без фото", specialty: null, credentials: [] },
      { name: "", specialty: "Ортопед" },
    ],
    "https://novaposmishka.dental/"
  )

  it("describes each named dentist as working at the clinic", () => {
    expect(schema?.["@graph"]).toHaveLength(2)
    expect(schema?.["@graph"][0]).toEqual({
      "@type": "Person",
      name: "Шевчук Сергій Миколайович",
      jobTitle: "Ортодонт",
      image: "https://cdn.example.com/shevchuk.png",
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "НМУ ім. О.О. Богомольця",
      },
      worksFor: { "@id": "https://novaposmishka.dental/#clinic" },
    })
  })

  it("leaves out what a dentist has none of", () => {
    expect(schema?.["@graph"][1]).toEqual({
      "@type": "Person",
      name: "Без фото",
      worksFor: { "@id": "https://novaposmishka.dental/#clinic" },
    })
  })

  it("gives nothing for a team without names", () => {
    expect(doctorsSchema([{ name: null }], "https://x.test")).toBeNull()
  })
})

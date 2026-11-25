import { describe, expect, it } from "vitest"

import { faqSchema } from "./faq"

describe("faqSchema", () => {
  it("lists every answered question", () => {
    expect(
      faqSchema([
        { question: "Чи боляче?", answer: "Ні." },
        { question: "Скільки триває?", answer: " 1 година " },
      ])
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Чи боляче?",
          acceptedAnswer: { "@type": "Answer", text: "Ні." },
        },
        {
          "@type": "Question",
          name: "Скільки триває?",
          acceptedAnswer: { "@type": "Answer", text: "1 година" },
        },
      ],
    })
  })

  it("leaves out a question without an answer, and gives nothing for none", () => {
    expect(faqSchema([{ question: "Чи боляче?", answer: "" }])).toBeNull()
  })
})

/**
 * A page's questions and answers as schema.org's FAQPage. Search engines and
 * AI answers read it; Google shows it as a rich result only for well-known
 * health and government sites, so it is no promise of one here. An entry
 * without an answer is left out: a question alone is not an FAQ item.
 */
export function faqSchema(
  items: readonly { question?: string | null; answer?: string | null }[]
) {
  const entries = items.flatMap(({ question, answer }) =>
    question?.trim() && answer?.trim()
      ? [
          {
            "@type": "Question",
            name: question.trim(),
            acceptedAnswer: { "@type": "Answer", text: answer.trim() },
          },
        ]
      : []
  )

  return entries.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entries,
      }
    : null
}

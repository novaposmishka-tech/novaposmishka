/**
 * The filmed reviews, in the order the design puts them.
 *
 * The design shows them twice: as a section of their own on the reviews page,
 * and behind a tab beside the written reviews on the homepage. They live here
 * so the two cannot drift apart.
 *
 * These are stills, not clips — the design has no video files, and `videoUrl`
 * stays empty until the clinic supplies them. A card is a still with a quote
 * until then.
 */

import { image } from "./shared.mjs"

export const videoReviews = [
  "Сам процес пройшов максимально комфортно, безболісно. Лікар коментував кожен свій крок, питав, переживав",
  "Процедура імплантації пройшла дуже комфортно, безболісно, хоча перед цим я дуже сильно хвилювався – але все пройшло на вищому рівні",
  "Це не було боляче, мені сподобалось. Мені не було страшно. Мені сподобались іграшки та картини",
  "З першої хвилини все було на найвищому рівні. Мене зустріли привітні адміністратори. Лікар провів детальний огляд та зрозуміло все пояснив",
].map((quote, index) => ({
  quote: `“${quote}”`,
  poster: image(
    `video-review-${index + 1}`,
    "Пацієнт розповідає про лікування"
  ),
}))

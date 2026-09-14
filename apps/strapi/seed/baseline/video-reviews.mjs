/**
 * The filmed reviews, in the order the design puts them.
 *
 * The design shows them twice: as a section of their own on the reviews page,
 * and behind a tab beside the written reviews on the homepage. They live here
 * so the two cannot drift apart.
 *
 * The clinic has not filmed these yet. Until it does, every card plays the
 * clip from the homepage hero so the button on the still does something —
 * a placeholder, to be replaced one file at a time as the real ones arrive.
 */

import { image, mediaUrl } from "./shared.mjs"

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
  videoUrl: mediaUrl("hero-video"),
}))

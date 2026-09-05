/**
 * The reviews page.
 *
 * The design also gives it a "Відеовідгуки" row — four vertical clips with a
 * quote under each. The clips do not exist yet, so the section is not seeded;
 * the written reviews below it are the same ones the homepage shows.
 */

import { reviews } from "./reviews.mjs"
import { anchor, BUTTON, CLINIC_NAME, GOOGLE_RATING } from "./shared.mjs"

const DESCRIPTION =
  "Довіра пацієнтів — найкраща оцінка нашої роботи. Дякуємо, що обираєте «Нову Посмішку» та ділитеся своїми враженнями"

/** Where "Залишити відгук" and the Google button both go. */
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Нова+Посмішка+Житомир"

export const feedbacksPage = {
  slug: "vidhuky",
  fullPath: "/vidhuky",
  title: "Відгуки наших пацієнтів",
  breadcrumbTitle: "Відгуки",
  seo: {
    metaTitle: "Відгуки пацієнтів — «Нова Посмішка»",
    metaDescription: DESCRIPTION,
    applicationName: CLINIC_NAME,
    metaRobots: "index,follow",
    canonicalUrl: "/vidhuky",
  },
  content: [
    {
      __component: "sections.hero",
      title: "<h1><strong>Відгуки наших пацієнтів</strong></h1>",
      description: `<p>${DESCRIPTION}</p>`,
      links: [
        {
          ...anchor("Залишити відгук", GOOGLE_REVIEWS_URL, BUTTON),
          newTab: true,
        },
      ],
    },
    {
      __component: "sections.statistics",
      figures: [
        { number: GOOGLE_RATING, description: "<p>Рейтинг Google</p>" },
        { number: 210, suffix: "+", description: "<p>Чесних відгуків</p>" },
        {
          number: 20,
          suffix: "К+",
          description: "<p>Пацієнтів, що довіряють нам</p>",
        },
      ],
    },
    {
      __component: "sections.testimonials",
      title: "Google відгуки",
      testimonials: reviews,
      links: [
        { ...anchor("Google", GOOGLE_REVIEWS_URL, BUTTON), newTab: true },
      ],
    },
  ],
}

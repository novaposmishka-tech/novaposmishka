/**
 * The reviews page.
 *
 * The "Відеовідгуки" row carries the four stills the design shows and the
 * quote under each. The clips themselves do not exist yet: `videoUrl` is left
 * empty, and the card stays a still until the clinic supplies one. The written
 * reviews below it are the same ones the homepage shows.
 */

import { reviews } from "./reviews.mjs"
import { anchor, BUTTON, CLINIC_NAME, GOOGLE_RATING } from "./shared.mjs"
import { videoReviews } from "./video-reviews.mjs"

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
      __component: "sections.video-reviews",
      title: "Відеовідгуки",
      reviews: videoReviews,
    },
    {
      __component: "sections.testimonials",
      title: "Google відгуки",
      testimonials: reviews,
      links: [
        { ...anchor("Google", GOOGLE_REVIEWS_URL, BUTTON), newTab: true },
      ],
    },
    {
      __component: "sections.heading-with-cta-button",
      mark: "google",
      title: "Поділіться своїм досвідом.\nЗалиште свій відгук про клініку",
      subText:
        "Це допомагає нам зберігати прозорість та автентичність відгуків, щоб кожен пацієнт міг бути впевнений у їхній достовірності.\nДякуємо за вашу довіру та час!",
      cta: {
        ...anchor("Залишити відгук", GOOGLE_REVIEWS_URL, BUTTON),
        newTab: true,
      },
    },
  ],
}

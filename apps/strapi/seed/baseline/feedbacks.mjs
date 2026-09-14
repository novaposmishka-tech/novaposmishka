/**
 * The reviews page.
 *
 * The "Відеовідгуки" row carries the four stills the design shows and the
 * quote under each. The clips themselves do not exist yet: `videoUrl` is left
 * empty, and the card stays a still until the clinic supplies one. The written
 * reviews below it are the same ones the homepage shows.
 */

import { reviews } from "./reviews.mjs"
import {
  anchor,
  BUTTON,
  BUTTON_ON_DARK,
  CLINIC_NAME,
  GOOGLE_RATING,
  image,
} from "./shared.mjs"
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
      // The frame opens the page on the toys from the children's room, with
      // the heading broken after the first word so it steps in like the
      // homepage's.
      backgroundImage: image(
        "feedbacks-hero",
        "Іграшки на стоматологічній установці в дитячому кабінеті"
      ),
      title: "<h1><strong>Відгуки<br>наших пацієнтів</strong></h1>",
      description: `<p>${DESCRIPTION}</p>`,
      links: [
        {
          ...anchor("Залишити відгук", GOOGLE_REVIEWS_URL, BUTTON_ON_DARK),
          newTab: true,
        },
      ],
      // The frame stands the clinic's numbers on the photograph itself, as
      // glass cards along the foot of the hero, rather than on a band of their
      // own below it.
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
      // No button beside this heading: the frame gives the section the reviews
      // alone, and the invitation to write one of your own is the band below.
      __component: "sections.testimonials",
      title: "Google відгуки",
      testimonials: reviews,
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

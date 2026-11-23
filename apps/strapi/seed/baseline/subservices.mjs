/**
 * The services index (/poslugy) and the sub-service pages under each of the
 * seven directions (/poslugy/terapiia/likuvannia-kariiesu and the rest).
 *
 * Every sub-service page is the same run of sections around its own copy,
 * which lives in ./subservices.data.mjs: the hero, the signs that bring a
 * patient in, the steps of the procedure, the works and the dentists where
 * the clinic has any to show, the questions, the clinic's promises, and a
 * short price table that points back at the direction's full one.
 *
 * The design leaves a frame for a photograph on every symptom and every
 * step. None are seeded: those are an editor's to add, card by card, and a
 * card without one is drawn as the icon and the words. The hero is the one
 * photograph a page cannot do without, so it opens on its direction's.
 */

import { works } from "./cases.mjs"
import { doctors } from "./doctors.mjs"
import { HERO_IMAGES, SERVICE_SLUGS } from "./services.mjs"
import {
  anchor,
  BUTTON,
  BUTTON_ON_DARK,
  CLINIC_NAME,
  doctorRef,
  image,
  pageLink,
  PHONES,
} from "./shared.mjs"
import { SUBSERVICES } from "./subservices.data.mjs"

const LEAD_FORM = "#lead-form-section"

/** A direction's name, by its slug: "terapiia" is "Терапія". */
const DIRECTION_NAME = Object.fromEntries(
  SERVICE_SLUGS.map(({ card, slug }) => [slug, card])
)

/**
 * Who does the work in each direction, by the specialty the team page gives
 * them. Periodontology and gnathology have nobody listed here: the first has
 * no dentist on the team page under that name, and the second's only one is
 * standing in with a colleague's photograph (see doctors.mjs), which must not
 * be shown under his name on yet more pages. Their pages go without the
 * block until the clinic fills it.
 */
const DIRECTION_SPECIALTY = {
  terapiia: "Стоматолог-терапевт",
  ortopediia: "Стоматолог-ортопед",
  khirurhiia: "Стоматолог-хірург",
  ortodontiia: "Ортодонт",
  "dytiacha-stomatolohiia": "Дитячий стоматолог",
}

const ADVANTAGES = {
  __component: "sections.advantages",
  title: "Чому обирають «Нову Посмішку»",
  items: [
    {
      icon: "heart",
      title: "Безболісно",
      text: "Сучасна анестезія та уважне ставлення на кожному етапі.",
    },
    {
      icon: "monitor",
      title: "Цифрова діагностика",
      text: "КТ, сканування та мікроскоп для точного плану лікування.",
    },
    {
      icon: "document",
      title: "Прозорі ціни",
      text: "Вартість фіксуємо в плані лікування до початку.",
    },
    {
      icon: "award",
      title: "Гарантія",
      text: "Надаємо гарантію на роботи та матеріали.",
    },
  ],
}

/**
 * The procedure's examples. The block finds its works by itself — those the
 * Work collection files under this procedure — so it is only placed where
 * there are some: the design's empty "before / after" frames are not seeded.
 */
function worksOf(name) {
  if (works.every((work) => work.subdirection !== name)) {
    return []
  }

  return [
    {
      __component: "sections.results",
      title: "Приклади робіт",
      display: "carousel",
      link: pageLink("Дивитись усі роботи", "nashi-roboty", BUTTON_ON_DARK),
    },
  ]
}

function doctorsOf(direction) {
  const specialty = DIRECTION_SPECIALTY[direction]
  const team = doctors
    .filter((doctor) => specialty && doctor.specialty === specialty)
    .map(({ name }) => doctorRef(name))

  if (team.length === 0) {
    return []
  }

  return [
    {
      __component: "sections.doctors",
      title: "Лікарі, які виконують цю процедуру",
      link: pageLink("Усі лікарі", "likari", BUTTON),
      doctors: team,
    },
  ]
}

function subservicePage({
  name,
  slug,
  direction,
  intro,
  symptoms,
  steps,
  prices,
  faq,
}) {
  const fullPath = `/poslugy/${direction}/${slug}`
  const directionName = DIRECTION_NAME[direction]

  return {
    slug,
    fullPath,
    __parentSlug: direction,
    title: `${name} в Житомирі`,
    breadcrumbTitle: name,
    seo: {
      metaTitle: `${name} в Житомирі — «${CLINIC_NAME}»`,
      metaDescription: intro,
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: fullPath,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name,
        description: intro,
        provider: {
          "@type": "Dentist",
          name: CLINIC_NAME,
          telephone: PHONES[0],
        },
      },
    },
    content: [
      {
        __component: "sections.hero",
        ...HERO_IMAGES[direction],
        title: `<h1>${name}<br><strong>в Житомирі</strong></h1>`,
        description: `<p>${intro}</p>`,
        links: [anchor("Записатися на прийом", LEAD_FORM, BUTTON_ON_DARK)],
        showContacts: true,
      },
      {
        __component: "sections.symptoms",
        title: "Коли варто звернутися до лікаря",
        items: symptoms.map(([title, icon]) => ({ title, icon })),
        callToAction: {
          name: "Впізнали себе? Запишіться на огляд",
          description: "Огляд і план лікування — за 1 візит",
          link: anchor("Записатися на огляд", LEAD_FORM),
        },
      },
      {
        __component: "sections.steps",
        title: "Як проходить процедура",
        steps: steps.map(([title, text]) => ({ title, text })),
      },
      ...worksOf(name),
      ...doctorsOf(direction),
      {
        __component: "sections.faq",
        layout: "cards",
        title: "Часті запитання",
        subTitle:
          "Не знайшли відповіді? Залиште заявку або зателефонуйте — адміністратор підкаже чи з’єднає з лікарем.",
        accordions: faq.map(([question, answer]) => ({ question, answer })),
      },
      ADVANTAGES,
      {
        __component: "sections.price-list",
        title: `Ціни: ${name.toLowerCase()}`,
        groups: [
          {
            title: name,
            rows: prices.map(([label, price]) => ({ label, price })),
          },
        ],
        note: "Точну вартість лікар визначає після огляду.",
        link: pageLink(`Усі ціни розділу «${directionName}»`, direction),
      },
    ],
  }
}

export const subservicePages = SUBSERVICES.map(subservicePage)

/**
 * What the index says of each direction. The words are the design's for this
 * page, a line longer than the homepage's cards; the illustrations are the
 * homepage's own.
 */
const DIRECTIONS = [
  [
    "terapiia",
    "Лікування карієсу та каналів під мікроскопом — щоб зберегти власний зуб, а не замінювати його.",
  ],
  [
    "ortopediia",
    "Коронки, вініри та протези, які відновлюють функцію і виглядають природно.",
  ],
  [
    "khirurhiia",
    "Видалення та імплантація з комп’ютерним плануванням і хірургічними шаблонами.",
  ],
  ["ortodontiia", "Рівні зуби та правильний прикус — для дітей і дорослих."],
  [
    "parodontolohiia",
    "Захворювання ясен — не вирок. Лікуємо та зупиняємо пародонтит.",
  ],
  [
    "dytiacha-stomatolohiia",
    "Перше знайомство зі стоматологом — дружнє, спокійне і без болю.",
  ],
  [
    "hnatolohiia",
    "Позбавляємо болю та дискомфорту в щелепі, відновлюємо її правильну роботу.",
  ],
]

const INDEX_DESCRIPTION =
  "Сучасна стоматологія для всієї родини — від профілактики та лікування карієсу до імплантації й виправлення прикусу. Оберіть напрямок, щоб дізнатися більше та переглянути ціни."

export const servicesIndexPage = {
  slug: "poslugy",
  fullPath: "/poslugy",
  title: "Наші послуги",
  breadcrumbTitle: "Послуги",
  seo: {
    metaTitle: `Послуги — стоматологія «${CLINIC_NAME}» в Житомирі`,
    // Its own sentence: the one on the page runs past the 160 characters a
    // description is allowed.
    metaDescription:
      "Послуги стоматології «Нова Посмішка» в Житомирі: терапія, ортопедія, хірургія, ортодонтія, пародонтологія, дитяча стоматологія та гнатологія.",
    applicationName: CLINIC_NAME,
    metaRobots: "index,follow",
    canonicalUrl: "/poslugy",
  },
  content: [
    {
      __component: "sections.hero",
      title: "<h1>Наші Послуги</h1>",
      description: `<p>${INDEX_DESCRIPTION}</p>`,
    },
    {
      __component: "sections.service-explorer",
      title: "Оберіть напрямок",
      services: DIRECTIONS.map(([direction, description], index) => ({
        name: DIRECTION_NAME[direction],
        description,
        icon: image(`services-${index + 1}`, ""),
        link: pageLink("Детальніше та ціни", direction),
        // Each sub-service, linking to its own page.
        tags: SUBSERVICES.filter((item) => item.direction === direction).map(
          (item) => pageLink(item.name, item.slug)
        ),
      })),
      callToAction: {
        name: "Не знаєте, з чого почати?",
        description:
          "Запишіться на консультацію — лікар визначить, яка допомога вам потрібна.",
        icon: image("services-8", ""),
        link: anchor("Записатися на консультацію", LEAD_FORM, BUTTON),
      },
      urgentTitle: "Терміново болить зуб?",
      urgentDescription: "Зателефонуйте — підберемо найближчий вільний час.",
    },
  ],
}

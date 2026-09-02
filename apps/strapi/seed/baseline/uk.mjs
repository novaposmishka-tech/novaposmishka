/**
 * The Ukrainian baseline content: one homepage, the Navbar and the Footer.
 *
 * The clinic's real copy from the design lives here rather than in a Strapi
 * export, so a fresh database can be brought up without an admin session and
 * the copy stays reviewable in a diff. Everything here is editorial content —
 * once an editor changes it in the admin panel the seed leaves it alone (see
 * scripts/seed-content.mjs).
 *
 * The service pages live in ./services.mjs; the helpers both files share are in
 * ./shared.mjs.
 */

import { cases } from "./cases.mjs"
import { reviews } from "./reviews.mjs"
import { SERVICE_SLUGS } from "./services.mjs"
import {
  ADDRESS,
  anchor,
  BUTTON,
  BUTTON_ON_DARK,
  BUTTON_QUIET,
  EMAIL,
  image,
  OPENING_HOURS,
  pageLink,
  PHONES,
  text,
} from "./shared.mjs"

export { locale } from "./shared.mjs"

export const navbar = {
  navbarItems: [
    // The renderer only links an item when `isCategoryLink` is set; a plain
    // label without sub-items falls back to inert text.
    {
      isCategoryLink: false,
      label: "Послуги",
      categoryItems: SERVICE_SLUGS.map(({ card, slug }) =>
        pageLink(card, slug)
      ),
    },
    { isCategoryLink: true, link: anchor("Про нас", "/#why-us") },
    { isCategoryLink: true, link: anchor("Лікарі", "/#doctors") },
    { isCategoryLink: true, link: anchor("Відгуки", "/#testimonials") },
    { isCategoryLink: true, link: anchor("Контакти", "/#contacts") },
  ],
  primaryButtons: [anchor("Записатися", "/#lead-form-section", BUTTON)],
}

export const footer = {
  description:
    "Приватна сімейна стоматологія в Житомирі. Лікуємо дорослих і дітей — від профілактики до імплантації.",
  contacts: [
    { label: "Адреса", kind: "text", values: [text(ADDRESS)] },
    { label: "Телефон", kind: "phone", values: PHONES.map(text) },
    { label: "Email", kind: "email", values: [text(EMAIL)] },
    { label: "Графік роботи", kind: "text", values: OPENING_HOURS.map(text) },
  ],
  rating: {
    label: "Google",
    score: 4.9,
  },
  leadForm: {
    title: "Маєте запитання? Почнімо з консультації",
    description:
      "Залиште заявку — ми звʼяжемося з вами, відповімо на запитання та підберемо зручний час для консультації.",
  },
  copyRight: "© {YEAR} Нова Посмішка. Усі права захищено.",
}

export const homepage = {
  title: "Нова Посмішка — сімейна стоматологія в Житомирі",
  breadcrumbTitle: "Головна",
  slug: "/",
  fullPath: "/",
  seo: {
    metaTitle: "Нова Посмішка — стоматологія в Житомирі",
    metaDescription:
      "Приватна сімейна стоматологія в Житомирі: імплантація, ортодонтія, протезування та дитяча стоматологія. Запишіться на консультацію.",
    keywords:
      "стоматологія Житомир, імплантація зубів, ортодонтія, протезування, дитяча стоматологія",
    applicationName: "Нова Посмішка",
    metaRobots: "index,follow",
    canonicalUrl: "/",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Dentist",
      name: "Нова Посмішка",
      description:
        "Приватна сімейна стоматологія в Житомирі: імплантація, ортодонтія, протезування та дитяча стоматологія.",
      telephone: PHONES[0],
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "вулиця Івана Сльоти, 50а",
        addressLocality: "Житомир",
        addressCountry: "UA",
      },
      openingHours: ["Mo-Fr 09:00-19:00", "Sa 09:00-15:00"],
    },
  },
  content: [
    {
      __component: "sections.hero",
      backgroundImage: image(
        "hero-1",
        "Лікарка оглядає пацієнтку в кріслі стоматологічної клініки"
      ),
      tag: "<p>Лікування без болю</p>",
      title: "<h1><strong>Ми лікуємо.<br>Ви усміхаєтесь.</strong></h1>",
      description: "<p>Приватна сімейна стоматологія в Житомирі.</p>",
      links: [
        anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
      ],
      images: [image("hero-2", "Кабінет клініки «Нова Посмішка»")],
      serviceTags: [
        text("Ортодонтія"),
        text("Протезування"),
        text("Імплантація"),
        text("Хірургія"),
        text("Терапія"),
        text("Дитяча стоматологія"),
        text("Пародонтологія"),
      ],
    },
    {
      __component: "sections.statistics",
      figures: [
        { number: 10, suffix: "+", description: "<p>Років досвіду</p>" },
        {
          number: 20,
          suffix: "К+",
          description: "<p>Пацієнтів, що довіряють нам</p>",
        },
        { number: 4.8, description: "<p>Рейтинг Google</p>" },
      ],
    },
    {
      __component: "sections.why-us",
      title: "Чому саме ми?",
      reasons: [
        {
          title: "<p><strong>Лікуємо без болю</strong></p>",
          description:
            "<p>Підберемо анестезію так, щоб не боліло. Навіть найскладніші операції в нас за відчуттями «як комарик укусив».</p>",
          image: image("why-us-1", "Маленька пацієнтка на прийомі"),
        },
        {
          title: "<p><strong>Працюємо при відключеннях струму</strong></p>",
          description:
            "<p>В нас є генератор, що дозволяє надавати всі стоматологічні послуги при відсутності струму: від пломбування до імплантації.</p>",
          image: image("why-us-2", "Лікар працює з пацієнткою"),
        },
        {
          title: "<p><strong>Маємо зубний мікроскоп</strong></p>",
          description:
            "<p>Це мінімізує ризик помилок, забезпечує надійне лікування каналів та значно знижує ймовірність повторного запалення.</p>",
          image: image("why-us-3", "Лікування під стоматологічним мікроскопом"),
        },
      ],
    },
    {
      __component: "sections.services",
      title: "Ми допоможемо з будь-якою проблемою",
      services: [
        {
          name: "Терапія",
          description: "Основний скрижаль для здорових та красивих зубів",
          icon: image("services-1", ""),
          link: pageLink("Детальніше", "terapiia", BUTTON_QUIET),
        },
        {
          name: "Ортопедія",
          description: "Ваш шлях до здорових та гарних зубів",
          icon: image("services-2", ""),
          link: pageLink("Детальніше", "ortopediia", BUTTON_QUIET),
        },
        {
          name: "Хірургія",
          description: "Новий рівень турботи про Ваші зуби",
          icon: image("services-3", ""),
          link: pageLink("Детальніше", "khirurhiia", BUTTON_QUIET),
        },
        {
          name: "Ортодонтія",
          description: "Красива та здорова посмішка на кожен день",
          icon: image("services-4", ""),
          link: pageLink("Детальніше", "ortodontiia", BUTTON_QUIET),
        },
        {
          name: "Пародонтологія",
          description: "Ми знаємо, як подбати про здоров'я Ваших зубів та ясен",
          icon: image("services-5", ""),
          link: pageLink("Детальніше", "parodontolohiia", BUTTON_QUIET),
        },
        {
          name: "Дитяча стоматологія",
          description:
            "Створюємо основу для здорових посмішок маленьких пацієнтів",
          icon: image("services-6", ""),
          link: pageLink("Детальніше", "dytiacha-stomatolohiia", BUTTON_QUIET),
        },
        {
          name: "Гнатологія",
          description: "Здоров'я скронево-нижньощелепного суглобу",
          icon: image("services-7", ""),
          link: pageLink("Детальніше", "hnatolohiia", BUTTON_QUIET),
        },
      ],
    },
    {
      __component: "sections.results",
      title: "Наші роботи",
      display: "carousel",
      cases,
      link: pageLink("Дивитись усі роботи", "nashi-roboty", BUTTON_ON_DARK),
    },
    {
      __component: "sections.doctors",
      title: "Команда лікарів",
      doctors: [
        {
          name: "Шевчук Сергій Миколайович",
          specialty: "Ортодонт",
          photo: image("doctors-1", "Шевчук Сергій Миколайович, ортодонт"),
        },
        {
          name: "Єгоренкова Тетяна Вікторівна",
          specialty: "Дитячий стоматолог",
          photo: image(
            "doctors-2",
            "Єгоренкова Тетяна Вікторівна, дитячий стоматолог"
          ),
        },
        {
          name: "Пархомчук Андрій Валентинович",
          specialty: "Стоматолог-ортопед",
          photo: image(
            "doctors-3",
            "Пархомчук Андрій Валентинович, стоматолог-ортопед"
          ),
        },
      ],
    },
    {
      __component: "sections.testimonials",
      title: "Відгуки",
      testimonials: reviews,
      links: [
        {
          ...anchor(
            "Google",
            "https://www.google.com/search?q=Нова+Посмішка+Житомир",
            BUTTON_QUIET
          ),
          newTab: true,
        },
      ],
    },
    {
      __component: "sections.carousel",
      title: "Галерея",
      images: [
        { image: image("gallery-1", "Стоматологічний кабінет клініки") },
        { image: image("gallery-2", "Обладнання клініки") },
        { image: image("gallery-3", "Прийом маленького пацієнта") },
        { image: image("gallery-4", "Робота лікаря з пацієнтом") },
      ],
    },
    {
      __component: "sections.contacts",
      title: "Контакти",
      items: [
        { label: "Адреса", kind: "text", values: [text(ADDRESS)] },
        { label: "Телефон", kind: "phone", values: PHONES.map(text) },
        { label: "Email", kind: "email", values: [text(EMAIL)] },
        {
          label: "Графік роботи",
          kind: "text",
          values: OPENING_HOURS.map(text),
        },
      ],
    },
  ],
}

// `sections.results` is intentionally left out of the homepage: its
// before/after component requires two media entries, and the clinic's case
// photos have not been supplied yet. Add the section through the admin panel
// once they are uploaded.

/**
 * The Ukrainian baseline content: one homepage, the Navbar and the Footer.
 *
 * The clinic's real copy from the design lives here rather than in a Strapi
 * export, so a fresh database can be brought up without an admin session and
 * the copy stays reviewable in a diff. Everything here is editorial content —
 * once an editor changes it in the admin panel the seed leaves it alone (see
 * scripts/seed-content.mjs).
 *
 * Images are deliberately absent: `utilities.basic-image` requires a media
 * entry and the clinic's photos are not in the repository yet. Every section
 * below renders text-only until they are uploaded through the admin panel.
 */

export const locale = "uk"

const PHONES = ["093 762 05 00", "067 762 55 00"]
const EMAIL = "novaposmishka@gmail.com"
const ADDRESS = "вулиця Івана Сльоти, 50а, м. Житомир"
const OPENING_HOURS = ["Пн–Пт: 9:00 – 19:00", "Сб: 9:00 – 15:00"]

const text = (value) => ({ text: value })

/**
 * An in-page anchor, e.g. the CTA that scrolls down to the lead form.
 *
 * `decorations` is not optional in practice: StrapiLink falls back to the
 * "link" variant, which renders a call to action as plain underlined text.
 */
const anchor = (label, href, decorations = null) => ({
  type: "external",
  label,
  href,
  newTab: false,
  decorations,
})

/** The filled brand button the design uses for every "Записатися". */
const BUTTON = { variant: "default", size: "lg", hasIcons: false }

export const navbar = {
  navbarItems: [
    // The renderer only links an item when `isCategoryLink` is set; a plain
    // label without sub-items falls back to inert text.
    { isCategoryLink: true, link: anchor("Послуги", "/#services") },
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
      tag: "<p><strong>Приватна сімейна стоматологія в Житомирі</strong></p>",
      title: "<h1><strong>Ваша посмішка — наша турбота</strong></h1>",
      description:
        "<p>Сучасні методи лікування, досвідчені лікарі та турбота про кожного пацієнта.</p>",
      links: [anchor("Записатися", "#lead-form-section", BUTTON)],
      serviceTags: [
        text("Імплантація"),
        text("Ортодонтія"),
        text("Протезування"),
        text("Дитяча стоматологія"),
      ],
    },
    {
      __component: "sections.services",
      title: "Наші послуги",
      subtitle:
        "Повний цикл стоматологічної допомоги — від профілактики до складного протезування.",
      services: [
        {
          name: "Імплантація",
          description:
            "Відновлення втрачених зубів із гарантією на імплант і коронку.",
        },
        {
          name: "Ортодонтія",
          description: "Брекети та елайнери для дорослих і підлітків.",
        },
        {
          name: "Протезування",
          description: "Коронки, вініри та мости з сучасної кераміки.",
        },
        {
          name: "Терапія",
          description:
            "Лікування карієсу та каналів під мікроскопом, без болю.",
        },
        {
          name: "Дитяча стоматологія",
          description:
            "Лікування без стресу — у комфортній для дитини атмосфері.",
        },
        {
          name: "Професійна гігієна",
          description: "Чистка, полірування та профілактика — двічі на рік.",
        },
      ],
    },
    {
      __component: "sections.why-us",
      title: "Чому обирають саме нас?",
      subtitle:
        "Приватна сімейна стоматологія в Житомирі — з увагою до кожного пацієнта.",
      reasons: [
        {
          title: "<p><strong>Досвідчені лікарі</strong></p>",
          description: "<p>Понад 10 років практики у кожного спеціаліста.</p>",
        },
        {
          title: "<p><strong>Сучасне обладнання</strong></p>",
          description: "<p>Цифрова діагностика та безболісне лікування.</p>",
        },
        {
          title: "<p><strong>Прозорі ціни</strong></p>",
          description: "<p>План лікування та вартість — до початку робіт.</p>",
        },
        {
          title: "<p><strong>Гарантія</strong></p>",
          description: "<p>На всі види робіт, з подальшим супроводом.</p>",
        },
      ],
    },
    {
      __component: "sections.doctors",
      title: "Наші лікарі",
      subtitle:
        "Команда, якій довіряють пацієнти — від профілактики до складної імплантації.",
      doctors: [
        { name: "Олена Ковальчук", specialty: "Терапевт-стоматолог" },
        { name: "Андрій Мельник", specialty: "Хірург-імплантолог" },
        { name: "Ірина Савченко", specialty: "Ортодонт" },
        { name: "Дмитро Бондаренко", specialty: "Дитячий стоматолог" },
      ],
    },
    {
      __component: "sections.testimonials",
      title: "Що кажуть пацієнти",
      testimonials: [
        {
          quote:
            "Вже після першого візиту відчула покращення, а після курсу лікування зник дискомфорт і ясна стали здоровими.",
          authorName: "Марія Т.",
          authorNote: "Лікування ясен",
        },
        {
          quote:
            "Боявся імплантації роками. Тут усе пояснили спокійно і крок за кроком — виявилося зовсім не страшно.",
          authorName: "Сергій П.",
          authorNote: "Імплантація",
        },
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

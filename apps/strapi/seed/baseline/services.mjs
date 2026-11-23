/**
 * The seven service pages, one per card in the homepage's services grid.
 *
 * The copy comes from the Figma file: the hero, and the heading and the
 * paragraph over the list of what the service covers. The list itself is the
 * direction's sub-services, each with the sentence its own page opens on and
 * a link to that page — see ./subservices.data.mjs.
 *
 * The price table each page ends with is the design's own placeholder — see
 * ./prices.mjs, which explains what is wrong with it and why it is here.
 *
 * Each page hangs under the services index (/poslugy, in ./subservices.mjs),
 * which is what puts "Послуги" in its breadcrumb trail, and carries the
 * sub-service pages of its direction under itself.
 */

import { priceList } from "./prices.mjs"
import {
  anchor,
  BUTTON_ON_DARK,
  CLINIC_NAME,
  image,
  PHONES,
} from "./shared.mjs"

/**
 * The photographs each page opens on. The design gives all seven a frame of
 * their own and a different picture in each, chosen for what that speciality
 * actually does, so they are named by the page rather than shared.
 *
 * The wide photograph is the desktop's. A phone's hero is tall, so a phone
 * would see a third of its width; below the desktop breakpoint the hero shows
 * the upright photograph instead, cut to 3:4 with its subject in the middle,
 * which holds from a 390 phone to a 1023 tablet. Between 1024 and 1279 the
 * wide one still loses its edges, and where its subject is not in the middle
 * — the dentist at the right of the children's room, the face at the left of
 * the facebow, the scans on the screen at the left of the surgeon — the hero
 * is told where to hold it.
 */
export const HERO_IMAGES = {
  terapiia: hero("terapiia", {
    alt: "Лікар оглядає зуб пацієнта через стоматологічний мікроскоп",
    phoneAlt: "Лікарка в масці та шапочці лікує зуб пацієнта",
    x: 45,
  }),
  ortopediia: hero("ortopediia", {
    alt: "Лікар у бінокулярах із підсвіткою під час протезування",
    phoneAlt: "Коронка на імпланті в руці лікаря в рукавичці",
  }),
  khirurhiia: hero("khirurhiia", {
    alt: "Лікар вивчає комп'ютерну томографію щелеп на екрані ноутбука",
    phoneAlt: "Двоє хірургів у халатах і масках під час операції",
    x: 25,
    y: 45,
  }),
  ortodontiia: hero("ortodontiia", {
    alt: "Лікар оглядає пацієнтку в кріслі стоматологічної клініки",
    phoneAlt: "Пацієнтка в кріслі розмовляє з лікарем на консультації",
  }),
  parodontolohiia: hero("parodontolohiia", {
    alt: "Лікарка чистить зуби пацієнтці ультразвуковим скейлером",
    phoneAlt: "Лікарка чистить зуби пацієнтці ультразвуковим скейлером",
    x: 62,
  }),
  "dytiacha-stomatolohiia": hero("dytiacha-stomatolohiia", {
    alt: "Лікарка лікує зуби дівчинці в дитячому кабінеті",
    phoneAlt: "Дівчинка усміхається в стоматологічному кріслі",
    x: 80,
    y: 40,
  }),
  hnatolohiia: hero("hnatolohiia", {
    alt: "Лицьова дуга, встановлена на обличчі пацієнта, для запису положення щелепи",
    phoneAlt: "Лікарі вивчають рентгенівський знімок щелепи на екрані",
    x: 30,
    y: 45,
  }),
}

/**
 * A page's two photographs — wide and upright, named by its slug in
 * seed/media — and the point of the wide one to hold on screen, as
 * percentages, for the widths where it is cropped.
 */
function hero(slug, { alt, phoneAlt, x = 50, y = 50 }) {
  return {
    backgroundImage: image(`service-hero-${slug}`, alt),
    backgroundImagePhone: image(`service-hero-phone-${slug}`, phoneAlt),
    backgroundFocusX: x,
    backgroundFocusY: y,
  }
}

/**
 * What a direction covers. The block holds the heading and the paragraph; the
 * procedures beside them are the direction's entries in the Subdirection
 * collection (directions.mjs), each with the sentence its own page begins
 * with and a link through to it.
 */
function subservices(title, description = null) {
  return {
    __component: "sections.subservices",
    title,
    description,
  }
}

/** The card on the homepage each page belongs to, and its path. */
export const SERVICE_SLUGS = [
  { card: "Терапія", slug: "terapiia" },
  { card: "Ортопедія", slug: "ortopediia" },
  { card: "Хірургія", slug: "khirurhiia" },
  { card: "Ортодонтія", slug: "ortodontiia" },
  { card: "Пародонтологія", slug: "parodontolohiia" },
  { card: "Дитяча стоматологія", slug: "dytiacha-stomatolohiia" },
  { card: "Гнатологія", slug: "hnatolohiia" },
]

export const servicePages = [
  {
    slug: "terapiia",
    __parentSlug: "poslugy",
    fullPath: "/poslugy/terapiia",
    title: "Стоматолог-терапевт в Житомирі",
    breadcrumbTitle: "Терапія",
    seo: {
      metaTitle: "Стоматолог-терапевт в Житомирі",
      metaDescription:
        "Наша мета – забезпечити Вас здоровими та естетично гарними зубами, дбаючи про Ваш комфорт та безболісність процедур. Довіртеся нашим фахівцям для досягненн",
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: "/poslugy/terapiia",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: "Терапія",
        description:
          "Наша мета – забезпечити Вас здоровими та естетично гарними зубами, дбаючи про Ваш комфорт та безболісність процедур. Довіртеся нашим фахівцям для досягненн",
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
        ...HERO_IMAGES.terapiia,
        title: "<h1>Стоматолог-терапевт<br><strong>в Житомирі</strong></h1>",
        description:
          "<p>Наша мета – забезпечити Вас здоровими та естетично гарними зубами, дбаючи про Ваш комфорт та безболісність процедур. Довіртеся нашим фахівцям для досягнення найкращих результатів у терапевтичній стоматології.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      subservices(
        "Наша стоматологія пропонує широкий спектр послуг, включаючи:",
        "Наша команда готова надати Вам індивідуальну консультацію та розробити план лікування, який відповідає Вашим потребам та бюджету."
      ),
      priceList("Ціни на терапевтичні послуги"),
    ],
  },
  {
    slug: "ortopediia",
    __parentSlug: "poslugy",
    fullPath: "/poslugy/ortopediia",
    title: "Протезування зубів в Житомирі",
    breadcrumbTitle: "Ортопедія",
    seo: {
      metaTitle: "Протезування зубів в Житомирі",
      metaDescription:
        "Посмішка – це Ваша візитна картка, і ми зробимо все, щоб вона була ідеальною!",
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: "/poslugy/ortopediia",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: "Ортопедія",
        description:
          "Посмішка – це Ваша візитна картка, і ми зробимо все, щоб вона була ідеальною!",
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
        ...HERO_IMAGES.ortopediia,
        title: "<h1>Протезування зубів<br><strong>в Житомирі</strong></h1>",
        description:
          "<p>Посмішка – це Ваша візитна картка, і ми зробимо все, щоб вона була ідеальною!</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      subservices(
        "Чому варто обрати протезування зубів?",
        "Оберіть послуги протезування в нашій клініці та насолоджуйтеся здоровою та привабливою посмішкою щодня!"
      ),
      priceList("Ціни на протезування зубів"),
    ],
  },
  {
    slug: "khirurhiia",
    __parentSlug: "poslugy",
    fullPath: "/poslugy/khirurhiia",
    title: "Стоматолог-хірург в Житомирі",
    breadcrumbTitle: "Хірургія",
    seo: {
      metaTitle: "Стоматолог-хірург в Житомирі",
      metaDescription:
        "Наша клініка пропонує передові методи хірургічної стоматології для Вас і Вашої сім’ї. Ми розуміємо, що зуби – це важлива частина Вашого життя, і ми готові ",
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: "/poslugy/khirurhiia",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: "Хірургія",
        description:
          "Наша клініка пропонує передові методи хірургічної стоматології для Вас і Вашої сім’ї. Ми розуміємо, що зуби – це важлива частина Вашого життя, і ми готові ",
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
        ...HERO_IMAGES.khirurhiia,
        title: "<h1>Стоматолог-хірург<br><strong>в Житомирі</strong></h1>",
        description:
          "<p>Наша клініка пропонує передові методи хірургічної стоматології для Вас і Вашої сім’ї. Ми розуміємо, що зуби – це важлива частина Вашого життя, і ми готові надати Вам найкращі рішення.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      subservices(
        "Наші хірургічні послуги включають:",
        "Запишіться на консультацію до наших хірургів і переконайтеся у високому рівні надання послуг які ми пропонуємо."
      ),
      priceList("Ціни на хірургічні послуги"),
    ],
  },
  {
    slug: "ortodontiia",
    __parentSlug: "poslugy",
    fullPath: "/poslugy/ortodontiia",
    title: "Ортодонт в Житомирі",
    breadcrumbTitle: "Ортодонтія",
    seo: {
      metaTitle: "Ортодонт в Житомирі",
      metaDescription:
        "Ортодонтичне лікування може змінити Вашу посмішку та покращити функцію щелеп. Наші професійні ортодонти допоможуть Вам вибрати найкращий метод для досягнен",
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: "/poslugy/ortodontiia",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: "Ортодонтія",
        description:
          "Ортодонтичне лікування може змінити Вашу посмішку та покращити функцію щелеп. Наші професійні ортодонти допоможуть Вам вибрати найкращий метод для досягнен",
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
        ...HERO_IMAGES.ortodontiia,
        title: "<h1>Ортодонт<br><strong>в Житомирі</strong></h1>",
        description:
          "<p>Ортодонтичне лікування може змінити Вашу посмішку та покращити функцію щелеп. Наші професійні ортодонти допоможуть Вам вибрати найкращий метод для досягнення Ваших цілей.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      subservices(
        "Що Ви повинні знати про ортодонтичне лікування:",
        "Не відкладайте свою мрію про прекрасну посмішку - звертайтеся до нас.​"
      ),
      priceList("Ціни на ортодонтичні послуги"),
    ],
  },
  {
    slug: "parodontolohiia",
    __parentSlug: "poslugy",
    fullPath: "/poslugy/parodontolohiia",
    title: "Пародонтологія в Житомирі",
    breadcrumbTitle: "Пародонтологія",
    seo: {
      metaTitle: "Пародонтологія в Житомирі",
      metaDescription:
        "Захворювання ясен – це не вирок, ваша посмішка знову може стати ідеальною.",
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: "/poslugy/parodontolohiia",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: "Пародонтологія",
        description:
          "Захворювання ясен – це не вирок, ваша посмішка знову може стати ідеальною.",
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
        ...HERO_IMAGES.parodontolohiia,
        title: "<h1>Пародонтологія<br><strong>в Житомирі</strong></h1>",
        description:
          "<p>Захворювання ясен – це не вирок, ваша посмішка знову може стати ідеальною.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      subservices(
        "Своєчасний візит до пародонтолога вкрай важливий:​",
        "У нашій клініці ми пропонуємо сучасні методи лікування та профілактики захворювань ясен, щоб забезпечити вам здорову та гарну посмішку."
      ),
      priceList("Ціни на пародонтологічні послуги"),
    ],
  },
  {
    slug: "dytiacha-stomatolohiia",
    __parentSlug: "poslugy",
    fullPath: "/poslugy/dytiacha-stomatolohiia",
    title: "Дитячий стоматолог в Житомирі",
    breadcrumbTitle: "Дитяча стоматологія",
    seo: {
      metaTitle: "Дитячий стоматолог в Житомирі",
      metaDescription:
        "У нашій клініці ми розуміємо, що здоров’я зубів Вашої дитини – це справа важлива та відповідальна. Наша команда досвідчених дитячих стоматологів пропонує н",
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: "/poslugy/dytiacha-stomatolohiia",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: "Дитяча стоматологія",
        description:
          "У нашій клініці ми розуміємо, що здоров’я зубів Вашої дитини – це справа важлива та відповідальна. Наша команда досвідчених дитячих стоматологів пропонує н",
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
        ...HERO_IMAGES["dytiacha-stomatolohiia"],
        title: "<h1>Дитячий стоматолог<br><strong>в Житомирі</strong></h1>",
        description:
          "<p>У нашій клініці ми розуміємо, що здоров’я зубів Вашої дитини – це справа важлива та відповідальна. Наша команда досвідчених дитячих стоматологів пропонує найкращий догляд для маленьких пацієнтів, роблячи їх перші знайомства зі стоматологією приємними та безболісними.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      subservices(
        "Наша дитяча стоматологія включає в себе:",
        "Допоможемо Вашим дітям вирости зі здоровою посмішкою та переконанням, що відвідування стоматолога - це приємна та важлива частина їхнього дорослого життя"
      ),
      priceList("Ціни на дитячу стоматологію"),
    ],
  },
  {
    slug: "hnatolohiia",
    __parentSlug: "poslugy",
    fullPath: "/poslugy/hnatolohiia",
    title: "Гнатолог в Житомирі",
    breadcrumbTitle: "Гнатологія",
    seo: {
      metaTitle: "Гнатолог в Житомирі",
      metaDescription:
        "Гнатологічне лікування може усунути біль та дискомфорт у щелепі, відновивши її правильну функцію. Наш гнатолог допоможе Вам визначити причину проблеми та п",
      applicationName: CLINIC_NAME,
      metaRobots: "index,follow",
      canonicalUrl: "/poslugy/hnatolohiia",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: "Гнатологія",
        description:
          "Гнатологічне лікування може усунути біль та дискомфорт у щелепі, відновивши її правильну функцію. Наш гнатолог допоможе Вам визначити причину проблеми та п",
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
        ...HERO_IMAGES.hnatolohiia,
        title: "<h1>Гнатолог<br><strong>в Житомирі</strong></h1>",
        description:
          "<p>Гнатологічне лікування може усунути біль та дискомфорт у щелепі, відновивши її правильну функцію. Наш гнатолог допоможе Вам визначити причину проблеми та підібрати оптимальний метод для Вашого одужання.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      subservices("Що Ви повинні знати про гнатологію:"),
      priceList("Ціни на гнатологічні послуги"),
    ],
  },
]

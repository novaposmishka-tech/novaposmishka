/**
 * The seven service pages, one per card in the homepage's services grid.
 *
 * The copy comes from the Figma file: the hero, an accordion of what the
 * service covers, and the paragraph that closes the section.
 *
 * The price tables are deliberately absent. All seven pages in the design
 * carry the same twenty rows, nine of them repeated within the page, so it is
 * a placeholder table rather than the clinic's prices — and invented prices on
 * a dental site are not a defensible default. sections.price-list is built and
 * waiting for the real list.
 */

import {
  anchor,
  BUTTON_ON_DARK,
  CLINIC_NAME,
  image,
  PHONES,
} from "./shared.mjs"

/** The card on the homepage each page belongs to, and its path. */
const HERO_IMAGE = image(
  "hero-1",
  "Лікарка оглядає пацієнтку в кріслі стоматологічної клініки"
)

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
        backgroundImage: HERO_IMAGE,
        title: "<h1><strong>Стоматолог-терапевт в Житомирі</strong></h1>",
        description:
          "<p>Наша мета – забезпечити Вас здоровими та естетично гарними зубами, дбаючи про Ваш комфорт та безболісність процедур. Довіртеся нашим фахівцям для досягнення найкращих результатів у терапевтичній стоматології.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      {
        __component: "sections.faq",
        title: "Наша стоматологія пропонує широкий спектр послуг, включаючи:",
        accordions: [
          {
            question: "Лікування карієсу",
          },
          {
            question: "Ендодонтичне лікування",
            answer:
              "Наші досвідчені лікарі проводять лікування карієсу, використовуючи сучасні методи та матеріали, повністю відновлюючи анатомічний вигляд зуба.",
          },
          {
            question: "Зняття зубних відкладень",
          },
          {
            question: "Заміна пломб",
          },
          {
            question: "Відбілювання зубів",
          },
          {
            question: "Терапія пародонту",
          },
        ],
      },
      {
        __component: "utilities.ck-editor-content",
        content:
          "<p>Наша команда готова надати Вам індивідуальну консультацію та розробити план лікування, який відповідає Вашим потребам та бюджету.</p>",
      },
    ],
  },
  {
    slug: "ortopediia",
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
        backgroundImage: HERO_IMAGE,
        title: "<h1><strong>Протезування зубів в Житомирі</strong></h1>",
        description:
          "<p>Посмішка – це Ваша візитна картка, і ми зробимо все, щоб вона була ідеальною!</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      {
        __component: "sections.faq",
        title: "Чому варто обрати протезування зубів?",
        accordions: [
          {
            question: "Відновлення функціональності",
          },
          {
            question: "Покращення естетики",
            answer:
              "Протези допоможуть Вам досягти ідеального вигляду Вашої усмішки. Коронки, вініри, імплантати – ми маємо всі необхідні методи для створення прекрасних результатів.",
          },
          {
            question: "Здоров’я та комфорт",
          },
          {
            question: "Заміна пломб",
          },
          {
            question: "Відбілювання зубів",
          },
          {
            question: "Терапія пародонту",
          },
        ],
      },
      {
        __component: "utilities.ck-editor-content",
        content:
          "<p>Оберіть послуги протезування в нашій клініці та насолоджуйтеся здоровою та привабливою посмішкою щодня!</p>",
      },
    ],
  },
  {
    slug: "khirurhiia",
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
        backgroundImage: HERO_IMAGE,
        title: "<h1><strong>Стоматолог-хірург в Житомирі</strong></h1>",
        description:
          "<p>Наша клініка пропонує передові методи хірургічної стоматології для Вас і Вашої сім’ї. Ми розуміємо, що зуби – це важлива частина Вашого життя, і ми готові надати Вам найкращі рішення.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      {
        __component: "sections.faq",
        title: "Наші хірургічні послуги включають:",
        accordions: [
          {
            question: "Видалення зубів",
          },
          {
            question: "Імплантація",
            answer:
              "Ми допоможемо Вам відновити втрачені зуби за допомогою сучасних імплантатів. Вони надійні, функціональні і природньо виглядають.",
          },
          {
            question: "Пародонтальна хірургія",
          },
          {
            question: "Хірургічна косметика",
          },
          {
            question: "Відбілювання зубів",
          },
          {
            question: "Терапія пародонту",
          },
        ],
      },
      {
        __component: "utilities.ck-editor-content",
        content:
          "<p>Запишіться на консультацію до наших хірургів і переконайтеся у високому рівні надання послуг які ми пропонуємо.</p>",
      },
    ],
  },
  {
    slug: "ortodontiia",
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
        backgroundImage: HERO_IMAGE,
        title: "<h1><strong>Ортодонт в Житомирі</strong></h1>",
        description:
          "<p>Ортодонтичне лікування може змінити Вашу посмішку та покращити функцію щелеп. Наші професійні ортодонти допоможуть Вам вибрати найкращий метод для досягнення Ваших цілей.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      {
        __component: "sections.faq",
        title: "Що Ви повинні знати про ортодонтичне лікування:",
        accordions: [
          {
            question: "Брекети",
          },
          {
            question: "Елайнери",
            answer:
              "Це сучасний метод, який використовує прозорі полікарбонатні капи для виправлення прикусу. Вони надзвичайно зручні та майже невидимі.",
          },
          {
            question: "Ретейнери",
          },
          {
            question: "Заміна пломб",
          },
          {
            question: "Відбілювання зубів",
          },
          {
            question: "Терапія пародонту",
          },
        ],
      },
      {
        __component: "utilities.ck-editor-content",
        content:
          "<p>Не відкладайте свою мрію про прекрасну посмішку - звертайтеся до нас.​</p>",
      },
    ],
  },
  {
    slug: "parodontolohiia",
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
        backgroundImage: HERO_IMAGE,
        title: "<h1><strong>Пародонтологія в Житомирі</strong></h1>",
        description:
          "<p>Захворювання ясен – це не вирок, ваша посмішка знову може стати ідеальною.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      {
        __component: "sections.faq",
        title: "Своєчасний візит до пародонтолога вкрай важливий:​",
        accordions: [
          {
            question: "Профілактика пародонтиту",
          },
          {
            question: "Пародонтологія",
            answer:
              "Це розділ стоматології, що займається лікуванням та профілактикою захворювань ясен та тканин, що оточують зуби. Шинування зубів використовується для захисту пошкоджених зубів від подальшого пошкодження та сприяє їх швидшому одужанню. Пародонтит є серйозним захворюванням ясен та прилягаючих тканин, що може призвести до втрати зубів, але завдяки сучасним методам діагностики та лікування, його можна ефективно контролювати.",
          },
          {
            question: "Лікування",
          },
          {
            question: "Виправлення прикусу",
          },
          {
            question: "Психологічна підтримка",
          },
          {
            question: "Терапія пародонту",
          },
        ],
      },
      {
        __component: "utilities.ck-editor-content",
        content:
          "<p>У нашій клініці ми пропонуємо сучасні методи лікування та профілактики захворювань ясен, щоб забезпечити вам здорову та гарну посмішку.</p>",
      },
    ],
  },
  {
    slug: "dytiacha-stomatolohiia",
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
        backgroundImage: HERO_IMAGE,
        title: "<h1><strong>Дитячий стоматолог в Житомирі</strong></h1>",
        description:
          "<p>У нашій клініці ми розуміємо, що здоров’я зубів Вашої дитини – це справа важлива та відповідальна. Наша команда досвідчених дитячих стоматологів пропонує найкращий догляд для маленьких пацієнтів, роблячи їх перші знайомства зі стоматологією приємними та безболісними.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      {
        __component: "sections.faq",
        title: "Наша дитяча стоматологія включає в себе:",
        accordions: [
          {
            question: "Проведення дружніх оглядів",
          },
          {
            question: "Запобігання карієсу",
            answer:
              "Ми навчимо Вас та Вашу дитину правильному догляду за зубами та надамо рекомендації з харчування для підтримки здорових зубів.",
          },
          {
            question: "Лікування",
          },
          {
            question: "Виправлення прикусу",
          },
          {
            question: "Психологічна підтримка",
          },
          {
            question: "Терапія пародонту",
          },
        ],
      },
      {
        __component: "utilities.ck-editor-content",
        content:
          "<p>Допоможемо Вашим дітям вирости зі здоровою посмішкою та переконанням, що відвідування стоматолога - це приємна та важлива частина їхнього дорослого життя</p>",
      },
    ],
  },
  {
    slug: "hnatolohiia",
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
        backgroundImage: HERO_IMAGE,
        title: "<h1><strong>Гнатолог в Житомирі</strong></h1>",
        description:
          "<p>Гнатологічне лікування може усунути біль та дискомфорт у щелепі, відновивши її правильну функцію. Наш гнатолог допоможе Вам визначити причину проблеми та підібрати оптимальний метод для Вашого одужання.</p>",
        links: [
          anchor("Записатися на прийом", "#lead-form-section", BUTTON_ON_DARK),
        ],
      },
      {
        __component: "sections.faq",
        title: "Що Ви повинні знати про гнатологію:",
        accordions: [
          {
            question: "Суглобова діагностика",
          },
          {
            question: "Сплінт-терапія",
            answer:
              "Це ефективний метод лікування дисфункції СНЩС за допомогою спеціальних знімних кап (сплінтів або оклюзійних шин). Сплінт допомагає розслабити напружені жувальні м’язи, нормалізувати положення щелепи, захистити зуби від стирання та усунути больові відчуття. Він виготовляється індивідуально для кожного пацієнта на основі даних, отриманих під час діагностики.",
          },
          {
            question: "Лікування",
          },
          {
            question: "Виправлення прикусу",
          },
          {
            question: "Психологічна підтримка",
          },
          {
            question: "Терапія пародонту",
          },
        ],
      },
    ],
  },
]

/**
 * The clinic's dentists.
 *
 * The homepage shows the first few as portraits; /likari lists them all with
 * the training the design records for each.
 *
 * Five have a photograph in the design: three on the team page, and two more
 * that only appear as the small round portraits beside a treatment stage in
 * the case studies.
 *
 * The other three are standing in with a colleague's photograph, on the
 * clinic's instruction, so the page has no holes while the real ones are
 * found. Those three entries are marked below and must be replaced before
 * anyone outside the clinic sees this page: they put one named dentist's face
 * under another named dentist's name.
 */

import { CLINIC_NAME, image } from "./shared.mjs"

const PHOTOS = {
  "Шевчук Сергій Миколайович": "doctors-1",
  "Єгоренкова Тетяна Вікторівна": "doctors-2",
  "Пархомчук Андрій Валентинович": "doctors-3",
  // From the case studies, where each treatment stage names its dentist.
  "Замятін Віталій Олександрович": "doctor-zamiatin",
  "Гончарук Артур Анатолійович": "doctor-honcharuk",

  // PLACEHOLDERS — not these people. Borrowed from the three above so the
  // team page has no gaps. Replace with their own photographs; see TODO.md.
  "Каменчук Михайло Віталійович": "doctors-1",
  "Бучинська Дарина Олександрівна": "doctors-2",
  "Острогляд Євгеній Сергійович": "doctors-3",
}

const withPhoto = (doctor) => {
  // Figma stores some of these names decomposed ("и" plus a combining breve
  // rather than "й"), so they look identical but do not compare equal.
  const file = PHOTOS[doctor.name.normalize("NFC")]

  return file
    ? { ...doctor, photo: image(file, `${doctor.name}, ${doctor.specialty}`) }
    : doctor
}

const ALL = [
  {
    name: "Шевчук Сергій Миколайович",
    specialty: "Ортодонт",
    credentials: [
      { label: "Місце навчання:", value: "м. Київ, НМУ ім. О.О. Богомольця" },
      { label: "Інтернатура:", value: "НМАПО ім П. Л. Шупика" },
      {
        label: "Післядипломна освіта:",
        value: "НМУ ім. О.О. Богомольця – спеціалізація «Ортодонтія»",
      },
    ],
  },
  {
    name: "Єгоренкова Тетяна Вікторівна",
    specialty: "Дитячий стоматолог",
    credentials: [
      {
        label: "Місце навчання:",
        value: "м. Полтава, Українська медична стоматологічна академія",
      },
      {
        label: "Підвищення кваліфікації:",
        value:
          "«Діагностика та лікування інфекційних захворювань слизової оболонки порожнини рота у дітей» в Українській медичній стоматологічній академії",
      },
      {
        label: "Післядипломна освіта:",
        value: "НМУ ім. О.О. Богомольця – спеціалізація «Ортодонтія»",
      },
    ],
  },
  {
    name: "Пархомчук Андрій Валентинович",
    specialty: "Стоматолог-ортопед",
    credentials: [
      {
        label: "Місце навчання:",
        value: "Житомирський базовий медичний коледж",
      },
      {
        label: "Підвищення кваліфікації:",
        value: "КВНЗ “Житомирський медичний інститут”",
      },
      {
        label: "Післядипломна освіта:",
        value: "НМУ ім. О.О. Богомольця – спеціалізація «Ортодонтія»",
      },
    ],
  },
  {
    name: "Каменчук Михайло Віталійович",
    specialty: "Стоматолог-терапевт",
    credentials: [
      {
        label: "Місце навчання:",
        value:
          "Тернопільський державний медичний університет ім І.Я. Горбачевського",
      },
      {
        label: "Інтернатура:",
        value: "Вінницький національний медичний університет ім М.I. Пирогова",
      },
      {
        label: "Післядипломна освіта:",
        value: "НМУ ім. О.О. Богомольця – спеціалізація «Ортодонтія»",
      },
    ],
  },
  {
    name: "Замятін Віталій Олександрович",
    specialty: "Стоматолог-хірург",
    credentials: [
      {
        label: "Місце навчання:",
        value:
          "Вінницький національний медичний університет ім. М. І. Пирогова",
      },
      { label: "Інтернатура:", value: "2018-2020 ВНМУ при ЖОСМО" },
      {
        label: "Післядипломна освіта:",
        value:
          "НМАПО ім. П.Л. Шупика спеціалізація з хірургічної стоматології і ЩЛХ",
      },
    ],
  },
  {
    name: "Бучинська Дарина Олександрівна",
    specialty: "Стоматолог-терапевт",
    credentials: [
      {
        label: "Місце навчання:",
        value:
          "Вінницький національний медичний університет ім. М. І. Пирогова",
      },
      {
        label: "Інтернатура:",
        value:
          "Вінницький національний медичний університет ім. М. І. Пирогова",
      },
      {
        label: "Післядипломна освіта:",
        value:
          "НМАПО ім. П.Л. Шупика спеціалізація з хірургічної стоматології і ЩЛХ",
      },
    ],
  },
  {
    name: "Гончарук Артур Анатолійович",
    specialty: "Стоматолог-ортопед",
    credentials: [
      {
        label: "Місце навчання:",
        value:
          "Тернопільський національний медичний університет імені І.Я Горбачевського",
      },
      {
        label: "Інтернатура:",
        value: "м.Київ, Національний медичний університет імені О.О Богомольця",
      },
      {
        label: "Післядипломна освіта:",
        value:
          "НМАПО ім. П.Л. Шупика спеціалізація з хірургічної стоматології і ЩЛХ",
      },
    ],
  },
  {
    name: "Острогляд Євгеній Сергійович",
    specialty: "Ортодонт-гнатолог",
    credentials: [
      {
        label: "Місце навчання:",
        value:
          "Львівський національний медичний університет імені Данила Галицького",
      },
      {
        label: "Інтернатура:",
        value:
          "Стоматологічний медичний центр Львівського національного медичного університету імені Данила Галицького",
      },
      {
        label: "Післядипломна освіта:",
        value:
          "НМАПО ім. П.Л. Шупика спеціалізація з хірургічної стоматології і ЩЛХ",
      },
    ],
  },
]

export const doctors = ALL.map((doctor) =>
  withPhoto({ ...doctor, name: doctor.name.normalize("NFC") })
)

/** The three the homepage introduces. */
export const featuredDoctors = doctors.slice(0, 3)

export const doctorsPage = {
  slug: "likari",
  fullPath: "/likari",
  title: "Наша команда",
  breadcrumbTitle: "Лікарі",
  seo: {
    metaTitle: "Лікарі — стоматологія «Нова Посмішка»",
    metaDescription:
      "Команда стоматологічної клініки «Нова Посмішка» у Житомирі: ортодонти, хірурги, ортопеди, дитячі та терапевтичні стоматологи.",
    applicationName: CLINIC_NAME,
    metaRobots: "index,follow",
    canonicalUrl: "/likari",
  },
  content: [
    {
      __component: "sections.hero",
      title: "<h1><strong>Наша команда</strong></h1>",
    },
    {
      __component: "sections.doctors",
      doctors,
    },
  ],
}

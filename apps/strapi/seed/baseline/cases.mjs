/**
 * The clinic's works, grouped the way the design tabs them, and the page that
 * lists them all.
 *
 * The same groups feed both places the design shows them: the scroll row on
 * the homepage and the grid on /nashi-roboty. They live here so the two cannot
 * drift apart. Each group is one tab — a direction of treatment — and the
 * works under it stand in the order the clinic's previous site had them,
 * photographs, captions and dentists alike.
 */

import { caseStudies } from "./case-studies.mjs"
import { dentist } from "./dentists.mjs"
import { CLINIC_NAME, image } from "./shared.mjs"

/** One finished piece of work: the pair of photographs and who did it. */
const work = (caption, doctor, file) => ({
  caption,
  before: image(`${file}-before`, "Зуби пацієнта до лікування"),
  after: image(`${file}-after`, "Зуби пацієнта після лікування"),
  ...dentist(doctor),
})

export const groups = [
  {
    title: "Ортодонтія",
    cases: [
      work("Вирівнювання зубів брекетами", "Сергій Шевчук", "work-ortho-1"),
      work("Вирівнювання зубів брекетами", "Сергій Шевчук", "work-ortho-2"),
      work("Вирівнювання зубів брекетами", "Сергій Шевчук", "work-ortho-3"),
    ],
  },
  {
    title: "Дитяча стоматологія",
    cases: [
      work("Зняття зубного нальоту", "Тетяна Єгоренкова", "work-kids-1"),
      work("Зняття зубного нальоту", "Тетяна Єгоренкова", "work-kids-2"),
      work("Зняття зубного нальоту", "Тетяна Єгоренкова", "work-kids-3"),
    ],
  },
  {
    title: "Терапевтична стоматологія",
    cases: [
      work("Реставрація зуба", "Дарина Бучинська", "work-therapy-1"),
      work("Професійна чистка зубів", "Дарина Бучинська", "work-therapy-2"),
      work("Професійна чистка зубів", "Дарина Бучинська", "work-therapy-3"),
      work("Професійна чистка зубів", "Михайло Каменчук", "work-therapy-4"),
      work("Реставрація зуба", "Михайло Каменчук", "work-therapy-5"),
      work("Реставрація зуба", "Михайло Каменчук", "work-therapy-6"),
      work("Реставрація 4 зубів", "Андрій Пархомчук", "work-therapy-7"),
      work("Реставрація зубів", "Андрій Пархомчук", "work-therapy-8"),
    ],
  },
  {
    title: "Хірургія",
    cases: [
      {
        // One photograph, not a pair: the result is an X-ray of the implant
        // in the bone, and there is no "before" of that to set beside it.
        caption: "Результат імплантації",
        before: image(
          "work-surgery-1-xray",
          "Рентгенівський знімок встановленого імпланта"
        ),
        ...dentist("Віталій Замятін"),
      },
      work("Видалення зуба", "Віталій Замятін", "work-surgery-2"),
    ],
  },
  {
    title: "Ортопедія",
    cases: [
      work("Встановлення 6 вінірів", "Андрій Пархомчук", "work-prosthetics-1"),
    ],
  },
]

const DESCRIPTION =
  "Тут ми зібрали результати лікування наших пацієнтів — від невеликих змін до повного перетворення посмішки."

export const casesPage = {
  slug: "nashi-roboty",
  fullPath: "/nashi-roboty",
  title: "Наші роботи",
  breadcrumbTitle: "Наші роботи",
  seo: {
    metaTitle: "Наші роботи — стоматологія «Нова Посмішка»",
    metaDescription: DESCRIPTION,
    applicationName: CLINIC_NAME,
    metaRobots: "index,follow",
    canonicalUrl: "/nashi-roboty",
  },
  content: [
    {
      // The frame sets the page title, the filters and the cards as one block,
      // so the listing carries its own heading rather than a hero above it.
      __component: "sections.results",
      display: "grid",
      title: "Наші Роботи",
      subtitle: DESCRIPTION,
      groups,
    },
    ...caseStudies,
  ],
}

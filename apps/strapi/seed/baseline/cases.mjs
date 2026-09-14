/**
 * The clinic's before/after cases, and the page that lists them all.
 *
 * The same cases feed both places the design shows them: the scroll row on the
 * homepage and the grid on /nashi-roboty. They live here so the two cannot
 * drift apart.
 */

import { caseStudies } from "./case-studies.mjs"
import { CLINIC_NAME, image, text } from "./shared.mjs"

const DOCTOR = "Сергій Шевчук"

const workCase = (caption, before, after, tags) => ({
  caption,
  before: image(before, "Зуби пацієнта до лікування"),
  after: image(after, "Зуби пацієнта після лікування"),
  doctorName: DOCTOR,
  doctorPhoto: image("cases-3", `${DOCTOR}, лікар клініки`),
  tags: tags.map(text),
})

export const cases = [
  workCase("Вирівнювання зубів брекетами", "cases-1", "cases-2", [
    "Ортодонтія",
    "Кейс: Тотальне перевтілення посмішки",
  ]),
  workCase("Імплантація та протезування на імплантах", "cases-4", "cases-5", [
    "Ортопедія",
    "Хірургія",
    "Кейс: Імплантація та протезування на імплантах",
  ]),
  workCase("Лікування карієсу в дитини", "cases-2", "cases-1", [
    "Дитяча стоматологія",
    "Терапевтична стоматологія",
  ]),
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
      cases,
    },
    ...caseStudies,
  ],
}

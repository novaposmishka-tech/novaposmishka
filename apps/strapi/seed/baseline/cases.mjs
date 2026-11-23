/**
 * The clinic's works, and the page that lists them all.
 *
 * Each work is an entry of the Work collection. The results blocks — the
 * scroll row on the homepage, the grid on /nashi-roboty, a procedure's
 * examples — find them there by themselves, one tab per direction. They stand
 * in the order the clinic's previous site had them, photographs, captions and
 * dentists alike.
 */

import { caseStudies } from "./case-studies.mjs"
import { dentist } from "./dentists.mjs"
import { CLINIC_NAME, image } from "./shared.mjs"

/**
 * One finished piece of work: the pair of photographs, who did it, and the
 * direction and procedure it is filed under, as [direction, procedure?]. The
 * names are those of the Direction and Subdirection entries, which are made
 * from the service pages.
 */
const work = (caption, doctor, file, [direction, subdirection]) => ({
  caption,
  before: image(`${file}-before`, "Зуби пацієнта до лікування"),
  after: image(`${file}-after`, "Зуби пацієнта після лікування"),
  ...dentist(doctor),
  direction,
  subdirection,
})

/**
 * The entries of the Work collection, in the order the gallery shows them
 * within a tab. Restorations could be a filling replaced or a cavity treated,
 * and the children's works name no procedure of their direction, so those are
 * left for the clinic to file.
 */
export const works = [
  ...[1, 2, 3].map((n) =>
    work("Вирівнювання зубів брекетами", "Сергій Шевчук", `work-ortho-${n}`, [
      "Ортодонтія",
      "Брекети",
    ])
  ),
  ...[1, 2, 3].map((n) =>
    work("Зняття зубного нальоту", "Тетяна Єгоренкова", `work-kids-${n}`, [
      "Дитяча стоматологія",
    ])
  ),
  work("Реставрація зуба", "Дарина Бучинська", "work-therapy-1", ["Терапія"]),
  ...[
    ["Дарина Бучинська", 2],
    ["Дарина Бучинська", 3],
    ["Михайло Каменчук", 4],
  ].map(([doctor, n]) =>
    work("Професійна чистка зубів", doctor, `work-therapy-${n}`, [
      "Терапія",
      "Зняття зубних відкладень",
    ])
  ),
  work("Реставрація зуба", "Михайло Каменчук", "work-therapy-5", ["Терапія"]),
  work("Реставрація зуба", "Михайло Каменчук", "work-therapy-6", ["Терапія"]),
  work("Реставрація 4 зубів", "Сергій Шевчук", "work-therapy-7", ["Терапія"]),
  work("Реставрація зубів", "Сергій Шевчук", "work-therapy-8", ["Терапія"]),
  {
    // One photograph, not a pair: the result is an X-ray of the implant
    // in the bone, and there is no "before" of that to set beside it.
    caption: "Результат імплантації",
    before: image(
      "work-surgery-1-xray",
      "Рентгенівський знімок встановленого імпланта"
    ),
    ...dentist("Віталій Замятін"),
    direction: "Хірургія",
    subdirection: "Імплантація",
  },
  work("Видалення зуба", "Віталій Замятін", "work-surgery-2", [
    "Хірургія",
    "Видалення зубів",
  ]),
  work("Встановлення 6 вінірів", "Сергій Шевчук", "work-prosthetics-1", [
    "Ортопедія",
    "Вініри",
  ]),
].map((entry, index) => ({ ...entry, order: index + 1 }))

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
    },
    ...caseStudies,
  ],
}

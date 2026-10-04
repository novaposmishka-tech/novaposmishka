/**
 * The dentists a piece of work or a treatment stage is signed by, as the
 * cards name them: first name and surname, with the portrait that goes beside
 * it.
 *
 * The team page (doctors.mjs) carries the full names and the training; this is
 * the shorter form the design puts under a photograph of the work. Portraits
 * are the clinic's own, taken from its previous site.
 */

import { image } from "./shared.mjs"

const PORTRAITS = {
  "Сергій Шевчук": "doctor-shevchuk",
  "Тетяна Єгоренкова": "doctor-yegorenkova",
  "Дарина Бучинська": "doctor-buchynska",
  "Михайло Каменчук": "doctor-kamenchuk",
  "Андрій Пархомчук": "doctor-parkhomchuk",
  "Віталій Замятін": "doctor-zamiatin",
  "Артур Гончарук": "doctor-honcharuk",
}

/** The `doctorName` and `doctorPhoto` fields for one of the dentists above. */
export const dentist = (name) => {
  const file = PORTRAITS[name]

  if (!file) {
    throw new Error(
      `No portrait on file for "${name}"; add one to dentists.mjs.`
    )
  }

  return {
    doctorName: name,
    doctorPhoto: image(file, `${name}, лікар клініки`),
  }
}

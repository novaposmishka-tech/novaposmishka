import type { Data } from "@repo/strapi-types"

type Doctor = Data.ContentType<"api::doctor.doctor">

/**
 * How a piece of work or a treatment stage is signed: the dentist's shorter
 * name with their small round portrait beside it, and under the name what
 * they practise ("Лікар-хірург"), so a reader knows whose field the work is.
 *
 * All are kept on the doctor once. The short form ("Сергій Шевчук"), the
 * round portrait and the specialty are optional; the full name and the team
 * photograph stand in for the first two, and a missing specialty is left out.
 */
export function doctorSignature(
  doctor:
    | (Pick<Doctor, "name" | "shortName" | "avatar" | "photo"> & {
        specialty?: string | null
      })
    | null
    | undefined
) {
  if (!doctor?.name) {
    return null
  }

  return {
    name: doctor.shortName?.trim() || doctor.name,
    specialty: doctor.specialty?.trim() || null,
    portrait: doctor.avatar ?? doctor.photo ?? null,
  }
}

import type { Data } from "@repo/strapi-types"

type Doctor = Data.ContentType<"api::doctor.doctor">

/**
 * How a piece of work or a treatment stage is signed: the dentist's shorter
 * name with their small round portrait beside it.
 *
 * Both are kept on the doctor once. The short form ("Сергій Шевчук") and the
 * round portrait are optional, and the full name and the team photograph stand
 * in for whichever an editor has not filled in.
 */
export function doctorSignature(
  doctor:
    | Pick<Doctor, "name" | "shortName" | "avatar" | "photo">
    | null
    | undefined
) {
  if (!doctor?.name) {
    return null
  }

  return {
    name: doctor.shortName?.trim() || doctor.name,
    portrait: doctor.avatar ?? doctor.photo ?? null,
  }
}

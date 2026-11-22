/**
 * The dentist a piece of work or a treatment stage is signed by, named as the
 * cards name them: first name and surname.
 *
 * The doctor themselves — full name, both portraits, training — is kept once
 * in the Doctor collection (doctors.mjs); this only points at them.
 */

import { doctors } from "./doctors.mjs"
import { doctorRef } from "./shared.mjs"

/** The `doctor` relation for one of the dentists in doctors.mjs. */
export const dentist = (shortName) => {
  const doctor = doctors.find((entry) => entry.shortName === shortName)

  if (!doctor) {
    throw new Error(
      `No doctor signs as "${shortName}"; add them to doctors.mjs.`
    )
  }

  return { doctor: doctorRef(doctor.name) }
}

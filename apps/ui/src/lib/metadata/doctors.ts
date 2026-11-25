/**
 * The clinic's dentists as schema.org people: who they are, what they do,
 * where they trained, and that they work at the clinic described on every
 * page (lib/metadata/clinic.ts). A dentist is a Person here, not a Physician —
 * schema.org's Physician is a practice, an organisation, not the doctor.
 */

type Doctor = {
  name?: string | null
  specialty?: string | null
  photoUrl?: string | null
  credentials?: readonly { label?: string | null; value?: string | null }[]
}

/** The credential that names where a dentist studied, as the team page labels it. */
const STUDIED_AT = /^місце навчання/i

export function doctorsSchema(doctors: readonly Doctor[], baseUrl: string) {
  const url = baseUrl.replace(/\/$/, "")
  const people = doctors.flatMap((doctor) => {
    if (!doctor.name) {
      return []
    }

    const school = doctor.credentials?.find((credential) =>
      STUDIED_AT.test(credential.label?.trim() ?? "")
    )?.value

    return [
      {
        "@type": "Person",
        name: doctor.name,
        ...(doctor.specialty && { jobTitle: doctor.specialty }),
        ...(doctor.photoUrl && { image: doctor.photoUrl }),
        ...(school && {
          alumniOf: { "@type": "EducationalOrganization", name: school },
        }),
        worksFor: { "@id": `${url}/#clinic` },
      },
    ]
  })

  return people.length > 0
    ? { "@context": "https://schema.org", "@graph": people }
    : null
}

import type { PopulateOverrideEntries } from "@notum-cz/strapi-plugin-smart-populate/types"
import type { Modules, UID } from "@strapi/strapi"

type ComponentPopulateMap = {
  [TComponentUID in UID.Component]: Required<
    Modules.Documents.Params.Pick<TComponentUID, "populate:object">
  >["populate"]
}

// Relations are populated one level deep by default, which would bring a
// doctor without the images and training they are rendered with.
const DOCTOR_IMAGE = { populate: { media: true } }

/** A doctor as a treatment stage is signed with them. */
const doctorSignature = {
  fields: ["name", "shortName", "specialty"],
  populate: { photo: DOCTOR_IMAGE, avatar: DOCTOR_IMAGE },
} satisfies ComponentPopulateMap["shared.case-stage"]["doctor"]

const populateOverrides = [
  {
    componentUid: "utilities.link",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      page: {
        fields: ["fullPath"],
      },
    },
  },
  {
    componentUid: "sections.doctors",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      doctors: {
        fields: ["name", "specialty"],
        populate: { photo: DOCTOR_IMAGE, credentials: true },
      },
    },
  },
  {
    // The set is a relation, populated one level deep by default — without
    // the cards it holds.
    componentUid: "sections.advantages",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      set: { fields: ["name", "title"], populate: { items: true } },
    },
  },
  {
    componentUid: "shared.case-stage",
    mergeWithGeneratedPopulate: true,
    overridePopulate: { doctor: doctorSignature },
  },
] satisfies PopulateOverrideEntries<ComponentPopulateMap>

export function smartPopulateConfig() {
  return {
    enabled: true,
    config: {
      populateOverrides,
    },
  }
}

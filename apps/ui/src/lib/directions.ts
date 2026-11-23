import type { Data } from "@repo/strapi-types"

type Image = Data.Component<"utilities.basic-image">
type PageLink = null | { documentId: string; fullPath?: string | null }

/** A procedure as the directions' lists and the works gallery read it. */
export type ProcedureEntry = {
  documentId: string
  name: string
  description?: string | null
  image?: Image | null
  page?: PageLink
}

/** A direction as the cards and the works gallery read it. */
export type DirectionEntry = {
  documentId: string
  name: string
  summary?: string | null
  description?: string | null
  icon?: Image | null
  illustration?: Image | null
  page?: PageLink
  subdirections?: ProcedureEntry[] | null
}

/** Where a direction or a procedure leads: its page, where it has one. */
export function pageHref(entry: { page?: PageLink }) {
  return entry.page?.fullPath ?? undefined
}

/** The direction whose own page this is, if it is one. */
export function directionOfPage(
  directions: readonly DirectionEntry[],
  pageDocumentId: string | undefined
) {
  return pageDocumentId
    ? directions.find((entry) => entry.page?.documentId === pageDocumentId)
    : undefined
}

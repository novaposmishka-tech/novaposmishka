import type { Data } from "@repo/strapi-types"

type Work = Data.ContentType<"api::work.work">
type Direction = Data.ContentType<"api::direction.direction">

/** One piece of work as a card shows it. */
export type CaseItem = Pick<Work, "id" | "caption" | "before" | "after"> & {
  readonly doctor?: Work["doctor"] | null
  readonly direction?: Pick<Direction, "documentId"> | null
  readonly subdirection?: null | { documentId: string }
}

/** One tab of the works gallery: its name and the works under it. */
export type CaseGroup = {
  readonly id: string
  readonly title: string
  readonly cases: CaseItem[]
}

type Procedure = {
  documentId: string
  name: string
  page?: null | { documentId: string }
}

export type DirectionEntry = {
  documentId: string
  name: string
  page?: null | { documentId: string }
  subdirections?: Procedure[] | null
}

/**
 * The tabs a results block shows on the page it stands on.
 *
 * On a procedure's page that is the procedure's own works under its name, on
 * a direction's page the direction's, and anywhere else every direction that
 * has works, in the directions' order. The works come in their own order.
 * A work filed under a procedure but not a direction counts under the
 * procedure's direction.
 */
export function galleryGroups(
  pageDocumentId: string | undefined,
  directions: readonly DirectionEntry[],
  works: readonly CaseItem[]
): CaseGroup[] {
  const directionOfProcedure = new Map<string, string>()
  for (const direction of directions) {
    for (const procedure of direction.subdirections ?? []) {
      directionOfProcedure.set(procedure.documentId, direction.documentId)
    }
  }
  const directionOf = (work: CaseItem) =>
    work.direction?.documentId ??
    directionOfProcedure.get(work.subdirection?.documentId ?? "")

  const procedure =
    pageDocumentId &&
    directions
      .flatMap((direction) => direction.subdirections ?? [])
      .find((entry) => entry.page?.documentId === pageDocumentId)

  if (procedure) {
    return tab(
      procedure,
      works.filter(
        (work) => work.subdirection?.documentId === procedure.documentId
      )
    )
  }

  const direction =
    pageDocumentId &&
    directions.find((entry) => entry.page?.documentId === pageDocumentId)

  if (direction) {
    return tab(
      direction,
      works.filter((work) => directionOf(work) === direction.documentId)
    )
  }

  return directions.flatMap((entry) =>
    tab(
      entry,
      works.filter((work) => directionOf(work) === entry.documentId)
    )
  )
}

/** A tab, unless it would have nothing under it. */
function tab(
  owner: { documentId: string; name: string },
  cases: CaseItem[]
): CaseGroup[] {
  return cases.length > 0
    ? [{ id: owner.documentId, title: owner.name, cases }]
    : []
}

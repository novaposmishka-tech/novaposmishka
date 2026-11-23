import { describe, expect, it } from "vitest"

import type { DirectionEntry } from "./directions"
import { type CaseItem, galleryGroups } from "./works"

const directions: DirectionEntry[] = [
  {
    documentId: "therapy",
    name: "Терапія",
    page: { documentId: "therapy-page" },
    subdirections: [
      {
        documentId: "cleaning",
        name: "Зняття зубних відкладень",
        page: { documentId: "cleaning-page" },
      },
      {
        documentId: "caries",
        name: "Лікування карієсу",
        page: { documentId: "caries-page" },
      },
    ],
  },
  {
    documentId: "ortho",
    name: "Ортодонтія",
    page: { documentId: "ortho-page" },
    subdirections: [],
  },
  { documentId: "kids", name: "Дитяча стоматологія", subdirections: [] },
]

const work = (
  id: number,
  direction?: string,
  subdirection?: string
): CaseItem => ({
  id,
  caption: `Робота ${id}`,
  before: null as unknown as CaseItem["before"],
  after: null,
  direction: direction ? { documentId: direction } : null,
  subdirection: subdirection ? { documentId: subdirection } : null,
})

const works = [
  work(1, "ortho"),
  work(2, "therapy", "cleaning"),
  work(3, "therapy"),
  // Filed under a procedure only: counts under the procedure's direction.
  work(4, undefined, "cleaning"),
]

const ids = (groups: ReturnType<typeof galleryGroups>) =>
  groups.map((group) => [group.title, group.cases.map((item) => item.id)])

describe("galleryGroups", () => {
  it("tabs every direction with works, in the directions' order", () => {
    expect(ids(galleryGroups("home", directions, works))).toEqual([
      ["Терапія", [2, 3, 4]],
      ["Ортодонтія", [1]],
    ])
  })

  it("shows a procedure's own works on its page", () => {
    expect(ids(galleryGroups("cleaning-page", directions, works))).toEqual([
      ["Зняття зубних відкладень", [2, 4]],
    ])
  })

  it("shows nothing on a procedure's page that has no works", () => {
    expect(galleryGroups("caries-page", directions, works)).toEqual([])
  })

  it("shows a direction's works on its page", () => {
    expect(ids(galleryGroups("ortho-page", directions, works))).toEqual([
      ["Ортодонтія", [1]],
    ])
  })
})

import type { Core } from "@strapi/strapi"

import { logError, logger } from "../utils/logging"

/**
 * The second half of moving the works into their own collection; the first is
 * database/migrations/2026.11.23T00.00.00.snapshot-works.js, which copied
 * every piece of work, and where it stood, before Strapi dropped the old
 * components.
 *
 * The same work stood in several places — the homepage, /nashi-roboty, a
 * procedure's page — so the copies are told apart by their photographs and
 * each becomes one Work. Its direction is the gallery tab it stood under; its
 * procedure is the page of a procedure it stood on, or what its caption
 * plainly names. Where neither settles it, the work keeps its direction and
 * is left without a procedure for an editor to choose, and the log lists it.
 *
 * It runs at every start and does nothing once the copy is gone. Each work
 * made is marked on the copy, so a start cut short picks up where it stopped.
 */

const SNAPSHOT = "work_migration_snapshot"
const WORK = "api::work.work"
const DIRECTION = "api::direction.direction"
const DOCTOR = "api::doctor.doctor"
const BASIC_IMAGE = "utilities.basic-image"

/** Gallery tabs named otherwise than the direction they stand for. */
const TAB_DIRECTIONS = new Map([["терапевтична стоматологія", "терапія"]])

/**
 * Captions that name their procedure. Only a procedure of the work's own
 * direction is taken, so "імплант" finds Імплантація under Хірургія and not
 * the prosthetics on implants under Ортопедія.
 */
const CAPTION_PROCEDURES: [string, string][] = [
  ["брекет", "брекети"],
  ["чистка", "зняття зубних відкладень"],
  ["імплантац", "імплантація"],
  ["видалення зуб", "видалення зубів"],
  ["вінір", "вініри"],
]

type SnapshotRow = {
  id: number
  page_document_id: string | null
  page_published: boolean
  group_title: string | null
  group_ord: number | null
  case_ord: number | null
  caption: string | null
  before_image_id: number | null
  before_file_id: number | null
  before_alt: string | null
  after_image_id: number | null
  after_file_id: number | null
  after_alt: string | null
  doctor_id: number | null
  work_document_id: string | null
}

type Procedure = { documentId: string; name: string; page?: string }

type Direction = {
  documentId: string
  name: string
  page?: string
  procedures: Procedure[]
}

/** A query builder: the connection itself or a transaction on it. */
type Knex = Core.Strapi["db"]["connection"]

export async function migrateWorks(strapi: Core.Strapi) {
  if (!(await strapi.db.getSchemaConnection().hasTable(SNAPSHOT))) {
    return
  }

  const knex = strapi.db.connection
  // Strapi's own queries name its schema (DATABASE_SCHEMA) on every call; a
  // bare query here would go to the connection's default instead.
  const schema = strapi.db.getSchemaName()
  const inSchema = (query: Knex, table: string) =>
    schema ? query(table).withSchema(schema) : query(table)

  try {
    const rows: SnapshotRow[] = await inSchema(knex, SNAPSHOT).orderBy("id")
    const directions = await loadDirections(strapi)
    const doctors = new Map(
      (
        await strapi.db.query(DOCTOR).findMany({ select: ["id", "documentId"] })
      ).map((doctor) => [doctor.id as number, doctor.documentId as string])
    )
    const works = collectWorks(rows, directions)
    const files = await fileNames(
      strapi,
      works.map((work) => work.rows[0].before_file_id!)
    )
    const unsorted: string[] = []

    for (const [index, work] of works.entries()) {
      const first = work.rows[0]

      if (!work.direction || !work.procedure) {
        unsorted.push(
          `${work.direction?.name ?? "—"}: ${work.caption ?? "без підпису"} (${files.get(first.before_file_id!) ?? first.before_file_id})`
        )
      }

      if (work.rows.some((row) => row.work_document_id)) {
        continue
      }

      const created = await strapi.documents(WORK).create({
        data: {
          caption: work.caption ?? undefined,
          before: {
            media: first.before_file_id!,
            alt: first.before_alt ?? undefined,
          },
          after: first.after_file_id
            ? { media: first.after_file_id, alt: first.after_alt ?? undefined }
            : undefined,
          doctor: doctorOf(work.rows, doctors),
          direction: work.direction?.documentId,
          subdirection: work.procedure?.documentId,
          order: index + 1,
        } as never,
      })

      await inSchema(knex, SNAPSHOT)
        .whereIn(
          "id",
          work.rows.map((row) => row.id)
        )
        .update({ work_document_id: created.documentId })
    }

    await knex.transaction(async (trx) => {
      const table = (name: string) => inSchema(trx, name)

      // The tabs and the image components under the old works are left with
      // nothing pointing at them once Strapi has dropped their tables.
      await table("components_sections_results_cmps")
        .where({ component_type: "shared.case-group" })
        .delete()

      const images = rows.flatMap((row) =>
        [row.before_image_id, row.after_image_id].filter(
          (id): id is number => id != null
        )
      )

      for (let start = 0; start < images.length; start += 200) {
        const chunk = images.slice(start, start + 200)

        await table("files_related_mph")
          .where({ related_type: BASIC_IMAGE })
          .whereIn("related_id", chunk)
          .delete()
        await table("components_utilities_basic_images")
          .whereIn("id", chunk)
          .delete()
      }

      await strapi.db.getSchemaConnection(trx).dropTable(SNAPSHOT)
    })

    logger.info("Works moved into their own collection", {
      works: works.length,
      placements: rows.length,
    })

    if (unsorted.length > 0) {
      logger.warn("Works left for an editor to give a procedure", {
        works: unsorted,
      })
    }
  } catch (error) {
    // The copy stays, so the next start tries again; until then the blocks
    // show whatever works have been made so far.
    logError(error, "Moving works into their own collection failed")
  }
}

type Work = {
  rows: SnapshotRow[]
  caption: string | null
  direction?: Direction
  procedure?: Procedure
}

/**
 * One work per pair of photographs, in the order the gallery showed them:
 * published copies before drafts, the gallery's tabs before a procedure's
 * page, then tab by tab and work by work.
 */
function collectWorks(rows: SnapshotRow[], directions: Direction[]) {
  const onServicePage = (row: SnapshotRow) =>
    directions.some(
      (direction) =>
        direction.page === row.page_document_id ||
        direction.procedures.some(
          (procedure) => procedure.page === row.page_document_id
        )
    )
  const sorted = rows
    .filter((row) => row.before_file_id != null)
    .sort(
      (a, b) =>
        Number(!a.page_published) - Number(!b.page_published) ||
        Number(onServicePage(a)) - Number(onServicePage(b)) ||
        (a.page_document_id ?? "").localeCompare(b.page_document_id ?? "") ||
        (a.group_ord ?? 0) - (b.group_ord ?? 0) ||
        (a.case_ord ?? 0) - (b.case_ord ?? 0) ||
        a.id - b.id
    )
  const works = new Map<string, Work>()

  for (const row of sorted) {
    const key = `${row.before_file_id}:${row.after_file_id ?? ""}`
    const work = works.get(key)

    if (work) {
      work.rows.push(row)
      work.caption ||= row.caption
    } else {
      works.set(key, { rows: [row], caption: row.caption })
    }
  }

  for (const work of works.values()) {
    work.direction = directionOf(work.rows, directions)
    work.procedure = work.direction && procedureOf(work, work.direction)
  }

  return Array.from(works.values())
}

/**
 * The first direction the work's copies name: the tab it stood under in the
 * gallery, or the direction whose page (or whose procedure's page) it stood
 * on.
 */
function directionOf(rows: SnapshotRow[], directions: Direction[]) {
  const named = (row: SnapshotRow) => {
    const title = normalize(row.group_title)
    const tab = TAB_DIRECTIONS.get(title) ?? title

    return directions.find(
      (direction) =>
        normalize(direction.name) === tab ||
        direction.page === row.page_document_id ||
        direction.procedures.some(
          (procedure) => procedure.page === row.page_document_id
        )
    )
  }

  return rows.map(named).find(Boolean)
}

/**
 * The work's procedure, where exactly one is named: by a procedure's page in
 * its direction that it stood on, or by its caption.
 */
function procedureOf(work: Work, direction: Direction) {
  const named = new Set<Procedure>()
  const caption = normalize(work.caption)

  for (const procedure of direction.procedures) {
    if (work.rows.some((row) => row.page_document_id === procedure.page)) {
      named.add(procedure)
    }
  }

  for (const [stem, name] of CAPTION_PROCEDURES) {
    const procedure = direction.procedures.find(
      (candidate) => normalize(candidate.name) === name
    )

    if (procedure && caption.includes(stem)) {
      named.add(procedure)
    }
  }

  return named.size === 1 ? Array.from(named)[0] : undefined
}

async function loadDirections(strapi: Core.Strapi): Promise<Direction[]> {
  const entries = (await strapi.documents(DIRECTION).findMany({
    fields: ["name"],
    populate: {
      page: { fields: ["documentId"] },
      subdirections: {
        fields: ["name"],
        populate: { page: { fields: ["documentId"] } },
      },
    },
  } as never)) as unknown as {
    documentId: string
    name: string
    page?: null | { documentId: string }
    subdirections?: {
      documentId: string
      name: string
      page?: null | { documentId: string }
    }[]
  }[]

  return entries.map((entry) => ({
    documentId: entry.documentId,
    name: entry.name,
    page: entry.page?.documentId,
    procedures: (entry.subdirections ?? []).map((procedure) => ({
      documentId: procedure.documentId,
      name: procedure.name,
      page: procedure.page?.documentId,
    })),
  }))
}

function doctorOf(rows: SnapshotRow[], doctors: Map<number, string>) {
  return rows
    .map((row) => (row.doctor_id == null ? "" : doctors.get(row.doctor_id)))
    .find(Boolean)
}

/** The "before" photographs' file names, to tell works with one caption apart. */
async function fileNames(strapi: Core.Strapi, ids: number[]) {
  const files = await strapi.db
    .query("plugin::upload.file")
    .findMany({ where: { id: { $in: ids } }, select: ["id", "name"] })

  return new Map(files.map((file) => [file.id as number, file.name as string]))
}

/**
 * Names typed in different places may differ in case or whitespace, or spell
 * "й" as "и" plus a combining breve; all of them should match.
 */
function normalize(name: string | null | undefined) {
  return (
    (name ?? "")
      .normalize("NFC")
      .trim()
      // replaceAll is ES2021; this workspace compiles against ES2020.
      // eslint-disable-next-line unicorn/prefer-string-replace-all
      .replace(/\s+/g, " ")
      .toLowerCase()
  )
}

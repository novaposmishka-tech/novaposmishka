"use strict"

/**
 * The clinic's works were once copied into every block that showed them: a
 * `shared.case-group` per tab of a results block, and a `shared.before-after`
 * per piece of work under it — the same works again on the homepage, on
 * /nashi-roboty and on a procedure's page. They are now one Work collection,
 * and the results block finds them there by itself.
 *
 * Strapi drops the old components when it syncs the schema, and it runs this
 * file just before that, while they still hold their data. All this does is
 * copy every piece of work, and where it stood, into
 * `work_migration_snapshot`, a table Strapi does not track and so leaves
 * alone. Once the new schema is in place, the bootstrap
 * (src/migrations/works.ts) creates the works from it and drops the table.
 *
 * A database that never had the old components — a fresh one, or one already
 * moved over — has nothing to copy, and this does nothing.
 */

const SNAPSHOT = "work_migration_snapshot"
const BASIC_IMAGE = "utilities.basic-image"

module.exports = {
  async up(trx, db) {
    // Strapi's own queries name its schema (DATABASE_SCHEMA) on every call; a
    // bare query would go to the connection's default instead.
    const schema = db.getSchemaName()
    const knex = {
      from: (table) => (schema ? trx(table).withSchema(schema) : trx(table)),
      schema: () => (schema ? trx.schema.withSchema(schema) : trx.schema),
    }

    if (!(await knex.schema().hasTable("components_shared_before_afters"))) {
      return
    }

    await knex.schema().createTable(SNAPSHOT, (table) => {
      table.increments("id")
      // The page the work stood on, and whether that row is its published
      // version or its draft.
      table.string("page_document_id")
      table.boolean("page_published")
      table.integer("block_id")
      // The tab it was under, and where that tab and the work stood.
      table.string("group_title")
      table.integer("group_ord")
      table.integer("case_ord")
      table.string("caption")
      table.integer("before_image_id")
      table.integer("before_file_id")
      table.string("before_alt")
      table.integer("after_image_id")
      table.integer("after_file_id")
      table.string("after_alt")
      table.integer("doctor_id")
      // Filled by the bootstrap as it goes, so a start cut short does not
      // make the same work twice.
      table.string("work_document_id")
    })

    const rows = await works(knex)

    // Postgres caps the parameters of one statement; a few hundred rows is far
    // below it, but chunk anyway rather than depend on that.
    for (let start = 0; start < rows.length; start += 200) {
      await knex.from(SNAPSHOT).insert(rows.slice(start, start + 200))
    }
  },

  async down() {
    throw new Error("The works snapshot cannot be undone.")
  },
}

/** Every piece of work under every tab of every results block on a page. */
async function works(knex) {
  const cases = await knex
    .from("pages_cmps as pc")
    .join("pages as p", "p.id", "pc.entity_id")
    .join("components_sections_results_cmps as rc", "rc.entity_id", "pc.cmp_id")
    .join("components_shared_case_groups as g", "g.id", "rc.cmp_id")
    .join("components_shared_case_groups_cmps as gc", "gc.entity_id", "g.id")
    .join("components_shared_before_afters as w", "w.id", "gc.cmp_id")
    .where({
      "pc.component_type": "sections.results",
      "rc.field": "groups",
      "rc.component_type": "shared.case-group",
      "gc.field": "cases",
      "gc.component_type": "shared.before-after",
    })
    .select(
      "p.document_id as page_document_id",
      "p.published_at as published_at",
      "pc.cmp_id as block_id",
      "g.title as group_title",
      "rc.order as group_ord",
      "gc.order as case_ord",
      "w.id as work_id",
      "w.caption as caption"
    )

  if (cases.length === 0) {
    return []
  }

  const workIds = cases.map((row) => row.work_id)
  const [parts, doctors] = await Promise.all([
    knex
      .from("components_shared_before_afters_cmps")
      .whereIn("entity_id", workIds)
      .whereIn("field", ["before", "after"]),
    knex
      .from("components_shared_before_afters_doctor_lnk")
      .whereIn("before_after_id", workIds),
  ])
  const photos = await images(knex, parts)

  return cases.map((row) => {
    const photo = (field) => {
      const part = parts.find(
        (candidate) =>
          candidate.entity_id === row.work_id && candidate.field === field
      )

      return part ? { id: part.cmp_id, ...photos.get(part.cmp_id) } : {}
    }
    const before = photo("before")
    const after = photo("after")

    return {
      page_document_id: row.page_document_id,
      page_published: row.published_at !== null,
      block_id: row.block_id,
      group_title: row.group_title,
      group_ord: row.group_ord,
      case_ord: row.case_ord,
      caption: row.caption,
      before_image_id: before.id ?? null,
      before_file_id: before.fileId ?? null,
      before_alt: before.alt ?? null,
      after_image_id: after.id ?? null,
      after_file_id: after.fileId ?? null,
      after_alt: after.alt ?? null,
      doctor_id:
        doctors.find((link) => link.before_after_id === row.work_id)
          ?.doctor_id ?? null,
    }
  })
}

/**
 * The file and alt text behind each `utilities.basic-image` the given
 * component links point at, keyed by the image component's id.
 */
async function images(knex, parts) {
  const ids = parts
    .filter((part) => part.component_type === BASIC_IMAGE)
    .map((part) => part.cmp_id)

  if (ids.length === 0) {
    return new Map()
  }

  const [rows, files] = await Promise.all([
    knex.from("components_utilities_basic_images").whereIn("id", ids),
    knex
      .from("files_related_mph")
      .whereIn("related_id", ids)
      .where({ related_type: BASIC_IMAGE, field: "media" }),
  ])

  return new Map(
    rows.map((row) => [
      row.id,
      {
        alt: row.alt,
        fileId: files.find((file) => file.related_id === row.id)?.file_id,
      },
    ])
  )
}

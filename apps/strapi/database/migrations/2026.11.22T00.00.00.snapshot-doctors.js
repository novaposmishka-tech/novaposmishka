"use strict"

/**
 * Doctors were once copied into every block that named them: a `shared.doctor`
 * component in each team block, and a name and a portrait on each piece of
 * work and each treatment stage. They are now one Doctor collection that
 * those blocks point at.
 *
 * Strapi drops the old fields when it syncs the schema, and it runs this file
 * just before that, while they still hold their data. All this does is copy
 * who was named where into `doctor_migration_snapshot`, a table Strapi does
 * not track and so leaves alone. Once the new schema is in place, the
 * bootstrap (src/migrations/doctors.ts) creates the doctors from it, links
 * them where the old copies stood, and drops the table.
 *
 * A database that never had the old fields — a fresh one, or one already
 * moved over — has nothing to copy, and this does nothing.
 */

const SNAPSHOT = "doctor_migration_snapshot"
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

    if (!(await knex.schema().hasTable("components_shared_doctors"))) {
      return
    }

    await knex.schema().createTable(SNAPSHOT, (table) => {
      table.increments("id")
      // "section" (a team block), "before-after" (a piece of work) or
      // "case-stage" (a treatment stage).
      table.string("kind").notNullable()
      table.integer("owner_id").notNullable()
      table.integer("ord")
      table.string("name").notNullable()
      table.string("specialty")
      table.integer("photo_file_id")
      table.string("photo_alt")
      // JSON: [{ label, value }] in order.
      table.text("credentials")
    })

    const rows = [
      ...(await teamBlocks(knex)),
      ...(await signatures(
        knex,
        "before-after",
        "components_shared_before_afters"
      )),
      ...(await signatures(
        knex,
        "case-stage",
        "components_shared_case_stages"
      )),
    ]

    // Postgres caps the parameters of one statement; a few hundred rows is far
    // below it, but chunk anyway rather than depend on that.
    for (let start = 0; start < rows.length; start += 200) {
      await knex.from(SNAPSHOT).insert(rows.slice(start, start + 200))
    }
  },

  async down() {
    throw new Error("The doctors snapshot cannot be undone.")
  },
}

/** Every doctor of every team block, with their photograph and training. */
async function teamBlocks(knex) {
  const entries = await knex
    .from("components_sections_doctors_cmps as s")
    .join("components_shared_doctors as d", "d.id", "s.cmp_id")
    .where({ "s.field": "doctors", "s.component_type": "shared.doctor" })
    .select(
      "s.entity_id as owner_id",
      "s.order as ord",
      "d.id as doctor_id",
      "d.name",
      "d.specialty"
    )

  const parts = entries.length
    ? await knex
        .from("components_shared_doctors_cmps")
        .whereIn(
          "entity_id",
          entries.map((entry) => entry.doctor_id)
        )
        .orderBy("order")
    : []

  const credentialIds = parts
    .filter((part) => part.field === "credentials")
    .map((part) => part.cmp_id)
  const credentials = new Map(
    (credentialIds.length
      ? await knex
          .from("components_shared_credentials")
          .whereIn("id", credentialIds)
      : []
    ).map((credential) => [credential.id, credential])
  )

  const photos = await images(
    knex,
    parts.filter((part) => part.field === "photo")
  )

  return entries.map((entry) => {
    const own = parts.filter((part) => part.entity_id === entry.doctor_id)
    const photo = photos.get(own.find((part) => part.field === "photo")?.cmp_id)
    const training = own
      .filter((part) => part.field === "credentials")
      .map((part) => credentials.get(part.cmp_id))
      .filter(Boolean)
      .map(({ label, value }) => ({ label, value }))

    return {
      kind: "section",
      owner_id: entry.owner_id,
      ord: entry.ord,
      name: entry.name,
      specialty: entry.specialty,
      photo_file_id: photo?.fileId ?? null,
      photo_alt: photo?.alt ?? null,
      credentials: JSON.stringify(training),
    }
  })
}

/** The name and the portrait a piece of work or a treatment stage was signed with. */
async function signatures(knex, kind, table) {
  if (!(await knex.schema().hasColumn(table, "doctor_name"))) {
    return []
  }

  const signed = await knex
    .from(table)
    .whereNotNull("doctor_name")
    .whereNot("doctor_name", "")
    .select("id", "doctor_name")

  if (signed.length === 0) {
    return []
  }

  const parts = await knex
    .from(`${table}_cmps`)
    .whereIn(
      "entity_id",
      signed.map((row) => row.id)
    )
    .where({ field: "doctorPhoto" })
  const photos = await images(knex, parts)

  return signed.map((row) => {
    const part = parts.find((candidate) => candidate.entity_id === row.id)
    const photo = part && photos.get(part.cmp_id)

    return {
      kind,
      owner_id: row.id,
      ord: null,
      name: row.doctor_name,
      specialty: null,
      photo_file_id: photo?.fileId ?? null,
      photo_alt: photo?.alt ?? null,
      credentials: null,
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

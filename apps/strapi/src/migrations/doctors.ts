import type { Core } from "@strapi/strapi"

import { logError, logger } from "../utils/logging"

/**
 * The second half of moving doctors into their own collection; the first is
 * database/migrations/2026.11.22T00.00.00.snapshot-doctors.js, which copied
 * who was named where before Strapi dropped the old fields.
 *
 * From that copy this creates one Doctor per dentist, links each team block,
 * piece of work and treatment stage to the doctor it used to name, and drops
 * the copy. It runs at every start and does nothing once the copy is gone.
 *
 * Each step can be repeated: a doctor is looked up by name before one is
 * made, and a link is only written where none exists. So if a start is cut
 * short, the next one picks up where it stopped.
 */

const SNAPSHOT = "doctor_migration_snapshot"
const DOCTOR = "api::doctor.doctor"

/**
 * Dentists who have left the clinic, by any name their work was signed with,
 * and the colleague who now signs it. The clinic asked on 2026-11-22 for
 * Andrii Parkhomchuk's works to be shown as Serhii Shevchuk's.
 */
const HANDED_OVER = new Map([
  ["Андрій Пархомчук", "Шевчук Сергій Миколайович"],
  ["Пархомчук Андрій Валентинович", "Шевчук Сергій Миколайович"],
])

type SnapshotRow = {
  id: number
  kind: "section" | "before-after" | "case-stage"
  owner_id: number
  ord: number | null
  name: string
  specialty: string | null
  photo_file_id: number | null
  photo_alt: string | null
  credentials: string | null
}

type Image = { media: number; alt: string | null }

type DoctorData = {
  name: string
  shortName?: string
  specialty?: string
  photo?: Image
  avatar?: Image
  credentials?: { label: string; value: string }[]
}

/** A query builder: the connection itself or a transaction on it. */
type Knex = Core.Strapi["db"]["connection"]

type JoinTable = {
  name: string
  joinColumn: { name: string }
  inverseJoinColumn: { name: string }
  orderColumnName?: string
}

export async function migrateDoctors(strapi: Core.Strapi) {
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
    const { doctors, bySignature, unsigned } = collectDoctors(rows)
    const ids = new Map<string, number>()

    if (unsigned.size > 0) {
      logger.warn(
        "Works and stages signed by someone not in any team block are left unsigned",
        {
          names: [...unsigned],
        }
      )
    }

    for (const doctor of doctors) {
      ids.set(doctor.name, await ensureDoctor(strapi, doctor))
    }

    const doctorOf = (row: SnapshotRow) =>
      row.kind === "section"
        ? ids.get(normalize(row.name))
        : ids.get(bySignature.get(normalize(row.name)) ?? "")

    await knex.transaction(async (trx) => {
      const table = (name: string) => inSchema(trx, name)

      await link(
        table,
        joinTableOf(strapi, "sections.doctors", "doctors"),
        rows,
        "section",
        doctorOf
      )
      await link(
        table,
        joinTableOf(strapi, "shared.before-after", "doctor"),
        rows,
        "before-after",
        doctorOf
      )
      await link(
        table,
        joinTableOf(strapi, "shared.case-stage", "doctor"),
        rows,
        "case-stage",
        doctorOf
      )

      // The team page listed everyone's training and the other blocks did
      // not; that difference is now the block's own setting.
      const team = [
        ...new Set(
          rows
            .filter((row) => row.kind === "section" && hasTraining(row))
            .map((row) => row.owner_id)
        ),
      ]
      await table("components_sections_doctors")
        .whereNull("display")
        .update({ display: "row" })
      if (team.length > 0) {
        await table("components_sections_doctors")
          .whereIn("id", team)
          .update({ display: "team" })
      }

      // The links to the old copies point at rows that are gone or unused.
      await table("components_sections_doctors_cmps")
        .where({ component_type: "shared.doctor" })
        .delete()
      for (const name of [
        "components_shared_before_afters_cmps",
        "components_shared_case_stages_cmps",
      ]) {
        await table(name).where({ field: "doctorPhoto" }).delete()
      }

      await strapi.db.getSchemaConnection(trx).dropTable(SNAPSHOT)
    })

    logger.info("Doctors moved into their own collection", {
      doctors: doctors.length,
      links: rows.length,
    })
  } catch (error) {
    // The copy stays, so the next start tries again; the site keeps running
    // in the meantime, only without doctors on the blocks not yet linked.
    logError(error, "Moving doctors into their own collection failed")
  }
}

/**
 * One Doctor per dentist. The team blocks carry the full name, photograph and
 * training; a piece of work carries the short name ("Сергій Шевчук") and a
 * small portrait, which become the matching doctor's short name and avatar.
 *
 * The team blocks decide who is a doctor. A signature that matches no one in
 * them names a dentist who has left the team, so it does not bring them back.
 * Where the clinic has said who takes over their work (HANDED_OVER), the work
 * is signed by that colleague instead; otherwise it stays on the site,
 * unsigned.
 */
function collectDoctors(rows: SnapshotRow[]) {
  const doctors = teamDoctors(rows)
  const bySignature = new Map<string, string>()
  const unsigned = new Set<string>()

  for (const doctor of doctors.values()) {
    bySignature.set(doctor.name, doctor.name)
    if (doctor.shortName) {
      bySignature.set(doctor.shortName, doctor.name)
    }
  }

  for (const row of rows) {
    if (row.kind === "section") {
      continue
    }

    const signature = normalize(row.name)
    const own = doctors.get(bySignature.get(signature) ?? "")
    const successor = HANDED_OVER.get(signature)
    const doctor = own ?? doctors.get(successor ?? "")

    if (!doctor) {
      unsigned.add(signature)
      continue
    }

    if (!own) {
      // Remembered so the links below find the colleague too.
      bySignature.set(signature, doctor.name)
      continue
    }

    // The portrait beside a work is the signer's own; one taken from a
    // handed-over work would put the wrong face next to this doctor's name.
    const avatar = imageOf(row)
    if (avatar && !doctor.avatar && avatar.media !== doctor.photo?.media) {
      doctor.avatar = avatar
    }
  }

  return { doctors: Array.from(doctors.values()), bySignature, unsigned }
}

/** The doctors of the team blocks, by full name, each in their fullest copy. */
function teamDoctors(rows: SnapshotRow[]) {
  const doctors = new Map<string, DoctorData>()

  for (const row of rows) {
    const name = normalize(row.name)

    // A dentist who has left is dropped from the team blocks as well.
    if (row.kind !== "section" || HANDED_OVER.has(name)) {
      continue
    }

    const known = doctors.get(name)
    const credentials = parseCredentials(row.credentials)

    // The same dentist stands in many blocks; keep the fullest copy.
    if (
      known &&
      (known.credentials?.length ?? 0) >= credentials.length &&
      (known.photo || !row.photo_file_id)
    ) {
      continue
    }

    doctors.set(name, {
      name,
      shortName: shortNameOf(name),
      specialty: row.specialty ?? known?.specialty,
      photo: imageOf(row) ?? known?.photo,
      credentials: credentials.length ? credentials : known?.credentials,
    })
  }

  return doctors
}

/** The doctor's row id, made from `data` if no doctor has that name yet. */
async function ensureDoctor(strapi: Core.Strapi, data: DoctorData) {
  const existing = await strapi
    .documents(DOCTOR)
    .findFirst({ filters: { name: data.name }, fields: ["name"] })

  if (existing) {
    return existing.id as number
  }

  const created = await strapi.documents(DOCTOR).create({ data })

  return created.id as number
}

function joinTableOf(
  strapi: Core.Strapi,
  uid: string,
  attribute: string
): JoinTable {
  const meta = strapi.db.metadata.get(uid)
  const joinTable = (meta.attributes[attribute] as { joinTable?: JoinTable })
    .joinTable

  if (!joinTable) {
    throw new Error(`${uid}.${attribute} has no join table`)
  }

  return joinTable
}

async function link(
  table: (name: string) => ReturnType<Knex>,
  joinTable: JoinTable,
  rows: SnapshotRow[],
  kind: SnapshotRow["kind"],
  doctorOf: (row: SnapshotRow) => number | undefined
) {
  const owner = joinTable.joinColumn.name
  const target = joinTable.inverseJoinColumn.name
  for (const row of rows) {
    const doctorId = row.kind === kind ? doctorOf(row) : undefined

    if (doctorId == null) {
      continue
    }

    const linked = await table(joinTable.name)
      .where({ [owner]: row.owner_id, [target]: doctorId })
      .first()

    if (linked) {
      continue
    }

    await table(joinTable.name).insert({
      [owner]: row.owner_id,
      [target]: doctorId,
      ...(joinTable.orderColumnName && {
        [joinTable.orderColumnName]: row.ord ?? 1,
      }),
    })
  }
}

function imageOf(row: SnapshotRow): Image | undefined {
  return row.photo_file_id
    ? { media: row.photo_file_id, alt: row.photo_alt }
    : undefined
}

function hasTraining(row: SnapshotRow) {
  return parseCredentials(row.credentials).length > 0
}

function parseCredentials(raw: string | null) {
  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw) as { label: string; value: string }[]
  } catch {
    return []
  }
}

/** "Шевчук Сергій Миколайович" → "Сергій Шевчук", as the works are signed. */
function shortNameOf(name: string) {
  const [surname, firstName] = name.split(/\s+/)

  return firstName ? `${firstName} ${surname}` : undefined
}

/**
 * Names typed in different places may differ in whitespace, or spell "й" as
 * "и" plus a combining breve; both look the same and should match.
 */
function normalize(name: string) {
  // replaceAll is ES2021; this workspace compiles against ES2020.
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  return name.normalize("NFC").trim().split(/\s+/).join(" ")
}

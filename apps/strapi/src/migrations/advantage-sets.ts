import type { Core } from "@strapi/strapi"

import { logError, logger } from "../utils/logging"

/**
 * Moves the "why choose us" cards into the Advantage set collection.
 *
 * Each Advantages block on a page carried its own heading and cards, typed
 * again on every procedure page. They are now kept once, as a set the block
 * picks. This makes the set "Основний" from the block on the caries page —
 * the one the clinic rewrote — and has every Advantages block pick it, on the
 * clinic's instruction, in the draft and the published version alike.
 *
 * It runs once, at start-up. A database without that page yet (a fresh one,
 * before the seed) is left for a later start.
 */

const SET = "api::advantage-set.advantage-set"
const PAGE = "api::page.page"
const MAIN = "Основний"
const SOURCE = "/poslugy/terapiia/likuvannia-kariiesu"
const DONE = {
  type: "strapi",
  name: "migrations",
  key: "advantage-sets-filled",
}

type Card = {
  icon?: string | null
  title?: string | null
  text?: string | null
}
type Block = { __component: string; title?: string | null; items?: Card[] }

type JoinTable = {
  name: string
  joinColumn: { name: string }
  inverseJoinColumn: { name: string }
}

export async function fillAdvantageSets(strapi: Core.Strapi) {
  try {
    if (await strapi.store.get(DONE)) {
      return
    }

    const set = await mainSet(strapi)

    if (!set) {
      return
    }

    const linked = await pickEverywhere(strapi, Number(set.id))

    await strapi.store.set({ ...DONE, value: true })

    if (linked > 0) {
      // The blocks were linked under the document service, which would
      // otherwise have told the site to refetch the pages.
      try {
        await strapi
          .service("api::revalidate.revalidate")
          .run({ uid: "api::page.page" })
      } catch (error) {
        logError(
          error,
          "Revalidating the pages after the advantage sets failed"
        )
      }
    }

    logger.info("Advantages blocks now pick their set", {
      set: MAIN,
      blocks: linked,
    })
  } catch (error) {
    // Nothing is marked done, so the next start tries again.
    logError(error, "Moving the advantages into their sets failed")
  }
}

/** The set "Основний", made from the caries page's block if it is not there. */
async function mainSet(strapi: Core.Strapi) {
  const existing = await strapi
    .documents(SET)
    .findFirst({ filters: { name: MAIN }, fields: ["name"] })

  if (existing) {
    return existing
  }

  const page = await strapi.documents(PAGE).findFirst({
    locale: "uk",
    status: "published",
    filters: { fullPath: SOURCE },
    populate: { content: "smart" } as never,
  })
  const block = ((page as null | { content?: Block[] })?.content ?? []).find(
    (entry) => entry.__component === "sections.advantages"
  )

  if (!block?.items?.length) {
    logger.warn("No advantages to make the main set from yet", {
      source: SOURCE,
    })

    return null
  }

  return strapi.documents(SET).create({
    data: {
      name: MAIN,
      title: block.title ?? undefined,
      items: block.items.map(({ icon, title, text }) => ({
        icon,
        title,
        text,
      })),
    } as never,
  })
}

/**
 * Has every Advantages block without a set pick the given one. The blocks
 * are components, so the link is written straight into their join table.
 */
async function pickEverywhere(strapi: Core.Strapi, setId: number) {
  const meta = strapi.db.metadata.get("sections.advantages")
  const joinTable = (meta.attributes.set as { joinTable?: JoinTable }).joinTable

  if (!joinTable) {
    throw new Error("sections.advantages.set has no join table")
  }

  const owner = joinTable.joinColumn.name
  const target = joinTable.inverseJoinColumn.name
  const schema = strapi.db.getSchemaName()
  const knex = strapi.db.connection
  const table = (name: string) =>
    schema ? knex(name).withSchema(schema) : knex(name)

  const linked = await table(joinTable.name).select(owner)
  const taken = new Set(linked.map((row) => row[owner] as number))
  const blocks: { id: number }[] = await table(meta.tableName).select("id")
  const rows = blocks
    .filter((block) => !taken.has(block.id))
    .map((block) => ({ [owner]: block.id, [target]: setId }))

  for (let start = 0; start < rows.length; start += 200) {
    await table(joinTable.name).insert(rows.slice(start, start + 200))
  }

  return rows.length
}

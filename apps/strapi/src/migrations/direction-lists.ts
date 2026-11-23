import type { Core } from "@strapi/strapi"

import { logError, logger } from "../utils/logging"

/**
 * Gives the direction pages the list of their procedures in place of the
 * question block that stood in for one.
 *
 * Before the Subservices block existed, the direction pages listed what the
 * direction covers with a Faq block — a heading, a paragraph and an
 * accordion of points typed by hand. The Subservices block draws the same
 * list from the Subdirection collection, with each procedure's sentence,
 * photograph and page. On the pages the directions lead to, each Faq block is
 * swapped for a Subservices block that keeps its heading and paragraph, in
 * the draft and the published version alike; the hand-typed points go with
 * the old block. Nothing else on the pages changes.
 *
 * It runs once, at start-up: a Faq block an editor adds to a direction page
 * afterwards is theirs to keep.
 */

const DIRECTION = "api::direction.direction"
const DONE = {
  type: "strapi",
  name: "migrations",
  key: "direction-lists-replaced",
}

/** A query builder: the connection itself or a transaction on it. */
type Knex = Core.Strapi["db"]["connection"]

type Block = {
  page_id: number
  full_path: string
  cmp_id: number
  title: string | null
  sub_title: string | null
}

export async function replaceDirectionLists(strapi: Core.Strapi) {
  try {
    if (await strapi.store.get(DONE)) {
      return
    }

    const directions = (await strapi.documents(DIRECTION).findMany({
      fields: ["name"],
      populate: { page: { fields: ["documentId"] } },
    } as never)) as unknown as { page?: null | { documentId: string } }[]
    const pageIds = directions.flatMap((direction) =>
      direction.page ? [direction.page.documentId] : []
    )

    if (pageIds.length === 0) {
      // A database whose directions are not linked yet: try again later.
      return
    }

    const schema = strapi.db.getSchemaName()
    const inSchema = (query: Knex, table: string) =>
      schema ? query(table).withSchema(schema) : query(table)
    let replaced: Block[] = []

    await strapi.db.connection.transaction(async (trx) => {
      const table = (name: string) => inSchema(trx, name)

      const pages: { id: number; full_path: string }[] = await table("pages")
        .whereIn("document_id", pageIds)
        .select("id", "full_path")
      // The list stood first among a page's Faq blocks; any other is a real
      // set of questions, and stays.
      const all: { entity_id: number; cmp_id: number; order: number }[] =
        pages.length
          ? await table("pages_cmps")
              .whereIn(
                "entity_id",
                pages.map((page) => page.id)
              )
              .where({ component_type: "sections.faq" })
              .orderBy("order")
              .select("entity_id", "cmp_id", "order")
          : []
      const slots = all.filter(
        (slot) =>
          all.find((entry) => entry.entity_id === slot.entity_id) === slot
      )
      const faqs: {
        id: number
        title: string | null
        sub_title: string | null
      }[] = slots.length
        ? await table("components_sections_faqs")
            .whereIn(
              "id",
              slots.map((slot) => slot.cmp_id)
            )
            .select("id", "title", "sub_title")
        : []

      replaced = slots.map((slot) => {
        const faq = faqs.find((entry) => entry.id === slot.cmp_id)

        return {
          page_id: slot.entity_id,
          full_path:
            pages.find((page) => page.id === slot.entity_id)?.full_path ?? "",
          cmp_id: slot.cmp_id,
          title: faq?.title ?? null,
          sub_title: faq?.sub_title ?? null,
        }
      })

      // The points typed into the old blocks, kept in the log should any be
      // wanted back: they are not shown anywhere once the block goes.
      const points = replaced.length
        ? await table("components_sections_faqs_cmps as c")
            .join(
              // withSchema names the schema for the joined table too.
              "components_utilities_accordions as a",
              "a.id",
              "c.cmp_id"
            )
            .whereIn(
              "c.entity_id",
              replaced.map((block) => block.cmp_id)
            )
            .where({ "c.component_type": "utilities.accordions" })
            .orderBy(["c.entity_id", "c.order"])
            .select("c.entity_id", "a.question", "a.answer")
        : []

      if (replaced.length > 0)
        logger.info("Direction page lists being replaced", {
          lists: replaced.map((block) => ({
            page: block.full_path,
            title: block.title,
            subTitle: block.sub_title,
            points: points
              .filter((point) => point.entity_id === block.cmp_id)
              .map(({ question, answer }) => ({ question, answer })),
          })),
        })

      for (const block of replaced) {
        const [created] = await table("components_sections_subservices")
          .insert({ title: block.title, description: block.sub_title })
          .returning("id")
        const id = typeof created === "object" ? created.id : created

        await table("pages_cmps")
          .where({
            entity_id: block.page_id,
            cmp_id: block.cmp_id,
            component_type: "sections.faq",
          })
          .update({ component_type: "sections.subservices", cmp_id: id })

        // The old block and the links to its points. The points themselves
        // are left unreachable, as Strapi leaves any deleted component's.
        await table("components_sections_faqs_cmps")
          .where({ entity_id: block.cmp_id })
          .delete()
        await table("components_sections_faqs")
          .where({ id: block.cmp_id })
          .delete()
      }
    })

    // Marked once the swap is committed; the store writes outside it.
    await strapi.store.set({ ...DONE, value: true })

    if (replaced.length > 0) {
      // The pages were changed under the document service, which would
      // otherwise have told the site to refetch them.
      try {
        await strapi
          .service("api::revalidate.revalidate")
          .run({ uid: "api::page.page" })
      } catch (error) {
        logError(error, "Revalidating the direction pages failed")
      }
    }

    logger.info("Direction pages given their procedure lists", {
      pages: [...new Set(replaced.map((block) => block.full_path))],
    })
  } catch (error) {
    // Nothing is marked done, so the next start tries again.
    logError(error, "Replacing the direction pages' lists failed")
  }
}

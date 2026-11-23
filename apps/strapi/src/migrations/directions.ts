import type { Core } from "@strapi/strapi"

import { logError, logger } from "../utils/logging"

/**
 * Fills the Direction and Subdirection collections, once, from the cards the
 * pages already carry.
 *
 * Until now each direction was copied out by hand wherever it was shown: in
 * the explorer on /poslugy (name, description, icon, the procedures as tags),
 * on the homepage (a shorter line), and on its own page (each procedure with
 * its opening sentence). This reads the published versions of those blocks —
 * what visitors see, editors' changes included — and makes one Direction per
 * explorer entry and one Subdirection per procedure.
 *
 * It runs at start-up and stops for good once it has filled the collections,
 * or found them already filled (by the seed, or by hand), so a direction an
 * editor deletes later is not brought back. A database without the explorer
 * yet (a fresh one, before the seed) is left for a later start.
 */

const DIRECTION = "api::direction.direction"
const SUBDIRECTION = "api::subdirection.subdirection"
const PAGE = "api::page.page"
const LOCALE = "uk"
const DONE = { type: "strapi", name: "migrations", key: "directions-filled" }

type Link = {
  label?: string | null
  page?: null | { documentId?: string }
}

type Image = null | {
  alt?: string | null
  media?: null | { id?: number }
}

type Card = {
  name?: string | null
  description?: string | null
  icon?: Image
  link?: Link | null
  tags?: Link[] | null
  items?: Card[] | null
  services?: Card[] | null
}

type Block = Card & { __component: string; title?: string | null }

type Procedure = { name: string; description?: string; page?: string }

export async function fillDirections(strapi: Core.Strapi) {
  try {
    if (await strapi.store.get(DONE)) {
      return
    }

    if ((await strapi.documents(DIRECTION).count({})) > 0) {
      await strapi.store.set({ ...DONE, value: true })

      return
    }

    const explorer = await block("/poslugy", "sections.service-explorer")

    if (!explorer?.services?.length) {
      return
    }

    const homepageCards =
      (await block("/", "sections.services"))?.services ?? []
    let created = 0

    for (const [index, card] of explorer.services.entries()) {
      if (!card.name) {
        continue
      }

      const pageId = card.link?.page?.documentId
      const summary = homepageCards.find(
        (homeCard) =>
          (pageId && homeCard.link?.page?.documentId === pageId) ||
          same(homeCard.name, card.name)
      )?.description

      const direction = await strapi.documents(DIRECTION).create({
        data: {
          name: card.name.trim(),
          summary: summary ?? undefined,
          description: card.description ?? undefined,
          icon: imageOf(card.icon),
          order: index + 1,
          page: pageId,
        },
      })

      const procedures = await proceduresOf(card, pageId)

      for (const [position, procedure] of procedures.entries()) {
        await strapi.documents(SUBDIRECTION).create({
          data: {
            name: procedure.name,
            description: procedure.description,
            order: position + 1,
            direction: direction.documentId,
            page: procedure.page,
          },
        })
      }

      created += 1
    }

    await strapi.store.set({ ...DONE, value: true })
    logger.info("Directions filled from the pages", { directions: created })
  } catch (error) {
    // Nothing is marked done, so the next start tries again.
    logError(error, "Filling directions from the pages failed")
  }

  /** The first block of a kind on the published page at `fullPath`. */
  async function block(fullPath: string, component: string) {
    const page = await strapi.documents(PAGE).findFirst({
      locale: LOCALE,
      status: "published",
      filters: { fullPath },
      populate: { content: "smart" } as never,
    })
    const content = (page as null | { content?: Block[] })?.content ?? []

    return content.find((entry) => entry.__component === component)
  }

  /**
   * A direction's procedures: the list on its own page, which has a sentence
   * for each, then any tag on /poslugy that list does not have.
   */
  async function proceduresOf(card: Card, pageId: string | undefined) {
    const listed = pageId
      ? ((await directionPageList(pageId))?.items ?? [])
      : []
    const procedures: Procedure[] = []

    for (const item of listed) {
      if (item.name) {
        procedures.push({
          name: item.name.trim(),
          description: item.description ?? undefined,
          page: item.link?.page?.documentId,
        })
      }
    }

    for (const tag of card.tags ?? []) {
      const page = tag.page?.documentId
      const known = procedures.some(
        (procedure) =>
          (page && procedure.page === page) || same(procedure.name, tag.label)
      )

      if (tag.label && !known) {
        procedures.push({ name: tag.label.trim(), page })
      }
    }

    await findOwnPages(procedures, pageId)

    return procedures
  }

  /**
   * A procedure whose card links elsewhere (to the booking form, say) may
   * still have a page of its own under the direction's; it is found by the
   * name it goes by in the breadcrumbs or its title.
   */
  async function findOwnPages(procedures: Procedure[], pageId?: string) {
    if (!pageId || procedures.every((procedure) => procedure.page)) {
      return
    }

    const children = await strapi.documents(PAGE).findMany({
      locale: LOCALE,
      status: "published",
      filters: { parent: { documentId: pageId } },
      fields: ["title", "breadcrumbTitle"],
    })

    for (const procedure of procedures) {
      procedure.page ??= children.find(
        (child) =>
          same(child.breadcrumbTitle, procedure.name) ||
          same(child.title, procedure.name)
      )?.documentId
    }
  }

  async function directionPageList(documentId: string) {
    const page = await strapi.documents(PAGE).findOne({
      documentId,
      locale: LOCALE,
      status: "published",
      populate: { content: "smart" } as never,
    })
    const content = (page as null | { content?: Block[] })?.content ?? []

    return content.find((entry) => entry.__component === "sections.subservices")
  }
}

function imageOf(image: Image | undefined) {
  const media = image?.media?.id

  return media ? { media, alt: image?.alt ?? undefined } : undefined
}

function same(a: string | null | undefined, b: string | null | undefined) {
  return (
    Boolean(a && b) &&
    a!.normalize("NFC").trim().toLowerCase() ===
      b!.normalize("NFC").trim().toLowerCase()
  )
}

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
const IMAGES_DONE = {
  type: "strapi",
  name: "migrations",
  key: "direction-images-filled",
}

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

    const explorer = await block(
      strapi,
      "/poslugy",
      "sections.service-explorer"
    )

    if (!explorer?.services?.length) {
      return
    }

    const homepageCards =
      (await block(strapi, "/", "sections.services"))?.services ?? []
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

  /**
   * A direction's procedures: the list on its own page, which has a sentence
   * for each, then any tag on /poslugy that list does not have.
   */
  async function proceduresOf(card: Card, pageId: string | undefined) {
    const listed = pageId
      ? ((await directionPageList(strapi, pageId))?.items ?? [])
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
}

/**
 * Gives the directions and their procedures the pictures the blocks drew
 * them with and the first fill did not copy: the illustration on each
 * homepage card, and the photograph beside each procedure on its direction's
 * page. Once, like the fill: a picture an editor later removes stays removed.
 * Only an empty field is filled, and a database whose directions are not made
 * yet is left for a later start.
 */
export async function fillDirectionImages(strapi: Core.Strapi) {
  try {
    if (await strapi.store.get(IMAGES_DONE)) {
      return
    }

    const directions = (await strapi.documents(DIRECTION).findMany({
      fields: ["name"],
      populate: {
        illustration: true,
        page: { fields: ["fullPath"] },
        subdirections: {
          fields: ["name"],
          populate: { image: true, page: { fields: ["fullPath"] } },
        },
      },
    } as never)) as unknown as FilledDirection[]

    if (directions.length === 0) {
      return
    }

    const homepageCards =
      (await block(strapi, "/", "sections.services"))?.services ?? []
    let filled = 0

    for (const direction of directions) {
      const pageId = direction.page?.documentId
      const card = homepageCards.find(
        (entry) =>
          (pageId && entry.link?.page?.documentId === pageId) ||
          same(entry.name, direction.name)
      )
      const illustration = imageOf(card?.icon)

      if (!direction.illustration && illustration) {
        await strapi.documents(DIRECTION).update({
          documentId: direction.documentId,
          data: { illustration },
        } as never)
        filled += 1
      }

      const items = pageId
        ? ((await directionPageList(strapi, pageId))?.items ?? [])
        : []

      for (const procedure of direction.subdirections ?? []) {
        const item = items.find(
          (entry) =>
            (procedure.page?.documentId &&
              entry.link?.page?.documentId === procedure.page.documentId) ||
            same(entry.name, procedure.name)
        )
        const image = imageOf(item?.icon)

        if (!procedure.image && image) {
          await strapi.documents(SUBDIRECTION).update({
            documentId: procedure.documentId,
            data: { image },
          } as never)
          filled += 1
        }
      }
    }

    await strapi.store.set({ ...IMAGES_DONE, value: true })
    logger.info("Direction pictures filled from the pages", { filled })
  } catch (error) {
    // Nothing is marked done, so the next start tries again.
    logError(error, "Filling direction pictures from the pages failed")
  }
}

type FilledDirection = {
  documentId: string
  name: string
  illustration?: unknown
  page?: null | { documentId: string }
  subdirections?: {
    documentId: string
    name: string
    image?: unknown
    page?: null | { documentId: string }
  }[]
}

/** The first block of a kind on the published page at `fullPath`. */
async function block(strapi: Core.Strapi, fullPath: string, component: string) {
  const page = await strapi.documents(PAGE).findFirst({
    locale: LOCALE,
    status: "published",
    filters: { fullPath },
    populate: { content: "smart" } as never,
  })
  const content = (page as null | { content?: Block[] })?.content ?? []

  return content.find((entry) => entry.__component === component)
}

/** The list of procedures on a direction's own page. */
async function directionPageList(strapi: Core.Strapi, documentId: string) {
  const page = await strapi.documents(PAGE).findOne({
    documentId,
    locale: LOCALE,
    status: "published",
    populate: { content: "smart" } as never,
  })
  const content = (page as null | { content?: Block[] })?.content ?? []

  return content.find((entry) => entry.__component === "sections.subservices")
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

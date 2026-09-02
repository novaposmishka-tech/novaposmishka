/**
 * Pieces every seeded page needs: the clinic's contact details and the small
 * builders that keep the content files readable.
 */

export const locale = "uk"

export const CLINIC_NAME = "Нова Посмішка"

export const PHONES = ["093 762 05 00", "067 762 55 00"]
export const EMAIL = "novaposmishka@gmail.com"
export const ADDRESS = "вулиця Івана Сльоти, 50а, м. Житомир"
export const OPENING_HOURS = ["Пн–Пт: 9:00 – 19:00", "Сб: 9:00 – 15:00"]

export const text = (value) => ({ text: value })

/**
 * A link to a URL — an in-page anchor, or a path on this site.
 *
 * `decorations` is not optional in practice: StrapiLink falls back to the
 * "link" variant, which renders a call to action as plain underlined text.
 */
export const anchor = (label, href, decorations = null) => ({
  type: "external",
  label,
  href,
  newTab: false,
  decorations,
})

/**
 * A link to another seeded page, by slug. The seeder swaps the marker for the
 * page's documentId once every page exists — a relation, so the link follows
 * the page if its path ever changes.
 */
export const pageLink = (label, slug, decorations = null) => ({
  __pageSlug: slug,
  label,
  newTab: false,
  decorations,
})

/** The filled brand button the design uses for every "Записатися". */
export const BUTTON = { variant: "default", size: "lg", hasIcons: false }

/** Its counterpart on a photo or a dark card: white face, dark label. */
export const BUTTON_ON_DARK = {
  variant: "secondary",
  size: "lg",
  hasIcons: false,
}

/** The quieter link the design puts on a service card. */
export const BUTTON_QUIET = {
  variant: "outline",
  size: "default",
  hasIcons: false,
}

/**
 * A `utilities.basic-image` pointing at a file in `seed/media`, named without
 * its extension. The seeder swaps the marker for the uploaded file's id, which
 * differs per database — see scripts/seed-media.mjs.
 */
export const image = (name, alt) => ({ __media: name, alt })

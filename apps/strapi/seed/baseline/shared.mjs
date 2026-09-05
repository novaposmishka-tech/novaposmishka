/**
 * Pieces every seeded page needs: the clinic's contact details and the small
 * builders that keep the content files readable.
 */

export const locale = "uk"

export const CLINIC_NAME = "Нова Посмішка"

export const PHONES = ["093 762 05 00", "067 762 55 00"]
export const EMAIL = "novaposmishka@gmail.com"

/**
 * The first phone in international form, for the messenger links that address
 * a person by number (wa.me, t.me). "093 762 05 00" becomes "380937620500".
 */
export const PHONE_E164 = "380" + PHONES[0].replace(/[^0-9]/g, "").slice(1)
export const ADDRESS = "вулиця Івана Сльоти, 50а, м. Житомир"

/** The same address as the footer sets it: city first, over two lines. */
export const ADDRESS_LINES = ["м. Житомир,", "вулиця Івана Сльоти, 50а"]

/** The postal address the contacts page prints under the map. */
export const ADDRESS_FULL =
  'ЖК "Набережний Квартал, вулиця Івана Сльоти, 50а, Житомир, Житомирська область, Україна, 10024'
export const OPENING_HOURS = [
  "Пн - Пт: 8:00 - 20:00",
  "Сб: 9:00 - 15:00",
  "Нд: Вихідний",
]

/** Schema.org spelling of the same hours, for the homepage structured data. */
export const OPENING_HOURS_SCHEMA = ["Mo-Fr 08:00-20:00", "Sa 09:00-15:00"]

/** The clinic's Google rating, as the design shows it in the footer. */
export const GOOGLE_RATING = 4.8

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

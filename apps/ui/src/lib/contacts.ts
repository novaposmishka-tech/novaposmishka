import type { Data } from "@repo/strapi-types"

/**
 * Turns a contact value into a tel:/mailto: href so a visitor on a phone can
 * reach the clinic in one tap.
 *
 * `kind` comes from the CMS rather than being guessed from the value: an
 * address that starts with a house number would otherwise be read as a phone
 * number. Anything else stays plain text.
 */
export function contactHref(
  kind: string | null | undefined,
  value: string
): string | undefined {
  switch (kind) {
    case "phone":
      return `tel:${value.replaceAll(/[^\d+]/g, "")}`
    case "email":
      return `mailto:${value.trim()}`

    default:
      return undefined
  }
}

/**
 * The opening hours as the footer prints them, a line each. They are an
 * editor's words there, so the places that repeat them quote the footer
 * rather than write them again.
 */
export function clinicHours(
  footer: Data.ContentType<"api::footer.footer"> | null | undefined
): string[] {
  for (const contact of footer?.contacts ?? []) {
    const lines =
      contact.values?.flatMap((value) => (value.text ? [value.text] : [])) ?? []

    if (isSchedule(contact) && lines.some((line) => TIME_OF_DAY.test(line))) {
      return lines
    }
  }

  return []
}

/** A time of day as a schedule writes it: "8:00", "20.00". */
const TIME_OF_DAY = /\b\d{1,2}[:.]\d{2}\b/

/**
 * Whether a footer contact can be the schedule: plain text under the clock.
 * The clock is the icon a contact gets when none is chosen — the footer
 * draws it for an empty one too — so the icon alone does not say "hours",
 * and the caller also asks that a line of it reads as a time.
 */
const isSchedule = (contact: { icon?: string | null; kind?: string | null }) =>
  (contact.icon ?? "clock") === "clock" && (contact.kind ?? "text") === "text"

/**
 * The clinic's numbers as the header lists them. The navbar carries a list of
 * them now; an older entry has the single `phone` field instead.
 */
export function clinicPhones(
  navbar: Data.ContentType<"api::navbar.navbar"> | null | undefined
): (string | null | undefined)[] {
  return navbar?.phones?.length
    ? navbar.phones.map((entry) => entry.text)
    : [navbar?.phone]
}

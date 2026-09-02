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

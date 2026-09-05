import "server-only"

import { PhoneIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { contactHref } from "@/lib/contacts"

/**
 * The round call button the design puts beside "Записатись".
 *
 * Icon-only, so it carries the number in its accessible name rather than just
 * the word "call" — a screen-reader user hears what they are about to dial.
 */
export async function NavbarPhoneButton({
  phone,
}: {
  readonly phone?: string | null
}) {
  if (!phone) {
    return null
  }

  const href = contactHref("phone", phone)

  if (!href) {
    return null
  }

  const t = await getTranslations("clinic")

  return (
    <a
      href={href}
      aria-label={`${t("callUs")}: ${phone}`}
      className="border-brand-deep text-brand-deep hover:bg-brand-surface flex size-11.5 items-center justify-center rounded-full border transition-colors"
    >
      <PhoneIcon aria-hidden className="size-5" />
    </a>
  )
}

NavbarPhoneButton.displayName = "NavbarPhoneButton"

export default NavbarPhoneButton

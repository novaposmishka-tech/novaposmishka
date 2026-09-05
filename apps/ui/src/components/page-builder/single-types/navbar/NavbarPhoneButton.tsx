"use client"

import { PhoneIcon, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { operatorIcon } from "@/components/icons/operators"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { contactHref } from "@/lib/contacts"

/**
 * The round call button the design puts beside "Записатись".
 *
 * The clinic answers on two numbers, and the design opens a small card under
 * the button listing both with their operator's mark. With only one number
 * there is nothing to choose between, so the button dials it directly.
 */
export function NavbarPhoneButton({
  phones,
}: {
  readonly phones?: readonly (string | null | undefined)[]
}) {
  const t = useTranslations("clinic")
  const tGeneral = useTranslations("general")
  const numbers = (phones ?? []).filter((phone): phone is string =>
    Boolean(phone)
  )

  if (numbers.length === 0) {
    return null
  }

  const button =
    "border-brand-deep text-brand-deep hover:bg-brand-surface flex size-11.5 shrink-0 items-center justify-center rounded-full border transition-colors"

  const [only] = numbers

  if (numbers.length === 1 && only) {
    const href = contactHref("phone", only)

    return href ? (
      <a href={href} aria-label={`${t("callUs")}: ${only}`} className={button}>
        <PhoneIcon aria-hidden className="size-5" />
      </a>
    ) : null
  }

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t("callUs")}
        className={`${button} cursor-pointer`}
      >
        <PhoneIcon aria-hidden className="size-5" />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-61.5 rounded-[26px] p-5">
        <ul className="flex list-none flex-col">
          {numbers.map((phone, index) => {
            const Icon = operatorIcon(phone)
            const href = contactHref("phone", phone)

            return (
              <li
                key={phone}
                className="border-brand-hairline flex items-center gap-4 py-2.5 not-last:border-b"
              >
                {Icon ? (
                  <Icon className="size-6 shrink-0" />
                ) : (
                  <PhoneIcon
                    aria-hidden
                    className="text-brand-body size-6 shrink-0"
                  />
                )}
                {href ? (
                  <a
                    href={href}
                    className="text-brand-ink text-lg hover:underline"
                  >
                    {phone}
                  </a>
                ) : (
                  <span className="text-brand-ink text-lg">{phone}</span>
                )}
                {index === 0 && (
                  <PopoverClose className="text-brand-ink ml-auto cursor-pointer">
                    <X aria-hidden className="size-5" />
                    <span className="sr-only">{tGeneral("close")}</span>
                  </PopoverClose>
                )}
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

NavbarPhoneButton.displayName = "NavbarPhoneButton"

export default NavbarPhoneButton

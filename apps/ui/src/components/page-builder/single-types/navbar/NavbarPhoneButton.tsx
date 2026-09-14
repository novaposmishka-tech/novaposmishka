"use client"

import { PhoneIcon, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Fragment } from "react"

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
    "border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-brand-inverted group-has-data-photo-hero-top:border-white group-has-data-photo-hero-top:bg-white flex size-11.5 shrink-0 items-center justify-center rounded-full border transition-colors"

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

      {/* The frame centres the card under the button and drops it 18 below,
          with the two numbers in a column and the close beside them at the top
          rather than tucked into the first row. */}
      <PopoverContent
        sideOffset={18}
        className="shadow-brand-card flex w-61.5 gap-5 rounded-[26px] border-0 p-5"
      >
        <ul className="flex flex-1 list-none flex-col gap-5">
          {numbers.map((phone, index) => {
            const Icon = operatorIcon(phone)
            const href = contactHref("phone", phone)

            return (
              <Fragment key={phone}>
                {/* The frame rules a line between the numbers, set 20 clear of
                    each, which a border on the row itself cannot sit. */}
                {index > 0 && (
                  <li aria-hidden className="border-brand-hairline border-t" />
                )}
                <li className="flex items-center gap-2.5 py-2">
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
                      className="text-brand-ink hover:text-brand-teal text-lg/6.25 font-semibold"
                    >
                      {phone}
                    </a>
                  ) : (
                    <span className="text-brand-ink text-lg/6.25 font-semibold">
                      {phone}
                    </span>
                  )}
                </li>
              </Fragment>
            )
          })}
        </ul>

        <PopoverClose className="text-brand-ink flex size-8 shrink-0 cursor-pointer items-center justify-center self-start">
          <X aria-hidden className="size-4.5" />
          <span className="sr-only">{tGeneral("close")}</span>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

NavbarPhoneButton.displayName = "NavbarPhoneButton"

export default NavbarPhoneButton

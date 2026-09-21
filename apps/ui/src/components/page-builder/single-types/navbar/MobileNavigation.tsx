"use client"

import type { Data } from "@repo/strapi-types"
import { ArrowRight, ChevronLeft, ChevronRight, PhoneIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { operatorIcon } from "@/components/icons/operators"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { contactHref } from "@/lib/contacts"
import { cn } from "@/lib/styles"

interface MobileNavigationProps {
  isOpen: boolean
  setOpen: (open: boolean) => void
  menuButton?: Data.ContentType<"api::navbar.navbar">["menuButton"]
  navbarItems?: Data.ContentType<"api::navbar.navbar">["navbarItems"]
  phones?: readonly (string | null | undefined)[]
}

/** One row of the list: the design gives each 30px of air above and below. */
const ROW = "flex h-auto w-full items-center justify-between py-7.5 text-base"

/**
 * The menu the burger opens on a phone.
 *
 * It drops below the header rather than covering it, as the design draws it:
 * the wordmark and the booking button stay reachable, and the burger becomes
 * the close control. Services open a second level in place, with a way back.
 */
export function MobileNavigation({
  navbarItems,
  menuButton,
  isOpen,
  setOpen,
  phones,
}: MobileNavigationProps) {
  const t = useTranslations("general")
  const [openCategory, setOpenCategory] =
    useState<Data.Component<"layout.navbar-item"> | null>(null)

  if (!navbarItems?.length) return null

  const close = () => {
    setOpenCategory(null)
    setOpen(false)
  }

  const numbers = (phones ?? []).filter((phone): phone is string =>
    Boolean(phone)
  )

  return (
    <div
      // Below the header, over everything else. `hidden` rather than a
      // transform so the list is not in the tab order while it is shut.
      className={cn(
        "bg-background fixed inset-x-0 top-15 bottom-0 z-40 overflow-y-auto px-7.5 lg:hidden",
        isOpen ? "block" : "hidden"
      )}
    >
      {openCategory ? (
        <>
          <button
            type="button"
            onClick={() => setOpenCategory(null)}
            className="text-brand-body border-brand-hairline flex w-full items-center gap-2 border-b py-4 text-base"
          >
            <ChevronLeft aria-hidden className="size-5" />
            {t("menu")}
          </button>

          <ul className="list-none">
            {openCategory.categoryItems?.map((subItem) => (
              <li key={subItem.id} className="border-brand-hairline border-b">
                <StrapiLink
                  component={subItem}
                  onClick={close}
                  className={cn(
                    ROW,
                    // StrapiLink is a button underneath and brings the variant's own 10px
                    // of side padding with it. The frame sets every row of this menu flush
                    // to one line — 30 from the edge of a 360 phone, the container's own
                    // gutter — and the row that is a plain button already sat there, so
                    // the links were the odd ones out.
                    "text-brand-ink justify-start px-0 no-underline"
                  )}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <ul className="list-none">
            {navbarItems.map((item) => (
              <li key={item.id} className="border-brand-hairline border-b">
                {item.isCategoryLink && item.link ? (
                  <StrapiLink
                    component={item.link}
                    onClick={close}
                    className={cn(
                      ROW,
                      // StrapiLink is a button underneath and brings the variant's own 10px
                      // of side padding with it. The frame sets every row of this menu flush
                      // to one line — 30 from the edge of a 360 phone, the container's own
                      // gutter — and the row that is a plain button already sat there, so
                      // the links were the odd ones out.
                      "text-brand-ink justify-start px-0 no-underline"
                    )}
                  >
                    {item.link.label}
                  </StrapiLink>
                ) : item.categoryItems?.length ? (
                  <button
                    type="button"
                    onClick={() => setOpenCategory(item)}
                    className={cn(ROW, "text-brand-ink cursor-pointer")}
                  >
                    {item.label}
                    <ChevronRight aria-hidden className="size-5 shrink-0" />
                  </button>
                ) : (
                  <span className={cn(ROW, "text-brand-body")}>
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* The clinic's numbers as chips, each under its operator's mark —
              the quickest way to reach it from the device this menu is on. */}
          {numbers.length > 0 && (
            <ul className="mt-10 flex list-none flex-wrap gap-4.5">
              {numbers.map((phone) => {
                const Icon = operatorIcon(phone) ?? PhoneIcon
                const href = contactHref("phone", phone)

                return (
                  <li key={phone}>
                    <a
                      href={href ?? undefined}
                      className="bg-brand-mist text-brand-ink flex h-9 items-center gap-1.5 rounded-[21px] px-3 text-sm"
                    >
                      <Icon aria-hidden className="size-5 shrink-0" />
                      {phone}
                    </a>
                  </li>
                )
              })}
            </ul>
          )}

          {menuButton && (
            <StrapiLink
              component={menuButton}
              onClick={close}
              className="mt-10 h-10 w-full rounded-[30px] text-sm font-semibold"
            >
              {menuButton.label}
              <ArrowRight aria-hidden className="size-5" />
            </StrapiLink>
          )}
        </>
      )}
    </div>
  )
}

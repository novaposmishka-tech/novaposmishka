"use client"

import { MessageCircleMore, PhoneIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSyncExternalStore } from "react"

import { contactHref } from "@/lib/contacts"
import { isClinicOpen } from "@/lib/working-hours"

/** The form at the foot of every page, in the footer. */
const LEAD_FORM_ANCHOR = "#lead-form-section"

/**
 * A round button that stays in the bottom-right corner of every page.
 *
 * While the clinic is open it dials straight away rather than offering a
 * choice: the clinic's first number is the one the header lists first, and a
 * card to pick from would put a second tap between the visitor and the call.
 * Out of hours nobody would pick up, so it becomes a chat button that takes the
 * visitor down to the form instead.
 */
export function FloatingCallButton({
  phones,
}: {
  readonly phones?: readonly (string | null | undefined)[]
}) {
  const t = useTranslations("clinic")
  const open = useClinicOpen()

  // The page is built ahead of time and cached, so only the visitor's browser
  // knows what time it is. Until it has said, there is no button rather than
  // the wrong one.
  if (open === null) {
    return null
  }

  const phone = phones?.find(Boolean)
  const href = phone ? contactHref("phone", phone) : undefined

  const className =
    // Under the phone menu (z-40), which covers the page it is opened over,
    // and clear of the home indicator on an iPhone. The 404 and 500 pages are
    // drawn bare, so it goes with the header there. The white rim keeps it
    // apart from the teal footer and the photo heroes it floats over.
    //
    // The gradient lies on its own layer over a solid teal and fades out on
    // hover. A gradient cannot be transitioned, so dropping it from the button
    // itself let the page show through while the teal faded in.
    "bg-brand-teal text-brand-inverted shadow-brand-button before:bg-brand-gradient fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full border-2 border-white group-has-data-error-page:hidden before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-200 hover:before:opacity-0 lg:right-7.5 lg:bottom-7.5 lg:size-16 print:hidden"

  if (open && phone && href) {
    return (
      <a
        href={href}
        aria-label={`${t("callUs")}: ${phone}`}
        className={className}
      >
        <PhoneIcon aria-hidden className="relative size-6 lg:size-7" />
      </a>
    )
  }

  return (
    <a href={LEAD_FORM_ANCHOR} aria-label={t("writeUs")} className={className}>
      <MessageCircleMore aria-hidden className="relative size-6 lg:size-7" />
    </a>
  )
}

FloatingCallButton.displayName = "FloatingCallButton"

export default FloatingCallButton

/** Looks at the clock again every minute, so an open tab turns over too. */
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000)

  return () => clearInterval(timer)
}

function useClinicOpen(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => isClinicOpen(new Date()),
    () => null
  )
}

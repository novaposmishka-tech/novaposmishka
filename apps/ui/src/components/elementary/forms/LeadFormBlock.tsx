"use client"

import Image from "next/image"
import { useState } from "react"

import { LeadForm } from "@/components/elementary/forms/LeadForm"
import {
  type LeadFormStatus,
  LeadFormOutcome,
} from "@/components/elementary/forms/LeadFormOutcome"
import { Typography } from "@/components/typography"

export type { LeadFormStatus }

/**
 * The call-to-action block: the clinic's pitch on one side, the form on the
 * other.
 *
 * The pitch is what changes once the form has been submitted — the design
 * replaces it with the outcome rather than showing a toast that disappears
 * before anyone reads it. That is why this owns the status and not the form.
 */
export function LeadFormBlock({
  title,
  description,
  gdpr,
  phones,
}: Readonly<{
  title?: string | null
  description?: string | null
  gdpr?: { href?: string; label?: string; newTab?: boolean }
  /** Offered beside the apology when the request could not be sent. */
  phones?: readonly string[]
}>) {
  const [status, setStatus] = useState<LeadFormStatus>("idle")

  return (
    <div className="bg-brand-gradient text-brand-inverted relative isolate flex flex-col items-center gap-12.5 overflow-hidden px-3.75 pt-7.5 pb-25 lg:flex-row lg:items-stretch lg:gap-25 lg:rounded-[50px] lg:p-12.5">
      {/* The copy and the form sit in one column, as the design lays them out —
          not side by side. The phone frame centres the heading over them. */}
      <div className="flex w-full flex-col gap-7.5 text-center lg:max-w-150 lg:gap-10 lg:text-left">
        {status !== "idle" && (
          <LeadFormOutcome
            status={status}
            phones={phones}
            // Only a failure has anything to go back to.
            onRetry={status === "failed" ? () => setStatus("idle") : undefined}
          />
        )}

        {/* Hidden rather than unmounted while the outcome shows: a failed send
            keeps what was typed, so going back is a press rather than a retype. */}
        <div hidden={status !== "idle"} className="contents">
          {/* The frame holds the words to 532 inside the 601 column. */}
          <div className="flex flex-col gap-5 lg:max-w-133">
            {title && (
              <Typography tag="h2" className="text-brand-inverted">
                {title}
              </Typography>
            )}
            {/* The phone frame carries the heading and the fields alone —
                the sentence under it is a desktop line. */}
            {description && (
              <Typography className="text-brand-inverted max-lg:hidden">
                {description}
              </Typography>
            )}
          </div>

          <div className="flex w-full max-w-133 text-left">
            <LeadForm gdpr={gdpr} onStatusChange={setStatus} />
          </div>
        </div>
      </div>

      {/* The tooth the design watermarks the card with. A column of its own in
          the frame rather than a backdrop, 519 wide beside the 601 of copy.
          Decorative, so it is hidden from assistive technology and never steals
          a tap. */}
      <Image
        src="/images/tooth-watermark.svg"
        alt=""
        width={519}
        height={504}
        aria-hidden
        // The frame sets it above the words on a phone and beside them at
        // desktop, where it is a column of its own.
        className="pointer-events-none order-first h-37.25 w-38.5 shrink-0 self-center object-contain lg:order-none lg:h-full lg:w-129.75"
      />
    </div>
  )
}

LeadFormBlock.displayName = "LeadFormBlock"

export default LeadFormBlock

"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"

import AppLink from "@/components/elementary/AppLink"
import { LeadForm } from "@/components/elementary/forms/LeadForm"
import { Typography } from "@/components/typography"

export type LeadFormStatus = "idle" | "sent" | "failed"

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
}: Readonly<{
  title?: string | null
  description?: string | null
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}>) {
  const t = useTranslations("leadForm")
  const [status, setStatus] = useState<LeadFormStatus>("idle")

  const heading = status === "idle" ? title : t(`${status}Title`)
  const body = status === "idle" ? description : t(`${status}Body`)

  return (
    <div className="bg-brand-gradient text-brand-inverted relative isolate flex flex-col gap-10 overflow-hidden rounded-[50px] p-8 md:p-12 lg:flex-row lg:gap-25 lg:p-12.5">
      {/* The copy and the form sit in one column, as the design lays them out —
          not side by side. */}
      <div className="flex w-full flex-col gap-10 lg:max-w-150">
        <div className="flex flex-col gap-5">
          {heading && (
            <Typography
              tag="h2"
              className="text-brand-inverted"
              // The outcome replaces the pitch, so it has to be announced.
              {...(status !== "idle" ? { role: "status" } : {})}
            >
              {heading}
            </Typography>
          )}
          {body && (
            <Typography className="text-brand-inverted">{body}</Typography>
          )}

          {status !== "idle" && (
            <AppLink
              href="/"
              className="text-brand-inverted w-fit p-0 underline"
            >
              {t("backHome")}
            </AppLink>
          )}
        </div>

        <div className="flex w-full max-w-133">
          <LeadForm gdpr={gdpr} onStatusChange={setStatus} />
        </div>
      </div>

      {/* The tooth the design watermarks the card with. Decorative, so it is
          hidden from assistive technology and never steals a tap. */}
      <Image
        src="/images/tooth-watermark.svg"
        alt=""
        width={519}
        height={504}
        aria-hidden
        className="pointer-events-none absolute right-12 bottom-0 -z-10 hidden h-full w-auto max-w-2/5 object-contain object-bottom opacity-60 lg:block"
      />
    </div>
  )
}

LeadFormBlock.displayName = "LeadFormBlock"

export default LeadFormBlock

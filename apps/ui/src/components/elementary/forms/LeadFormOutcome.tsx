"use client"

import {
  ArrowLeft,
  MessageCircleCheck,
  MessageCircleX,
  Phone,
} from "lucide-react"
import { useTranslations } from "next-intl"

import AppLink from "@/components/elementary/AppLink"
import { Typography } from "@/components/typography"
import { contactHref } from "@/lib/contacts"
import { cn } from "@/lib/styles"

export type LeadFormStatus = "idle" | "sent" | "failed"

/** The frame's one button under the message: outlined teal on the dark card. */
const ACTION =
  "border-brand-teal text-brand-inverted hover:bg-brand-teal flex h-10.5 w-full items-center justify-center gap-1.5 rounded-[30px] border bg-transparent px-5 text-base/5.5 font-semibold transition-colors lg:h-12.5 lg:w-fit lg:px-7.5"

/**
 * What the design puts in place of the form once it has been submitted: a
 * mark, a line saying what happened, and the way back.
 *
 * The fields go rather than staying greyed out — the frame draws the outcome
 * alone, and a form still standing after a successful send invites a second
 * one. Where it failed the clinic's numbers are offered beside the apology,
 * because that is the point of the message.
 */
export function LeadFormOutcome({
  status,
  phones,
  onRetry,
  className,
}: {
  readonly status: Exclude<LeadFormStatus, "idle">
  readonly phones?: readonly string[]
  /**
   * Hands the form back with everything still typed in it. The frame drew
   * these states as pages of their own, where going home is the way out; in a
   * block at the foot of a page the reader is already where they wanted to be,
   * and what a failed send owes them is another go at it.
   */
  readonly onRetry?: () => void
  readonly className?: string
}) {
  const t = useTranslations("leadForm")
  const sent = status === "sent"
  const Mark = sent ? MessageCircleCheck : MessageCircleX

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center gap-7.5 text-center lg:gap-10",
        className
      )}
    >
      <Mark
        aria-hidden
        strokeWidth={1.5}
        className={cn(
          "size-38.5 shrink-0 lg:size-25",
          sent ? "text-brand-teal" : "text-brand-alert"
        )}
      />

      <div className="flex flex-col gap-7.5 lg:gap-5">
        {/* Still the section's heading: the outcome takes the pitch's place,
            and a block that loses its heading loses its place in the outline. */}
        <Typography
          tag="h2"
          className="text-brand-inverted mb-0! text-[1.625rem]/7.75! font-normal! lg:text-[2.5rem]/12!"
        >
          {t(`${status}Title`)}
        </Typography>
        <p className="text-brand-inverted text-base/5.5 lg:text-lg/6.25">
          {t(`${status}Body`)}
        </p>
      </div>

      {/* The frame answers "zateleefonuyte nam" with the numbers themselves. */}
      {!sent && phones && phones.length > 0 && (
        <ul className="flex list-none flex-wrap justify-center gap-5">
          {phones.map((phone) => {
            const href = contactHref("phone", phone)

            return (
              <li key={phone}>
                <a
                  href={href ?? undefined}
                  className="text-brand-inverted flex h-9 items-center gap-1.25 rounded-[21px] bg-white/5 px-3 text-sm/5 hover:bg-white/10"
                >
                  <Phone aria-hidden className="size-5 shrink-0" />
                  {phone}
                </a>
              </li>
            )
          })}
        </ul>
      )}

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(ACTION, "cursor-pointer")}
        >
          <ArrowLeft aria-hidden className="size-5" />
          {t("retry")}
        </button>
      ) : (
        <AppLink href="/" variant="outline" className={ACTION}>
          <ArrowLeft aria-hidden className="size-5" />
          {t("backHome")}
        </AppLink>
      )}
    </div>
  )
}

export default LeadFormOutcome

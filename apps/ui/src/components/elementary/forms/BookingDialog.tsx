"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { LeadForm } from "@/components/elementary/forms/LeadForm"
import type { LeadFormStatus } from "@/components/elementary/forms/LeadFormBlock"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/styles"

/**
 * "Записатись" in the header, which the design opens as a card over the page
 * rather than sending the reader to the form in the footer.
 *
 * The dialog's title and description come from the CMS but are not drawn: the
 * design shows the two fields alone. They are still announced, because a
 * dialog with no accessible name leaves a screen-reader user in an unnamed
 * box.
 */
export function BookingDialog({
  label,
  title,
  description,
  gdpr,
  className,
}: {
  readonly label: string
  readonly className?: string
  readonly title?: string | null
  readonly description?: string | null
  readonly gdpr?: { href?: string; label?: string; newTab?: boolean }
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<LeadFormStatus>("idle")
  const t = useTranslations("leadForm")

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setStatus("idle")
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={cn(
            "h-11.5 min-w-46.25 rounded-[30px] px-7.5 text-base font-semibold",
            className
          )}
        >
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-[26px] p-12.5 sm:max-w-158">
        <DialogTitle className="sr-only">{title ?? label}</DialogTitle>
        {description && (
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        )}

        {/* The outcome replaces the form rather than closing the dialog: a
            card that vanishes leaves the reader unsure whether it sent. */}
        {status === "idle" ? (
          <LeadForm gdpr={gdpr} onStatusChange={setStatus} />
        ) : (
          <div role="status" className="flex flex-col gap-4 text-center">
            <p className="text-brand-ink text-2xl font-semibold">
              {t(`${status}Title`)}
            </p>
            <p className="text-brand-body text-base">{t(`${status}Body`)}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BookingDialog

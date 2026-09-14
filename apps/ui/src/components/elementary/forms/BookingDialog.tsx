"use client"

import { useState } from "react"

import { LeadForm } from "@/components/elementary/forms/LeadForm"
import {
  type LeadFormStatus,
  LeadFormOutcome,
} from "@/components/elementary/forms/LeadFormOutcome"
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
  phones,
  className,
}: {
  readonly label: string
  readonly className?: string
  readonly title?: string | null
  readonly description?: string | null
  readonly gdpr?: { href?: string; label?: string; newTab?: boolean }
  /** Offered beside the apology when the request could not be sent. */
  readonly phones?: readonly string[]
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<LeadFormStatus>("idle")

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

      {/* The frame sets this card on the same gradient as the block in the
          page, so the form inside it keeps the one shape it was built for. */}
      <DialogContent className="bg-brand-gradient text-brand-inverted rounded-[26px] border-0 p-7.5 sm:max-w-158 lg:p-12.5">
        <DialogTitle className="sr-only">{title ?? label}</DialogTitle>
        {description && (
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        )}

        {/* The outcome replaces the form rather than closing the dialog: a
            card that vanishes leaves the reader unsure whether it sent. */}
        {status !== "idle" && (
          <LeadFormOutcome
            status={status}
            phones={phones}
            onRetry={status === "failed" ? () => setStatus("idle") : undefined}
          />
        )}

        {/* Hidden rather than unmounted while the outcome shows, so a failed
            send keeps what was typed. */}
        <div hidden={status !== "idle"}>
          <LeadForm gdpr={gdpr} onStatusChange={setStatus} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingDialog

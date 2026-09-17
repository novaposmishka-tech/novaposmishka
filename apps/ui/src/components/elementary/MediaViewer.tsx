"use client"

import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

/**
 * What a picture or a clip opens into: the media alone, across the whole width
 * of a phone and centred at desktop, over everything else.
 *
 * A real `dialog` rather than a div with a high z-index. The browser then
 * holds the focus inside it, closes it on Escape, puts it in the top layer
 * above every other stacking context, and tells a screen reader it is a
 * dialog — four things a div would each need doing by hand.
 */
export function MediaViewer({
  open,
  onClose,
  label,
  children,
}: {
  readonly open: boolean
  readonly onClose: () => void
  /** What is being shown, for a reader who cannot see it. */
  readonly label?: string | null
  readonly children: React.ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const t = useTranslations("general")

  useEffect(() => {
    const node = dialog.current
    if (!node) {
      return
    }

    if (open && !node.open) {
      node.showModal()
    } else if (!open && node.open) {
      node.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialog}
      aria-label={label ?? undefined}
      // `close` fires for Escape and for the close() above alike, so the state
      // above follows the dialog rather than the other way round.
      onClose={onClose}
      // Pressing the backdrop closes it. The press lands on the dialog itself
      // only when it is outside the panel, which is what the backdrop is.
      onClick={(event) => {
        if (event.target === dialog.current) {
          onClose()
        }
      }}
      className="max-h-none max-w-none bg-transparent backdrop:bg-black/80 open:fixed open:inset-0 open:flex open:h-full open:w-full open:items-center open:justify-center"
    >
      {/* A definite width, not one taken from the contents: an auto-width
          panel lets a small picture stay small, which is the opposite of
          opening it. */}
      <div className="relative w-full lg:max-w-4xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute -top-12 right-3.75 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 lg:-top-14 lg:right-0 lg:size-12.5"
        >
          <X aria-hidden className="size-6" />
        </button>

        {children}
      </div>
    </dialog>
  )
}

export default MediaViewer

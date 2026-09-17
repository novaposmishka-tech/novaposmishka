"use client"

import { useState } from "react"

import { MediaViewer } from "@/components/elementary/MediaViewer"
import { cn } from "@/lib/styles"

/**
 * A photograph that opens over the page when pressed, at the full width of a
 * phone — the same thing a clip does, which is what the design review asked
 * for: "щоб їх можна було відкрити, як відео, на всю ширину екрану".
 *
 * A button rather than a link: there is nothing to navigate to, and without
 * script the picture is simply a picture, which is the honest fallback.
 */
export function ZoomableImage({
  label,
  className,
  children,
}: {
  /** What the photograph shows, for a reader who cannot see it. */
  readonly label?: string | null
  readonly className?: string
  /** The picture itself, drawn the same in the page and in the viewer. */
  readonly children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label ?? undefined}
        aria-haspopup="dialog"
        className={cn("block w-full cursor-zoom-in overflow-hidden", className)}
      >
        {children}
      </button>

      <MediaViewer open={open} onClose={() => setOpen(false)} label={label}>
        {/* The same picture, held inside the screen rather than cropped to a
            card's shape. */}
        <div className="[&_img]:max-h-[80vh] [&_img]:w-full [&_img]:rounded-xl [&_img]:object-contain">
          {children}
        </div>
      </MediaViewer>
    </>
  )
}

export default ZoomableImage

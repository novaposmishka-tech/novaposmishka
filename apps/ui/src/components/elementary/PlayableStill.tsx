"use client"

import { Play } from "lucide-react"
import { useState } from "react"

import { MediaViewer } from "@/components/elementary/MediaViewer"
import { cn } from "@/lib/styles"

/**
 * A still with the design's play mark over it, which becomes the clip where it
 * is pressed.
 *
 * It is a link to the file underneath, which is what a reader without script
 * gets — the same thing this did before, opening the clip in a tab. With
 * script the press is caught and the clip takes the still's place instead,
 * which is what the mark over a picture promises.
 */
export function PlayableStill({
  src,
  label,
  poster,
  className,
  markClassName,
}: {
  /** The clip. Without one the still is drawn alone, with no mark over it. */
  readonly src?: string
  /** What the clip is, for a reader who cannot see the still. */
  readonly label?: string | null
  readonly poster: React.ReactNode
  readonly className?: string
  readonly markClassName?: string
}) {
  const [playing, setPlaying] = useState(false)

  if (!src) {
    return <div className={cn("relative", className)}>{poster}</div>
  }

  return (
    <div className={cn("relative", className)}>
      {poster}

      <MediaViewer
        open={playing}
        onClose={() => setPlaying(false)}
        label={label}
      >
        {/* No caption track: the clinic has none for these yet, and the quote
            beside each card carries what is said. One goes on each clip when
            the real films arrive.

            Less curve than the still: the browser draws its own controls hard
            into the corners, and the frame's 30 was cutting the fullscreen and
            picture-in-picture marks and the ends of the scrubber. */}
        <video
          src={src}
          controls
          autoPlay
          playsInline
          aria-label={label ?? undefined}
          className="max-h-[80vh] w-full rounded-xl bg-black object-contain"
        />
      </MediaViewer>

      <a
        href={src}
        target="_blank"
        rel="noreferrer noopener"
        onClick={(event) => {
          // Only the plain press: a modifier or the middle button means the
          // reader asked for a tab, and the link still gives them one.
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.button)
            return
          event.preventDefault()
          setPlaying(true)
        }}
        className="absolute inset-0 flex items-center justify-center rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {/* The mark the design puts on a clip: a black circle at three fifths,
            with a white triangle inside it. */}
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition-transform hover:scale-110",
            markClassName
          )}
        >
          <Play aria-hidden className="size-3.75 fill-current" />
        </span>
        <span className="sr-only">{label}</span>
      </a>
    </div>
  )
}

export default PlayableStill

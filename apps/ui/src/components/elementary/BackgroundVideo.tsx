"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/styles"

/**
 * A clip playing behind a hero.
 *
 * It is decorative, so it is muted, loops, and carries no controls — which is
 * also what every browser requires before it will play a video on its own.
 * The poster is the section's own photograph, so something is on screen while
 * the file loads and for anyone whose browser never gets it.
 *
 * The source is attached after the page has finished loading, never in the
 * markup. A `<video>` in the initial document delays the load event until the
 * browser has the file — and WebKit, which cannot decode our clip, never
 * releases that flag at all, leaving `document.readyState` stuck on
 * "interactive" and `document.fonts.ready` pending forever. Attaching late also
 * keeps several megabytes out of the race with the hero's own paint.
 *
 * It is skipped outright when the reader has asked for less motion. A looping
 * clip behind text is exactly the moving content that request is about, and the
 * photograph underneath says the same thing without moving.
 */
export function BackgroundVideo({
  src,
  poster,
  className,
}: {
  readonly src: string | undefined
  readonly poster?: string | null
  readonly className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!src) {
      return
    }

    if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const attach = () => {
      const video = videoRef.current
      if (!video) {
        return
      }
      video.src = src
      video.load()
    }

    if (document.readyState === "complete") {
      attach()

      return
    }

    addEventListener("load", attach, { once: true })

    return () => removeEventListener("load", attach)
  }, [src])

  if (!src) {
    return null
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster ?? undefined}
      aria-hidden
      tabIndex={-1}
      className={cn("motion-reduce:hidden", className)}
      ref={videoRef}
    />
  )
}

export default BackgroundVideo

"use client"

import { useEffect, useRef, useState } from "react"

/**
 * The frame around a hero that opens on a photograph.
 *
 * The header lies inside it, drawn white on nothing, and stays readable only
 * for as long as the picture is behind it. The design has a second header for
 * everywhere else — the light "Static header" the rest of the site already
 * uses — so this frame says whether the header is still over the photograph and
 * the header takes its colours from that.
 *
 * The two markers are deliberately separate. `data-photo-hero` stands for the
 * whole life of the page: it also pulls the layout up under the header, which
 * must not move as the reader scrolls. `data-photo-hero-top` is the one that
 * comes and goes. It is set on the server as well, so a page that opens at the
 * top draws the transparent header immediately rather than flashing the light
 * one.
 */
export function PhotoHeroFrame({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [overHeader, setOverHeader] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    let observer: IntersectionObserver | undefined

    // The header is 60px tall on a phone and 106 on a desktop, so the line the
    // hero stops covering it at moves with the viewport.
    const watch = () => {
      observer?.disconnect()
      const headerHeight =
        document.querySelector("[data-site-header]")?.getBoundingClientRect()
          .height ?? 0

      observer = new IntersectionObserver(
        (entries) => {
          const last = entries.at(-1)
          if (last) {
            setOverHeader(last.boundingClientRect.top > headerHeight)
          }
        },
        { rootMargin: `-${Math.round(headerHeight)}px 0px 0px 0px` }
      )
      observer.observe(sentinel)
    }

    watch()
    addEventListener("resize", watch)

    return () => {
      observer?.disconnect()
      removeEventListener("resize", watch)
    }
  }, [])

  return (
    // Square at the top, where the photo runs under the header, and curved at
    // the bottom where the white page begins — the mask in the design is
    // [0, 0, 50, 50].
    <div
      data-photo-hero
      data-photo-hero-top={overHeader ? "" : undefined}
      className="relative isolate overflow-hidden rounded-b-[50px] text-white"
    >
      {children}
      {/* The bottom edge of the picture, watched rather than measured. */}
      <div
        ref={sentinelRef}
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
      />
    </div>
  )
}

export default PhotoHeroFrame

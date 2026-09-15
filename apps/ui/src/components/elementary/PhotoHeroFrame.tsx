"use client"

import { useEffect, useRef, useState } from "react"

/**
 * The frame around a hero that opens on a photograph.
 *
 * The header lies inside it, drawn white on nothing while the page is at rest
 * at the top. A photograph is not a background: it has light patches, and the
 * words of the header fall on whatever happens to be under them as the reader
 * moves. So the transparency lasts exactly as long as the page has not been
 * scrolled — at the first movement the header takes the light "Static header"
 * the rest of the site uses.
 *
 * The two markers are deliberately separate. `data-photo-hero` stands for the
 * whole life of the page: it also pulls the layout up under the header, which
 * must not move as the reader scrolls. `data-photo-hero-top` is the one that
 * comes and goes. It is set on the server as well, so a page opens on the
 * transparent header immediately rather than flashing the light one.
 */
export function PhotoHeroFrame({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [atTop, setAtTop] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    // The sentinel is the first pixel of the page, and the page counts as at
    // rest only while the whole of it shows — hence the threshold. Asking
    // merely that it be on screen would leave the header transparent for the
    // first pixel of the scroll, since a box is still intersecting when only a
    // sliver of it is left. An observer rather than a scroll listener: the
    // browser reports the crossing itself instead of us asking on every frame.
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries.at(-1)
        if (last) {
          setAtTop(last.intersectionRatio >= 1)
        }
      },
      { threshold: 1 }
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [])

  return (
    // Square at the top, where the photo runs under the header, and curved at
    // the bottom where the white page begins — the mask in the design is
    // [0, 0, 50, 50].
    <div
      data-photo-hero
      data-photo-hero-top={atTop ? "" : undefined}
      className="relative isolate overflow-hidden rounded-b-[50px] text-white"
    >
      {/* The top edge of the page, watched rather than measured. */}
      <div
        ref={sentinelRef}
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
      />
      {children}
    </div>
  )
}

export default PhotoHeroFrame

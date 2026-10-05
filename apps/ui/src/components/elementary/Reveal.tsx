"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A block that rises into place as the reader scrolls to it.
 *
 * The block is in the page from the start, only transparent, and the
 * stylesheet does the rising; this just marks the moment it comes into view.
 * Anything already scrolled past when the page lands on an anchor is shown
 * at once rather than left waiting for a scroll back up. Without script, or
 * for a reader who asked for less motion, the stylesheet never hides it at
 * all — see the `data-reveal` rules in globals.css.
 */
export function Reveal({
  className,
  children,
}: {
  readonly className?: string
  readonly children: React.ReactNode
}) {
  const node = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = node.current
    if (!element || shown) return

    let frame = 0
    const show = () => {
      setShown(true)
      observer.disconnect()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting) {
          show()

          return
        }

        // Above the viewport: scrolled past, so show it without the rise — but
        // only once the page has settled. A route change renders the new page
        // at the old scroll position and jumps to the top a frame later, and a
        // block that only looked passed at the first frame must keep waiting.
        if (entry.boundingClientRect.top < 0) {
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
              if (element.getBoundingClientRect().top < 0) show()
            })
          })
        }
      },
      // A little past the bottom edge, so a block starts rising once it is
      // genuinely on screen rather than the moment a pixel of it is.
      { rootMargin: "0px 0px -10% 0px" }
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [shown])

  return (
    <div ref={node} data-reveal={shown ? "in" : ""} className={className}>
      {children}
    </div>
  )
}

export default Reveal

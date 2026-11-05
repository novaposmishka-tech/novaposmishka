"use client"

import { useEffect } from "react"

import { linkEvent, linkLocation, trackEvent } from "@/lib/analytics"

/**
 * Reports clicks on the links that matter to the clinic — calls, messengers,
 * the way to the form — from one listener on the document, so every number
 * and button on the site is counted, including ones added later, without each
 * having to report itself.
 */
export function AnalyticsClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null
      const described = link ? linkEvent(link.getAttribute("href") ?? "") : null

      if (link && described) {
        trackEvent(described.event, {
          ...described.params,
          link_location: linkLocation(link),
        })
      }
    }

    // Capture, so a link whose own handler stops the click is still counted.
    document.addEventListener("click", onClick, { capture: true })

    return () =>
      document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return null
}

export default AnalyticsClickTracker

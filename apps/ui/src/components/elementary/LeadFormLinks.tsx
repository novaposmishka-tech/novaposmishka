"use client"

import { useEffect } from "react"

import { LEAD_FORM_ANCHOR } from "@/lib/analytics"

/**
 * Makes every link to the form on this page scroll to it, however many times
 * it is pressed, and leaves the address without the fragment.
 *
 * Left to the browser and Next's router, the first press put
 * `#lead-form-section` in the address and the next ones, the URL being the
 * same, went part of the way or nowhere: a visitor who read on and came back
 * to book could not reach the form. With the fragment gone, a reload after
 * such a press stays where the reader is, too. (A visitor who came to the form
 * from another page keeps the fragment until they press a link here.)
 *
 * One listener on the document, as the click tracker does, so the header's
 * button, the sections' buttons and the floating one all behave alike. In the
 * capture phase, so it runs before a Next link's own handler, which then sees
 * the click already handled and does not navigate. The tracker still counts
 * it: a prevented click goes on to every other listener.
 *
 * Only for a link to the page already open. A link from another page to
 * `/#lead-form-section` is a real navigation and goes through as one.
 */
export function LeadFormLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null

      // A link meant for another window or frame, or for saving, is the
      // browser's to follow.
      if (
        !link ||
        (link.target && link.target !== "_self") ||
        link.hasAttribute("download")
      ) {
        return
      }

      const url = new URL(link.href, window.location.href)

      // The same page down to its query: a link that changes the query is a
      // navigation, even when it ends at the form.
      if (
        url.hash !== LEAD_FORM_ANCHOR ||
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search
      ) {
        return
      }

      const form = document.getElementById(LEAD_FORM_ANCHOR.slice(1))

      if (!form) {
        return
      }

      event.preventDefault()
      // Smooth through the page's own scroll-behavior, and to the same spot
      // a plain jump lands on: scrollIntoView honours the scroll margins.
      form.scrollIntoView({ block: "start" })
      // Following a fragment moves the keyboard's place to its target, so the
      // next Tab reaches the fields and a screen reader announces the form.
      // Prevented, the click would leave it on the link; this puts it back.
      form.focus({ preventScroll: true })

      if (window.location.hash) {
        // Next keeps its own state in the history entry; it goes back as it
        // was, only the address changes.
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname + window.location.search
        )
      }
    }

    document.addEventListener("click", onClick, { capture: true })

    return () =>
      document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return null
}

export default LeadFormLinks

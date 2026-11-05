/**
 * Events for Google Tag Manager. The site only reports what happened, on the
 * page's dataLayer; which of it reaches GA4, and under what name, is decided
 * in the container.
 */

type EventParams = Record<string, string | number | undefined>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * The container's snippet creates the dataLayer as soon as the page is
 * interactive. Before that, or where no container is configured — locally,
 * for one — there is no one to tell, and the event is dropped.
 */
export function trackEvent(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") {
    return
  }

  window.dataLayer?.push({ event, ...params })
}

/** The form at the foot of every page, which every booking button leads to. */
export const LEAD_FORM_ANCHOR = "#lead-form-section"

/**
 * What a click on a link means to the clinic, read from where it goes: a call,
 * a message, a step towards the form. Links that mean none of these — the
 * site's own pages — are not reported; page views already cover them.
 */
export function linkEvent(
  href: string
): null | { event: string; params: EventParams } {
  const url = href.trim()

  if (url.startsWith("tel:")) {
    return { event: "phone_click", params: { phone_number: url.slice(4) } }
  }

  if (url.startsWith("mailto:")) {
    return { event: "email_click", params: {} }
  }

  if (url.endsWith(LEAD_FORM_ANCHOR)) {
    return { event: "booking_click", params: {} }
  }

  const messenger = messengerOf(url)

  return messenger ? { event: "messenger_click", params: { messenger } } : null
}

function messengerOf(url: string) {
  if (/^(?:https?:\/\/)?(?:t\.me|telegram\.me)\//i.test(url)) {
    return "telegram"
  }

  if (/^(?:https?:\/\/)?(?:wa\.me|(?:api\.)?whatsapp\.com)\//i.test(url)) {
    return "whatsapp"
  }

  if (url.startsWith("viber:")) {
    return "viber"
  }

  return /^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i.test(url)
    ? "instagram"
    : undefined
}

/**
 * Which part of the page a link sits in, so a report can tell the header's
 * number from the floating button's. A component that is neither in the
 * header nor the footer names itself with `data-analytics-location`.
 */
export function linkLocation(element: Element): string {
  const named = element.closest<HTMLElement>("[data-analytics-location]")

  if (named?.dataset.analyticsLocation) {
    return named.dataset.analyticsLocation
  }

  if (element.closest("header[data-site-header]")) {
    return "header"
  }

  return element.closest("footer") ? "footer" : "page"
}

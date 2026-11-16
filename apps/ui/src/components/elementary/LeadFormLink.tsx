"use client"

import type React from "react"

/** How long the page takes to scroll down to the form before the focus lands. */
const SCROLL_MS = 700

/**
 * A link to the booking form that also puts the reader in its first field.
 *
 * The anchor does the scrolling, smoothly, as every link to the form does;
 * this adds what the design asks of "ask a question" — that on arrival the
 * cursor is already in the name field. Without script it is the plain anchor.
 */
export function LeadFormLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { readonly href: string }) {
  return (
    <a
      href={href}
      {...props}
      onClick={() => {
        setTimeout(() => {
          document
            .querySelector<HTMLInputElement>(`${href} input[name="name"]`)
            // The page is already scrolling there; focusing must not jump it.
            ?.focus({ preventScroll: true })
        }, SCROLL_MS)
      }}
    >
      {children}
    </a>
  )
}

export default LeadFormLink

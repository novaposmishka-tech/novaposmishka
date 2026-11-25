"use client"

import type { Data } from "@repo/strapi-types"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { usePathname } from "@/lib/navigation"
import { cn } from "@/lib/styles"

const LINK = "text-brand-ink h-auto w-fit p-0 text-base/5.5 font-normal"

/**
 * The footer's row of links. The one for the page the reader is on is not a
 * link at all — there is nowhere for it to go — but the same words in the
 * brand teal and semibold, as the header marks its current item, and named as
 * the current page for screen readers. Only the page itself counts: under
 * /poslugy/terapiia the link to /poslugy stays a link.
 *
 * Client-side because which page is current is the URL's to say, and the rest
 * of the footer is rendered once for every page.
 */
export function FooterLinks({
  links,
}: {
  readonly links: readonly Data.Component<"utilities.link">[]
}) {
  const pathname = usePathname()

  return (
    <nav className="grid w-full grid-flow-col grid-cols-2 grid-rows-3 gap-x-20 gap-y-4 lg:flex lg:justify-between lg:gap-0">
      {links.map((link) =>
        link.type === "page" && link.page?.fullPath === pathname ? (
          <span
            key={link.id}
            aria-current="page"
            className={cn(LINK, "text-brand-teal font-semibold")}
          >
            {link.label}
          </span>
        ) : (
          <StrapiLink
            key={link.id}
            component={link}
            // Regular, as the frame sets them; the link variant would make
            // them medium.
            className={cn(LINK, "hover:text-brand-teal")}
          />
        )
      )}
    </nav>
  )
}

export default FooterLinks

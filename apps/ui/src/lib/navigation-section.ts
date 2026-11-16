import type { Data } from "@repo/strapi-types"

type Link = Data.Component<"utilities.link"> | null | undefined

const pagePath = (link: Link) =>
  link?.type === "page" ? (link.page?.fullPath ?? undefined) : undefined

/**
 * Whether the reader is on the page a link leads to, or on a page under it:
 * "Терапія" stays lit on /poslugy/terapiia/likuvannia-kariiesu.
 */
export function isWithinLink(link: Link, pathname: string) {
  const fullPath = pagePath(link)

  return (
    fullPath != null &&
    (pathname === fullPath ||
      (fullPath !== "/" && pathname.startsWith(fullPath + "/")))
  )
}

/**
 * Whether the reader is inside the section a dropdown stands for: on the
 * page that heads it, or on or under any page it lists.
 */
export function isWithinSection(
  item: { link?: Link; categoryItems?: Link[] | null },
  pathname: string
) {
  return (
    isWithinLink(item.link, pathname) ||
    Boolean(item.categoryItems?.some((link) => isWithinLink(link, pathname)))
  )
}

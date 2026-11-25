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

/**
 * Of the links in one list, the one the reader is most precisely on: the
 * longest path that holds the current page. "Терапія" beats a row for the
 * index of all services on /poslugy/terapiia and the pages under it, so only
 * one row of a dropdown is lit.
 */
export function currentLink<T extends Link>(
  links: readonly T[],
  pathname: string
): T | undefined {
  let best: T | undefined
  let bestLength = -1

  for (const link of links) {
    const fullPath = pagePath(link)

    if (
      fullPath != null &&
      isWithinLink(link, pathname) &&
      fullPath.length > bestLength
    ) {
      best = link
      bestLength = fullPath.length
    }
  }

  return best
}

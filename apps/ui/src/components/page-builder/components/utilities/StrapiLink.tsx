import type { Data } from "@repo/strapi-types"
import type React from "react"

import AppLink from "@/components/elementary/AppLink"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export interface StrapiLinkProps {
  readonly component: Data.Component<"utilities.link"> | undefined | null
  readonly children?: React.ReactNode
  readonly className?: string
  readonly onClick?: () => void
}
export const getStrapiLinkHref = (
  component?: Data.Component<"utilities.link"> | null
) => {
  // Add more when needed
  switch (component?.type) {
    case "external":
      return component.href
    case "page":
      return component.page?.fullPath ?? "#"

    default:
      return
  }
}

/**
 * True of a link that has somewhere to go: a URL, or a page that is there.
 * A link to a page that was unpublished or never chosen resolves to "#", and
 * a block that is nothing but its link should not be drawn around that.
 */
export const strapiLinkResolves = (
  component?: Data.Component<"utilities.link"> | null
) =>
  Boolean(
    component?.type === "external" ? component.href : component?.page?.fullPath
  )

/**
 * Where a link leads, or nothing where it leads nowhere — what a block wants
 * when it draws a button only for a link that works.
 */
export const resolvedStrapiHref = (
  component?: Data.Component<"utilities.link"> | null
) =>
  strapiLinkResolves(component)
    ? (getStrapiLinkHref(component) ?? undefined)
    : undefined

export function StrapiLink({
  component,
  children,
  className,
  onClick,
}: StrapiLinkProps) {
  if (component == null) {
    return null
  }

  const { newTab = false, label, decorations } = component ?? {}

  const {
    variant = "link",
    size = "default",
    leftIcon,
    rightIcon,
    hasIcons = false,
    disableAnimations = false,
  } = decorations ?? {}

  const linkHref = getStrapiLinkHref(component)

  if (!linkHref) {
    return children ?? label ?? null
  }

  return (
    <AppLink
      href={linkHref}
      openInNewTab={newTab ?? false}
      disableAnimations={disableAnimations ?? false}
      className={className}
      onClick={onClick}
      startAdornment={
        hasIcons && leftIcon ? (
          <StrapiBasicImage
            component={leftIcon}
            fill
            sizes="32px"
            className="size-full object-contain"
          />
        ) : undefined
      }
      endAdornment={
        hasIcons && rightIcon ? (
          <StrapiBasicImage
            component={rightIcon}
            fill
            sizes="32px"
            className="size-full object-contain"
          />
        ) : undefined
      }
      variant={variant}
      size={size}
    >
      {children ?? label}
    </AppLink>
  )
}

StrapiLink.displayName = "StrapiLink"

export default StrapiLink

import type { Metadata } from "next"
import type { Locale } from "next-intl"
import type { getTranslations } from "next-intl/server"

import { routing } from "@/lib/navigation"

type TranslateFn = Awaited<ReturnType<typeof getTranslations>>

/**
 * Reads a catalog value, treating blank as absent.
 *
 * Some of these fields only apply once the clinic actually has the thing — an
 * Open Graph image, a Twitter account. Emitting them empty would put
 * `<meta content="">` in the head, so a blank entry means "leave the tag out".
 */
const optional = (t: TranslateFn, key: string): string | undefined => {
  const value = t(key)

  return value.trim().length > 0 ? value : undefined
}

export function getDefaultMetadata(siteUrl: string, t: TranslateFn) {
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: optional(t, "keywords"),
    robots: optional(t, "metaRobots"),
    applicationName: optional(t, "applicationName"),

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "16x16 32x32" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
    },

    metadataBase: new URL(siteUrl),
  } as Metadata
}

export function getDefaultOgMeta(
  locale: Locale | undefined,
  fullPath: string | undefined,
  t: TranslateFn
): Metadata["openGraph"] {
  const image = optional(t, "og.image")

  return {
    type: "website",
    locale: locale,
    siteName: optional(t, "og.siteName"),
    title: optional(t, "og.title"),
    description: optional(t, "og.description"),
    ...(image && { images: [image] }),
    url: [routing.defaultLocale !== locale ? locale : null, fullPath ?? ""]
      .filter(Boolean)
      .join("/"),
  }
}

export function getDefaultTwitterMeta(t: TranslateFn): Metadata["twitter"] {
  const image = optional(t, "twitter.imageUrl")

  return {
    card: optional(t, "twitter.card"),
    title: optional(t, "twitter.title"),
    description: optional(t, "twitter.description"),
    siteId: optional(t, "twitter.siteId"),
    creator: optional(t, "twitter.creator"),
    creatorId: optional(t, "twitter.creatorId"),
    ...(image && { images: [image] }),
  } as Metadata["twitter"]
}

import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import { draftMode } from "next/headers"
import type { Locale } from "next-intl"

import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"
import type { CustomFetchOptions } from "@/types/general"

/**
 * How long Strapi content is trusted before Next fetches it again: a day.
 *
 * The site does not need a timer to pick up edits — Strapi tells it the
 * moment something is published, through the strapi-revalidate route, and
 * that clears every fetch carrying the type's tag. The timer is only a
 * backstop in case a signal is lost. It used to be one to ten minutes, and on
 * Vercel every expiry a crawler ran into rebuilt the page and wrote it to the
 * cache again: some 20,000 cache writes a day for a site that changes a few
 * times a month, which is what took the Hobby plan over its limits.
 *
 * The page route's `revalidate` repeats this number as a literal and has to
 * be changed with it.
 */
const CMS_CACHE_SECONDS = 86_400

const PAGE_TAG = strapiCacheTag("api::page.page")

/**
 * The cache policy every public Strapi read shares: the day-long backstop
 * unless the caller asks for something else, and the tags a publish clears,
 * added to any the caller brought. A caller's own `cache` setting is left to
 * the base client, which drops `revalidate` beside it.
 */
function cmsCache(
  requestInit: RequestInit | undefined,
  tags: string[]
): RequestInit {
  return {
    ...requestInit,
    next: {
      ...requestInit?.next,
      revalidate: requestInit?.next?.revalidate ?? CMS_CACHE_SECONDS,
      tags: [...new Set([...(requestInit?.next?.tags ?? []), ...tags])],
    },
  }
}

/**
 * A read that skips the cache whatever the caller passed: draft content, which
 * no publish signal will ever clear.
 */
function uncached(requestInit: RequestInit | undefined): RequestInit {
  const { next: _next, ...rest } = requestInit ?? {}

  return { ...rest, cache: "no-store" }
}

/**
 * Logs a failed Strapi read and throws it on. Returning nothing instead would
 * let Next cache the empty render — a page turned 404, or one without its menu
 * and footer — for the whole day-long window. A thrown error is not cached:
 * visitors keep getting the last good copy until a rebuild succeeds.
 *
 * Content that is simply missing is not an error here: Strapi answers with no
 * data, and the page's 404 is real.
 */
function rethrow(message: string, e: unknown): never {
  logNonBlockingError({
    message,
    error: {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    },
  })

  throw e instanceof Error ? e : new Error(String(e))
}

// ------ Page fetching functions
export async function fetchPage(
  fullPath: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  const dm = await draftMode()

  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      fullPath,
      {
        locale,
        status: dm.isEnabled ? "draft" : "published",
        populate: { seo: "smart", content: "smart" },
      },
      // A draft is never cached: saving one sends no signal, so a cached
      // draft would leave the editor's preview a day behind their edits.
      dm.isEnabled ? uncached(requestInit) : cmsCache(requestInit, [PAGE_TAG]),
      options
    )
  } catch (e: unknown) {
    rethrow(`Error fetching page '${fullPath}' for locale '${locale}'`, e)
  }
}

export async function fetchAllPages(
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  locale?: Locale,
  params?: Record<string, unknown>,
  requestInit?: RequestInit
) {
  try {
    return await PublicStrapiClient.fetchAll(
      uid,
      {
        locale,
        fields: ["fullPath", "locale", "updatedAt", "createdAt", "slug"],
        populate: {},
        status: "published",
        ...params,
      },
      cmsCache(requestInit, [PAGE_TAG])
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching all pages for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return { data: [] }
  }
}

// ------ SEO fetching functions

export async function fetchSeo(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  fullPath: string | null,
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      uid,
      fullPath,
      {
        locale,
        populate: {
          seo: "smart",
          localizations: true,
        },
      },
      cmsCache(undefined, [PAGE_TAG])
    )
  } catch (e: unknown) {
    rethrow(
      `Error fetching SEO for '${uid}' with fullPath '${fullPath}' for locale '${locale}'`,
      e
    )
  }
}

// ------ Navbar fetching functions

export async function fetchNavbar(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne(
      "api::navbar.navbar",
      undefined,
      {
        locale,
        populate: {
          logoImage: "smart",
          primaryButtons: "smart",
          navbarItems: "smart",
          phones: "smart",
          bookingForm: "smart",
          menuButton: "smart",
        },
      },
      // The menu links to pages by their path, so a page that is renamed or
      // moved has to clear it too.
      cmsCache(undefined, [strapiCacheTag("api::navbar.navbar"), PAGE_TAG])
    )
  } catch (e: unknown) {
    rethrow(`Error fetching navbar for locale '${locale}'`, e)
  }
}

// ------ Footer fetching functions

export async function fetchFooter(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne(
      "api::footer.footer",
      undefined,
      {
        locale,
        populate: {
          sections: "smart",
          logoImage: "smart",
          links: "smart",
          leadForm: "smart",
          contacts: "smart",
          rating: "smart",
          socials: "smart",
        },
      },
      // Its links point at pages too, so it goes stale with them.
      cmsCache(undefined, [strapiCacheTag("api::footer.footer"), PAGE_TAG])
    )
  } catch (e: unknown) {
    rethrow(`Error fetching footer for locale '${locale}'`, e)
  }
}

// ------ Redirect fetching functions

export async function fetchRedirects() {
  try {
    // fetchAll paginates through every page — a redirect list capped at one
    // page would silently drop redirects beyond the page size (easy to hit
    // after a site migration).
    const response = await PublicStrapiClient.fetchAll(
      "api::redirect.redirect",
      {
        status: "published",
      },
      {
        // Redirects are cached in-process by `src/lib/redirects.ts`. Avoid
        // stacking Next's Data Cache underneath it, because proxy refreshes
        // should decide freshness from the local stale-while-refresh cache.
        cache: "no-store",
      }
    )

    return response.data
  } catch (e: unknown) {
    logNonBlockingError({
      message: "Error fetching redirects",
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    // Rethrow instead of returning [] — the redirect cache must distinguish
    // "no redirects exist" from "Strapi unreachable". An empty list here would
    // be cached and wipe the last known good redirects for a full TTL.
    throw e instanceof Error ? e : new Error(String(e))
  }
}

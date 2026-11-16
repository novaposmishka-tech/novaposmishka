import { getEnvVar } from "@/lib/env-vars"
import { isDevelopment, isProduction } from "@/lib/general-helpers"

/**
 * The Strapi filter for pages a search engine may list: those without an SEO
 * component, or whose robots setting keeps it out of search in no spelling —
 * neither noindex in any form ("noindex", "NOINDEX", "noindex, nofollow") nor
 * "none", the shorthand for noindex and nofollow together. The sitemap and
 * /llms.txt list the same pages, so they share it.
 *
 * A function, so each caller gets an object of its own to pass on.
 */
export const indexablePagesFilter = () => ({
  $or: [
    // No seo component configured -> include
    { seo: { $null: true } },
    // seo.metaRobots set, and to neither a variant of noindex nor "none"
    { seo: { metaRobots: { $notContainsi: "noindex", $nei: "none" } } },
    // seo.metaRobots is null/undefined -> include
    { seo: { metaRobots: { $null: true } } },
  ],
})

/**
 * Whether the files that describe the site to crawlers — the sitemap and
 * /llms.txt — are served here: in production and local development, never on
 * a preview deployment, and only where the site knows its public address.
 */
export const servesSeoFiles = () =>
  (isProduction() || isDevelopment()) && Boolean(getEnvVar("APP_PUBLIC_URL"))

import { ROOT_PAGE_PATH } from "@repo/shared-data"
import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { buildLlmsTxt, type LlmsContact, type LlmsPage } from "@/lib/llms-txt"
import { logError } from "@/lib/logging"
import { createPublicFullPath, routing } from "@/lib/navigation"
import { indexablePagesFilter, servesSeoFiles } from "@/lib/seo-filters"
import {
  fetchAllPagesOrThrow,
  fetchFooter,
} from "@/lib/strapi-api/content/server"

// The pages and the footer are read at request time and served from the
// CMS cache, which every publish clears — so a new sub-service shows up here
// without a rebuild, as it does in the sitemap.
export const dynamic = "force-dynamic"

/** A failed read, kept out of every cache so the next request tries again. */
const UNCACHED = "no-store"

/**
 * /llms.txt: the clinic and its pages, described for a language model.
 *
 * Built from the same published, indexable pages the sitemap lists, with
 * each page's short name and its meta description. Served only where the
 * sitemap is — production and local development — so a preview deployment
 * does not describe itself as the clinic.
 */
export async function GET() {
  if (!servesSeoFiles()) {
    return new Response("Not found", { status: 404 })
  }

  const locale = routing.defaultLocale
  const [tClinic, tLlms, published, footer] = await Promise.all([
    // No locale segment here; the request config falls back to the site's
    // one language.
    getTranslations("clinic"),
    getTranslations("llms"),
    pagesOf(locale),
    footerOf(locale),
  ])

  // Without the pages there is nothing to describe: say so rather than
  // describe the clinic as a site with no pages.
  if (!published) {
    return new Response("Service unavailable", {
      status: 503,
      headers: { "Cache-Control": UNCACHED, "Retry-After": "300" },
    })
  }

  // The homepage gives the file its summary. It may be missing — kept out of
  // search, or not yet published — and the file is then just without one.
  const home = published.find((page) => page.fullPath === ROOT_PAGE_PATH)

  const pages: LlmsPage[] = published.map((page) => ({
    path: page.fullPath,
    // A page with no locale on it is in the site's one language.
    url: createPublicFullPath(page.fullPath, page.locale ?? locale),
    // The short name — "Лікування карієсу" rather than the hero's
    // "… в Житомирі" — is what reads as a list.
    title: page.breadcrumbTitle || page.title || page.fullPath,
    description: page.seo?.metaDescription,
  }))

  const contacts: LlmsContact[] = (footer?.contacts ?? []).map((contact) => ({
    label: contact.label ?? "",
    lines: (contact.values ?? []).flatMap((value) =>
      value.text ? [value.text] : []
    ),
  }))
  // Shown wherever the footer shows it — any score, zero included. Strapi
  // can send a decimal as a string, so it is read as a number first.
  const score = Number(footer?.rating?.score)
  if (footer?.rating?.score != null && Number.isFinite(score)) {
    contacts.push({
      label: footer.rating.label ?? "",
      lines: [score.toFixed(1)],
    })
  }

  const body = buildLlmsTxt({
    name: `${tClinic("name")} — ${tClinic("tagline")}`,
    summary: home?.seo?.metaDescription,
    contacts,
    pages,
    labels: { contacts: tLlms("contacts"), other: tLlms("other") },
  })

  return new Response(body, {
    headers: {
      // Plain text, as the proposal serves it: a browser shows it rather
      // than downloading it, and the Markdown inside reads as written.
      "Content-Type": "text/plain; charset=utf-8",
      // A file missing its contacts is not kept, so the next request can
      // have them once the footer is back.
      ...(footer === undefined && { "Cache-Control": UNCACHED }),
    },
  })
}

type Page = Data.ContentType<"api::page.page">
type ListedPage = Page & { fullPath: string }

/** The published, indexable pages with a path, or null if the read failed. */
async function pagesOf(locale: Locale): Promise<ListedPage[] | null> {
  try {
    const response = await fetchAllPagesOrThrow("api::page.page", locale, {
      fields: ["fullPath", "locale", "title", "breadcrumbTitle"],
      populate: { seo: { fields: ["metaDescription", "metaRobots"] } },
      filters: indexablePagesFilter(),
    })

    // fetchAll is typed for the fields it asks for by default; the ones
    // asked for above are a page's own.
    return (response.data as unknown as Page[]).filter(
      (page): page is ListedPage => Boolean(page.fullPath)
    )
  } catch (error) {
    logError(error, "[llms.txt] Pages could not be read")

    return null
  }
}

/**
 * The footer, for the contacts, or undefined if the read failed. Without it
 * the file still lists the pages, so a failure here leaves that section out
 * rather than the whole file.
 */
async function footerOf(locale: Locale) {
  try {
    return (await fetchFooter(locale))?.data ?? null
  } catch (error) {
    logError(error, "[llms.txt] Footer could not be read")

    return
  }
}

import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { ChevronRight, House } from "lucide-react"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { generateBreadcrumbListSchema } from "@/lib/metadata/schemas"
import { cn } from "@/lib/styles"
import type { BreadCrumb } from "@/types/api"

interface Props {
  readonly breadcrumbs?: BreadCrumb[]
  readonly className?: string
  readonly locale: Locale
  /** True where the trail sits on a photograph and has to be read in white. */
  readonly onPhoto?: boolean
}

/**
 * The trail the design puts under the header on every page but the homepage: a
 * house standing for the homepage, then the page you are on.
 *
 * Strapi builds the trail from each page's `parent`, and a page with no parent
 * comes back naming only itself. The homepage is every other page's parent
 * whether or not an editor has said so, so it is added here rather than left to
 * the content — a trail of one is not a trail.
 */
export async function Breadcrumbs({
  breadcrumbs,
  className,
  locale,
  onPhoto,
}: Props) {
  const trail = withRoot(breadcrumbs)
  const [root, ...rest] = trail ?? []

  if (!root || rest.length === 0) {
    return null
  }

  const t = await getTranslations("breadcrumbs")

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "flex items-center gap-1.25 py-5 text-sm/5 lg:py-7.5",
        className
      )}
    >
      <StrapiStructuredData
        structuredData={generateBreadcrumbListSchema([root, ...rest], locale)}
      />

      <AppLink
        href={root.fullPath}
        className="text-brand-on-dark hover:text-brand-teal h-auto p-0"
      >
        <House aria-hidden className="size-5" />
        <span className="sr-only">{root.title || t("home")}</span>
      </AppLink>

      {rest.map((crumb, index) => (
        <span key={crumb.fullPath} className="flex items-center gap-1.25">
          <ChevronRight aria-hidden className="text-brand-on-dark size-6" />

          {index === rest.length - 1 ? (
            <span
              aria-current="page"
              className={cn(
                "font-semibold",
                onPhoto ? "text-brand-inverted" : "text-brand-ink"
              )}
            >
              {crumb.title}
            </span>
          ) : (
            <AppLink
              href={crumb.fullPath}
              className="text-brand-on-dark hover:text-brand-teal h-auto p-0 font-normal"
            >
              {crumb.title}
            </AppLink>
          )}
        </span>
      ))}
    </nav>
  )
}

/**
 * The trail with the homepage in front of it, or nothing at all where there is
 * no page to point back from — the homepage itself, or a page Strapi could not
 * place in the hierarchy.
 */
function withRoot(breadcrumbs?: BreadCrumb[]) {
  const crumbs = breadcrumbs?.filter((crumb) => crumb.fullPath) ?? []

  if (crumbs.length === 0 || crumbs[0]?.fullPath === ROOT_PAGE_PATH) {
    return crumbs
  }

  return [{ title: "", fullPath: ROOT_PAGE_PATH }, ...crumbs]
}

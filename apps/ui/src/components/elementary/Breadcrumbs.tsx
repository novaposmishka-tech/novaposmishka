import type { Locale } from "next-intl"

import AppLink from "@/components/elementary/AppLink"
import { Container } from "@/components/elementary/Container"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { generateBreadcrumbListSchema } from "@/lib/metadata/schemas"
import { cn } from "@/lib/styles"
import type { BreadCrumb } from "@/types/api"

interface Props {
  readonly breadcrumbs?: BreadCrumb[]
  readonly className?: string
  readonly locale: Locale
}

export function Breadcrumbs({ breadcrumbs, className, locale }: Props) {
  // A single crumb is the current page pointing at itself — it tells the reader
  // nothing and puts a one-item BreadcrumbList in the page's structured data.
  // The homepage is the case that always hits this.
  if (!breadcrumbs || breadcrumbs.length < 2) {
    return null
  }

  const breadcrumbListSchema = generateBreadcrumbListSchema(breadcrumbs, locale)

  return (
    <Container className={cn("mt-6 mb-10 md:mb-20", className)}>
      <StrapiStructuredData structuredData={breadcrumbListSchema} />
      <div>
        {breadcrumbs.map((breadcrumb, index) => (
          <span key={breadcrumb.fullPath}>
            {index !== 0 && (
              <span className={cn("text-primary mx-2 inline-block")}>/</span>
            )}

            {index === breadcrumbs.length - 1 ? (
              <span
                className={cn(
                  "tracking-sm text-primary inline-block text-xs leading-4.5 wrap-break-word md:text-sm md:leading-5.25"
                )}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  display: "inline",
                }}
              >
                {breadcrumb.title}
              </span>
            ) : (
              <AppLink href={breadcrumb.fullPath} className="p-0">
                <span
                  className={cn(
                    "tracking-sm text-primary inline-block text-xs leading-4.5 md:text-sm md:leading-5.25"
                  )}
                >
                  {breadcrumb.title}
                </span>
              </AppLink>
            )}
          </span>
        ))}
      </div>
    </Container>
  )
}

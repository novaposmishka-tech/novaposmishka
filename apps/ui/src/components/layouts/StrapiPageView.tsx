import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { PageContentComponents } from "@/components/page-builder"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { logger } from "@/lib/logging"
import { fetchPage } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

interface Props {
  params: {
    locale: string
    rest?: string[]
  }
  searchParams?: Record<string, string | string[] | undefined>
}

export default function StrapiPageView({ params, searchParams }: Props) {
  const locale = params.locale as Locale

  setRequestLocale(locale)

  const fullPath = ROOT_PAGE_PATH + (params.rest ?? []).join("/")
  const response = use(fetchPage(fullPath, locale))

  const data = response?.data
  if (data?.content == null) {
    notFound()
  }

  const { content, ...restPageData } = data
  const opensOnHero = content[0]?.__component === "sections.hero"

  return (
    <>
      <StrapiStructuredData structuredData={data?.seo?.structuredData} />

      <main className={cn("flex w-full flex-col overflow-hidden")}>
        {/* The design puts the trail inside the hero, over the photograph, so
            a page that opens on one hands it down instead of drawing it here.
            Anything else keeps it above the content, where it used to be. */}
        {!opensOnHero && (
          <Container>
            <Breadcrumbs
              breadcrumbs={response?.meta?.breadcrumbs}
              locale={locale}
              className="mb-10 md:mb-20"
            />
          </Container>
        )}

        {content
          .filter((comp) => comp != null)
          .map((comp, index) => {
            const name = comp.__component
            const id = comp.id
            const key = `${name}-${id}`
            const Component = PageContentComponents[name]
            if (Component == null) {
              logger.warn("Unknown page-builder component", { name, id })

              return (
                <div key={key} className="font-medium text-red-500">
                  Component &quot;{key}&quot; is not implemented on the
                  frontend.
                </div>
              )
            }

            return (
              <ErrorBoundary key={key}>
                {/* The design spaces every section 80px apart on a phone and
                    90 at desktop, not the starter's 160. */}
                <div className={cn("mb-20 lg:mb-22.5")}>
                  <Component
                    component={comp}
                    pageParams={params}
                    page={restPageData}
                    searchParams={searchParams}
                    breadcrumbs={
                      index === 0 ? response?.meta?.breadcrumbs : undefined
                    }
                  />
                </div>
              </ErrorBoundary>
            )
          })}
      </main>
    </>
  )
}

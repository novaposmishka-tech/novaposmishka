import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { CaseGallery } from "@/components/elementary/CaseGallery"
import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiResults({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.results">
}) {
  const { title, subtitle, cases, link, display } = component

  if (!cases?.length) {
    return null
  }

  const isCarousel = display !== "grid"
  const t = await getTranslations("results")

  return (
    <section id="results" className="scroll-mt-24">
      {/* On a desktop the cases sit on the same rounded dark card as the
          why-us section, inset on the 1320 grid. The phone frame runs the
          same teal from edge to edge instead, square and with the page's own
          15px gutters. */}
      <Wrapper isCarousel={isCarousel}>
        {(title || subtitle) && (
          <div className="flex max-w-3xl flex-col gap-4">
            {title && (
              <Typography
                tag="h2"
                className={
                  isCarousel
                    ? "text-brand-inverted mb-0!"
                    : "text-brand-ink mb-0!"
                }
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                className={
                  isCarousel ? "text-brand-on-dark" : "text-brand-body"
                }
              >
                {subtitle}
              </Typography>
            )}
          </div>
        )}

        <CaseGallery
          display={display ?? "carousel"}
          cases={cases}
          labels={{
            all: t("all"),
            before: t("before"),
            after: t("after"),
            list: t("list"),
            more: t("more"),
            compare: t("compare"),
          }}
        />

        {link && (
          <StrapiLink
            component={link}
            // White on the teal, and the full width of the phone frame where
            // the desktop one hugs its words.
            className="text-brand-ink h-10 w-full justify-center gap-2 rounded-[30px] bg-white px-5 text-base/5.5 font-semibold hover:bg-white/90 lg:mx-auto lg:h-12.5 lg:w-fit lg:px-7.5"
          >
            {link.label}
            <ArrowRight aria-hidden className="size-5" />
          </StrapiLink>
        )}
      </Wrapper>
    </section>
  )
}

/**
 * The band the cases sit on. The frame draws it two different ways: a rounded
 * card inset on the 1320 grid at desktop, and a square full-bleed strip on a
 * phone. The grid listing keeps the ordinary container.
 */
function Wrapper({
  isCarousel,
  children,
}: {
  readonly isCarousel: boolean
  readonly children: React.ReactNode
}) {
  if (!isCarousel) {
    return <Container className="flex flex-col gap-12.5">{children}</Container>
  }

  return (
    <div className="bg-brand-gradient text-brand-inverted flex flex-col gap-7.5 px-3.75 pt-7.5 pb-10 lg:mx-auto lg:w-full lg:max-w-330 lg:gap-12.5 lg:rounded-[50px] lg:p-12.5">
      {children}
    </div>
  )
}

StrapiResults.displayName = "StrapiResults"

export default StrapiResults

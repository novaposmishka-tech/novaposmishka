import "server-only"

import type { Data } from "@repo/strapi-types"
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
  const { title, subtitle, cases, link } = component

  if (!cases?.length) {
    return null
  }

  const t = await getTranslations("results")

  return (
    <section id="results" className="scroll-mt-24">
      {/* The design gives the cases the same dark card as the why-us section. */}
      <Container className="bg-brand-gradient text-brand-inverted flex flex-col gap-10 rounded-[50px] p-8 md:p-12.5">
        {(title || subtitle) && (
          <div className="flex max-w-3xl flex-col gap-4">
            {title && (
              <Typography tag="h2" className="text-brand-inverted">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className="text-brand-on-dark">{subtitle}</Typography>
            )}
          </div>
        )}

        <CaseGallery
          cases={cases}
          labels={{
            all: t("all"),
            before: t("before"),
            after: t("after"),
            list: t("list"),
          }}
        />

        {link && <StrapiLink component={link} className="mx-auto mt-2 w-fit" />}
      </Container>
    </section>
  )
}

StrapiResults.displayName = "StrapiResults"

export default StrapiResults

import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiResults({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.results">
}) {
  const { title, subtitle, cases } = component

  if (!cases?.length) {
    return null
  }

  const t = await getTranslations("results")

  return (
    <section id="results" className="scroll-mt-24">
      <Container className="flex flex-col gap-10">
        {(title || subtitle) && (
          <div className="flex max-w-2xl flex-col gap-4">
            {title && (
              <Typography tag="h2" className="text-brand-ink">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className="text-brand-body">{subtitle}</Typography>
            )}
          </div>
        )}

        <ul className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {cases.map((item) => (
            <li key={item.id} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <figure className="flex flex-col gap-2">
                  <StrapiBasicImage
                    component={item.before}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                  <figcaption className="text-brand-body text-xs uppercase">
                    {t("before")}
                  </figcaption>
                </figure>
                <figure className="flex flex-col gap-2">
                  <StrapiBasicImage
                    component={item.after}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                  <figcaption className="text-brand-body text-xs uppercase">
                    {t("after")}
                  </figcaption>
                </figure>
              </div>
              {item.caption && (
                <Typography className="text-brand-ink-soft text-sm">
                  {item.caption}
                </Typography>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

StrapiResults.displayName = "StrapiResults"

export default StrapiResults

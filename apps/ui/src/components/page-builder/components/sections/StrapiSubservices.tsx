import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import {
  SubserviceAccordion,
  type SubserviceItem,
} from "@/components/elementary/SubserviceAccordion"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { LEAD_FORM_ANCHOR } from "@/lib/analytics"
import {
  type DirectionEntry,
  directionOfPage,
  pageHref,
} from "@/lib/directions"
import { fetchDirections } from "@/lib/strapi-api/content/server"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * What a direction covers, on its own page: the heading and a paragraph on
 * the left, and on the right its sub-services as a list that opens onto a
 * sentence about each and the way through to its page.
 *
 * The list keeps which entry is open, so it is a client component; what it
 * shows is resolved here and handed to it, the photographs included.
 */
export async function StrapiSubservices({
  component,
  page,
  directions: given,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.subservices">
  /** The directions to draw, where they are not to be read from Strapi. */
  directions?: readonly DirectionEntry[]
}) {
  const { title, description } = component

  // The list is the procedures the collection files under the direction this
  // page is for; the block itself only holds the heading.
  const [directions, t] = await Promise.all([
    given ?? fetchDirections(),
    getTranslations("services"),
  ])
  const procedures =
    directionOfPage(directions, page?.documentId)?.subdirections ?? []

  if (procedures.length === 0) {
    return null
  }

  const entries: SubserviceItem[] = procedures.map((item) => ({
    id: item.documentId,
    name: item.name,
    description: item.description,
    // A procedure without a page of its own keeps its sentence and loses the
    // button, rather than carrying one that goes nowhere.
    href: pageHref(item),
    linkLabel: t("detailsAndPrices"),
    image: item.image && (
      <StrapiBasicImage
        component={item.image}
        fill
        sizes="(min-width: 64rem) 50vw, 100vw"
        className="object-cover"
      />
    ),
  }))

  return (
    <section>
      <Container>
        <SubserviceAccordion
          items={entries}
          bookHref={LEAD_FORM_ANCHOR}
          labels={{ book: t("book"), details: t("details") }}
          heading={
            <>
              {title && (
                <Typography tag="h2" className="text-brand-ink mb-0! max-w-145">
                  {title}
                </Typography>
              )}
              {description && (
                <Typography className="text-brand-body mb-0! max-w-140 text-sm/[1.4]! text-pretty lg:text-base/[1.4]!">
                  {description}
                </Typography>
              )}
            </>
          }
        />
      </Container>
    </section>
  )
}

StrapiSubservices.displayName = "StrapiSubservices"

export default StrapiSubservices

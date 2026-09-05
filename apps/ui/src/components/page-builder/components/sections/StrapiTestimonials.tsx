import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { ReviewCard } from "@/components/elementary/ReviewCard"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiTestimonials({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.testimonials">
}) {
  const { title, testimonials, links } = component

  if (!testimonials?.length) {
    return null
  }

  const t = await getTranslations("testimonials")

  return (
    <section id="testimonials" className="scroll-mt-24">
      <Container className="flex flex-col gap-12.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {title && (
            <Typography tag="h2" className="text-brand-ink">
              {title}
            </Typography>
          )}

          {links && links.length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              {links.map((link) => (
                <StrapiLink key={link.id} component={link} />
              ))}
            </div>
          )}
        </div>

        {/* On a phone these scroll sideways, as the design does — nine cards
            stacked make the page twice as long as it should be. From md up they
            are CSS columns rather than a grid: the reviews are different lengths
            and columns pack them without the ragged bottom a grid would leave. */}
        <div
          tabIndex={0}
          aria-label={title ?? undefined}
          className={cn(
            "-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-2",
            "md:mx-0 md:block md:gap-0 md:overflow-visible md:px-0",
            "md:columns-2 md:*:mb-6 lg:columns-3"
          )}
        >
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="w-4/5 shrink-0 snap-start md:w-auto"
            >
              <ReviewCard
                review={review}
                labels={{
                  more: t("readMore"),
                  less: t("readLess"),
                  rating: t("rating"),
                }}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

StrapiTestimonials.displayName = "StrapiTestimonials"

export default StrapiTestimonials

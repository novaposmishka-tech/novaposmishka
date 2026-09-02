import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { ReviewCard } from "@/components/elementary/ReviewCard"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
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
      <Container className="flex flex-col gap-10">
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

        {/* CSS columns rather than a grid: the reviews are different lengths and
            the design packs them without the ragged bottom a grid would leave. */}
        <div className="gap-6 *:mb-6 md:columns-2 lg:columns-3">
          {testimonials.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              labels={{
                more: t("readMore"),
                less: t("readLess"),
                rating: t("rating"),
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

StrapiTestimonials.displayName = "StrapiTestimonials"

export default StrapiTestimonials

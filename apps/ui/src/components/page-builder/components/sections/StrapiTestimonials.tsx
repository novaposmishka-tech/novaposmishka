import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { ReviewCard } from "@/components/elementary/ReviewCard"
import { ReviewTabs } from "@/components/elementary/ReviewTabs"
import { VideoReviewList } from "@/components/elementary/VideoReviewList"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiTestimonials({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.testimonials">
}) {
  const { title, testimonials, links, videoReviews, writtenLabel, videoLabel } =
    component

  if (!testimonials?.length) {
    return null
  }

  const t = await getTranslations("testimonials")

  const heading = title ? (
    <Typography tag="h2" className="text-brand-ink">
      {title}
    </Typography>
  ) : null

  // On a phone these scroll sideways, as the design does — nine cards stacked
  // make the page twice as long as it should be. From md up they are CSS
  // columns rather than a grid: the reviews are different lengths and columns
  // pack them without the ragged bottom a grid would leave.
  const written = (
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
        <div key={review.id} className="w-4/5 shrink-0 snap-start md:w-auto">
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
  )

  // The design switches between written and filmed reviews here. Without any
  // filmed ones the switch would be a single tab, so the section keeps its
  // plain heading instead.
  const hasVideo = Boolean(videoReviews?.length)

  return (
    <section id="testimonials" className="scroll-mt-24">
      <Container className="flex flex-col gap-12.5">
        {hasVideo && videoReviews ? (
          <ReviewTabs
            heading={heading}
            labels={[writtenLabel ?? "Google", videoLabel ?? t("video")]}
            panels={[
              written,
              <VideoReviewList
                key="video"
                reviews={videoReviews}
                label={videoLabel}
              />,
            ]}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {heading}

              {links && links.length > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  {links.map((link) => (
                    <StrapiLink key={link.id} component={link} />
                  ))}
                </div>
              )}
            </div>

            {written}
          </>
        )}
      </Container>
    </section>
  )
}

StrapiTestimonials.displayName = "StrapiTestimonials"

export default StrapiTestimonials

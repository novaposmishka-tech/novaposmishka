import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { ReviewCard } from "@/components/elementary/ReviewCard"
import { ReviewTabs } from "@/components/elementary/ReviewTabs"
import { ScrollRow } from "@/components/elementary/ScrollRow"
import { VideoReviewList } from "@/components/elementary/VideoReviewList"
import { GoogleMark } from "@/components/icons/GoogleMark"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
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
    <ScrollRow
      label={title}
      // One row that scrolls on a phone and breaks into the frame's three
      // columns from md up. The reviews are different lengths and columns pack
      // them without the ragged bottom a grid would leave.
      className="md:block md:columns-2 md:overflow-visible md:*:mb-6 lg:columns-3"
      // The frame gives the columns no arrows; they belong to the phone row.
      controlsClassName="md:hidden"
    >
      {testimonials.map((review) => (
        <li key={review.id} className="w-full shrink-0 snap-start md:w-auto">
          <ReviewCard
            review={review}
            labels={{
              more: t("readMore"),
              less: t("readLess"),
              rating: t("rating"),
            }}
          />
        </li>
      ))}
    </ScrollRow>
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
            // The frame marks the written-reviews tab with Google's own logo.
            icons={[<GoogleMark key="google" className="size-6" />, null]}
            panels={[
              written,
              <VideoReviewList
                key="video"
                reviews={videoReviews}
                label={videoLabel}
                moreLabel={t("showMore")}
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

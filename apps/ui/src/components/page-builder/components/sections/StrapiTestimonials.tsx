import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { ReviewCard } from "@/components/elementary/ReviewCard"
import { ReviewColumns } from "@/components/elementary/ReviewColumns"
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

  const cardLabels = {
    more: t("readMore"),
    less: t("readLess"),
    rating: t("rating"),
  }

  // Inside the homepage's tab the reviews keep the frame's scrolling row, with
  // its arrows and dots; from md up they break into its columns.
  const written = (
    <ScrollRow
      label={title}
      className="md:block md:columns-2 md:overflow-visible md:*:mb-6 lg:columns-3"
      // The frame gives the columns no arrows; they belong to the phone row.
      controlsClassName="md:hidden"
    >
      {testimonials.map((review) => (
        <li key={review.id} className="w-full shrink-0 snap-start md:w-auto">
          <ReviewCard review={review} labels={cardLabels} />
        </li>
      ))}
    </ScrollRow>
  )

  // The design switches between written and filmed reviews here. Without any
  // filmed ones the switch would be a single tab, so the section keeps its
  // plain heading instead.
  const hasVideo = Boolean(videoReviews?.length)

  return (
    <section id="testimonials" className="scroll-mt-15 lg:scroll-mt-26.5">
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
                layout="carousel"
              />,
            ]}
          />
        ) : null}

        {/* The way through to every review. In the tabbed branch it stands
            under the panel; without tabs it sits beside the heading, where the
            frame draws it. */}
        {hasVideo && links && links.length > 0 && (
          <div className="flex justify-center">
            {links.map((link) => (
              <StrapiLink
                key={link.id}
                component={link}
                className="border-brand-teal text-brand-ink hover:bg-brand-gradient hover:shadow-brand-button hover:text-brand-inverted flex h-10 w-full items-center justify-center gap-2 rounded-[30px] border bg-white text-sm/5 font-semibold transition-colors hover:border-transparent lg:h-12.5 lg:w-fit lg:px-7.5 lg:text-base/5.5"
              />
            ))}
          </div>
        )}

        {!hasVideo && (
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

            {/* The reviews page stacks them instead, five at a time. */}
            <ReviewColumns
              testimonials={testimonials}
              label={title}
              labels={{ ...cardLabels, showMore: t("showMore") }}
            />
          </>
        )}
      </Container>
    </section>
  )
}

StrapiTestimonials.displayName = "StrapiTestimonials"

export default StrapiTestimonials

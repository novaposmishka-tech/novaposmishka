import "server-only"

import type { Data } from "@repo/strapi-types"
import { Play } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiVideoReviews({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.video-reviews">
}) {
  const { title, reviews, link } = component

  if (!reviews?.length) {
    return null
  }

  return (
    <section id="video-reviews" className="scroll-mt-24">
      <Container className="flex flex-col gap-12.5">
        {title && (
          <Typography tag="h2" className="text-brand-ink">
            {title}
          </Typography>
        )}

        {/* Four portraits across at desktop, scrolling on narrower screens
            rather than shrinking to stamps. One scroll container at every
            width, so it needs a single tab stop — a scrollable region is not
            keyboard-operable without one. */}
        <ul
          tabIndex={0}
          aria-label={title ?? undefined}
          className="-mx-2 flex snap-x snap-mandatory list-none gap-6 overflow-x-auto px-2 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex w-2/3 shrink-0 snap-start flex-col gap-5 sm:w-2/5 lg:w-78"
            >
              <div className="relative">
                {review.poster && (
                  <StrapiBasicImage
                    component={review.poster}
                    className="aspect-312/500 w-full rounded-[30px] object-cover"
                  />
                )}

                {/* The clip itself is only offered once there is one to play;
                    a play button over a still that cannot move is a lie. */}
                {review.videoUrl && (
                  <a
                    href={review.videoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="absolute inset-0 flex items-center justify-center rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span className="text-brand-deep flex size-15 items-center justify-center rounded-full bg-white/90 shadow-md">
                      <Play aria-hidden className="size-6 fill-current" />
                    </span>
                    <span className="sr-only">{review.quote}</span>
                  </a>
                )}
              </div>

              <blockquote className="text-brand-ink text-base">
                {review.quote}
              </blockquote>
            </li>
          ))}
        </ul>

        {link && <StrapiLink component={link} className="mx-auto w-fit" />}
      </Container>
    </section>
  )
}

StrapiVideoReviews.displayName = "StrapiVideoReviews"

export default StrapiVideoReviews

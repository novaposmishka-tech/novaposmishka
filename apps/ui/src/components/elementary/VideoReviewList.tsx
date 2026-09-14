"use client"

import type { Data } from "@repo/strapi-types"
import { ArrowRight, Play } from "lucide-react"
import { useState } from "react"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { cn } from "@/lib/styles"

type VideoReview = NonNullable<
  Data.Component<"sections.video-reviews">["reviews"]
>[number]

/** What the frame leaves standing before "Показати більше" is pressed. */
const VISIBLE = { phone: 2, desktop: 4 }

/**
 * The filmed reviews: a still, and the patient's words under it.
 *
 * Shared by the reviews page, which gives them a section of their own, and the
 * homepage, which puts them behind a tab beside the written ones. The frame
 * stands them four across on a desktop and one under another on a phone, where
 * a card is nearly a screen tall — which is why it stops after two and offers
 * the rest behind a button.
 *
 * How many are held back is settled by the count alone, so the markup is the
 * same on the server and in the browser; only pressing the button is not.
 */
export function VideoReviewList({
  reviews,
  label,
  moreLabel,
  className,
}: {
  readonly reviews: readonly VideoReview[]
  readonly label?: string | null
  readonly moreLabel?: string
  readonly className?: string
}) {
  const [expanded, setExpanded] = useState(false)

  if (reviews.length === 0) {
    return null
  }

  const hidesOnPhone = reviews.length > VISIBLE.phone
  const hidesOnDesktop = reviews.length > VISIBLE.desktop

  return (
    <div className={cn("flex flex-col gap-7.5 lg:gap-12.5", className)}>
      <ul
        aria-label={label ?? undefined}
        className="grid list-none grid-cols-1 gap-7.5 lg:grid-cols-4 lg:gap-6"
      >
        {reviews.map((review, index) => (
          <li
            key={review.id}
            className={cn(
              "flex flex-col gap-2.5 lg:gap-5",
              !expanded && index >= VISIBLE.phone && "max-lg:hidden",
              !expanded && index >= VISIBLE.desktop && "hidden"
            )}
          >
            <div className="relative">
              {review.poster && (
                <StrapiBasicImage
                  component={review.poster}
                  className="h-125 w-full rounded-[30px] object-cover"
                />
              )}

              {/* The clip itself is only offered once there is one to play; a
                  play button over a still that cannot move is a lie. */}
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

            {/* The frame insets the quote from the still it sits under. */}
            <blockquote className="text-brand-body px-2.5 text-sm/5 lg:text-base/5.5">
              {review.quote}
            </blockquote>
          </li>
        ))}
      </ul>

      {moreLabel && !expanded && hidesOnPhone && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={cn(
            "text-brand-ink flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[30px] bg-white text-sm/5 font-semibold lg:mx-auto lg:h-12.5 lg:w-fit lg:px-7.5 lg:text-base/5.5",
            !hidesOnDesktop && "lg:hidden"
          )}
        >
          {moreLabel}
          <ArrowRight aria-hidden className="size-5" />
        </button>
      )}
    </div>
  )
}

export default VideoReviewList

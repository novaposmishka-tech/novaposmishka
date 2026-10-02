"use client"

import type { Data } from "@repo/strapi-types"

import { PlayableStill } from "@/components/elementary/PlayableStill"
import { ScrollRow } from "@/components/elementary/ScrollRow"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

type VideoReview = NonNullable<
  Data.Component<"sections.video-reviews">["reviews"]
>[number]

/**
 * The filmed reviews: the clip, and the patient's words under it.
 *
 * Shared by the reviews page, which gives them a section of their own, and the
 * homepage, which puts them behind a tab beside the written ones. Both keep
 * them in a row that scrolls, with the frame's arrows and dots under it, as
 * every other row of cards on the site does. Four stand across a desktop, so
 * the controls only appear once there is a fifth. On a phone the frame gives
 * each film the column's full width, one at a time — at two-thirds the still
 * was a sliver of a 500-tall portrait.
 */
export function VideoReviewList({
  reviews,
  label,
  className,
}: {
  readonly reviews: readonly VideoReview[]
  readonly label?: string | null
  readonly className?: string
}) {
  if (reviews.length === 0) {
    return null
  }

  return (
    <ScrollRow label={label} className={className}>
      {reviews.map((review) => (
        <li
          key={review.id}
          className="flex w-full shrink-0 snap-start flex-col gap-2.5 sm:w-2/5 lg:w-78 lg:gap-5"
        >
          <Still review={review} />
        </li>
      ))}
    </ScrollRow>
  )
}

/** One filmed review: the clip, and the patient's words under it. */
function Still({ review }: { readonly review: VideoReview }) {
  // A clip uploaded to Strapi is stored as a path; one an editor pasted from
  // elsewhere is already whole. This completes the first and leaves the second.
  const clip = formatStrapiMediaUrl(review.videoUrl)

  return (
    <>
      {/* The clip stands as its own still: there is no separate picture to
          upload, so the card shows the film's first frame with the mark over
          it. The fragment asks for that frame outright — Safari otherwise
          leaves the box blank until the film is played. */}
      {clip && (
        <PlayableStill
          src={clip}
          label={review.quote}
          className="h-125 overflow-hidden rounded-[30px]"
          markClassName="size-15"
          poster={
            <video
              src={`${clip}#t=0.001`}
              preload="metadata"
              muted
              playsInline
              aria-hidden
              tabIndex={-1}
              className="h-full w-full object-cover"
            />
          }
        />
      )}

      {/* The frame insets the quote from the still it sits under. */}
      <blockquote className="text-brand-body px-2.5 text-sm/5 lg:text-base/5.5">
        {review.quote}
      </blockquote>
    </>
  )
}

export default VideoReviewList

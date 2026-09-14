"use client"

import type { Data } from "@repo/strapi-types"
import { useState } from "react"

import { ReviewCard } from "@/components/elementary/ReviewCard"
import { ShowMoreButton } from "@/components/elementary/ShowMoreButton"
import { cn } from "@/lib/styles"

type Testimonial = NonNullable<
  Data.Component<"sections.testimonials">["testimonials"]
>[number]

/** What the frame leaves standing on a phone before the button is pressed. */
const VISIBLE = 5

/**
 * The written reviews on the reviews page: one under another on a phone, and
 * the frame's three columns from md up.
 *
 * Columns rather than a grid because the reviews are different lengths and
 * columns pack them without the ragged bottom a grid would leave. A phone gets
 * five of them and the rest behind a button — the full nine make the page
 * twice as long as it should be.
 */
export function ReviewColumns({
  testimonials,
  label,
  labels,
}: {
  readonly testimonials: readonly Testimonial[]
  readonly label?: string | null
  readonly labels: {
    more: string
    less: string
    rating: string
    showMore: string
  }
}) {
  const [expanded, setExpanded] = useState(false)

  if (testimonials.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-7.5 lg:gap-12.5">
      <ul
        aria-label={label ?? undefined}
        className="flex list-none flex-col gap-5 md:block md:columns-2 md:gap-6 md:*:mb-6 lg:columns-3"
      >
        {testimonials.map((review, index) => (
          <li
            key={review.id}
            className={cn(!expanded && index >= VISIBLE && "max-md:hidden")}
          >
            <ReviewCard review={review} labels={labels} />
          </li>
        ))}
      </ul>

      {!expanded && testimonials.length > VISIBLE && (
        <ShowMoreButton
          label={labels.showMore}
          onClick={() => setExpanded(true)}
          className="md:hidden"
        />
      )}
    </div>
  )
}

export default ReviewColumns

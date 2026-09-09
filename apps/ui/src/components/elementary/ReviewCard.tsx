"use client"

import type { Data } from "@repo/strapi-types"
import { StarIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { cn } from "@/lib/styles"

type Testimonial = NonNullable<
  Data.Component<"sections.testimonials">["testimonials"]
>[number]

/**
 * One patient review, as the design draws it: who wrote it and when, the score
 * they gave, and the review itself clamped to three lines until asked for.
 *
 * Client-side only for that last part — the quote is rendered in full either
 * way, so a reader without scripting still gets the whole thing, just not the
 * clamp.
 */
export function ReviewCard({
  review,
  labels,
}: {
  readonly review: Testimonial
  readonly labels: { more: string; less: string; rating: string }
}) {
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const score = Math.round(review.rating ?? 0)

  // Whether the clamp is actually hiding anything can only be measured once
  // the text has been laid out, and it changes with the column width.
  useEffect(() => {
    const quote = quoteRef.current
    if (!quote) return

    const measure = () =>
      setClamped(
        (current) => current || quote.scrollHeight > quote.clientHeight + 1
      )

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(quote)

    return () => observer.disconnect()
  }, [])

  return (
    <article className="border-brand-border bg-brand-paper flex break-inside-avoid flex-col gap-4 rounded-[26px] border p-7.5">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          {review.photo && (
            <StrapiBasicImage
              component={review.photo}
              className="size-12.5 shrink-0 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="text-brand-ink font-medium">
              {review.authorName}
            </span>
            {/* The design sets these greys to brand-muted, which lands at
                roughly 2:1 on the card — brand-body is the same role, legibly. */}
            {review.authorNote && (
              <span className="text-brand-body text-sm">
                {review.authorNote}
              </span>
            )}
          </div>
        </div>

        {review.source && (
          <span className="text-brand-body shrink-0 text-sm">
            {review.source}
          </span>
        )}
      </header>

      {review.rating != null && (
        <div
          className="flex gap-1"
          role="img"
          aria-label={`${labels.rating}: ${review.rating}`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              aria-hidden
              className={cn(
                "size-4",
                index < score
                  ? "fill-brand-accent text-brand-accent"
                  : "text-brand-border"
              )}
            />
          ))}
        </div>
      )}

      <p
        ref={quoteRef}
        className={cn("text-brand-body text-base", !expanded && "line-clamp-3")}
      >
        {review.quote}
      </p>

      {/* Only when there is something hidden to reveal: most of these reviews
          are two lines and a "read more" on them would do nothing. */}
      {clamped && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="text-brand-deep hover:text-brand-teal w-fit cursor-pointer text-base font-semibold"
        >
          {labels[expanded ? "less" : "more"]}
        </button>
      )}
    </article>
  )
}

ReviewCard.displayName = "ReviewCard"

export default ReviewCard

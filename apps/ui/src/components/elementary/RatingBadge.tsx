import { Star } from "lucide-react"

import { GoogleMark } from "@/components/icons/GoogleMark"
import { cn } from "@/lib/styles"

const MAX_SCORE = 5

/**
 * The design's rating badge: Google's mark, the label beside it, and the score
 * over five gold stars.
 *
 * The mark is drawn whenever the label names Google, which is the only source
 * the clinic quotes; any other label keeps the badge without it rather than
 * borrowing someone else's logo.
 */
export function RatingBadge({
  label,
  score,
  className,
}: {
  readonly label: string
  readonly score: number
  readonly className?: string
}) {
  const isGoogle = /google/i.test(label)

  return (
    <div className={cn("flex items-center gap-3.75 lg:gap-5", className)}>
      {isGoogle && <GoogleMark className="size-10 shrink-0 lg:size-15" />}

      <div className="flex flex-col gap-1 lg:gap-2.5">
        <span className="text-brand-ink text-base/5.5 font-semibold lg:text-xl/7">
          {label}
        </span>
        <div className="flex items-center gap-2.5 lg:gap-3.75">
          <span className="text-brand-body text-sm/5 lg:text-base/5.5">
            {/* One decimal, as in the design: 4.8 rather than 4.80 or 5. */}
            {score.toFixed(1)}
          </span>
          <RatingStars score={score} />
        </div>
      </div>
    </div>
  )
}

/**
 * The score as gold stars out of five, rounded to the nearest whole one.
 * Shared by every place that shows the rating, so they cannot count it
 * differently.
 */
export function RatingStars({
  score,
  className,
  starClassName = "size-4",
  emptyClassName = "text-brand-muted",
}: {
  readonly score: number
  readonly className?: string
  readonly starClassName?: string
  /** The colour of a star the score does not reach; pale on a photograph. */
  readonly emptyClassName?: string
}) {
  return (
    <div
      className={cn("flex items-center gap-0.75", className)}
      // The stars repeat the score visually, so they are decorative — the
      // number beside them is what a screen reader should read out.
      aria-hidden
    >
      {Array.from({ length: MAX_SCORE }, (_, index) => (
        <Star
          key={index}
          className={cn(
            starClassName,
            index < Math.round(score)
              ? "fill-brand-star text-brand-star"
              : emptyClassName
          )}
        />
      ))}
    </div>
  )
}

export default RatingBadge

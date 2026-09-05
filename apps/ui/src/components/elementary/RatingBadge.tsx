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
    <div className={cn("flex items-center gap-3", className)}>
      {isGoogle && <GoogleMark className="size-10 shrink-0" />}

      <div className="flex flex-col gap-1">
        <span className="text-brand-ink font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-brand-body text-sm">
            {/* One decimal, as in the design: 4.8 rather than 4.80 or 5. */}
            {score.toFixed(1)}
          </span>
          <div
            className="flex items-center gap-0.5"
            // The stars repeat the score visually, so they are decorative — the
            // number beside them is what a screen reader should read out.
            aria-hidden
          >
            {Array.from({ length: MAX_SCORE }, (_, index) => (
              <Star
                key={index}
                className={cn(
                  "size-4",
                  index < Math.round(score)
                    ? "fill-brand-star text-brand-star"
                    : "text-brand-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingBadge

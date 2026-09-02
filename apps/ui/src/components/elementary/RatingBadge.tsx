import { Star } from "lucide-react"

import { cn } from "@/lib/styles"

const MAX_SCORE = 5

/**
 * The design's review badge: a label, the score, and five stars filled up to
 * that score. Used in the footer, and ready for the hero variants that show
 * the same badge.
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
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-brand-body text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">
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
                  ? "fill-brand-accent text-brand-accent"
                  : "text-brand-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RatingBadge

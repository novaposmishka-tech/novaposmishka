"use client"

import type { Data } from "@repo/strapi-types"

import { ScrollRow } from "@/components/elementary/ScrollRow"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { cn } from "@/lib/styles"

type Media = Data.Component<"shared.before-after">["before"]

/**
 * The two photographs of a case, one after the other, turned with the arrows
 * and marks the site steps every other row with.
 *
 * The frame draws them this way rather than under a draggable divider — one
 * photograph filling the frame, the controls beneath it — and the design
 * review asked for it at both widths: "робити скролом, так як я малювала в
 * дизайні, щоб було зручно дивитись". A whole photograph is easier to read
 * than two halves of one, which is the point.
 */
export function BeforeAfterRow({
  before,
  after,
  labels,
  className,
}: {
  readonly before: Media
  readonly after: Media
  readonly labels: { before: string; after: string }
  readonly className?: string
}) {
  const shots = [
    { media: before, label: labels.before },
    { media: after, label: labels.after },
  ].filter((shot): shot is { media: NonNullable<Media>; label: string } =>
    Boolean(shot.media)
  )

  if (shots.length === 0) {
    return null
  }

  // One photograph is not a row to step through: it simply stands there.
  if (shots.length === 1 && shots[0]) {
    return <Shot media={shots[0].media} label={null} className={className} />
  }

  return (
    <ScrollRow>
      {shots.map((shot) => (
        <li key={shot.label} className="w-full shrink-0 snap-start">
          <Shot media={shot.media} label={shot.label} className={className} />
        </li>
      ))}
    </ScrollRow>
  )
}

/** One photograph, with the frame's white tag naming which half it is. */
function Shot({
  media,
  label,
  className,
}: {
  readonly media: NonNullable<Media>
  readonly label: string | null
  readonly className?: string
}) {
  return (
    // A default shape, because the image fills its box and a box with no
    // height is no box at all. A caller that knows better — the gallery card,
    // which the frame crops shallower — says so in className.
    <div
      className={cn(
        "relative aspect-1076/610 w-full overflow-hidden",
        className
      )}
    >
      <StrapiBasicImage
        component={media}
        fill
        sizes="(min-width: 768px) 640px, 100vw"
        className="object-cover"
      />

      {label && (
        <span className="text-brand-ink absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm">
          {label}
        </span>
      )}
    </div>
  )
}

export default BeforeAfterRow

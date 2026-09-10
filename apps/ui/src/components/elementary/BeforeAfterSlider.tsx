"use client"

import type { Data } from "@repo/strapi-types"
import { type ReactNode, useId, useState } from "react"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { cn } from "@/lib/styles"

type Media = Data.Component<"shared.before-after">["before"]

/** Where the handle rests before anyone touches it, in percent. */
const INITIAL = 50

/**
 * Two photographs of the same mouth under a draggable divider: the "after"
 * shot fills the frame and the "before" one is clipped to the handle's left.
 * Dragging left uncovers the result, dragging right puts the problem back.
 *
 * The handle is a real range input, kept transparent above the photographs and
 * drawn separately underneath. That buys pointer, touch and keyboard control —
 * arrows, Home and End — plus the slider role and its value, none of which a
 * div with a pointer listener would have. `touch-none` matters: inside the
 * homepage's scroll row the browser would otherwise read a sideways drag on
 * the handle as a swipe of the carousel.
 */
export function BeforeAfterSlider({
  before,
  after,
  labels,
  className,
}: {
  readonly before: Media
  readonly after: Media
  readonly labels: { before: string; after: string; compare: string }
  readonly className?: string
}) {
  // A case is only worth comparing when it has both halves. Choosing here
  // rather than returning early inside the slider keeps its state out of a
  // branch that never uses it.
  if (!before || !after) {
    const only = before ?? after

    return only ? (
      <div className={cn("relative aspect-1076/610 w-full", className)}>
        <StrapiBasicImage
          component={only}
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-cover"
        />
      </div>
    ) : null
  }

  return (
    <Comparison
      before={before}
      after={after}
      labels={labels}
      className={className}
    />
  )
}

function Comparison({
  before,
  after,
  labels,
  className,
}: {
  readonly before: NonNullable<Media>
  readonly after: NonNullable<Media>
  readonly labels: { before: string; after: string; compare: string }
  readonly className?: string
}) {
  const [position, setPosition] = useState(INITIAL)
  const id = useId()

  return (
    <div
      className={cn(
        "relative aspect-1076/610 w-full touch-none overflow-hidden select-none",
        className
      )}
    >
      <StrapiBasicImage
        component={after}
        fill
        sizes="(min-width: 768px) 640px, 100vw"
        className="object-cover"
      />

      {/* Clipped rather than sized: the photograph keeps the frame's full
          width, so the two halves stay in register as the divider moves. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <StrapiBasicImage
          component={before}
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-cover"
        />
      </div>

      <Pill className="left-2.5 lg:left-5" hidden={position < 12}>
        {labels.before}
      </Pill>
      <Pill className="right-2.5 lg:right-5" hidden={position > 88}>
        {labels.after}
      </Pill>

      <label htmlFor={id} className="sr-only">
        {labels.compare}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${Math.round(position)}%`}
        className={cn(
          "peer absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0",
          // A thumb as tall as the frame keeps the grab area over the divider
          // itself, wherever the reader takes hold of it.
          "[&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:appearance-none",
          "[&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:border-0"
        )}
      />

      <div
        aria-hidden
        style={{ left: `${position}%` }}
        className="peer-focus-visible:[&>span]:ring-brand-deep pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.35)] peer-focus-visible:[&>span]:ring-4"
      >
        <span className="absolute top-1/2 left-1/2 flex size-7.75 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white lg:size-12.5">
          <ArrowGlyph className="rotate-180" />
          <ArrowGlyph />
        </span>
      </div>
    </div>
  )
}

function Pill({
  children,
  className,
  hidden,
}: {
  readonly children: ReactNode
  readonly className?: string
  readonly hidden?: boolean
}) {
  return (
    <span
      className={cn(
        // Translucent white over the photograph with a hairline around it, as
        // the frame draws it — not a solid chip.
        "text-brand-inverted pointer-events-none absolute top-2.5 z-10 flex h-6.25 items-center rounded-full border border-white bg-white/20 px-2.5 text-xs/[1.0625rem] font-medium transition-opacity lg:top-5 lg:h-7.5 lg:px-5 lg:text-base/5.5",
        hidden && "opacity-0",
        className
      )}
    >
      {children}
    </span>
  )
}

/** One half of the divider's double chevron. */
function ArrowGlyph({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-3.5 lg:size-5", className)}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

BeforeAfterSlider.displayName = "BeforeAfterSlider"

export default BeforeAfterSlider

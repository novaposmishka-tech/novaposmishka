"use client"

import type { Data } from "@repo/strapi-types"
import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { cn } from "@/lib/styles"

type Media = Data.Component<"shared.before-after">["before"]

/** Where the handle rests before anyone touches it, in percent. */
const INITIAL = 50

/** How far the hint rocks the handle to each side, in percent, and how long. */
const NUDGE = 8
const NUDGE_MS = 1600

/**
 * Two photographs of the same mouth under a draggable divider: the "after"
 * shot fills the frame and the "before" one is clipped to the handle's left.
 * Dragging left uncovers the result, dragging right puts the problem back.
 *
 * A finger or a mouse drives the divider from anywhere in the frame: press,
 * and it comes to the finger; move, and it follows, the pointer captured so a
 * fast drag that leaves the frame still counts. The frame used to leave this to
 * a transparent range input stretched over it, but a native range only starts
 * a drag from its own thumb — forty pixels wide — and on a phone a finger that
 * landed on the photograph next to the line did nothing at all.
 *
 * The range input is still there, transparent and out of the pointer's way,
 * for what pointer listeners cannot give: keyboard control — arrows, Home and
 * End — plus the slider role and its value for a screen reader.
 *
 * `touch-pan-y` keeps the page scrolling under a vertical swipe and claims
 * the horizontal one for the divider — inside the homepage's scroll row the
 * browser would otherwise read a sideways drag as a swipe of the carousel.
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
  const frame = useRef<HTMLDivElement>(null)
  // Whether the reader has taken the handle; the hint below stands down then.
  const touched = useRef(false)
  // The pointer the divider is following, while one is.
  const dragging = useRef<number | null>(null)

  /** Puts the divider under the pointer, held within the frame. */
  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const node = frame.current
    if (!node) return
    const { left, width } = node.getBoundingClientRect()
    if (width <= 0) return
    const next = ((event.clientX - left) / width) * 100
    setPosition(Math.min(Math.max(next, 0), 100))
  }

  const take = (event: PointerEvent<HTMLDivElement>) => {
    // A mouse drags with its main button alone; a finger or pen has no other.
    if (event.pointerType === "mouse" && event.button !== 0) return
    touched.current = true
    dragging.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    follow(event)
  }

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current !== event.pointerId) return
    follow(event)
  }

  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current !== event.pointerId) return
    dragging.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  // The first time the comparison comes into view the handle rocks once —
  // left a little, right a little, home — which is the only way to show that
  // the line is there to be dragged. Not for a reader who asked for less
  // motion, and not once the reader has moved it themselves.
  useEffect(() => {
    const node = frame.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          if (touched.current) return
          const progress = Math.min((now - start) / NUDGE_MS, 1)
          // One full sine wave: out to the left, through the middle to the
          // right, and back — easing itself at both ends.
          setPosition(INITIAL - Math.sin(progress * 2 * Math.PI) * NUDGE)
          if (progress < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={frame}
      onPointerDown={take}
      onPointerMove={move}
      onPointerUp={release}
      onPointerCancel={release}
      // A mouse that drags a photograph starts the browser's own drag of the
      // picture, which cancels the pointer and leaves the divider behind.
      onDragStart={(event) => event.preventDefault()}
      className={cn(
        "relative aspect-1076/610 w-full cursor-ew-resize touch-pan-y overflow-hidden select-none",
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
        onChange={(event) => {
          touched.current = true
          setPosition(Number(event.target.value))
        }}
        aria-valuetext={`${Math.round(position)}%`}
        // Out of the pointer's way — the frame takes every press and drag —
        // but still in the tab order and under a screen reader's finger.
        className="peer pointer-events-none absolute inset-0 z-20 h-full w-full appearance-none bg-transparent opacity-0"
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

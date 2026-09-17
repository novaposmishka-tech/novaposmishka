"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Children, useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/styles"

/** The gap between cards in the row, in pixels — the frame's 24. */
const GAP = 24

/**
 * A row that scrolls sideways, with the pair of round arrows the design puts
 * under it.
 *
 * The scrolling itself is the browser's — the arrows only nudge it — so the
 * row still works with a touch gesture, a trackpad, or no script at all. It
 * takes a tab stop and a name because a scrollable region is not otherwise
 * keyboard-operable; the arrows are extra, not the only way through.
 */
export function ScrollRow({
  label,
  className,
  controlsClassName,
  tone = "light",
  children,
}: {
  readonly label?: string | null
  readonly className?: string
  readonly controlsClassName?: string
  /** "dark" for the rows the design sets on the deep teal card. */
  readonly tone?: "light" | "dark"
  readonly children: React.ReactNode
}) {
  const row = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [current, setCurrent] = useState(0)
  // Nothing until it has been measured: the controls only do anything with
  // script, and only where there is something past the edge to reach.
  const [scrollable, setScrollable] = useState(false)
  const count = Children.count(children)
  const t = useTranslations("general")

  const measure = useCallback(() => {
    const node = row.current
    if (!node) return
    // A fractional scroll width leaves a pixel or two over; round it off.
    const past = node.scrollWidth - node.clientWidth
    setScrollable(past > 2)
    setAtStart(node.scrollLeft < 2)
    setAtEnd(node.scrollLeft >= past - 2)

    const step = cardStep(node)
    setCurrent(step > 0 ? Math.round(node.scrollLeft / step) : 0)
  }, [])

  // How far the row can scroll changes with the breakpoint, with a picture
  // finishing its load, and — where the row sits behind a tab — with the panel
  // being shown at all. None of those is a scroll, so none fires onScroll.
  useEffect(() => {
    const node = row.current
    if (!node) return

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    if (node.firstElementChild) observer.observe(node.firstElementChild)

    return () => observer.disconnect()
  }, [measure, count])

  const nudge = (direction: 1 | -1) => {
    const node = row.current
    if (!node) return
    node.scrollBy({ left: cardStep(node) * direction, behavior: "smooth" })
  }

  const goTo = (index: number) => {
    const node = row.current
    if (!node) return
    node.scrollTo({ left: cardStep(node) * index, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-7.5 lg:gap-12.5">
      <ul
        ref={row}
        tabIndex={0}
        aria-label={label ?? undefined}
        onScroll={measure}
        className={cn(
          // The ring is drawn inside: bleeding the row past the grid to make room
          // for it would take the first card off the column with it.
          // No scrollbar under the row: the frame draws none, and the arrows,
          // the tab stop and a touch gesture all still move it.
          "flex snap-x snap-mandatory [scrollbar-width:none] list-none gap-6 overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 [&::-webkit-scrollbar]:hidden",
          className
        )}
      >
        {children}
      </ul>

      {scrollable && (
        <div
          className={cn(
            "flex items-center justify-center gap-7.5",
            controlsClassName
          )}
        >
          <Arrow
            direction={-1}
            disabled={atStart}
            label={t("previous")}
            tone={tone}
            onClick={nudge}
          />

          {/* The frame marks where you are between the arrows. A mark that
              shows a position is one a reader expects to be able to press, so
              each is a button — with a target big enough to hit, around a dot
              the frame's size. */}
          {count > 1 && (
            // Nine reviews make nine marks, and nine of them will not sit
            // between the arrows on a 360px phone — they wrap rather than push
            // the row off the screen.
            <ul className="flex min-w-0 list-none flex-wrap items-center justify-center">
              {Array.from({ length: count }, (_, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={t("goToSlide", { number: index + 1 })}
                    aria-current={index === current ? "true" : undefined}
                    className="flex cursor-pointer items-center justify-center p-[0.5rem]"
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        index === current
                          ? tone === "dark"
                            ? "bg-white"
                            : "bg-brand-ink"
                          : tone === "dark"
                            ? "bg-brand-body"
                            : "bg-brand-on-dark"
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Arrow
            direction={1}
            disabled={atEnd}
            label={t("next")}
            tone={tone}
            onClick={nudge}
          />
        </div>
      )}
    </div>
  )
}

/**
 * How far one press moves the row: a card and the gap after it, measured from
 * the first so the step follows whatever the breakpoint decided a card is.
 */
function cardStep(node: HTMLUListElement) {
  const first = node.firstElementChild

  return first ? first.clientWidth + GAP : node.clientWidth * 0.8
}

function Arrow({
  direction,
  disabled,
  label,
  tone,
  onClick,
}: {
  readonly direction: 1 | -1
  readonly disabled: boolean
  readonly label: string
  readonly tone: "light" | "dark"
  readonly onClick: (direction: 1 | -1) => void
}) {
  const Icon = direction === 1 ? ArrowRight : ArrowLeft

  return (
    <button
      type="button"
      onClick={() => onClick(direction)}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex size-12.5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:cursor-default disabled:opacity-40",
        tone === "dark"
          ? "text-brand-inverted border-brand-on-dark hover:bg-brand-teal"
          : "border-brand-on-dark text-brand-ink hover:bg-brand-gradient hover:shadow-brand-button hover:text-brand-inverted hover:border-transparent"
      )}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}

export default ScrollRow

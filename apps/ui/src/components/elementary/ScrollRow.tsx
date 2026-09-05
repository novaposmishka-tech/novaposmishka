"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, useRef, useState } from "react"

import { cn } from "@/lib/styles"

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
  const t = useTranslations("general")

  const measure = useCallback(() => {
    const node = row.current
    if (!node) return
    // A fractional scroll width leaves a pixel or two over; round it off.
    setAtStart(node.scrollLeft < 2)
    setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 2)
  }, [])

  const nudge = (direction: 1 | -1) => {
    const node = row.current
    if (!node) return
    // One card at a time, measured from the first one so the step follows
    // whatever the breakpoint decided a card should be.
    const first = node.firstElementChild
    const step = first ? first.clientWidth + 24 : node.clientWidth * 0.8
    node.scrollBy({ left: step * direction, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-8">
      <ul
        ref={row}
        tabIndex={0}
        aria-label={label ?? undefined}
        onScroll={measure}
        className={cn(
          "-mx-2 flex snap-x snap-mandatory list-none gap-6 overflow-x-auto px-2 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2",
          className
        )}
      >
        {children}
      </ul>

      <div
        className={cn(
          "flex items-center justify-center gap-2",
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
        <Arrow
          direction={1}
          disabled={atEnd}
          label={t("next")}
          tone={tone}
          onClick={nudge}
        />
      </div>
    </div>
  )
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
        "flex size-12.5 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:cursor-default disabled:opacity-40",
        tone === "dark"
          ? "text-brand-inverted border-white/40 hover:bg-white/10"
          : "border-brand-border text-brand-ink hover:bg-brand-surface"
      )}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}

export default ScrollRow

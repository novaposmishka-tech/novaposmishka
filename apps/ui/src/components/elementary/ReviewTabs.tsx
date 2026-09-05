"use client"

import { useId, useRef, useState } from "react"

import { cn } from "@/lib/styles"

/**
 * The two-tab switch the design puts beside the reviews heading: written
 * reviews on one side, filmed ones on the other.
 *
 * Both panels are rendered on the server and only their visibility changes, so
 * a reader without scripting still receives every review — the first panel is
 * simply the one they see. Arrow keys move between the tabs, as the tab
 * pattern expects.
 */
export function ReviewTabs({
  heading,
  labels,
  panels,
}: {
  readonly heading?: React.ReactNode
  readonly labels: readonly string[]
  readonly panels: readonly React.ReactNode[]
}) {
  const [active, setActive] = useState(0)
  const id = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (delta: number) => {
    const next = (active + delta + labels.length) % labels.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <>
      {/* The design sets the switch on the heading's line, not above the
          panel, so the header row belongs to this component. */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {heading}
        <div role="tablist" className="flex flex-wrap items-center gap-4">
          {labels.map((label, index) => (
            <button
              key={label}
              ref={(node) => {
                tabs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={active === index}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") move(1)
                if (event.key === "ArrowLeft") move(-1)
              }}
              className={cn(
                "cursor-pointer rounded-full px-7.5 py-3 text-base transition-colors",
                active === index
                  ? "bg-brand-deep text-brand-inverted"
                  : "bg-brand-surface text-brand-ink hover:bg-brand-border"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {panels.map((panel, index) => (
        <div
          key={labels[index]}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== index}
        >
          {panel}
        </div>
      ))}
    </>
  )
}

export default ReviewTabs

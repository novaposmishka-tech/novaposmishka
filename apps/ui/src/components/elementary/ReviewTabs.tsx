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
  icons,
  panels,
}: {
  readonly heading?: React.ReactNode
  readonly labels: readonly string[]
  /** Drawn before the label, where the frame gives a tab a mark of its own. */
  readonly icons?: readonly React.ReactNode[]
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
      <div className="flex flex-wrap items-center justify-between gap-5">
        {heading}
        <div role="tablist" className="flex flex-wrap items-center gap-5">
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
                // The frame gives the chosen tab the brand gradient and leaves
                // the other one outlined in teal, at the same two sizes every
                // button on the page takes.
                "flex h-10 cursor-pointer items-center gap-2.5 rounded-[30px] px-5 text-base/5.5 font-semibold transition-colors lg:h-12.5 lg:px-7.5",
                active === index
                  ? "bg-brand-gradient text-brand-inverted shadow-brand-card"
                  : "border-brand-teal text-brand-ink hover:bg-brand-surface border bg-white"
              )}
            >
              {icons?.[index]}
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

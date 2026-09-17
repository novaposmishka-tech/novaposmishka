"use client"

import type { Data } from "@repo/strapi-types"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"

import { ReviewCard } from "@/components/elementary/ReviewCard"
import { cn } from "@/lib/styles"

type Testimonial = NonNullable<
  Data.Component<"sections.testimonials">["testimonials"]
>[number]

/**
 * How many reviews a page holds — three columns of three where the frame has
 * three columns, and the same nine read one under another on a phone.
 */
const PAGE_SIZE = 9

/** How many numbered pages stand either side of the current one. */
const NEIGHBOURS = 1

/**
 * The written reviews on the reviews page: one under another on a phone, and
 * the frame's three columns from md up.
 *
 * Columns rather than a grid because the reviews are different lengths and
 * columns pack them without the ragged bottom a grid would leave.
 *
 * A page at a time rather than all of them: the clinic has some two hundred,
 * and a button that revealed the rest made one page of the lot. Pages keep it
 * to a readable length and let a reader come back to where they were.
 */
export function ReviewColumns({
  testimonials,
  label,
  labels,
}: {
  readonly testimonials: readonly Testimonial[]
  readonly label?: string | null
  readonly labels: {
    more: string
    less: string
    rating: string
    showMore: string
  }
}) {
  const t = useTranslations("tables")
  const [page, setPage] = useState(0)
  const top = useRef<HTMLDivElement>(null)
  const pages = Math.max(1, Math.ceil(testimonials.length / PAGE_SIZE))
  // Guard against a page that no longer exists — the list comes from the CMS
  // and can shrink under a reader who is deep into it.
  const current = Math.min(page, pages - 1)
  const shown = testimonials.slice(
    current * PAGE_SIZE,
    current * PAGE_SIZE + PAGE_SIZE
  )

  const goTo = (next: number) => {
    setPage(Math.max(0, Math.min(next, pages - 1)))
    // Back to the first of the new page rather than wherever the last one
    // ended — otherwise turning a page leaves the reader mid-list.
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div ref={top} className="flex scroll-mt-24 flex-col gap-7.5 lg:gap-12.5">
      <ul
        aria-label={label ?? undefined}
        className="flex list-none flex-col gap-5 md:block md:columns-2 md:gap-6 md:*:mb-6 lg:columns-3"
      >
        {shown.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} labels={labels} />
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav
          aria-label={label ?? undefined}
          className="flex items-center justify-center gap-2.5 lg:gap-5"
        >
          <Step
            icon={ArrowLeft}
            label={t("previousPage")}
            disabled={current === 0}
            onClick={() => goTo(current - 1)}
          />

          <ul className="flex list-none items-center gap-1.25 lg:gap-2.5">
            {pageNumbers(current, pages).map((entry, index, all) =>
              entry === null ? (
                // A gap in the run of numbers, not a control: it says the
                // pages carry on rather than offering one to press.
                <li
                  key={`gap-after-${all[index - 1]}`}
                  aria-hidden
                  className="text-brand-body px-1"
                >
                  …
                </li>
              ) : (
                <li key={entry}>
                  <button
                    type="button"
                    onClick={() => goTo(entry)}
                    aria-current={entry === current ? "page" : undefined}
                    aria-label={t("pageXOfY", { x: entry + 1, y: pages })}
                    className={cn(
                      "flex size-10 cursor-pointer items-center justify-center rounded-full text-sm/5 transition-colors lg:size-11.5 lg:text-base/5.5",
                      entry === current
                        ? "bg-brand-gradient text-brand-inverted shadow-brand-button font-semibold"
                        : "text-brand-ink hover:bg-brand-mist"
                    )}
                  >
                    {entry + 1}
                  </button>
                </li>
              )
            )}
          </ul>

          <Step
            icon={ArrowRight}
            label={t("nextPage")}
            disabled={current === pages - 1}
            onClick={() => goTo(current + 1)}
          />
        </nav>
      )}
    </div>
  )
}

/** The round outlined arrow the site uses to step through a row of cards. */
function Step({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  readonly icon: typeof ArrowLeft
  readonly label: string
  readonly disabled: boolean
  readonly onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="border-brand-on-dark text-brand-ink hover:bg-brand-gradient hover:shadow-brand-button hover:text-brand-inverted flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors hover:border-transparent disabled:cursor-default disabled:opacity-40 lg:size-12.5"
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}

/**
 * The run of page numbers to draw: the first, the last, the current one and
 * its neighbours, with a gap standing in for whatever is skipped. Two hundred
 * reviews are twenty-odd pages, and twenty-odd numbers is not a control.
 */
function pageNumbers(current: number, pages: number): (number | null)[] {
  const wanted = new Set<number>([0, pages - 1, current])
  for (let step = 1; step <= NEIGHBOURS; step++) {
    wanted.add(current - step)
    wanted.add(current + step)
  }

  const run = [...wanted]
    .filter((page) => page >= 0 && page < pages)
    .sort((a, b) => a - b)

  const out: (number | null)[] = []
  for (const [index, page] of run.entries()) {
    if (index > 0 && page - run[index - 1]! > 1) {
      out.push(null)
    }
    out.push(page)
  }

  return out
}

export default ReviewColumns

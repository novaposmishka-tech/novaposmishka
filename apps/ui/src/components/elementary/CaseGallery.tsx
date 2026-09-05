"use client"

import type { Data } from "@repo/strapi-types"
import { useMemo, useState } from "react"

import { BeforeAfterSlider } from "@/components/elementary/BeforeAfterSlider"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { caseStudyId } from "@/lib/case-studies"
import { cn } from "@/lib/styles"

type Case = NonNullable<Data.Component<"sections.results">["cases"]>[number]

/** How many a grid shows before the reader asks for the rest. */
const PAGE_SIZE = 4

/**
 * The prefix the design gives a tag that names a case written up in full
 * further down the page. Those chips jump to the write-up; every other chip
 * filters the grid.
 */
const WRITTEN_UP = "Кейс:"

/**
 * The clinic's before/after cases, filtered by the tags the cases carry.
 *
 * Client-side because the filter is a local choice with no bearing on the URL
 * or on what the server renders: every case is already on the page, and a tag
 * only decides which of them are shown.
 */
export function CaseGallery({
  cases,
  labels,
  display = "carousel",
}: {
  readonly cases: Case[]
  readonly labels: {
    all: string
    before: string
    after: string
    list: string
    more: string
    compare: string
  }
  readonly display?: "carousel" | "grid"
}) {
  const isGrid = display === "grid"
  const tags = useMemo(() => {
    const seen = new Set<string>()
    for (const item of cases) {
      for (const tag of item.tags ?? []) {
        if (tag.text) seen.add(tag.text)
      }
    }

    return [...seen]
  }, [cases])

  const [active, setActive] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)

  const matching = active
    ? cases.filter((item) => item.tags?.some((tag) => tag.text === active))
    : cases
  const shown = isGrid ? matching.slice(0, limit) : matching

  return (
    <div className="flex flex-col gap-10">
      {tags.length > 0 && (
        <ul className="flex list-none flex-wrap gap-3">
          {[null, ...tags].map((tag) => {
            const chip = cn(
              "block cursor-pointer rounded-full px-7.5 py-3 text-base transition-colors",
              active === tag
                ? isGrid
                  ? "bg-brand-deep text-brand-inverted"
                  : "text-brand-ink bg-white"
                : isGrid
                  ? "bg-brand-surface text-brand-ink hover:bg-brand-border"
                  : "text-brand-inverted bg-white/10 hover:bg-white/20"
            )

            return (
              <li key={tag ?? "all"}>
                {tag?.startsWith(WRITTEN_UP) ? (
                  <a href={"#" + caseStudyId(tag)} className={chip}>
                    {tag}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActive(tag)
                      setLimit(PAGE_SIZE)
                    }}
                    aria-pressed={active === tag}
                    className={chip}
                  >
                    {tag ?? labels.all}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {/* The listing page lays the cases out as a grid; on the homepage they
          are a scroll-snap row — no script, and it works with touch. A
          scrollable region is not keyboard-operable on its own, though, so
          there it takes a tab stop and a name. */}
      <ul
        {...(isGrid ? {} : { tabIndex: 0, "aria-label": labels.list })}
        className={cn(
          "list-none",
          isGrid
            ? "grid grid-cols-1 gap-6 md:grid-cols-2"
            : "-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        )}
      >
        {shown.map((item) => (
          <li
            key={item.id}
            className={cn(
              "rounded-[26px] p-7.5",
              isGrid
                ? "border-brand-border bg-brand-paper border"
                : // Two to a row, whatever the container is: the design's fixed
                  // 598px card assumes its own container width and is clipped
                  // in ours.
                  "w-full shrink-0 snap-start bg-white/5 md:w-[calc(50%-0.75rem)]"
            )}
          >
            <div className="flex flex-col gap-6">
              <BeforeAfterSlider
                before={item.before}
                after={item.after}
                labels={labels}
                className="rounded-2xl"
              />

              <div className="flex flex-col gap-5">
                {item.caption && (
                  <p
                    className={cn(
                      "text-2xl font-semibold",
                      isGrid ? "text-brand-ink" : "text-brand-inverted"
                    )}
                  >
                    {item.caption}
                  </p>
                )}

                {item.doctorName && (
                  <div
                    className={cn(
                      "flex items-center gap-4 border-t pt-5",
                      isGrid ? "border-brand-border" : "border-white/15"
                    )}
                  >
                    {item.doctorPhoto && (
                      <StrapiBasicImage
                        component={item.doctorPhoto}
                        className="size-17.5 rounded-full object-cover"
                      />
                    )}
                    <span
                      className={cn(
                        "text-xl",
                        isGrid ? "text-brand-ink" : "text-brand-inverted"
                      )}
                    >
                      {item.doctorName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isGrid && matching.length > shown.length && (
        <button
          type="button"
          onClick={() => setLimit((current) => current + PAGE_SIZE)}
          className="bg-brand-deep text-brand-inverted hover:bg-brand-mid mx-auto cursor-pointer rounded-full px-7.5 py-3 text-base transition-colors"
        >
          {labels.more}
        </button>
      )}
    </div>
  )
}

CaseGallery.displayName = "CaseGallery"

export default CaseGallery

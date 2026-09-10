"use client"

import type { Data } from "@repo/strapi-types"
import { useMemo, useState } from "react"

import { BeforeAfterSlider } from "@/components/elementary/BeforeAfterSlider"
import { ScrollRow } from "@/components/elementary/ScrollRow"
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
        <ul className="flex list-none flex-wrap gap-4 lg:gap-5">
          {[null, ...tags].map((tag) => {
            const chip = cn(
              "flex h-10 cursor-pointer items-center rounded-[30px] px-5 text-base transition-colors lg:h-11.5 lg:px-7.5",
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
          are the design's scrolling row, with its arrows underneath. */}
      <Cases isGrid={isGrid} label={labels.list}>
        {shown.map((item) => (
          <li
            key={item.id}
            className={cn(
              "rounded-[20px] p-5 lg:rounded-[26px] lg:p-7.5",
              isGrid
                ? "border-brand-border bg-brand-paper border"
                : // Two to a row, whatever the container is: the design's fixed
                  // 598px card assumes its own container width and is clipped
                  // in ours.
                  "w-full shrink-0 snap-start border border-white/5 bg-white/5 md:w-[calc(50%-0.75rem)]"
            )}
          >
            <div className="flex flex-col gap-5 lg:gap-7.5">
              <BeforeAfterSlider
                before={item.before}
                after={item.after}
                labels={labels}
                // The frame crops the pair to its own box, which is shallower on a
                // phone than on a desktop.
                className="aspect-289/189 rounded-2xl lg:aspect-538/293"
              />

              <div className="flex flex-col gap-4 lg:gap-5">
                {item.caption && (
                  <p
                    className={cn(
                      "text-lg/6.25 font-semibold lg:text-2xl/8.5",
                      isGrid ? "text-brand-ink" : "text-brand-inverted"
                    )}
                  >
                    {item.caption}
                  </p>
                )}

                {item.doctorName && (
                  <div
                    className={cn(
                      "flex items-center gap-3.75 border-t pt-4 lg:pt-5",
                      isGrid ? "border-brand-border" : "border-white/20"
                    )}
                  >
                    {item.doctorPhoto && (
                      <StrapiBasicImage
                        component={item.doctorPhoto}
                        className="size-12.5 shrink-0 rounded-full object-cover lg:size-17.5"
                      />
                    )}
                    <span
                      className={cn(
                        "text-sm/5 lg:text-xl/7",
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
      </Cases>

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

/** The grid on the listing page, the scrolling row on the homepage. */
function Cases({
  isGrid,
  label,
  children,
}: {
  readonly isGrid: boolean
  readonly label: string
  readonly children: React.ReactNode
}) {
  if (isGrid) {
    return (
      <ul className="grid list-none grid-cols-1 gap-6 md:grid-cols-2">
        {children}
      </ul>
    )
  }

  return (
    <ScrollRow
      label={label}
      tone="dark"
      className="focus-visible:outline-white"
    >
      {children}
    </ScrollRow>
  )
}

CaseGallery.displayName = "CaseGallery"

export default CaseGallery

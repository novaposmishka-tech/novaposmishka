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

    // The frame puts every filter first and the write-ups after them, on a
    // row of their own. Taken in the order the cases carry them the two kinds
    // interleave, and a write-up's long name lands between two categories and
    // breaks the row apart. The order within each kind is still the CMS's.
    const all = [...seen]

    return [
      ...all.filter((tag) => !tag.startsWith(WRITTEN_UP)),
      ...all.filter((tag) => tag.startsWith(WRITTEN_UP)),
    ]
  }, [cases])

  // The frame opens on the first tab rather than on everything at once. The
  // design review asked for that back: the tabs exist to separate one case
  // from the next, and a list of all of them together loses where each begins.
  const [chosen, setChosen] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)

  const firstFilter = tags.find((tag) => !tag.startsWith(WRITTEN_UP))
  const active = chosen ?? firstFilter ?? null

  const matching = active
    ? cases.filter((item) => item.tags?.some((tag) => tag.text === active))
    : cases
  const shown = isGrid ? matching.slice(0, limit) : matching

  return (
    <div className="flex flex-col gap-7.5 lg:gap-10">
      {tags.length > 0 && (
        <ul
          className={cn(
            "flex list-none flex-wrap gap-4 lg:gap-5",
            // The listing page centres its filters; the homepage ranges them
            // against the grid.
            isGrid && "justify-center"
          )}
        >
          {tags.map((tag) => {
            const chip = cn(
              // A minimum rather than a fixed height: the frame's chips are all
              // 40 because its labels are all one line, and a longer one — a
              // write-up's name on a phone — spilled out of the pill instead of
              // making it taller. The padding keeps a single line at 40.
              "flex min-h-10 cursor-pointer items-center rounded-[30px] px-5 py-1.75 text-center text-base transition-colors lg:min-h-11.5 lg:px-7.5",
              active === tag
                ? isGrid
                  ? // On the light page the frame fills the chosen chip with
                    // the brand gradient and outlines the rest in teal; a
                    // gradient goes flat teal under the pointer.
                    "bg-brand-gradient text-brand-inverted shadow-brand-button hover:bg-brand-teal font-semibold hover:bg-none"
                  : "text-brand-ink bg-white"
                : isGrid
                  ? "border-brand-teal text-brand-ink hover:bg-brand-gradient hover:text-brand-inverted border bg-white hover:border-transparent"
                  : // On the dark band the frame whitens the chip rather than
                    // deepening it.
                    "text-brand-inverted hover:text-brand-ink bg-white/10 hover:bg-white"
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
                      setChosen(tag)
                      setLimit(PAGE_SIZE)
                    }}
                    aria-pressed={active === tag}
                    className={chip}
                  >
                    {tag}
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
                ? "shadow-brand-card bg-white"
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
                      // Grey, not the pale blue of brand-border: the frame rules a card in
                      // the same hairline the rest of the site uses.
                      isGrid ? "border-brand-hairline" : "border-white/20"
                    )}
                  >
                    {item.doctorPhoto && (
                      <StrapiBasicImage
                        component={item.doctorPhoto}
                        // The frame sets the portrait on a pale disc, which shows wherever the
                        // photograph does not fill the circle.
                        // The portraits are half-body and begin at the hairline, so a
                        // centred square crop takes the top of the head off. Ranged
                        // to the top it comes off the chest instead.
                        className="bg-brand-on-dark size-12.5 shrink-0 rounded-full object-cover object-top lg:size-17.5"
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

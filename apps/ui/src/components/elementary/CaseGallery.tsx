"use client"

import type { Data } from "@repo/strapi-types"
import { useMemo, useState } from "react"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { cn } from "@/lib/styles"

type Case = NonNullable<Data.Component<"sections.results">["cases"]>[number]

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
}: {
  readonly cases: Case[]
  readonly labels: { all: string; before: string; after: string; list: string }
}) {
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

  const shown = active
    ? cases.filter((item) => item.tags?.some((tag) => tag.text === active))
    : cases

  return (
    <div className="flex flex-col gap-10">
      {tags.length > 0 && (
        <ul className="flex list-none flex-wrap gap-3">
          {[null, ...tags].map((tag) => (
            <li key={tag ?? "all"}>
              <button
                type="button"
                onClick={() => setActive(tag)}
                aria-pressed={active === tag}
                className={cn(
                  "cursor-pointer rounded-full px-7.5 py-3 text-base transition-colors",
                  active === tag
                    ? "text-brand-ink bg-white"
                    : "text-brand-inverted bg-white/10 hover:bg-white/20"
                )}
              >
                {tag ?? labels.all}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* A scroll-snap row rather than a carousel widget — no script, and it
          works with touch. A scrollable region is not keyboard-operable on its
          own, though, so it takes a tab stop and a name of its own. */}
      <ul
        tabIndex={0}
        aria-label={labels.list}
        className="-mx-2 flex snap-x snap-mandatory list-none gap-6 overflow-x-auto px-2 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {shown.map((item) => (
          <li
            key={item.id}
            // Two to a row, whatever the container is: the design's fixed 598px
            // card assumes its own container width and gets clipped in ours.
            className="w-full shrink-0 snap-start rounded-[26px] bg-white/5 p-7.5 md:w-[calc(50%-0.75rem)]"
          >
            <div className="flex flex-col gap-6">
              <div className="relative grid grid-cols-2 gap-0 overflow-hidden rounded-2xl">
                <Half image={item.before} label={labels.before} align="left" />
                <Half image={item.after} label={labels.after} align="right" />
              </div>

              <div className="flex flex-col gap-5">
                {item.caption && (
                  <p className="text-brand-inverted text-2xl font-semibold">
                    {item.caption}
                  </p>
                )}

                {item.doctorName && (
                  <div className="flex items-center gap-4 border-t border-white/15 pt-5">
                    {item.doctorPhoto && (
                      <StrapiBasicImage
                        component={item.doctorPhoto}
                        className="size-17.5 rounded-full object-cover"
                      />
                    )}
                    <span className="text-brand-inverted text-xl">
                      {item.doctorName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Half({
  image,
  label,
  align,
}: {
  readonly image: Case["before"]
  readonly label: string
  readonly align: "left" | "right"
}) {
  if (!image) {
    return null
  }

  return (
    <div className="relative">
      <StrapiBasicImage
        component={image}
        className="aspect-269/293 w-full object-cover"
      />
      <span
        className={cn(
          "text-brand-ink absolute top-5 rounded-full bg-white px-4 py-1 text-sm",
          align === "left" ? "left-5" : "right-5"
        )}
      >
        {label}
      </span>
    </div>
  )
}

CaseGallery.displayName = "CaseGallery"

export default CaseGallery

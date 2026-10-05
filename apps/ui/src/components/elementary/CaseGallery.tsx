"use client"

import type { Data } from "@repo/strapi-types"
import { useState } from "react"

import { BeforeAfterSlider } from "@/components/elementary/BeforeAfterSlider"
import { showGrid, useChosenCase } from "@/components/elementary/CasePanel"
import { ScrollRow } from "@/components/elementary/ScrollRow"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { cn } from "@/lib/styles"

type Group = NonNullable<Data.Component<"sections.results">["groups"]>[number]

/** A chip that jumps to a case written up in full, here or on another page. */
export type CaseLink = {
  readonly label: string
  readonly href: string
}

/** How many a grid shows before the reader asks for the rest. */
const PAGE_SIZE = 4

/**
 * The clinic's works, one tab per direction of treatment.
 *
 * Each tab is a group the CMS holds as such — a name and the cases under it —
 * so what the editor sees is what the reader gets. After the tabs come the
 * chips for the cases told end to end. On the listing page a chip is a tab
 * too: the case takes the grid's place while it is chosen, as the frame draws
 * it. On the homepage the chips lead to the listing instead.
 *
 * Client-side because the tab is a local choice with no bearing on the URL or
 * on what the server renders: every group is already on the page, and a tab
 * only decides which of them is shown.
 */
export function CaseGallery({
  groups,
  caseLinks = [],
  labels,
  display = "carousel",
}: {
  readonly groups: readonly Group[]
  readonly caseLinks?: readonly CaseLink[]
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

  // The frame opens on the first tab rather than on everything at once. The
  // design review asked for that back: the tabs exist to separate one
  // direction from the next, and a list of all of them together loses where
  // each begins.
  const [chosen, setChosen] = useState(0)
  const [limit, setLimit] = useState(PAGE_SIZE)
  // Only once a tab has been pressed: the cards of the first showing are the
  // listing page's first screen, and they are simply there.
  const [switched, setSwitched] = useState(false)

  // The case chosen by the URL's fragment, where one of the chips here
  // names it — only the listing page's chips do.
  const chosenCase = useChosenCase()
  const showingCase =
    chosenCase !== "" &&
    caseLinks.some((link) => link.href === "#" + chosenCase)

  const active = groups[chosen] ?? groups[0]
  const cases = active?.cases ?? []
  const shown = isGrid ? cases.slice(0, limit) : cases

  return (
    <div className="flex flex-col gap-7.5 lg:gap-10">
      {(groups.length > 0 || caseLinks.length > 0) && (
        <ul
          className={cn(
            "flex list-none flex-wrap gap-4 lg:gap-5",
            // The listing page centres its filters; the homepage ranges them
            // against the grid.
            isGrid && "justify-center"
          )}
        >
          {groups.map((group, index) => (
            <li key={group.id}>
              <button
                type="button"
                onClick={() => {
                  setChosen(index)
                  setLimit(PAGE_SIZE)
                  setSwitched(true)
                  if (showingCase) showGrid()
                }}
                aria-pressed={!showingCase && index === chosen}
                className={chip(isGrid, !showingCase && index === chosen)}
              >
                {group.title}
              </button>
            </li>
          ))}

          {/* The frame puts every tab first and the write-ups after them, on
              a row of their own where a long name would otherwise land
              between two tabs and break the row apart. */}
          {caseLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={
                  link.href === "#" + chosenCase ? "true" : undefined
                }
                className={chip(isGrid, link.href === "#" + chosenCase)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* The listing page lays the cases out as a grid; on the homepage they
          are the design's scrolling row, with its arrows underneath. Keyed on
          the group so a change of tab starts the row from its first card and
          measures it afresh, rather than keeping the last tab's scroll. */}
      {!showingCase && (
        <Cases
          key={active?.id}
          isGrid={isGrid}
          cascade={switched}
          label={labels.list}
        >
          {shown.map((item) => (
            <li
              key={item.id}
              className={cn(
                "lift rounded-[20px] p-5 lg:rounded-[26px] lg:p-7.5",
                isGrid
                  ? "shadow-brand-card bg-white"
                  : // Two to a row, whatever the container is: the design's fixed
                    // 598px card assumes its own container width and is clipped
                    // in ours.
                    "w-full shrink-0 snap-start border border-white/5 bg-white/5 md:w-[calc(50%-0.75rem)]"
              )}
            >
              {/* Cards in a row are all as tall as the tallest. Left to itself
                the spare height fell below the doctor's name, which is the
                "нижній відступ" of the design review; the column now fills the
                card and the name sits on its floor, so the room shows above
                the rule where the frame has it. */}
              <div className="flex h-full flex-col gap-5 lg:gap-7.5">
                <BeforeAfterSlider
                  before={item.before}
                  after={item.after}
                  labels={labels}
                  // The frame crops the pair to its own box, which is shallower on a
                  // phone than on a desktop.
                  className="aspect-289/189 rounded-2xl lg:aspect-538/293"
                />

                {/* Fills what the slider leaves, so the doctor's row below can
                  reach the card's floor. */}
                <div className="flex flex-1 flex-col gap-4 lg:gap-5">
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
                        "mt-auto flex items-center gap-3.75 border-t pt-4 lg:pt-5",
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
      )}

      {isGrid && !showingCase && cases.length > shown.length && (
        <button
          type="button"
          onClick={() => setLimit((current) => current + PAGE_SIZE)}
          // The frame's "Button state" sheet gives a filled button on a light
          // page the brand gradient and its shadow, and turns it flat teal
          // under the pointer. This one was drawn with the gradient's darkest
          // stop alone and moved to its middle stop instead — near enough to
          // look deliberate, but the only button on the site that did not
          // follow the sheet. `hover:bg-none` drops the gradient image so the
          // flat colour underneath can show.
          className="bg-brand-gradient text-brand-inverted shadow-brand-button hover:bg-brand-teal mx-auto cursor-pointer rounded-full px-7.5 py-3 text-base transition-colors hover:bg-none"
        >
          {labels.more}
        </button>
      )}
    </div>
  )
}

/** The pill a tab or a write-up's chip is drawn as, on either background. */
function chip(isGrid: boolean, active: boolean) {
  return cn(
    // A minimum rather than a fixed height: the frame's chips are all
    // 40 because its labels are all one line, and a longer one — a
    // write-up's name on a phone — spilled out of the pill instead of
    // making it taller. The padding keeps a single line at 40.
    "flex min-h-10 cursor-pointer items-center rounded-[30px] px-5 py-1.75 text-center text-base transition-[color,background-color,border-color,scale] active:scale-[0.97] lg:min-h-11.5 lg:px-7.5",
    active
      ? isGrid
        ? // On the light page the frame fills the chosen chip with
          // the brand gradient and outlines the rest in teal; a
          // gradient goes flat teal under the pointer.
          "bg-brand-gradient text-brand-inverted shadow-brand-button hover:bg-brand-teal font-semibold hover:bg-none"
        : "text-brand-ink bg-white"
      : isGrid
        ? // Under the pointer it takes the gradient and, with it, the
          // shadow every gradient button carries.
          "border-brand-teal text-brand-ink hover:bg-brand-gradient hover:text-brand-inverted hover:shadow-brand-button border bg-white hover:border-transparent"
        : // On the dark band the frame whitens the chip rather than
          // deepening it: white at a tenth, ringed in white at about
          // a half.
          //
          // An even ring, not the header button's. Figma's glass
          // refracts what is behind it, so the same effect reads
          // differently in the two places: over a photograph it
          // lights one corner and leaves the opposite sides bare,
          // while over this flat gradient it comes out level all the
          // way round — measured off the frame at luminance 170 on
          // the top and left against 145 on the bottom and right,
          // over a ground of 60.
          "text-brand-inverted hover:text-brand-ink border border-white/50 bg-white/10 hover:bg-white"
  )
}

/** The grid on the listing page, the scrolling row on the homepage. */
function Cases({
  isGrid,
  cascade,
  label,
  children,
}: {
  readonly isGrid: boolean
  /** Send the cards in one after another as the list appears. */
  readonly cascade: boolean
  readonly label: string
  readonly children: React.ReactNode
}) {
  if (isGrid) {
    return (
      <ul
        data-stagger
        className={cn(
          "grid list-none grid-cols-1 gap-6 md:grid-cols-2",
          cascade && "cascade"
        )}
      >
        {children}
      </ul>
    )
  }

  return (
    <ScrollRow
      label={label}
      tone="dark"
      className={cn("focus-visible:outline-white", cascade && "cascade")}
    >
      {children}
    </ScrollRow>
  )
}

CaseGallery.displayName = "CaseGallery"

export default CaseGallery

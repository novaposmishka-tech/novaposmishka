"use client"

import { ArrowRight } from "lucide-react"
import type React from "react"
import { useState } from "react"

import AppLink from "@/components/elementary/AppLink"
import { DiscAccordionTrigger } from "@/components/elementary/DiscAccordionTrigger"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion"
import { cn } from "@/lib/styles"

export interface SubserviceItem {
  readonly id: number | string
  readonly name?: string | null
  readonly description?: string | null
  /** The sub-service's own page; an entry without one has no way through. */
  readonly href?: string
  readonly linkLabel?: string | null
  /** The photograph, already rendered on the server, where there is one. */
  readonly image?: React.ReactNode
}

/**
 * What a direction covers: its sub-services as a list that opens one at a
 * time, each onto a sentence about it and the way through to its page.
 *
 * On a desktop the design sets a photograph under the heading that follows
 * the list — whichever entry was opened last is the one pictured, named on a
 * pill over it. On a phone there is no room beside the list, so the
 * photograph opens with the entry, above its sentence. The photographs are an
 * editor's to add: with none at all the frame is not drawn, and an entry
 * without one of its own leaves the frame's pale ground showing.
 */
export function SubserviceAccordion({
  heading,
  items,
  labels,
  bookHref,
}: {
  /** The heading and the paragraph under it, rendered on the server. */
  readonly heading: React.ReactNode
  readonly items: readonly SubserviceItem[]
  readonly labels: { readonly book: string; readonly details: string }
  readonly bookHref: string
}) {
  const first = items[0]?.id.toString() ?? ""
  // The list may be shut entirely; the photograph stays on the last entry
  // that was open rather than going blank.
  const [open, setOpen] = useState(first)
  const [pictured, setPictured] = useState(first)
  const current = items.find((item) => item.id.toString() === pictured)
  const hasPhotos = items.some((item) => item.image)

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
      <div data-stagger className="flex flex-col gap-5">
        {heading}

        {hasPhotos && (
          <div className="bg-brand-mist relative mt-5 aspect-4/3 w-full overflow-hidden rounded-[32px] max-lg:hidden">
            {/* Every photograph is in the frame from the start and only the
                pictured one is shown, so the change is a fade between two
                pictures that are both already there. */}
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "absolute inset-0 transition-[opacity,scale] duration-500",
                  item.id.toString() === pictured
                    ? "opacity-100"
                    : "pointer-events-none scale-[1.04] opacity-0"
                )}
              >
                {item.image}
              </div>
            ))}

            {current?.name && (
              <span className="text-brand-ink absolute top-5 left-5 max-w-[calc(100%-2.5rem)] truncate rounded-full bg-white/90 px-4 py-2 text-sm">
                {current.name}
              </span>
            )}
          </div>
        )}
      </div>

      <Accordion
        data-stagger
        type="single"
        collapsible
        value={open}
        onValueChange={(value) => {
          setOpen(value)
          if (value) {
            setPictured(value)
          }
        }}
        className="bg-brand-mist w-full rounded-[20px] px-5 py-2 lg:rounded-[32px] lg:px-8 lg:py-4"
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id.toString()}
            className="border-t border-b-0 border-[#e1e6ea] first:border-t-0"
          >
            {/* The trigger's own chevron is put away for the design's: a disc
                that fills with the brand's teal and turns over while the
                entry is open. */}
            <DiscAccordionTrigger className="data-[state=open]:text-brand-light py-4.5 text-base/[1.5] font-medium data-[state=open]:font-semibold lg:py-5.5 lg:text-lg/[1.5]">
              {item.name}
            </DiscAccordionTrigger>

            <AccordionContent className="flex flex-col gap-4.5 pb-6 motion-safe:animate-[rise_0.35s_var(--ease-out)]">
              {item.image && (
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-[20px] bg-white lg:hidden">
                  {item.image}
                </div>
              )}

              {item.description && (
                <p className="text-brand-body max-w-130 text-[0.9375rem]/[1.5]">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {item.href && (
                  <AppLink
                    href={item.href}
                    variant="default"
                    className="h-12 gap-2.5 rounded-[30px] px-6.5 text-[0.9375rem] font-semibold"
                  >
                    {item.linkLabel ?? labels.details}
                    <ArrowRight aria-hidden className="size-5" />
                  </AppLink>
                )}
                {/* Outlined in teal, filling white on the pane's mist — there
                    is no outlined variant in the brand's look, so it is
                    spelled out as the other blocks spell theirs. */}
                <AppLink
                  href={bookHref}
                  data-analytics-location="subservices"
                  className="border-brand-teal text-brand-ink h-12 rounded-[30px] border px-6 text-[0.9375rem] font-semibold no-underline transition-colors hover:bg-white"
                >
                  {labels.book}
                </AppLink>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default SubserviceAccordion

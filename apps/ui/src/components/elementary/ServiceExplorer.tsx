"use client"

import { ArrowRight } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"

import AppLink from "@/components/elementary/AppLink"
import { cn } from "@/lib/styles"

export interface ExplorerTag {
  readonly id: number | string
  readonly label?: string | null
  readonly href?: string | null
}

export interface ExplorerService {
  readonly id: number | string
  readonly name?: string | null
  readonly description?: string | null
  /** Where the direction's own page is; a row without one only previews. */
  readonly href?: string
  readonly linkLabel?: string | null
  readonly tags: readonly ExplorerTag[]
  /** The illustration, already rendered on the server. */
  readonly image?: React.ReactNode
}

interface Labels {
  readonly book: string
  readonly details: string
}

// The filled button is the site's own — the `default` variant carries the
// gradient, its shadow and the hover — and only its measure is stated here.
// There is no outlined variant in the brand's look, so that one is spelled
// out, the same way the services grid and the team row spell theirs.
const FILLED = "h-12.5 gap-2 rounded-[30px] px-7.5 text-base font-semibold"
const OUTLINED =
  "border-brand-teal text-brand-ink hover:bg-brand-light hover:text-brand-inverted h-12.5 justify-center rounded-[30px] border px-6.5 text-base font-semibold no-underline hover:border-transparent"

/**
 * The services index: every direction as a row, and what the row stands for.
 *
 * The design draws it two ways. On a desktop the rows are a menu — pointing
 * at one, or tabbing to it, fills a panel beside the list with that
 * direction's picture, its sub-services and the way through, and a click
 * goes straight to its page. On a phone there is no pointer and no room for
 * a panel, so a row opens in place like an accordion and carries the same
 * things under itself.
 *
 * Both are in the markup and the breakpoint picks one: a row is a link from
 * `lg` up and a button below it. Nothing measures the window, so the server
 * renders the right one for every screen.
 */
export function ServiceExplorer({
  services,
  labels,
  bookHref,
}: {
  readonly services: readonly ExplorerService[]
  readonly labels: Labels
  /** Where "Записатися" in the panel leads: the booking form. */
  readonly bookHref: string
}) {
  // The desktop panel always shows something, so it starts on the first
  // direction; the phone list starts closed.
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(-1)
  const current = services[active] ?? services[0]

  if (!current) {
    return null
  }

  return (
    <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
      <ul className="border-brand-hairline flex list-none flex-col border-b">
        {services.map((service, index) => {
          const isActive = index === active
          const isOpen = index === open

          return (
            <li key={service.id} className="border-brand-hairline border-t">
              {/* Desktop: the row previews under the pointer and leads on. */}
              <RowLink
                href={service.href}
                isActive={isActive}
                onPreview={() => setActive(index)}
                className="max-lg:hidden"
              >
                <Row
                  name={service.name}
                  on={isActive}
                  className={cn(isActive && "translate-x-3")}
                />
              </RowLink>

              {/* Phone: the row opens in place. */}
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`service-${service.id}`}
                onClick={() => {
                  setOpen(isOpen ? -1 : index)
                  setActive(index)
                }}
                className="w-full cursor-pointer text-left lg:hidden"
              >
                <Row
                  name={service.name}
                  on={isOpen}
                  arrowClassName={cn(isOpen && "rotate-90")}
                />
              </button>

              <div
                id={`service-${service.id}`}
                hidden={!isOpen}
                className="flex flex-col gap-4 pb-6 motion-safe:animate-[rise_0.4s_var(--ease-out)] lg:hidden"
              >
                <div className="flex items-center gap-4">
                  {service.image && (
                    <div className="relative h-24 w-27.5 shrink-0">
                      {service.image}
                    </div>
                  )}
                  {service.description && (
                    <p className="text-brand-body text-sm/5">
                      {service.description}
                    </p>
                  )}
                </div>

                <Tags tags={service.tags} className="bg-brand-mist text-xs" />

                {service.href && (
                  <AppLink
                    href={service.href}
                    variant="default"
                    className={cn(FILLED, "h-12 w-full")}
                  >
                    {service.linkLabel ?? labels.details}
                    <ArrowRight aria-hidden className="size-5" />
                  </AppLink>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {/* The preview. The design pins it beside the list; the page clips its
          own overflow, which rules a sticky box out, and the seven rows are
          no taller than the panel, so it simply stands beside them. */}
      <div className="bg-brand-mist flex min-h-135 flex-col overflow-hidden rounded-[32px] p-10 max-lg:hidden">
        <div className="relative flex h-62.5 items-center justify-center">
          <div className="absolute size-57.5 rounded-full bg-white shadow-[0_20px_60px_rgba(11,70,86,0.12)]" />
          <div className="relative motion-safe:animate-[float-y_4s_ease-in-out_infinite]">
            {/* Every picture is in the panel from the start and only the
                one in hand is shown, so they are all fetched with the page
                and the one a reader moves to pops in already drawn. */}
            <div className="relative h-55 w-60">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={cn(
                    "absolute inset-0",
                    index === active
                      ? "motion-safe:animate-[pop-in_0.6s_cubic-bezier(0.2,0.8,0.2,1)]"
                      : "invisible"
                  )}
                >
                  {service.image}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keyed, so the words rise afresh for each direction. Not a live
            region: the panel follows the pointer and the focus, and a row
            already says its own name to a screen reader as it is reached. */}
        <div
          key={current.id}
          className="mt-auto flex flex-col gap-4.5 motion-safe:animate-[rise_0.45s_var(--ease-out)]"
        >
          <h3 className="text-brand-ink text-[2rem]/[1.2] font-semibold">
            {current.name}
          </h3>
          {current.description && (
            <p className="text-brand-body max-w-110 text-base/[1.4]">
              {current.description}
            </p>
          )}

          <Tags tags={current.tags} className="bg-white text-[0.8125rem]" />

          <div className="mt-2 flex flex-wrap gap-3">
            {current.href && (
              <AppLink href={current.href} variant="default" className={FILLED}>
                {current.linkLabel ?? labels.details}
                <ArrowRight aria-hidden className="size-5" />
              </AppLink>
            )}
            <AppLink
              href={bookHref}
              data-analytics-location="services"
              className={OUTLINED}
            >
              {labels.book}
            </AppLink>
          </div>
        </div>
      </div>
    </div>
  )
}

/** A row's name and arrow, lit while the row is the one in hand. */
function Row({
  name,
  on,
  className,
  arrowClassName,
}: {
  readonly name?: string | null
  readonly on: boolean
  readonly className?: string
  readonly arrowClassName?: string
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-3.5 py-4.5 transition-colors duration-200 lg:gap-6 lg:py-5.5",
        on ? "text-brand-light" : "text-brand-ink"
      )}
    >
      <span
        className={cn(
          "flex-1 text-xl/[1.2] transition-transform duration-300 lg:text-[2rem]/[1.2]",
          on ? "font-semibold" : "font-normal",
          className
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
          on
            ? "border-brand-light bg-brand-light text-brand-inverted"
            : "text-brand-ink border-[#d5dadc] bg-white",
          arrowClassName
        )}
      >
        <ArrowRight aria-hidden className="size-4" />
      </span>
    </span>
  )
}

/**
 * The desktop row: a link where the direction has a page to go to, and a
 * plain row that still previews where it has none.
 *
 * A pointer previews by resting on the row and a keyboard by reaching it. A
 * finger can do neither, and a tablet held sideways is as wide as a desktop,
 * so there the first tap on a row previews it and the second follows it.
 *
 * Whether a tap is the first is settled as the finger lands, not at the
 * click: a browser sends a tap its own mouseenter and focus before the
 * click, and those would already have made the row the one in hand.
 */
function RowLink({ href, ...row }: RowProps & { readonly href?: string }) {
  return href ? <LinkedRow href={href} {...row} /> : <PreviewRow {...row} />
}

interface RowProps {
  readonly isActive: boolean
  readonly onPreview: () => void
  readonly className?: string
  readonly children: React.ReactNode
}

/**
 * A row with no page behind it: still something to stop on and press, so
 * the keyboard can bring its preview up as the pointer does.
 */
function PreviewRow({ onPreview, className, children }: RowProps) {
  return (
    <button
      type="button"
      onMouseEnter={onPreview}
      onFocus={onPreview}
      onClick={onPreview}
      className={cn("w-full cursor-default text-left", className)}
    >
      {children}
    </button>
  )
}

function LinkedRow({
  href,
  isActive,
  onPreview,
  className,
  children,
}: RowProps & { readonly href: string }) {
  // True from a finger landing on a row that is not yet in hand until the
  // click that tap ends in.
  const previewsOnly = useRef(false)

  return (
    <AppLink
      href={href}
      onPointerDown={(event) => {
        previewsOnly.current = event.pointerType === "touch" && !isActive
      }}
      onMouseEnter={onPreview}
      onFocus={onPreview}
      onClick={(event) => {
        if (!previewsOnly.current) {
          return
        }

        previewsOnly.current = false
        event.preventDefault()
        onPreview()
      }}
      className={cn(
        "block h-auto w-full rounded-none p-0 font-normal whitespace-normal no-underline",
        className
      )}
    >
      {children}
    </AppLink>
  )
}

/** A direction's sub-services, as pills; one with a page of its own links. */
function Tags({
  tags,
  className,
}: {
  readonly tags: readonly ExplorerTag[]
  readonly className?: string
}) {
  if (tags.length === 0) {
    return null
  }

  const pill = cn(
    "text-brand-ink flex h-auto items-center rounded-full px-3.5 py-1.75 leading-[1.4] font-normal",
    className
  )

  return (
    <ul className="flex list-none flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag.id}>
          {tag.href ? (
            <AppLink
              href={tag.href}
              className={cn(
                pill,
                "hover:bg-brand-light hover:text-brand-inverted no-underline transition-colors"
              )}
            >
              {tag.label}
            </AppLink>
          ) : (
            <span className={pill}>{tag.label}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ServiceExplorer

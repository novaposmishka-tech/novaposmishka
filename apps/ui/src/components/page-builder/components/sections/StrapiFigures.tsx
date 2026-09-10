import "server-only"

import type { Data } from "@repo/strapi-types"
import { Fragment } from "react"

import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * The clinic's numbers, as the design sets them: each figure beside its own
 * words rather than above them, the three separated by a rule — upright between
 * the columns on a desktop, and laid flat between the rows on a phone.
 *
 * The figures themselves are painted with the brand gradient, which is what the
 * frame fills them with.
 */
export function StrapiStatistics({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.statistics">
}) {
  const figures = component.figures ?? []

  return (
    <section>
      <Container>
        <ul className="flex list-none flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
          {figures.map((figure, index) => (
            <Fragment key={figure.id}>
              {index > 0 && (
                <li
                  aria-hidden
                  className="bg-brand-hairline lg:bg-brand-on-dark h-px w-full lg:h-12.5 lg:w-px"
                />
              )}
              <StrapiFigure
                component={figure}
                // The frame hugs the outer two columns against the grid and
                // gives all the slack to the ones between, so the first figure
                // starts on the margin and the last label ends on it.
                grows={index > 0 && index < figures.length - 1}
              />
            </Fragment>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function StrapiFigure({
  component,
  grows,
}: {
  readonly component: Data.Component<"shared.figure">
  readonly grows: boolean
}) {
  const { number, prefix, suffix, description } = component

  return (
    <li
      className={cn(
        "flex items-center lg:gap-5",
        grows ? "lg:flex-1 lg:justify-center" : "lg:shrink-0"
      )}
    >
      {/* On a phone the frame lines every label up at the same offset, so the
          figure takes a column of its own rather than a gap after it. */}
      <p className="bg-brand-gradient w-30 shrink-0 bg-clip-text text-[2.5rem]/11 font-semibold text-transparent lg:w-auto lg:text-[4.375rem]/[4.8125rem]">
        {prefix}
        {number}
        {suffix}
      </p>
      {/* The frame sets one word of each label in bold italic — the first, or
          "Google" in the last — which the copy carries as markup. `bolder`
          resolves against whatever it is nested in, so the weight is stated
          outright rather than left to the cascade. */}
      <CkEditorRenderer
        htmlContent={description}
        // The rich-text styles set their own size and colour, so the frame's
        // have to be asserted over them.
        className="[&_p]:text-brand-body! mb-0 [&_p]:mb-0! [&_p]:text-sm/[1.3125rem]! lg:[&_p]:text-xl/7.5! [&_strong]:font-bold"
      />
    </li>
  )
}

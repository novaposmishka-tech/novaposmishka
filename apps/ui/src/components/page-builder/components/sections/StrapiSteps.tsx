import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import {
  ServiceIcon,
  type ServiceIconName,
} from "@/components/icons/ServiceIcon"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * The mark each step carries where an editor chose none, in the order the
 * design draws them: look, protect, treat, done. A fifth step starts over.
 */
const STEP_ICONS: ServiceIconName[] = ["search", "shield", "spark", "check"]

/**
 * How a procedure goes, as numbered cards on a pane of the page's mist.
 *
 * As with the symptoms, the design tops each card with a photograph and laps
 * the number and the mark over its lower edge; a step without a photograph
 * opens on the number and the mark instead.
 */
export function StrapiSteps({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.steps">
}) {
  const { title, steps } = component

  if (!steps?.length) {
    return null
  }

  return (
    <section>
      {/* The pane sits on the grid at desktop with the frame's wide corners
          and keeps the phone's own gutter either side, as the price cards do. */}
      <Container>
        <div className="bg-brand-mist flex flex-col gap-6 rounded-[20px] px-4 py-8 lg:gap-10 lg:rounded-[50px] lg:p-12.5">
          {title && (
            <Typography tag="h2" className="text-brand-ink mb-0!">
              {title}
            </Typography>
          )}

          <ol
            data-stagger
            className="grid list-none grid-cols-1 gap-3 md:grid-cols-2 lg:gap-5 xl:grid-cols-4"
          >
            {steps.map((step, index) => (
              <li
                key={step.id}
                className="lift hover:shadow-brand-card flex flex-col overflow-hidden rounded-[20px] bg-white lg:rounded-[26px]"
              >
                {step.image && (
                  <div className="relative aspect-4/3 bg-[#e9edf1]">
                    <StrapiBasicImage
                      component={step.image}
                      fill
                      sizes="(min-width: 80rem) 25vw, (min-width: 48rem) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "flex flex-1 flex-col gap-3.5 px-6 pb-7",
                    !step.image && "pt-6"
                  )}
                >
                  <div
                    className={cn(
                      "relative flex items-end justify-between",
                      step.image && "-mt-5.5"
                    )}
                  >
                    <span
                      className={cn(
                        "bg-brand-gradient text-brand-inverted flex size-11 items-center justify-center rounded-full text-[0.9375rem] font-semibold",
                        step.image && "ring-6 ring-white"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="bg-brand-mist flex size-11 items-center justify-center rounded-[14px]">
                      <ServiceIcon
                        name={step.icon}
                        fallback={STEP_ICONS[index % STEP_ICONS.length]}
                        className="size-5.5"
                      />
                    </span>
                  </div>

                  {step.title && (
                    <Typography
                      tag="h3"
                      className="text-brand-ink mt-2 mb-0! text-lg/[1.3]! font-semibold lg:text-xl/[1.3]!"
                    >
                      {step.title}
                    </Typography>
                  )}
                  {step.text && (
                    <Typography className="text-brand-body mb-0! text-sm/[1.5]!">
                      {step.text}
                    </Typography>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}

StrapiSteps.displayName = "StrapiSteps"

export default StrapiSteps

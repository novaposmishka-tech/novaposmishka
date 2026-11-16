import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { ServiceIcon } from "@/components/icons/ServiceIcon"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink, {
  strapiLinkResolves,
} from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * When to see the dentist: the signs a patient notices, one card each, and a
 * last card on the brand's teal that books the visit.
 *
 * The design gives every sign a photograph with its icon lapping the lower
 * edge. The photographs are an editor's to add, one card at a time: a card
 * without one is the icon and the words alone, and takes the height of its
 * row rather than holding a blank frame open.
 */
export function StrapiSymptoms({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.symptoms">
}) {
  const { title, items, callToAction } = component

  if (!items?.length) {
    return null
  }

  return (
    <section>
      <Container className="flex flex-col gap-7.5 lg:gap-12.5">
        {title && (
          <Typography tag="h2" className="text-brand-ink mb-0!">
            {title}
          </Typography>
        )}

        <ul
          data-stagger
          className="grid list-none grid-cols-1 gap-3 md:grid-cols-2 lg:gap-5 xl:grid-cols-3"
        >
          {items.map((item) => (
            <li
              key={item.id}
              className="border-brand-hairline lift hover:shadow-brand-card flex flex-col overflow-hidden rounded-[20px] border bg-white lg:rounded-[26px]"
            >
              {item.image && (
                <div className="bg-brand-mist relative aspect-4/3">
                  <StrapiBasicImage
                    component={item.image}
                    fill
                    sizes="(min-width: 80rem) 33vw, (min-width: 48rem) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div
                className={cn(
                  "relative flex flex-1 flex-col gap-3",
                  item.image ? "px-6 pb-6" : "p-6"
                )}
              >
                {/* On a photograph the tile laps its lower edge by half, on a
                    ring of the card's own white; without one it simply
                    stands at the head of the card. */}
                <span
                  className={cn(
                    "flex size-15 shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(145deg,#eaf3f5,#dcebef)]",
                    item.image && "-mt-7.5 ring-5 ring-white"
                  )}
                >
                  <ServiceIcon name={item.icon} className="size-8.5" />
                </span>

                {item.title && (
                  <Typography
                    tag="h3"
                    className="text-brand-ink mb-0! text-[0.9375rem]/[1.4]! font-normal lg:text-[1.0625rem]/[1.4]!"
                  >
                    {item.title}
                  </Typography>
                )}
                {item.text && (
                  <Typography className="text-brand-body mb-0! text-sm/5!">
                    {item.text}
                  </Typography>
                )}
              </div>
            </li>
          ))}

          {/* The card is its link, so one with nowhere to go is not drawn. */}
          {callToAction && strapiLinkResolves(callToAction.link) && (
            <li className="flex">
              <StrapiLink
                component={callToAction.link}
                // The whole card is the link. The button's own height,
                // padding and single line are stated over, since this is a
                // card that happens to go somewhere.
                className="bg-brand-gradient text-brand-inverted hover:shadow-brand-button lift h-auto min-h-50 w-full flex-col items-stretch justify-between gap-6 rounded-[20px] p-7 text-left font-normal whitespace-normal no-underline lg:rounded-[26px]"
              >
                {/* The design breaks the heading in two. The field is a single
                    line, which cannot hold a break, so the lines are balanced
                    instead and the break falls between its two sentences. */}
                <span className="max-w-70 text-lg/[1.3] font-semibold text-balance lg:text-2xl/[1.3]">
                  {callToAction.name}
                </span>
                <span className="flex items-center justify-between gap-4">
                  {callToAction.description && (
                    <span className="text-sm/5 text-white/85">
                      {callToAction.description}
                    </span>
                  )}
                  <span className="text-brand-ink ml-auto flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                    <ArrowRight aria-hidden className="size-5" />
                  </span>
                </span>
              </StrapiLink>
            </li>
          )}
        </ul>
      </Container>
    </section>
  )
}

StrapiSymptoms.displayName = "StrapiSymptoms"

export default StrapiSymptoms

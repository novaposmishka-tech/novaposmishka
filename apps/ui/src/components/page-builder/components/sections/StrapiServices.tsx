import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * A card in the frame is white, unbordered and carries a pair of soft shadows —
 * one below it and a shallower one above. The frame draws the first card in a
 * faintly grey fill with its link in teal while the other six are white with
 * black links, which is the hover state rather than a card that differs.
 */
const CARD =
  "relative flex min-h-42.75 flex-col overflow-hidden rounded-[20px] p-5 shadow-[0_5px_8px_rgba(13,22,155,0.05),0_-3px_8px_rgba(13,22,155,0.05)] lg:min-h-53.5 lg:rounded-[26px] lg:p-7.5"

/**
 * The illustration stands on the card's bottom edge, at the right. The frame
 * places each one by hand and lets some bleed past the edge; a single rule has
 * to hold for whatever art an editor uploads, and one that sits them all on the
 * floor keeps a wide, short illustration from disappearing under it. The box is
 * the frame's 158 wide and the full height of the card, which puts our assets —
 * exported at twice their drawn size — back at the scale the frame shows them.
 */
const ILLUSTRATION =
  "pointer-events-none absolute right-0 bottom-0 h-42.75 w-30.75 object-contain object-bottom lg:h-53.5 lg:w-39.5"

// The design system gives every h3 a 1.4 leading and a bottom margin; the
// frame sets 34px and no margin.
const CARD_TITLE =
  "text-brand-ink mb-0! text-lg/6.25! font-semibold lg:text-2xl/8.5!"
const CARD_TEXT = "text-brand-body mb-0! text-sm/5! lg:text-base/5.5!"

export function StrapiServices({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.services">
}) {
  const { title, subtitle, services, callToAction } = component

  if (!services?.length) {
    return null
  }

  return (
    <section id="services" className="scroll-mt-24">
      <Container className="flex flex-col gap-7.5 lg:gap-12.5">
        {(title || subtitle) && (
          <div className="flex max-w-203 flex-col gap-4">
            {title && (
              <Typography tag="h2" className="text-brand-ink">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className="text-brand-body">{subtitle}</Typography>
            )}
          </div>
        )}

        <ul className="grid list-none grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <li
              key={service.id}
              className={`${CARD} hover:bg-brand-stripe gap-2.5 bg-white transition-colors lg:gap-3.75`}
            >
              <Typography tag="h3" className={CARD_TITLE}>
                {service.name}
              </Typography>

              {service.description && (
                // The frame holds the words clear of the illustration rather
                // than letting them wrap around it.
                <Typography className={`${CARD_TEXT} max-w-57 lg:max-w-65`}>
                  {service.description}
                </Typography>
              )}

              {service.link && (
                <StrapiLink
                  component={service.link}
                  // The frame's link is a word and an arrow, with none of the
                  // outlined button the content type asks for. The arrow sits
                  // in a 34px circle the frame fills with white at a tenth —
                  // invisible on a white card, so only its size is kept, which
                  // is what sets the 21px between the word and the arrowhead.
                  className="text-brand-ink hover:text-brand-teal mt-auto h-11.5 w-fit gap-2.5 border-0 bg-transparent p-0 text-sm/5 font-semibold shadow-none hover:bg-transparent lg:text-base/5.5"
                >
                  {service.link.label}
                  <span className="flex size-7.5 items-center justify-center lg:size-8.5">
                    <ArrowRight aria-hidden className="size-5" />
                  </span>
                </StrapiLink>
              )}

              {service.icon && (
                <StrapiBasicImage
                  component={service.icon}
                  className={ILLUSTRATION}
                />
              )}
            </li>
          ))}

          {/* The frame closes the grid with a card for the reader who does not
              know which of these they need. It is two columns wide, which
              squares the grid off at three rows, and it carries no shadow. */}
          {callToAction && (
            <li className="bg-brand-mist relative flex min-h-42.75 overflow-hidden rounded-[20px] p-5 md:col-span-2 lg:min-h-53.5 lg:rounded-[26px] lg:p-7.5">
              {/* The frame's copy column stops short of the illustration. */}
              <div className="flex max-w-155.5 flex-col gap-5 lg:gap-7.5">
                <div className="flex flex-col gap-2.5 lg:gap-3.75">
                  <Typography tag="h3" className={CARD_TITLE}>
                    {callToAction.name}
                  </Typography>

                  {callToAction.description && (
                    <Typography className={CARD_TEXT}>
                      {callToAction.description}
                    </Typography>
                  )}
                </div>

                {callToAction.link && (
                  <StrapiLink
                    component={callToAction.link}
                    // Outlined in teal with the label in ink — the frame's
                    // second button, where the hero's is filled.
                    className="border-brand-teal text-brand-ink hover:bg-brand-teal hover:text-brand-inverted h-11.5 w-fit gap-2 rounded-[30px] border bg-transparent bg-none px-5 text-sm/5 font-semibold shadow-none lg:h-12.5 lg:px-7.5 lg:text-base/5.5"
                  >
                    {callToAction.link.label}
                    <ArrowRight aria-hidden className="size-5" />
                  </StrapiLink>
                )}
              </div>

              {callToAction.icon && (
                <StrapiBasicImage
                  component={callToAction.icon}
                  className="pointer-events-none absolute top-1/2 right-7.5 hidden h-39.5 w-42.5 -translate-y-1/2 object-contain lg:block"
                />
              )}
            </li>
          )}
        </ul>
      </Container>
    </section>
  )
}

StrapiServices.displayName = "StrapiServices"

export default StrapiServices

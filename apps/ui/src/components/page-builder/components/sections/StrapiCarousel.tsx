import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiCarousel({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.carousel">
}) {
  const { title, images } = component

  if (!images?.length) {
    return null
  }

  return (
    <section id="gallery" className="scroll-mt-24">
      <Container className="flex flex-col gap-10">
        {title && (
          <Typography tag="h2" className="text-brand-ink text-center">
            {title}
          </Typography>
        )}

        {/* Square tiles, four across at desktop as in the design, scrolling on
            narrower screens rather than shrinking to stamps. It stays one
            scroll container at every width so it needs only one tab stop — a
            scrollable region is not keyboard-operable without one. */}
        <ul
          tabIndex={0}
          aria-label={title ?? undefined}
          className="-mx-2 flex snap-x snap-mandatory list-none gap-6 overflow-x-auto px-2 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {images.map((item) => (
            <li
              key={item.id}
              className="w-2/3 shrink-0 snap-start sm:w-2/5 lg:w-[calc(25%-1.125rem)]"
            >
              <StrapiBasicImage
                component={item.image}
                className="aspect-square w-full rounded-[26px] object-cover"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

StrapiCarousel.displayName = "StrapiCarousel"

export default StrapiCarousel

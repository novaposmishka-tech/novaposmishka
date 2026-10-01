import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { ScrollRow } from "@/components/elementary/ScrollRow"
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
    // Clipped sideways so the row's bleed below cannot set the page scrolling:
    // 100vw counts a desktop scrollbar the page does not have room for.
    // `clip`, not `hidden`, which would clip the shadows above and below too.
    <section
      id="gallery"
      className="scroll-mt-15 overflow-x-clip lg:scroll-mt-26.5"
    >
      <Container className="flex flex-col gap-12.5">
        {title && (
          <Typography tag="h2" className="text-brand-ink text-center">
            {title}
          </Typography>
        )}

        {/* Square tiles, four across at desktop as in the design, scrolling
            on narrower screens rather than shrinking to stamps.

            The frame runs the row out past the column to the edge of the
            screen, where the next tile is cut by the screen itself. Stopped
            at the column, that tile was cut off square in the white margin
            beside it, which read as a clipped shadow. The padding matching
            the bleed lets the last tile still scroll back to the column. */}
        <ScrollRow
          label={title}
          className="mr-[calc(50%-50vw)] pr-[calc(50vw-50%)]"
        >
          {images.map((item) => (
            <li
              key={item.id}
              className="w-2/3 shrink-0 snap-start sm:w-2/5 lg:w-94"
            >
              <StrapiBasicImage
                component={item.image}
                className="shadow-brand-card aspect-square w-full rounded-[26px] object-cover"
              />
            </li>
          ))}
        </ScrollRow>
      </Container>
    </section>
  )
}

StrapiCarousel.displayName = "StrapiCarousel"

export default StrapiCarousel

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
    <section id="gallery" className="scroll-mt-15 lg:scroll-mt-26.5">
      <Container className="flex flex-col gap-12.5">
        {title && (
          <Typography tag="h2" className="text-brand-ink text-center">
            {title}
          </Typography>
        )}

        {/* Square tiles, four across at desktop as in the design, scrolling
            on narrower screens rather than shrinking to stamps. */}
        <ScrollRow label={title}>
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

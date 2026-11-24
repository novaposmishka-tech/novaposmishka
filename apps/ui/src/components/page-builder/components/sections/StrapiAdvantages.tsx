import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { ServiceIcon } from "@/components/icons/ServiceIcon"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * Why patients choose the clinic: a row of short cards, each a mark, a
 * promise and a line under it, from the Advantage set the block picks. A card fills with the brand's teal under the
 * pointer; the mark keeps its pale disc, so it reads the same on both.
 */
export function StrapiAdvantages({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.advantages">
}) {
  // The set the block picks; what is typed into the block itself stands in
  // for whatever the set leaves empty.
  const { set } = component
  const title = set?.title || component.title
  const items = (set?.items?.length ? set : component).items

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
          className="grid list-none grid-cols-1 gap-3 md:grid-cols-2 lg:gap-5 xl:grid-cols-4"
        >
          {items.map((item) => (
            <li
              key={item.id}
              className="border-brand-hairline text-brand-ink hover:bg-brand-light hover:text-brand-inverted flex flex-col gap-3.5 rounded-[20px] border p-7 transition-colors duration-300 hover:border-transparent lg:rounded-[26px]"
            >
              <span className="bg-brand-mist flex size-14 items-center justify-center rounded-full">
                <ServiceIcon
                  name={item.icon}
                  fallback="check"
                  className="size-6.5"
                />
              </span>

              {item.title && (
                <Typography
                  tag="h3"
                  className="mt-1.5 mb-0! text-lg/[1.3]! font-semibold text-inherit! lg:text-xl/[1.3]!"
                >
                  {item.title}
                </Typography>
              )}
              {item.text && (
                <Typography className="mb-0! text-sm/[1.5]! text-inherit! opacity-75">
                  {item.text}
                </Typography>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

StrapiAdvantages.displayName = "StrapiAdvantages"

export default StrapiAdvantages

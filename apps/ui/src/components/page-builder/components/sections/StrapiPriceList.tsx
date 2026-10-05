import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * Every amount in a price, so each can be set apart from the words around it.
 * A space inside an amount only counts when a digit follows it ("1 200"), so
 * the one before the currency stays with the words.
 */
const AMOUNTS = /(\d(?:[\d.,]|\s(?=\d))*)/g

export function StrapiPriceList({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.price-list">
}) {
  const { title, groups } = component

  if (!groups?.length) {
    return null
  }

  return (
    <section id="prices" className="scroll-mt-15 lg:scroll-mt-26.5">
      <Container className="flex flex-col gap-7.5 lg:gap-12.5">
        {title && (
          <Typography tag="h2" className="text-brand-ink">
            {title}
          </Typography>
        )}

        <div className="flex flex-col gap-5 lg:gap-7.5">
          {groups.map((group) => (
            <div
              key={group.id}
              // The frame floats each group on the page's own card shadow
              // rather than ruling a border around it.
              className="shadow-brand-card overflow-hidden rounded-[20px] bg-white"
            >
              <Typography
                tag="h3"
                // Half the room below the heading that the frame gives it:
                // the design review asked for the group's name to sit closer
                // to the first price than it was drawn.
                className="text-brand-ink border-brand-hairline mb-0 border-b px-5 pt-5 pb-2.5 text-lg/6.25! font-semibold lg:px-7.5 lg:pt-7.5 lg:pb-3.75 lg:text-2xl/8.5!"
              >
                {group.title}
              </Typography>

              {/* A description list, not a table: each row is one price for one
                  named service, which is what dt/dd describe. It also wraps on
                  a phone without the horizontal scroll a table would need. */}
              <dl className="flex flex-col">
                {group.rows?.map((row, index) => (
                  <div
                    key={row.id}
                    className={[
                      "border-brand-hairline flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 lg:px-7.5",
                      "not-last:border-b",
                      // The design stripes alternate rows, starting with the
                      // first one under the heading.
                      index % 2 === 0 ? "bg-brand-stripe" : "bg-white",
                    ].join(" ")}
                  >
                    <dt className="text-brand-ink flex-1 text-sm/5 lg:text-lg/6.25">
                      {row.label}
                    </dt>
                    <dd className="text-brand-body text-base/5.5 font-semibold whitespace-nowrap lg:text-lg/6.75 lg:font-normal">
                      <Price value={row.price} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/**
 * A price with its amounts set in the brand's teal and the words around them
 * — "Ціна", "від", the currency — left as they are. A range sets both of its
 * amounts apart, not only the first; a price with no digits in it is printed
 * as written.
 */
function Price({ value }: { readonly value: string | null | undefined }) {
  const price = value ?? ""
  // Split on the capturing group, so the amounts land at the odd indexes.
  const parts = price.split(AMOUNTS)

  if (parts.length === 1) {
    return price
  }

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          // Positional keys: the parts of one price never reorder.
          // eslint-disable-next-line react/no-array-index-key
          <span key={index} className="text-brand-teal font-semibold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

StrapiPriceList.displayName = "StrapiPriceList"

export default StrapiPriceList

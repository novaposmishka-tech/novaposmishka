import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

/** The leading amount in a price, so it can be set apart from its unit. */
const AMOUNT = /(\d[\d\s.,]*)/

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
    <section id="prices" className="scroll-mt-24">
      <Container className="flex flex-col gap-12.5">
        {title && (
          <Typography tag="h2" className="text-brand-ink">
            {title}
          </Typography>
        )}

        <div className="flex flex-col gap-12.5">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border-brand-hairline overflow-hidden rounded-[20px] border bg-white"
            >
              <Typography
                tag="h3"
                className="text-brand-ink border-brand-hairline mb-0 border-b px-7.5 py-6 text-2xl"
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
                      "border-brand-hairline flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-7.5 py-4.5",
                      "not-last:border-b",
                      // The design stripes alternate rows, starting with the
                      // first one under the heading.
                      index % 2 === 0 ? "bg-brand-stripe" : "bg-white",
                    ].join(" ")}
                  >
                    <dt className="text-brand-ink flex-1 text-lg">
                      {row.label}
                    </dt>
                    <dd className="text-brand-body text-lg whitespace-nowrap">
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
 * "500 ГРН" with the amount picked out, as the design sets it: the number in
 * brand teal and semibold, the currency left in the body colour. A price with
 * no digits in it is printed as written.
 */
function Price({ value }: { readonly value: string | null | undefined }) {
  const price = value ?? ""
  const match = AMOUNT.exec(price)

  if (!match) {
    return price
  }

  // The match runs greedy so a thousands separator stays with the amount
  // ("1 200"), which also swallows the space before the currency. Give it back.
  const amount = match[0].trimEnd()
  const start = match.index
  const end = start + amount.length

  return (
    <>
      {price.slice(0, start)}
      <span className="text-brand-teal font-semibold">{amount}</span>
      {price.slice(end)}
    </>
  )
}

StrapiPriceList.displayName = "StrapiPriceList"

export default StrapiPriceList

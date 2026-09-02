import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

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
      <Container className="flex flex-col gap-10">
        {title && (
          <Typography tag="h2" className="text-brand-ink">
            {title}
          </Typography>
        )}

        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-4">
              <Typography tag="h3" className="text-brand-ink text-2xl">
                {group.title}
              </Typography>

              {/* A description list, not a table: each row is one price for one
                  named service, which is what dt/dd describe. It also wraps on
                  a phone without the horizontal scroll a table would need. */}
              <dl className="flex flex-col">
                {group.rows?.map((row) => (
                  <div
                    key={row.id}
                    className="border-brand-border flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-4 last:border-b-0"
                  >
                    <dt className="text-brand-ink flex-1 text-base">
                      {row.label}
                    </dt>
                    <dd className="text-brand-ink text-base font-semibold whitespace-nowrap">
                      {row.price}
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

StrapiPriceList.displayName = "StrapiPriceList"

export default StrapiPriceList

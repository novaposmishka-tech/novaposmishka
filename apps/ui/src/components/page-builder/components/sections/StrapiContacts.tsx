import "server-only"

import type { Data } from "@repo/strapi-types"

import { ContactIcon } from "@/components/elementary/ContactIcon"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { contactHref } from "@/lib/contacts"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type Item = NonNullable<Data.Component<"sections.contacts">["items"]>[number]

export function StrapiContacts({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.contacts">
}) {
  const { title, items, image, display } = component

  if (!items?.length) {
    return null
  }

  // The homepage puts the whole block on one dark card; the contact page
  // gives each detail its own light card beside a photograph.
  const isCard = display !== "list"

  return (
    <section id="contacts" className="scroll-mt-24">
      <Container
        className={cn(
          "flex flex-col gap-7.5 lg:gap-12.5",
          isCard &&
            "bg-brand-deep text-brand-inverted rounded-[50px] p-8 md:p-12 lg:p-12.5"
        )}
      >
        {title && (
          // The frame sets the page title across the grid, with both columns
          // under it — not beside the photograph. On the contacts page this
          // is the page's own title, and the only heading it has: rendered as
          // an h2 the page would have no first-level heading at all.
          <Typography
            tag={isCard ? "h2" : "h1"}
            className={cn(
              "mb-0!",
              isCard
                ? "text-brand-inverted"
                : // The frame sets this line at the second level's size even
                  // though it is the page's first heading, so the scale is
                  // stated over the one the tag carries.
                  "text-brand-ink text-[1.625rem]/7.75! font-normal! lg:text-[2.5rem]/12!"
            )}
          >
            {title}
          </Typography>
        )}

        <div className="flex flex-col gap-7.5 lg:flex-row lg:gap-12.5">
          <dl
            className={cn(
              "flex flex-col lg:w-134.5 lg:shrink-0",
              isCard ? "gap-6" : "gap-5"
            )}
          >
            {items.map((item) => (
              <ContactCard key={item.id} item={item} isCard={isCard} />
            ))}
          </dl>

          {image && (
            // The phone frame opens on the photograph and puts the details
            // under it; the desktop sets it beside them.
            <div className="w-full max-lg:order-first lg:flex-1">
              <StrapiBasicImage
                component={image}
                className="aspect-33/20 w-full rounded-[20px] object-cover lg:aspect-732/460 lg:rounded-[26px]"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

/**
 * One detail of the clinic's: what it is, then what it says. The design gives
 * each its own white card beside the photograph, and rules a hairline between
 * values that sit on one line.
 */
function ContactCard({
  item,
  isCard,
}: {
  readonly item: Item
  readonly isCard: boolean
}) {
  const values = item.values ?? []
  // Three of them will not sit on one line of a phone, and the frame stacks
  // them there rather than letting them wrap through the rules.
  const stacks = !isCard && values.length > 2

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5",
        // The frame gives each detail a white card on the page's own card
        // shadow, not a bordered one.
        !isCard && "shadow-brand-card rounded-[20px] bg-white p-5"
      )}
    >
      <dt
        className={cn(
          "flex items-center gap-2.5",
          isCard
            ? "text-brand-muted text-sm"
            : "text-brand-ink text-lg/6.25 font-semibold lg:text-xl/7"
        )}
      >
        {!isCard && (
          <ContactIcon icon={item.icon} className="text-brand-teal" />
        )}
        {item.label}
      </dt>

      {/* The frame runs several values along one line rather than stacking
          them, which is what keeps every card the same height beside the
          photograph. */}
      <div
        className={cn(
          isCard ? "contents" : "flex flex-wrap items-center gap-x-5 gap-y-2.5",
          stacks && "max-lg:flex-col max-lg:items-start max-lg:gap-x-0"
        )}
      >
        {values.map((value) => {
          const text = value.text ?? ""
          const href = contactHref(item.kind, text)

          return (
            <dd
              key={value.id}
              className={cn(
                isCard
                  ? "text-lg"
                  : cn(
                      "text-brand-ink text-sm/5 lg:text-base/5.5",
                      // A hairline between the values, as the frame rules them.
                      "not-first:border-brand-hairline not-first:border-l not-first:pl-5",
                      stacks &&
                        "max-lg:not-first:border-l-0 max-lg:not-first:pl-0"
                    )
              )}
            >
              {href ? (
                <a className="hover:text-brand-teal" href={href}>
                  {text}
                </a>
              ) : (
                text
              )}
            </dd>
          )
        })}
      </div>
    </div>
  )
}

StrapiContacts.displayName = "StrapiContacts"

export default StrapiContacts

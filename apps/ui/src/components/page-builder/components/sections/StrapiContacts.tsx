import "server-only"

import type { Data } from "@repo/strapi-types"

import { ContactIcon } from "@/components/elementary/ContactIcon"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { contactHref } from "@/lib/contacts"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

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
          "flex flex-col gap-10 lg:flex-row lg:gap-12.5",
          isCard &&
            "bg-brand-deep text-brand-inverted rounded-[50px] p-8 md:p-12 lg:p-12.5"
        )}
      >
        <div className="flex flex-col gap-7.5 lg:w-134.5 lg:shrink-0">
          {title && (
            <Typography
              tag="h2"
              className={isCard ? "text-brand-inverted" : "text-brand-ink"}
            >
              {title}
            </Typography>
          )}

          <dl className={cn("flex flex-col", isCard ? "gap-6" : "gap-5")}>
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col gap-2.5",
                  // The frame gives each detail a white card on the page's own
                  // card shadow, not a bordered one.
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
                {/* The frame runs several values along one line rather than
                    stacking them, which is what keeps every card the same
                    height beside the photograph. */}
                <div
                  className={cn(
                    isCard ? "contents" : "flex flex-wrap gap-x-5 gap-y-1"
                  )}
                >
                  {item.values?.map((value) => {
                    const text = value.text ?? ""
                    const href = contactHref(item.kind, text)

                    return (
                      <dd
                        key={value.id}
                        className={cn(
                          isCard
                            ? "text-lg"
                            : "text-brand-ink text-sm/5 lg:text-base/5.5"
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
            ))}
          </dl>
        </div>

        {image && (
          <div className="w-full lg:flex-1">
            <StrapiBasicImage
              component={image}
              className="aspect-732/460 w-full rounded-[26px] object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiContacts.displayName = "StrapiContacts"

export default StrapiContacts

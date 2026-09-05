import "server-only"

import type { Data } from "@repo/strapi-types"

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
          "flex flex-col gap-10 lg:flex-row lg:gap-16",
          isCard &&
            "bg-brand-deep text-brand-inverted rounded-[50px] p-8 md:p-12 lg:p-12.5"
        )}
      >
        <div className="flex flex-1 flex-col gap-8">
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
                  "flex flex-col gap-1",
                  !isCard &&
                    "border-brand-border bg-brand-paper rounded-[20px] border p-6"
                )}
              >
                <dt
                  className={cn(
                    "text-sm",
                    isCard ? "text-brand-muted" : "text-brand-body"
                  )}
                >
                  {item.label}
                </dt>
                {item.values?.map((value) => {
                  const text = value.text ?? ""
                  const href = contactHref(item.kind, text)

                  return (
                    <dd key={value.id} className="text-lg">
                      {href ? (
                        <a className="hover:underline" href={href}>
                          {text}
                        </a>
                      ) : (
                        text
                      )}
                    </dd>
                  )
                })}
              </div>
            ))}
          </dl>
        </div>

        {image && (
          <div className="w-full lg:max-w-2xl lg:flex-1">
            <StrapiBasicImage
              component={image}
              className="aspect-4/3 w-full rounded-3xl object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiContacts.displayName = "StrapiContacts"

export default StrapiContacts

import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { contactHref } from "@/lib/contacts"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiContacts({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.contacts">
}) {
  const { title, items, image } = component

  if (!items?.length) {
    return null
  }

  return (
    <section id="contacts" className="scroll-mt-24">
      <Container className="bg-brand-deep text-brand-inverted flex flex-col gap-10 rounded-[50px] p-8 md:p-12 lg:flex-row lg:gap-16 lg:p-12.5">
        <div className="flex flex-1 flex-col gap-8">
          {title && (
            <Typography tag="h2" className="text-brand-inverted">
              {title}
            </Typography>
          )}

          <dl className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <dt className="text-brand-muted text-sm">{item.label}</dt>
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

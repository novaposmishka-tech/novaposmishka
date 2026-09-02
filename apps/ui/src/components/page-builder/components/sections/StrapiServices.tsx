import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiServices({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.services">
}) {
  const { title, subtitle, services } = component

  if (!services?.length) {
    return null
  }

  return (
    <section id="services" className="scroll-mt-24">
      <Container className="flex flex-col gap-10">
        {(title || subtitle) && (
          <div className="flex max-w-3xl flex-col gap-4">
            {title && (
              <Typography tag="h2" className="text-brand-ink">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className="text-brand-body">{subtitle}</Typography>
            )}
          </div>
        )}

        <ul className="grid list-none grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.id}
              className="border-brand-border bg-brand-paper flex min-h-53.5 gap-2 overflow-hidden rounded-[26px] border pt-7.5 pb-7.5 pl-7.5"
            >
              <div className="flex flex-1 flex-col gap-3">
                <Typography tag="h3" className="text-brand-ink text-2xl">
                  {service.name}
                </Typography>

                {service.description && (
                  <Typography className="text-brand-body text-sm">
                    {service.description}
                  </Typography>
                )}

                {service.link && (
                  <StrapiLink
                    component={service.link}
                    className="mt-auto w-fit"
                  />
                )}
              </div>

              {/* The illustration keeps its own column so a long description
                  cannot run underneath it, and hangs off the card's bottom edge
                  the way the design draws it. */}
              {service.icon && (
                <StrapiBasicImage
                  component={service.icon}
                  className="-mb-7.5 h-45 w-2/5 shrink-0 self-end object-contain object-bottom"
                />
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

StrapiServices.displayName = "StrapiServices"

export default StrapiServices

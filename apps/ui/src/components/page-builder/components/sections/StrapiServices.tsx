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
          <div className="flex max-w-2xl flex-col gap-4">
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

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.id}
              className="border-brand-border bg-brand-surface/40 flex flex-col gap-4 rounded-3xl border p-8"
            >
              {service.icon && (
                <StrapiBasicImage
                  component={service.icon}
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              )}
              <Typography tag="h3" className="text-brand-ink text-lg">
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
                  className="mt-auto w-fit px-0"
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

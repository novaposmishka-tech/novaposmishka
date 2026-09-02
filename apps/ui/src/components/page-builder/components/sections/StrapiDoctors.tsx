import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiDoctors({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.doctors">
}) {
  const { title, subtitle, doctors } = component

  if (!doctors?.length) {
    return null
  }

  return (
    <section id="doctors" className="scroll-mt-24">
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

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <li key={doctor.id} className="flex flex-col gap-4">
              {doctor.photo && (
                <StrapiBasicImage
                  component={doctor.photo}
                  className="aspect-3/4 w-full rounded-3xl object-cover"
                />
              )}
              <div className="flex flex-col gap-1">
                <Typography tag="h3" className="text-brand-ink text-lg">
                  {doctor.name}
                </Typography>
                {doctor.specialty && (
                  <Typography className="text-brand-body text-sm">
                    {doctor.specialty}
                  </Typography>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

StrapiDoctors.displayName = "StrapiDoctors"

export default StrapiDoctors

import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
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

  const detailed = doctors.some((doctor) => doctor.credentials?.length)

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

        {/* Two layouts, chosen by the content: the team page lists each
            dentist's training, which needs a wide card two to a row; the
            homepage shows the same people as portraits four across. */}
        <ul
          className={cn(
            "grid list-none grid-cols-1 gap-8",
            detailed ? "lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {doctors.map((doctor) => (
            <li
              key={doctor.id}
              className={cn(
                "flex flex-col gap-4",
                detailed &&
                  "border-brand-border bg-brand-paper gap-7.5 rounded-[20px] border p-7.5"
              )}
            >
              <div
                className={cn(
                  detailed && "flex flex-col gap-6 sm:flex-row sm:items-center"
                )}
              >
                {doctor.photo && (
                  <StrapiBasicImage
                    component={doctor.photo}
                    className={cn(
                      "w-full rounded-3xl object-cover",
                      detailed ? "sm:w-64" : "aspect-3/4"
                    )}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <Typography
                    tag="h3"
                    className={cn(
                      "text-brand-ink",
                      detailed ? "text-2xl" : "text-lg"
                    )}
                  >
                    {doctor.name}
                  </Typography>
                  {doctor.specialty && (
                    <span
                      className={cn(
                        "text-brand-body",
                        detailed
                          ? "bg-brand-surface w-fit rounded-full px-4 py-1 text-sm"
                          : "text-sm"
                      )}
                    >
                      {doctor.specialty}
                    </span>
                  )}
                </div>
              </div>

              {doctor.credentials && doctor.credentials.length > 0 && (
                <dl className="flex flex-col">
                  {doctor.credentials.map((credential) => (
                    <div
                      key={credential.id}
                      className="border-brand-border flex flex-col gap-1 border-t py-4 last:pb-0"
                    >
                      <dt className="text-brand-ink font-medium">
                        {credential.label}
                      </dt>
                      <dd className="text-brand-body text-sm">
                        {credential.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

StrapiDoctors.displayName = "StrapiDoctors"

export default StrapiDoctors

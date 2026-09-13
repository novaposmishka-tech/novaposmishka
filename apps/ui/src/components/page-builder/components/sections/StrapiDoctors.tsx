import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { ScrollRow } from "@/components/elementary/ScrollRow"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiDoctors({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.doctors">
}) {
  const { title, subtitle, doctors, link } = component

  if (!doctors?.length) {
    return null
  }

  const detailed = doctors.some((doctor) => doctor.credentials?.length)

  return (
    <section id="doctors" className="scroll-mt-24">
      {/* The frame sets the link beside the heading on a desktop and under the
          carousel on a phone, so the grid moves it rather than a second copy of
          it in the markup. */}
      <Container className="flex flex-col gap-7.5 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-x-5 lg:gap-y-12.5">
        {(title || subtitle) && (
          <div className="flex max-w-2xl flex-col gap-4 lg:col-start-1 lg:row-start-1">
            {title && (
              <Typography tag="h2" className="text-brand-ink mb-0!">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className="text-brand-body">{subtitle}</Typography>
            )}
          </div>
        )}

        {/* Two layouts, chosen by the content: the team page lists each
            dentist's training, which needs a wide card two to a row and stacks
            them, because credentials are unreadable in a narrow column; the
            homepage shows the same people as portraits, three across in the
            scrolling row the design gives arrows to. */}
        <div className="lg:col-span-2 lg:row-start-2">
          <Portraits detailed={detailed} label={title}>
            {doctors.map((doctor) => (
              <li
                key={doctor.id}
                className={cn(
                  "flex flex-col",
                  !detailed &&
                    "w-full shrink-0 snap-start gap-4 sm:w-[calc(50%-0.78125rem)] lg:w-[calc(33.333%-1.04166rem)] lg:gap-5",
                  detailed &&
                    "border-brand-border bg-brand-paper gap-7.5 rounded-[20px] border p-7.5"
                )}
              >
                <div
                  className={cn(
                    detailed
                      ? "flex flex-col gap-6 sm:flex-row sm:items-center"
                      : "flex flex-col gap-4 lg:gap-5"
                  )}
                >
                  {doctor.photo &&
                    (detailed ? (
                      <StrapiBasicImage
                        component={doctor.photo}
                        className="w-full rounded-3xl object-cover sm:w-64"
                      />
                    ) : (
                      // The frame stands each portrait in a panel of its own,
                      // on the floor of it, with the head clear of the top edge.
                      <div className="shadow-brand-card bg-brand-inverted lg:bg-brand-mist flex h-66.75 items-end justify-center rounded-[20px] px-7 pt-9.75 lg:h-92.25 lg:rounded-[30px]">
                        <StrapiBasicImage
                          component={doctor.photo}
                          className="h-full w-auto object-contain object-bottom"
                        />
                      </div>
                    ))}
                  <div
                    className={cn(
                      "flex flex-col",
                      detailed ? "gap-2" : "gap-2.5 text-center"
                    )}
                  >
                    <Typography
                      tag="h3"
                      className={cn(
                        "text-brand-ink",
                        detailed
                          ? "text-2xl"
                          : "mb-0! text-lg/6.25! font-semibold lg:text-xl/7!"
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
                            : "text-sm/5 lg:text-base/5.5"
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
          </Portraits>
        </div>

        {link && (
          <StrapiLink
            component={link}
            // Outlined in teal, the full width of the phone frame and hugging
            // its words on a desktop — the frame's second button again.
            className="border-brand-teal text-brand-ink hover:bg-brand-teal hover:text-brand-inverted h-10 w-full justify-center gap-2 rounded-[30px] border bg-transparent bg-none px-5 text-sm/5 font-semibold shadow-none lg:col-start-2 lg:row-start-1 lg:h-12.5 lg:w-fit lg:px-7.5 lg:text-base/5.5"
          >
            {link.label}
            <ArrowRight aria-hidden className="size-5" />
          </StrapiLink>
        )}
      </Container>
    </section>
  )
}

/**
 * The list the portraits sit in: a plain stack for the team page, the design's
 * scrolling row with arrows for the homepage.
 */
function Portraits({
  detailed,
  label,
  children,
}: {
  readonly detailed: boolean
  readonly label?: string | null
  readonly children: React.ReactNode
}) {
  if (detailed) {
    return (
      <ul className="grid list-none grid-cols-1 gap-8 lg:grid-cols-2">
        {children}
      </ul>
    )
  }

  return (
    <ScrollRow label={label} className="gap-6.25">
      {children}
    </ScrollRow>
  )
}

StrapiDoctors.displayName = "StrapiDoctors"

export default StrapiDoctors

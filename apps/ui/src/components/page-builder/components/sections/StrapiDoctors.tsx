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

type Doctors = NonNullable<Data.Component<"sections.doctors">["doctors"]>

/**
 * The portrait panel both layouts stand a dentist in: a pale box with the
 * person on the floor of it and their head clear of the top edge.
 */
function Portrait({
  photo,
  className,
}: {
  readonly photo: NonNullable<Doctors[number]["photo"]>
  readonly className?: string
}) {
  return (
    <div
      className={cn("flex items-end justify-center overflow-hidden", className)}
    >
      <StrapiBasicImage
        component={photo}
        className="h-full w-auto object-contain object-bottom"
      />
    </div>
  )
}

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

  // The team page is a different page, not a wider version of the row: every
  // dentist's training is listed, and the frame sets the lot on a pane of
  // frosted glass that laps over the photograph above it.
  if (detailed) {
    return <DoctorsPage title={title} doctors={doctors} />
  }

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

        <div className="lg:col-span-2 lg:row-start-2">
          <ScrollRow label={title} className="gap-6.25">
            {doctors.map((doctor) => (
              <li
                key={doctor.id}
                className="flex w-full shrink-0 snap-start flex-col gap-4 sm:w-[calc(50%-0.78125rem)] lg:w-[calc(33.333%-1.04166rem)] lg:gap-5"
              >
                {doctor.photo && (
                  <Portrait
                    photo={doctor.photo}
                    className="shadow-brand-card bg-brand-inverted lg:bg-brand-mist h-66.75 rounded-[20px] px-7 pt-9.75 lg:h-92.25 lg:rounded-[30px]"
                  />
                )}

                <div className="flex flex-col gap-2.5 text-center">
                  <Typography
                    tag="h3"
                    className="text-brand-ink mb-0! text-lg/6.25! font-semibold lg:text-xl/7!"
                  >
                    {doctor.name}
                  </Typography>
                  {doctor.specialty && (
                    <span className="text-brand-body text-sm/5 lg:text-base/5.5">
                      {doctor.specialty}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ScrollRow>
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
 * The team page.
 *
 * The frame pulls the whole list up over the photograph above it — 60px on a
 * phone, 200 on a desktop — onto a pane of the page's own mist at a fifth,
 * blurred. The page title sits at the top of that pane, over the picture, which
 * is why it is white and why it belongs here rather than to the hero.
 */
function DoctorsPage({
  title,
  doctors,
}: {
  readonly title?: string | null
  readonly doctors: Doctors
}) {
  return (
    <section id="doctors" className="scroll-mt-24">
      {/* The frame laps the pane 60 over the photograph on a phone and 200 on
          a desktop. The page-builder already sets the sections 48 and 90 apart,
          so the pull has to swallow that gap as well as the overlap. */}
      <Container className="group-has-data-photo-hero:-mt-27 lg:group-has-data-photo-hero:-mt-72.5">
        <div className="bg-brand-mist/20 flex flex-col gap-7.5 rounded-[20px] p-2.5 backdrop-blur-md lg:gap-12.5 lg:rounded-[50px] lg:px-12.5 lg:py-7.5">
          {title && (
            <Typography
              tag="h1"
              className="text-brand-inverted mb-0! text-center text-[1.625rem]/7.75! font-normal lg:text-[4.5rem]/19.75! lg:font-semibold"
            >
              {title}
            </Typography>
          )}

          <ul className="grid list-none grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7.5">
            {doctors.map((doctor) => (
              <li
                key={doctor.id}
                className="shadow-brand-card flex flex-col gap-5 rounded-[20px] bg-white p-5 lg:gap-7.5 lg:p-7.5"
              >
                <div className="flex items-center gap-3.75 lg:gap-7.5">
                  {doctor.photo && (
                    <Portrait
                      photo={doctor.photo}
                      className="bg-brand-mist h-23.75 w-25 shrink-0 rounded-[26px] px-2.5 pt-2.5 lg:h-60.75 lg:w-64 lg:pt-5"
                    />
                  )}

                  <div className="flex flex-col gap-2.5 lg:gap-5">
                    <Typography
                      tag="h2"
                      className="text-brand-ink mb-0! text-base/5.5! font-semibold lg:text-2xl/8.5!"
                    >
                      {doctor.name}
                    </Typography>
                    {doctor.specialty && (
                      // Outlined in teal, as the frame draws it — not filled.
                      <span className="border-brand-teal text-brand-ink flex h-6.75 w-fit items-center rounded-full border px-4 text-xs/[1.0625rem] lg:h-8.5 lg:px-5 lg:text-base/5.5">
                        {doctor.specialty}
                      </span>
                    )}
                  </div>
                </div>

                {doctor.credentials && doctor.credentials.length > 0 && (
                  // A hairline above the list and between each pair of entries,
                  // as the frame rules them.
                  <dl className="border-brand-hairline flex flex-col gap-5 border-t pt-5 lg:gap-3.75 lg:pt-5">
                    {doctor.credentials.map((credential, index) => (
                      <div
                        key={credential.id}
                        className={cn(
                          "flex flex-col gap-2.5 lg:gap-2.5",
                          index > 0 &&
                            "border-brand-hairline border-t pt-5 lg:pt-3.75"
                        )}
                      >
                        <dt className="text-brand-ink text-sm/5 font-semibold lg:text-lg/6.25">
                          {credential.label}
                        </dt>
                        <dd className="text-brand-body text-sm/5 lg:text-base/5.5">
                          {credential.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

StrapiDoctors.displayName = "StrapiDoctors"

export default StrapiDoctors

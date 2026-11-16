import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import {
  type ExplorerService,
  ServiceExplorer,
} from "@/components/elementary/ServiceExplorer"
import { operatorIcon } from "@/components/icons/operators"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink, {
  resolvedStrapiHref,
  strapiLinkResolves,
} from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { LEAD_FORM_ANCHOR } from "@/lib/analytics"
import { clinicPhones, contactHref } from "@/lib/contacts"
import { fetchNavbar } from "@/lib/strapi-api/content/server"
import type { PageBuilderComponentProps } from "@/types/general"

const HELP_TITLE =
  "text-brand-ink mb-0! text-lg/[1.4]! font-semibold lg:text-2xl/[1.4]!"
const HELP_TEXT = "text-brand-body mb-0! text-sm/[1.4]! lg:text-base/[1.4]!"

/**
 * The services index: the directions as a list with a preview beside it, and
 * under it two cards for the reader the list does not help — one who does not
 * know where to start, and one whose tooth hurts now.
 *
 * The list itself needs the pointer, so it is a client component; everything
 * it shows is resolved here and handed to it, the illustrations included.
 */
export async function StrapiServiceExplorer({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.service-explorer">
}) {
  const { title, services, callToAction, urgentTitle, urgentDescription } =
    component

  if (!services?.length) {
    return null
  }

  const [t, navbar] = await Promise.all([
    getTranslations("services"),
    // The same request the header makes, answered from Next's cache.
    urgentTitle && pageParams ? fetchNavbar(pageParams.locale) : undefined,
  ])
  const phones = clinicPhones(navbar?.data).filter((phone): phone is string =>
    Boolean(phone)
  )

  const items: ExplorerService[] = services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    // A direction whose page is not there previews and goes nowhere.
    href: resolvedStrapiHref(service.link),
    linkLabel: service.link?.label,
    tags: (service.tags ?? []).map((tag) => ({
      id: tag.id,
      label: tag.label,
      // A tag whose page is not there yet stays a plain pill, not a dead link.
      href: resolvedStrapiHref(tag),
    })),
    image: service.icon && (
      <StrapiBasicImage
        component={service.icon}
        fill
        sizes="240px"
        className="object-contain"
      />
    ),
  }))

  return (
    // No id: nothing links here, and a section may stand on a page twice.
    <section>
      <Container className="flex flex-col gap-6 lg:gap-10">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          {title && (
            <Typography tag="h2" className="text-brand-ink mb-0!">
              {title}
            </Typography>
          )}
          <span className="text-brand-body text-sm">
            {/* Hovering is only promised to a reader who can: a tablet at a
                desktop's width has the panel but no pointer over it. */}
            <span className="lg:hidden">{t("tapToOpen")}</span>
            <span className="max-lg:hidden [@media(hover:none)]:hidden">
              {t("hoverToPreview")}
            </span>
            <span className="hidden lg:[@media(hover:none)]:inline">
              {t("tapToPreview")}
            </span>
          </span>
        </div>

        <ServiceExplorer
          services={items}
          bookHref={LEAD_FORM_ANCHOR}
          labels={{ book: t("book"), details: t("details") }}
        />

        {(callToAction || urgentTitle) && (
          <div className="mt-4 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[1.4fr_1fr]">
            {callToAction && (
              <div className="bg-brand-mist relative flex min-h-60 flex-col justify-center gap-4 overflow-hidden rounded-[20px] p-6 lg:rounded-[32px] lg:p-10">
                {callToAction.icon && (
                  <StrapiBasicImage
                    component={callToAction.icon}
                    className="pointer-events-none absolute right-5 bottom-2.5 h-auto w-22.5 object-contain md:w-32.5 lg:w-42.5"
                  />
                )}
                {/* Held to the left of the card, clear of the drawing. */}
                <Typography
                  tag="h3"
                  className={`${HELP_TITLE} relative max-w-[72%] lg:max-w-[58%]`}
                >
                  {callToAction.name}
                </Typography>
                {callToAction.description && (
                  <Typography
                    className={`${HELP_TEXT} relative max-w-[72%] lg:max-w-[58%]`}
                  >
                    {callToAction.description}
                  </Typography>
                )}
                {strapiLinkResolves(callToAction.link) && (
                  <StrapiLink
                    component={callToAction.link}
                    className="border-brand-teal text-brand-ink hover:bg-brand-light hover:text-brand-inverted relative h-12.5 w-fit rounded-[30px] border bg-transparent bg-none px-7 text-[0.9375rem] font-semibold shadow-none hover:border-transparent"
                  />
                )}
              </div>
            )}

            {urgentTitle && (
              <div className="border-brand-hairline flex min-h-60 flex-col justify-center gap-4 rounded-[20px] border p-6 lg:rounded-[32px] lg:p-10">
                <Typography tag="h3" className={HELP_TITLE}>
                  {urgentTitle}
                </Typography>
                {urgentDescription && (
                  <Typography className={HELP_TEXT}>
                    {urgentDescription}
                  </Typography>
                )}
                {phones.length > 0 && (
                  <ul className="flex list-none flex-wrap gap-3">
                    {phones.map((phone) => {
                      const Operator = operatorIcon(phone)

                      return (
                        <li key={phone}>
                          <a
                            href={contactHref("phone", phone)}
                            data-analytics-location="services"
                            className="bg-brand-mist text-brand-ink flex items-center gap-2 rounded-full px-4.5 py-2.5 text-base transition-colors hover:bg-[#e6ebf0]"
                          >
                            {Operator && <Operator className="size-5.5" />}
                            {phone}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiServiceExplorer.displayName = "StrapiServiceExplorer"

export default StrapiServiceExplorer

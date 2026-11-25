import "server-only"

import type { Data } from "@repo/strapi-types"
import { MessageSquare, PhoneIcon } from "lucide-react"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { DiscAccordionTrigger } from "@/components/elementary/DiscAccordionTrigger"
import { LeadFormLink } from "@/components/elementary/LeadFormLink"
import { JsonLd } from "@/components/page-builder/components/seo-utilities/JsonLd"
import Typography from "@/components/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LEAD_FORM_ANCHOR } from "@/lib/analytics"
import { clinicHours, clinicPhones, contactHref } from "@/lib/contacts"
import { faqSchema } from "@/lib/metadata/faq"
import { fetchFooter, fetchNavbar } from "@/lib/strapi-api/content/server"
import type { PageBuilderComponentProps } from "@/types/general"

type Accordions = NonNullable<Data.Component<"sections.faq">["accordions"]>

export function StrapiFaq({
  component,
  pageParams,
}: PageBuilderComponentProps & { component: Data.Component<"sections.faq"> }) {
  const { title, subTitle, accordions, layout } = component

  // A sub-service's questions are a different block from a direction's list
  // of what it covers: every entry is a card of its own, and the heading
  // column offers two ways to ask something the list does not answer.
  if (layout === "cards") {
    const schema = faqSchema(accordions ?? [])

    return (
      <>
        {schema && <JsonLd schema={schema} />}
        <FaqCards
          title={title}
          subTitle={subTitle}
          accordions={accordions ?? []}
          locale={pageParams?.locale}
        />
      </>
    )
  }

  return (
    <section>
      {/* Two columns, as the design lays a service page out: what the heading
          promises on the left, the list that answers it on the right. They
          stack on a phone, heading first. */}
      <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12.5">
        <div className="flex flex-col gap-4">
          <Typography tag="h2" className="text-brand-ink">
            {title}
          </Typography>
          {subTitle && (
            <Typography className="text-brand-body">{subTitle}</Typography>
          )}
        </div>

        {accordions && accordions.length > 0 && (
          <div className="bg-brand-mist rounded-[26px] px-7.5 py-5">
            <Accordion type="single" collapsible className="w-full">
              {accordions.map((item) =>
                item.answer ? (
                  <AccordionItem
                    key={item.id}
                    value={item.id.toString()}
                    className="border-brand-hairline last:border-b-0"
                  >
                    <AccordionTrigger className="text-brand-ink py-4 text-lg hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-brand-body pb-4 text-base">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  // An entry with nothing written for it stays a plain row. The
                  // design draws a chevron on every one of them, but five of
                  // the six have no answer anywhere in the file, and a chevron
                  // that opens onto an empty panel is a defect, not a design.
                  <div
                    key={item.id}
                    className="border-brand-hairline text-brand-ink border-b py-4 text-lg last:border-b-0"
                  >
                    {item.question}
                  </div>
                )
              )}
            </Accordion>
          </div>
        )}
      </Container>
    </section>
  )
}

/**
 * The questions as cards, the first of them open, beside a heading column
 * that carries the two ways to ask something else.
 */
async function FaqCards({
  title,
  subTitle,
  accordions,
  locale,
}: {
  readonly title?: string | null
  readonly subTitle?: string | null
  readonly accordions: Accordions
  readonly locale?: Locale
}) {
  const answered = accordions.filter((item) => item.answer)

  if (answered.length === 0) {
    return null
  }

  // The number the header lists first and the hours the footer prints, by
  // the requests the header and the footer make themselves.
  const [t, navbar, footer] = await Promise.all([
    getTranslations("faq"),
    locale ? fetchNavbar(locale) : undefined,
    locale ? fetchFooter(locale) : undefined,
  ])
  const phone = clinicPhones(navbar?.data).find(Boolean)
  const hours = clinicHours(footer?.data).join(", ")
  const phoneHref = phone ? contactHref("phone", phone) : undefined

  return (
    <section>
      <Container className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          {title && (
            <Typography tag="h2" className="text-brand-ink mb-0!">
              {title}
            </Typography>
          )}
          {subTitle && (
            <Typography className="text-brand-body mb-0! max-w-95 text-[0.9375rem]/[1.5]! lg:text-[1.0625rem]/[1.5]!">
              {subTitle}
            </Typography>
          )}

          <div className="mt-2 flex max-w-95 flex-col gap-3">
            <LeadFormLink
              href={LEAD_FORM_ANCHOR}
              data-analytics-location="faq"
              className="bg-brand-gradient text-brand-inverted hover:shadow-brand-button lift flex items-center gap-3.5 rounded-[20px] py-3.5 pr-4 pl-3.5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <MessageSquare aria-hidden className="size-5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[0.9375rem] font-semibold">
                  {t("askTitle")}
                </span>
                <span className="text-[0.8125rem] opacity-80">
                  {t("askHint")}
                </span>
              </span>
            </LeadFormLink>

            {phone && phoneHref && (
              <a
                href={phoneHref}
                data-analytics-location="faq"
                className="text-brand-ink hover:shadow-brand-card lift flex items-center gap-3.5 rounded-[20px] border border-[#e1e6ea] bg-white py-3.5 pr-4 pl-3.5 hover:border-transparent"
              >
                <span className="bg-brand-mist text-brand-light flex size-11 shrink-0 items-center justify-center rounded-full">
                  <PhoneIcon aria-hidden className="size-5" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[0.9375rem] font-semibold">
                    {phone}
                  </span>
                  {hours && (
                    <span className="text-brand-body text-[0.8125rem]">
                      {hours}
                    </span>
                  )}
                </span>
              </a>
            )}
          </div>
        </div>

        <Accordion
          data-stagger
          type="single"
          collapsible
          defaultValue={answered[0]?.id.toString()}
          className="flex w-full flex-col gap-3"
        >
          {answered.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id.toString()}
              className="data-[state=open]:bg-brand-mist rounded-[20px] border-b-0 bg-white transition-colors duration-300 lg:rounded-[24px]"
            >
              {/* The trigger's own chevron is put away for the design's: a
                  disc that fills with the brand's teal and turns over while
                  the answer is open. */}
              <DiscAccordionTrigger
                className="px-5 py-4.5 text-base/[1.4] font-semibold lg:px-7 lg:py-5.5 lg:text-lg/[1.4]"
                discClassName="bg-brand-mist size-9"
              >
                {item.question}
              </DiscAccordionTrigger>
              <AccordionContent className="max-w-170 px-5 pb-5 text-[0.9375rem]/[1.6] text-[#444] motion-safe:animate-[rise_0.35s_var(--ease-out)] lg:px-7 lg:pb-6 lg:text-[1.0625rem]/[1.6]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq

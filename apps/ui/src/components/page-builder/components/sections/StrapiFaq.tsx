import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import Typography from "@/components/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiFaq({
  component,
}: PageBuilderComponentProps & { component: Data.Component<"sections.faq"> }) {
  const { title, subTitle, accordions } = component

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

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq

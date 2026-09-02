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
import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiFaq({
  component,
}: PageBuilderComponentProps & { component: Data.Component<"sections.faq"> }) {
  removeThisWhenYouNeedMe("StrapiFaq")

  return (
    <section>
      <Container className="flex flex-col gap-8">
        <div className="flex max-w-4xl flex-col gap-3">
          <Typography tag="h2" className="text-brand-ink">
            {component.title}
          </Typography>
          {component.subTitle && (
            <Typography className="text-brand-body">
              {component.subTitle}
            </Typography>
          )}
        </div>

        {component.accordions && (
          <Accordion type="single" collapsible className="w-full">
            {component.accordions.map((x) =>
              x.answer ? (
                <AccordionItem key={x.id} value={x.id.toString()}>
                  {/* The design sets these rows at 18px across the full content
                      width, not the small centred column the starter shipped. */}
                  <AccordionTrigger className="text-brand-ink text-lg">
                    {x.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-brand-body text-base">
                    {x.answer}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                // An entry with nothing written for it yet stays a plain row:
                // a chevron that opens onto an empty panel is worse than none.
                <div
                  key={x.id}
                  className="text-brand-ink border-b py-4 text-lg font-medium last:border-b-0"
                >
                  {x.question}
                </div>
              )
            )}
          </Accordion>
        )}
      </Container>
    </section>
  )
}

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq

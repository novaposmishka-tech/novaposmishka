import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { LeadForm } from "@/components/elementary/forms/LeadForm"
import { Typography } from "@/components/typography"

export function StrapiLeadForm({
  component,
}: {
  readonly component: Data.Component<"forms.lead-form">
}) {
  return (
    <div id="lead-form-section" className="scroll-mt-24">
      <Container>
        {/* Gradient/1 on a 50px radius — the CTA block from the design. */}
        <div className="bg-brand-gradient text-brand-inverted flex flex-col gap-10 rounded-[50px] p-8 md:p-12 lg:flex-row lg:gap-25 lg:p-12.5">
          <div className="flex flex-1 flex-col gap-5">
            {component.title && (
              <Typography tag="h2" className="text-brand-inverted">
                {component.title}
              </Typography>
            )}
            {component.description && (
              <Typography className="text-brand-inverted">
                {component.description}
              </Typography>
            )}
          </div>
          <div className="flex w-full max-w-133 flex-1">
            <LeadForm
              gdpr={{
                href: component.gdpr?.href ?? undefined,
                label: component.gdpr?.label ?? undefined,
                newTab: component.gdpr?.newTab ?? false,
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

StrapiLeadForm.displayName = "StrapiLeadForm"

export default StrapiLeadForm

import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { LeadFormBlock } from "@/components/elementary/forms/LeadFormBlock"

export function StrapiLeadForm({
  component,
}: {
  readonly component: Data.Component<"forms.lead-form">
}) {
  return (
    <div id="lead-form-section" className="scroll-mt-24">
      <Container>
        {/* Gradient/1 on a 50px radius — the CTA block from the design. */}
        <LeadFormBlock
          title={component.title}
          description={component.description}
          gdpr={{
            href: component.gdpr?.href ?? undefined,
            label: component.gdpr?.label ?? undefined,
            newTab: component.gdpr?.newTab ?? false,
          }}
        />
      </Container>
    </div>
  )
}

StrapiLeadForm.displayName = "StrapiLeadForm"

export default StrapiLeadForm

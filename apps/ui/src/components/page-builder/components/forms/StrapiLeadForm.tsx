import "server-only"

import type { Data } from "@repo/strapi-types"

import { LeadFormBlock } from "@/components/elementary/forms/LeadFormBlock"
import { LEAD_FORM_ANCHOR } from "@/lib/analytics"

export function StrapiLeadForm({
  component,
  phones,
}: {
  readonly component: Data.Component<"forms.lead-form">
  /** Offered beside the apology when a request could not be sent. */
  readonly phones?: readonly string[]
}) {
  return (
    // Gradient/1 on a 50px radius at desktop, where the frame insets it on
    // the 1320 grid; a square full-bleed band on a phone.
    <div className="lg:mx-auto lg:w-full lg:max-w-360 lg:px-15">
      <LeadFormBlock
        anchorId={LEAD_FORM_ANCHOR.slice(1)}
        title={component.title}
        description={component.description}
        gdpr={{
          href: component.gdpr?.href ?? undefined,
          label: component.gdpr?.label ?? undefined,
          newTab: component.gdpr?.newTab ?? false,
        }}
        phones={phones}
      />
    </div>
  )
}

StrapiLeadForm.displayName = "StrapiLeadForm"

export default StrapiLeadForm

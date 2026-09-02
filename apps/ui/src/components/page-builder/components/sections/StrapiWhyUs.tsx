import "server-only"

import type { Data } from "@repo/strapi-types"

import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiWhyUs({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.why-us">
}) {
  const { title, subtitle, reasons, image } = component

  if (!reasons?.length) {
    return null
  }

  return (
    <section id="why-us" className="scroll-mt-24">
      <Container className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-1 flex-col gap-8">
          {(title || subtitle) && (
            <div className="flex flex-col gap-4">
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

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {reasons.map((reason) => (
              <li key={reason.id} className="flex flex-col gap-3">
                {reason.image && (
                  <StrapiBasicImage
                    component={reason.image}
                    width={40}
                    height={40}
                    className="size-10 object-contain"
                  />
                )}
                {/* title/description are CKEditor fields on this shared row */}
                <CkEditorRenderer htmlContent={reason.title} className="mb-0" />
                <CkEditorRenderer
                  htmlContent={reason.description}
                  className="mb-0"
                />
              </li>
            ))}
          </ul>
        </div>

        {image && (
          <div className="w-full lg:max-w-2xl lg:flex-1">
            <StrapiBasicImage
              component={image}
              className="aspect-4/3 w-full rounded-3xl object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiWhyUs.displayName = "StrapiWhyUs"

export default StrapiWhyUs

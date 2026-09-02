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
      {/* One dark card on the brand gradient holding the whole section, as in
          the design — the reasons are cards within it, not a list beside a
          photograph. */}
      <Container className="bg-brand-gradient text-brand-inverted flex flex-col gap-12 rounded-[50px] p-8 md:p-12.5">
        {(title || subtitle) && (
          <div className="flex flex-col gap-4">
            {title && (
              <Typography tag="h2" className="text-brand-inverted">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className="text-brand-on-dark max-w-3xl">
                {subtitle}
              </Typography>
            )}
          </div>
        )}

        <ul className="grid list-none grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <li
              key={reason.id}
              className="flex flex-col gap-6 rounded-[26px] bg-white/5 p-7.5"
            >
              {reason.image && (
                <StrapiBasicImage
                  component={reason.image}
                  className="aspect-3/2 w-full rounded-[20px] object-cover"
                />
              )}

              <div className="flex flex-col gap-3 border-t border-white/15 pt-6">
                {/* title/description are CKEditor fields on this shared row, and
                    those carry their own colour — hand it back on the dark card. */}
                <CkEditorRenderer
                  htmlContent={reason.title}
                  className="mb-0 [&_p]:text-2xl! [&_p]:text-inherit!"
                />
                <CkEditorRenderer
                  htmlContent={reason.description}
                  className="text-brand-on-dark mb-0 [&_p]:text-base! [&_p]:text-inherit!"
                />
              </div>
            </li>
          ))}
        </ul>

        {image && (
          <StrapiBasicImage
            component={image}
            className="aspect-4/3 w-full rounded-3xl object-cover"
          />
        )}
      </Container>
    </section>
  )
}

StrapiWhyUs.displayName = "StrapiWhyUs"

export default StrapiWhyUs

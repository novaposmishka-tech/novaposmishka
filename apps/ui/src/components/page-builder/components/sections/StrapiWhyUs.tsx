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
      {/* One dark band on the brand gradient holding the whole section, as in
          the design — the reasons are cards within it, not a list beside a
          photograph. It sits on the grid at desktop with the frame's 50px
          corners, and runs the full width of a phone with square ones. */}
      <Container hideDefaultPadding className="lg:px-15">
        <div className="bg-brand-gradient text-brand-inverted flex flex-col gap-7.5 px-3.75 pt-7.5 pb-10 lg:gap-12.5 lg:rounded-[50px] lg:p-12.5">
          {(title || subtitle) && (
            <div className="flex flex-col gap-4">
              {title && (
                <Typography tag="h2" className="text-brand-inverted mb-0!">
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

          <ul className="grid list-none grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {reasons.map((reason) => (
              <li
                key={reason.id}
                // The frame draws a hairline of white around each card, not
                // only the wash inside it.
                className="flex flex-col gap-5 rounded-[20px] border border-white/10 bg-white/5 p-5 lg:gap-7.5 lg:rounded-[26px] lg:p-7.5"
              >
                {reason.image && (
                  <StrapiBasicImage
                    component={reason.image}
                    className="aspect-2/1 w-full rounded-[20px] object-cover lg:aspect-331/226"
                  />
                )}

                <div className="flex flex-col gap-2.5 border-t border-white/20 pt-5 lg:gap-3.75 lg:pt-7.5">
                  {/* title/description are CKEditor fields on this shared row,
                      and those carry their own colour and scale — the frame's
                      have to be stated over them. */}
                  <CkEditorRenderer
                    htmlContent={reason.title}
                    className="mb-0 [&_p]:mb-0! [&_p]:text-lg/6.25! [&_p]:font-semibold [&_p]:text-inherit! lg:[&_p]:text-2xl/8.5!"
                  />
                  <CkEditorRenderer
                    htmlContent={reason.description}
                    className="mb-0 [&_p]:mb-0! [&_p]:text-sm/5! [&_p]:text-inherit! lg:[&_p]:text-base/5.5!"
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
        </div>
      </Container>
    </section>
  )
}

StrapiWhyUs.displayName = "StrapiWhyUs"

export default StrapiWhyUs

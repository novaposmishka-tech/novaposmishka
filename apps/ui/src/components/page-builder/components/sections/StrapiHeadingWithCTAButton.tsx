import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { GoogleMark } from "@/components/icons/GoogleMark"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHeadingWithCTAButton({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.heading-with-cta-button">
}) {
  const { title, subText, cta, mark } = component

  return (
    <section>
      <Container>
        {/* A band of the page's own mist inside the grid, not across the frame
            — the design rounds its corners, which only reads if its edges are
            the grid's. The copy keeps the line breaks an editor typed: the
            design sets both the heading and the closing thanks on their own
            lines. */}
        <div className="bg-brand-mist flex flex-col items-center gap-10 rounded-[20px] px-5 py-7.5 text-center lg:gap-12.5 lg:rounded-[50px] lg:p-12.5">
          <div className="flex flex-col items-center gap-5 lg:max-w-175.75">
            {mark === "google" && <GoogleMark className="size-12.5" />}

            {/* The frame sets this heading lighter and smaller than the page's
                other second-level headings, so the type scale is stated. */}
            <Typography
              tag="h2"
              className="text-brand-ink mb-0! text-[1.625rem]/7.75! font-normal! whitespace-pre-line lg:text-[2.5rem]/12!"
            >
              {title}
            </Typography>

            {subText && (
              <p className="text-brand-body text-sm/5 whitespace-pre-line lg:text-lg/[1.5625rem]">
                {subText}
              </p>
            )}
          </div>

          {cta && (
            <StrapiLink
              component={cta}
              className="h-12.5 w-fit gap-2 rounded-[30px] px-7.5 text-base/5.5 font-semibold"
            >
              {cta.label}
              <ArrowRight aria-hidden className="size-5" />
            </StrapiLink>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiHeadingWithCTAButton.displayName = "StrapiHeadingWithCTAButton"

export default StrapiHeadingWithCTAButton

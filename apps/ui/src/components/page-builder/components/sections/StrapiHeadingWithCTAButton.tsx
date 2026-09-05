import "server-only"

import type { Data } from "@repo/strapi-types"

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
      {/* A centred card, as the design draws the invitation to leave a review.
          The copy keeps the line breaks an editor typed: the design sets both
          the heading and the closing thanks on their own lines. */}
      <Container className="bg-brand-mist flex flex-col items-center gap-8 rounded-[50px] px-8 py-12.5 text-center md:px-12.5">
        {mark === "google" && <GoogleMark className="size-12.5" />}

        <div className="flex max-w-176 flex-col gap-6">
          <Typography tag="h2" className="text-brand-ink whitespace-pre-line">
            {title}
          </Typography>

          {subText && (
            <p className="text-brand-body text-lg whitespace-pre-line">
              {subText}
            </p>
          )}
        </div>

        {cta && <StrapiLink component={cta} className="w-fit" />}
      </Container>
    </section>
  )
}

StrapiHeadingWithCTAButton.displayName = "StrapiHeadingWithCTAButton"

export default StrapiHeadingWithCTAButton

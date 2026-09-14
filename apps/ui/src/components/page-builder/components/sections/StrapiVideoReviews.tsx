import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { VideoReviewList } from "@/components/elementary/VideoReviewList"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiVideoReviews({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.video-reviews">
}) {
  const { title, reviews, link } = component

  if (!reviews?.length) {
    return null
  }

  const t = await getTranslations("testimonials")

  return (
    <section id="video-reviews" className="scroll-mt-24">
      <Container className="flex flex-col gap-7.5 lg:gap-12.5">
        {title && (
          <Typography tag="h2" className="text-brand-ink">
            {title}
          </Typography>
        )}

        <VideoReviewList
          reviews={reviews}
          label={title}
          moreLabel={t("showMore")}
        />

        {link && <StrapiLink component={link} className="mx-auto w-fit" />}
      </Container>
    </section>
  )
}

StrapiVideoReviews.displayName = "StrapiVideoReviews"

export default StrapiVideoReviews

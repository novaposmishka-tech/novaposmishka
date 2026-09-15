import "server-only"

import type { Data } from "@repo/strapi-types"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { BeforeAfterSlider } from "@/components/elementary/BeforeAfterSlider"
import { Container } from "@/components/elementary/Container"
import { PlayableStill } from "@/components/elementary/PlayableStill"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { caseStudyId } from "@/lib/case-studies"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type Stage = NonNullable<
  Data.Component<"sections.case-study">["stages"]
>[number]

/** The white card the design sets every part of a case study on. */
const CARD =
  "shadow-brand-card flex flex-col gap-5 rounded-[20px] bg-white p-5 lg:flex-row lg:rounded-[26px] lg:p-12.5"

/** A hairline across a column, as the design rules these cards. */
const RULE = "border-brand-hairline border-t"

export async function StrapiCaseStudy({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.case-study">
}) {
  const {
    title,
    patient,
    tags,
    quote,
    videoLabel,
    videoUrl,
    videoPoster,
    before,
    after,
    stages,
  } = component

  const t = await getTranslations("results")
  // A clip uploaded to Strapi is stored as a path; one an editor pasted from
  // elsewhere is already whole. This completes the first and leaves the second.
  const clip = formatStrapiMediaUrl(videoUrl)

  return (
    <section id={caseStudyId(title)} className="scroll-mt-24">
      {/* The frame tells a case as a stack of white cards, 20 apart on a phone
          and 30 at desktop — the first naming the case, the rest walking
          through the treatment a step at a time. */}
      <Container className="flex flex-col gap-5 lg:gap-7.5">
        <article className={cn(CARD, "lg:gap-15")}>
          {/* The frame holds this column to 572 and pushes the filmed
              walk-through to the foot of it, level with the photographs. */}
          <div className="flex flex-col gap-5 lg:w-143 lg:justify-between lg:gap-0">
            <div className="flex flex-col gap-4 lg:gap-7.5">
              <div className="flex flex-col gap-2.5 lg:gap-5">
                <Typography
                  tag="h2"
                  className="text-brand-ink mb-0! text-lg/6.25! font-semibold lg:text-2xl/8.5!"
                >
                  {title}
                </Typography>

                {patient && (
                  <p className="text-brand-body text-sm/5 lg:text-lg/6.25">
                    {patient}
                  </p>
                )}
              </div>

              {tags && tags.length > 0 && (
                <ul className="flex list-none flex-wrap gap-2.5">
                  {tags.map((tag) => (
                    <li
                      key={tag.id}
                      className="bg-brand-mist text-brand-ink flex h-10 items-center rounded-full px-5 text-sm/5"
                    >
                      {tag.text}
                    </li>
                  ))}
                </ul>
              )}

              {quote && (
                <blockquote className="text-brand-ink text-sm/5 lg:text-base/5.5">
                  {quote}
                </blockquote>
              )}
            </div>

            {/* The filmed walk-through, offered only when there is a film. The
                still on its own would be a play button that does nothing. */}
            {clip && videoPoster && (
              <div className={cn(RULE, "flex flex-col gap-5 pt-5 lg:pt-9.75")}>
                {videoLabel && (
                  <span className="text-brand-body text-sm/5 lg:text-base/5.5">
                    {videoLabel}
                  </span>
                )}
                <PlayableStill
                  src={clip}
                  label={videoLabel}
                  className="aspect-3/2 w-full shrink-0 overflow-hidden rounded-[26px] lg:w-75"
                  poster={
                    <StrapiBasicImage
                      component={videoPoster}
                      className="h-full w-full object-cover"
                    />
                  }
                />
              </div>
            )}
          </div>

          {/* The whole treatment in one drag, before the stages break it
              down. The frame gives it the wider half of the card. */}
          {before && after && (
            <BeforeAfterSlider
              before={before}
              after={after}
              labels={{
                before: t("before"),
                after: t("after"),
                compare: t("compare"),
              }}
              className="rounded-[26px] lg:flex-1"
            />
          )}
        </article>

        {stages?.map((stage, index) => (
          <CaseStage
            key={stage.id}
            stage={stage}
            // The frame turns the card over at every step: photographs left,
            // then words left, then photographs again.
            imagesFirst={index % 2 === 0}
            labels={{ before: t("before"), after: t("after") }}
          />
        ))}
      </Container>
    </section>
  )
}

/**
 * One numbered step: the photographs on one side, what was done on the other,
 * and the dentist who did it under the words — as the design lays it out. On a
 * phone the words come first at every step and the photographs follow.
 */
function CaseStage({
  stage,
  imagesFirst,
  labels,
}: {
  readonly stage: Stage
  readonly imagesFirst: boolean
  readonly labels: { before: string; after: string }
}) {
  const images = stage.images ?? []
  const pair = stage.showBeforeAfter && images.length === 2

  return (
    <article className={cn(CARD, "lg:items-center lg:gap-12.5")}>
      {images.length > 0 && (
        <ul
          className={cn(
            "grid list-none grid-cols-2 gap-5 lg:w-146 lg:gap-6",
            imagesFirst ? "order-2 lg:order-1" : "order-2"
          )}
        >
          {images.map((img, index) => (
            <li key={img.id} className="relative">
              <StrapiBasicImage
                component={img}
                className="aspect-140/93 w-full rounded-[20px] object-cover lg:rounded-[26px]"
              />
              {pair && (
                <span className="text-brand-ink absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm">
                  {labels[index === 0 ? "before" : "after"]}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div
        className={cn(
          "flex flex-col gap-4 lg:gap-7.5",
          imagesFirst ? "order-1 lg:order-2 lg:w-134" : "order-1 lg:w-134"
        )}
      >
        <div className="flex flex-col gap-4 lg:gap-5">
          <Typography
            tag="h3"
            className="text-brand-ink mb-0! text-lg/6.25! font-semibold lg:text-2xl/8.5!"
          >
            {stage.title}
          </Typography>

          {stage.intro && (
            <p className="text-brand-body text-sm/5 lg:text-base/5.5">
              {stage.intro}
            </p>
          )}

          {stage.bullets && stage.bullets.length > 0 && (
            <ul className="flex list-none flex-col gap-2.5">
              {stage.bullets.map((bullet) => (
                <li
                  key={bullet.id}
                  className="text-brand-body flex items-start gap-1.25 text-sm/5 lg:text-base/5.5"
                >
                  <ChevronRight
                    aria-hidden
                    className="text-brand-body size-5.5 shrink-0"
                  />
                  {bullet.text}
                </li>
              ))}
            </ul>
          )}

          {stage.note && (
            <p className="text-brand-body text-sm/5 lg:text-base/5.5">
              {stage.note}
            </p>
          )}
        </div>

        {stage.doctorName && (
          <div
            className={cn(RULE, "flex items-center gap-3.75 pt-4 lg:pt-7.5")}
          >
            {stage.doctorPhoto && (
              <StrapiBasicImage
                component={stage.doctorPhoto}
                // Ranged to the top: a centred square crop of a half-body
                // portrait takes the top of the head off.
                className="bg-brand-on-dark size-12.5 shrink-0 rounded-full object-cover object-top"
              />
            )}
            <span className="text-brand-body text-sm/5 lg:text-lg/6.25">
              {stage.doctorName}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}

StrapiCaseStudy.displayName = "StrapiCaseStudy"

export default StrapiCaseStudy

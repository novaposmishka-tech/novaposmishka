import "server-only"

import type { Data } from "@repo/strapi-types"
import { ChevronRight, Play } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { BeforeAfterSlider } from "@/components/elementary/BeforeAfterSlider"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { caseStudyId } from "@/lib/case-studies"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type Stage = NonNullable<
  Data.Component<"sections.case-study">["stages"]
>[number]

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

  return (
    <section id={caseStudyId(title)} className="scroll-mt-24">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4">
            <Typography tag="h2" className="text-brand-ink">
              {title}
            </Typography>

            {patient && <p className="text-brand-body text-lg">{patient}</p>}

            {tags && tags.length > 0 && (
              <ul className="flex list-none flex-wrap gap-3">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="bg-brand-surface text-brand-ink rounded-full px-5 py-2 text-sm"
                  >
                    {tag.text}
                  </li>
                ))}
              </ul>
            )}

            {quote && (
              <blockquote className="text-brand-ink max-w-176 text-lg">
                {quote}
              </blockquote>
            )}
          </div>

          {/* The filmed walk-through, offered only when there is a film. The
              still on its own would be a play button that does nothing. */}
          {videoUrl && videoPoster && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative w-full shrink-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 lg:w-75"
            >
              <StrapiBasicImage
                component={videoPoster}
                className="aspect-3/2 w-full rounded-2xl object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="text-brand-deep flex size-12 items-center justify-center rounded-full bg-white/90 shadow-md">
                  <Play aria-hidden className="size-5 fill-current" />
                </span>
              </span>
              {videoLabel && (
                <span className="text-brand-body group-hover:text-brand-teal mt-3 block text-sm">
                  {videoLabel}
                </span>
              )}
            </a>
          )}
        </div>

        {/* The whole treatment in one drag, before the stages break it down. */}
        {before && after && (
          <BeforeAfterSlider
            before={before}
            after={after}
            labels={{
              before: t("before"),
              after: t("after"),
              compare: t("compare"),
            }}
            className="rounded-[26px]"
          />
        )}

        {stages?.map((stage) => (
          <CaseStage
            key={stage.id}
            stage={stage}
            labels={{ before: t("before"), after: t("after") }}
          />
        ))}
      </Container>
    </section>
  )
}

/**
 * One numbered step: the photographs on the left, what was done on the right,
 * and the dentist who did it along the bottom — as the design lays it out.
 */
function CaseStage({
  stage,
  labels,
}: {
  readonly stage: Stage
  readonly labels: { before: string; after: string }
}) {
  const images = stage.images ?? []
  const pair = stage.showBeforeAfter && images.length === 2
  // A pair sits side by side from the small breakpoint up; more than two are
  // a grid at every width, as the design lays the diagnosis photographs out.
  const columns =
    images.length > 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"

  return (
    <article className="bg-brand-paper border-brand-border grid grid-cols-1 gap-8 rounded-[26px] border p-7.5 lg:grid-cols-2 lg:gap-12.5">
      {images.length > 0 && (
        <ul className={cn("order-2 grid list-none gap-4 lg:order-1", columns)}>
          {images.map((img, index) => (
            <li key={img.id} className="relative">
              <StrapiBasicImage
                component={img}
                className="aspect-3/2 w-full rounded-[26px] object-cover"
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

      <div className="order-1 flex flex-col gap-4 lg:order-2">
        <Typography tag="h3" className="text-brand-ink text-2xl">
          {stage.title}
        </Typography>

        {stage.intro && (
          <p className="text-brand-body text-base">{stage.intro}</p>
        )}

        {stage.bullets && stage.bullets.length > 0 && (
          <ul className="flex list-none flex-col gap-2">
            {stage.bullets.map((bullet) => (
              <li
                key={bullet.id}
                className="text-brand-body flex items-start gap-2 text-base"
              >
                <ChevronRight
                  aria-hidden
                  className="text-brand-accent mt-1 size-4 shrink-0"
                />
                {bullet.text}
              </li>
            ))}
          </ul>
        )}

        {stage.note && (
          <p className="text-brand-body text-base">{stage.note}</p>
        )}

        {stage.doctorName && (
          <div className="border-brand-border mt-auto flex items-center gap-4 border-t pt-5">
            {stage.doctorPhoto && (
              <StrapiBasicImage
                component={stage.doctorPhoto}
                className="size-12.5 rounded-full object-cover"
              />
            )}
            <span className="text-brand-ink text-base">{stage.doctorName}</span>
          </div>
        )}
      </div>
    </article>
  )
}

StrapiCaseStudy.displayName = "StrapiCaseStudy"

export default StrapiCaseStudy

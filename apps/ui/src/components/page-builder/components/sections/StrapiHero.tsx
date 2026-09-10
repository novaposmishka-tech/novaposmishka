import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight, Play } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { BackgroundVideo } from "@/components/elementary/BackgroundVideo"
import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { PhotoHeroFrame } from "@/components/elementary/PhotoHeroFrame"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiHero({
  component,
}: PageBuilderComponentProps & { component: Data.Component<"sections.hero"> }) {
  const {
    title,
    description,
    links,
    tag,
    note,
    images,
    serviceTags,
    backgroundImage,
    backgroundVideo,
    videoUrl,
  } = component

  // The design has several hero treatments, so the layout follows the content:
  //  - a background image  → a rounded dark card with the copy over it
  //  - images              → a two-column split, copy left and collage right
  //  - neither             → the original centered layout, so hero content
  //                          authored before either field existed still renders
  //                          the way it was written.
  const hasBackground = Boolean(backgroundImage || backgroundVideo)
  const t = await getTranslations("general")
  const playLabel = t("play")
  const hasImages = !hasBackground && Boolean(images?.length)
  const isCentered = !hasBackground && !hasImages
  // Service pages use the photo hero with copy alone. Without a bottom row to
  // push away, stretching the card just leaves a tall empty half.
  const hasBottomRow =
    hasBackground && (Boolean(images?.length) || Boolean(serviceTags?.length))

  return (
    <section>
      <Wrapper hasBackground={hasBackground}>
        {hasBackground && (
          <Backdrop image={backgroundImage} video={backgroundVideo} />
        )}

        <div
          className={layoutClass({ hasBackground, hasBottomRow, hasImages })}
        >
          <div className={copyClass({ hasBackground, isCentered })}>
            {tag && (
              <div
                className={cn(
                  "mb-5 flex h-7.25 items-center justify-center gap-2.5 rounded-full border px-2.5 shadow-sm backdrop-blur-md lg:mb-7.5 lg:h-9.5 lg:px-5",
                  hasBackground
                    ? "border-white/40 [&_p]:text-inherit!"
                    : "border-brand-border bg-brand-surface/60"
                )}
              >
                {/* The design marks the line with a dot before the words. */}
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full lg:size-2.5",
                    hasBackground ? "bg-brand-on-dark" : "bg-brand-accent"
                  )}
                />
                <CkEditorRenderer
                  htmlContent={tag}
                  className="mb-0 [&_p]:text-xs! lg:[&_p]:text-base!"
                />
              </div>
            )}

            <CkEditorRenderer
              htmlContent={title}
              className={cn(
                hasBackground &&
                  cn(
                    "[&_h1]:text-inherit!",
                    "[&_h1]:pl-7.5 [&_h1]:-indent-7.5 lg:[&_h1]:pl-17.5 lg:[&_h1]:-indent-17.5",
                    "[&_h1]:leading-[43px] lg:[&_h1]:leading-[79px]",
                    "[&_h1]:mb-2.5! lg:[&_h1]:mb-5!",
                    "[&_h1]:first-line:text-brand-on-dark"
                  )
              )}
            />

            {description && (
              <CkEditorRenderer
                htmlContent={description}
                className={cn(
                  isCentered && "mx-auto max-w-168.75",
                  hasBackground &&
                    "mb-10 [&_p]:mb-0 [&_p]:text-lg! [&_p]:text-inherit! lg:[&_p]:text-xl!"
                )}
              />
            )}

            {links && (
              <div
                className={cn(
                  "flex w-full flex-col gap-2 lg:flex-row lg:gap-4",
                  // The phone frame ends on the button, above the hero's own
                  // 60px of floor.
                  hasBackground && "max-lg:mt-auto",
                  isCentered ? "mx-auto md:w-fit" : "lg:w-auto"
                )}
              >
                {links.map((link) => (
                  <StrapiLink
                    key={link.id}
                    component={link}
                    // The frame leaves 12px between the words and the arrow. It
                    // spends 6 of them on the icon's own 24px box, which sits
                    // around a 12x9 glyph; ours is a 20px box drawn nearly to
                    // its edges, so the button has to give back the difference.
                    className="h-10 w-full gap-2 rounded-[30px] px-5 text-sm font-semibold lg:h-12.5 lg:w-fit lg:px-7.5 lg:text-base"
                  >
                    {link.label}
                    <ArrowRight aria-hidden className="size-5" />
                  </StrapiLink>
                ))}
              </div>
            )}

            {!hasBackground && (
              <ServiceTags
                serviceTags={serviceTags}
                isCentered={isCentered}
                onPhoto={false}
                className="pt-6"
              />
            )}

            <CkEditorRenderer htmlContent={note} className="pt-6" />
          </div>

          {hasBottomRow && (
            <BottomRow
              images={images}
              serviceTags={serviceTags}
              videoUrl={videoUrl}
              playLabel={playLabel}
            />
          )}

          {hasImages && (
            <div className="grid flex-1 grid-cols-2 gap-4">
              {images?.map((image, index) => (
                <StrapiBasicImage
                  key={image.id}
                  component={image}
                  // The collage alternates tall and short tiles, as in the design.
                  className={cn(
                    "w-full rounded-3xl object-cover",
                    index % 2 === 0 ? "aspect-3/4" : "mt-8 aspect-square"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </Wrapper>
    </section>
  )
}

/** How the hero stacks: the photo frame's measurements, or the older layouts. */
const layoutClass = ({
  hasBackground,
  hasBottomRow,
  hasImages,
}: {
  hasBackground: boolean
  hasBottomRow: boolean
  hasImages: boolean
}) =>
  cn(
    "flex flex-col gap-10",
    hasBackground
      ? cn(
          "gap-24.25 pt-25 pb-15 lg:gap-17.5 lg:pt-[167px] lg:pb-7.5",
          "lg:min-h-217.5",
          hasBottomRow && "min-h-200"
        )
      : "px-4 py-8 lg:py-12",
    hasImages && "lg:flex-row lg:items-center lg:gap-16"
  )

/**
 * The column holding the words. On the phone a photo hero is this column alone,
 * the full height of the frame, so it takes all of it and the button can sit on
 * the floor. The desktop frame stacks a second row underneath and measures
 * every gap itself, so it is left alone.
 */
const copyClass = ({
  hasBackground,
  isCentered,
}: {
  hasBackground: boolean
  isCentered: boolean
}) =>
  cn(
    "flex flex-col",
    hasBackground ? "gap-0 max-lg:flex-1" : "gap-4",
    isCentered
      ? "mx-auto items-center justify-center text-center md:w-2/4"
      : cn("items-start text-left", !hasBackground && "flex-1")
  )

/**
 * Over a photo the design closes the hero with its own row: the clinic snapshot
 * on the left, the specialties on the right. The phone frame carries neither,
 * so with no snapshot there is nothing here to hold a gap open.
 */
function BottomRow({
  images,
  serviceTags,
  videoUrl,
  playLabel,
}: {
  readonly images: Data.Component<"sections.hero">["images"]
  readonly serviceTags: Data.Component<"sections.hero">["serviceTags"]
  readonly videoUrl: string | null | undefined
  readonly playLabel: string
}) {
  const snapshot = images?.[0]

  return (
    <div
      className={cn(
        "flex flex-col gap-8 lg:min-h-50 lg:flex-row lg:items-center lg:justify-between",
        !snapshot && "max-lg:hidden"
      )}
    >
      {snapshot && (
        <div className="relative w-full lg:w-75">
          <StrapiBasicImage
            component={snapshot}
            className="h-50 w-full rounded-[20px] object-cover"
          />
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={playLabel}
              className="absolute inset-0 flex items-center justify-center rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-black/60">
                <Play aria-hidden className="size-4 fill-white text-white" />
              </span>
            </a>
          )}
        </div>
      )}
      <ServiceTags
        serviceTags={serviceTags}
        isCentered={false}
        className="hidden lg:ml-auto lg:flex lg:max-w-156"
      />
    </div>
  )
}

/**
 * What lies behind the copy on a photo hero: the photograph, the clip that
 * plays over it where an editor uploaded one, and the wash that keeps the words
 * legible whatever picture they chose. Black at 40%, as in the design.
 */
function Backdrop({
  image,
  video,
}: {
  readonly image: Data.Component<"sections.hero">["backgroundImage"]
  readonly video: Data.Component<"sections.hero">["backgroundVideo"]
}) {
  return (
    <>
      {image && (
        <StrapiBasicImage
          component={image}
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}
      {video && (
        <BackgroundVideo
          src={formatStrapiMediaUrl(video.url)}
          // The photograph doubles as the clip's poster, so there is something
          // on screen while it loads and for anyone it never reaches.
          poster={formatStrapiMediaUrl(image?.media?.url)}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-black/40" />
    </>
  )
}

/**
 * A photo hero runs edge to edge, as the design draws it — the copy still sits
 * on the 1320 grid, so the container moves inside. Every other hero is the
 * container itself.
 */
function Wrapper({
  hasBackground,
  children,
}: {
  readonly hasBackground: boolean
  readonly children: React.ReactNode
}) {
  if (!hasBackground) {
    return <Container>{children}</Container>
  }

  return (
    <PhotoHeroFrame>
      <Container>{children}</Container>
    </PhotoHeroFrame>
  )
}

/**
 * The clinic's specialties, as pills. On a photo they are translucent white,
 * as in the design; on the light layouts they take the surface tokens.
 */
function ServiceTags({
  serviceTags,
  isCentered,
  onPhoto = true,
  className,
}: {
  readonly serviceTags: Data.Component<"sections.hero">["serviceTags"]
  readonly isCentered: boolean
  readonly onPhoto?: boolean
  readonly className?: string
}) {
  if (!serviceTags || serviceTags.length === 0) {
    return null
  }

  return (
    <ul
      className={cn(
        "flex list-none flex-wrap gap-5",
        isCentered && "justify-center",
        className
      )}
    >
      {serviceTags.map((serviceTag) => (
        <li
          key={serviceTag.id}
          className={cn(
            "flex h-11.25 items-center rounded-full px-5 text-base backdrop-blur-sm",
            onPhoto
              ? "bg-white/20"
              : "bg-brand-surface border-brand-border border text-sm"
          )}
        >
          {serviceTag.text}
        </li>
      ))}
    </ul>
  )
}

StrapiHero.displayName = "StrapiHero"

export default StrapiHero

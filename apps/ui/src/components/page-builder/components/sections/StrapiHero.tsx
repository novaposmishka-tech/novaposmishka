import "server-only"

import type { Data } from "@repo/strapi-types"

import { BackgroundVideo } from "@/components/elementary/BackgroundVideo"
import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHero({
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
  } = component

  // The design has several hero treatments, so the layout follows the content:
  //  - a background image  → a rounded dark card with the copy over it
  //  - images              → a two-column split, copy left and collage right
  //  - neither             → the original centered layout, so hero content
  //                          authored before either field existed still renders
  //                          the way it was written.
  const hasBackground = Boolean(backgroundImage || backgroundVideo)
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
          className={cn(
            "flex flex-col gap-10",
            hasBackground
              ? cn(
                  "py-10 lg:py-7.5",
                  hasBottomRow && "lg:min-h-191 lg:justify-between"
                )
              : "px-4 py-8 lg:py-12",
            hasImages && "lg:flex-row lg:items-center lg:gap-16"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-4",
              isCentered
                ? "mx-auto items-center justify-center text-center md:w-2/4"
                : "flex-1 items-start text-left"
            )}
          >
            {tag && (
              <div
                className={cn(
                  "mb-4 flex items-center justify-center rounded-full border px-3 py-1 shadow-sm backdrop-blur-md",
                  hasBackground
                    ? "border-white/40 [&_p]:text-inherit!"
                    : "border-brand-border bg-brand-surface/60"
                )}
              >
                <CkEditorRenderer htmlContent={tag} className="mb-0" />
              </div>
            )}

            <CkEditorRenderer
              htmlContent={title}
              className={cn(hasBackground && "[&_h1]:text-inherit!")}
            />

            {description && (
              <CkEditorRenderer
                htmlContent={description}
                className={cn(
                  isCentered && "mx-auto max-w-168.75",
                  hasBackground && "text-lg [&_p]:text-inherit!"
                )}
              />
            )}

            {links && (
              <div
                className={cn(
                  "flex w-full flex-col gap-2 pt-6 lg:flex-row lg:gap-4",
                  isCentered ? "mx-auto md:w-fit" : "lg:w-auto"
                )}
              >
                {links.map((link) => (
                  <StrapiLink
                    key={link.id}
                    component={link}
                    className="w-full lg:w-fit"
                  />
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

          {/* Over a photo the design closes the hero with its own row: the
              clinic snapshot on the left, the specialties on the right. */}
          {hasBottomRow && (
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              {images?.[0] && (
                <StrapiBasicImage
                  component={images[0]}
                  className="aspect-3/2 w-full rounded-3xl object-cover lg:w-75"
                />
              )}
              <ServiceTags
                serviceTags={serviceTags}
                isCentered={false}
                className="lg:max-w-156 lg:justify-end"
              />
            </div>
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
    // Square at the top, where the photo runs under the header, and curved at
    // the bottom where the white page begins — the mask in the design is
    // [0, 0, 50, 50].
    <div className="relative isolate overflow-hidden rounded-b-[50px] text-white">
      <Container>{children}</Container>
    </div>
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
        "flex list-none flex-wrap gap-3",
        isCentered && "justify-center",
        className
      )}
    >
      {serviceTags.map((serviceTag) => (
        <li
          key={serviceTag.id}
          className={cn(
            "rounded-full px-5 py-2.5 text-base backdrop-blur-sm",
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

import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"

import { BackgroundVideo } from "@/components/elementary/BackgroundVideo"
import {
  Breadcrumbs,
  hasBreadcrumbTrail,
} from "@/components/elementary/Breadcrumbs"
import CkEditorRenderer from "@/components/elementary/ck-editor"
import { Container } from "@/components/elementary/Container"
import { PhotoHeroFrame } from "@/components/elementary/PhotoHeroFrame"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHero({
  component,
  breadcrumbs,
  pageParams,
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
    figures,
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
  const hasFigures = hasBackground && Boolean(figures?.length)
  const hasBottomRow =
    hasBackground && (Boolean(serviceTags?.length) || hasFigures)
  // The team page opens on the photograph alone. With nothing to give it
  // height, a phone would be left with a 160px strip where the frame draws 450.
  const isBarePhoto = hasBackground && !title && !description && !tag
  // The frame runs the trail under the header, inside the hero, and starts the
  // copy a measured distance below it — so whether it is there changes where
  // the hero's first line lands.
  // Whether the trail is drawn is asked of the data, not of the element: a
  // page that carries only itself renders nothing, and the hero has to know
  // that before it sets its own padding.
  const hasTrail = Boolean(pageParams) && hasBreadcrumbTrail(breadcrumbs)

  return (
    <section>
      <Wrapper
        hasBackground={hasBackground}
        hasBottomRow={hasBottomRow && !hasFigures}
        hasTrail={hasTrail}
        isBarePhoto={isBarePhoto}
      >
        {hasBackground && (
          <Backdrop
            image={backgroundImage}
            video={backgroundVideo}
            fade={isBarePhoto}
          />
        )}

        {hasTrail && pageParams && (
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            locale={pageParams.locale}
            onPhoto={hasBackground}
          />
        )}

        <div
          className={layoutClass({
            hasBackground,
            hasFigures,
            hasImages,
            hasTrail,
          })}
        >
          <div className={copyClass({ hasBackground, isCentered })}>
            <HeroTag tag={tag} hasBackground={hasBackground} />

            <CkEditorRenderer
              htmlContent={title}
              className={cn(
                hasBackground &&
                  cn(
                    "[&_h1]:text-inherit!",
                    "[&_h1]:pl-7.5 [&_h1]:-indent-7.5 lg:[&_h1]:pl-17.5 lg:[&_h1]:-indent-17.5",
                    // The frame runs the stepped line past the column rather
                    // than folding it: on a phone it ends 14px off the edge of
                    // the screen, which the grid's own margin cannot give it.
                    "[&_h1]:-mr-4 lg:[&_h1]:mr-0",
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
                    // The frame holds the sentence under the heading to a 632
                    // column; the heading itself is allowed past it. On a phone
                    // it sets the sentence 14/20 on every page but the
                    // homepage, which is the one page with no trail above it.
                    cn(
                      "mb-10 lg:max-w-158 [&_p]:mb-0 [&_p]:text-inherit! lg:[&_p]:text-xl/7.5!",
                      hasTrail ? "[&_p]:text-sm/5!" : "[&_p]:text-lg/6.25!"
                    )
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

          {hasFigures ? (
            <FiguresRow figures={figures} />
          ) : (
            hasBottomRow && <BottomRow serviceTags={serviceTags} />
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
 * The pill above the heading: a dot, then a line of type, on a hairline that
 * holds whatever is behind it.
 */
function HeroTag({
  tag,
  hasBackground,
}: {
  readonly tag: Data.Component<"sections.hero">["tag"]
  readonly hasBackground: boolean
}) {
  if (!tag) {
    return null
  }

  return (
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
  )
}

/** How the hero stacks: the photo frame's measurements, or the older layouts. */
const layoutClass = ({
  hasBackground,
  hasFigures,
  hasImages,
  hasTrail,
}: {
  hasBackground: boolean
  hasFigures: boolean
  hasImages: boolean
  hasTrail: boolean
}) =>
  cn(
    "flex flex-1 flex-col gap-10",
    hasBackground
      ? cn(
          "gap-24.25 pb-15 lg:gap-17.5 lg:pb-7.5",
          // Where the trail is drawn it has already cleared the header and set
          // its own margin, so all that is left is the frame's gap under it —
          // 70, or 20 and 30 on a hero that has cards to fit in as well.
          hasTrail
            ? hasFigures
              ? "pt-5 lg:pt-7.5"
              : "pt-17.5"
            : "pt-25 lg:pt-[167px]",
          // The cards stand off the floor of the frame rather than on it: 92
          // on a phone, 95 on a desktop, where the pills sit 30 up.
          hasFigures && "pb-23 max-lg:gap-17.5 lg:pb-23.75"
        )
      : cn("py-8 lg:py-12", hasTrail && "pt-7.5! pb-0! lg:pt-2.5!"),
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
 * The clinic's numbers along the foot of a photo hero, on glass.
 *
 * The frame lays them out differently on each width: a single row of cards cut
 * to their own contents on a desktop, each figure beside its words; a 2+1 grid
 * on a phone, with the words under the figure. It holds the desktop labels to a
 * 230px column, which is what folds the longest of them onto a second line and
 * what keeps the three cards spanning the grid exactly.
 */
function FiguresRow({
  figures,
}: {
  readonly figures: Data.Component<"sections.hero">["figures"]
}) {
  if (!figures?.length) {
    return null
  }

  return (
    <ul className="mt-auto grid list-none grid-cols-2 gap-2.5 lg:flex lg:justify-between lg:gap-7.5">
      {figures.map((figure, index) => (
        <li
          key={figure.id}
          className={cn(
            "flex flex-col justify-center gap-2.5 overflow-hidden rounded-[20px] bg-white/20 px-5 py-4 backdrop-blur-md",
            "lg:h-34.25 lg:flex-row lg:items-center lg:gap-5 lg:rounded-[26px] lg:p-7.5",
            // The frame gives the last card the full width of the phone.
            index === figures.length - 1 && "max-lg:col-span-2"
          )}
        >
          <p className="text-brand-inverted shrink-0 text-[1.875rem]/[2.0625rem] font-semibold lg:text-[4.375rem]/[4.8125rem]">
            {figure.prefix}
            {figure.number}
            {figure.suffix}
          </p>
          <CkEditorRenderer
            htmlContent={figure.description}
            // The rich-text styles carry their own size and colour, so the
            // frame's have to be stated over them. The frame also sets each of
            // these labels on a single line and cuts the card to it, so on a
            // phone the label is held to one rather than folded.
            className="mb-0 lg:max-w-57.5 [&_p]:mb-0! [&_p]:text-base/5.5! [&_p]:text-inherit! max-lg:[&_p]:whitespace-nowrap lg:[&_p]:text-xl/7.5!"
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * The row that closes a photo hero: the specialties, ranged right against the
 * grid. It keeps the 200px the frame gives the row, which the clinic snapshot
 * used to set before that card was dropped. The phone frame carries no pills at
 * all, so on a phone the row is not there to hold a gap open.
 */
function BottomRow({
  serviceTags,
}: {
  readonly serviceTags: Data.Component<"sections.hero">["serviceTags"]
}) {
  return (
    <div className="hidden lg:flex lg:min-h-50 lg:items-center lg:justify-end">
      <ServiceTags
        serviceTags={serviceTags}
        isCentered={false}
        className="lg:max-w-156"
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
  fade,
}: {
  readonly image: Data.Component<"sections.hero">["backgroundImage"]
  readonly video: Data.Component<"sections.hero">["backgroundVideo"]
  /** True where the picture is the subject and carries no copy of its own. */
  readonly fade?: boolean
}) {
  return (
    // One positioned layer for the whole backdrop. The copy sits inside the
    // grid container, which is not positioned, so a `fill` image dropped
    // alongside it would reach past it to the frame — which is where we want it,
    // but only by accident, and Next says so. This layer is the frame's size on
    // purpose, and the wash and the clip stack inside it in source order.
    <div className="absolute inset-0 -z-10">
      {image && (
        <StrapiBasicImage
          component={image}
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      {video && (
        <BackgroundVideo
          src={formatStrapiMediaUrl(video.url)}
          // The photograph doubles as the clip's poster, so there is something
          // on screen while it loads and for anyone it never reaches.
          poster={formatStrapiMediaUrl(image?.media?.url)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div
        className={cn(
          "absolute inset-0",
          // Flat where words sit on the photograph, and a top-down fade where
          // the photograph is the subject — the frame draws both.
          fade
            ? "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),transparent)]"
            : "bg-black/40"
        )}
      />
    </div>
  )
}

/**
 * A photo hero runs edge to edge, as the design draws it — the copy still sits
 * on the 1320 grid, so the container moves inside. Every other hero is the
 * container itself.
 */
function Wrapper({
  hasBackground,
  hasBottomRow,
  hasTrail,
  isBarePhoto,
  children,
}: {
  readonly hasBackground: boolean
  readonly hasBottomRow: boolean
  readonly hasTrail: boolean
  readonly isBarePhoto: boolean
  readonly children: React.ReactNode
}) {
  if (!hasBackground) {
    return <Container className="flex flex-col">{children}</Container>
  }

  return (
    <PhotoHeroFrame>
      {/* The frame's own height, and — where a trail is drawn under it — the
          room the header takes out of that, since the header floats over the
          photograph rather than standing above it. */}
      <Container
        className={cn(
          "flex flex-col lg:min-h-217.5",
          hasTrail && "pt-15 lg:pt-26.5",
          // Every subpage's photo hero is the same height on a phone, whether
          // or not its copy fills it.
          hasTrail && !isBarePhoto && "max-lg:min-h-186.5",
          hasBottomRow && "min-h-200",
          isBarePhoto && "max-lg:min-h-112.5"
        )}
      >
        {children}
      </Container>
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

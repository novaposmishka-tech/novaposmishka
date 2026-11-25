import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { ImgproxyImage } from "@/components/elementary/images/ImgproxyImage"
import { isImgproxyEnabled } from "@/lib/imgproxy"
import { isOptimizedMedia } from "@/lib/optimized-media.mjs"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import type { StrapiImageMedia } from "@/types/api"
import type { ImageExtendedProps } from "@/types/next"

/** The largest file (in KB, as Strapi counts) sent to the optimizer. */
const MAX_OPTIMIZED_KB = 8 * 1024

export interface BasicImageProps extends Omit<
  ImageExtendedProps,
  "src" | "alt"
> {
  readonly component: Data.Component<"utilities.basic-image"> | undefined | null
  readonly className?: ImageExtendedProps["className"]
}

/**
 * Renders Strapi media from a `utilities.basic-image` component.
 *
 * Use this for CMS-managed images only. Use `StaticImage` for frontend-owned
 * assets from static imports or the public folder.
 *
 * Sizing follows `next/image`:
 * - pass `width`/`height` for fixed-ratio images; if one is missing, the other
 *   is derived from Strapi media metadata when possible.
 * - pass `fill` plus a positioned parent for cover/background-like images.
 * - pass `sizes` whenever a `fill` image is narrower than `100vw` at any
 *   breakpoint, so the browser chooses the right responsive candidate.
 * - use Tailwind classes for visual sizing (`h-10 w-auto`, `size-10`,
 *   `object-cover`, `object-contain`); `width`/`height` props are layout and
 *   optimizer hints, not a replacement for CSS sizing.
 *
 * Configuration:
 * - with `IMGPROXY_URL`, raster Strapi images use the imgproxy loader.
 * - without `IMGPROXY_URL`, raster images from the media bucket
 *   (`OPTIMIZED_MEDIA_HOSTS`) go through Next's optimizer, which serves them
 *   as AVIF/WebP at the width the screen needs.
 * - anything else (local Strapi uploads, other hosts) loads as it is.
 * - SVGs are never processed because they do not need raster resizing.
 */
export function StrapiBasicImage({
  component,
  className,
  ...imgProps
}: BasicImageProps) {
  const {
    fill,
    height: propHeight,
    style,
    width: propWidth,
    ...restImgProps
  } = imgProps
  const media: StrapiImageMedia = component?.media

  const src = formatStrapiMediaUrl(media?.url ?? component?.fallbackSrc)

  if (src == null) {
    return null
  }

  const alt = component?.alt ?? media?.caption ?? media?.alternativeText ?? ""

  const requestedWidth = propWidth ?? component?.width
  const requestedHeight = propHeight ?? component?.height
  const ratio = media?.width && media.height ? media.width / media.height : 0

  const width =
    requestedWidth ??
    (requestedHeight && ratio
      ? Math.round(Number(requestedHeight) * ratio)
      : media?.width)

  const height =
    requestedHeight ??
    (requestedWidth && ratio
      ? Math.round(Number(requestedWidth) / ratio)
      : media?.height)

  const useFill = fill || !width || !height
  // The optimizer refuses SVG, so one from a fallbackSrc or without `ext`
  // must be caught too.
  const isSvg =
    media?.ext === ".svg" ||
    media?.mime === "image/svg+xml" ||
    /\.svg$/i.test(src.split(/[?#]/, 1)[0] ?? "")
  const useImgproxy = isImgproxyEnabled() && !isSvg

  const imageProps = {
    className,
    src,
    alt,
    ...restImgProps,
    ...(useFill ? { fill: true as const } : { width, height }),
    // Keep visual sizing in Tailwind classes by default.
    // If this component should own rendered dimensions again, uncomment this
    // and explicit width/height props will override global image CSS:
    // style: {
    //   ...(!useFill && requestedWidth ? { width: requestedWidth } : {}),
    //   ...(!useFill && requestedHeight ? { height: requestedHeight } : {}),
    //   ...style,
    // },
    style,
  }

  if (useImgproxy) {
    return <ImgproxyImage {...imageProps} />
  }

  // Strapi gives the size in KB. A file past this is left as it is: the
  // optimizer refuses very large sources, and the image would break.
  const isHuge = (media?.size ?? 0) > MAX_OPTIMIZED_KB

  if (isSvg || isHuge || !isOptimizedMedia(src)) {
    return <Image {...imageProps} alt={alt} unoptimized />
  }

  return (
    <Image {...imageProps} src={versioned(src, media?.updatedAt)} alt={alt} />
  )
}

/**
 * The URL with the time the file last changed added to it. Strapi's "Replace
 * media" keeps the file's URL, and the optimizer keeps what it made for a URL
 * for a month (minimumCacheTTL), so without this a replaced photo would show
 * the old picture that long. The bucket ignores the query.
 */
function versioned(src: string, updatedAt: string | undefined) {
  if (!updatedAt) {
    return src
  }

  const url = new URL(src)
  // As Strapi wrote it: any change of it is a new URL, whatever its format.
  url.searchParams.set("v", updatedAt)

  return url.href
}

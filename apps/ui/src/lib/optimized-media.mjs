/**
 * Where the media Next's image optimizer may process comes from: the bucket
 * Strapi uploads to. Kept to this one host on purpose — every image the
 * optimizer makes counts against the hosting quota, and an open list would let
 * anyone run images from any site through it.
 *
 * Read by next.config.mjs (remotePatterns) and by StrapiBasicImage, which
 * loads media from anywhere else as it is.
 */
export const OPTIMIZED_MEDIA_HOSTS = [
  // The CDN in front of the bucket: what Strapi writes while CDN_URL is set.
  "novaposmishka-media.fra1.cdn.digitaloceanspaces.com",
  // The bucket itself: what it writes without CDN_URL.
  "novaposmishka-media.fra1.digitaloceanspaces.com",
]

/**
 * Whether the optimizer may process this image: an HTTPS URL on one of the
 * hosts above.
 *
 * @param {string} src
 */
export function isOptimizedMedia(src) {
  try {
    const url = new URL(src)

    return (
      url.protocol === "https:" && OPTIMIZED_MEDIA_HOSTS.includes(url.hostname)
    )
  } catch {
    return false
  }
}

/**
 * Uploads `seed/media/*` into the Strapi media library, once.
 *
 * The baseline content refers to images by file name (see `image()` in
 * seed/baseline/uk.mjs) rather than by id, because ids differ per database.
 * This resolves those names to the ids the content seed needs, uploading only
 * what is not in the library yet — re-running the seed does not pile up
 * duplicates, and a file an editor replaced through the admin panel keeps
 * whatever they put there.
 */

import fs from "node:fs"
import path from "node:path"

const MIME_BY_EXTENSION = {
  ".avif": "image/avif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
}

/**
 * @returns {Promise<Map<string, number>>} media name (file name without its
 * extension) to the id of the uploaded file.
 */
export async function ensureMedia(strapi, mediaDir, { log = () => {} } = {}) {
  const byName = new Map()

  if (!fs.existsSync(mediaDir)) {
    log("[seed:media] No seed/media directory; skipping.")

    return byName
  }

  const files = fs
    .readdirSync(mediaDir)
    .filter((file) => MIME_BY_EXTENSION[path.extname(file).toLowerCase()])

  if (files.length === 0) {
    log("[seed:media] seed/media is empty; skipping.")

    return byName
  }

  const uploadService = strapi.plugin("upload").service("upload")
  let uploaded = 0

  for (const file of files) {
    const name = path.basename(file, path.extname(file))
    const existing = await strapi
      .documents("plugin::upload.file")
      .findFirst({ filters: { name }, fields: ["id"] })

    if (existing) {
      byName.set(name, existing.id)
      continue
    }

    const filepath = path.join(mediaDir, file)
    const [created] = await uploadService.upload({
      data: { fileInfo: { name, folder: null } },
      files: {
        filepath,
        originalFilename: file,
        mimetype: MIME_BY_EXTENSION[path.extname(file).toLowerCase()],
        size: fs.statSync(filepath).size,
      },
    })

    byName.set(name, created.id)
    uploaded += 1
  }

  log(
    `[seed:media] ${byName.size} file(s) in the library, ${uploaded} newly uploaded.`
  )

  return byName
}

/**
 * Replaces every `image("name", "alt")` marker in the seed data with the
 * `utilities.basic-image` shape Strapi stores, now that the ids are known.
 *
 * Markers whose file is missing are dropped rather than written as a broken
 * reference: `basic-image.media` is required, so a null would fail the whole
 * document.
 */
export function resolveMediaMarkers(value, mediaByName, missing = new Set()) {
  if (Array.isArray(value)) {
    return value
      .map((item) => resolveMediaMarkers(item, mediaByName, missing))
      .filter((item) => item !== undefined)
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  if (typeof value.__media === "string") {
    const id = mediaByName.get(value.__media)

    if (id == null) {
      missing.add(value.__media)

      // Undefined, so the callers above drop the key or the array entry.
      return
    }

    return { media: id, alt: value.alt ?? null }
  }

  const out = {}
  for (const [key, item] of Object.entries(value)) {
    const resolved = resolveMediaMarkers(item, mediaByName, missing)
    if (resolved !== undefined) {
      out[key] = resolved
    }
  }

  return out
}

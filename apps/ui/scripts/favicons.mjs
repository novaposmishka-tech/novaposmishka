/**
 * Builds the site's favicons from the clinic's tooth mark.
 *
 * The mark is drawn as fine outlines, which dissolve when rasterised at 16 or
 * 32 pixels, so each small size gets a little extra stroke — just enough to
 * read as a tooth in a browser tab without changing its shape. The SVG stays
 * close to the artwork, and the touch icon sits on the brand's deep teal
 * because iOS paints transparency black.
 *
 * Run from the UI app: `pnpm favicons`
 */
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import sharp from "sharp"

const root = path.resolve(import.meta.dirname, "..")
const publicDir = path.join(root, "public")

const TEAL = "#1A7993"
const DEEP = "#062b35"
const WHITE = "#ffffff"

const markSvg = await readFile(
  path.join(publicDir, "images", "logo-mark.svg"),
  "utf8"
)
const markPaths = markSvg
  .match(/<path[\s\S]*?\/>/g)
  .map((p) => p.replace(/ fill="[^"]*"/, ""))
  .join("\n")

/** The mark alone, centred in a square, with an optional thickening stroke. */
const standalone = (stroke, color = TEAL) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <g transform="translate(0.4 1)" fill="${color}" stroke="${color}" stroke-width="${stroke}" stroke-linejoin="round">
${markPaths}
  </g>
</svg>
`

/** The mark in white on a deep-teal tile, for home screens. */
const tile = (stroke) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${DEEP}"/>
  <g transform="translate(12 13)" fill="${WHITE}" stroke="${WHITE}" stroke-width="${stroke}" stroke-linejoin="round">
${markPaths}
  </g>
</svg>
`

const rasterise = (svg, size) =>
  sharp(Buffer.from(svg), { density: 400 }).resize(size, size).png().toBuffer()

/** Packs PNG frames into an ICO container (the PNG-in-ICO form, as before). */
function ico(frames) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(frames.length, 4)

  const directory = Buffer.alloc(16 * frames.length)
  let offset = header.length + directory.length

  for (const [i, { size, png }] of frames.entries()) {
    const entry = i * 16
    directory.writeUInt8(size === 256 ? 0 : size, entry)
    directory.writeUInt8(size === 256 ? 0 : size, entry + 1)
    directory.writeUInt8(0, entry + 2)
    directory.writeUInt8(0, entry + 3)
    directory.writeUInt16LE(1, entry + 4)
    directory.writeUInt16LE(32, entry + 6)
    directory.writeUInt32LE(png.length, entry + 8)
    directory.writeUInt32LE(offset, entry + 12)
    offset += png.length
  }

  return Buffer.concat([header, directory, ...frames.map((f) => f.png)])
}

// Stroke widths measured by eye: the 16px frame needs the most help.
const icoFrames = await Promise.all(
  [
    [16, 1.4],
    [32, 0.8],
    [48, 0.5],
  ].map(async ([size, stroke]) => ({
    size,
    png: await rasterise(standalone(stroke), size),
  }))
)

await writeFile(path.join(publicDir, "favicon.ico"), ico(icoFrames))
await writeFile(path.join(publicDir, "favicon.svg"), standalone(0.6))
await writeFile(
  path.join(publicDir, "apple-touch-icon.png"),
  await rasterise(tile(0.6), 180)
)

console.warn("favicon.ico, favicon.svg, apple-touch-icon.png written")

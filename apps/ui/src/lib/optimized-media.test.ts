import { describe, expect, it } from "vitest"

import { isOptimizedMedia } from "./optimized-media.mjs"

describe("isOptimizedMedia", () => {
  it("accepts media from the bucket", () => {
    expect(
      isOptimizedMedia(
        "https://novaposmishka-media.fra1.cdn.digitaloceanspaces.com/photo_abc123.jpg"
      )
    ).toBe(true)
  })

  it("leaves local Strapi uploads and other hosts alone", () => {
    expect(isOptimizedMedia("http://127.0.0.1:1337/uploads/photo.jpg")).toBe(
      false
    )
    expect(isOptimizedMedia("https://example.com/photo.jpg")).toBe(false)
    expect(isOptimizedMedia("/uploads/photo.jpg")).toBe(false)
  })

  it("refuses the bucket over plain HTTP and hosts that only look like it", () => {
    /* eslint-disable unicorn/prefer-https -- the HTTP case is what is tested. */
    expect(
      isOptimizedMedia(
        "http://novaposmishka-media.fra1.cdn.digitaloceanspaces.com/photo.jpg"
      )
    ).toBe(false)
    /* eslint-enable unicorn/prefer-https */
    expect(
      isOptimizedMedia(
        "https://novaposmishka-media.fra1.cdn.digitaloceanspaces.com.evil.com/photo.jpg"
      )
    ).toBe(false)
    expect(
      isOptimizedMedia(
        "https://evil.com/novaposmishka-media.fra1.cdn.digitaloceanspaces.com/photo.jpg"
      )
    ).toBe(false)
  })

  it("matches the host whatever its case", () => {
    expect(
      isOptimizedMedia(
        "https://Novaposmishka-Media.fra1.cdn.digitaloceanspaces.com/photo.jpg"
      )
    ).toBe(true)
  })
})

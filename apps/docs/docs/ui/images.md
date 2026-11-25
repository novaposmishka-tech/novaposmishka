---
sidebar_position: 10
---

# Image Optimization

Each image source uses its own pipeline. Next.js's optimizer processes CMS images only from the media bucket listed in `apps/ui/src/lib/optimized-media.mjs` (`OPTIMIZED_MEDIA_HOSTS`): the site runs on Vercel, where the optimizer is Vercel's. Self-hosted Next can spike CPU/memory under CMS image traffic, so on a self-hosted deploy prefer imgproxy.

## Pipelines

Base path: `apps/ui/src/components`

| Source              | Component              | Optimizer                | When               |
| ------------------- | ---------------------- | ------------------------ | ------------------ |
| Strapi media        | `StrapiBasicImage.tsx` | imgproxy                 | `IMGPROXY_URL` set |
| Strapi media        | `StrapiBasicImage`     | Next.js (AVIF/WebP)      | media bucket host  |
| Strapi media        | `StrapiBasicImage`     | none — direct Strapi URL | local/other hosts  |
| Local/static assets | `StaticImage.tsx`      | Next.js Sharp            | always             |

:::warning Do not disable images globally
Do not set `images.unoptimized: true` globally in `next.config.mjs`. That overrides per-component `unoptimized={false}` and breaks `StaticImage` optimization. Leave the global flag unset.
:::

## `StrapiBasicImage`

Use for any Strapi images. It:

- Resolves Strapi media data → normalized URL via `formatStrapiMediaUrl()`
- Calculates missing width/height from the media aspect ratio
- Never processes SVGs (by `ext`, `mime` or a `.svg` URL)

`formatStrapiMediaUrl()` returns absolute storage URLs as-is. Relative local Strapi paths such as `/uploads/...` are resolved with `STRAPI_URL` on the server and the local Strapi origin on the client during development.

When `IMGPROXY_URL` is set, it delegates to `ImgproxyImage`. Next.js generates responsive `srcSet` from `deviceSizes`; the loader rewrites each entry into an imgproxy URL:

```text
https://imgproxy.example.com/rs:fit:768:0/plain/{source}@webp
```

When `IMGPROXY_URL` is **not** set, an image from a host in `OPTIMIZED_MEDIA_HOSTS` goes through Next's optimizer, which serves it as AVIF or WebP at the width the screen needs. Any other image (local `/uploads`, other hosts) renders as `<Image unoptimized />` and the browser fetches the original.

Optimized URLs carry the file's `updatedAt` as `?v=`: Strapi's "Replace media" keeps the URL, and the optimizer keeps its result for a URL as long as `minimumCacheTTL` (31 days), so without it a replaced photo would show the old picture.

`remotePatterns` lists only `OPTIMIZED_MEDIA_HOSTS`: any host listed there can be run through the optimizer by anyone, at the hosting quota's cost. A remote URL passed to `next/image` without `unoptimized` must come from that list, or Next throws "hostname is not configured". If the media bucket moves, change the host in `optimized-media.mjs`.

```tsx
<StrapiBasicImage component={component.image} className="h-auto w-full" />

<StrapiBasicImage
  component={component.image}
  fill
  sizes="100vw"
  className="object-cover"
/>
```

### `sizes` prop

Tells the browser the image's display width before load. Combined with viewport + DPR to pick the smallest useful `srcSet` candidate.

With imgproxy enabled and `deviceSizes: [420, 768, 1024, 1440, 2048]`, an image full-width on mobile and half-width on desktop:

```tsx
<StrapiBasicImage
  component={image}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

Browser picks:

| Device  | Viewport | DPR | Display size | Picked width |
| ------- | -------- | --- | ------------ | ------------ |
| Mobile  | 420      | 2×  | 420 × 2      | `1024w`      |
| Tablet  | 768      | 1×  | 768 × 1      | `768w`       |
| Desktop | 1440     | 1×  | 720 × 1      | `768w`       |
| Desktop | 1440     | 2×  | 720 × 2      | `1440w`      |

:::tip Rule of thumb
If an image uses `fill` and isn't full-width at every breakpoint, pass `sizes`. Otherwise the browser defaults to `100vw` and over-fetches.
:::

Common values:

| Scenario                          | `sizes`                          |
| --------------------------------- | -------------------------------- |
| Full-width hero                   | `100vw`                          |
| Half-width desktop                | `(max-width: 768px) 100vw, 50vw` |
| Three-column grid                 | `(max-width: 768px) 100vw, 33vw` |
| Fixed logo/avatar                 | `200px`                          |
| Fixed `width`/`height`, no `fill` | optional                         |

## `StaticImage`

Use for UI-owned images — static imports or files in `public/`. These can use Next's Sharp optimizer because traffic volume is controlled. Do not pass remote URLs: `remotePatterns` allows only the media bucket, so use `StrapiBasicImage` for CMS media.

```tsx
import campusPhoto from "@/assets/campus.jpg"
import { StaticImage } from "@/components/elementary/images/StaticImage"

<StaticImage src={campusPhoto} alt="Campus" sizes="100vw" />
<StaticImage src="/images/logo.png" alt="Logo" width={200} height={50} />
```

## Local imgproxy

Set `IMGPROXY_URL` **only** when an imgproxy service is reachable. Otherwise the image component falls back to direct Strapi URLs.

```env
IMGPROXY_URL=https://imgproxy.example.com
```

To run imgproxy locally (from monorepo root):

```bash
pnpm run:imgproxy
```

Then:

```env
IMGPROXY_URL=http://localhost:8080
```

## Configuration Reference

Image settings in `apps/ui/next.config.mjs`:

| Setting           | Value                          | Purpose                                             |
| ----------------- | ------------------------------ | --------------------------------------------------- |
| `unoptimized`     | unset globally                 | each component controls its own pipeline            |
| `deviceSizes`     | `[420, 768, 1024, 1440, 2048]` | responsive widths for every pipeline                |
| `formats`         | `["image/avif", "image/webp"]` | Next optimizer output; the browser's `Accept` picks |
| `minimumCacheTTL` | 31 days                        | each remake costs quota; `?v=updatedAt` busts it    |
| `remotePatterns`  | `OPTIMIZED_MEDIA_HOSTS`        | only the media bucket may be optimized              |

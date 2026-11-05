import type { NextRequest, NextResponse } from "next/server"

import { STRAPI_PREVIEW_FRAME_COOKIE } from "@/lib/constants"
import { getEnvVar } from "@/lib/env-vars"

/**
 * Space-separated origins for CSP `frame-ancestors`, built from runtime env.
 *
 * Includes STRAPI_URL so the Strapi admin can iframe this app for live preview.
 * Handles the localhost ↔ 127.0.0.1 alias (distinct origins; dev often mixes them).
 *
 * Read at request time on purpose: STRAPI_URL is a runtime env var injected into
 * the container, but `next.config` headers() are evaluated at build time (where it
 * is undefined). Setting the CSP here in the proxy is the only place it reflects
 * the real runtime value.
 */
function frameAncestorsFromEnv(): string | null {
  const origins: string[] = []

  for (const raw of [getEnvVar("STRAPI_URL")]) {
    if (!raw) continue

    let u: URL
    try {
      u = new URL(raw)
    } catch {
      continue // skip malformed URLs
    }

    origins.push(u.origin)

    if (u.hostname === "127.0.0.1" || u.hostname === "localhost") {
      const port = u.port ? `:${u.port}` : ""
      const altHost = u.hostname === "127.0.0.1" ? "localhost" : "127.0.0.1"
      origins.push(`${u.protocol}//${altHost}${port}`)
    }
  }

  const unique = [...new Set(origins)]

  return unique.length > 0 ? unique.join(" ") : null
}

/**
 * Builds the Content-Security-Policy.
 *
 * The baseline below is intentionally strict — it only allows this app's own
 * origin plus Strapi media over HTTPS. If you add third-party scripts/services
 * (analytics, tag managers, embeds, captchas), allowlist their origins in the
 * relevant directive. Commented examples for a Google Tag Manager / Analytics /
 * Ads setup are left inline as a starting point — uncomment and adjust as needed.
 */
function buildCsp({
  frameAncestors,
  isLocalhostUi,
}: {
  frameAncestors: string | null
  isLocalhostUi: boolean
}): string {
  const isDevelopment = getEnvVar("NODE_ENV") === "development"
  const allowLocalStrapiMedia = isDevelopment || isLocalhostUi

  return [
    "default-src 'self'",
    [
      "script-src 'self' 'unsafe-inline'",
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      // Google Tag Manager and the GA4 tag it loads; Tag Manager's preview
      // mode, which is how a container is checked before it is published,
      // loads its own script from tagmanager.google.com.
      "https://www.googletagmanager.com",
      "https://tagmanager.google.com",
      "https://www.google-analytics.com",
      // Example — Google Ads (uncomment if used):
      // "https://www.googleadservices.com",
      // "https://pagead2.googlesyndication.com",
      // "https://googleads.g.doubleclick.net",
    ].join(" "),
    // Tag Manager's preview panel brings its own stylesheet and font.
    "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com",
    // imgproxy, blob storage and Strapi media are all served over HTTPS.
    [
      "img-src 'self' data: blob: https:",
      ...(allowLocalStrapiMedia ? ["http://127.0.0.1:1337"] : []),
    ].join(" "),
    "font-src 'self' data: https://fonts.gstatic.com",
    [
      "connect-src 'self'",
      // Where GA4 sends its hits, by region, and Tag Manager's preview link.
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.googletagmanager.com",
      // Example — Google Ads (uncomment if used):
      // "https://www.googleadservices.com",
      // "https://pagead2.googlesyndication.com",
      // "https://*.doubleclick.net",
      // "https://www.google.com",
    ].join(" "),
    // The contact page frames a Google map, and Tag Manager frames itself for
    // visitors without JavaScript. Named exactly, not a wildcard.
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com",
    "worker-src 'self' blob:",
    [
      "media-src 'self' blob: https:",
      ...(allowLocalStrapiMedia ? ["http://127.0.0.1:1337"] : []),
    ].join(" "),
    "object-src 'none'",
    frameAncestors
      ? `frame-ancestors ${frameAncestors}`
      : "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")
}

/**
 * Applies the runtime-dependent security headers to the response:
 * `Content-Security-Policy` (with a runtime `frame-ancestors`) and the
 * conditional `X-Frame-Options`.
 *
 * The static headers (HSTS, X-Content-Type-Options, Referrer-Policy,
 * Permissions-Policy) are set in `next.config` for all routes.
 */
export function withSecurityHeaders(
  req: NextRequest,
  res: NextResponse
): NextResponse {
  // Expose the Strapi origin only after a valid /API/preview flow; public
  // traffic gets frame-ancestors 'none' and never sees STRAPI_URL.
  const isPreview = req.cookies.has(STRAPI_PREVIEW_FRAME_COOKIE)
  const frameAncestors = isPreview ? frameAncestorsFromEnv() : null
  const isLocalhostUi = ["localhost", "127.0.0.1", "::1"].includes(
    req.nextUrl.hostname
  )

  res.headers.set(
    "Content-Security-Policy",
    buildCsp({ frameAncestors, isLocalhostUi })
  )

  // When Strapi preview iframes this app, modern browsers honor frame-ancestors
  // and ignore XFO. Only send DENY when framing is disallowed.
  if (!frameAncestors) {
    res.headers.set("X-Frame-Options", "DENY")
  }

  // A preview response carries frame-ancestors = STRAPI_URL. It must never be
  // stored in a shared cache (a CDN keys by URL, not cookie) — else it gets
  // served to the public and leaks STRAPI_URL. The public, non-preview variant
  // stays cacheable. A fronting CDN must also be configured to bypass cache
  // when the preview cookie is present so previewers reach the origin.
  if (isPreview) {
    res.headers.set("Cache-Control", "private, no-store")
  }

  return res
}

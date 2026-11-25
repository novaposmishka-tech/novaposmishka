import { withSentryConfig } from "@sentry/nextjs"
import plugin from "next-intl/plugin"

import { env } from "./src/env.mjs"
import { OPTIMIZED_MEDIA_HOSTS } from "./src/lib/optimized-media.mjs"

const withNextIntl = plugin("./src/lib/i18n.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: env.NEXT_OUTPUT,
  reactStrictMode: true,
  devIndicators: {
    position: "bottom-right",
  },
  // Enable cacheComponents when caching strategy is introduced
  // cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
  transpilePackages: ["@repo/design-system"],
  // pino (via @repo/logging) relies on Node internals / worker threads that
  // must not be bundled by the server compiler.
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    // See apps/UI/README.md#image-optimization for the full policy.
    // Keep global optimization enabled so components can opt in/out.
    // Do not set `unoptimized: true` globally: Next.js applies it to every
    // image and component-level `unoptimized={false}` cannot re-enable loaders.
    //
    // Image ownership in this app:
    // - Strapi media + IMGPROXY_URL: StrapiBasicImage uses imgproxy URLs.
    //   Next generates responsive srcsets, but imgproxy does the processing.
    // - Strapi media from the media bucket without IMGPROXY_URL: Next's
    //   optimizer (on Vercel, Vercel's) serves it as AVIF/WebP per width.
    // - Other Strapi media (local uploads, other hosts): loaded as it is.
    // - StaticImage: uses Next's Sharp optimizer for local/static assets.
    // unoptimized: true,

    // AVIF first, WebP for browsers without it: the browser's Accept header
    // picks one, so each image is made in the format browsers ask for.
    formats: ["image/avif", "image/webp"],

    // How long a processed image is kept before it is made again; every remake
    // counts against the host's quota. Strapi's "Replace media" keeps a file's
    // URL, so StrapiBasicImage adds the file's updatedAt to it (`?v=`): a
    // replaced photo is a new URL and shows at once.
    minimumCacheTTL: 60 * 60 * 24 * 31, // 31 days

    // Widths for generated srcsets. With imgproxy these become external
    // imgproxy URLs; otherwise Next's optimizer makes them.
    // Covers: mobile 1x (420), tablet (768), desktop 1x (1024),
    // large desktop / mobile 2x (1440), desktop 2x retina (2048).
    deviceSizes: [420, 768, 1024, 1440, 2048],

    // Only the media bucket: any host listed here can be run through the
    // optimizer by anyone, at our quota's cost.
    remotePatterns: OPTIMIZED_MEDIA_HOSTS.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },

  // Static, build-time-constant security headers applied to every route.
  // Runtime-dependent headers (Content-Security-Policy with `frame-ancestors`,
  // and the conditional X-Frame-Options) are set in the proxy instead —
  // see apps/UI/src/lib/proxies/securityHeaders.ts.
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],

  // Turbopack configuration (replaces webpack config)
  // Turbopack has built-in intelligent caching, so no manual cache configuration needed
  // Note: Custom webpack loaders/plugins are not supported in Turbopack
}

const withConfig = (() => {
  let config = withNextIntl(nextConfig)

  config = withSentryConfig(config, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Pass org, project and auth token to be able to upload source maps
    org: env.SENTRY_ORG,
    project: env.SENTRY_PROJECT,
    authToken: env.SENTRY_AUTH_TOKEN,

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // sourcemaps: {
    //   // To disable sourcemap plugin, set this to true
    //   disable: true
    // }

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  })

  return config
})()

export default withConfig

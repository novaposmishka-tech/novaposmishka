import { normalizeCachePath } from "@repo/shared-data"

import { logger } from "../../../utils/logging"

export type RevalidationConfig = {
  clientUrl: string
  secret: string
}

export const getNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : undefined
}

type SecretEnvVar = "STRAPI_REVALIDATE_SECRET"

/**
 * Reads the env configuration for a UI-bound call: the frontend base URL plus
 * the bearer secret read from `secretVar`. Throws when either is missing —
 * without them the request cannot reach the UI or authenticate against it.
 */
function readClientCallConfig(secretVar: SecretEnvVar): RevalidationConfig {
  const clientUrl = process.env.CLIENT_URL
  const secret = process.env[secretVar]

  if (!clientUrl || !secret) {
    logger.error("UI call configuration is missing", {
      hasClientUrl: Boolean(clientUrl),
      hasSecret: Boolean(secret),
      secretVar,
    })

    throw new Error(
      `Revalidation configuration missing. Ensure CLIENT_URL and ${secretVar} are set.`
    )
  }

  return { clientUrl, secret }
}

/** Config for the Strapi → UI cache revalidation call. */
export const readRevalidationConfig = (): RevalidationConfig =>
  readClientCallConfig("STRAPI_REVALIDATE_SECRET")

/**
 * Trims, drops empty entries, and deduplicates a list of path strings, then
 * normalizes each via the shared `normalizeCachePath` (wildcards preserved,
 * concrete paths canonicalized). Pass `locale` when the call site knows which
 * locale the paths belong to.
 */
export function normalizeFullPaths(
  rawPaths: Iterable<string>,
  locale?: string
): string[] {
  return [
    ...new Set(
      [...rawPaths]
        .map((path) => (typeof path === "string" ? path.trim() : ""))
        .filter((path) => path.length > 0)
        .map((path) => normalizeCachePath(path, locale))
    ),
  ]
}

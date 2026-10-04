import type { UID } from "@strapi/strapi"

import { microsoftSSOProvider } from "./auth-providers"
import type { StrapiPreviewConfig } from "../types/internals"

export default ({ env }) => {
  const strapiPreviewConfig: StrapiPreviewConfig = {
    enabled: env("STRAPI_PREVIEW_ENABLED") === "true",
    previewSecret: env("STRAPI_PREVIEW_SECRET"),
    clientUrl: env("CLIENT_URL"),
    enabledContentTypeUids: ["api::page.page"],
  }

  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
      providers: [microsoftSSOProvider(env)].filter(Boolean),
      // The admin panel logs out when the access token expires, and only an
      // API call that meets a 401 renews it — so an editor who stops for the
      // token's lifespan is signed out, even mid-form. Strapi's half hour
      // was doing that several times a day. A working day instead, and a
      // session that closes after a day in any case.
      sessions: {
        accessTokenLifespan: env.int(
          "ADMIN_ACCESS_TOKEN_LIFESPAN",
          12 * 60 * 60
        ),
        idleSessionLifespan: env.int(
          "ADMIN_IDLE_SESSION_LIFESPAN",
          12 * 60 * 60
        ),
        maxSessionLifespan: env.int("ADMIN_MAX_SESSION_LIFESPAN", 24 * 60 * 60),
      },
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    preview: {
      enabled: strapiPreviewConfig.enabled,
      config: {
        allowedOrigins: env("CLIENT_URL"),
        handler: async (
          uid: UID.CollectionType,
          { documentId, locale, status }
        ) => {
          // Fetch the complete document from Strapi
          if (
            !strapiPreviewConfig.enabledContentTypeUids.includes(uid) ||
            typeof strapiPreviewConfig.previewSecret !== "string" ||
            typeof strapiPreviewConfig.clientUrl !== "string"
          ) {
            return null
          }
          const document = await strapi
            .documents(uid)
            .findOne({ documentId, locale })
          const pathname = (document as { fullPath?: string })?.fullPath // not all collections have the fullPath attribute
          // Disable preview if the pathname is not found
          if (!pathname) {
            return null // returning null diables the preview button in the UI
          }
          // Use Next.js draft mode passing it a secret key and the content-type status
          const urlSearchParams = new URLSearchParams({
            url: pathname,
            locale,
            secret: strapiPreviewConfig.previewSecret,
            status,
          })

          return `${strapiPreviewConfig.clientUrl}/api/preview?${urlSearchParams}`
        },
      },
    },
    watchIgnoreFiles: ["**/config/sync/**"],
  }
}

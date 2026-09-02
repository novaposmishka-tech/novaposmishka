import type { UID } from "@strapi/strapi"
import { z } from "zod"

import { logger } from "../../../utils/logging"
import { validateAdminToken } from "../../../utils/validate-admin-token"

export default {
  async run(ctx) {
    const headers = ctx.request.headers
    const validation = await validateAdminToken(strapi, headers)

    if (validation.valid === false) {
      logger.warn("Manual revalidation rejected because admin token is invalid")

      return ctx.forbidden(validation.error)
    }

    const parsedBody = revalidateBodySchema.safeParse(ctx.request.body)
    if (!parsedBody.success) {
      logger.warn("Manual revalidation rejected because payload is invalid", {
        issue: parsedBody.error.issues[0]?.message,
      })

      return ctx.badRequest(
        parsedBody.error.issues[0]?.message ?? "Invalid payload."
      )
    }

    const { uid, fullPaths, locale, tags } = parsedBody.data
    const result = await strapi.service("api::revalidate.revalidate").run({
      uid: uid as UID.ContentType,
      fullPaths,
      locale,
      tags,
    })

    ctx.body = result

    return result
  },
}

const nonEmptyStringArray = z
  .array(z.string())
  .optional()
  .default([])
  .transform((values) =>
    values.map((value) => value.trim()).filter((value) => value.length > 0)
  )

const revalidateBodySchema = z
  .object({
    uid: z.string().trim().min(1, "Missing uid."),
    fullPaths: nonEmptyStringArray,
    locale: z
      .string()
      .nullish()
      .transform((value) => value?.trim() ?? undefined),
    tags: nonEmptyStringArray,
  })
  .superRefine((value, ctx) => {
    if (value.fullPaths.length === 0 && value.tags.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide fullPaths or tags.",
        path: ["fullPaths"],
      })
    }
  })

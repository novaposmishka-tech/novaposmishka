import "server-only"

import type { Locale } from "next-intl"
import { use } from "react"

import { JsonLd } from "@/components/page-builder/components/seo-utilities/JsonLd"
import { getEnvVar } from "@/lib/env-vars"
import { clinicSchema, profileLinks } from "@/lib/metadata/clinic"
import { fetchFooter } from "@/lib/strapi-api/content/server"

/**
 * The clinic and the site in schema.org terms, on every page: the same
 * request the footer makes, answered from Next's cache.
 */
export function ClinicStructuredData({ locale }: { readonly locale: Locale }) {
  const footer = use(fetchFooter(locale))?.data
  const baseUrl = getEnvVar("APP_PUBLIC_URL")

  if (!footer || !baseUrl) {
    return null
  }

  const contacts = footer.contacts ?? []
  const valuesOf = (kind: string) =>
    contacts
      .find((contact) => contact.kind === kind)
      ?.values?.map((value) => value.text?.trim())
      .filter((text): text is string => Boolean(text)) ?? []

  const schema = clinicSchema({
    baseUrl,
    phones: valuesOf("phone"),
    email: valuesOf("email")[0],
    description: footer.description,
    sameAs: profileLinks((footer.socials ?? []).map((social) => social.href)),
  })

  return <JsonLd schema={schema} />
}

export default ClinicStructuredData

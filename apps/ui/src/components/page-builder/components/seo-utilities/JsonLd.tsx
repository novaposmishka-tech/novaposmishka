import { jsonLdText } from "@/lib/metadata/json-ld"

/**
 * A schema.org object as a JSON-LD script tag. Every "<" is written as its
 * JSON escape, so text an editor typed (a doctor's name, an answer) can never
 * close the tag early, whatever it holds.
 *
 * A plain `script`, not next/script: Next's would either keep the first
 * page's content on client navigation (with an id) or pile up copies
 * (without one).
 */
export function JsonLd({ schema }: { readonly schema: object }) {
  return <script type="application/ld+json">{jsonLdText(schema)}</script>
}

export default JsonLd

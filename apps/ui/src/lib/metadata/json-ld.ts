/**
 * "<" as JSON writes it escaped: a backslash, then "u003c". Built from the
 * backslash's code point so no tool along the way can unescape it to "<".
 */
const ESCAPED_LT = String.fromCodePoint(92) + "u003c"

/**
 * A schema.org object as the text of a JSON-LD script tag. Every "<" is
 * written as its JSON escape, so text an editor typed (a doctor's name, an
 * answer) can never close the tag early, whatever it holds, and the JSON reads
 * back the same.
 */
export function jsonLdText(schema: unknown) {
  return JSON.stringify(schema).replaceAll("<", () => ESCAPED_LT)
}

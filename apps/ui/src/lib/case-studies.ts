/**
 * The anchor a case study section gets, derived from its title.
 *
 * It lives here rather than beside the section component because the filter
 * chips need it too, and those are client-side: importing it from the section
 * would pull `server-only` into the browser bundle.
 */
export function caseStudyId(title: string | null | undefined) {
  return (
    "case-" +
    encodeURIComponent((title ?? "").toLowerCase().replaceAll(" ", "-"))
  )
}

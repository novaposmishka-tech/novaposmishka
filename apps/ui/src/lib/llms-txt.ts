/**
 * The site described for a language model, as the llms.txt proposal lays a
 * file out (https://llmstxt.org): the clinic's name as the heading, a line
 * about it as the quote, then its pages as lists of links under headings of
 * their own.
 *
 * This is the text alone, built from plain data, so it can be tested without
 * Strapi; the route at /llms.txt gathers the data.
 */

export interface LlmsPage {
  /** The page's path on the site: "/", "/poslugy/terapiia". */
  readonly path: string
  /** Its absolute address. */
  readonly url: string
  readonly title: string
  readonly description?: string | null
}

export interface LlmsContact {
  readonly label: string
  readonly lines: readonly string[]
}

export interface LlmsInput {
  readonly name: string
  /** One sentence about the clinic; the homepage's description. */
  readonly summary?: string | null
  readonly contacts: readonly LlmsContact[]
  /** Every published page, in the order the CMS keeps them. */
  readonly pages: readonly LlmsPage[]
  readonly labels: {
    readonly contacts: string
    /** The heading over pages that stand on their own. */
    readonly other: string
  }
}

const segments = (path: string) => path.split("/").filter(Boolean)

/**
 * Builds the file.
 *
 * A page with pages under it heads a section of its own — the services
 * index, with each direction and, indented under it, the direction's
 * sub-services. A page with nothing under it goes in a closing section of
 * the rest. The homepage is the file's heading, so it is not listed.
 *
 * A page hangs under the nearest page above it that is listed. Where its own
 * parent is missing — unpublished, or kept out of search — it moves up to the
 * next one, or to the top, rather than dropping out of the file.
 */
export function buildLlmsTxt({
  name,
  summary,
  contacts,
  pages,
  labels,
}: LlmsInput): string {
  const listed = pages.filter((page) => segments(page.path).length > 0)
  const children = childrenByParent(listed)
  const childrenOf = (page: LlmsPage) => children.get(page.path) ?? []

  // Each page followed by its own children, so a sub-service stands under
  // its direction whatever order the pages were created in.
  const branch = (page: LlmsPage, level: number): string[] => [
    link(page, level),
    ...childrenOf(page).flatMap((child) => branch(child, level + 1)),
  ]

  const out: string[] = [`# ${name}`]

  if (summary) {
    out.push("", `> ${oneLine(summary)}`)
  }

  const contactLines = contacts
    .filter((contact) => contact.lines.length > 0)
    .map(
      (contact) =>
        `- ${escapeText(stripColon(contact.label))}: ${escapeText(contact.lines.map(clause).join(", "))}`
    )
  if (contactLines.length > 0) {
    out.push("", `## ${labels.contacts}`, "", ...contactLines)
  }

  const standalone: LlmsPage[] = []
  for (const page of children.get(TOP) ?? []) {
    const under = childrenOf(page)

    if (under.length === 0) {
      standalone.push(page)
      continue
    }

    // A direction sits level with the index's own line, and its
    // sub-services one step in.
    out.push(
      "",
      `## ${escapeText(oneLine(page.title))}`,
      "",
      link(page, 0),
      ...under.flatMap((child) => branch(child, 0))
    )
  }

  if (standalone.length > 0) {
    out.push("", `## ${labels.other}`, "", ...standalone.map((p) => link(p, 0)))
  }

  return out.join("\n") + "\n"
}

/** The key the pages with no listed page above them are grouped under. */
const TOP = ""

/**
 * The pages grouped by the path of the nearest listed page above them, each
 * group in the order the pages came in. One pass over the list, with a
 * lookup per ancestor, rather than a scan of the whole list per page.
 */
function childrenByParent(pages: readonly LlmsPage[]) {
  const paths = new Set(pages.map((page) => page.path))
  const groups = new Map<string, LlmsPage[]>()

  for (const page of pages) {
    const parent = nearestListedAncestor(page.path, paths)
    const group = groups.get(parent)
    if (group) {
      group.push(page)
    } else {
      groups.set(parent, [page])
    }
  }

  return groups
}

/** The path of the nearest page above `path` that is listed, or TOP. */
function nearestListedAncestor(path: string, listed: ReadonlySet<string>) {
  const parts = segments(path)

  for (let length = parts.length - 1; length > 0; length--) {
    const candidate = "/" + parts.slice(0, length).join("/")

    if (listed.has(candidate)) {
      return candidate
    }
  }

  return TOP
}

function link(page: LlmsPage, depth: number) {
  const indent = "  ".repeat(Math.max(0, depth))
  const description = page.description
    ? `: ${escapeText(oneLine(page.description))}`
    : ""

  return `${indent}- [${escapeText(oneLine(page.title))}](${escapeUrl(page.url)})${description}`
}

/** Text from the CMS may carry line breaks; a list item is one line. */
const oneLine = (text: string) => text.replaceAll(/\s+/g, " ").trim()

/**
 * A line of a contact, ready to be joined to the next with a comma: the
 * footer breaks the address after "м. Житомир," and the comma it keeps
 * there would double.
 */
const clause = (text: string) => oneLine(text).replace(/[,;]$/, "")

/** The footer writes its labels with a colon after them: "Телефон:". */
const stripColon = (text: string) => oneLine(text).replace(/:$/, "")

/**
 * CMS text as plain words in Markdown: square brackets would open or close
 * a link, and a backslash would escape whatever follows it.
 */
const escapeText = (text: string) =>
  text.replaceAll(/[\\[\]]/g, (char) => `\\${char}`)

/**
 * An address as a Markdown link's target, which ends at the first space or
 * unmatched parenthesis. Encoding those keeps it one target.
 */
const escapeUrl = (url: string) =>
  url.replaceAll(" ", "%20").replaceAll("(", "%28").replaceAll(")", "%29")

import type { Data } from "@repo/strapi-types"
import type React from "react"

export type ServiceIconName = NonNullable<
  Data.Component<"shared.icon-card">["icon"]
>

/**
 * The line of the drawings, the teal that marks what a drawing is about, and
 * the red of something that hurts. They are the brand's own, read off the
 * theme, so the icons follow it if it is ever retuned.
 */
const LINE = "var(--color-brand-light)"
const ACCENT = "var(--color-brand-teal)"
const ALERT = "var(--color-brand-danger)"
const BLUSH = "#f9d9d6"

/** The outline every tooth in the set is drawn from. */
const TOOTH =
  "M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 5 2 8 .4 2.5 1 5.5 2.5 5.5s1.6-3 2.5-5c.4-1 1.2-1 2 0 .9 2 1 5 2.5 5s2.1-3 2.5-5.5c.5-3 2-5 2-8C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z"

const tooth = (extra?: React.ReactNode, fill = "#fff") => (
  <>
    <path d={TOOTH} fill={fill} />
    {extra}
  </>
)

/**
 * What a patient notices, one small drawing each. They sit on a slightly
 * wider box than the rest — a tooth with a mark over its crown needs the
 * room above it.
 */
const SIGNS: Record<string, React.ReactNode> = {
  tooth: tooth(<path d="m9 10 2 2 4-4" stroke={ACCENT} strokeWidth="2" />),
  pain: tooth(<path d="m13 6-3 4h4l-3 4" stroke={ALERT} strokeWidth="2" />),
  bite: tooth(
    <path d="M12 -1v3M9.5 0.5 12 3l2.5-2.5" stroke={ALERT} strokeWidth="2" />
  ),
  cold: (
    <>
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
      <path
        d="m9 4 3 2 3-2M9 20l3-2 3 2M4 10.5l3.4-.4L6 7M20 13.5l-3.4.4L18 17M4 13.5l3.4.4L6 17M20 10.5l-3.4-.4L18 7"
        stroke={ACCENT}
      />
    </>
  ),
  spot: tooth(
    <>
      <circle cx="9" cy="8" r="1.6" fill={LINE} stroke="none" />
      <circle cx="14.5" cy="10" r="1.1" fill={LINE} stroke="none" />
    </>
  ),
  food: tooth(<path d="M12 4v6" stroke={ACCENT} strokeWidth="2.2" />),
  smell: (
    <path
      d="M4 9c2-2 4 2 6 0s4 2 6 0 3 1 4 0M4 14c2-2 4 2 6 0s4 2 6 0 3 1 4 0M6 19c2-2 4 2 6 0s4 2 6 0"
      stroke={ACCENT}
    />
  ),
  swell: (
    <>
      <path d="M3 15c3-6 5 0 9-6 4 6 6 0 9 6" />
      <circle cx="12" cy="8" r="3.2" fill={BLUSH} stroke={ALERT} />
      <path d="M3 15v4h18v-4" />
    </>
  ),
  dark: (
    <>
      <defs>
        <linearGradient id="service-icon-half" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="0.5" stopColor="#c9b48a" />
        </linearGradient>
      </defs>
      {tooth(undefined, "url(#service-icon-half)")}
    </>
  ),
  drop: (
    <>
      <path d="M3 17c3-5 5 0 9-5 4 5 6 0 9 5v3H3z" fill="#fff" />
      <path
        d="M12 2.5s-3.5 4-3.5 6.5a3.5 3.5 0 0 0 7 0c0-2.5-3.5-6.5-3.5-6.5z"
        fill={BLUSH}
        stroke={ALERT}
      />
    </>
  ),
  recession: tooth(<path d="M4 14c3 2 5 0 8 2s5 0 8-2" stroke={ALERT} />),
  mobile: tooth(
    <path
      d="M1 9l1.5 1.5L1 12M23 9l-1.5 1.5L23 12"
      stroke={ACCENT}
      strokeWidth="2"
    />
  ),
  crooked: (
    <>
      <path d="M3 7l3-2 3 3 3-3 3 3 3-2 3 2M3 17l3 2 3-3 3 3 3-3 3 2 3-2" />
      <path d="M8 12h8" stroke={ACCENT} strokeWidth="2" />
    </>
  ),
  gap: (
    <>
      <rect x="2.5" y="5" width="7.5" height="14" rx="3" fill="#fff" />
      <rect x="14" y="5" width="7.5" height="14" rx="3" fill="#fff" />
      <path d="M11 12h2" stroke={ACCENT} strokeWidth="2" />
    </>
  ),
  click: (
    <>
      <path d="M5 9c0-3 3-6 7-6s7 3 7 6v2c0 4-3 8-7 8s-7-4-7-8z" fill="#fff" />
      <path d="M8 14c1.5 1.5 6.5 1.5 8 0" />
      <path
        d="M1.5 8.5 3 10M1 12.5h2M22.5 8.5 21 10M23 12.5h-2"
        stroke={ACCENT}
        strokeWidth="2"
      />
    </>
  ),
  head: (
    <>
      <circle cx="12" cy="10" r="7" fill="#fff" />
      <path d="M9 17v4h6v-4" />
      <path d="m10 6 2 3-2 2 2 2" stroke={ALERT} strokeWidth="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" fill="#fff" />
      <path d="M12 7v5l3.5 2" stroke={ACCENT} strokeWidth="2" />
    </>
  ),
  sparkle: tooth(
    <path
      d="M19 1v4M17 3h4M3 15v3M1.5 16.5h3"
      stroke={ACCENT}
      strokeWidth="1.8"
    />
  ),
  cup: (
    <>
      <path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="#fff" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path
        d="M8 2.5c-1 1.2 1 1.8 0 3M12 2.5c-1 1.2 1 1.8 0 3"
        stroke={ACCENT}
      />
    </>
  ),
  child: (
    <>
      <circle cx="12" cy="12" r="9" fill="#fff" />
      <circle cx="9" cy="10" r="1" fill={LINE} stroke="none" />
      <circle cx="15" cy="10" r="1" fill={LINE} stroke="none" />
      <path d="M8.5 14.5c1.8 2 5.2 2 7 0" stroke={ACCENT} strokeWidth="2" />
    </>
  ),
  broken: (
    <>
      <path
        d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 5 2 8 .4 2.5 1 5.5 2.5 5.5s1.6-3 2.5-5c.4-1 1.2-1 2 0 .9 2 1 5 2.5 5s2.1-3 2.5-5.5c.5-3 2-5 2-8C21 5 19.5 3 17 3l-3 3 1 3-3-2-2 2 1-5c-1 0-2-1-4-1z"
        fill="#fff"
      />
      <path d="m17 3-3 3 1 3-3-2-2 2 1-5" stroke={ALERT} />
    </>
  ),
  missing: (
    <>
      <rect x="1.5" y="6" width="6" height="12" rx="2.5" fill="#fff" />
      <rect x="16.5" y="6" width="6" height="12" rx="2.5" fill="#fff" />
      <rect
        x="9.5"
        y="6"
        width="5"
        height="12"
        rx="2"
        stroke={ACCENT}
        strokeDasharray="2 2"
      />
    </>
  ),
}

/** The plainer marks: the stages of a procedure and the clinic's promises. */
const MARKS: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  spark: (
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  heart: (
    <path d="M12 21s-7-4.5-9-9.5C1.7 8 4 4 7.5 4 9.5 4 11 5.2 12 7c1-1.8 2.5-3 4.5-3C20 4 22.3 8 21 11.5 19 16.5 12 21 12 21z" />
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4M7 12l3-3 2 2 4-4" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" />
    </>
  ),
}

/**
 * One of the small line drawings the service pages use: a symptom, a stage, a
 * promise. An editor picks it by name on the card; a card with none, or with
 * a name this build does not know, falls back to `fallback`.
 */
export function ServiceIcon({
  name,
  fallback = "tooth",
  className,
}: {
  readonly name?: ServiceIconName | null
  readonly fallback?: ServiceIconName
  readonly className?: string
}) {
  const known =
    name != null && (Object.hasOwn(SIGNS, name) || Object.hasOwn(MARKS, name))
  const key = known ? name : fallback
  const sign = SIGNS[key]

  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox={sign ? "-1 -2 26 26" : "0 0 24 24"}
      fill="none"
      stroke={LINE}
      strokeWidth={sign ? 1.6 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {sign ?? MARKS[key]}
    </svg>
  )
}

export default ServiceIcon

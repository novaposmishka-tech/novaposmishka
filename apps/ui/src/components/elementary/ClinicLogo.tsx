import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

/**
 * The two sizes the design draws the wordmark at: 240 wide in the header, 340
 * in the footer, with everything inside scaled to match. Only the header one
 * ever stands on a photograph, so only it adapts to one.
 */
const SIZES = {
  header: {
    root: "gap-2.5 lg:gap-4",
    mark: "h-6.75 w-7 group-has-data-photo-hero-top:brightness-0 group-has-data-photo-hero-top:invert lg:h-11.5 lg:w-11.75",
    stack: "gap-1.5 lg:gap-2.5",
    name: "text-[0.656rem]/none group-has-data-photo-hero-top:text-white lg:text-lg/none",
    tagline:
      "text-[0.4375rem]/none group-has-data-photo-hero-top:text-brand-on-dark lg:text-xs/none",
  },
  footer: {
    root: "gap-3.75 lg:gap-5.75",
    mark: "h-10.75 w-11 lg:h-16.25 lg:w-16.75",
    stack: "gap-2.25 lg:gap-3.75",
    name: "text-[1.0625rem]/none lg:text-[1.5625rem]/none",
    tagline: "text-[0.6875rem]/none lg:text-[1.0625rem]/none",
  },
}

/**
 * The clinic's wordmark: the tooth mark from the design plus its two lines of
 * type.
 *
 * The mark is the only part that is artwork — the name is left as text so it
 * stays selectable, searchable and legible to a screen reader, and so both
 * lines can take their colour from the surface they sit on.
 */
export function ClinicLogo({
  className,
  onDark = false,
  variant = "header",
}: {
  readonly className?: string
  readonly onDark?: boolean
  readonly variant?: keyof typeof SIZES
}) {
  const t = useTranslations("clinic")
  const size = SIZES[variant]

  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center", size.root, className)}
    >
      <Image
        src="/images/logo-mark.svg"
        alt=""
        width={40}
        height={38}
        className={cn("shrink-0", size.mark)}
        priority
      />
      <span className={cn("flex flex-col", size.stack)}>
        <span
          className={cn(
            "font-bold",
            size.name,
            onDark ? "text-brand-inverted" : "text-brand-ink"
          )}
        >
          {t("name")}
        </span>
        <span
          className={cn(
            "font-semibold",
            size.tagline,
            // brand-on-dark is what the design colours this line, and it is
            // 1.67:1 on white — on the light header and in the footer the
            // words all but disappear. It is kept for the one surface it was
            // drawn for: a dark one.
            onDark ? "text-brand-on-dark" : "text-brand-body"
          )}
        >
          {t("tagline")}
        </span>
      </span>
    </Link>
  )
}

ClinicLogo.displayName = "ClinicLogo"

export default ClinicLogo

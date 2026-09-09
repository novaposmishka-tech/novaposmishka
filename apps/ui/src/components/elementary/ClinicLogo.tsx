import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

/**
 * The clinic's wordmark: the tooth mark from the design plus its two lines of
 * type.
 *
 * The mark is the only part that is artwork — the name is left as text so it
 * stays selectable, searchable and legible to a screen reader, and so the
 * second line can take its colour from the surface it sits on.
 */
export function ClinicLogo({
  className,
  onDark = false,
}: {
  readonly className?: string
  readonly onDark?: boolean
}) {
  const t = useTranslations("clinic")

  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center gap-2.5 lg:gap-4", className)}
    >
      <Image
        src="/images/logo-mark.svg"
        alt=""
        width={40}
        height={38}
        className="h-6.75 w-7 shrink-0 lg:h-11.5 lg:w-11.75"
        priority
      />
      <span className="flex flex-col gap-1.5 lg:gap-2.5">
        <span
          className={cn(
            "text-[0.656rem]/none font-bold lg:text-lg/none",
            onDark ? "text-brand-inverted" : "text-brand-ink"
          )}
        >
          {t("name")}
        </span>
        <span
          // Named so the accessibility suite can point at it: the design's
          // colour for this line does not meet the contrast threshold, and the
          // exclusion has to name something stabler than a utility class.
          data-logo-tagline
          className="text-brand-on-dark text-[0.4375rem]/none font-semibold lg:text-xs/none"
        >
          {t("tagline")}
        </span>
      </span>
    </Link>
  )
}

ClinicLogo.displayName = "ClinicLogo"

export default ClinicLogo

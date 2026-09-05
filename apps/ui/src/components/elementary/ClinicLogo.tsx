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
      className={cn("flex shrink-0 items-center gap-3", className)}
    >
      <Image
        src="/images/logo-mark.svg"
        alt=""
        width={40}
        height={38}
        className="size-9.5 shrink-0"
        priority
      />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-lg font-bold",
            onDark ? "text-brand-inverted" : "text-brand-ink"
          )}
        >
          {t("name")}
        </span>
        <span
          className={cn(
            "text-xs",
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

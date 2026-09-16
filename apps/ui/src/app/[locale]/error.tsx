"use client"

// Error boundaries must be Client Components - https://nextjs.org/docs/app/api-reference/file-conventions/error#error
import * as Sentry from "@sentry/nextjs"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

import {
  ERROR_ACTION_PRIMARY,
  ERROR_ACTION_SECONDARY,
  ErrorPage,
} from "@/components/elementary/ErrorPage"
import { Link } from "@/lib/navigation"

interface Props {
  readonly error: Error
  readonly reset: () => void
}

export default function ErrorPageRoute({ error, reset }: Props) {
  const t = useTranslations("errors.serverError")

  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <ErrorPage
      illustration={{ src: "/images/error-500.png", alt: t("imageAlt") }}
      title={t("title")}
      description={t("description")}
    >
      <Link href="/" className={ERROR_ACTION_PRIMARY}>
        <ArrowLeft aria-hidden className="size-5 lg:size-6" />
        {t("backHome")}
      </Link>

      {/* What the frame's second button is for: re-rendering the segment that
          threw, which is the one thing this page can do about the error. */}
      <button type="button" onClick={reset} className={ERROR_ACTION_SECONDARY}>
        {t("tryAgain")}
      </button>
    </ErrorPage>
  )
}

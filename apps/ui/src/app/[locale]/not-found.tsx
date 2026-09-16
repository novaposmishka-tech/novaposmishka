import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

import {
  ERROR_ACTION_PRIMARY,
  ErrorPage,
} from "@/components/elementary/ErrorPage"
import { Link } from "@/lib/navigation"

export default async function NotFound() {
  const t = await getTranslations("errors.notFound")

  return (
    <ErrorPage
      illustration={{ src: "/images/error-404.png", alt: t("imageAlt") }}
      title={t("title")}
      description={t("description")}
    >
      <Link href="/" className={ERROR_ACTION_PRIMARY}>
        <ArrowLeft aria-hidden className="size-5 lg:size-6" />
        {t("backHome")}
      </Link>
    </ErrorPage>
  )
}

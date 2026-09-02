import { LinkBreak2Icon } from "@radix-ui/react-icons"
import { getTranslations } from "next-intl/server"

import { Link } from "@/lib/navigation"

export default async function NotFound() {
  const t = await getTranslations("errors.notFound")

  return (
    // `main` (not a bare div) so the page has a landmark and a single h1 —
    // without them axe flags every element here as outside a landmark region.
    <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-2">
      <LinkBreak2Icon className="size-8" aria-hidden />
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-semibold">{t("title")}</h1>
        <p>{t("description")}</p>
      </div>
      <p>{t("solution")}</p>
      <Link
        className="rounded-xl bg-gray-900 px-4 py-2 text-white transition-colors duration-500 hover:bg-gray-700"
        href="/"
      >
        {t("redirect")}
      </Link>
    </main>
  )
}

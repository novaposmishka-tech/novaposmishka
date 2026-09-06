import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

import { ClinicLogo } from "@/components/elementary/ClinicLogo"
import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiMap({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.map">
}) {
  const { title, address, embedUrl, link } = component

  if (!address && !embedUrl && !link) {
    return null
  }

  const t = await getTranslations("map")

  return (
    <section id="map" className="scroll-mt-24">
      <Container className="flex flex-col gap-10">
        {title && (
          <Typography tag="h2" className="text-brand-ink">
            {title}
          </Typography>
        )}

        {/* The map is optional, and needs no API key: the maps.google.com
            "output=embed" URL redirects to Google's keyless embed endpoint,
            which sets neither X-Frame-Options nor frame-ancestors. The address
            and the directions link work with or without it. */}
        <div className={cn(embedUrl && "relative")}>
          {embedUrl && (
            <iframe
              src={embedUrl}
              title={t("title")}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-4/3 w-full rounded-[50px] border-0 md:aspect-21/10"
            />
          )}

          {(address || link) && (
            // The design floats this at the map's top-left, over a static
            // image. The live embed puts Google's own place card in exactly
            // that corner, so ours sits at the bottom instead — same inset
            // from the left, clear of theirs.
            <div
              className={cn(
                "bg-brand-paper border-brand-border flex max-w-79 flex-col gap-4 rounded-[20px] border p-5",
                embedUrl &&
                  "absolute bottom-6 left-6 shadow-sm md:bottom-12 md:left-12"
              )}
            >
              <ClinicLogo />

              {address && (
                <Typography className="text-brand-ink text-sm">
                  {address}
                </Typography>
              )}
              {link && <StrapiLink component={link} className="w-fit" />}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiMap.displayName = "StrapiMap"

export default StrapiMap

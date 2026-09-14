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
      {/* The phone frame runs the map from edge to edge and centres the line
          over it; the desktop keeps both on the grid. */}
      <Container
        hideDefaultPadding
        className="flex flex-col gap-7.5 px-3.75 lg:gap-12.5 lg:px-15"
      >
        {title && (
          <Typography
            tag="h2"
            className="text-brand-ink mb-0! text-center lg:text-left"
          >
            {title}
          </Typography>
        )}

        {/* The map is optional, and needs no API key: the maps.google.com
            "output=embed" URL redirects to Google's keyless embed endpoint,
            which sets neither X-Frame-Options nor frame-ancestors. The address
            and the directions link work with or without it. */}
        <div className={cn("-mx-3.75 lg:mx-0", embedUrl && "relative")}>
          {embedUrl && (
            <iframe
              src={embedUrl}
              title={t("title")}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-36/35 w-full border-0 lg:aspect-1320/639 lg:rounded-[50px]"
            />
          )}

          {(address || link) && (
            // The design floats this at the map's top-left, over a static
            // image. The live embed puts Google's own place card in exactly
            // that corner, so ours sits at the bottom instead — same inset
            // from the left, clear of theirs.
            <div
              className={cn(
                "bg-brand-inverted shadow-brand-card flex max-w-70.75 flex-col gap-4 rounded-[20px] px-3.75 py-5 lg:max-w-79 lg:gap-5 lg:p-5",
                embedUrl &&
                  "absolute bottom-5 left-5 lg:bottom-12.5 lg:left-12.5"
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

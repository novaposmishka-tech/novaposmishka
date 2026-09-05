import "server-only"

import type { Data } from "@repo/strapi-types"
import { getTranslations } from "next-intl/server"

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

        {/* The map itself is optional: Google's keyless embed renders nothing,
            so a frame without a Maps Embed API key would be a blank hole where
            the map should be. The address and the directions link work either
            way, and the frame appears the moment an editor sets a real embed
            URL. */}
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
            <div
              className={cn(
                "bg-brand-paper border-brand-border flex max-w-79 flex-col gap-4 rounded-[20px] border p-5",
                embedUrl &&
                  "absolute top-6 left-6 shadow-sm md:top-12 md:left-12"
              )}
            >
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

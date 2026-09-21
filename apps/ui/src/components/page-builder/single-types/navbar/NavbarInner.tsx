import "server-only"

import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"
import { type Locale, useTranslations } from "next-intl"

import { ClinicLogo } from "@/components/elementary/ClinicLogo"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import {
  NavbarBookingLink,
  NavbarMobileNavigation,
  NavbarMobileProvider,
  NavbarMobileToggle,
} from "@/components/page-builder/single-types/navbar/NavbarMobileControls"
import { NavbarPhoneButton } from "@/components/page-builder/single-types/navbar/NavbarPhoneButton"
import { cn } from "@/lib/styles"
import type { BetterAuthSessionWithStrapi } from "@/types/better-auth"

import { DesktopNavigation } from "./DesktopNavigation"

export function NavbarInner({
  locale,
  navbarData,
  session,
}: {
  readonly locale: Locale
  readonly navbarData?: Data.ContentType<"api::navbar.navbar">
  readonly session?: BetterAuthSessionWithStrapi | null
}) {
  const t = useTranslations("general")

  return (
    <NavbarMobileProvider>
      <header
        // Review cards and the like are <header>s too; this is the site's one,
        // and a photo hero measures it to know when it has stopped covering it.
        data-site-header
        className={cn(
          // The design's "Static header": a solid #f2f4f7 band with no rule
          // under it. The rule the photo hero draws is on the grid inside, not
          // here, so the band's height never depends on it.
          //
          // The shadow is the one place this departs from the frame, which
          // carries no effect on either Static header. The design review asks
          // for it by name — the band and the page under it are both near-white
          // and the edge between them is otherwise invisible once the page
          // scrolls — so it is kept deliberately faint, in the same blue the
          // cards' shadows use.
          "bg-brand-mist sticky top-0 z-50 h-15 w-full shadow-[0_4px_12px_rgba(13,22,155,0.06)] transition-[color,background-color,box-shadow] duration-300 lg:h-26.5",
          // The frame draws 404 and 500 bare: no header, no footer, and the
          // page's own button as the only way on.
          "group-has-data-error-page:hidden",
          // A page that opens on a photo hero carries the header inside it,
          // white and on nothing — until the picture scrolls out from under it
          // and the static header takes over.
          // Over the photograph the band is not there at all, so neither is the
          // edge the shadow exists to draw.
          "group-has-data-photo-hero-top:bg-transparent group-has-data-photo-hero-top:text-white group-has-data-photo-hero-top:shadow-none"
        )}
      >
        <div className="flex h-full items-center">
          <Container className="h-full">
            {/* The frame rules the photo hero's header across the grid, not
                across the window: the line ends where the content does, which
                is 1320 at desktop and 330 on a phone. The Container is the
                window's width and keeps the gutter inside it, so the rule
                belongs to this row rather than to it. */}
            <div className="flex h-full items-center justify-between group-has-data-photo-hero-top:border-b group-has-data-photo-hero-top:border-white/20">
              {/* Logo — the clinic's own mark unless an editor uploaded one. */}
              {navbarData?.logoImage?.image && navbarData.logoImage.link ? (
                <StrapiImageWithLink component={navbarData.logoImage} />
              ) : navbarData?.logoImage?.image ? (
                <StrapiBasicImage
                  component={navbarData.logoImage.image}
                  width={80}
                  height={30}
                  className="h-7.5 w-20 shrink-0 object-contain"
                />
              ) : (
                <ClinicLogo />
              )}

              <DesktopNavigation navbarItems={navbarData?.navbarItems} />

              {/* The call button and the booking button, 20px apart. */}
              <div className="hidden items-center gap-5 lg:flex">
                <NavbarPhoneButton
                  phones={
                    navbarData?.phones?.length
                      ? navbarData.phones.map((entry) => entry.text)
                      : [navbarData?.phone]
                  }
                />
                {/* The button goes down to the form at the foot of the page.
                  The site has one form and it lives there — a second copy of
                  it over the page would be the same two fields posting to the
                  same place. */}
                {navbarData?.primaryButtons?.map((button) => (
                  <NavbarBookingLink
                    key={button.id}
                    component={button}
                    // 185 by 46 at a 30 radius, which on a 46 pill is fully
                    // round, with the label and an arrow six apart inside 30 of
                    // padding. Over a photograph the fill becomes glass: white
                    // at a tenth over a blur, and the shadow goes with the
                    // gradient that cast it.
                    className="group-has-data-photo-hero-top:glass-rim h-11.5 min-w-46.25 gap-1.5 rounded-[30px] px-7.5 text-base/5.5 font-semibold group-has-data-photo-hero-top:shadow-none group-has-data-photo-hero-top:backdrop-blur-md"
                  >
                    {button.label}
                    <ArrowRight aria-hidden className="size-6" />
                  </NavbarBookingLink>
                ))}
              </div>
              <div className="flex items-center gap-5 lg:hidden">
                {navbarData?.primaryButtons?.[0] ? (
                  <NavbarBookingLink
                    component={navbarData.primaryButtons[0]}
                    className="group-has-data-photo-hero-top:glass-rim h-10 min-w-0 rounded-[30px] px-5 text-sm/5 font-semibold group-has-data-photo-hero-top:shadow-none group-has-data-photo-hero-top:backdrop-blur-md"
                  >
                    {/* The frame shortens the label on a phone, where the row
                        has the wordmark and the burger to fit beside it. */}
                    {t("bookShort")}
                  </NavbarBookingLink>
                ) : null}
                <NavbarMobileToggle />
              </div>
            </div>
          </Container>
        </div>
      </header>
      <NavbarMobileNavigation
        navbarItems={navbarData?.navbarItems}
        menuButton={navbarData?.menuButton}
        phones={
          navbarData?.phones?.length
            ? navbarData.phones.map((entry) => entry.text)
            : [navbarData?.phone]
        }
      />
    </NavbarMobileProvider>
  )
}
NavbarInner.displayName = "NavbarInner"

export default NavbarInner

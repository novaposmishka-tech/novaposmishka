import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { ClinicLogo } from "@/components/elementary/ClinicLogo"
import { Container } from "@/components/elementary/Container"
import { BookingDialog } from "@/components/elementary/forms/BookingDialog"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
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
  return (
    <NavbarMobileProvider>
      <header
        // Review cards and the like are <header>s too; this is the site's one,
        // and a photo hero measures it to know when it has stopped covering it.
        data-site-header
        className={cn(
          // The design's "Static header": a solid #f2f4f7 band, no rule under
          // it and no shadow. The transparent border keeps the height the same
          // in both states, since the photo hero does draw a rule.
          "bg-brand-mist sticky top-0 z-50 h-15 w-full border-b border-transparent transition-colors duration-300 lg:h-26.5",
          // A page that opens on a photo hero carries the header inside it,
          // white and on nothing — until the picture scrolls out from under it
          // and the static header takes over.
          "group-has-data-photo-hero-top:border-white/20 group-has-data-photo-hero-top:bg-transparent group-has-data-photo-hero-top:text-white"
        )}
      >
        <div className="flex h-full items-center">
          <Container className="flex h-full items-center justify-between">
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
              {/* The design opens the booking form over the page rather
                  than sending the reader down to the footer. Without a form
                  configured the buttons stay ordinary links. */}
              {navbarData?.bookingForm && navbarData.primaryButtons?.[0] ? (
                <BookingDialog
                  label={navbarData.primaryButtons[0].label ?? ""}
                  title={navbarData.bookingForm.title}
                  description={navbarData.bookingForm.description}
                  gdpr={{
                    href: navbarData.bookingForm.gdpr?.href ?? undefined,
                    label: navbarData.bookingForm.gdpr?.label ?? undefined,
                    newTab: navbarData.bookingForm.gdpr?.newTab ?? false,
                  }}
                  className="group-has-data-photo-hero-top:bg-white/10 group-has-data-photo-hero-top:bg-none"
                />
              ) : (
                navbarData?.primaryButtons?.map((button) => (
                  <StrapiLink key={button.id} component={button} />
                ))
              )}
            </div>
            <div className="flex items-center gap-5 lg:hidden">
              {navbarData?.bookingForm && navbarData.primaryButtons?.[0] ? (
                <BookingDialog
                  label={navbarData.primaryButtons[0].label ?? ""}
                  title={navbarData.bookingForm.title}
                  description={navbarData.bookingForm.description}
                  gdpr={{
                    href: navbarData.bookingForm.gdpr?.href ?? undefined,
                    label: navbarData.bookingForm.gdpr?.label ?? undefined,
                    newTab: navbarData.bookingForm.gdpr?.newTab ?? false,
                  }}
                  className="h-10 min-w-0 rounded-[30px] px-5 text-sm font-semibold group-has-data-photo-hero-top:bg-white/10 group-has-data-photo-hero-top:bg-none"
                />
              ) : null}
              <NavbarMobileToggle />
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

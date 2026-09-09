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
      <header className="bg-background/60 sticky top-0 z-50 h-15 w-full border-b shadow-sm backdrop-blur-md transition-colors duration-300 lg:h-26.5">
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
                  className="h-10 min-w-0 rounded-[30px] px-5 text-sm font-semibold"
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

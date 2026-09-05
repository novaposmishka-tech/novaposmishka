import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { ClinicLogo } from "@/components/elementary/ClinicLogo"
import { Container } from "@/components/elementary/Container"
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
      <header className="bg-background/60 sticky top-0 z-50 h-16 w-full border-b shadow-sm backdrop-blur-md transition-colors duration-300">
        <div className="flex h-16 items-center">
          <Container className="flex h-full items-center justify-between px-6">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-8">
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
              {/* Desktop Navigation */}
              <DesktopNavigation navbarItems={navbarData?.navbarItems} />
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden h-full items-center gap-4 pl-4 lg:flex">
              <NavbarPhoneButton phone={navbarData?.phone} />
              {navbarData?.primaryButtons?.map((button) => (
                <StrapiLink key={button.id} component={button} />
              ))}
            </div>
            <NavbarMobileToggle />
          </Container>
        </div>
      </header>
      <NavbarMobileNavigation
        navbarItems={navbarData?.navbarItems}
        primaryButtons={navbarData?.primaryButtons}
        phone={navbarData?.phone}
        session={session}
        locale={locale}
      />
    </NavbarMobileProvider>
  )
}
NavbarInner.displayName = "NavbarInner"

export default NavbarInner

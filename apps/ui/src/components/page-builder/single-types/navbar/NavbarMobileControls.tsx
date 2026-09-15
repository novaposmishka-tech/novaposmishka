"use client"

import type { Data } from "@repo/strapi-types"
import { Menu, X } from "lucide-react"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { MobileNavigation } from "@/components/page-builder/single-types/navbar/MobileNavigation"
import { Button } from "@/components/ui/button"
import { useNavbarMobile } from "@/hooks/useNavbarMobile"
import { cn } from "@/lib/styles"

export { NavbarMobileProvider } from "@/hooks/useNavbarMobile"

export function NavbarMobileToggle() {
  const [mobileOpen, setMobileOpen] = useNavbarMobile()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("lg:hidden", mobileOpen && "hamburger-menu")}
      aria-label="Toggle menu"
      onClick={() => setMobileOpen((open) => !open)}
    >
      {mobileOpen ? <X /> : <Menu />}
    </Button>
  )
}

/**
 * The header's booking button: an ordinary link down to the form at the foot
 * of the page, which is the site's only form.
 *
 * It also shuts the mobile menu, because on a phone the button sits in the
 * header beside the burger and stays pressable while the menu is open —
 * leaving it open would scroll the page behind a panel that covers it. At
 * desktop the menu is never open and closing it does nothing.
 */
export function NavbarBookingLink({
  component,
  className,
}: {
  readonly component: Data.Component<"utilities.link">
  readonly className?: string
}) {
  const [, setMobileOpen] = useNavbarMobile()

  return (
    <StrapiLink
      component={component}
      onClick={() => setMobileOpen(false)}
      className={className}
    />
  )
}

export function NavbarMobileNavigation({
  navbarItems,
  menuButton,
  phones,
}: {
  readonly menuButton?: Data.ContentType<"api::navbar.navbar">["menuButton"]
  readonly navbarItems?: Data.ContentType<"api::navbar.navbar">["navbarItems"]
  readonly phones?: readonly (string | null | undefined)[]
}) {
  const [mobileOpen, setMobileOpen] = useNavbarMobile()

  return (
    <MobileNavigation
      navbarItems={navbarItems}
      menuButton={menuButton}
      phones={phones}
      isOpen={mobileOpen}
      setOpen={setMobileOpen}
    />
  )
}

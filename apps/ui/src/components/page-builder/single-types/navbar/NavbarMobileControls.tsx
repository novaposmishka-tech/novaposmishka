"use client"

import type { Data } from "@repo/strapi-types"
import { Menu, X } from "lucide-react"

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

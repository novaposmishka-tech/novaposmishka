"use client"

import type { Data } from "@repo/strapi-types"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { usePathname } from "@/lib/navigation"
import { cn } from "@/lib/styles"

interface DesktopNavigationProps {
  navbarItems?: Data.ContentType<"api::navbar.navbar">["navbarItems"]
}

/**
 * The design measures the menu as the gap between the words themselves, so the
 * items carry no padding of their own and the row spaces them by 50px.
 */
const LABEL = cn(
  "text-brand-ink h-auto cursor-pointer bg-transparent px-0 py-0 text-base font-normal no-underline",
  // The frame draws the menu white where the header lies over a photograph —
  // #f8f8f8, a shade off pure white, which is what leaves the current page
  // room to be #ffffff and be told apart at all. It does not draw a hover for
  // that case, so the word simply dims.
  "group-has-data-photo-hero-top:text-brand-inverted group-has-data-photo-hero-top:hover:text-brand-inverted/70",
  // The design's menu button has two states and the only difference between
  // them is the colour of the word: no filled pill, no underline, no padding
  // box. Both come from elsewhere — the shadcn trigger paints a background on
  // hover, focus and while open, and the link button variant underlines — so
  // each is turned off explicitly.
  "hover:text-brand-teal hover:bg-transparent hover:no-underline",
  "focus:bg-transparent data-[state=open]:bg-transparent",
  // Clicking a word leaves it focused, and the primitive paints a focused
  // item in `accent-foreground` — near-black, so over a photograph the word
  // sits dark among white ones until focus moves elsewhere. Closing a dropdown
  // does the same, because it hands focus back to the word that opened it.
  //
  // The reset has to be written as "not open" rather than "closed": only the
  // dropdown trigger is a Radix button and carries `data-state` at all, and
  // the four plain links have no such attribute, so a `data-[state=closed]`
  // rule passes straight over them. `not-data-[state=open]` holds for both —
  // it is true of a shut trigger and of anything with no state to speak of —
  // while still leaving an open menu its teal.
  //
  // Only the colour is reset. The focus ring is a separate rule and is left
  // alone, so the word is still visibly focused when arriving by keyboard.
  "not-data-[state=open]:focus:text-brand-ink",
  "group-has-data-photo-hero-top:not-data-[state=open]:focus:text-brand-inverted",
  // Open *and* focused is a two-variant rule in the primitive, so it outranks
  // the single-variant resets above and has to be answered in kind.
  "data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent",
  "data-[state=open]:text-brand-teal",
  "group-has-data-photo-hero-top:data-[state=open]:text-white",
  // The dropdown caret: the design sets it 10px from the word and a size up
  // from the primitive default.
  "[&>svg]:ml-3 [&>svg]:size-4"
)

/** The page you are on: the frame's pill, in brand teal and semibold. */
const ACTIVE = "bg-brand-mist text-brand-teal! font-semibold"

/**
 * The same, for the words in the bar itself.
 *
 * The bar marks the page you are on by the word alone. No menu item in the
 * file carries a fill — checked across every desktop frame — so the pill above
 * belongs to the dropdown's white card and not here: over a photograph it put
 * a near-white patch on the picture, which is what it looked like.
 *
 * What the frame does instead is a shift the width of a hair. Over a
 * photograph the menu is #f8f8f8 and the current page is pure #ffffff;
 * on the light band the menu is black and the current page is the brand teal.
 * Both go to semibold while their neighbours stay regular, and that weight is
 * most of what the eye actually catches.
 */
const ACTIVE_IN_BAR = cn(
  "text-brand-teal! font-semibold",
  "group-has-data-photo-hero-top:text-white!"
)

export function DesktopNavigation({ navbarItems }: DesktopNavigationProps) {
  if (!navbarItems?.length) return null

  return <Menu navbarItems={navbarItems} />
}

function Menu({
  navbarItems,
}: {
  readonly navbarItems: NonNullable<DesktopNavigationProps["navbarItems"]>
}) {
  const pathname = usePathname()

  // A dropdown counts as current when the reader is on one of the pages it
  // lists, which is how "Послуги" lights up on a service page.
  const isCurrent = (link?: Data.Component<"utilities.link"> | null) =>
    link?.type === "page" && link.page?.fullPath === pathname

  return (
    <NavigationMenu viewport={false} className="hidden lg:flex">
      <NavigationMenuList className="flex items-center gap-12.5">
        {navbarItems.map((item) => {
          const hasSubItems = !!item.categoryItems?.length

          return (
            <NavigationMenuItem key={item.id} className="relative">
              {item.isCategoryLink && item.link ? (
                <StrapiLink
                  component={item.link}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    LABEL,
                    isCurrent(item.link) && ACTIVE_IN_BAR
                  )}
                >
                  {item.link.label}
                </StrapiLink>
              ) : hasSubItems ? (
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    LABEL,
                    item.categoryItems?.some(isCurrent) && ACTIVE_IN_BAR
                  )}
                >
                  {item.label}
                </NavigationMenuTrigger>
              ) : (
                <span>{item.label}</span>
              )}

              {/* Measured off the frame: a 363-wide panel at a 24 radius with
                  20 of padding, each service 54 tall inside a 10-radius pill
                  with 20 of its own. The starter's popover chrome — a 6
                  radius, a border, 8 of padding — is what made it look
                  "зліплено" in the design review. */}
              {hasSubItems && (
                <NavigationMenuContent className="shadow-brand-card! z-50 min-w-90.75 rounded-3xl! border-0! bg-white p-5">
                  <ul className="list-none">
                    {item?.categoryItems?.map((subItem) => (
                      <li key={subItem.id} className="list-none">
                        <StrapiLink
                          component={subItem}
                          className={cn(
                            "text-brand-ink hover:bg-brand-mist hover:text-brand-teal flex h-13.5 w-full items-center justify-start rounded-[10px] px-5 text-base font-normal no-underline transition-colors",
                            isCurrent(subItem) && ACTIVE
                          )}
                        />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

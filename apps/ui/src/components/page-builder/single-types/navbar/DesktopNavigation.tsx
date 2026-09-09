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
  // The design's menu button has two states and the only difference between
  // them is the colour of the word: no filled pill, no underline, no padding
  // box. Both come from elsewhere — the shadcn trigger paints a background on
  // hover, focus and while open, and the link button variant underlines — so
  // each is turned off explicitly.
  "hover:text-brand-teal hover:bg-transparent hover:no-underline",
  "focus:bg-transparent data-[state=open]:bg-transparent",
  "data-[state=open]:hover:bg-transparent data-[state=open]:text-brand-teal",
  // The dropdown caret: the design sets it 10px from the word and a size up
  // from the primitive default.
  "[&>svg]:ml-3 [&>svg]:size-4"
)

/** The page you are on, which the design sets in brand teal and semibold. */
const ACTIVE = "text-brand-teal! font-semibold"

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
                    isCurrent(item.link) && ACTIVE
                  )}
                >
                  {item.link.label}
                </StrapiLink>
              ) : hasSubItems ? (
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    LABEL,
                    item.categoryItems?.some(isCurrent) && ACTIVE
                  )}
                >
                  {item.label}
                </NavigationMenuTrigger>
              ) : (
                <span>{item.label}</span>
              )}

              {hasSubItems && (
                <NavigationMenuContent className="z-50">
                  <ul>
                    {item?.categoryItems?.map((subItem) => (
                      <li key={subItem.id} className="list-none">
                        <StrapiLink
                          component={subItem}
                          className={cn(
                            "text-brand-ink hover:text-brand-teal w-full justify-start text-base font-normal no-underline",
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

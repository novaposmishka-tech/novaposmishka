"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

import { usePathname } from "@/lib/navigation"

type NavbarMobileContextValue = [boolean, Dispatch<SetStateAction<boolean>>]

const NavbarMobileContext = createContext<NavbarMobileContextValue | null>(null)

export function NavbarMobileProvider({
  children,
}: {
  readonly children: ReactNode
}) {
  // The menu remembers the page it was opened on, and counts as shut on any
  // other: whatever took the reader there — a link in it, the wordmark, the
  // browser's back button — closes it. Settled during render rather than in
  // an effect, as React has it for state that follows a prop, so the page
  // never paints with the menu open and then shuts it. The links in the menu
  // close it themselves as well, which covers a press that lands on the page
  // already open, where there is no route change to go by.
  const pathname = usePathname()
  const [menu, setMenu] = useState({ open: false, pathname })
  if (menu.pathname !== pathname) {
    setMenu({ open: false, pathname })
  }
  const mobileOpen = menu.open && menu.pathname === pathname
  const setMobileOpen = useCallback(
    (action: SetStateAction<boolean>) =>
      setMenu((previous) => ({
        open: typeof action === "function" ? action(previous.open) : action,
        pathname: previous.pathname,
      })),
    []
  )

  return (
    <NavbarMobileContext.Provider
      // React Compiler handles this memoization; keeping this explicit avoids
      // unnecessary useMemo noise around a tiny UI state provider.
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={[mobileOpen, setMobileOpen]}
    >
      {children}
    </NavbarMobileContext.Provider>
  )
}

export function useNavbarMobile() {
  const context = useContext(NavbarMobileContext)

  if (context == null) {
    throw new Error("Navbar mobile controls must be used inside provider")
  }

  return context
}

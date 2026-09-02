import { Nunito, Open_Sans } from "next/font/google"

/**
 * Open Sans carries the design's named text styles (Headings/H2, 16px/Regular,
 * 16px/SemiBold, 18px/Regular); Nunito is used for the 14px style.
 *
 * Both load the Cyrillic subset — the site is Ukrainian, and a latin-only font
 * silently falls back to a system face for most of the copy.
 */
export const fontOpenSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
})

export const fontNunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-nunito",
})

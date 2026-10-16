"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import type React from "react"
import { z } from "zod"

import { useTranslatedZod } from "@/hooks/useTranslatedZod"
import { setupLibraries } from "@/lib/general-helpers"

// Setup libraries in client environment
// eslint-disable-next-line unicorn/no-top-level-side-effects
setupLibraries()

const queryClient = new QueryClient()

export function ClientProviders({
  children,
}: {
  readonly children: React.ReactNode
}) {
  useTranslatedZod(z)

  return (
    // Light only. The site is drawn for one palette, and a phone in night
    // mode was getting the starter's dark tokens over it — grey copy on black
    // cards that no frame ever had. Forced, not merely defaulted, so a
    // reader whose browser stored "system" or "dark" earlier is not kept
    // there.
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}

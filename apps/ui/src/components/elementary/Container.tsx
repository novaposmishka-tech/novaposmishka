import type React from "react"

import { cn } from "@/lib/styles"

export function Container({
  children,
  className,
  hideDefaultPadding,
}: {
  readonly children: React.ReactNode
  readonly className?: string
  readonly hideDefaultPadding?: boolean
}) {
  return (
    <div
      className={cn(
        // The design lays content out 1320px wide inside a 1440px frame, so
        // the gutter is 60px at desktop and 15px on a phone — not a fixed
        // max-width with padding inside it.
        "mx-auto w-full max-w-360",
        hideDefaultPadding ? "" : "px-4 md:px-15",
        className
      )}
    >
      {children}
    </div>
  )
}

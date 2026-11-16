"use client"

import { ChevronDown } from "lucide-react"
import type React from "react"

import { AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/styles"

/**
 * An accordion row as the service pages draw it: the trigger's own chevron
 * is put away for a disc that fills with the brand's teal and turns over
 * while the row is open. The row's type and padding are the caller's.
 */
export function DiscAccordionTrigger({
  className,
  discClassName,
  children,
}: {
  readonly className?: string
  /** The disc's size, and its fill while the row is shut. */
  readonly discClassName?: string
  readonly children: React.ReactNode
}) {
  return (
    <AccordionTrigger
      className={cn(
        "group text-brand-ink items-center gap-5 hover:no-underline [&>svg]:hidden",
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "group-data-[state=open]:bg-brand-light group-data-[state=open]:text-brand-inverted flex size-8 shrink-0 items-center justify-center rounded-full transition-[rotate,background-color,color] duration-300 group-data-[state=open]:rotate-180",
          discClassName
        )}
      >
        <ChevronDown className="size-4" />
      </span>
    </AccordionTrigger>
  )
}

export default DiscAccordionTrigger

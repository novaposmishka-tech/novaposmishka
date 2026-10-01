import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * The design system's own shadows are `@utility` rules, which tailwind-merge
 * cannot see, so it did not know `shadow-brand-button` for a shadow at all: a
 * `shadow-none` passed after it was kept alongside it rather than replacing it,
 * and the stylesheet's order decided. That is how the outlined button — whose
 * frame has no shadow until it is hovered — kept the filled button's shadow at
 * rest.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ["brand-button", "brand-card"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

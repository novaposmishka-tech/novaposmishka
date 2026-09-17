"use client"

import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/styles"

/**
 * "Показати більше": the white button the design puts under a list that is
 * showing only part of itself.
 *
 * Full width on a phone and hugging its words at desktop, as the frame draws
 * it in both places it appears.
 */
export function ShowMoreButton({
  label,
  onClick,
  className,
}: {
  readonly label: string
  readonly onClick: () => void
  readonly className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-brand-ink hover:bg-brand-gradient hover:shadow-brand-button hover:text-brand-inverted flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[30px] bg-white text-sm/5 font-semibold transition-colors lg:mx-auto lg:h-12.5 lg:w-fit lg:px-7.5 lg:text-base/5.5",
        className
      )}
    >
      {label}
      <ArrowRight aria-hidden className="size-5" />
    </button>
  )
}

export default ShowMoreButton

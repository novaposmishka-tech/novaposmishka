import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { cn } from "@/lib/styles"

const ICONS = {
  clock: Clock,
  phone: Phone,
  "map-pin": MapPin,
  mail: Mail,
}

/**
 * The mark the design puts before a line of the clinic's contact details. The
 * content type names one per line; anything it does not name draws nothing
 * rather than a placeholder.
 */
export function ContactIcon({
  icon,
  className,
}: {
  readonly icon?: string | null
  readonly className?: string
}) {
  const Glyph = icon ? ICONS[icon as keyof typeof ICONS] : undefined

  if (!Glyph) {
    return null
  }

  return <Glyph aria-hidden className={cn("size-6 shrink-0", className)} />
}

export default ContactIcon

import "server-only"

import type { Data } from "@repo/strapi-types"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import type { Locale } from "next-intl"
import { type ComponentType, type SVGProps, use } from "react"

import { ClinicLogo } from "@/components/elementary/ClinicLogo"
import { Container } from "@/components/elementary/Container"
import { RatingBadge } from "@/components/elementary/RatingBadge"
import { operatorIcon } from "@/components/icons/operators"
import {
  InstagramIcon,
  MessengerIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/icons/social"
import StrapiLeadForm from "@/components/page-builder/components/forms/StrapiLeadForm"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { contactHref } from "@/lib/contacts"
import { fetchFooter } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

type Contact = NonNullable<
  Data.ContentType<"api::footer.footer">["contacts"]
>[number]
type Social = NonNullable<
  Data.ContentType<"api::footer.footer">["socials"]
>[number]

const CONTACT_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  clock: Clock,
  phone: Phone,
  "map-pin": MapPin,
  mail: Mail,
}

const SOCIAL_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  messenger: MessengerIcon,
  instagram: InstagramIcon,
}

/** A hairline the width of the grid, as the design rules the footer. */
const RULE = "border-brand-hairline w-full border-t"

export function StrapiFooter({ locale }: { readonly locale: Locale }) {
  const response = use(fetchFooter(locale))
  const footer = response?.data

  if (footer == null) {
    return null
  }

  const now = new Date()
  const currentYear = now.getFullYear()

  // The design puts opening hours, phone and address in one row and drops the
  // email onto the next, beside the messenger marks. Splitting the list here
  // rather than in the CMS keeps that shape without asking an editor to know
  // about it.
  const contacts = footer.contacts ?? []
  const inlineContacts = contacts.filter((item) => item.icon !== "mail")
  const mailContact = contacts.find((item) => item.icon === "mail")

  // A real `footer` element, not a div: it makes this the page's `contentinfo`
  // landmark. Without it the CTA form, the contact list and the copyright all
  // sit outside any landmark, which is an axe `region` violation and leaves
  // screen-reader users no way to jump here.
  return (
    <footer className="w-full">
      {footer.leadForm && (
        <div className="pt-20 lg:pt-22.5">
          <StrapiLeadForm component={footer.leadForm} />
        </div>
      )}

      <Container>
        {/* The design opens the footer on a rule across the grid, 90 under the
            block above it and 50 over its own contents — not a band of colour
            across the window. */}
        <div
          className={cn(RULE, "mt-20 pt-12.5 pb-12.5 lg:mt-22.5 lg:pb-17.5")}
        >
          <div className="flex flex-col gap-7.5 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
            <div className="flex flex-col gap-5 lg:w-107.25 lg:gap-10.5">
              <div className="flex flex-col gap-4 lg:gap-8.25">
                {/* The clinic's own mark unless an editor uploaded one, as
                    the header does it — at the larger of the design's two
                    sizes. */}
                {footer.logoImage?.image ? (
                  <StrapiImageWithLink component={footer.logoImage} />
                ) : (
                  <ClinicLogo variant="footer" />
                )}

                {footer.description && (
                  <Typography className="text-brand-body mb-0! text-xs/[1.0625rem]! lg:text-base/5.5!">
                    {footer.description}
                  </Typography>
                )}
              </div>

              {footer.rating?.label && footer.rating.score != null && (
                <RatingBadge
                  label={footer.rating.label}
                  score={footer.rating.score}
                />
              )}
            </div>

            <div className="flex flex-col gap-5 lg:w-168.5 lg:items-end lg:gap-8.25">
              {/* The phone frame rules a line over the links as well as under
                  them; the desktop has only the one beneath. */}
              <hr className={cn(RULE, "lg:hidden")} />

              {/* One flat row of links, as the design draws it. `footer.sections`
                  stays in the schema for anyone who wants grouped columns, but
                  this design has none, so nothing renders them. */}
              {footer.links && footer.links.length > 0 && (
                <nav className="grid w-full grid-flow-col grid-cols-2 grid-rows-3 gap-x-20 gap-y-4 lg:flex lg:justify-between lg:gap-0">
                  {footer.links.map((link) => (
                    <StrapiLink
                      key={link.id}
                      component={link}
                      className="text-brand-ink hover:text-brand-teal h-auto w-fit p-0 text-base/5.5"
                    />
                  ))}
                </nav>
              )}

              <hr className={RULE} />

              {/* Each line of details is its own description list: a single
                  list around all of them would have the messenger marks inside
                  it, which is not something a list of terms may contain. */}
              <div className="grid w-full grid-cols-2 gap-x-10 gap-y-6.25 lg:grid-cols-3 lg:gap-x-0 lg:gap-y-8.25">
                {inlineContacts.map((item, index) => (
                  <ContactCell
                    key={item.id}
                    item={item}
                    // The phone frame keeps the first two side by side and
                    // gives everything after them the full width.
                    className={index > 1 ? "max-lg:col-span-2" : undefined}
                  />
                ))}

                {mailContact && (
                  <ContactCell
                    item={mailContact}
                    className="max-lg:col-span-2 lg:col-start-1"
                  />
                )}

                {footer.socials && footer.socials.length > 0 && (
                  <ul
                    className={cn(
                      "flex list-none items-center",
                      // Ranged against the foot of the grid on a desktop; on a
                      // phone the marks take a rule and a row of their own.
                      "lg:col-start-3 lg:justify-end lg:gap-7.5 lg:self-end",
                      "border-brand-hairline max-lg:col-span-2 max-lg:mt-1.25 max-lg:justify-between max-lg:border-t max-lg:pt-7.5"
                    )}
                  >
                    {footer.socials.map((social) => (
                      <SocialLink key={social.id} social={social} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* The design carries no copyright line; this renders only if an
              editor decides to add one. */}
          {footer.copyRight && (
            <Typography className="text-brand-body mt-10 text-sm">
              {footer.copyRight.split("{YEAR}").join(String(currentYear))}
            </Typography>
          )}
        </div>
      </Container>
    </footer>
  )
}

/**
 * One line of the clinic's details: what it is, then what it says. The design
 * marks each with its own glyph and sets the label a size under the value.
 */
function ContactCell({
  item,
  className,
}: {
  readonly item: Contact
  readonly className?: string
}) {
  const Icon = CONTACT_ICONS[item.icon ?? "clock"] ?? Clock

  return (
    <dl className={cn("flex flex-col gap-1.25", className)}>
      <dt className="text-brand-body mb-1.25 flex items-center gap-1.25 text-sm/5 lg:gap-1.75">
        <Icon aria-hidden className="size-5 shrink-0" />
        {item.label}
      </dt>
      {item.values?.map((value) => {
        const text = value.text ?? ""
        const href = contactHref(item.kind, text)
        // The design marks each number with its operator.
        const Operator = item.kind === "phone" ? operatorIcon(text) : null

        return (
          <dd
            key={value.id}
            className="text-brand-ink flex items-center gap-2.5 text-sm/5 lg:text-base/5.5"
          >
            {Operator && <Operator className="size-5 shrink-0" />}
            {href ? (
              <a className="hover:text-brand-teal" href={href}>
                {text}
              </a>
            ) : (
              text
            )}
          </dd>
        )
      })}
    </dl>
  )
}

function SocialLink({ social }: { readonly social: Social }) {
  const Icon = social.platform ? SOCIAL_ICONS[social.platform] : undefined

  // An account with no address is not a link; a mark that goes nowhere is
  // worse than the row being one mark shorter.
  if (!Icon || !social.href) {
    return null
  }

  return (
    <li>
      <a
        href={social.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={social.label ?? social.platform ?? undefined}
        className="text-brand-teal hover:text-brand-light block transition-colors"
      >
        <Icon className="size-7.5 lg:size-8.5" />
      </a>
    </li>
  )
}

StrapiFooter.displayName = "StrapiFooter"

export default StrapiFooter

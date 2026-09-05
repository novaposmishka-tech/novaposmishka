import "server-only"

import type { Data } from "@repo/strapi-types"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import type { Locale } from "next-intl"
import { type ComponentType, type SVGProps, use } from "react"

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
    <footer className="bg-primary/10 w-full border-t shadow-sm backdrop-blur transition-colors duration-300">
      {footer.leadForm && (
        <div className="pt-16 pb-8">
          <StrapiLeadForm component={footer.leadForm} />
        </div>
      )}

      <Container className="py-12.5">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          <div className="flex max-w-107.5 flex-col gap-6">
            <StrapiImageWithLink component={footer.logoImage} />

            {footer.description && (
              <Typography className="text-brand-body text-sm">
                {footer.description}
              </Typography>
            )}

            {footer.rating?.label && footer.rating.score != null && (
              <div className="flex flex-col gap-2">
                <RatingBadge
                  label={footer.rating.label}
                  score={footer.rating.score}
                />
                {footer.rating.link && (
                  <StrapiLink
                    component={footer.rating.link}
                    className="w-fit px-0"
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-8">
            {/* One flat row of links, as the design draws it. `footer.sections`
                stays in the schema for anyone who wants grouped columns, but
                this design has none, so nothing renders them. */}
            {footer.links && footer.links.length > 0 && (
              <nav className="border-brand-border flex flex-wrap justify-between gap-x-8 gap-y-3 border-b pb-8">
                {footer.links.map((link) => (
                  <StrapiLink
                    key={link.id}
                    component={link}
                    className="text-brand-ink w-fit px-0 text-base hover:underline"
                  />
                ))}
              </nav>
            )}

            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {inlineContacts.map((item) => (
                <ContactCell key={item.id} item={item} />
              ))}
            </dl>

            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              {mailContact && (
                <dl>
                  <ContactCell item={mailContact} />
                </dl>
              )}

              {footer.socials && footer.socials.length > 0 && (
                <ul className="flex list-none items-center gap-4">
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
      </Container>
    </footer>
  )
}

function ContactCell({ item }: { readonly item: Contact }) {
  const Icon = CONTACT_ICONS[item.icon ?? "clock"] ?? Clock

  return (
    <div className="flex flex-col gap-2">
      <dt className="text-brand-body flex items-center gap-2 text-sm">
        <Icon aria-hidden className="size-4 shrink-0" />
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
            className="text-brand-ink flex items-center gap-2 text-base"
          >
            {Operator && <Operator className="size-5 shrink-0" />}
            {href ? (
              <a className="hover:underline" href={href}>
                {text}
              </a>
            ) : (
              text
            )}
          </dd>
        )
      })}
    </div>
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
        <Icon className="size-8.5" />
      </a>
    </li>
  )
}

StrapiFooter.displayName = "StrapiFooter"

export default StrapiFooter

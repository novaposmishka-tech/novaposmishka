import "server-only"

import type { Locale } from "next-intl"
import { use } from "react"

import { Container } from "@/components/elementary/Container"
import { RatingBadge } from "@/components/elementary/RatingBadge"
import { ThemeToggle } from "@/components/elementary/ThemeToggle"
import StrapiLeadForm from "@/components/page-builder/components/forms/StrapiLeadForm"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { contactHref } from "@/lib/contacts"
import { fetchFooter } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

export function StrapiFooter({ locale }: { readonly locale: Locale }) {
  const response = use(fetchFooter(locale))
  const footer = response?.data

  if (footer == null) {
    return null
  }

  const now = new Date()
  const currentYear = now.getFullYear()

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

      <Container className="pt-8 pb-4">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex max-w-sm flex-col items-center justify-center space-y-4 md:items-start md:justify-start">
            <StrapiImageWithLink component={footer.logoImage} />
            {footer.description && (
              <Typography className="text-brand-body text-center text-sm md:text-left">
                {footer.description}
              </Typography>
            )}

            {footer.rating?.label && footer.rating.score != null && (
              <div className="flex flex-col items-center gap-2 md:items-start">
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

          {/* Opening hours, phones, address and email, as in the design. */}
          {footer.contacts && footer.contacts.length > 0 && (
            <dl className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 md:text-left">
              {footer.contacts.map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <dt className="text-brand-body text-sm">{item.label}</dt>
                  {item.values?.map((value) => {
                    const text = value.text ?? ""
                    const href = contactHref(item.kind, text)

                    return (
                      <dd key={value.id} className="text-sm font-medium">
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
              ))}
            </dl>
          )}

          <div
            className={cn(
              "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {footer.sections?.map((section) => (
              <div
                className="flex flex-col items-center md:items-start"
                key={section.id}
              >
                <h3 className="pb-2 text-lg font-bold">{section.title}</h3>

                {section.links?.map((link) => (
                  <StrapiLink
                    key={link.id}
                    component={link}
                    className="text-primary w-fit text-sm hover:underline"
                  />
                ))}
              </div>
            ))}
          </div>
          <ThemeToggle className="absolute top-6 right-6 lg:flex" />
        </div>

        <div className="flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            {footer.copyRight && (
              <Typography className="mx-auto w-fit lg:mx-0">
                {footer.copyRight.split("{YEAR}").join(String(currentYear))}
              </Typography>
            )}
          </div>

          <div className="flex flex-col items-center sm:flex-row md:space-x-4 lg:items-end">
            {footer.links?.map((link) => (
              <StrapiLink
                key={link.id}
                component={link}
                className="w-full md:w-fit"
              />
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}

StrapiFooter.displayName = "StrapiFooter"

export default StrapiFooter

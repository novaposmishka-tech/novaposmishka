/**
 * The clinic and the site, as schema.org describes them, for every page.
 *
 * The facts search engines want in a fixed shape — the address part by part,
 * the hours as days and times — are kept here, because the footer holds them
 * as the words a reader sees ("Пн - Пт: 8:00 - 20:00"). What the CMS keeps in
 * a usable form (the phones, the email, the profiles elsewhere, the blurb) is
 * passed in, so an editor's change reaches the markup too.
 */

export const CLINIC_NAME = "Нова Посмішка"

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "вулиця Івана Сльоти, 50а",
  addressLocality: "Житомир",
  addressRegion: "Житомирська область",
  postalCode: "10024",
  addressCountry: "UA",
}

/**
 * Where the building stands (вулиця Івана Сльоти, 50а), from OpenStreetMap:
 * close enough to put the clinic on the map, not a surveyed point.
 */
const GEO = {
  "@type": "GeoCoordinates",
  latitude: 50.2605,
  longitude: 28.6986,
}

/** The route to the clinic, the link the contacts page offers too. */
const MAP_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent("Івана Сльоти 50а, Житомир")

const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "20:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "09:00",
    closes: "15:00",
  },
]

/**
 * A Ukrainian number as the footer writes it ("093 762 05 00") in the
 * international form schema.org asks for ("+380937620500"). Anything that is
 * not ten digits beginning with 0 is passed on as it was written.
 */
export function internationalPhone(phone: string) {
  const digits = phone.replaceAll(/\D/g, "")

  if (digits.length === 10 && digits.startsWith("0")) {
    return `+38${digits}`
  }

  if (digits.length === 12 && digits.startsWith("380")) {
    return `+${digits}`
  }

  return phone.trim()
}

/**
 * Links that are the clinic's own profiles elsewhere — what `sameAs` is for.
 * A messenger link that opens a chat with a number (t.me/+…, wa.me/…) is a
 * way to write to the clinic, not a page about it, so it is left out.
 */
export function profileLinks(hrefs: readonly (string | null | undefined)[]) {
  return hrefs.filter(
    (href): href is string =>
      typeof href === "string" &&
      /^https?:\/\//.test(href) &&
      !/^https?:\/\/(t\.me\/\+|wa\.me\/|api\.whatsapp\.com\/)/.test(href)
  )
}

export function clinicSchema({
  baseUrl,
  phones,
  email,
  description,
  sameAs,
}: {
  baseUrl: string
  phones: readonly string[]
  email?: string | null
  description?: string | null
  sameAs: readonly string[]
}) {
  const url = baseUrl.replace(/\/$/, "")
  const clinicId = `${url}/#clinic`
  const logo = `${url}/apple-touch-icon.png`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dentist",
        "@id": clinicId,
        name: CLINIC_NAME,
        url,
        logo,
        image: logo,
        ...(description && { description }),
        ...(phones[0] && { telephone: internationalPhone(phones[0]) }),
        ...(phones.length > 0 && {
          contactPoint: phones.map((phone) => ({
            "@type": "ContactPoint",
            telephone: internationalPhone(phone),
            contactType: "customer service",
            availableLanguage: ["uk"],
          })),
        }),
        ...(email && { email }),
        address: ADDRESS,
        geo: GEO,
        hasMap: MAP_URL,
        areaServed: { "@type": "City", name: "Житомир" },
        openingHoursSpecification: OPENING_HOURS,
        priceRange: "₴₴",
        currenciesAccepted: "UAH",
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: CLINIC_NAME,
        inLanguage: "uk",
        publisher: { "@id": clinicId },
      },
    ],
  }
}

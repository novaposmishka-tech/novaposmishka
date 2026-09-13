/**
 * The contact page.
 *
 * The map is Google's keyless embed, the same URL the clinic's previous site
 * used: maps.google.com redirects it to www.google.com/maps/embed, which can
 * be framed and needs no API key. Both hosts are in the CSP.
 */

import {
  ADDRESS,
  ADDRESS_FULL,
  anchor,
  BUTTON_QUIET,
  CLINIC_NAME,
  EMAIL,
  image,
  OPENING_HOURS,
  PHONES,
  text,
} from "./shared.mjs"

// Left un-encoded on purpose: percent-encoding Cyrillic triples its length and
// pushes the finished URL past the 255 characters a link href can hold.
// Browsers encode it on navigation anyway.
const MAP_QUERY = "Івана+Сльоти+50а,+Житомир"

/** The clinic's own embed URL, carried over from the previous site. */
const MAP_EMBED =
  "https://maps.google.com/maps?q=%D0%BD%D0%BE%D0%B2%D0%B0%20%D0%BF%D0%BE%D1%81%D0%BC%D1%96%D1%88%D0%BA%D0%B0&t=m&z=13&output=embed&iwloc=near"

export const contactsPage = {
  slug: "kontakty",
  fullPath: "/kontakty",
  title: "Контакти",
  breadcrumbTitle: "Контакти",
  seo: {
    metaTitle: "Контакти — стоматологія «Нова Посмішка»",
    metaDescription: `Адреса, телефони та графік роботи стоматологічної клініки «Нова Посмішка»: ${ADDRESS}.`,
    applicationName: CLINIC_NAME,
    metaRobots: "index,follow",
    canonicalUrl: "/kontakty",
  },
  content: [
    {
      __component: "sections.contacts",
      display: "list",
      title: "Контакти",
      items: [
        {
          label: "Адреса",
          kind: "text",
          icon: "map-pin",
          values: [text(ADDRESS)],
        },
        {
          label: "Телефон",
          kind: "phone",
          icon: "phone",
          values: PHONES.map(text),
        },
        { label: "Email", kind: "email", icon: "mail", values: [text(EMAIL)] },
        {
          label: "Графік роботи",
          kind: "text",
          icon: "clock",
          values: OPENING_HOURS.map(text),
        },
      ],
      image: image("gallery-1", "Стоматологічний кабінет клініки"),
    },
    {
      __component: "sections.map",
      title: "Як нас знайти на карті?",
      address: ADDRESS_FULL,
      embedUrl: MAP_EMBED,
      link: {
        ...anchor(
          "Маршрут",
          `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`,
          BUTTON_QUIET
        ),
        newTab: true,
      },
    },
  ],
}

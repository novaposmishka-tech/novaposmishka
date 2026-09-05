/**
 * The contact page.
 *
 * The design draws a map here. It is not embedded yet: Google's keyless embed
 * renders an empty frame, and the supported route — the Maps Embed API — needs
 * a key the clinic has to issue. Set embedUrl once there is one; until then
 * the section still carries the address and a working directions link.
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
        { label: "Адреса", kind: "text", values: [text(ADDRESS)] },
        { label: "Телефон", kind: "phone", values: PHONES.map(text) },
        { label: "Email", kind: "email", values: [text(EMAIL)] },
        {
          label: "Графік роботи",
          kind: "text",
          values: OPENING_HOURS.map(text),
        },
      ],
      image: image("gallery-1", "Стоматологічний кабінет клініки"),
    },
    {
      __component: "sections.map",
      title: "Як нас знайти на карті?",
      address: ADDRESS_FULL,
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

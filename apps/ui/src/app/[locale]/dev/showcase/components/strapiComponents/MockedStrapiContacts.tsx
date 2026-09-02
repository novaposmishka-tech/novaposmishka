import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiContacts from "@/components/page-builder/components/sections/StrapiContacts"

// Real clinic details, straight from the design.
const data = {
  id: 1,
  __component: "sections.contacts",
  title: "Контакти",
  image: mockImage,
  items: [
    {
      id: 1,
      label: "Адреса",
      kind: "text",
      values: [{ id: 1, text: "вулиця Івана Сльоти, 50а, м. Житомир" }],
    },
    {
      id: 2,
      label: "Телефон",
      kind: "phone",
      values: [
        { id: 2, text: "093 762 05 00" },
        { id: 3, text: "067 762 55 00" },
      ],
    },
    {
      id: 3,
      label: "Email",
      kind: "email",
      values: [{ id: 4, text: "novaposmishka@gmail.com" }],
    },
  ],
} as unknown as Data.Component<"sections.contacts">

export default function MockedStrapiContacts() {
  return <StrapiContacts component={data} />
}

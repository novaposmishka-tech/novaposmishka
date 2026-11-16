import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiSymptoms from "@/components/page-builder/components/sections/StrapiSymptoms"

// The first card carries a photograph and the rest do not, so both of the
// card's shapes are on show side by side.
const data = {
  id: 1,
  __component: "sections.symptoms",
  title: "Коли варто звернутися до лікаря",
  items: [
    {
      id: 1,
      title: "Зуб реагує на холодне, гаряче чи солодке",
      icon: "cold",
      image: mockImage,
    },
    { id: 2, title: "На емалі з’явилися темні або білі плями", icon: "spot" },
    { id: 3, title: "Застрягає їжа між зубами", icon: "food" },
    { id: 4, title: "Відчувається неприємний присмак чи запах", icon: "smell" },
  ],
  callToAction: {
    id: 1,
    name: "Впізнали себе? Запишіться на огляд",
    description: "Огляд і план лікування — за 1 візит",
    link: {
      id: 1,
      type: "external",
      label: "Записатися на огляд",
      href: "#lead-form-section",
      newTab: false,
    },
  },
} as unknown as Data.Component<"sections.symptoms">

export default function MockedStrapiSymptoms() {
  return <StrapiSymptoms component={data} />
}

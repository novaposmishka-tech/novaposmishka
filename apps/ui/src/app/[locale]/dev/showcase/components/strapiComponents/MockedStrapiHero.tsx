import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiHero from "@/components/page-builder/components/sections/StrapiHero"

// The homepage hero from the design: copy over a darkened photo.
const data = {
  id: 1,
  __component: "sections.hero",
  title:
    "<h1><strong>Ми лікуємо.</strong></h1><h1><strong>Ви усміхаєтесь.</strong></h1>",
  description: "<p>Приватна сімейна стоматологія в Житомирі.</p>",
  links: [
    {
      id: 1,
      type: "external",
      label: "Записатися на прийом",
      href: "#lead-form-section",
      newTab: false,
      decorations: null,
    },
  ],
  tag: "<p><strong>Лікування без болю</strong></p>",
  note: null,
  backgroundImage: mockImage,
  serviceTags: [
    { id: 1, text: "Ортодонтія" },
    { id: 2, text: "Протезування" },
    { id: 3, text: "Імплантація" },
    { id: 4, text: "Хірургія" },
    { id: 5, text: "Терапія" },
    { id: 6, text: "Дитяча стоматологія" },
    { id: 7, text: "Пародонтологія" },
  ],
} as unknown as Data.Component<"sections.hero">

export default function MockedStrapiHero() {
  return <StrapiHero component={data} />
}

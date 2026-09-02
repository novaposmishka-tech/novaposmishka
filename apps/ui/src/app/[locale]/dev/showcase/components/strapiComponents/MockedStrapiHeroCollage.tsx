import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiHero from "@/components/page-builder/components/sections/StrapiHero"

// The design's alternative hero: copy on the left, image collage on the right.
const data = {
  id: 2,
  __component: "sections.hero",
  title: "<h1><strong>Ваша посмішка — наша турбота</strong></h1>",
  description:
    "<p>Сучасні методи лікування, досвідчені лікарі та турбота про кожного пацієнта.</p>",
  links: [
    {
      id: 1,
      type: "external",
      label: "Записатися",
      href: "#lead-form-section",
      newTab: false,
      decorations: null,
    },
  ],
  tag: "<p><strong>Приватна сімейна стоматологія в Житомирі</strong></p>",
  note: null,
  images: [
    { ...mockImage, id: 1 },
    { ...mockImage, id: 2 },
    { ...mockImage, id: 3 },
    { ...mockImage, id: 4 },
  ],
} as unknown as Data.Component<"sections.hero">

export default function MockedStrapiHeroCollage() {
  return <StrapiHero component={data} />
}

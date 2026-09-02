import type { Data } from "@repo/strapi-types"

import {
  mockIcon,
  mockImage,
} from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiWhyUs from "@/components/page-builder/components/sections/StrapiWhyUs"

const data = {
  id: 1,
  __component: "sections.why-us",
  title: "Чому обирають саме нас?",
  subtitle:
    "Приватна сімейна стоматологія в Житомирі — з увагою до кожного пацієнта.",
  image: mockImage,
  reasons: [
    {
      id: 1,
      title: "<p><strong>Досвідчені лікарі</strong></p>",
      description: "<p>Понад 10 років практики у кожного спеціаліста.</p>",
      image: mockIcon,
    },
    {
      id: 2,
      title: "<p><strong>Сучасне обладнання</strong></p>",
      description: "<p>Цифрова діагностика та безболісне лікування.</p>",
      image: mockIcon,
    },
    {
      id: 3,
      title: "<p><strong>Прозорі ціни</strong></p>",
      description: "<p>План лікування та вартість — до початку робіт.</p>",
      image: mockIcon,
    },
    {
      id: 4,
      title: "<p><strong>Гарантія</strong></p>",
      description: "<p>На всі види робіт, з подальшим супроводом.</p>",
      image: mockIcon,
    },
  ],
} as unknown as Data.Component<"sections.why-us">

export default function MockedStrapiWhyUs() {
  return <StrapiWhyUs component={data} />
}

import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiTestimonials from "@/components/page-builder/components/sections/StrapiTestimonials"

const data = {
  id: 1,
  __component: "sections.testimonials",
  title: "Що кажуть пацієнти",
  testimonials: [
    {
      id: 1,
      quote:
        "Вже після першого візиту відчула покращення, а після курсу лікування зник дискомфорт і ясна стали здоровими.",
      authorName: "Марія Т.",
      authorNote: "Лікування ясен",
      photo: mockImage,
    },
    {
      id: 2,
      quote:
        "Боявся імплантації роками. Тут усе пояснили спокійно і крок за кроком — виявилося зовсім не страшно.",
      authorName: "Сергій П.",
      authorNote: "Імплантація",
      photo: mockImage,
    },
  ],
} as unknown as Data.Component<"sections.testimonials">

export default function MockedStrapiTestimonials() {
  return <StrapiTestimonials component={data} />
}

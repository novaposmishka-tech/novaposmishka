import type { Data } from "@repo/strapi-types"

import StrapiAdvantages from "@/components/page-builder/components/sections/StrapiAdvantages"

const data = {
  id: 1,
  __component: "sections.advantages",
  set: {
    documentId: "mock-set",
    name: "Основний",
    title: "Чому обирають «Нову Посмішку»",
    items: [
      {
        id: 1,
        icon: "heart",
        title: "Безболісно",
        text: "Сучасна анестезія та уважне ставлення на кожному етапі.",
      },
      {
        id: 2,
        icon: "monitor",
        title: "Цифрова діагностика",
        text: "КТ, сканування та мікроскоп для точного плану лікування.",
      },
      {
        id: 3,
        icon: "document",
        title: "Прозорі ціни",
        text: "Вартість фіксуємо в плані лікування до початку.",
      },
      {
        id: 4,
        icon: "award",
        title: "Гарантія",
        text: "Надаємо гарантію на роботи та матеріали.",
      },
    ],
  },
} as unknown as Data.Component<"sections.advantages">

export default function MockedStrapiAdvantages() {
  return <StrapiAdvantages component={data} />
}

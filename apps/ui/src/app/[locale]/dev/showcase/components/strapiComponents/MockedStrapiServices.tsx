import type { Data } from "@repo/strapi-types"

import { mockIcon } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiServices from "@/components/page-builder/components/sections/StrapiServices"

const data = {
  id: 1,
  __component: "sections.services",
  title: "Наші послуги",
  subtitle:
    "Повний цикл стоматологічної допомоги — від профілактики до складного протезування.",
  services: [
    {
      id: 1,
      name: "Імплантація",
      description:
        "Відновлення втрачених зубів із гарантією на імплант і коронку.",
      icon: mockIcon,
    },
    {
      id: 2,
      name: "Ортодонтія",
      description: "Брекети та елайнери для дорослих і підлітків.",
      icon: mockIcon,
    },
    {
      id: 3,
      name: "Протезування",
      description: "Коронки, вініри та мости з сучасної кераміки.",
      icon: mockIcon,
    },
    {
      id: 4,
      name: "Дитяча стоматологія",
      description: "Лікування без стресу — у комфортній для дитини атмосфері.",
      icon: mockIcon,
    },
  ],
} as unknown as Data.Component<"sections.services">

export default function MockedStrapiServices() {
  return <StrapiServices component={data} />
}

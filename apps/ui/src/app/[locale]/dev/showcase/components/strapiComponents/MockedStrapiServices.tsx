import type { Data } from "@repo/strapi-types"

import { mockDirections } from "@/app/[locale]/dev/showcase/components/mockDirections"
import StrapiServices from "@/components/page-builder/components/sections/StrapiServices"

const data = {
  id: 1,
  __component: "sections.services",
  title: "Наші послуги",
  subtitle:
    "Повний цикл стоматологічної допомоги — від профілактики до складного протезування.",
} as unknown as Data.Component<"sections.services">

export default function MockedStrapiServices() {
  return <StrapiServices component={data} directions={mockDirections} />
}

import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiResults from "@/components/page-builder/components/sections/StrapiResults"

const data = {
  id: 1,
  __component: "sections.results",
  title: "Результати, якими пишаємось",
  subtitle: "Реальні роботи наших лікарів — до та після лікування.",
  cases: [
    {
      id: 1,
      caption: "Імплантація двох зубів, 3 місяці",
      before: mockImage,
      after: mockImage,
    },
    {
      id: 2,
      caption: "Вирівнювання прикусу елайнерами, 11 місяців",
      before: mockImage,
      after: mockImage,
    },
  ],
} as unknown as Data.Component<"sections.results">

export default function MockedStrapiResults() {
  return <StrapiResults component={data} />
}

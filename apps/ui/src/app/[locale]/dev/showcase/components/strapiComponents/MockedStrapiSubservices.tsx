import type { Data } from "@repo/strapi-types"

import {
  MOCK_DIRECTION_PAGE,
  mockDirections,
} from "@/app/[locale]/dev/showcase/components/mockDirections"
import StrapiSubservices from "@/components/page-builder/components/sections/StrapiSubservices"

const data = {
  id: 1,
  __component: "sections.subservices",
  title: "Наша стоматологія пропонує широкий спектр послуг",
  description:
    "Наша команда готова надати Вам індивідуальну консультацію та розробити план лікування, який відповідає Вашим потребам та бюджету.",
} as unknown as Data.Component<"sections.subservices">

export default function MockedStrapiSubservices() {
  return (
    <StrapiSubservices
      component={data}
      directions={mockDirections}
      // The list is the procedures of the direction whose page this is.
      page={{ documentId: MOCK_DIRECTION_PAGE } as never}
    />
  )
}

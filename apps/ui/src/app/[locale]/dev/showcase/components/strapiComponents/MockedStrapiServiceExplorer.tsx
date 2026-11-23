import type { Data } from "@repo/strapi-types"

import { mockDirections } from "@/app/[locale]/dev/showcase/components/mockDirections"
import StrapiServiceExplorer from "@/components/page-builder/components/sections/StrapiServiceExplorer"

const link = (id: number, label: string, href: string) => ({
  id,
  type: "external",
  label,
  href,
  newTab: false,
})

const data = {
  id: 1,
  __component: "sections.service-explorer",
  title: "Оберіть напрямок",
  callToAction: {
    id: 9,
    name: "Не знаєте, з чого почати?",
    description:
      "Запишіться на консультацію — лікар визначить, яка допомога вам потрібна.",
    link: link(9, "Записатися на консультацію", "#lead-form-section"),
  },
  // The second card lists the clinic's numbers, which it reads off the
  // navbar; with no page behind the showcase it shows the words alone.
  urgentTitle: "Терміново болить зуб?",
  urgentDescription: "Зателефонуйте — підберемо найближчий вільний час.",
} as unknown as Data.Component<"sections.service-explorer">

export default function MockedStrapiServiceExplorer() {
  return <StrapiServiceExplorer component={data} directions={mockDirections} />
}

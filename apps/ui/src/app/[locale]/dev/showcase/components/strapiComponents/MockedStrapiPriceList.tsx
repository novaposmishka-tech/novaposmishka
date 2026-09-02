import type { Data } from "@repo/strapi-types"

import StrapiPriceList from "@/components/page-builder/components/sections/StrapiPriceList"

const data = {
  id: 1,
  __component: "sections.price-list",
  title: "Ціни на терапевтичні послуги",
  groups: [
    {
      id: 1,
      title: "Обстеження",
      rows: [
        { id: 1, label: "Розгорнута консультація", price: "500 ГРН" },
        { id: 2, label: "Консультація", price: "500 ГРН" },
        { id: 3, label: "Прицільна рентгенографія", price: "200 ГРН" },
        {
          id: 4,
          label: "Панорамний знімок зубів (Ортопантомограма, ОПТГ) 2 щелепи",
          price: "500 ГРН",
        },
      ],
    },
    {
      id: 2,
      title: "Анестезія",
      rows: [
        { id: 5, label: "Аплікаційна анестезія", price: "150 ГРН" },
        { id: 6, label: "Інфільтраційна анестезія", price: "300 ГРН" },
      ],
    },
  ],
} as unknown as Data.Component<"sections.price-list">

export default function MockedStrapiPriceList() {
  return <StrapiPriceList component={data} />
}

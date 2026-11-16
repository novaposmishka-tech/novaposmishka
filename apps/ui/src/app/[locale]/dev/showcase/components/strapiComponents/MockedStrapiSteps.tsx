import type { Data } from "@repo/strapi-types"

import StrapiSteps from "@/components/page-builder/components/sections/StrapiSteps"

const data = {
  id: 1,
  __component: "sections.steps",
  title: "Як проходить процедура",
  steps: [
    {
      id: 1,
      title: "Огляд і знімок",
      text: "Лікар оцінює глибину ураження та складає план.",
    },
    {
      id: 2,
      title: "Анестезія",
      text: "Знеболюємо ділянку — лікування проходить комфортно.",
    },
    {
      id: 3,
      title: "Очищення",
      text: "Видаляємо уражені тканини та обробляємо порожнину.",
    },
    {
      id: 4,
      title: "Пломбування",
      text: "Відновлюємо зуб композитом під колір емалі.",
    },
  ],
} as unknown as Data.Component<"sections.steps">

export default function MockedStrapiSteps() {
  return <StrapiSteps component={data} />
}

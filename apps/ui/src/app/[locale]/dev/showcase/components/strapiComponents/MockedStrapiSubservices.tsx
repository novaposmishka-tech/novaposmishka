import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiSubservices from "@/components/page-builder/components/sections/StrapiSubservices"

const link = (id: number, href: string) => ({
  id,
  type: "external",
  label: "Детальніше та ціни",
  href,
  newTab: false,
})

// The first two entries carry a photograph and the third does not, so the
// frame is on show both filled and on its pale ground.
const data = {
  id: 1,
  __component: "sections.subservices",
  title: "Наша стоматологія пропонує широкий спектр послуг",
  description:
    "Наша команда готова надати Вам індивідуальну консультацію та розробити план лікування, який відповідає Вашим потребам та бюджету.",
  items: [
    {
      id: 1,
      name: "Лікування карієсу",
      description:
        "Зупиняємо карієс на ранній стадії та відновлюємо форму зуба сучасними композитними матеріалами.",
      icon: mockImage,
      link: link(1, "/poslugy/terapiia/likuvannia-kariiesu"),
    },
    {
      id: 2,
      name: "Ендодонтичне лікування",
      description:
        "Лікування каналів під мікроскопом — щоб зберегти власний зуб, а не видаляти його.",
      icon: mockImage,
      link: link(2, "/poslugy/terapiia/endodontychne-likuvannia"),
    },
    {
      id: 3,
      name: "Відбілювання зубів",
      description:
        "Безпечно освітлюємо емаль на кілька тонів без шкоди для зубів.",
      link: link(3, "/poslugy/terapiia/vidbiliuvannia-zubiv"),
    },
  ],
} as unknown as Data.Component<"sections.subservices">

export default function MockedStrapiSubservices() {
  return <StrapiSubservices component={data} />
}

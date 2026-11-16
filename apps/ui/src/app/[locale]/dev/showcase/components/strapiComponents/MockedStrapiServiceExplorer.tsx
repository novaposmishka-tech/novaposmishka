import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
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
  services: [
    {
      id: 1,
      name: "Терапія",
      description:
        "Лікування карієсу та каналів під мікроскопом — щоб зберегти власний зуб, а не замінювати його.",
      icon: mockImage,
      link: link(1, "Детальніше та ціни", "/poslugy/terapiia"),
      tags: [
        link(11, "Лікування карієсу", "/poslugy/terapiia/likuvannia-kariiesu"),
        link(12, "Заміна пломб", "/poslugy/terapiia/zamina-plomb"),
        link(
          13,
          "Відбілювання зубів",
          "/poslugy/terapiia/vidbiliuvannia-zubiv"
        ),
      ],
    },
    {
      id: 2,
      name: "Ортопедія",
      description:
        "Коронки, вініри та протези, які відновлюють функцію і виглядають природно.",
      icon: mockImage,
      link: link(2, "Детальніше та ціни", "/poslugy/ortopediia"),
      tags: [
        link(21, "Коронки", "/poslugy/ortopediia/koronky"),
        link(22, "Вініри", "/poslugy/ortopediia/viniry"),
      ],
    },
    {
      id: 3,
      name: "Хірургія",
      description:
        "Видалення та імплантація з комп’ютерним плануванням і хірургічними шаблонами.",
      icon: mockImage,
      link: link(3, "Детальніше та ціни", "/poslugy/khirurhiia"),
      tags: [
        link(31, "Видалення зубів", "/poslugy/khirurhiia/vydalennia-zubiv"),
        link(32, "Імплантація", "/poslugy/khirurhiia/implantatsiia"),
      ],
    },
  ],
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
  return <StrapiServiceExplorer component={data} />
}

import type { Data } from "@repo/strapi-types"

import { mockImage } from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import StrapiDoctors from "@/components/page-builder/components/sections/StrapiDoctors"

const data = {
  id: 1,
  __component: "sections.doctors",
  title: "Наші лікарі",
  subtitle:
    "Команда, якій довіряють пацієнти — від профілактики до складної імплантації.",
  doctors: [
    {
      id: 1,
      name: "Олена Ковальчук",
      specialty: "Терапевт-стоматолог",
      photo: mockImage,
    },
    {
      id: 2,
      name: "Андрій Мельник",
      specialty: "Хірург-імплантолог",
      photo: mockImage,
    },
    {
      id: 3,
      name: "Ірина Савченко",
      specialty: "Ортодонт",
      photo: mockImage,
    },
    {
      id: 4,
      name: "Дмитро Бондаренко",
      specialty: "Дитячий стоматолог",
      photo: mockImage,
    },
  ],
} as unknown as Data.Component<"sections.doctors">

export default function MockedStrapiDoctors() {
  return <StrapiDoctors component={data} />
}

import {
  mockIcon,
  mockImage,
} from "@/app/[locale]/dev/showcase/components/StrapiMedia"
import type { DirectionEntry } from "@/lib/directions"

/** The page the mocked direction stands for, so its list can find it. */
export const MOCK_DIRECTION_PAGE = "mock-direction-page"

const page = (documentId: string, fullPath: string) => ({
  documentId,
  fullPath,
})

/**
 * Directions as the card blocks read them from Strapi. The first carries
 * photographs on two of its procedures and not on the third, so the list's
 * frame is on show both filled and on its pale ground.
 */
export const mockDirections = [
  {
    documentId: "therapy",
    name: "Терапія",
    summary: "Основний скрижаль для здорових та красивих зубів",
    description:
      "Лікування карієсу та каналів під мікроскопом — щоб зберегти власний зуб, а не замінювати його.",
    icon: mockImage,
    illustration: mockIcon,
    page: page(MOCK_DIRECTION_PAGE, "/poslugy/terapiia"),
    subdirections: [
      {
        documentId: "caries",
        name: "Лікування карієсу",
        description:
          "Зупиняємо карієс на ранній стадії та відновлюємо форму зуба сучасними композитними матеріалами.",
        image: mockImage,
        page: page("caries", "/poslugy/terapiia/likuvannia-kariiesu"),
      },
      {
        documentId: "endo",
        name: "Ендодонтичне лікування",
        description:
          "Лікування каналів під мікроскопом — щоб зберегти власний зуб, а не видаляти його.",
        image: mockImage,
        page: page("endo", "/poslugy/terapiia/endodontychne-likuvannia"),
      },
      {
        documentId: "whitening",
        name: "Відбілювання зубів",
        description:
          "Безпечно освітлюємо емаль на кілька тонів без шкоди для зубів.",
      },
    ],
  },
  {
    documentId: "prosthetics",
    name: "Ортопедія",
    summary: "Ваш шлях до здорових та гарних зубів",
    description:
      "Коронки, вініри та протези, які відновлюють функцію і виглядають природно.",
    icon: mockImage,
    illustration: mockIcon,
    page: page("prosthetics", "/poslugy/ortopediia"),
    subdirections: [
      { documentId: "crowns", name: "Коронки" },
      { documentId: "veneers", name: "Вініри" },
    ],
  },
  {
    documentId: "kids",
    name: "Дитяча стоматологія",
    summary: "Створюємо основу для здорових посмішок маленьких пацієнтів",
    description:
      "Перше знайомство зі стоматологом — дружнє, спокійне і без болю.",
    icon: mockImage,
    illustration: mockIcon,
    page: page("kids", "/poslugy/dytiacha-stomatolohiia"),
    subdirections: [],
  },
] as unknown as DirectionEntry[]

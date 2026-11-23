/**
 * The clinic's directions of treatment and the procedures under each: the
 * entries of the Direction and Subdirection collections.
 *
 * The homepage cards, the services index and each direction's list of
 * procedures are all drawn from these, so each line is written once. The
 * summary is the homepage card's; the description is the index's, a line
 * longer. A procedure's description is the sentence its own page opens with.
 */

import { SERVICE_SLUGS } from "./services.mjs"
import { image } from "./shared.mjs"
import { SUBSERVICES } from "./subservices.data.mjs"

const COPY = {
  terapiia: [
    "Основний скрижаль для здорових та красивих зубів",
    "Лікування карієсу та каналів під мікроскопом — щоб зберегти власний зуб, а не замінювати його.",
  ],
  ortopediia: [
    "Ваш шлях до здорових та гарних зубів",
    "Коронки, вініри та протези, які відновлюють функцію і виглядають природно.",
  ],
  khirurhiia: [
    "Новий рівень турботи про Ваші зуби",
    "Видалення та імплантація з комп’ютерним плануванням і хірургічними шаблонами.",
  ],
  ortodontiia: [
    "Красива та здорова посмішка на кожен день",
    "Рівні зуби та правильний прикус — для дітей і дорослих.",
  ],
  parodontolohiia: [
    "Ми знаємо, як подбати про здоров'я Ваших зубів та ясен",
    "Захворювання ясен — не вирок. Лікуємо та зупиняємо пародонтит.",
  ],
  "dytiacha-stomatolohiia": [
    "Створюємо основу для здорових посмішок маленьких пацієнтів",
    "Перше знайомство зі стоматологом — дружнє, спокійне і без болю.",
  ],
  hnatolohiia: [
    "Здоров'я скронево-нижньощелепного суглобу",
    "Позбавляємо болю та дискомфорту в щелепі, відновлюємо її правильну роботу.",
  ],
}

/**
 * In the order the site lists them. Each carries the slug of its page, which
 * the seeder turns into the relation once the pages exist. The homepage card
 * and the index draw the same illustration here; the clinic may give the card
 * its own.
 */
export const directions = SERVICE_SLUGS.map(({ card, slug }, index) => {
  // A direction added to SERVICE_SLUGS before its copy here is seeded with
  // its name alone rather than stopping the whole seed.
  const [summary, description] = COPY[slug] ?? []
  const picture = image(`services-${index + 1}`, "")

  return {
    name: card,
    summary,
    description,
    icon: picture,
    illustration: picture,
    order: index + 1,
    pageSlug: slug,
    subdirections: SUBSERVICES.filter((item) => item.direction === slug).map(
      (item, position) => ({
        name: item.name,
        description: item.intro,
        order: position + 1,
        pageSlug: item.slug,
      })
    ),
  }
})

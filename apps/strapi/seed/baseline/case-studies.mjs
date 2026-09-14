/**
 * The two treatments the design tells end to end on /nashi-roboty.
 *
 * Every word here is the clinic's own, transcribed from the Figma frames — the
 * wording, including its typos, is left as written rather than tidied, because
 * this is clinical narrative and not ours to edit. The photographs are the
 * design's own too, exported from the same frames.
 *
 * The design switches the page between the grid and one of these when a
 * "Кейс: …" chip is chosen. Here they are laid out below the grid instead, and
 * the chips jump to them; the content is the same, the interaction is simpler.
 */

import { image, mediaUrl, text } from "./shared.mjs"

const PREPARATION_INTRO =
  "Перед тим як приступити до імплантації необхідно усунути всі запальні вогнища та інфекції, та максимально очистити ротову порожнину, інакше є ризик що інфекція перекинеться на місце приживлення імпланта."

const ALIGNMENT_INTRO =
  "Постановка імплантів не має сенсу якщо сусідні зуби в неправильному положенні, тож спочатук потрібно було їх вирівняти."

const SURGICAL_GUIDE =
  "Під час операції використовувася хірургічний шаблон – він дозволив поставити імплант точніше, тому не потрібно було проводити дорогу процедуру кісткової пластики."

const ENOUGH_BONE =
  "На щастя кісткової тканини щелепи було достатньо, тому операція з нарощування кісткової тканини не була потрібна"

const GUM_FORMER =
  "Металевий кружечок який ви бачите на зображенні – це формувач ясен який тимчасово встановлюється на імплант"

const SHEVCHUK = {
  doctorName: "Сергій Шевчук",
  doctorPhoto: image("doctor-shevchuk", "Сергій Шевчук, лікар клініки"),
}
const ZAMIATIN = {
  doctorName: "Віталій Замятін",
  doctorPhoto: image("doctor-zamiatin", "Віталій Замятін, лікар клініки"),
}
const HONCHARUK = {
  doctorName: "Артур Гончарук",
  doctorPhoto: image("doctor-honcharuk", "Артур Гончарук, лікар клініки"),
}

const pair = (slug, stage) => [
  image(`${slug}-${stage}-1`, "Стан зубів до цього етапу лікування"),
  image(`${slug}-${stage}-2`, "Стан зубів після цього етапу лікування"),
]

export const caseStudies = [
  {
    __component: "sections.case-study",
    title: "Кейс: Тотальне перевтілення посмішки",
    patient: "Пацієнтка Людмила Андрущак",
    tags: [
      "Ортодонтія",
      "Протезування",
      "Імплантація",
      "Хірургія",
      "Терапія",
      "Пародонтологія",
    ].map(text),
    videoLabel: "Дивіться відеоогляд випадку",
    videoPoster: image("case1-cover-1", "Кадр з відеоогляду випадку"),
    videoUrl: mediaUrl("hero-video"),
    before: image("case1-cover-2", "Посмішка пацієнтки до лікування"),
    after: image("case1-cover-3", "Посмішка пацієнтки після лікування"),
    stages: [
      {
        title: "1. Діагностика",
        intro: "Стан пацієнтки на початок лікування:",
        bullets: [
          "Відсутні 2 зуба: IV на верхній щелепі і VI на нижній",
          "Неправильний прикус, різці розійшлися в боки",
          "Через неправильний прикус, зуби посилено терлися один об одного і через це багато з них пошкоджені",
          "Старі зношені пломби на премолярах що потребували заміни",
          "Зуби мудрості що ростуть під неправильним кутом",
        ].map(text),
        note: "Ви можете бачити фотографії початкового стану зубів",
        images: [1, 2, 3, 4].map((n) =>
          image(`case1-s1-${n}`, "Стан зубів пацієнтки на початок лікування")
        ),
        ...SHEVCHUK,
      },
      {
        title: "2. Підготовка",
        intro: PREPARATION_INTRO,
        bullets: [
          "Комплексна професійна чистка",
          "Лікування карієсу",
          "Лікування кореневих каналів",
          "Видалення зубів мудрості",
        ].map(text),
        showBeforeAfter: true,
        images: pair("case1", "s2"),
        ...SHEVCHUK,
      },
      {
        title: "3. Вирівнювання зубів металевими брекетами",
        intro: ALIGNMENT_INTRO,
        note: "Тривалість лікування 2 роки",
        showBeforeAfter: true,
        images: pair("case1", "s3"),
        ...SHEVCHUK,
      },
      {
        title: "4. Імплантація",
        bullets: [
          "Встановлено 2 імпланта GlobalD",
          SURGICAL_GUIDE,
          ENOUGH_BONE,
        ].map(text),
        note: GUM_FORMER,
        showBeforeAfter: true,
        images: pair("case1", "s4"),
        ...ZAMIATIN,
      },
      {
        title: "5. Протезування",
        bullets: [
          "Встановлено 2 коронки на імплантах",
          "1 коронку на зуб",
          "6 вінірів",
          "5 накладок",
        ].map(text),
        note: "Всі перечислені ортопедичні конструкції виготовлені з кераміки",
        showBeforeAfter: true,
        images: pair("case1", "s5"),
        ...HONCHARUK,
      },
    ],
  },
  {
    __component: "sections.case-study",
    title: "Кейс: Імплантація та протезування на імплантах",
    patient: "Пацієнт Дмитро Степанчук",
    tags: ["Ортодонтія", "Протезування", "Імплантація", "Терапія"].map(text),
    quote:
      "“Процедура імплантації пройшла дуже комфортно, безболісно, хоча перед цим я дуже сильно хвилювався – але все пройшло на вищому рівні”",
    videoPoster: image("case2-cover-1", "Кадр з відеоогляду випадку"),
    videoUrl: mediaUrl("hero-video"),
    before: image("case2-cover-2", "Посмішка пацієнта до лікування"),
    after: image("case2-cover-3", "Посмішка пацієнта після лікування"),
    stages: [
      {
        title: "1. Діагностика",
        intro: "Відсутній другий зуб верхньої щелепи",
        ...SHEVCHUK,
      },
      {
        title: "2. Підготовка",
        intro: PREPARATION_INTRO,
        bullets: ["Комплексна професійна чистка", "Лікування карієсу"].map(
          text
        ),
        ...SHEVCHUK,
      },
      {
        title: "3. Вирівнювання зубів металевими брекетами",
        intro: ALIGNMENT_INTRO,
        note: "Тривалість лікування 2 роки",
        ...SHEVCHUK,
      },
      {
        title: "4. Імплантація",
        bullets: [
          "Встановлено 1 імплант GlobalD",
          SURGICAL_GUIDE,
          ENOUGH_BONE,
        ].map(text),
        note: GUM_FORMER,
        showBeforeAfter: true,
        images: pair("case2", "s4"),
        ...ZAMIATIN,
      },
      {
        title: "5. Протезування",
        intro:
          "Оскільки кісткової тканини було достатньо тому ми навантажили імплант коронкою через тиждень після імплантації (одноетапна імплантаці)",
        bullets: [
          "Встановили цирконієвий абатмент",
          "Встановили 1 керамічну коронку на імпланті",
          "Встановили 1 керамічний вінір",
        ].map(text),
        showBeforeAfter: true,
        images: pair("case2", "s5"),
        ...HONCHARUK,
      },
    ],
  },
]

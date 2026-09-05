/**
 * The price table the design puts on every service page.
 *
 * Read this before quoting any of it to a patient. The table is the designer's
 * placeholder, and the file says so plainly:
 *
 *  - all twenty rows are byte-identical on all seven service pages; only the
 *    heading above them changes;
 *  - every amount in it is either 500 or 200 ГРН;
 *  - the second group is titled "Анестезія" but lists CT scans and cephalograms
 *    — it is the first group copied, with one row edited.
 *
 * It is seeded anyway, because the layout is real and the page is a hole
 * without it. The clinic replaces the rows; nothing here was invented by us,
 * and nothing here should be treated as the clinic's prices.
 */

const row = (label, price) => ({ label, price })

/** The ten rows the design repeats under both headings. */
const IMAGING = [
  row("Прицільна рентгенографія", "200 ГРН"),
  row("Панорамний знімок зубів (Ортопантомограма, ОПТГ) 2 щелепи", "500 ГРН"),
  row("КТ (Комп'ютерна томографія) 1 щелепи", "500 ГРН"),
  row("КТ скронево-нижньощелепного суглобу", "500 ГРН"),
  row("КТ кореневих каналів 2-3 зубів", "500 ГРН"),
  row("Телерентгенографія (ТРГ) у боковій проекції", "500 ГРН"),
  row("ТРГ у прямій проекції", "500 ГРН"),
]

export const PLACEHOLDER_PRICE_GROUPS = [
  {
    title: "Обстеження",
    rows: [
      row("Розгорнута консультація", "500 ГРН"),
      row("Консультація", "500 ГРН"),
      row("Стерильний набір", "500 ГРН"),
      ...IMAGING,
    ],
  },
  {
    title: "Анестезія",
    rows: [
      row("Розгорнута консультація", "500 ГРН"),
      row("Анестезія провідникова", "200 ГРН"),
      row("Стерильний набір", "500 ГРН"),
      ...IMAGING,
    ],
  },
]

/** The price section as a service page carries it, under its own heading. */
export const priceList = (title) => ({
  __component: "sections.price-list",
  title,
  groups: PLACEHOLDER_PRICE_GROUPS,
})

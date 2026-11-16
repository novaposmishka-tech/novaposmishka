import { describe, expect, it } from "vitest"

import { buildLlmsTxt, type LlmsPage } from "@/lib/llms-txt"

const BASE = "https://example.test"
const page = (path: string, title: string, description?: string): LlmsPage => ({
  path,
  url: BASE + path,
  title,
  description,
})

const labels = { contacts: "Контакти", other: "Інші сторінки" }

describe("buildLlmsTxt", () => {
  it("heads the file with the clinic and its summary", () => {
    const text = buildLlmsTxt({
      name: "Нова Посмішка",
      summary: "Сімейна стоматологія\nв Житомирі.",
      contacts: [],
      pages: [page("/", "Головна")],
      labels,
    })

    expect(text).toBe("# Нова Посмішка\n\n> Сімейна стоматологія в Житомирі.\n")
  })

  it("lists contacts with their labels' colons dropped", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [
        { label: "Телефон:", lines: ["093 762 05 00", "067 762 55 00"] },
        { label: "Email:", lines: [] },
      ],
      pages: [],
      labels,
    })

    expect(text).toContain(
      "## Контакти\n\n- Телефон: 093 762 05 00, 067 762 55 00\n"
    )
    expect(text).not.toContain("Email")
  })

  it("gives a page with pages under it a section, nesting them by depth", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [],
      pages: [
        page("/", "Головна"),
        page("/poslugy", "Послуги", "Усі напрямки."),
        page("/poslugy/terapiia", "Терапія"),
        page("/poslugy/terapiia/likuvannia-kariiesu", "Лікування карієсу"),
        page("/likari", "Лікарі"),
      ],
      labels,
    })

    expect(text).toContain(
      [
        "## Послуги",
        "",
        `- [Послуги](${BASE}/poslugy): Усі напрямки.`,
        `- [Терапія](${BASE}/poslugy/terapiia)`,
        `  - [Лікування карієсу](${BASE}/poslugy/terapiia/likuvannia-kariiesu)`,
        "",
        "## Інші сторінки",
        "",
        `- [Лікарі](${BASE}/likari)`,
      ].join("\n")
    )
    expect(text).not.toContain("Головна")
  })

  it("puts each page under its parent whatever order they came in", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [],
      pages: [
        page("/poslugy", "Послуги"),
        page("/poslugy/terapiia/likuvannia-kariiesu", "Лікування карієсу"),
        page("/poslugy/ortopediia/koronky", "Коронки"),
        page("/poslugy/terapiia", "Терапія"),
        page("/poslugy/ortopediia", "Ортопедія"),
      ],
      labels,
    })

    expect(text).toContain(
      [
        `- [Терапія](${BASE}/poslugy/terapiia)`,
        `  - [Лікування карієсу](${BASE}/poslugy/terapiia/likuvannia-kariiesu)`,
        `- [Ортопедія](${BASE}/poslugy/ortopediia)`,
        `  - [Коронки](${BASE}/poslugy/ortopediia/koronky)`,
      ].join("\n")
    )
  })

  it("does not double a comma a contact line already ends on", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [
        {
          label: "Адреса:",
          lines: ["м. Житомир,", "вулиця Івана Сльоти, 50а"],
        },
      ],
      pages: [],
      labels,
    })

    expect(text).toContain("- Адреса: м. Житомир, вулиця Івана Сльоти, 50а\n")
  })

  it("keeps a page whose parent is not listed, under the next one up", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [],
      pages: [
        page("/poslugy", "Послуги"),
        page("/poslugy/terapiia/likuvannia-kariiesu", "Лікування карієсу"),
        page("/archive/old", "Стара сторінка"),
      ],
      labels,
    })

    expect(text).toContain(
      [
        `- [Послуги](${BASE}/poslugy)`,
        `- [Лікування карієсу](${BASE}/poslugy/terapiia/likuvannia-kariiesu)`,
      ].join("\n")
    )
    expect(text).toContain(`- [Стара сторінка](${BASE}/archive/old)`)
  })

  it("keeps CMS text from turning into Markdown", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [],
      pages: [
        {
          path: "/a",
          url: `${BASE}/a (b)`,
          title: "A",
          description: "Дивіться [тут](https://x.test)",
        },
      ],
      labels,
    })

    expect(text).toContain(
      String.raw`- [A](https://example.test/a%20%28b%29): Дивіться \[тут\](https://x.test)`
    )
  })

  it("keeps a page's brackets inside its link label", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [],
      pages: [page("/a", "Ціни [2026]")],
      labels,
    })

    expect(text).toContain(String.raw`- [Ціни \[2026\]](${BASE}/a)`)
  })

  it("escapes CMS text in section headings and contacts too", () => {
    const text = buildLlmsTxt({
      name: "Клініка",
      contacts: [{ label: "Сайт [новий]:", lines: ["[тут](https://x.test)"] }],
      pages: [page("/a", "Ціни [2026]"), page("/a/b", "Б")],
      labels,
    })

    expect(text).toContain(String.raw`## Ціни \[2026\]`)
    expect(text).toContain(
      String.raw`- Сайт \[новий\]: \[тут\](https://x.test)`
    )
  })
})

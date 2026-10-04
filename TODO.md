# TODO

Deferred setup steps. Each one is code-complete — only the credentials or
content are missing.

## Lead form (`/api/lead` → Telegram)

- [x] **Telegram credentials.** `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
      are set in `apps/ui/.env.local`. Without them the form answers `503` and
      logs `Telegram is not configured`.

      Every message sent from anywhere but production is prefixed with a
      "тестове повідомлення" banner, so a test lead cannot be mistaken for a
      patient.

## Blocked on content

- [ ] **One doctor portrait shows the wrong person.** The design has
      photographs for five of the eight dentists, and the clinic's previous
      site supplied Каменчук and Бучинська. Острогляд is still standing in
      with a colleague's photograph so the team page has no gap — one named
      dentist's face under another's name.

      **Replace before this page is shown outside the clinic.** He is marked
      in `apps/strapi/seed/baseline/doctors.mjs`.

- [ ] **More case photographs.** The homepage and /nashi-roboty show the
      eighteen works the clinic's previous site had, in its five tabs. Every
      further work needs its own pair of photographs, added to its tab in
      `apps/strapi/seed/baseline/cases.mjs` or through the admin panel.

- [ ] **Video URLs.** The four filmed reviews (`sections.video-reviews` →
      `videoUrl`) still carry the hero clip as a stand-in, because the design
      file contains none. Set each URL to the real film. The two case studies
      already play the clinic's own films, taken from its previous site.

- [ ] **An H.264 copy of the hero clip.** The homepage background is the old
      site's `hero-video.webm` (VP8/VP9), which Safari cannot decode — those
      readers get the hero photograph instead, which is a fair fallback but not
      the design. Ask the clinic for the same footage as `.mp4` (H.264/AAC),
      drop it in `apps/strapi/seed/media/`, and point the hero's
      `backgroundVideo` at it.

- [ ] **The real price list.** Every service page carries the design's price
      table, which is a placeholder: the twenty rows are identical on all seven
      pages, every amount is 500 or 200 ГРН, and the group titled "Анестезія"
      lists CT scans. See `apps/strapi/seed/baseline/prices.mjs`. Replace the
      rows with the clinic's own.

- [ ] **Instagram and Messenger.** The footer draws four messenger marks in the
      design and names no accounts. WhatsApp and Telegram are derived from the
      clinic's own number; the other two need handles before they can be linked
      and are not rendered until then.

- [ ] **A purpose-made Open Graph image** (1200×630). The homepage currently
      shares the clinic's hero photograph (1076×610), which the platforms crop
      a little — set as a stopgap so a shared link is not a blank card. Upload a
      proper one and point `seo.metaImage` at it.

## Known issues

- [ ] **Strapi typegen is broken** in this environment: `pnpm generate:types`
      fails with `(Typegen) Failed to generate types for contentTypes: e.charAt is not a function`.
      Reproduced on an unrelated project built from the same starter, so it is a
      Strapi 5.48 bug, not our schemas.

      Until it is fixed, entries in `apps/strapi/types/generated/*.d.ts` must be
      hand-written after a schema change (add the interface _and_ the registry
      entry at the bottom of the file). Do **not** run `pnpm sync-types` —
      `packages/strapi-types/generated` is a symlink to that folder, so its
      `cp -r` copies the folder into itself.

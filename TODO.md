# TODO

Deferred setup steps. Each one is code-complete — only the credentials or
content are missing.

## Lead form (`/api/lead` → Telegram → Strapi)

- [ ] **Telegram credentials.** Create a bot via [@BotFather](https://t.me/BotFather),
      add it to the clinic's chat, then set in `apps/ui/.env.local`:
      `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

      Until both are set the form answers `503` and logs
      `Telegram is not configured`. Everything else (validation, honeypot,
      rate limit) already works.

- [ ] **Strapi API token (optional).** Create a Custom API token in Strapi admin
      (Settings → API Tokens) with `create` permission on `Lead`, and set
      `STRAPI_REST_CUSTOM_API_KEY` in `apps/ui/.env.local`.

      Without it Telegram still receives every lead — only the copy saved to
      the admin panel is skipped (logged as `Could not save the lead to Strapi`).

## Blocked on content

- [ ] **Google Maps Embed API key.** The contact page has the map section but no
      map: Google refuses its keyless `output=embed` URL, rendering an empty
      frame, so the section ships with the address and a working "Маршрут" link
      instead. Issue a key for the Maps Embed API, then set `embedUrl` on the
      section to
      `https://www.google.com/maps/embed/v1/place?key=…&q=…` — the frame appears
      on its own, and the CSP already allows www.google.com.

- [ ] **Doctor portraits.** The design has photographs for three of the eight
      dentists on /likari; the other five render without one.

- [ ] **More case photographs.** The homepage and /nashi-roboty show the
      three before/after cases the design provides. Every further case needs its
      own pair of photographs.

- [ ] **The Open Graph image** (1200×630). Upload it and set it on the
      homepage's SEO component; `og:image` is omitted while it is missing.

## Known issues

- [ ] **Strapi typegen is broken** in this environment: `pnpm generate:types`
      fails with `(Typegen) Failed to generate types for contentTypes:
e.charAt is not a function`. Reproduced on an unrelated project built
      from the same starter, so it is a Strapi 5.48 bug, not our schemas.

          Until it is fixed, entries in `apps/strapi/types/generated/*.d.ts` must be
          hand-written after a schema change (add the interface _and_ the registry
          entry at the bottom of the file). Do **not** run `pnpm sync-types` —
          `packages/strapi-types/generated` is a symlink to that folder, so its
          `cp -r` copies the folder into itself.

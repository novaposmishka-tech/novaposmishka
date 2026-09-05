#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Creates the Ukrainian baseline content (homepage, Navbar, Footer) in an
 * otherwise empty database.
 *
 * The starter seeds from a `strapi export` tarball, which needs someone to
 * produce it from a populated instance first. This script covers the other
 * direction: it builds the baseline from the copy in `seed/baseline/`, so a
 * fresh clone (or a database whose demo locales were deleted) can reach a
 * rendering site without an admin session.
 *
 * It only ever creates what is missing — an existing document is left exactly
 * as the editors last saved it. Pass `--force` to replace them instead.
 */

import { createRequire } from "node:module"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import { ensureMedia, resolveMediaMarkers } from "./seed-media.mjs"
import { casesPage } from "../seed/baseline/cases.mjs"
import { contactsPage } from "../seed/baseline/contacts.mjs"
import { doctorsPage } from "../seed/baseline/doctors.mjs"
import { servicePages } from "../seed/baseline/services.mjs"
import { footer, homepage, locale, navbar } from "../seed/baseline/uk.mjs"

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)

const force = process.argv.includes("--force")

process.env.STRAPI_TELEMETRY_DISABLED ??= "1"
const { compileStrapi, createStrapi } = require("@strapi/strapi")

normalizeDatabaseHost()

let strapi

try {
  strapi = await loadStrapi()

  await ensureLocale()

  const media = await ensureMedia(strapi, path.join(appDir, "seed", "media"), {
    log: console.log,
  })
  const missingMedia = new Set()
  const resolve = (data) => resolveMediaMarkers(data, media, missingMedia)

  // Pages first: the navbar and the service cards link to them by slug, and
  // those links need documentIds that only exist once the pages do.
  const pageIds = new Map()
  for (const page of [...servicePages, casesPage, doctorsPage, contactsPage]) {
    pageIds.set(page.slug, await seedPage(page.slug, resolve(page)))
  }

  const missingPages = new Set()
  const link = (data) => resolvePageLinks(resolve(data), pageIds, missingPages)

  await seedSingleType("api::navbar.navbar", "Navbar", link(navbar))
  await seedSingleType("api::footer.footer", "Footer", link(footer))
  await seedPage(homepage.slug, link(homepage))

  if (missingPages.size > 0) {
    console.warn(
      `[seed:content] Dropped ${missingPages.size} link(s) to pages that were not seeded: ${[...missingPages].join(", ")}`
    )
  }

  if (missingMedia.size > 0) {
    console.warn(
      `[seed:content] Dropped ${missingMedia.size} image(s) with no file in seed/media: ${[...missingMedia].join(", ")}`
    )
  }

  console.log("[seed:content] Done.")
} catch (error) {
  console.error("[seed:content] Failed to seed the baseline content.")
  console.error(error instanceof Error ? (error.stack ?? error.message) : error)
  process.exitCode = 1
} finally {
  await shutDown()
}

/**
 * Leaves without tearing the Strapi instance down.
 *
 * Writing a page fans out into background work — the i18n sync and the
 * revalidation middleware both keep querying after the document service call
 * resolves. `strapi.destroy()` aborts those pending pool operations, and the
 * rejections it raises land outside any await here, crashing an otherwise
 * successful seed. Every document call above is committed by the time we get
 * here, so there is nothing left to flush: exit and let the pool die with the
 * process.
 */
async function shutDown() {
  // console.log is asynchronous when stdout is a pipe, so drain it first —
  // process.exit would otherwise truncate the seed's own output.
  await new Promise((resolve) => process.stdout.write("", resolve))

  process.exit(process.exitCode ?? 0)
}

async function loadStrapi() {
  const appContext = await compileStrapi({
    appDir,
    distDir: path.join(appDir, "dist"),
    autoReload: false,
    serveAdminPanel: false,
  })
  const app = createStrapi(appContext)

  app.log.level = "error"

  return app.load()
}

/**
 * The content below is written in one locale only, so a database that does not
 * have it yet would silently store everything under the default one.
 */
async function ensureLocale() {
  const locales = await strapi.plugin("i18n").service("locales").find()

  if (locales.every((entry) => entry.code !== locale)) {
    throw new Error(
      `Locale "${locale}" does not exist. Add it in Settings → Internationalization first.`
    )
  }
}

async function seedSingleType(uid, label, data) {
  const existing = await strapi
    .documents(uid)
    .findFirst({ locale, fields: ["documentId"] })

  if (existing && !force) {
    console.log(`[seed:content] ${label}: exists, left untouched.`)

    return
  }

  if (existing) {
    await strapi.documents(uid).update({
      documentId: existing.documentId,
      locale,
      data,
    })
    console.log(`[seed:content] ${label}: replaced.`)

    return
  }

  await strapi.documents(uid).create({ locale, data })
  console.log(`[seed:content] ${label}: created.`)
}

/** @returns {Promise<string>} the page's documentId, for links pointing at it. */
async function seedPage(label, page) {
  const uid = "api::page.page"
  const existing = await strapi.documents(uid).findFirst({
    locale,
    fields: ["documentId"],
    filters: { fullPath: page.fullPath },
    status: "draft",
  })

  if (existing && !force) {
    console.log(`[seed:content] Page ${label}: exists, left untouched.`)

    return existing.documentId
  }

  const document = existing
    ? await strapi.documents(uid).update({
        documentId: existing.documentId,
        locale,
        data: page,
      })
    : await strapi.documents(uid).create({ locale, data: page })

  // The UI reads published documents, so a draft-only page still 404s.
  await strapi
    .documents(uid)
    .publish({ documentId: document.documentId, locale })

  console.log(
    `[seed:content] Page ${label}: ${existing ? "replaced" : "created"} and published.`
  )

  return document.documentId
}

/**
 * Turns every `pageLink()` marker into a `utilities.link` relation.
 *
 * Seeded links point at other seeded pages by slug, because a documentId is
 * only known once the page exists and differs per database. Storing the
 * relation rather than a path means a link keeps working if the page is later
 * moved under a different parent.
 */
function resolvePageLinks(value, pageIds, missing = new Set()) {
  if (Array.isArray(value)) {
    return value
      .map((item) => resolvePageLinks(item, pageIds, missing))
      .filter((item) => item !== undefined)
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  if (typeof value.__pageSlug === "string") {
    const documentId = pageIds.get(value.__pageSlug)

    if (documentId == null) {
      missing.add(value.__pageSlug)

      // Undefined, so the callers above drop the key or the array entry.
      return
    }

    const { __pageSlug, ...rest } = value

    return { ...rest, type: "page", page: documentId }
  }

  const out = {}
  for (const [key, item] of Object.entries(value)) {
    const resolved = resolvePageLinks(item, pageIds, missing)
    if (resolved !== undefined) {
      out[key] = resolved
    }
  }

  return out
}

function normalizeDatabaseHost() {
  if (process.env.DATABASE_HOST === "0.0.0.0") {
    process.env.DATABASE_HOST = "localhost"
  }
}

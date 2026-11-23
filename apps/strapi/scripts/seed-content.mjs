#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Creates the Ukrainian baseline content (the pages, Navbar, Footer) in an
 * otherwise empty database.
 *
 * The starter seeds from a `strapi export` tarball, which needs someone to
 * produce it from a populated instance first. This script covers the other
 * direction: it builds the baseline from the copy in `seed/baseline/`, so a
 * fresh clone (or a database whose demo locales were deleted) can reach a
 * rendering site without an admin session.
 *
 * It only ever creates what is missing — an existing document is left exactly
 * as the editors last saved it. Pass `--force` to replace them all instead,
 * or `--only=nashi-roboty,/` to replace just the pages named, by slug.
 * Neither reaches the directions or the works: those are seeded once, into a
 * database without them, and are the editors' from then on.
 *
 * A page the seed creates is also hung under its parent. One that already
 * exists is not, even when it is replaced — an editor may have moved it, or
 * taken it out of the tree — unless `--link-parents` asks for it.
 *
 * Bringing an older database up to the current baseline is therefore a
 * deliberate step, not something a plain run does. One seeded before the
 * services index existed gets the index and the sub-service pages from a
 * plain run, and then needs, once:
 *
 *   --link-parents           the direction pages hung under the index
 *
 * and its Navbar and Footer edited by hand, or replaced with `--force` along
 * with everything else, for the links to the index.
 *
 * The directions and the procedures under them are entries of their own, not
 * part of any page. They are seeded once, into a database that has none, and
 * are the editors' from then on; the works are only created into an empty
 * collection too.
 */

import { createRequire } from "node:module"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import {
  ensureMedia,
  pruneOrphanedMediaLinks,
  resolveMediaMarkers,
} from "./seed-media.mjs"
import { casesPage, works } from "../seed/baseline/cases.mjs"
import { contactsPage } from "../seed/baseline/contacts.mjs"
import { directions } from "../seed/baseline/directions.mjs"
import { doctors, doctorsPage } from "../seed/baseline/doctors.mjs"
import { feedbacksPage } from "../seed/baseline/feedbacks.mjs"
import { servicePages } from "../seed/baseline/services.mjs"
import {
  servicesIndexPage,
  subservicePages,
} from "../seed/baseline/subservices.mjs"
import { footer, homepage, locale, navbar } from "../seed/baseline/uk.mjs"

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)

const force = process.argv.includes("--force")
const linkParents = process.argv.includes("--link-parents")

/**
 * The pages this run wrote — made or, where asked, replaced — and of those
 * the ones it made from nothing. A page it wrote is its to link up once
 * everything exists; only a page it made is its to place in the tree, since
 * a replaced one was somewhere an editor may have chosen.
 */
const written = new Set()
const created = new Set()
const only = new Set(
  process.argv
    .find((arg) => arg.startsWith("--only="))
    ?.slice("--only=".length)
    .split(",")
    .filter(Boolean)
)

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
  const resolveMedia = (data) => resolveMediaMarkers(data, media, missingMedia)

  // Doctors before the pages: the team blocks and the treatment stages point
  // at them by documentId, as the works do further down.
  const doctorIds = await seedDoctors(doctors, resolveMedia)
  const missingDoctors = new Set()
  const resolve = (data) =>
    resolveDoctorRefs(resolveMedia(data), doctorIds, missingDoctors)

  // Pages first: the navbar and the service cards link to them by slug, and
  // those links need documentIds that only exist once the pages do.
  const pageIds = new Map()
  const missingPages = new Set()
  const link = (data) => resolvePageLinks(resolve(data), pageIds, missingPages)

  // The pages link to one another in a ring — a direction lists its
  // sub-services, each of which points back at it, and the index points at
  // them all — so no order has every target in place first. Each page is
  // seeded with the links that can be resolved so far, and one this run
  // wrote while some could not is written again once every page exists.
  const unlinked = []
  for (const page of [
    ...servicePages,
    casesPage,
    doctorsPage,
    contactsPage,
    feedbacksPage,
    ...subservicePages,
    servicesIndexPage,
  ]) {
    const dropped = new Set()
    const data = resolvePageLinks(resolve(page), pageIds, dropped)

    pageIds.set(page.slug, await seedPage(page.slug, data))

    if (dropped.size > 0 && written.has(page.fullPath)) {
      unlinked.push(page)
    }
  }

  for (const page of unlinked) {
    await seedPage(page.slug, link(page), { relink: true })
  }

  // Parents last: the index is the parent of pages seeded before it.
  const placed = []
  for (const page of [...servicePages, ...subservicePages]) {
    if (
      (created.has(page.fullPath) || linkParents) &&
      (await linkParent(page, pageIds))
    ) {
      placed.push(page.fullPath)
    }
  }
  await revalidatePages(placed)

  await seedSingleType("api::navbar.navbar", "Navbar", link(navbar))
  await seedSingleType("api::footer.footer", "Footer", link(footer))
  await seedPage(homepage.slug, link(homepage))

  // The directions lead to the pages seeded above, and the works are filed
  // under them.
  await seedDirections(directions, resolve, pageIds, missingPages)
  await seedWorks(works, resolve)

  if (missingPages.size > 0) {
    console.warn(
      `[seed:content] Dropped ${missingPages.size} link(s) to pages that were not seeded: ${[...missingPages].join(", ")}`
    )
  }

  if (missingDoctors.size > 0) {
    console.warn(
      `[seed:content] Dropped ${missingDoctors.size} reference(s) to doctors that were not seeded: ${[...missingDoctors].join(", ")}`
    )
  }

  if (missingMedia.size > 0) {
    console.warn(
      `[seed:content] Dropped ${missingMedia.size} image(s) with no file in seed/media: ${[...missingMedia].join(", ")}`
    )
  }

  await pruneOrphanedMediaLinks(strapi, { log: console.log })

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

/**
 * Creates the clinic's doctors, one Doctor document each, matched on the full
 * name. A doctor already there is left as the editors last saved them unless
 * `--force` is given.
 *
 * @returns {Promise<Map<string, string>>} each doctor's documentId by name.
 */
async function seedDoctors(entries, resolve) {
  const uid = "api::doctor.doctor"
  const ids = new Map()

  for (const doctor of entries) {
    const existing = await strapi.documents(uid).findFirst({
      fields: ["documentId"],
      filters: { name: doctor.name },
    })

    if (existing && !force) {
      ids.set(doctor.name, existing.documentId)
      console.log(
        `[seed:content] Doctor ${doctor.name}: exists, left untouched.`
      )

      continue
    }

    const data = resolve(doctor)
    const document = existing
      ? await strapi
          .documents(uid)
          .update({ documentId: existing.documentId, data })
      : await strapi.documents(uid).create({ data })

    ids.set(doctor.name, document.documentId)
    console.log(
      `[seed:content] Doctor ${doctor.name}: ${existing ? "replaced" : "created"}.`
    )
  }

  return ids
}

/**
 * Marks the directions as seeded. The key is the one the start-up fill used
 * to mark itself with, so a database it filled counts as seeded too.
 */
const DIRECTIONS_SEEDED = {
  type: "strapi",
  name: "migrations",
  key: "directions-filled",
}

/**
 * Creates the directions and the procedures under each, linked to their
 * pages — once, into a database that has none. After that they are the
 * editors': a direction renamed or a procedure deleted is not brought back.
 *
 * Everything is written in one transaction with the mark, so a run that fails
 * leaves nothing behind and the next one starts afresh. A page slug that was
 * not seeded is reported with the other dropped links.
 */
async function seedDirections(entries, resolve, pageIds, missingPages) {
  const uid = "api::direction.direction"

  if (
    (await strapi.store.get(DIRECTIONS_SEEDED)) ||
    (await strapi.documents(uid).count({})) > 0
  ) {
    console.log("[seed:content] Directions: exist, left untouched.")

    return
  }

  const pageOf = (slug) => {
    const documentId = pageIds.get(slug)

    if (documentId == null) {
      missingPages.add(slug)
    }

    return documentId
  }
  let made = 0

  await strapi.db.transaction(async () => {
    for (const { pageSlug, subdirections, ...direction } of entries) {
      const created = await strapi.documents(uid).create({
        data: { ...resolve(direction), page: pageOf(pageSlug) },
      })

      for (const { pageSlug: procedurePage, ...procedure } of subdirections) {
        await strapi.documents("api::subdirection.subdirection").create({
          data: {
            ...resolve(procedure),
            direction: created.documentId,
            page: pageOf(procedurePage),
          },
        })
        made += 1
      }

      made += 1
    }

    await strapi.store.set({ ...DIRECTIONS_SEEDED, value: true })
  })

  console.log(`[seed:content] Directions and procedures: created ${made}.`)
}

/**
 * Creates the clinic's works, filed under their direction and procedure by
 * name. They are only made into an empty collection: a work has no name to
 * match an existing one on, and the editors may have added, removed or
 * re-filed any of them.
 */
async function seedWorks(entries, resolve) {
  const uid = "api::work.work"

  if ((await strapi.documents(uid).count({})) > 0) {
    console.log("[seed:content] Works: exist, left untouched.")

    return
  }

  const directions = await strapi
    .documents("api::direction.direction")
    .findMany({
      fields: ["name"],
      populate: { subdirections: { fields: ["name"] } },
    })
  const unfiled = []

  for (const { direction, subdirection, ...work } of entries) {
    const filedUnder = directions.find((entry) => entry.name === direction)
    const procedure = filedUnder?.subdirections?.find(
      (entry) => entry.name === subdirection
    )

    if (!filedUnder || (subdirection && !procedure)) {
      unfiled.push(
        `${work.caption} (${[direction, subdirection].filter(Boolean).join(" / ")})`
      )
    }

    await strapi.documents(uid).create({
      data: {
        ...resolve(work),
        direction: filedUnder?.documentId,
        subdirection: procedure?.documentId,
      },
    })
  }

  console.log(`[seed:content] Works: created ${entries.length}.`)

  if (unfiled.length > 0) {
    console.warn(
      `[seed:content] ${unfiled.length} work(s) name a direction or procedure that does not exist: ${unfiled.join(", ")}`
    )
  }
}

/**
 * Turns every `doctorRef()` marker into the doctor's documentId, which is
 * what a relation to the Doctor collection is written with.
 */
function resolveDoctorRefs(value, doctorIds, missing) {
  if (Array.isArray(value)) {
    return value
      .map((item) => resolveDoctorRefs(item, doctorIds, missing))
      .filter((item) => item !== undefined)
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  if (typeof value.__doctor === "string") {
    const documentId = doctorIds.get(value.__doctor)

    if (documentId == null) {
      missing.add(value.__doctor)
    }

    // Undefined drops the key or the array entry in the callers above.
    return documentId ?? undefined
  }

  const out = {}
  for (const [key, item] of Object.entries(value)) {
    const resolved = resolveDoctorRefs(item, doctorIds, missing)
    if (resolved !== undefined) {
      out[key] = resolved
    }
  }

  return out
}

/**
 * Hangs a page under the one its `__parentSlug` names, which is what Strapi
 * builds the breadcrumb trail from.
 *
 * It is called for a page this run made from nothing, and for an existing
 * one only where `--link-parents` asked. Either way a page that has a parent
 * keeps it, and nothing is published that was not: the relation is written
 * to the draft and to the published version each in its own right, so an
 * unfinished draft stays a draft and a withdrawn page stays withdrawn.
 *
 * @returns {Promise<boolean>} whether anything was written; the caller tells
 *   the UI about all of them at once.
 */
async function linkParent({ slug, fullPath, __parentSlug }, pageIds) {
  const parentId = pageIds.get(__parentSlug)

  if (!parentId) {
    return false
  }

  const pages = strapi.db.query("api::page.page")
  const [versions, parents] = await Promise.all([
    pages.findMany({ where: { fullPath, locale }, populate: { parent: true } }),
    pages.findMany({ where: { documentId: parentId, locale } }),
  ])
  let placed = false

  for (const version of versions) {
    // A draft hangs under the parent's draft, a published version under its
    // published one.
    const parent = parents.find(
      (candidate) =>
        Boolean(candidate.publishedAt) === Boolean(version.publishedAt)
    )

    if (version.parent || !parent) {
      continue
    }

    await pages.update({
      where: { id: version.id },
      data: { parent: parent.id },
    })
    placed = true
  }

  if (placed) {
    console.log(`[seed:content] Page ${slug}: placed under ${__parentSlug}.`)
  }

  return placed
}

/**
 * Tells the UI the pages placed under a parent have changed.
 *
 * The parent is written under the document service, which is what would
 * otherwise send this, and a page fetched between its creation and that
 * write was cached with a trail that stops short. One request for the lot:
 * each carries the tag every page is read through, so a second would clear
 * nothing the first had not.
 */
async function revalidatePages(fullPaths) {
  if (fullPaths.length === 0) {
    return
  }

  try {
    await strapi
      .service("api::revalidate.revalidate")
      .run({ uid: "api::page.page", fullPaths, locale })
  } catch (error) {
    // The UI may simply not be running; its cache then has nothing to clear.
    console.warn(
      `[seed:content] Could not tell the UI to refetch the placed pages (${error instanceof Error ? error.message : error}).`
    )
  }
}

/** @returns {Promise<string>} the page's documentId, for links pointing at it. */
async function seedPage(label, { __parentSlug, ...page }, { relink } = {}) {
  const uid = "api::page.page"
  const existing = await strapi.documents(uid).findFirst({
    locale,
    fields: ["documentId"],
    filters: { fullPath: page.fullPath },
    status: "draft",
  })

  // `relink` is the second pass over a page this run has already written.
  if (existing && !force && !only.has(label) && !relink) {
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
    relink
      ? `[seed:content] Page ${label}: linked to the pages seeded after it.`
      : `[seed:content] Page ${label}: ${existing ? "replaced" : "created"} and published.`
  )

  written.add(page.fullPath)
  if (!existing) {
    created.add(page.fullPath)
  }

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

#!/usr/bin/env node

/* eslint-disable no-console */

import { spawn } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import readline from "node:readline/promises"
import { fileURLToPath } from "node:url"

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const envPath = path.join(appDir, ".env")
const seedCheckScript = path.join(appDir, "scripts", "seed-check.mjs")
const seedContentScript = path.join(appDir, "scripts", "seed-content.mjs")
const seedImportScript = path.join(appDir, "scripts", "seed-import.sh")
const seedExportsDir = path.join(appDir, "seed", "exports")

if (existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

const strapiArgs = process.argv.slice(2)

if (strapiArgs.length === 0) {
  console.error(
    "[seed] Missing Strapi command. Example: seed-runner.mjs develop"
  )
  process.exit(1)
}

const enabled = parseBoolean(
  process.env.AUTO_SEED_ENABLED,
  strapiArgs[0] === "develop"
)
const mode = (process.env.AUTO_SEED_MODE || "empty").toLowerCase()
const isDevelopCommand = strapiArgs[0] === "develop"

try {
  if (enabled) {
    await maybeSeed(mode)
  } else {
    console.log("[seed] Auto-seed disabled.")
  }

  await runStrapi(strapiArgs)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

async function maybeSeed(mode) {
  if (mode === "skip") {
    console.log("[seed] AUTO_SEED_MODE=skip; skipping the baseline restore.")

    return
  }

  if (mode === "force") {
    console.log("[seed] AUTO_SEED_MODE=force; restoring the baseline content.")
    await runSeed()

    return
  }

  if (!["empty", "prompt"].includes(mode)) {
    throw new Error(
      `[seed] Unsupported AUTO_SEED_MODE="${mode}". Use empty, prompt, force, or skip.`
    )
  }

  const seedState = await runSeedCheck()

  if (seedState === "unknown") {
    console.warn("[seed] Seed check failed; starting Strapi without auto-seed.")

    return
  }

  if (mode === "empty") {
    if (seedState === "missing") {
      console.log("[seed] Baseline content missing; restoring it.")
      await runSeed()

      return
    }

    console.log("[seed] Baseline content exists; nothing to restore.")

    return
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    if (seedState === "missing") {
      console.log(
        "[seed] AUTO_SEED_MODE=prompt is non-interactive; restoring because baseline content is missing."
      )
      await runSeed()

      return
    }

    console.log(
      "[seed] AUTO_SEED_MODE=prompt is non-interactive; skipping because baseline content exists."
    )

    return
  }

  const question =
    seedState === "missing"
      ? "Baseline content is missing. Restore it? [y/N] "
      : "Baseline content exists. Overwrite the database with the baseline? [y/N] "

  if (await confirm(question)) {
    await runSeed()

    return
  }

  console.log("[seed] Restore skipped.")
}

/**
 * Restores the baseline content, preferring a `strapi export` tarball when the
 * team has produced one and falling back to the checked-in Ukrainian baseline
 * otherwise. Without the fallback an empty database has nothing to import, and
 * the missing tarball would stop Strapi from starting at all.
 */
async function runSeed() {
  if (hasSeedExport()) {
    await runCommand("bash", [seedImportScript])

    return
  }

  console.log(
    "[seed] No seed export found; creating the baseline content instead."
  )
  await runCommand(process.execPath, [seedContentScript])
}

function hasSeedExport() {
  if (!existsSync(seedExportsDir)) {
    return false
  }

  return readdirSync(seedExportsDir).some(
    (entry) => entry.startsWith("strapi-export-") && entry.endsWith(".tar.gz")
  )
}

async function runSeedCheck() {
  let result

  try {
    result = await runCommand(process.execPath, [seedCheckScript], {
      allowExitCodes: [0, 10],
    })
  } catch (error) {
    if (isDevelopCommand) {
      console.warn(error instanceof Error ? error.message : error)

      return "unknown"
    }

    throw error
  }

  return result.exitCode === 10 ? "missing" : "ready"
}

async function runStrapi(args) {
  const strapiBin = path.join(
    appDir,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "strapi.cmd" : "strapi"
  )

  // On Windows the bin is a .cmd file, which Node refuses to spawn without a
  // shell (EINVAL) since the CVE-2024-27980 hardening. Use a shell there.
  await runCommand(strapiBin, args, { shell: process.platform === "win32" })
}

async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    const answer = await rl.question(question)

    return ["y", "yes"].includes(answer.trim().toLowerCase())
  } finally {
    rl.close()
  }
}

function runCommand(command, args, options = {}) {
  const allowExitCodes = options.allowExitCodes || [0]

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: appDir,
      env: process.env,
      stdio: "inherit",
      shell: options.shell ?? false,
    })

    child.on("error", reject)
    child.on("exit", (exitCode, signal) => {
      if (signal) {
        reject(
          new Error(`[seed] Command "${command}" exited with signal ${signal}.`)
        )

        return
      }

      if (!allowExitCodes.includes(exitCode)) {
        reject(
          new Error(`[seed] Command "${command}" exited with code ${exitCode}.`)
        )

        return
      }

      resolve({ exitCode })
    })
  })
}

function parseBoolean(value, fallback) {
  if (value === undefined) {
    return fallback
  }

  return ["1", "true"].includes(value.toLowerCase())
}

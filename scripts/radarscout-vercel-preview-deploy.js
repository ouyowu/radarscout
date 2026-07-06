#!/usr/bin/env node

const { spawnSync } = require("node:child_process")
const path = require("node:path")

const EXPECTED_SCOPE = process.env.RADARSCOUT_VERCEL_SCOPE || "ouyowus-projects"

function fail(message) {
  console.error(`[radarscout-vercel-preview-deploy] ${message}`)
  process.exit(1)
}

function isProductionFlag(args, index) {
  const arg = args[index]
  const next = args[index + 1]

  return arg === "--prod" ||
    arg === "--target=production" ||
    arg === "--environment=production" ||
    (arg === "--target" && next === "production") ||
    (arg === "--environment" && next === "production")
}

function assertSafeArgs(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (isProductionFlag(args, index)) {
      fail("Production deploy flags are not allowed. Use the explicit production deploy task instead.")
    }

    if (arg === "--scope" || arg === "-S" || arg.startsWith("--scope=")) {
      fail(`Do not pass a custom Vercel scope. This wrapper always uses ${EXPECTED_SCOPE}.`)
    }
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: options.stdio ?? "inherit",
  })

  if (result.error) {
    fail(result.error.message)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  return result
}

function main() {
  const passThroughArgs = process.argv.slice(2)
  assertSafeArgs(passThroughArgs)

  const guardPath = path.join(__dirname, "radarscout-vercel-preview-guard.js")
  run(process.execPath, [guardPath, ...passThroughArgs])

  const vercelArgs = ["vercel", "--yes", "--scope", EXPECTED_SCOPE, ...passThroughArgs]

  if (process.env.RADARSCOUT_PREVIEW_DEPLOY_DRY_RUN === "1") {
    console.log(`[radarscout-vercel-preview-deploy] ${["npx", ...vercelArgs].join(" ")}`)
    return
  }

  run("npx", vercelArgs)
}

main()

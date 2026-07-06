#!/usr/bin/env node

const { execFileSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

const EXPECTED_PROJECT = {
  projectId: process.env.RADARSCOUT_VERCEL_PROJECT_ID || "prj_TG7h3uoTkZR5OdlIoroJOj3T5uUy",
  orgId: process.env.RADARSCOUT_VERCEL_ORG_ID || "team_rYfDZREL984WsFj6Fn1kS2Cp",
  projectName: process.env.RADARSCOUT_VERCEL_PROJECT_NAME || "reddit-monitor",
}

function fail(message) {
  console.error(`[radarscout-vercel-preview-guard] ${message}`)
  process.exit(1)
}

function readProjectJson(cwd) {
  const projectPath = path.join(cwd, ".vercel", "project.json")

  if (!fs.existsSync(projectPath)) {
    fail("Missing .vercel/project.json. Run: npx vercel link --yes --project reddit-monitor --scope ouyowus-projects")
  }

  try {
    return JSON.parse(fs.readFileSync(projectPath, "utf8"))
  } catch (error) {
    fail(`Could not parse .vercel/project.json: ${error.message}`)
  }
}

function getGitStatus(cwd) {
  try {
    return execFileSync("git", ["status", "--short"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim()
  } catch (error) {
    fail(`Could not read git status: ${error.message}`)
  }
}

function assertPreviewOnlyArgs(args) {
  if (args.includes("--prod") || args.includes("--target=production") || args.includes("--target") && args.includes("production")) {
    fail("Production deploy flags are not allowed by this preview guard.")
  }
}

function assertNoLocalEnv(cwd) {
  const localEnvPath = path.join(cwd, ".env.local")

  if (fs.existsSync(localEnvPath)) {
    fail("Refusing preview deploy with .env.local present. Remove it so preview uses Vercel Preview environment variables.")
  }
}

function assertProject(projectJson) {
  for (const [key, expected] of Object.entries(EXPECTED_PROJECT)) {
    if (projectJson[key] !== expected) {
      fail(`Wrong Vercel project ${key}. Expected ${expected}, got ${projectJson[key] || "<missing>"}.`)
    }
  }
}

function main() {
  const cwd = process.cwd()

  assertPreviewOnlyArgs(process.argv.slice(2))

  const status = getGitStatus(cwd)
  if (status) {
    fail(`Worktree is not clean:\n${status}`)
  }

  assertNoLocalEnv(cwd)
  assertProject(readProjectJson(cwd))

  console.log("[radarscout-vercel-preview-guard] OK: clean worktree and correct reddit-monitor Vercel Preview project.")
}

main()

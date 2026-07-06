#!/usr/bin/env node

const { execFileSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

const SAFE_GITIGNORE_ADDITIONS = new Set([
  ".env*",
  ".env.local",
  ".vercel",
  ".vercel/",
])

function fail(message) {
  console.error(`[radarscout-vercel-preview-link-cleanup] ${message}`)
  process.exit(1)
}

function runGit(args, cwd) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    })
  } catch (error) {
    fail(`Git command failed: git ${args.join(" ")}\n${error.stderr?.toString().trim() || error.message}`)
  }
}

function removeLocalEnv(cwd) {
  const localEnvPath = path.join(cwd, ".env.local")

  if (!fs.existsSync(localEnvPath)) return false

  fs.unlinkSync(localEnvPath)
  return true
}

function gitignoreHasOnlySafeVercelAdditions(cwd) {
  const diff = runGit(["diff", "--unified=0", "--", ".gitignore"], cwd)
  if (!diff.trim()) return false

  const meaningfulLines = diff
    .split("\n")
    .filter(line => line.length > 0)
    .filter(line => !line.startsWith("diff --git "))
    .filter(line => !line.startsWith("index "))
    .filter(line => !line.startsWith("--- "))
    .filter(line => !line.startsWith("+++ "))
    .filter(line => !line.startsWith("@@"))

  if (meaningfulLines.length === 0) return false

  return meaningfulLines.every(line => {
    if (line.startsWith("-")) return false
    if (!line.startsWith("+")) return false

    return SAFE_GITIGNORE_ADDITIONS.has(line.slice(1).trim())
  })
}

function restoreSafeGitignore(cwd) {
  const changed = runGit(["status", "--short", "--", ".gitignore"], cwd).trim()
  if (!changed) return false

  if (!gitignoreHasOnlySafeVercelAdditions(cwd)) {
    fail(".gitignore has changes beyond Vercel CLI preview-link additions. Review it manually before preview deploy.")
  }

  runGit(["checkout", "--", ".gitignore"], cwd)
  return true
}

function main() {
  const cwd = process.cwd()
  const removedLocalEnv = removeLocalEnv(cwd)
  const restoredGitignore = restoreSafeGitignore(cwd)

  if (!removedLocalEnv && !restoredGitignore) {
    console.log("[radarscout-vercel-preview-link-cleanup] No Vercel preview-link cleanup needed.")
    return
  }

  const actions = [
    removedLocalEnv ? "removed .env.local" : null,
    restoredGitignore ? "restored .gitignore Vercel CLI additions" : null,
  ].filter(Boolean)

  console.log(`[radarscout-vercel-preview-link-cleanup] OK: ${actions.join("; ")}.`)
}

main()

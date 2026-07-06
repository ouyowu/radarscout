const assert = require("node:assert/strict")
const { execFileSync, spawnSync } = require("node:child_process")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const test = require("node:test")

const repoRoot = path.resolve(__dirname, "..", "..")
const scriptPath = path.join(repoRoot, "scripts", "radarscout-vercel-preview-link-cleanup.js")

function makeFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "radarscout-preview-link-cleanup-"))

  execFileSync("git", ["init"], { cwd: dir, stdio: "ignore" })
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: dir })
  execFileSync("git", ["config", "user.name", "Test User"], { cwd: dir })

  fs.writeFileSync(path.join(dir, ".gitignore"), "node_modules/\n.env.local\n.vercel\n")
  fs.writeFileSync(path.join(dir, "README.md"), "fixture\n")
  execFileSync("git", ["add", ".gitignore", "README.md"], { cwd: dir })
  execFileSync("git", ["commit", "-m", "init"], { cwd: dir, stdio: "ignore" })

  return dir
}

function runCleanup(cwd) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    encoding: "utf8",
  })
}

test("removes .env.local and restores safe Vercel .gitignore additions", () => {
  const cwd = makeFixture()
  fs.writeFileSync(path.join(cwd, ".env.local"), "DATABASE_URL=redacted\n")
  fs.appendFileSync(path.join(cwd, ".gitignore"), ".env.local\n.vercel\n")

  const result = runCleanup(cwd)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /removed \.env\.local/)
  assert.match(result.stdout, /restored \.gitignore Vercel CLI additions/)
  assert.equal(fs.existsSync(path.join(cwd, ".env.local")), false)
  assert.equal(execFileSync("git", ["status", "--short"], { cwd, encoding: "utf8" }).trim(), "")
})

test("restores Vercel CLI .env* additions", () => {
  const cwd = makeFixture()
  fs.appendFileSync(path.join(cwd, ".gitignore"), ".env*\n")

  const result = runCleanup(cwd)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /restored \.gitignore Vercel CLI additions/)
  assert.equal(execFileSync("git", ["status", "--short"], { cwd, encoding: "utf8" }).trim(), "")
})

test("removes .env.local when .gitignore does not need cleanup", () => {
  const cwd = makeFixture()
  fs.writeFileSync(path.join(cwd, ".env.local"), "DATABASE_URL=redacted\n")

  const result = runCleanup(cwd)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /removed \.env\.local/)
  assert.doesNotMatch(result.stdout, /restored \.gitignore/)
  assert.equal(fs.existsSync(path.join(cwd, ".env.local")), false)
})

test("does nothing when Vercel link side effects are absent", () => {
  const cwd = makeFixture()

  const result = runCleanup(cwd)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /No Vercel preview-link cleanup needed/)
})

test("refuses to restore non-Vercel .gitignore changes", () => {
  const cwd = makeFixture()
  fs.appendFileSync(path.join(cwd, ".gitignore"), "coverage/\n")

  const result = runCleanup(cwd)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /\.gitignore has changes beyond Vercel CLI preview-link additions/)
  assert.match(fs.readFileSync(path.join(cwd, ".gitignore"), "utf8"), /coverage\//)
})

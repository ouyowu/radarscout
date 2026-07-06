const assert = require("node:assert/strict")
const { execFileSync, spawnSync } = require("node:child_process")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const test = require("node:test")

const repoRoot = path.resolve(__dirname, "..", "..")
const scriptPath = path.join(repoRoot, "scripts", "radarscout-vercel-preview-guard.js")

const correctProject = {
  projectId: "prj_TG7h3uoTkZR5OdlIoroJOj3T5uUy",
  orgId: "team_rYfDZREL984WsFj6Fn1kS2Cp",
  projectName: "reddit-monitor",
}

function makeFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "radarscout-preview-guard-"))

  execFileSync("git", ["init"], { cwd: dir, stdio: "ignore" })
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: dir })
  execFileSync("git", ["config", "user.name", "Test User"], { cwd: dir })

  fs.writeFileSync(path.join(dir, ".gitignore"), ".vercel\n.env.local\n")
  fs.writeFileSync(path.join(dir, "README.md"), "fixture\n")
  execFileSync("git", ["add", ".gitignore", "README.md"], { cwd: dir })
  execFileSync("git", ["commit", "-m", "init"], { cwd: dir, stdio: "ignore" })

  fs.mkdirSync(path.join(dir, ".vercel"))
  fs.writeFileSync(path.join(dir, ".vercel", "project.json"), `${JSON.stringify(correctProject)}\n`)

  return dir
}

function runGuard(cwd, args = []) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: "utf8",
  })
}

test("passes for a clean worktree linked to reddit-monitor", () => {
  const cwd = makeFixture()
  const result = runGuard(cwd)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /OK: clean worktree/)
})

test("fails when the Vercel project is not reddit-monitor", () => {
  const cwd = makeFixture()
  fs.writeFileSync(
    path.join(cwd, ".vercel", "project.json"),
    `${JSON.stringify({ ...correctProject, projectName: "wrong-project" })}\n`,
  )

  const result = runGuard(cwd)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Wrong Vercel project projectName/)
})

test("fails when the worktree has tracked changes", () => {
  const cwd = makeFixture()
  fs.writeFileSync(path.join(cwd, "README.md"), "dirty\n")

  const result = runGuard(cwd)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Worktree is not clean/)
})

test("fails when .env.local is present", () => {
  const cwd = makeFixture()
  fs.writeFileSync(path.join(cwd, ".env.local"), "DATABASE_URL=redacted\n")

  const result = runGuard(cwd)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Refusing preview deploy with \.env\.local present/)
})

test("fails for production deploy flags", () => {
  const cwd = makeFixture()
  const result = runGuard(cwd, ["--prod"])

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Production deploy flags are not allowed/)
})

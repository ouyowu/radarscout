const assert = require("node:assert/strict")
const { execFileSync, spawnSync } = require("node:child_process")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const test = require("node:test")

const repoRoot = path.resolve(__dirname, "..", "..")
const scriptPath = path.join(repoRoot, "scripts", "radarscout-vercel-preview-deploy.js")

const correctProject = {
  projectId: "prj_TG7h3uoTkZR5OdlIoroJOj3T5uUy",
  orgId: "team_rYfDZREL984WsFj6Fn1kS2Cp",
  projectName: "reddit-monitor",
}

function makeFixture(project = correctProject) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "radarscout-preview-deploy-"))

  execFileSync("git", ["init"], { cwd: dir, stdio: "ignore" })
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: dir })
  execFileSync("git", ["config", "user.name", "Test User"], { cwd: dir })

  fs.writeFileSync(path.join(dir, ".gitignore"), ".vercel\n.env.local\n")
  fs.writeFileSync(path.join(dir, "README.md"), "fixture\n")
  execFileSync("git", ["add", ".gitignore", "README.md"], { cwd: dir })
  execFileSync("git", ["commit", "-m", "init"], { cwd: dir, stdio: "ignore" })

  fs.mkdirSync(path.join(dir, ".vercel"))
  fs.writeFileSync(path.join(dir, ".vercel", "project.json"), `${JSON.stringify(project)}\n`)

  return dir
}

function runDeploy(cwd, args = [], env = {}) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      RADARSCOUT_PREVIEW_DEPLOY_DRY_RUN: "1",
      ...env,
    },
  })
}

function runRealDeployWithFakeNpx(cwd, fakeNpxSource) {
  const binDir = fs.mkdtempSync(path.join(os.tmpdir(), "radarscout-fake-npx-"))
  const fakeNpxPath = path.join(binDir, "npx")

  fs.writeFileSync(fakeNpxPath, fakeNpxSource)
  fs.chmodSync(fakeNpxPath, 0o755)

  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${binDir}${path.delimiter}${process.env.PATH}`,
    },
  })
}

test("dry-run deploy uses the approved Vercel scope after the preview guard passes", () => {
  const result = runDeploy(makeFixture())

  assert.equal(result.status, 0)
  assert.match(result.stdout, /npx vercel --yes --scope ouyowus-projects/)
})

test("passes safe Vercel preview args after the forced scope", () => {
  const result = runDeploy(makeFixture(), ["--debug"])

  assert.equal(result.status, 0)
  assert.match(result.stdout, /npx vercel --yes --scope ouyowus-projects --debug/)
})

test("cleans safe Vercel link side effects before running the preview guard", () => {
  const cwd = makeFixture()
  fs.writeFileSync(path.join(cwd, ".env.local"), "DATABASE_URL=redacted\n")
  fs.appendFileSync(path.join(cwd, ".gitignore"), ".env.local\n.vercel\n")

  const result = runDeploy(cwd)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /removed \.env\.local/)
  assert.match(result.stdout, /restored \.gitignore Vercel CLI additions/)
  assert.match(result.stdout, /npx vercel --yes --scope ouyowus-projects/)
  assert.equal(fs.existsSync(path.join(cwd, ".env.local")), false)
  assert.equal(execFileSync("git", ["status", "--short"], { cwd, encoding: "utf8" }).trim(), "")
})

test("cleans current Vercel CLI .env wildcard before running the preview guard", () => {
  const cwd = makeFixture()
  fs.writeFileSync(path.join(cwd, ".env.local"), "DATABASE_URL=redacted\n")
  fs.appendFileSync(path.join(cwd, ".gitignore"), ".env*\n")

  const result = runDeploy(cwd)

  assert.equal(result.status, 0)
  assert.match(result.stdout, /removed \.env\.local/)
  assert.match(result.stdout, /restored \.gitignore Vercel CLI additions/)
  assert.match(result.stdout, /npx vercel --yes --scope ouyowus-projects/)
  assert.equal(fs.existsSync(path.join(cwd, ".env.local")), false)
  assert.equal(execFileSync("git", ["status", "--short"], { cwd, encoding: "utf8" }).trim(), "")
})

test("refuses non-Vercel .gitignore changes during automatic cleanup", () => {
  const cwd = makeFixture()
  fs.appendFileSync(path.join(cwd, ".gitignore"), "coverage/\n")

  const result = runDeploy(cwd)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /\.gitignore has changes beyond Vercel CLI preview-link additions/)
  assert.doesNotMatch(result.stdout, /npx vercel/)
})

test("rejects production deploy flags before running Vercel", () => {
  const result = runDeploy(makeFixture(), ["--prod"])

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Production deploy flags are not allowed/)
  assert.doesNotMatch(result.stdout, /npx vercel/)
})

test("rejects caller-provided Vercel scopes", () => {
  const result = runDeploy(makeFixture(), ["--scope", "wrong-team"])

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Do not pass a custom Vercel scope/)
  assert.doesNotMatch(result.stdout, /npx vercel/)
})

test("fails when the linked project is not reddit-monitor", () => {
  const result = runDeploy(makeFixture({ ...correctProject, projectName: "wrong-project" }))

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Wrong Vercel project projectName/)
})

test("prints a stable RadarScout quota message when Vercel deployment quota is exhausted", () => {
  const result = runRealDeployWithFakeNpx(makeFixture(), `#!/usr/bin/env node
console.error('Error: Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day").')
process.exit(1)
`)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /api-deployments-free-per-day/)
  assert.match(result.stderr, /RadarScout preview deploy is blocked by Vercel daily deployment quota/)
  assert.match(result.stderr, /not a code, TypeScript, test, or build failure/)
})

#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const rootDir = path.resolve(__dirname, '..')
const aiDir = path.join(rootDir, '.ai')
const checksPath = path.join(aiDir, 'checks.log')
const diffPath = path.join(aiDir, 'phase-diff.patch')
const promptPath = path.join(aiDir, 'hermes-review-prompt.md')
const fixTemplatePath = path.join(aiDir, 'codex-fix-from-hermes-template.md')

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    maxBuffer: 50 * 1024 * 1024,
  })
}

function runAllowFailure(command, args, options = {}) {
  try {
    const output = execFileSync(command, args, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: options.stdio || 'pipe',
      maxBuffer: 50 * 1024 * 1024,
    })

    return { ok: true, output }
  } catch (error) {
    return {
      ok: false,
      output: error.stdout || error.stderr || error.message,
    }
  }
}

function readFile(filePath, fallback = '') {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return fallback
  }
}

function checksSummary(checks) {
  const overall = checks.includes('Overall: PASS') ? 'PASS' : checks.includes('Overall: FAIL') ? 'FAIL' : 'UNKNOWN'
  const lines = checks
    .split(/\r?\n/)
    .filter(line => line.startsWith('PASS:') || line.startsWith('FAIL:') || line.startsWith('Overall:'))

  return [`Overall: ${overall}`, ...lines].join('\n')
}

function buildPrompt({ checks, diff }) {
  const summary = checksSummary(checks)
  const checksFailed = summary.includes('Overall: FAIL') || summary.includes('FAIL:')
  const noDiff = diff.trim().length === 0
  const diffPreviewLimit = 120000
  const includeInlineDiff = diff.length <= diffPreviewLimit
  const diffStat = runAllowFailure('git', ['diff', '--stat', '--', '.']).output.trim() || 'No git diff stat available.'

  return `# Cherry Hermes Review Request

You are Hermes, the Cherry Studio project reviewer for RadarScout. Review the current local code changes using the project rules, business constraints, checks output, and git diff provided below.

Do not write code. Do not suggest broad refactors. Focus on production safety, business-model compliance, user deception risk, regressions, and whether Codex should fix anything before the next phase.

## Project Background

RadarScout is a travel-planning and curated day-tour platform. The frontend is a Next.js 14 App Router app in a pnpm monorepo. The database layer uses Prisma and Supabase/PostgreSQL. Bókun supplier products are synced through isolated server-side scripts.

This is a travel website powered by signed Bókun supplier products.

Bookable products must only come from signed Bókun supplier partners.

Thailand is currently the first live inventory destination.

Other global destinations and World Cup 2026 pages may exist as SEO / coming soon pages, but they must not display unbookable third-party products.

The product direction is:

- Global AI Travel Planner and Curated Day Tour Search Engine.
- Thailand is currently the first live inventory destination.
- Future destinations can have SEO and planning pages before inventory exists.
- Bookable products must only appear when they come from signed Bókun supplier partners.

## Current Business Restrictions

Real bookable products can only come from signed Bókun supplier partners.

Forbidden:

- Viator products
- GetYourGuide products
- Klook products
- Affiliate products
- Manually curated products that cannot be fulfilled
- Fake products
- No external product inventory
- No OpenAI / Claude / Gemini / DeepSeek backend integration unless explicitly requested
- Marking cities as available now when they do not have Bókun supplier inventory

Must protect:

- /tours?tag=Adventure
- /api/products?tag=Adventure&take=2
- server/bokun/product-sync.js
- server/bokun/tag-engine.js
- server/bokun/tag-report.js
- BokunProduct
- ProductTag
- Existing Bókun sync and tagging pipeline

## Current Phase Review Goal

Review the current git diff after a Codex phase. Confirm whether the change:

- Preserves the Bókun-only bookable inventory model.
- Avoids adding third-party or unfulfillable products.
- Avoids database, Prisma, and migration side effects unless explicitly approved.
- Keeps existing product search and tour pages intact.
- Does not introduce UX deception around Coming Soon pages or unavailable inventory.
- Does not accidentally call external AI APIs or travel inventory APIs unless the phase explicitly allowed that.

## Local Checks Summary

${checksFailed ? 'Local checks failed. Hermes must treat this as a potential P0/P1 issue.' : 'Local checks completed. Review the summary below.'}

\`\`\`
${summary}
\`\`\`

Full checks output is available in:

\`\`\`
.ai/checks.log
\`\`\`

## Git Diff

${noDiff ? 'No git diff detected. Review may be unnecessary or changes may already be committed.' : 'Review the current git diff for phase safety.'}

Git diff stat:

\`\`\`
${diffStat}
\`\`\`

The full git diff is available in:

\`\`\`
.ai/phase-diff.patch
\`\`\`

${includeInlineDiff ? `Inline diff copy:

\`\`\`diff
${diff}
\`\`\`
` : `The diff is too large to inline safely in this prompt. Please review .ai/phase-diff.patch directly.`}

## Required Hermes Output Format

Please output exactly these sections:

# Executive Summary

# Safe / Not Safe

# P0 Must Fix

# P1 Should Fix

# P2 Nice to Improve

# Regression Risks

# Suggested Fix Instructions for Codex

If there are no P0 or P1 issues, explicitly write:

\`\`\`
P0: None
P1: None
\`\`\`

## Review Focus

Check specifically:

1. Business boundary violations
2. Broken routes or bad links
3. Next.js App Router issues
4. TypeScript/build risks
5. Metadata/sitemap risks
6. Service Notice clarity
7. Coming Soon pages accidentally looking bookable
8. Existing /tours and /api/products regressions
9. Accidental Prisma/database/server/bokun changes
10. External API calls or hidden provider integrations

Rules for severity:

- P0: blocking correctness, security, data-loss, legal/compliance, or business-model violation.
- P1: important regression, misleading UX, broken route, unsafe inventory wording, or likely production issue.
- P2: polish, maintainability, SEO improvement, copy improvement, or optional follow-up.

If there are no P0/P1 issues, say so clearly.
`
}

function writeFixTemplate() {
  const template = `请读取下面的 Cherry Hermes 审查报告，只修复 P0 / P1 问题。

重要限制：

- 不要做新功能
- 不要扩大范围
- 不要改数据库
- 不要改 Prisma schema
- 不要执行 migration
- 不要改 server/bokun/*，除非 Hermes P0/P1 明确指出必须改
- 不要改 /api/products 逻辑，除非 Hermes P0/P1 明确指出必须改
- 不要改 /tours 逻辑，除非 Hermes P0/P1 明确指出必须改
- 不要接外部 API
- 不要添加 Viator / GetYourGuide / Klook / affiliate 产品
- 不要添加无法履约的产品
- 不要自动 commit

修复后运行：

pnpm ai:checks
pnpm --filter @reddit-monitor/web exec tsc --noEmit

并验证当前 Phase 相关页面，以及这些基础页面/接口：

- /
- /destinations
- /destinations/thailand
- /world-cup-2026
- /ai-trip-planner
- /tours?tag=Adventure
- /api/products?tag=Adventure&take=2

输出：

1. Fixed issues
2. Files changed
3. What was intentionally not changed
4. TypeScript result
5. Route validation result
6. Remaining P2 items, if any

下面是 Hermes 审查报告：
`

  fs.writeFileSync(fixTemplatePath, template)
}

function main() {
  fs.mkdirSync(aiDir, { recursive: true })

  console.log('Running pnpm ai:checks...')
  const checksResult = runAllowFailure('pnpm', ['ai:checks'], { stdio: 'inherit' })
  if (!checksResult.ok) {
    console.warn('pnpm ai:checks failed. Continuing to generate Hermes review package.')
  }

  console.log('Writing git diff...')
  const diff = run('git', ['diff', '--', '.'])
  fs.writeFileSync(diffPath, diff)

  const checks = readFile(checksPath, 'No .ai/checks.log found.')
  const prompt = buildPrompt({ checks, diff })
  fs.writeFileSync(promptPath, prompt)
  writeFixTemplate()

  console.log(`Wrote ${checksPath}`)
  console.log(`Wrote ${diffPath}`)
  console.log(`Wrote ${promptPath}`)
  console.log(`Wrote ${fixTemplatePath}`)
}

main()

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const defaultInputPath = 'private-inputs/viator-thailand-batch-2-detail-review.json'
const defaultOutputPath = 'private-inputs/viator-thailand-batch-2-safe-screen.json'

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function screeningDecision(candidate) {
  if (!Number.isFinite(candidate.durationMinutes)) {
    return {
      screeningDisposition: 'hold_missing_duration',
      screeningReason: 'official_duration_not_available',
    }
  }

  if (candidate.durationMinutes > 720) {
    return {
      screeningDisposition: 'hold_non_day_tour',
      screeningReason: 'duration_exceeds_day_trip_policy',
    }
  }

  return {
    screeningDisposition: 'pending_human_approval',
    screeningReason: 'meets_basic_day_tour_screen',
  }
}

export function buildViatorThailandSafeScreen(detailReview, {
  screenedAt = new Date().toISOString(),
} = {}) {
  const review = asRecord(detailReview)
  if (review?.status !== 'pending_human_detail_review' || !Array.isArray(review.candidates)) {
    return { ok: false, reason: 'invalid_review_input' }
  }

  const candidates = []
  for (const value of review.candidates) {
    const candidate = asRecord(value)
    if (!candidate || typeof candidate.productCode !== 'string' || typeof candidate.title !== 'string') {
      return { ok: false, reason: 'invalid_review_input' }
    }

    candidates.push({ ...candidate, ...screeningDecision(candidate) })
  }

  const summary = candidates.reduce((result, candidate) => {
    if (candidate.screeningDisposition === 'pending_human_approval') result.pendingHumanApproval += 1
    if (candidate.screeningDisposition === 'hold_missing_duration') result.heldMissingDuration += 1
    if (candidate.screeningDisposition === 'hold_non_day_tour') result.heldNonDayTour += 1
    return result
  }, { total: candidates.length, pendingHumanApproval: 0, heldMissingDuration: 0, heldNonDayTour: 0 })

  return {
    ok: true,
    review: {
      schemaVersion: 1,
      status: 'pending_human_final_review',
      screenedAt,
      source: 'Deterministic Viator Thailand day-tour safety screen; not a human approval or public seed',
      summary,
      candidates,
    },
  }
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return null
  }
}

export async function writeViatorThailandSafeScreen(review, { outputPath = defaultOutputPath } = {}) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8')
}

async function main() {
  const inputPath = process.env.VIATOR_DETAIL_REVIEW_INPUT_PATH?.trim() || defaultInputPath
  const outputPath = process.env.VIATOR_SAFE_SCREEN_OUTPUT_PATH?.trim() || defaultOutputPath
  const result = buildViatorThailandSafeScreen(await readJson(inputPath))
  if (!result.ok) {
    process.stderr.write(`${JSON.stringify(result)}\n`)
    process.exitCode = 1
    return
  }

  await writeViatorThailandSafeScreen(result.review, { outputPath })
  process.stdout.write(`${JSON.stringify({ ok: true, summary: result.review.summary, outputPath })}\n`)
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}

import { mkdir as nodeMkdir, readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const defaultTitleReviewPath = 'private-inputs/viator-thailand-batch-2-title-review.json'
const defaultDetailReviewPath = 'private-inputs/viator-thailand-batch-2-detail-review.json'
const defaultOutputPath = 'private-inputs/viator-thailand-batch-2-final-review.json'

const finalExclusionReasons = new Map([
  ['157340P38', 'animal_welfare_claim_requires_independent_evidence'],
  ['393669P3', 'animal_welfare_claim_requires_independent_evidence'],
  ['171127P4', 'animal_welfare_claim_requires_independent_evidence'],
  ['5554656P4', 'animal_welfare_claim_requires_independent_evidence'],
  ['157340P2', 'animal_welfare_claim_requires_independent_evidence'],
  ['417196P2', 'animal_welfare_claim_requires_independent_evidence'],
  ['60309P32', 'animal_welfare_claim_requires_independent_evidence'],
  ['5582508P3', 'animal_welfare_claim_requires_independent_evidence'],
  ['5598516P1', 'animal_welfare_claim_requires_independent_evidence'],
  ['480114P1', 'animal_welfare_claim_requires_independent_evidence'],
  ['136208P6', 'animal_welfare_claim_requires_independent_evidence'],
  ['157340P35', 'animal_welfare_claim_requires_independent_evidence'],
  ['324455P9', 'animal_welfare_claim_requires_independent_evidence'],
  ['202400P48', 'animal_welfare_claim_requires_independent_evidence'],
  ['5526890P7', 'duration_exceeds_day_trip_policy'],
  ['89944P23', 'open_ended_transport_service'],
])

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function candidatesFrom(review, status) {
  const record = asRecord(review)
  return record?.status === status && Array.isArray(record.candidates) ? record.candidates : null
}

function candidateCode(candidate) {
  return typeof asRecord(candidate)?.productCode === 'string' ? asRecord(candidate).productCode : null
}

export function buildViatorThailandBatch2FinalReview(titleReview, detailReview, {
  reviewedAt = new Date().toISOString(),
} = {}) {
  const titleCandidates = candidatesFrom(titleReview, 'detail_review_required')
  const detailCandidates = candidatesFrom(detailReview, 'pending_human_detail_review')
  if (!titleCandidates || !detailCandidates) return { ok: false, reason: 'invalid_review_input' }

  const detailByProductCode = new Map(detailCandidates.map((candidate) => [candidateCode(candidate), candidate]))
  const candidates = []

  for (const titleCandidate of titleCandidates) {
    const candidate = asRecord(titleCandidate)
    const productCode = candidateCode(candidate)
    if (!candidate || !productCode || typeof candidate.disposition !== 'string' || typeof candidate.reason !== 'string') {
      return { ok: false, reason: 'invalid_review_input' }
    }

    if (candidate.disposition !== 'requires_detail_review') {
      candidates.push(candidate)
      continue
    }

    const detail = detailByProductCode.get(productCode)
    if (!detail) return { ok: false, reason: 'missing_detail_review', productCode }

    const exclusionReason = finalExclusionReasons.get(productCode)
    candidates.push({
      ...detail,
      disposition: exclusionReason ? 'excluded' : 'approved_for_public_seed',
      reason: exclusionReason ?? 'reviewed_thailand_day_trip',
    })
  }

  const summary = candidates.reduce((result, candidate) => {
    if (candidate.disposition === 'already_public') result.alreadyPublic += 1
    if (candidate.disposition === 'excluded') result.excluded += 1
    if (candidate.disposition === 'approved_for_public_seed') result.approvedForPublicSeed += 1
    return result
  }, { total: candidates.length, alreadyPublic: 0, excluded: 0, approvedForPublicSeed: 0 })

  return {
    ok: true,
    review: {
      schemaVersion: 1,
      status: 'approved_for_public_seed',
      reviewedAt,
      source: 'Manual Thailand day-trip review of Viator production candidate and detail review pools',
      summary,
      candidates,
    },
  }
}

export async function writeViatorThailandBatch2FinalReview(review, {
  outputPath = defaultOutputPath,
  mkdir = nodeMkdir,
  writeFile = nodeWriteFile,
} = {}) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8')
}

async function readJson(inputPath) {
  try {
    return JSON.parse(await nodeReadFile(inputPath, 'utf8'))
  } catch {
    return null
  }
}

async function main() {
  const titleReviewPath = process.env.VIATOR_BATCH_2_TITLE_REVIEW_INPUT_PATH?.trim() || defaultTitleReviewPath
  const detailReviewPath = process.env.VIATOR_BATCH_2_DETAIL_REVIEW_INPUT_PATH?.trim() || defaultDetailReviewPath
  const outputPath = process.env.VIATOR_BATCH_2_FINAL_REVIEW_OUTPUT_PATH?.trim() || defaultOutputPath
  const [titleReview, detailReview] = await Promise.all([readJson(titleReviewPath), readJson(detailReviewPath)])
  const result = buildViatorThailandBatch2FinalReview(titleReview, detailReview)

  if (!result.ok) {
    process.stderr.write(`${JSON.stringify(result)}\n`)
    process.exitCode = 1
    return
  }

  await writeViatorThailandBatch2FinalReview(result.review, { outputPath })
  process.stdout.write(`${JSON.stringify({ ok: true, summary: result.review.summary, outputPath })}\n`)
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}

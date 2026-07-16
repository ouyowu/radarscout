import { mkdir as nodeMkdir, readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const defaultInputPath = 'private-inputs/viator-thailand-batch-2-candidates.json'
const defaultOutputPath = 'private-inputs/viator-thailand-batch-2-title-review.json'

const alreadyPublishedProductCodes = new Set([
  '5567417P3',
  '6467BKKNIGHT',
  '191442P6',
  '26152P7',
  '27424P2',
  '208505P1',
  '91960P29',
  '211395P4',
  '111606P1',
  '231516P1',
  '22127P1',
  '382966P1',
  '68083P2',
  '224272P2',
  '382123P5',
  '338950P1',
])

const excludedProductReasons = new Map([
  ['90546P33', 'airport_or_transfer_only'],
  ['90546P25', 'airport_or_transfer_only'],
  ['90546P94', 'airport_or_transfer_only'],
  ['90546P308', 'airport_or_transfer_only'],
  ['90546P23', 'airport_or_transfer_only'],
  ['9592P11', 'airport_or_transfer_only'],
  ['428697P14', 'seasonal_event'],
  ['74194P94', 'seasonal_event'],
  ['7137P283', 'seasonal_event'],
  ['9574P165', 'multi_day_itinerary'],
  ['383905P29', 'cruise_port_specific'],
  ['110403P56', 'cruise_port_specific'],
  ['383449P45', 'cruise_port_specific'],
])

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function isValidPool(pool) {
  const record = asRecord(pool)
  const candidates = Array.isArray(record?.candidates) ? record.candidates : null
  const candidateCount = record?.candidateCount

  if (!candidates || !Number.isInteger(candidateCount) || candidateCount !== candidates.length) return false

  const productCodes = candidates.map((candidate) => asRecord(candidate)?.productCode)
  return productCodes.every((productCode) => typeof productCode === 'string' && productCode.trim() !== '')
    && new Set(productCodes).size === productCodes.length
}

function dispositionFor(productCode) {
  if (alreadyPublishedProductCodes.has(productCode)) {
    return { disposition: 'already_public', reason: 'already_in_reviewed_viator_seed' }
  }

  const excludedReason = excludedProductReasons.get(productCode)
  if (excludedReason) return { disposition: 'excluded', reason: excludedReason }

  return { disposition: 'requires_detail_review', reason: 'requires_product_detail_review' }
}

export function buildViatorThailandBatch2TitleReview(pool, {
  reviewedAt = new Date().toISOString(),
} = {}) {
  if (!isValidPool(pool)) return { ok: false, reason: 'invalid_candidate_pool' }

  const candidates = pool.candidates.map((candidate) => ({
    ...candidate,
    ...dispositionFor(candidate.productCode),
  }))
  const summary = candidates.reduce((result, candidate) => {
    if (candidate.disposition === 'already_public') result.alreadyPublic += 1
    if (candidate.disposition === 'excluded') result.excluded += 1
    if (candidate.disposition === 'requires_detail_review') result.requiresDetailReview += 1
    return result
  }, {
    total: candidates.length,
    alreadyPublic: 0,
    excluded: 0,
    requiresDetailReview: 0,
    approvedForPublicSeed: 0,
  })

  return {
    ok: true,
    review: {
      schemaVersion: 1,
      status: 'detail_review_required',
      reviewedAt,
      source: 'Viator Affiliate API production /products/search; title-level manual triage',
      summary,
      candidates,
    },
  }
}

export async function writeViatorThailandBatch2TitleReview(review, {
  outputPath = defaultOutputPath,
  mkdir = nodeMkdir,
  writeFile = nodeWriteFile,
} = {}) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8')
}

async function main() {
  const inputPath = process.env.VIATOR_BATCH_2_INPUT_PATH?.trim() || defaultInputPath
  const outputPath = process.env.VIATOR_BATCH_2_TITLE_REVIEW_OUTPUT_PATH?.trim() || defaultOutputPath

  let pool
  try {
    pool = JSON.parse(await nodeReadFile(inputPath, 'utf8'))
  } catch {
    process.stderr.write(`${JSON.stringify({ ok: false, reason: 'invalid_candidate_pool' })}\n`)
    process.exitCode = 1
    return
  }

  const result = buildViatorThailandBatch2TitleReview(pool)
  if (!result.ok) {
    process.stderr.write(`${JSON.stringify(result)}\n`)
    process.exitCode = 1
    return
  }

  await writeViatorThailandBatch2TitleReview(result.review, { outputPath })
  process.stdout.write(`${JSON.stringify({ ok: true, summary: result.review.summary, outputPath })}\n`)
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}

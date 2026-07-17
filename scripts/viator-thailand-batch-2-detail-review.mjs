import { mkdir as nodeMkdir, readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const VIATOR_ACCEPT_HEADER = 'application/json;version=2.0'
const defaultInputPath = 'private-inputs/viator-thailand-batch-2-title-review.json'
const defaultOutputPath = 'private-inputs/viator-thailand-batch-2-detail-review.json'

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function readString(value, maxLength = 2_000) {
  return typeof value === 'string' && value.trim() !== '' && value.trim().length <= maxLength
    ? value.trim()
    : null
}

function readHighlights(value) {
  if (!Array.isArray(value)) return []

  const highlights = value
    .map((item) => {
      const record = asRecord(item)
      return readString(record?.otherDescription, 300)
        ?? readString(record?.description, 300)
        ?? readString(record?.typeDescription, 300)
        ?? readString(record?.categoryDescription, 300)
    })
    .filter(Boolean)

  return [...new Set(highlights)].slice(0, 12)
}

function readDurationMinutes(value) {
  const duration = asRecord(asRecord(value)?.duration)
  const minutes = duration?.fixedDurationInMinutes
  return Number.isInteger(minutes) && minutes > 0 && minutes <= 1_440 ? minutes : null
}

function isReviewCandidate(value) {
  const candidate = asRecord(value)
  return candidate
    && candidate.disposition === 'requires_detail_review'
    && typeof candidate.productCode === 'string'
    && typeof candidate.title === 'string'
    && typeof candidate.productUrl === 'string'
    && typeof candidate.imageUrl === 'string'
    && typeof candidate.city === 'string'
    && typeof candidate.destinationId === 'string'
}

function readRetryAfterMs(response) {
  const retryAfter = Number(response.headers.get('retry-after'))
  return Number.isFinite(retryAfter) && retryAfter >= 0
    ? Math.max(250, retryAfter * 1_000)
    : 1_000
}

function safeDetailFromBody(candidate, body) {
  const product = asRecord(body)
  if (!product || readString(product.productCode, 48) !== candidate.productCode) {
    return { ok: false, reason: 'mismatched_product' }
  }

  return {
    ok: true,
    detail: {
      city: candidate.city,
      destinationId: candidate.destinationId,
      productCode: candidate.productCode,
      title: candidate.title,
      productUrl: candidate.productUrl,
      imageUrl: candidate.imageUrl,
      description: readString(product.description, 12_000),
      inclusionHighlights: readHighlights(product.inclusions),
      exclusionHighlights: readHighlights(product.exclusions),
      durationMinutes: readDurationMinutes(product.itinerary),
    },
  }
}

export async function fetchViatorProductDetailForReview(candidate, {
  apiKey,
  fetchFn = fetch,
  sleepFn = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
} = {}) {
  if (!isReviewCandidate(candidate)) return { ok: false, reason: 'invalid_candidate' }
  if (!apiKey?.trim()) return { ok: false, reason: 'not_configured' }

  let response
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetchFn(`https://api.viator.com/partner/products/${encodeURIComponent(candidate.productCode)}`, {
        headers: {
          Accept: VIATOR_ACCEPT_HEADER,
          'Accept-Language': 'en-US',
          'exp-api-key': apiKey,
        },
      })
    } catch {
      return { ok: false, reason: 'upstream_error' }
    }

    if (response.status !== 429 || attempt === 1) break
    await sleepFn(readRetryAfterMs(response))
  }

  if (!response.ok) return { ok: false, reason: 'upstream_error', status: response.status }

  try {
    return safeDetailFromBody(candidate, await response.json())
  } catch {
    return { ok: false, reason: 'upstream_error', status: response.status }
  }
}

export async function buildViatorThailandBatch2DetailReview(titleReview, {
  apiKey,
  fetchProduct = fetchViatorProductDetailForReview,
  fetchedAt = new Date().toISOString(),
} = {}) {
  const review = asRecord(titleReview)
  const candidates = Array.isArray(review?.candidates) ? review.candidates : null
  const acceptedStatuses = new Set([
    'detail_review_required',
    'title_review_complete_detail_review_pending',
  ])
  if (!acceptedStatuses.has(review?.status) || !candidates) {
    return { ok: false, reason: 'invalid_title_review' }
  }
  if (!apiKey?.trim()) return { ok: false, reason: 'not_configured' }

  const detailCandidates = []
  for (const candidate of candidates.filter(isReviewCandidate)) {
    const result = await fetchProduct(candidate, { apiKey })
    if (!result.ok) {
      return {
        ok: false,
        reason: result.reason,
        productCode: candidate.productCode,
        ...(result.status ? { status: result.status } : {}),
      }
    }
    detailCandidates.push(result.detail)
  }

  return {
    ok: true,
    review: {
      schemaVersion: 1,
      status: 'pending_human_detail_review',
      fetchedAt,
      source: 'Viator Affiliate API production /products/{product-code}; non-commercial review fields only',
      candidateCount: detailCandidates.length,
      candidates: detailCandidates,
    },
  }
}

export async function writeViatorThailandBatch2DetailReview(review, {
  outputPath = defaultOutputPath,
  mkdir = nodeMkdir,
  writeFile = nodeWriteFile,
} = {}) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8')
}

async function main() {
  const inputPath = process.env.VIATOR_BATCH_2_TITLE_REVIEW_INPUT_PATH?.trim() || defaultInputPath
  const outputPath = process.env.VIATOR_BATCH_2_DETAIL_REVIEW_OUTPUT_PATH?.trim() || defaultOutputPath

  let titleReview
  try {
    titleReview = JSON.parse(await nodeReadFile(inputPath, 'utf8'))
  } catch {
    process.stderr.write(`${JSON.stringify({ ok: false, reason: 'invalid_title_review' })}\n`)
    process.exitCode = 1
    return
  }

  const result = await buildViatorThailandBatch2DetailReview(titleReview, {
    apiKey: process.env.VIATOR_PRODUCTION_API_KEY,
  })
  if (!result.ok) {
    process.stderr.write(`${JSON.stringify(result)}\n`)
    process.exitCode = 1
    return
  }

  await writeViatorThailandBatch2DetailReview(result.review, { outputPath })
  process.stdout.write(`${JSON.stringify({
    ok: true,
    candidateCount: result.review.candidateCount,
    outputPath,
  })}\n`)
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}

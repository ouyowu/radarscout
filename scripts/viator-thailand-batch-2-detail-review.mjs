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

function readBoolean(value) {
  return typeof value === 'boolean' ? value : null
}

function readInteger(value, max = 1_440) {
  return Number.isInteger(value) && value >= 0 && value <= max ? value : null
}

function readDistinctStrings(value, {
  maxItems = 12,
  maxLength = 300,
  keys = [],
} = {}) {
  if (!Array.isArray(value)) return []

  const strings = value
    .map((item) => {
      const record = asRecord(item)
      if (!record) return null
      for (const key of keys) {
        const text = readString(record[key], maxLength)
        if (text) return text
      }
      return null
    })
    .filter(Boolean)

  return [...new Set(strings)].slice(0, maxItems)
}

function readPickup(value) {
  const pickup = asRecord(asRecord(value)?.travelerPickup)

  return {
    optionType: readString(pickup?.pickupOptionType, 80),
    allowCustomTravelerPickup: readBoolean(pickup?.allowCustomTravelerPickup),
    locations: readDistinctStrings(pickup?.locations, {
      maxItems: 20,
      maxLength: 160,
      keys: ['locationName', 'name'],
    }),
    leadMinutes: readInteger(pickup?.minutesBeforeDepartureTimeForPickup),
  }
}

function readSchedule(value) {
  const logistics = asRecord(value)
  return {
    startTimes: readDistinctStrings(logistics?.start, {
      maxItems: 8,
      maxLength: 80,
      keys: ['time', 'startTime'],
    }),
    endTimes: readDistinctStrings(logistics?.end, {
      maxItems: 8,
      maxLength: 80,
      keys: ['time', 'endTime'],
    }),
  }
}

function readBookingRequirements(value) {
  const requirements = asRecord(value)
  return {
    minTravelersPerBooking: readInteger(requirements?.minTravelersPerBooking, 100),
    maxTravelersPerBooking: readInteger(requirements?.maxTravelersPerBooking, 100),
    requiresAdultForBooking: readBoolean(requirements?.requiresAdultForBooking),
  }
}

function readCancellationPolicy(value) {
  const policy = asRecord(value)
  return {
    type: readString(policy?.type, 80),
    refundEligibility: readString(policy?.refundEligibility, 80),
    cancelIfBadWeather: readBoolean(policy?.cancelIfBadWeather),
    cancelIfInsufficientTravelers: readBoolean(policy?.cancelIfInsufficientTravelers),
    description: readString(policy?.description, 1_000),
  }
}

function readLastUpdatedAt(value) {
  const timestamp = readString(value, 80)
  return timestamp && Number.isFinite(Date.parse(timestamp)) ? timestamp : null
}

const pendingHumanReviewFields = [
  'childPolicy',
  'ethicalAttributes',
  'fitnessLevel',
  'pickupTravelTimeFromUserLocation',
  'returnBeforeTime',
]

function readPrimaryDestinationId(value) {
  if (!Array.isArray(value)) return null

  const primaryDestination = value
    .map(asRecord)
    .find((destination) => destination?.primary === true)
  return readString(primaryDestination?.ref, 12)
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
      primaryDestinationId: readPrimaryDestinationId(product.destinations),
      description: readString(product.description, 12_000),
      inclusionHighlights: readHighlights(product.inclusions),
      exclusionHighlights: readHighlights(product.exclusions),
      durationMinutes: readDurationMinutes(product.itinerary),
      pickup: readPickup(product.logistics),
      schedule: readSchedule(product.logistics),
      bookingRequirements: readBookingRequirements(product.bookingRequirements),
      cancellationPolicy: readCancellationPolicy(product.cancellationPolicy),
      lastUpdatedAt: readLastUpdatedAt(product.lastUpdatedAt),
      // Viator does not provide enough stable structured facts to derive these
      // user-facing decisions. Keep them explicitly pending, never inferred.
      pendingHumanReviewFields: [...pendingHumanReviewFields],
    },
  }
}

export async function fetchViatorProductDetailForReview(candidate, {
  apiKey,
  fetchFn = fetch,
  sleepFn = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  requestTimeoutMs = 8_000,
} = {}) {
  if (!isReviewCandidate(candidate)) return { ok: false, reason: 'invalid_candidate' }
  if (!apiKey?.trim()) return { ok: false, reason: 'not_configured' }

  let response
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs)
    try {
      response = await fetchFn(`https://api.viator.com/partner/products/${encodeURIComponent(candidate.productCode)}`, {
        headers: {
          Accept: VIATOR_ACCEPT_HEADER,
          'Accept-Language': 'en-US',
          'exp-api-key': apiKey,
        },
        signal: controller.signal,
      })
    } catch (error) {
      return {
        ok: false,
        reason: controller.signal.aborted ? 'upstream_timeout' : 'upstream_error',
      }
    } finally {
      clearTimeout(timeout)
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
  productCodes = null,
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

  const selectedProductCodes = Array.isArray(productCodes)
    ? new Set(productCodes.filter((productCode) => typeof productCode === 'string' && productCode.trim() !== ''))
    : null
  const detailCandidates = []
  for (const candidate of candidates.filter((value) => (
    isReviewCandidate(value)
    && (!selectedProductCodes || selectedProductCodes.has(value.productCode))
  ))) {
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
  const productCodes = process.env.VIATOR_PRODUCT_CODES?.split(',')
    .map((productCode) => productCode.trim())
    .filter(Boolean)

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
    productCodes,
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

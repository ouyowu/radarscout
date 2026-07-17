import { mkdir as nodeMkdir, readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const defaultInputPath = 'private-inputs/viator-thailand-expanded-detail-review-2026-07-17.json'
const defaultOutputPath = 'apps/web/lib/viator/reviewedViatorBatch3Products.ts'

export const approvedExpandedProductMetadata = new Map([
  ['5596319P4', { city: 'Bangkok', destinationId: '343', shortSummary: "A hands-on Bangkok cooking class with an Old Town market visit.", tags: ['food', 'cooking', 'market'] }],
  ['273038P50', { city: 'Bophut', destinationId: '51001', shortSummary: 'A full-day speedboat route from Bophut to Ang Thong Marine Park.', tags: ['islands', 'boat', 'nature'] }],
  ['450582P1', { city: 'Bophut', destinationId: '51001', shortSummary: 'A Koh Samui cooking class led by a local family, including a market visit.', tags: ['food', 'cooking', 'market'] }],
  ['485354P2', { city: 'Chiang Mai', destinationId: '5267', shortSummary: 'An evening Chiang Mai tuk-tuk route through temples and local markets.', tags: ['temples', 'tuk-tuk', 'evening'] }],
  ['345511P1', { city: 'Chiang Mai', destinationId: '5267', shortSummary: 'A half-day Chiang Mai cooking class at an organic farm.', tags: ['food', 'cooking', 'farm'] }],
  ['5497444P1', { city: 'Chiang Rai', destinationId: '5268', shortSummary: 'A full-day Chiang Rai sightseeing route covering major temples and local landmarks.', tags: ['temples', 'culture', 'day-trip'] }],
  ['486281P4', { city: 'Chiang Rai', destinationId: '5268', shortSummary: 'A Chiang Rai day trip combining temples, the Golden Triangle and a tea plantation.', tags: ['temples', 'golden-triangle', 'culture'] }],
  ['5567066P578', { city: 'Hua Hin', destinationId: '22968', shortSummary: 'A beginner-friendly Hua Hin cooking class with a local market visit.', tags: ['food', 'cooking', 'market'] }],
  ['184242P13', { city: 'Hua Hin', destinationId: '22968', shortSummary: 'A Hua Hin day trip to Sam Roi Yot National Park and Phraya Nakhon Cave.', tags: ['nature', 'cave', 'day-trip'] }],
  ['163642P127', { city: 'Kanchanaburi', destinationId: '22285', shortSummary: 'A full-day Kanchanaburi route combining Erawan Waterfall and a historic train journey.', tags: ['waterfalls', 'history', 'day-trip'] }],
  ['392659P9', { city: 'Kanchanaburi', destinationId: '22285', shortSummary: 'A Kanchanaburi history day focused on Hellfire Pass and the Death Railway.', tags: ['history', 'railway', 'day-trip'] }],
  ['110534P603', { city: 'Khao Lak', destinationId: '23786', shortSummary: 'A day trip from Khao Lak to Cheow Larn Lake in Khao Sok National Park.', tags: ['lake', 'nature', 'day-trip'] }],
  ['58120P6', { city: 'Khao Lak', destinationId: '23786', shortSummary: 'A Khao Sok rainforest day combining hiking and bamboo rafting from Khao Lak.', tags: ['hiking', 'rafting', 'nature'] }],
  ['110534P1170', { city: 'Ko Chang', destinationId: '24532', shortSummary: 'A beginner-friendly half-day jungle trek on Ko Chang.', tags: ['hiking', 'jungle', 'half-day'] }],
  ['304582P1', { city: 'Ko Chang', destinationId: '24532', shortSummary: 'A private kayaking route around Bang Bao Bay with time on the water.', tags: ['kayaking', 'bay', 'private'] }],
  ['110534P380', { city: 'Ko Lanta', destinationId: '24522', shortSummary: 'A hands-on Thai cooking experience at a cookery school on Ko Lanta.', tags: ['food', 'cooking', 'culture'] }],
  ['295603P13', { city: 'Ko Lanta', destinationId: '24522', shortSummary: 'A half-day Ko Lanta kayak route through mangroves and Talabeng Sea Cave.', tags: ['kayaking', 'mangroves', 'cave'] }],
  ['5601517P6', { city: 'Ko Lipe', destinationId: '37757', shortSummary: 'A longtail-boat snorkeling route through seven islands near Ko Lipe.', tags: ['snorkeling', 'islands', 'boat'] }],
  ['110534P1064', { city: 'Ko Lipe', destinationId: '37757', shortSummary: 'A Ko Lipe longtail-boat trip combining four islands, snorkeling and sunset.', tags: ['snorkeling', 'islands', 'sunset'] }],
  ['121355P4', { city: 'Ko Pha Ngan', destinationId: '34192', shortSummary: 'A private road trip around Ko Pha Ngan beaches, viewpoints and local landmarks.', tags: ['island', 'sightseeing', 'private'] }],
  ['9574P153', { city: 'Ko Pha Ngan', destinationId: '34192', shortSummary: 'A speedboat day from Ko Pha Ngan to Ang Thong Marine Park for snorkeling and kayaking.', tags: ['snorkeling', 'kayaking', 'islands'] }],
  ['110534P544', { city: 'Ko Phi Phi Don', destinationId: '40944', shortSummary: 'A private six-hour boat route around the Phi Phi Islands from Phi Phi Don.', tags: ['islands', 'boat', 'private'] }],
  ['110534P542', { city: 'Ko Phi Phi Don', destinationId: '40944', shortSummary: 'An early-departure speedboat route around the Phi Phi Islands from Phi Phi Don.', tags: ['islands', 'speedboat', 'early-start'] }],
  ['127390P7', { city: 'Ko Yao Yai', destinationId: '50552', shortSummary: 'A snorkeling trip from Ko Yao Yai or Ko Yao Noi to Hong Island.', tags: ['snorkeling', 'islands', 'boat'] }],
  ['110534P1111', { city: 'Ko Yao Yai', destinationId: '50552', shortSummary: 'A Ko Yao Yai kayaking route through mangrove forest with a local village visit.', tags: ['kayaking', 'mangroves', 'culture'] }],
  ['9574P682', { city: 'Koh Tao', destinationId: '34193', shortSummary: 'A full-day Koh Tao boat route covering five snorkeling areas and Koh Nang Yuan.', tags: ['snorkeling', 'islands', 'boat'] }],
  ['110534P1023', { city: 'Koh Tao', destinationId: '34193', shortSummary: 'A half-day Thai cooking class with sea views on Koh Tao.', tags: ['food', 'cooking', 'half-day'] }],
  ['65885P1', { city: 'Krabi', destinationId: '348', shortSummary: 'A small-group kayak route through Krabi mangroves and limestone canyons.', tags: ['kayaking', 'mangroves', 'nature'] }],
  ['112650P12', { city: 'Krabi', destinationId: '348', shortSummary: 'A Krabi day combining Emerald Pool, hot springs and Tiger Cave Temple.', tags: ['nature', 'temples', 'day-trip'] }],
  ['90546P217', { city: 'Mae Hong Son', destinationId: '51553', shortSummary: 'A Mae Hong Son day route through a KMT village, Pha Sua Waterfall and Pang Oung.', tags: ['culture', 'waterfalls', 'nature'] }],
  ['90546P218', { city: 'Mae Hong Son', destinationId: '51553', shortSummary: 'A Mae Hong Son day trip to Tham Lod Cave, prehistoric sites and a bamboo bridge.', tags: ['cave', 'history', 'day-trip'] }],
  ['110403P56', { city: 'Pattaya', destinationId: '344', shortSummary: 'A Laem Chabang day trip to the railway and floating markets.', tags: ['markets', 'culture', 'day-trip'] }],
  ['5521242P151', { city: 'Pattaya', destinationId: '344', shortSummary: 'A private speedboat trip from Pattaya to beaches on Koh Larn.', tags: ['islands', 'speedboat', 'private'] }],
  ['10074P3', { city: 'Phuket', destinationId: '349', shortSummary: 'A full-day Phuket speedboat route to Phi Phi Islands and Maya Bay.', tags: ['islands', 'speedboat', 'day-trip'] }],
])

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function isViatorAffiliateUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && (url.hostname === 'viator.com' || url.hostname.endsWith('.viator.com'))
      && url.searchParams.has('pid')
  } catch {
    return false
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function buildViatorThailandExpandedPublicSeed(detailReview, {
  metadataByProductCode = approvedExpandedProductMetadata,
  reviewedAt = new Date().toISOString(),
} = {}) {
  const review = asRecord(detailReview)
  const candidates = Array.isArray(review?.candidates) ? review.candidates : null
  if (review?.status !== 'pending_human_detail_review' || !candidates) {
    return { ok: false, reason: 'invalid_detail_review' }
  }

  const candidateByProductCode = new Map(candidates.map((candidate) => [asRecord(candidate)?.productCode, asRecord(candidate)]))
  const records = []

  for (const [productCode, metadata] of metadataByProductCode) {
    const candidate = candidateByProductCode.get(productCode)
    if (!candidate) return { ok: false, reason: 'missing_reviewed_product', productCode }
    if (candidate.primaryDestinationId !== metadata.destinationId) {
      return { ok: false, reason: 'primary_destination_mismatch', productCode }
    }
    if (
      typeof candidate.title !== 'string'
      || typeof candidate.productUrl !== 'string'
      || typeof candidate.imageUrl !== 'string'
      || !isViatorAffiliateUrl(candidate.productUrl)
      || !isHttpsUrl(candidate.imageUrl)
    ) {
      return { ok: false, reason: 'invalid_reviewed_product', productCode }
    }

    records.push({
      id: `viator_${productCode.toLowerCase()}`,
      city: metadata.city,
      destinationId: metadata.destinationId,
      productCode,
      title: candidate.title,
      shortSummary: metadata.shortSummary,
      tags: metadata.tags,
      productUrl: candidate.productUrl,
      imageUrl: candidate.imageUrl,
      reviewedAt,
    })
  }

  return { ok: true, records }
}

export function formatReviewedViatorBatch3ProductsModule(records) {
  return `import type { ReviewedViatorProduct } from './reviewedViatorProducts'\n\nexport const reviewedViatorBatch3ProductSeedRecords: readonly ReviewedViatorProduct[] = ${JSON.stringify(records, null, 2)}\n`
}

export async function writeReviewedViatorBatch3ProductsModule(records, {
  outputPath = defaultOutputPath,
  mkdir = nodeMkdir,
  writeFile = nodeWriteFile,
} = {}) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, formatReviewedViatorBatch3ProductsModule(records), 'utf8')
}

async function main() {
  const inputPath = process.env.VIATOR_EXPANDED_DETAIL_REVIEW_INPUT_PATH?.trim() || defaultInputPath
  const outputPath = process.env.VIATOR_EXPANDED_PUBLIC_SEED_OUTPUT_PATH?.trim() || defaultOutputPath

  let detailReview
  try {
    detailReview = JSON.parse(await nodeReadFile(inputPath, 'utf8'))
  } catch {
    process.stderr.write(`${JSON.stringify({ ok: false, reason: 'invalid_detail_review' })}\n`)
    process.exitCode = 1
    return
  }

  const result = buildViatorThailandExpandedPublicSeed(detailReview)
  if (!result.ok) {
    process.stderr.write(`${JSON.stringify(result)}\n`)
    process.exitCode = 1
    return
  }

  await writeReviewedViatorBatch3ProductsModule(result.records, { outputPath })
  process.stdout.write(`${JSON.stringify({ ok: true, recordCount: result.records.length, outputPath })}\n`)
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}

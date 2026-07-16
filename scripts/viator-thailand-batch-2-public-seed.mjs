import { mkdir as nodeMkdir, readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const defaultInputPath = 'private-inputs/viator-thailand-batch-2-final-review.json'
const defaultOutputPath = 'apps/web/lib/viator/reviewedViatorBatch2Products.ts'

const publicMetadataByProductCode = new Map([
  ['5553790P1', { shortSummary: 'A Bangkok day trip combining the railway market, canal time and a floating market visit.', tags: ['markets', 'culture', 'day-trip'] }],
  ['112650P5', { shortSummary: 'A short longtail-boat ride through Bangkok canals, riverside communities and temples.', tags: ['boat', 'canals', 'culture'] }],
  ['5574664P6', { shortSummary: 'An evening Chao Phraya dinner cruise departing from ICONSIAM with Bangkok river views.', tags: ['dinner-cruise', 'food', 'evening'] }],
  ['112650P2', { shortSummary: 'A guided half-day visit to Bangkok landmarks including the Grand Palace and major temples.', tags: ['temples', 'culture', 'half-day'] }],
  ['18897P6', { shortSummary: 'A private full-day introduction to Bangkok history, landmarks and temples.', tags: ['city', 'temples', 'private'] }],
  ['88184P6', { shortSummary: 'A two-hour longtail-boat route through Bangkok canal life and temple views.', tags: ['boat', 'canals', 'temples'] }],
  ['69673P1', { shortSummary: 'A Bangkok food walk with many tastings in local neighbourhoods.', tags: ['food', 'culture', 'walking'] }],
  ['350014P11', { shortSummary: 'An evening ticketed experience at Bangkok’s historic Rajadamnern Muay Thai stadium.', tags: ['muay-thai', 'culture', 'evening'] }],
  ['91960P48', { shortSummary: 'A Bangkok temple route covering Wat Traimit, Wat Pho and Wat Arun.', tags: ['temples', 'culture', 'half-day'] }],
  ['123836P1', { shortSummary: 'A private full-day Bangkok sightseeing route through temples, Chinatown and city landmarks.', tags: ['city', 'temples', 'private'] }],
  ['63670P40', { shortSummary: 'An evening Chinatown food experience focused on Bangkok’s local dishes and street-food scene.', tags: ['food', 'chinatown', 'evening'] }],
  ['163642P1', { shortSummary: 'A full-day cultural trip from Bangkok to Ayutthaya’s historic sites and royal landmarks.', tags: ['ayutthaya', 'history', 'day-trip'] }],
  ['8374P24', { shortSummary: 'A half-day market route from Bangkok to the railway and floating markets.', tags: ['markets', 'culture', 'half-day'] }],
  ['371426P3', { shortSummary: 'A private Bangkok market day with the railway market, floating market and a canal boat ride.', tags: ['markets', 'private', 'day-trip'] }],
  ['10791P12', { shortSummary: 'A Bangkok tuk-tuk food route with Michelin-recommended stops and hotel pickup.', tags: ['food', 'tuk-tuk', 'culture'] }],
  ['160694P9', { shortSummary: 'A Phuket speedboat day to Phi Phi, Maya Bay and Khai Islands with time for snorkeling.', tags: ['islands', 'boat', 'snorkeling'] }],
  ['458772P1', { shortSummary: 'A short elevated dining experience in Phuket for travelers planning an unusual evening activity.', tags: ['dining', 'food', 'evening'] }],
  ['212080P12', { shortSummary: 'A Phuket off-road ATV route through local landscapes with a Big Buddha visit.', tags: ['atv', 'adventure', 'viewpoints'] }],
  ['44720P2', { shortSummary: 'A Phang Nga Bay boat and canoeing day with sea caves and James Bond Island.', tags: ['canoeing', 'islands', 'nature'] }],
  ['110534P157', { shortSummary: 'A Phuket speedboat trip to James Bond Island, Panyee and nearby islands.', tags: ['islands', 'boat', 'speedboat'] }],
  ['380880P1', { shortSummary: 'A floating beach-club day in Phuket for travelers looking for music, sea views and leisure time.', tags: ['beach-club', 'boat', 'leisure'] }],
  ['110534P510', { shortSummary: 'A Phuket jet-ski island-hopping experience for travelers seeking an active day on the water.', tags: ['jet-ski', 'adventure', 'islands'] }],
  ['100246P6', { shortSummary: 'A Phuket yacht day through Phang Nga Bay and James Bond Island with a sunset return.', tags: ['islands', 'yacht', 'sunset'] }],
  ['133093P1', { shortSummary: 'A private boat day from Phuket to explore Phi Phi Island at a flexible pace.', tags: ['islands', 'boat', 'private'] }],
  ['5521242P62', { shortSummary: 'A relaxed Phuket big-boat trip to Phi Phi Islands with sea-view seating and island time.', tags: ['islands', 'boat', 'leisure'] }],
  ['110534P517', { shortSummary: 'A Phuket outdoor adventure combining ATV riding and zipline activity.', tags: ['atv', 'zipline', 'adventure'] }],
  ['100246P3', { shortSummary: 'A Phuket catamaran day to Phi Phi, Maya Bay and Maiton with snorkeling stops.', tags: ['islands', 'catamaran', 'snorkeling'] }],
  ['163642P25', { shortSummary: 'A full-day cultural trip from Chiang Mai to Chiang Rai’s White, Blue and Red Temples.', tags: ['temples', 'culture', 'day-trip'] }],
  ['110534P548', { shortSummary: 'A Chiang Mai day trip to Doi Inthanon National Park, waterfalls and the Royal Project.', tags: ['nature', 'waterfalls', 'day-trip'] }],
  ['108960P1', { shortSummary: 'An early Krabi speedboat day to Phi Phi and the Four Islands with time to swim and snorkel.', tags: ['islands', 'speedboat', 'snorkeling'] }],
  ['110534P3', { shortSummary: 'A one-day Krabi speedboat trip to Phi Phi Island and its major coastal stops.', tags: ['islands', 'speedboat', 'day-trip'] }],
  ['188931P9', { shortSummary: 'A group speedboat day from Ao Nang to Phi Phi with swimming, snorkeling and island time.', tags: ['islands', 'speedboat', 'snorkeling'] }],
  ['5509314P18', { shortSummary: 'A Krabi luxury-yacht trip to four islands with snorkeling and clear kayaking.', tags: ['islands', 'yacht', 'kayaking'] }],
  ['9574P369', { shortSummary: 'A private speedboat day from Krabi to Phi Phi and Maya Bay with a personal guide.', tags: ['islands', 'speedboat', 'private'] }],
  ['5565576P1', { shortSummary: 'An early-departure Krabi speedboat trip combining Phi Phi and Four Islands sightseeing.', tags: ['islands', 'speedboat', 'day-trip'] }],
  ['196966P1', { shortSummary: 'A private longtail-boat charter for a Krabi Four Islands route.', tags: ['islands', 'boat', 'private'] }],
  ['5509314P2', { shortSummary: 'A Krabi speedboat day to Phi Phi, Maya Bay and Bamboo Island with snorkeling.', tags: ['islands', 'speedboat', 'snorkeling'] }],
  ['196966P6', { shortSummary: 'A Krabi longtail-boat island route that ends with sunset views and a barbecue dinner.', tags: ['islands', 'boat', 'sunset'] }],
  ['196966P2', { shortSummary: 'A private longtail-boat tour from Krabi to Hong Island and nearby coastal scenery.', tags: ['islands', 'boat', 'private'] }],
  ['163642P100', { shortSummary: 'A full-day Krabi route to Tiger Cave Temple, Emerald Pool and hot springs.', tags: ['nature', 'temples', 'day-trip'] }],
  ['150469P6', { shortSummary: 'A guided Pattaya day mixing viewpoints, a floating market and local landmarks.', tags: ['city', 'culture', 'day-trip'] }],
  ['110534P569', { shortSummary: 'A tandem skydive above Pattaya for travelers seeking a high-adrenaline activity.', tags: ['adventure', 'skydiving', 'outdoors'] }],
  ['350014P86', { shortSummary: 'An entry ticket to Pattaya’s Sanctuary of Truth, known for its carved wooden architecture.', tags: ['culture', 'architecture', 'attraction'] }],
  ['5569118P6', { shortSummary: 'A half-day Pattaya jet-ski island-hopping route with snorkeling.', tags: ['jet-ski', 'adventure', 'snorkeling'] }],
  ['5521242P129', { shortSummary: 'A Pattaya Coral Island speedboat day with water activities, lunch and hotel transfers.', tags: ['islands', 'speedboat', 'beach'] }],
  ['5631777P4', { shortSummary: 'A Pattaya evening dinner cruise with sea views and onboard entertainment.', tags: ['dinner-cruise', 'evening', 'food'] }],
  ['32915P1', { shortSummary: 'A semi-private Koh Samui yacht day to Ang Thong Marine Park with kayaking and snorkeling.', tags: ['islands', 'yacht', 'kayaking'] }],
  ['157340P17', { shortSummary: 'A Koh Samui speedboat trip to Ang Thong National Marine Park with kayaking and snorkeling.', tags: ['islands', 'speedboat', 'kayaking'] }],
  ['110534P442', { shortSummary: 'A Koh Samui jungle activity combining a treetop café setting, waterfall views and zipline.', tags: ['zipline', 'nature', 'adventure'] }],
  ['461222P1', { shortSummary: 'A private Koh Samui longtail-boat day to Pig Island and Koh Taen.', tags: ['islands', 'boat', 'private'] }],
  ['202400P76', { shortSummary: 'A Koh Samui speedboat day through Ang Thong National Marine Park’s island scenery.', tags: ['islands', 'speedboat', 'nature'] }],
  ['382123P6', { shortSummary: 'A small-group Koh Samui day exploring Ang Thong Islands and the Emerald Lagoon.', tags: ['islands', 'boat', 'leisure'] }],
  ['358258P1', { shortSummary: 'A Koh Samui jet-ski safari to Pig Island and nearby snorkeling areas.', tags: ['jet-ski', 'adventure', 'snorkeling'] }],
  ['89944P3', { shortSummary: 'A Koh Samui speedboat day to Koh Tao and Koh Nang Yuan for snorkeling and sightseeing.', tags: ['islands', 'speedboat', 'snorkeling'] }],
  ['202400P9', { shortSummary: 'A Koh Samui island sightseeing route for travelers wanting a local orientation day.', tags: ['city', 'culture', 'sightseeing'] }],
])

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function isApprovedCandidate(value) {
  const candidate = asRecord(value)
  return candidate?.disposition === 'approved_for_public_seed'
    && typeof candidate.city === 'string'
    && typeof candidate.destinationId === 'string'
    && typeof candidate.productCode === 'string'
    && typeof candidate.title === 'string'
    && typeof candidate.productUrl === 'string'
    && typeof candidate.imageUrl === 'string'
}

export function buildViatorThailandBatch2PublicSeed(finalReview, {
  metadataByProductCode = publicMetadataByProductCode,
} = {}) {
  const review = asRecord(finalReview)
  const candidates = Array.isArray(review?.candidates) ? review.candidates : null
  const reviewedAt = typeof review?.reviewedAt === 'string' ? review.reviewedAt : null
  if (review?.status !== 'approved_for_public_seed' || !candidates || !reviewedAt) {
    return { ok: false, reason: 'invalid_final_review' }
  }

  const records = []
  const productCodes = new Set()

  for (const candidate of candidates.filter(isApprovedCandidate)) {
    const metadata = metadataByProductCode.get(candidate.productCode)
    if (!metadata) return { ok: false, reason: 'missing_public_metadata', productCode: candidate.productCode }
    if (productCodes.has(candidate.productCode)) return { ok: false, reason: 'duplicate_product_code', productCode: candidate.productCode }
    productCodes.add(candidate.productCode)

    records.push({
      id: `viator_${candidate.productCode.toLowerCase()}`,
      city: candidate.city,
      destinationId: candidate.destinationId,
      productCode: candidate.productCode,
      title: candidate.title,
      shortSummary: metadata.shortSummary,
      tags: metadata.tags,
      productUrl: candidate.productUrl,
      imageUrl: candidate.imageUrl,
      reviewedAt,
    })
  }

  if (records.length !== metadataByProductCode.size) {
    return { ok: false, reason: 'metadata_review_mismatch' }
  }

  return { ok: true, records }
}

export function formatReviewedViatorBatch2ProductsModule(records) {
  return `import type { ReviewedViatorProduct } from './reviewedViatorProducts'\n\nexport const reviewedViatorBatch2ProductSeedRecords: readonly ReviewedViatorProduct[] = ${JSON.stringify(records, null, 2)}\n`
}

export async function writeReviewedViatorBatch2ProductsModule(records, {
  outputPath = defaultOutputPath,
  mkdir = nodeMkdir,
  writeFile = nodeWriteFile,
} = {}) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, formatReviewedViatorBatch2ProductsModule(records), 'utf8')
}

async function main() {
  const inputPath = process.env.VIATOR_BATCH_2_FINAL_REVIEW_INPUT_PATH?.trim() || defaultInputPath
  const outputPath = process.env.VIATOR_BATCH_2_PUBLIC_SEED_OUTPUT_PATH?.trim() || defaultOutputPath

  let finalReview
  try {
    finalReview = JSON.parse(await nodeReadFile(inputPath, 'utf8'))
  } catch {
    process.stderr.write(`${JSON.stringify({ ok: false, reason: 'invalid_final_review' })}\n`)
    process.exitCode = 1
    return
  }

  const result = buildViatorThailandBatch2PublicSeed(finalReview)
  if (!result.ok) {
    process.stderr.write(`${JSON.stringify(result)}\n`)
    process.exitCode = 1
    return
  }

  await writeReviewedViatorBatch2ProductsModule(result.records, { outputPath })
  process.stdout.write(`${JSON.stringify({ ok: true, recordCount: result.records.length, outputPath })}\n`)
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}

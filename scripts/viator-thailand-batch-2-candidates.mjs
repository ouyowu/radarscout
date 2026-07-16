import { mkdir as nodeMkdir, writeFile as nodeWriteFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import { fetchViatorProductionPreview } from './viator-production-readonly-preview.mjs'

export const viatorThailandBatch2Plan = Object.freeze([
  { cityKey: 'bangkok', count: 20 },
  { cityKey: 'phuket', count: 20 },
  { cityKey: 'chiang-mai', count: 15 },
  { cityKey: 'krabi', count: 15 },
  { cityKey: 'pattaya', count: 15 },
  { cityKey: 'koh-samui', count: 15 },
])

const defaultOutputPath = 'private-inputs/viator-thailand-batch-2-candidates.json'

function toPrivateReviewCandidate(candidate) {
  return {
    city: candidate.city,
    destinationId: candidate.destinationId,
    productCode: candidate.productCode,
    title: candidate.title,
    productUrl: candidate.productUrl,
    imageUrl: candidate.imageUrl,
  }
}

export async function buildViatorThailandBatch2ReviewPool({
  apiKey,
  fetchCity = fetchViatorProductionPreview,
  importedAt = new Date().toISOString(),
} = {}) {
  if (!apiKey?.trim()) return { ok: false, reason: 'not_configured' }

  const candidates = []
  const productCodes = new Set()

  for (const plan of viatorThailandBatch2Plan) {
    const result = await fetchCity(
      { cityKey: plan.cityKey, count: plan.count },
      { apiKey },
    )

    if (!result.ok) {
      return {
        ok: false,
        reason: 'upstream_error',
        cityKey: plan.cityKey,
        ...(result.status ? { status: result.status } : {}),
      }
    }

    const uniqueCityCandidates = result.candidates.filter((candidate) => {
      if (productCodes.has(candidate.productCode)) return false
      productCodes.add(candidate.productCode)
      return true
    })

    if (uniqueCityCandidates.length < plan.count) {
      return {
        ok: false,
        reason: 'insufficient_candidates',
        cityKey: plan.cityKey,
        expectedCount: plan.count,
        acceptedCandidateCount: uniqueCityCandidates.length,
      }
    }

    candidates.push(...uniqueCityCandidates.slice(0, plan.count).map(toPrivateReviewCandidate))
  }

  return {
    ok: true,
    pool: {
      schemaVersion: 1,
      status: 'pending_human_review',
      importedAt,
      source: 'Viator Affiliate API production /products/search',
      candidateCount: candidates.length,
      candidates,
    },
  }
}

export async function writeViatorThailandBatch2ReviewPool(pool, {
  outputPath = defaultOutputPath,
  mkdir = nodeMkdir,
  writeFile = nodeWriteFile,
} = {}) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(pool, null, 2)}\n`, 'utf8')
}

async function main() {
  const result = await buildViatorThailandBatch2ReviewPool({
    apiKey: process.env.VIATOR_PRODUCTION_API_KEY,
  })

  if (!result.ok) {
    process.stderr.write(`${JSON.stringify(result)}\n`)
    process.exitCode = 1
    return
  }

  const outputPath = process.env.VIATOR_BATCH_2_OUTPUT_PATH?.trim() || defaultOutputPath
  await writeViatorThailandBatch2ReviewPool(result.pool, { outputPath })
  process.stdout.write(`${JSON.stringify({
    ok: true,
    candidateCount: result.pool.candidateCount,
    outputPath,
  })}\n`)
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}

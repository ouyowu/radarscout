#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

function loadPrismaClient() {
  try {
    return require('@prisma/client').PrismaClient
  } catch (error) {
    if (error?.code !== 'MODULE_NOT_FOUND') throw error

    return require('../packages/db/node_modules/@prisma/client').PrismaClient
  }
}

const PrismaClient = loadPrismaClient()

const KNOWN_THAILAND_CITIES = ['Chiang Mai', 'Bangkok', 'Phuket']
const SAMPLE_LIMIT = 8
const REPORT_PATH = path.join(process.cwd(), '.ai', 'product-quality-audit.md')

function loadDevelopmentEnv() {
  if (process.env.DATABASE_URL) return

  const envPath = path.join(process.cwd(), '.env.development')
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue
      .replace(/^['"]/, '')
      .replace(/['"]$/, '')

    if (key === 'DATABASE_URL' && value) {
      process.env.DATABASE_URL = value
      return
    }
  }
}

function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function readString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function stripHtml(value) {
  if (!value) return null

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || null
}

function normalizeCity(value) {
  const city = readString(value)
  if (!city) return null

  return KNOWN_THAILAND_CITIES.find(
    knownCity => knownCity.toLowerCase() === city.toLowerCase(),
  ) ?? null
}

function cityBucket(value) {
  return normalizeCity(value) ?? 'Unknown / Missing'
}

function addCount(counts, key) {
  counts.set(key, (counts.get(key) ?? 0) + 1)
}

function formatCounts(counts) {
  if (counts.size === 0) return '- None'

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => `- ${key}: ${count}`)
    .join('\n')
}

function findImageUrl(rawJson) {
  const raw = asRecord(rawJson)
  const keyPhoto = asRecord(raw.keyPhoto)
  const derived = Array.isArray(keyPhoto.derived) ? keyPhoto.derived : []
  const large = derived
    .map(asRecord)
    .find(image => readString(image.name) === 'large')
  const preview = derived
    .map(asRecord)
    .find(image => readString(image.name) === 'preview')

  return readString(large?.url) ??
    readString(large?.cleanUrl) ??
    readString(preview?.url) ??
    readString(preview?.cleanUrl) ??
    readString(keyPhoto.originalUrl)
}

function hasDescription(product) {
  const raw = asRecord(product.rawJson)

  return Boolean(
    stripHtml(product.description) ??
    stripHtml(product.excerpt) ??
    stripHtml(readString(raw.summary)) ??
    stripHtml(readString(raw.description)),
  )
}

function sampleProduct(product) {
  return [
    `id=${product.id}`,
    `title=${JSON.stringify(product.title)}`,
    `city=${JSON.stringify(product.city)}`,
    `supplierId=${product.supplierId ?? 'missing'}`,
  ].join(' | ')
}

function formatSamples(products) {
  if (products.length === 0) return '- None'

  return products
    .slice(0, SAMPLE_LIMIT)
    .map(product => `- ${sampleProduct(product)}`)
    .join('\n')
}

async function main() {
  loadDevelopmentEnv()

  const prisma = new PrismaClient()

  try {
    const products = await prisma.bokunProduct.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        excerpt: true,
        city: true,
        location: true,
        retailPrice: true,
        supplierId: true,
        active: true,
        rawJson: true,
      },
      orderBy: [{ city: 'asc' }, { title: 'asc' }],
    })

    const activeProducts = products.filter(product => product.active)
    const supplierBackedProducts = activeProducts.filter(product => Boolean(product.supplierId))
    const missingSupplierIdProducts = activeProducts.filter(product => !product.supplierId)
    const knownThailandCityProducts = activeProducts.filter(product => Boolean(normalizeCity(product.city)))
    const unknownOrMissingCityProducts = activeProducts.filter(product => !normalizeCity(product.city))
    const missingImageProducts = activeProducts.filter(product => !findImageUrl(product.rawJson))
    const missingPriceProducts = activeProducts.filter(product => product.retailPrice === null)
    const missingDescriptionProducts = activeProducts.filter(product => !hasDescription(product))

    const cityCoverage = new Map()
    const supplierCoverage = new Map()

    for (const product of activeProducts) {
      addCount(cityCoverage, cityBucket(product.city))
      addCount(supplierCoverage, product.supplierId ? product.supplierId : 'Missing supplierId')
    }

    const report = [
      '# Bókun Product Quality Audit',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Scope',
      '',
      '- Local development audit only.',
      '- Read-only Prisma query against BokunProduct.',
      '- No public route, UI, database write, booking, checkout, payment, or availability call.',
      '- Known Thailand city scope for this audit: Chiang Mai, Bangkok, Phuket.',
      '',
      '## Summary',
      '',
      `- Total products read: ${products.length}`,
      `- Active products: ${activeProducts.length}`,
      `- Active supplier-backed products: ${supplierBackedProducts.length}`,
      `- Active products missing supplierId: ${missingSupplierIdProducts.length}`,
      `- Active products in known Thailand cities: ${knownThailandCityProducts.length}`,
      `- Active products with unknown or missing city: ${unknownOrMissingCityProducts.length}`,
      `- Active products missing image: ${missingImageProducts.length}`,
      `- Active products missing price: ${missingPriceProducts.length}`,
      `- Active products missing description: ${missingDescriptionProducts.length}`,
      '',
      '## City Coverage',
      '',
      formatCounts(cityCoverage),
      '',
      '## SupplierId Coverage',
      '',
      formatCounts(supplierCoverage),
      '',
      '## Samples: Missing Image',
      '',
      formatSamples(missingImageProducts),
      '',
      '## Samples: Missing Price',
      '',
      formatSamples(missingPriceProducts),
      '',
      '## Samples: Missing Description',
      '',
      formatSamples(missingDescriptionProducts),
      '',
      '## Samples: Unknown Or Missing City',
      '',
      formatSamples(unknownOrMissingCityProducts),
      '',
      '## Judgment Rules',
      '',
      '- Missing image: no conservative image URL found from rawJson.keyPhoto derived large/preview/originalUrl.',
      '- Missing price: retailPrice is null.',
      '- Missing description: description, excerpt, rawJson.summary, and rawJson.description are all empty after HTML stripping.',
      '- City coverage: city must match Chiang Mai, Bangkok, or Phuket exactly after case normalization.',
      '- Supplier mapping: supplierId must be present.',
      '',
      '## Safety Notes',
      '',
      '- This report should remain local-only and should not be exposed as a public inventory scale claim.',
      '- SupplierId is used for internal coverage checks only.',
    ].join('\n')

    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
    fs.writeFileSync(REPORT_PATH, `${report}\n`, 'utf8')

    console.log(`Wrote ${REPORT_PATH}`)
    console.log(`Active products: ${activeProducts.length}`)
    console.log(`Active supplier-backed products: ${supplierBackedProducts.length}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(error => {
  console.error('Bokun product quality audit failed.')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

#!/usr/bin/env node
/**
 * RadarScout partner-handoff report.
 *
 * Read-only view of the PartnerHandoffLog table: how many real visitors
 * clicked through to a booking partner, and where those clicks came from.
 * This is the north-star metric — `booking_partner_handoff_clicked` — after
 * it has been persisted server-side.
 *
 * Usage (from the repo root):
 *   pnpm handoff:report                 # last 30 days
 *   pnpm handoff:report -- --days 7     # last 7 days
 *   pnpm handoff:report -- --recent 20  # also list the raw recent rows
 *
 * Requires DATABASE_URL in the environment. Performs SELECT queries only —
 * it never writes, migrates, or alters data.
 */

import { PrismaClient } from '@prisma/client'

function parseArgs(argv) {
  const args = { days: 30, recent: 0 }

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index]
    if (flag === '--days' || flag === '--recent') {
      const value = Number(argv[index + 1])
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`${flag} needs a positive number`)
      }
      args[flag.slice(2)] = Math.floor(value)
      index += 1
    }
  }

  return args
}

function since(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

function countBy(rows, key) {
  const tally = new Map()
  for (const row of rows) {
    const value = row[key] ?? '(none)'
    tally.set(value, (tally.get(value) ?? 0) + 1)
  }
  return [...tally.entries()].sort((left, right) => right[1] - left[1])
}

function printTable(title, entries, total) {
  console.log(`\n${title}`)
  if (entries.length === 0) {
    console.log('  (no data)')
    return
  }
  for (const [label, count] of entries) {
    const share = total > 0 ? ` (${Math.round((count / total) * 100)}%)` : ''
    console.log(`  ${String(count).padStart(5)}  ${label}${share}`)
  }
}

function formatDay(date) {
  return date.toISOString().slice(0, 10)
}

async function main() {
  const { days, recent } = parseArgs(process.argv.slice(2))

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Export it (or use your usual env file) and retry.')
    process.exitCode = 1
    return
  }

  const prisma = new PrismaClient()
  const from = since(days)

  try {
    const rows = await prisma.partnerHandoffLog.findMany({
      where: { clickedAt: { gte: from } },
      orderBy: { clickedAt: 'desc' },
    })

    const total = rows.length
    const sessions = new Set(rows.map(row => row.sessionId).filter(Boolean)).size

    console.log('='.repeat(58))
    console.log(`RadarScout partner handoffs — last ${days} day(s)`)
    console.log(`since ${formatDay(from)}`)
    console.log('='.repeat(58))
    console.log(`\nTotal partner clicks: ${total}`)
    console.log(`Distinct sessions:    ${sessions || '(none recorded)'}`)

    if (total === 0) {
      console.log('\nNo partner handoffs recorded in this window.')
      console.log('If you expected clicks, check that visitors actually reached a')
      console.log('product/finder page and clicked "Check availability".')
      return
    }

    printTable('By partner', countBy(rows, 'provider'), total)
    printTable('By placement', countBy(rows, 'placement'), total)
    printTable('By city', countBy(rows, 'city'), total)
    printTable('Top products', countBy(rows, 'productId').slice(0, 10), total)
    // Note: attributionSource records which partner the click went OUT to
    // (e.g. viator_affiliate), not which channel the visitor came FROM.
    // Inbound channel is not captured on this table today.
    printTable('By outbound attribution', countBy(rows, 'attributionSource'), total)

    const byDay = countBy(
      rows.map(row => ({ day: formatDay(row.clickedAt) })),
      'day',
    ).sort((left, right) => (left[0] < right[0] ? -1 : 1))
    printTable('By day', byDay, total)

    const withDates = rows.filter(row => row.intent?.hasDates === true).length
    console.log('\nTrip context on click')
    console.log(`  ${String(withDates).padStart(5)}  had travel dates (${Math.round((withDates / total) * 100)}%)`)
    console.log(`  ${String(total - withDates).padStart(5)}  no dates`)

    if (recent > 0) {
      console.log(`\nMost recent ${Math.min(recent, total)} clicks`)
      for (const row of rows.slice(0, recent)) {
        const when = row.clickedAt.toISOString().replace('T', ' ').slice(0, 16)
        console.log(
          `  ${when}  ${row.provider.padEnd(14)} ${(row.city ?? '-').padEnd(12)} ${row.productId ?? '-'}`,
        )
      }
    }

    console.log('')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

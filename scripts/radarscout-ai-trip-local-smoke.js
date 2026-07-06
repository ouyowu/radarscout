#!/usr/bin/env node
/* eslint-disable no-console */

const { runSmoke } = require('./radarscout-ai-trip-preview-smoke')

function usage() {
  console.error(`Usage:
  pnpm smoke:ai-trip-local <local-ai-trip-planner-url>

Examples:
  pnpm smoke:ai-trip-local http://localhost:3456/ai-trip-planner
  pnpm smoke:ai-trip-local http://127.0.0.1:3456/ai-trip-planner

Notes:
  - This script is read-only.
  - It refuses RadarScout production domains.
  - It only accepts localhost or 127.0.0.1 URLs.
  - It mocks /api/ai-trip/search to validate the local frontend shell without depending on local DB seed state.
  - It does not print, store, or request secrets.`)
}

function parseLocalUrl(rawUrl) {
  if (!rawUrl || rawUrl === '-h' || rawUrl === '--help') return null

  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`)
  }

  if (parsed.hostname === 'radarscout.io' || parsed.hostname === 'www.radarscout.io') {
    throw new Error('Refusing to run against RadarScout production domains.')
  }

  if (parsed.protocol !== 'http:') {
    throw new Error('Expected an http:// local URL.')
  }

  if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
    throw new Error(`Expected localhost or 127.0.0.1, got: ${parsed.hostname}`)
  }

  if (parsed.pathname !== '/ai-trip-planner') {
    parsed.pathname = '/ai-trip-planner'
  }

  return parsed.toString()
}

async function main() {
  const targetUrl = parseLocalUrl(process.argv[2])
  if (!targetUrl) {
    usage()
    process.exit(process.argv[2] ? 0 : 2)
  }

  await runSmoke(targetUrl)
}

if (require.main === module) {
  main().catch(error => {
    console.error(error.message)
    process.exit(1)
  })
}

module.exports = {
  parseLocalUrl,
}

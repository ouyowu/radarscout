#!/usr/bin/env node
/* eslint-disable no-console */

const http = require('node:http')
const { spawn } = require('node:child_process')

const DEFAULT_PORT = 3456
const DEFAULT_HOST = 'localhost'

function usage() {
  console.error(`Usage:
  pnpm smoke:ai-trip-local:production

Environment:
  RADARSCOUT_LOCAL_SMOKE_PORT=3456

What it does:
  1. Builds @reddit-monitor/web.
  2. Starts a local Next production server.
  3. Runs the localhost-only AI Trip smoke helper.
  4. Stops the local server.

Notes:
  - This script is read-only.
  - It does not deploy.
  - It does not call RadarScout production domains.
  - It does not require preview DB seed state because the smoke helper mocks /api/ai-trip/search.`)
}

function getPort(env = process.env) {
  const rawPort = env.RADARSCOUT_LOCAL_SMOKE_PORT
  if (!rawPort) return DEFAULT_PORT

  const parsed = Number.parseInt(rawPort, 10)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid RADARSCOUT_LOCAL_SMOKE_PORT: ${rawPort}`)
  }

  return parsed
}

function getLocalPlannerUrl(port = DEFAULT_PORT) {
  return `http://${DEFAULT_HOST}:${port}/ai-trip-planner`
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    })

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with ${signal ?? `exit code ${code}`}`))
    })
  })
}

function waitForHttp(url, { timeoutMs = 30_000, intervalMs = 250 } = {}) {
  const startedAt = Date.now()

  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, response => {
        response.resume()
        resolve()
      })

      req.on('error', error => {
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}: ${error.message}`))
          return
        }

        setTimeout(check, intervalMs)
      })

      req.setTimeout(intervalMs, () => {
        req.destroy(new Error('request timeout'))
      })
    }

    check()
  })
}

function stopProcess(child) {
  if (!child.pid || child.exitCode !== null) return

  if (process.platform === 'win32') {
    child.kill()
    return
  }

  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
}

async function main() {
  if (process.argv[2] === '-h' || process.argv[2] === '--help') {
    usage()
    return
  }

  const port = getPort()
  const localUrl = getLocalPlannerUrl(port)

  console.log(`[radarscout-ai-trip-local-production-smoke] Building @reddit-monitor/web`)
  await runCommand('pnpm', ['--filter', '@reddit-monitor/web', 'build'])

  console.log(`[radarscout-ai-trip-local-production-smoke] Starting local Next server on port ${port}`)
  const server = spawn('pnpm', ['--filter', '@reddit-monitor/web', 'exec', 'next', 'start', '-p', String(port)], {
    detached: process.platform !== 'win32',
    stdio: 'inherit',
  })

  try {
    await waitForHttp(localUrl)
    console.log(`[radarscout-ai-trip-local-production-smoke] Running AI Trip local smoke: ${localUrl}`)
    await runCommand('pnpm', ['smoke:ai-trip-local', localUrl])
  } finally {
    stopProcess(server)
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error.message)
    process.exit(1)
  })
}

module.exports = {
  getLocalPlannerUrl,
  getPort,
  waitForHttp,
}

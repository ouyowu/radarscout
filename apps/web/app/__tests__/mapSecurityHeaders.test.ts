import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const nextConfigSource = readFileSync(new URL('../../next.config.mjs', import.meta.url), 'utf8')

describe('Planner map security headers', () => {
  it('allows only the configured map tile providers through connect-src', () => {
    expect(nextConfigSource).toContain('https://tile.openstreetmap.org')
    expect(nextConfigSource).toContain('https://api.maptiler.com')
    expect(nextConfigSource).toContain(
      '"connect-src \'self\' https://api.stripe.com https://api.resend.com https://tile.openstreetmap.org https://api.maptiler.com"',
    )
  })
})

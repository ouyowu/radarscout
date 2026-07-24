import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { YesimEsimCard } from './YesimEsimCard'

describe('YesimEsimCard', () => {
  it('renders nothing while the Yesim provider decision is pending', () => {
    expect(YesimEsimCard()).toBeNull()
  })

  it('keeps unconfirmed price and API claims out of public copy', () => {
    const source = readFileSync(join(process.cwd(), 'app', '_components', 'YesimEsimCard.tsx'), 'utf8')

    expect(source).toMatch(/Stay connected in Thailand/)
    expect(source).toMatch(/Continue to Yesim for current plan details and activation/)
    expect(source).not.toMatch(/real-time|live price|cheapest|discount|guaranteed|available now/i)
    expect(source).not.toMatch(/api\.yesim\.app|prices\?partner=/i)
  })
})

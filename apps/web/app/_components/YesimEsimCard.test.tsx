import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { YesimEsimCard } from './YesimEsimCard'
import { TrackedAffiliateLink } from './TrackedAffiliateLink'

describe('YesimEsimCard', () => {
  it('uses the reviewed Yesim offer and safe external handoff', () => {
    const element = YesimEsimCard() as ReactElement
    const children = element.props.children as ReactElement[]
    const link = children.find(child => child?.type === TrackedAffiliateLink)

    expect(link).toBeDefined()
    expect(link!.props).toMatchObject({
      href: 'https://yesim.app/country/thailand/?partner_id=5044&sid=597',
      provider: 'yesim',
      placement: 'pre_departure',
      destination: 'Thailand',
      campaign: 'radarscout_thailand_esim',
    })
  })

  it('keeps unconfirmed price and API claims out of public copy', () => {
    const source = readFileSync(join(process.cwd(), 'app', '_components', 'YesimEsimCard.tsx'), 'utf8')

    expect(source).toMatch(/Stay connected in Thailand/)
    expect(source).toMatch(/Continue to Yesim for current plan details and activation/)
    expect(source).not.toMatch(/real-time|live price|cheapest|discount|guaranteed|available now/i)
    expect(source).not.toMatch(/api\.yesim\.app|prices\?partner=/i)
  })
})

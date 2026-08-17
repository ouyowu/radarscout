import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  hasCompleteImprint,
  OPERATOR_INDEPENDENCE_STATEMENT,
  siteOperator,
  type SiteOperator,
} from '../siteOperator'

const imprintSource = readFileSync(
  join(process.cwd(), 'app/about-us/SiteOperatorImprint.tsx'),
  'utf8',
)
const aboutSource = readFileSync(join(process.cwd(), 'app/about-us/page.tsx'), 'utf8')
const footerContentSource = readFileSync(
  join(process.cwd(), 'app/_content/publicSite.ts'),
  'utf8',
)

describe('site operator imprint', () => {
  it('publishes a reachable contact for the operator', () => {
    expect(siteOperator.brandName).toBe('RadarScout')
    expect(siteOperator.contactEmail).toBe('hello@radarscout.io')
  })

  it('never ships a placeholder entity or address', () => {
    const written = [siteOperator.legalEntity, siteOperator.registeredAddress]
      .filter((value): value is string => typeof value === 'string')

    for (const value of written) {
      expect(value.trim().length).toBeGreaterThan(0)
      expect(value).not.toMatch(/TODO|FIXME|TBD|XXX|placeholder|your company|example/i)
    }
  })

  it('reports an incomplete imprint until both entity and address are supplied', () => {
    const partial: SiteOperator = {
      ...siteOperator,
      legalEntity: 'Some Entity Co., Ltd.',
      registeredAddress: null,
    }
    expect(hasCompleteImprint(partial)).toBe(false)

    const complete: SiteOperator = {
      ...partial,
      registeredAddress: '123 Example Road, Bangkok 10110, Thailand',
    }
    expect(hasCompleteImprint(complete)).toBe(true)
  })

  it('renders entity and address rows only when they exist', () => {
    // Both rows are spread from a conditional, so an unset value contributes no
    // markup at all rather than an empty definition row.
    expect(imprintSource).toMatch(/siteOperator\.legalEntity\s*\n?\s*\?/)
    expect(imprintSource).toMatch(/siteOperator\.registeredAddress\s*\n?\s*\?/)
  })

  it('states the operator is independent of the suppliers it compares', () => {
    expect(OPERATOR_INDEPENDENCE_STATEMENT).toMatch(/not affiliated with, endorsed by, or operated by/i)
    expect(OPERATOR_INDEPENDENCE_STATEMENT).toMatch(/does not sell tickets, take payment, or confirm bookings/i)
    expect(imprintSource).toContain('OPERATOR_INDEPENDENCE_STATEMENT')
  })

  it('keeps the legal notice reachable from About and from the footer', () => {
    expect(aboutSource).toContain('<SiteOperatorImprint />')
    expect(imprintSource).toContain('id="operator"')
    expect(footerContentSource).toContain("href: '/about-us#operator'")
  })
})

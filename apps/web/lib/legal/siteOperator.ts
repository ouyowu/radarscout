/**
 * Who operates this website, for the imprint / legal notice.
 *
 * Affiliate programmes require a publisher to name the entity behind the site,
 * with a registered address and a way to reach it. GetYourGuide's Partner Pages
 * Content Guidelines put it plainly: a partner must "maintain an accessible
 * legal notice, imprint, or About us page naming the actual entity operating
 * the website, including registered address and contact details", and failing
 * that can deactivate the partner account.
 *
 * `legalEntity` and `registeredAddress` are null until the owner supplies real
 * values — a placeholder company or address would be a false statement about a
 * real business on a live commercial site, which is worse than an absent one.
 * The imprint renders every field it actually has and omits the rest, so
 * nothing untrue ever ships. Fill both in to become compliant.
 */
export type SiteOperator = {
  /** Trading name shown to travellers as the operator of this site. */
  brandName: string
  /** Registered legal entity. Null until supplied by the owner. */
  legalEntity: string | null
  /** Registered address of that entity. Null until supplied by the owner. */
  registeredAddress: string | null
  /** Reachable contact address for the operator. */
  contactEmail: string
}

export const siteOperator: SiteOperator = {
  brandName: 'RadarScout',
  legalEntity: null,
  registeredAddress: null,
  contactEmail: 'hello@radarscout.io',
}

/**
 * True once the imprint names a real entity and address. Until then the site
 * identifies its operator and contact but cannot claim to carry a full legal
 * notice.
 */
export function hasCompleteImprint(operator: SiteOperator = siteOperator): boolean {
  return Boolean(operator.legalEntity?.trim()) && Boolean(operator.registeredAddress?.trim())
}

/**
 * The independence statement. RadarScout compares activities it does not run,
 * so the imprint says so in plain language rather than leaving a reader to
 * infer that a listed venue endorses or operates this site.
 */
export const OPERATOR_INDEPENDENCE_STATEMENT =
  'RadarScout is operated independently. It is not affiliated with, endorsed by, or operated by any activity supplier, venue, or attraction featured on this site, and it does not sell tickets, take payment, or confirm bookings.'

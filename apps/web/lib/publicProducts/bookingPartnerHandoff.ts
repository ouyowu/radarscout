import { ownerManagedBokunProfiles } from '@/lib/elephantFinder/ownerManagedBokunProfiles'

export const PUBLIC_BOOKING_PARTNER_HANDOFF_REL =
  'nofollow sponsored noopener noreferrer' as const

export type PublicBookingPartnerHandoff = {
  href: string
  label: 'Check availability'
  rel: typeof PUBLIC_BOOKING_PARTNER_HANDOFF_REL
  source:
    | 'owner_managed_profile'
    | 'operator_verified_public_link'
    | 'booking_partner_verified_public_widget'
  verifiedBy: 'operator_manual_review' | 'owner_managed_catalog'
}

type PublicBookingPartnerHandoffInput = {
  href: unknown
  source: PublicBookingPartnerHandoff['source']
  verifiedBy: PublicBookingPartnerHandoff['verifiedBy']
}

const UNSAFE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /\.local$/i,
  /\.internal$/i,
]

const UNSAFE_HOST_LABEL_PATTERN =
  /(^|[.-])(admin|backend|database|extranet|supplier|private|preview|staging|localhost)([.-]|$)/i

const UNSAFE_PATH_SEGMENT_PATTERN =
  /(^|\/)(admin|backend|database|extranet|supplier|private|preview|staging|localhost)(\/|$)/i

const SENSITIVE_QUERY_KEYS = new Set([
  'api_key',
  'apikey',
  'access_key',
  'accesskey',
  'auth',
  'authorization',
  'password',
  'secret',
  'session',
  'token',
])

function isPublicHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false

  const trimmed = value.trim()
  if (!trimmed) return false

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return false
  }

  if (url.protocol !== 'https:') return false
  if (url.username || url.password) return false

  const hostname = url.hostname.toLowerCase()
  if (UNSAFE_HOST_PATTERNS.some(pattern => pattern.test(hostname))) return false
  if (UNSAFE_HOST_LABEL_PATTERN.test(hostname)) return false
  if (UNSAFE_PATH_SEGMENT_PATTERN.test(url.pathname)) return false

  for (const key of url.searchParams.keys()) {
    if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) return false
  }

  return true
}

export function validatePublicBookingPartnerHandoff(
  input: PublicBookingPartnerHandoffInput,
): PublicBookingPartnerHandoff | null {
  if (!isPublicHttpsUrl(input.href)) return null

  return {
    href: input.href.trim(),
    label: 'Check availability',
    rel: PUBLIC_BOOKING_PARTNER_HANDOFF_REL,
    source: input.source,
    verifiedBy: input.verifiedBy,
  }
}

export function resolveOwnerManagedProfileHandoff(
  bokunActivityId: string | null | undefined,
): PublicBookingPartnerHandoff | null {
  const normalizedId = bokunActivityId?.trim()
  if (!normalizedId || !/^\d+$/.test(normalizedId)) return null

  const profile = ownerManagedBokunProfiles.find(candidate => candidate.bokunId === normalizedId)
  if (!profile?.bookingHandoffUrl) return null

  return validatePublicBookingPartnerHandoff({
    href: profile.bookingHandoffUrl,
    source: 'owner_managed_profile',
    verifiedBy: 'owner_managed_catalog',
  })
}

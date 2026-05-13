interface TrieNode {
  children: Map<string, TrieNode>
  failure: TrieNode | null
  outputs: Array<{ id: string; length: number }>
}

export interface PatternMatch {
  id: string
  start: number
  end: number
}

export class AhoCorasick {
  private root: TrieNode = { children: new Map(), failure: null, outputs: [] }
  private built = false

  addPattern(id: string, text: string): void {
    if (this.built) throw new Error('Cannot add patterns after build()')
    const lower = text.toLowerCase()
    let node = this.root
    for (const char of lower) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), failure: null, outputs: [] })
      }
      node = node.children.get(char)!
    }
    node.outputs.push({ id, length: lower.length })
  }

  build(): void {
    if (this.built) return
    const queue: TrieNode[] = []

    // Depth-1 nodes fail back to root
    for (const child of this.root.children.values()) {
      child.failure = this.root
      queue.push(child)
    }

    while (queue.length > 0) {
      const curr = queue.shift()!
      for (const [char, child] of curr.children) {
        // Walk up failure chain from curr's failure until we find `char` or reach root
        let f = curr.failure!
        while (f !== this.root && !f.children.has(char)) f = f.failure!
        child.failure = f.children.get(char) ?? this.root
        // Avoid self-loop at root level
        if (child.failure === child) child.failure = this.root
        // Inherit suffix outputs (dictionary links)
        child.outputs = [...child.outputs, ...child.failure.outputs]
        queue.push(child)
      }
    }

    this.built = true
  }

  search(text: string): PatternMatch[] {
    if (!this.built) throw new Error('Call build() before search()')
    const lower = text.toLowerCase()
    const results: PatternMatch[] = []
    let node = this.root

    for (let i = 0; i < lower.length; i++) {
      const char = lower[i]
      // Follow failure links until we find a valid transition or reach root
      while (node !== this.root && !node.children.has(char)) node = node.failure!
      if (node.children.has(char)) node = node.children.get(char)!
      for (const { id, length } of node.outputs) {
        results.push({ id, start: i - length + 1, end: i + 1 })
      }
    }

    return results
  }
}

export interface ThaiNightVenue {
  id?: string
  slug: string
  name: string
  city?: string
  area_slug?: string
  area_name?: string | null
  category?: string | null
  url?: string
}

export interface VenueFuzzyMatch {
  venue: ThaiNightVenue
  score: number
  matchedText: string
}

type ThaiNightVenueResponse =
  | ThaiNightVenue[]
  | { venues?: ThaiNightVenue[]; data?: ThaiNightVenue[]; items?: ThaiNightVenue[] }

function normalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokens(value: string): string[] {
  return normalizeText(value).split(/\s+/).filter(token => token.length >= 3)
}

const GENERIC_VENUE_TOKENS = new Set([
  'bar',
  'and',
  'bars',
  'club',
  'clubs',
  'pub',
  'eatery',
  'restaurant',
  'bangkok',
  'pattaya',
  'phuket',
  'chiang',
  'mai',
])

function tokenOverlapScore(venueName: string, text: string): number {
  const venueTokens = tokens(venueName).filter(token => !GENERIC_VENUE_TOKENS.has(token))
  if (venueTokens.length === 0) return 0
  const textTokens = new Set(tokens(text))
  const hits = venueTokens.filter(token => textTokens.has(token)).length
  return hits / venueTokens.length
}

function extractVenues(payload: ThaiNightVenueResponse): ThaiNightVenue[] {
  if (Array.isArray(payload)) return payload
  return payload.venues ?? payload.data ?? payload.items ?? []
}

export async function fetchThaiNightVenues(
  endpoint = 'https://thainightlife.com/api/venues',
): Promise<ThaiNightVenue[]> {
  try {
    const response = await fetch(endpoint, {
      headers: { accept: 'application/json' },
    })
    if (!response.ok) return []
    const payload = (await response.json()) as ThaiNightVenueResponse
    return extractVenues(payload).filter(
      venue => typeof venue.name === 'string' && typeof venue.slug === 'string',
    )
  } catch {
    return []
  }
}

export function fuzzyMatchVenue(
  text: string,
  venues: ThaiNightVenue[],
  minScore = 0.72,
): VenueFuzzyMatch | null {
  const normalizedText = normalizeText(text)
  let best: VenueFuzzyMatch | null = null

  for (const venue of venues) {
    const normalizedName = normalizeText(venue.name)
    if (!normalizedName) continue

    const exactScore = normalizedText.includes(normalizedName) ? 1 : 0
    const overlapScore = tokenOverlapScore(venue.name, text)
    const score = Math.max(exactScore, overlapScore)

    if (score >= minScore && (!best || score > best.score)) {
      best = { venue, score, matchedText: venue.name }
    }
  }

  return best
}

export async function fuzzyMatchVenueFromThaiNight(
  text: string,
  options: { endpoint?: string; minScore?: number } = {},
): Promise<VenueFuzzyMatch | null> {
  const venues = await fetchThaiNightVenues(options.endpoint)
  return fuzzyMatchVenue(text, venues, options.minScore)
}

'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Product = {
  id: string
  title: string
  city: string | null
  imageUrl: string | null
  retailPrice: string | null
  netSettlementPrice: string | null
  currency: string | null
  excerpt: string | null
  summary: string | null
  supplier: { title: string } | null
}

type ProductsResponse = {
  products: Product[]
}

const promptExamples = [
  'Phuket 3 days and Chiang Mai 4 days, private feel, elephants, islands, food, nice hotels',
  'Bangkok day tour for a couple: canals, temples, street food, avoid tourist traps',
  'Find Thailand island day tours cheaper than Viator, with hotel pickup and easy booking',
]

const fallbackTours: Product[] = [
  {
    id: 'phuket-phi-phi',
    title: 'Phuket Phi Phi Island Speedboat Day',
    city: 'Phuket',
    imageUrl: null,
    retailPrice: '129',
    netSettlementPrice: '98',
    currency: 'USD',
    excerpt: 'A fast island day with hotel pickup, snorkel time, and a lower direct-rate estimate.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'chiang-mai-elephant',
    title: 'Chiang Mai Ethical Elephant Walk',
    city: 'Chiang Mai',
    imageUrl: null,
    retailPrice: '145',
    netSettlementPrice: '112',
    currency: 'USD',
    excerpt: 'No riding, softer pace, local lunch, and clearer animal-welfare expectations.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'bangkok-food',
    title: 'Bangkok Canals, Temples & Food Route',
    city: 'Bangkok',
    imageUrl: null,
    retailPrice: '118',
    netSettlementPrice: '86',
    currency: 'USD',
    excerpt: 'Heat-aware Bangkok route for old-town temples, canals, and evening food.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'krabi-four-islands',
    title: 'Krabi Four Islands Longtail Day',
    city: 'Krabi',
    imageUrl: null,
    retailPrice: '105',
    netSettlementPrice: '79',
    currency: 'USD',
    excerpt: 'Classic Krabi beaches sequenced around tide windows and easier pier logistics.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'samui-ang-thong',
    title: 'Koh Samui Ang Thong Marine Park',
    city: 'Koh Samui',
    imageUrl: null,
    retailPrice: '142',
    netSettlementPrice: '109',
    currency: 'USD',
    excerpt: 'A scenic marine park day with kayak options and comfort notes before booking.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'ayutthaya-history',
    title: 'Ayutthaya Temples from Bangkok',
    city: 'Ayutthaya',
    imageUrl: null,
    retailPrice: '96',
    netSettlementPrice: '72',
    currency: 'USD',
    excerpt: 'A clean historical day trip with private-driver logic and less midday walking.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
]

function parseMoney(value: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.round(parsed) : null
}

function displayPrice(product: Product): string {
  const price = parseMoney(product.netSettlementPrice) ?? parseMoney(product.retailPrice) ?? 99
  return `$${price}`
}

function publicPrice(product: Product): string {
  const base = parseMoney(product.retailPrice) ?? parseMoney(product.netSettlementPrice) ?? 129
  return `$${Math.round(base * 1.18)}`
}

function shortText(product: Product): string {
  return product.excerpt ?? product.summary ?? 'Active Thailand day-tour option with supplier inventory, city match, and direct-rate estimate.'
}

function cityList(products: Product[]): string {
  return Array.from(new Set(products.map(product => product.city).filter(Boolean))).slice(0, 4).join(' + ')
}

export function ThailandTourChat() {
  const [query, setQuery] = useState(promptExamples[0])
  const [submittedQuery, setSubmittedQuery] = useState(promptExamples[0])
  const [products, setProducts] = useState<Product[]>(fallbackTours)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLiveCatalog, setHasLiveCatalog] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        const params = new URLSearchParams({ take: '6' })
        if (submittedQuery.trim()) params.set('q', submittedQuery.trim())

        const response = await fetch(`/api/bokun/products?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) throw new Error('Unable to load products')

        const payload = await response.json() as ProductsResponse
        if (payload.products.length) {
          setProducts(payload.products.slice(0, 6))
          setHasLiveCatalog(true)
        } else {
          setProducts(fallbackTours)
          setHasLiveCatalog(false)
        }
      } catch {
        if (!controller.signal.aborted) {
          setProducts(fallbackTours)
          setHasLiveCatalog(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [submittedQuery])

  const answer = useMemo(() => {
    const cities = cityList(products) || 'Thailand'
    const first = products[0]
    const second = products[1]
    const third = products[2]

    return {
      headline: `I found a ${cities} route with direct-rate day tours.`,
      body: `For this request, I would start with ${first?.title ?? 'a private city introduction'}, then add ${second?.title ?? 'one relaxed nature day'} and ${third?.title ?? 'one food or culture day'}. The plan keeps pickup zones simple, avoids long midday transfers, and shows the public marketplace estimate beside your direct RadarScout price.`,
    }
  }, [products])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    window.setTimeout(() => {
      setSubmittedQuery(query.trim())
      setIsLoading(false)
    }, 350)
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <form
        onSubmit={handleSubmit}
        className="border-2 border-black bg-white p-3 shadow-[12px_12px_0_#ff9933] sm:p-5"
      >
        <label htmlFor="tour-chat" className="block px-1 text-xs font-black uppercase tracking-[0.22em] text-[#007c8a]">
          Tell us your Thailand day-tour idea
        </label>
        <textarea
          id="tour-chat"
          value={query}
          onChange={event => setQuery(event.target.value)}
          className="mt-3 min-h-36 w-full resize-none border border-[#e5dccf] bg-[#fcfaee] p-4 text-base leading-7 text-black outline-none placeholder:text-[#81776b] focus:border-black sm:text-lg"
          placeholder="Example: Phuket 3 days, Chiang Mai 4 days, island tours, elephants, boutique hotels, under Viator prices..."
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-sm leading-6 text-[#5f5549]">
            Ask in normal language. Include cities, dates, travelers, hotel style, budget, and anything you want to avoid.
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="min-h-[52px] bg-black px-7 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#ff9933] hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#81776b]"
          >
            {isLoading ? 'Matching...' : 'Build my plan'}
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {promptExamples.map(prompt => (
          <button
            key={prompt}
            type="button"
            onClick={() => setQuery(prompt)}
            className="min-h-[44px] border border-black bg-[#f1e3d5] px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#ff9933] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {prompt}
          </button>
        ))}
      </div>

      <section className="mt-8 border border-black bg-[#fcfaee] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff7900]">
              {hasLiveCatalog ? 'Live Bókun catalog demo' : 'Curated demo catalog'}
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-black sm:text-4xl">
              {answer.headline}
            </h2>
          </div>
          <div className="border border-black bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f5549]">Matched tours</p>
            <p className="mt-1 text-3xl font-black text-black">{products.length}</p>
          </div>
        </div>
        <p className="mt-5 max-w-4xl text-base leading-8 text-[#3f372f]">{answer.body}</p>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 6).map((product, index) => (
          <article key={product.id} className="group flex min-h-full flex-col border border-black bg-white">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f1e3d5]">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-end bg-[linear-gradient(135deg,#f1e3d5,#fcfaee_45%,#007c8a)] p-5">
                  <p className="text-4xl font-black text-white drop-shadow">{product.city ?? 'Thailand'}</p>
                </div>
              )}
              <span className="absolute left-3 top-3 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                #{index + 1} {product.city ?? 'Thailand'}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#007c8a]">
                {product.supplier?.title ?? 'Local supplier'}
              </p>
              <h3 className="mt-3 text-xl font-black leading-tight text-black">{product.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#5f5549]">{shortText(product)}</p>
              <div className="mt-5 grid grid-cols-2 border border-[#e5dccf]">
                <div className="border-r border-[#e5dccf] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#81776b]">Viator est.</p>
                  <p className="mt-1 text-lg font-black text-[#81776b] line-through">{publicPrice(product)}</p>
                </div>
                <div className="bg-[#fcfaee] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff7900]">Our offer</p>
                  <p className="mt-1 text-lg font-black text-black">{displayPrice(product)}</p>
                </div>
              </div>
              <a
                href={`mailto:hello@radarscout.io?subject=${encodeURIComponent(`Reserve ${product.title}`)}`}
                className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-black px-4 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#ff9933] hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Reserve in 2 minutes
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

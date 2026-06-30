'use client'

import { FormEvent, useMemo, useState } from 'react'

type Product = {
  id: string
  title: string
  city: string | null
  imageUrl: string | null
  excerpt: string | null
  summary: string | null
  supplier: { title: string } | null
}

const promptExamples = [
  'Phuket 3 days and Chiang Mai 4 days, private feel, elephants, islands, food, nice hotels',
  'Bangkok day tour for a couple: canals, temples, street food, avoid tourist traps',
  'Find Thailand island day tours with hotel pickup, clear inclusions, and easy partner handoff',
]

const fallbackTours: Product[] = [
  {
    id: 'phuket-phi-phi',
    title: 'Phuket Phi Phi Island Speedboat Day',
    city: 'Phuket',
    imageUrl: null,
    excerpt: 'A fast island day with hotel pickup, snorkel time, and a clear experience-fit estimate.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'chiang-mai-elephant',
    title: 'Chiang Mai Ethical Elephant Walk',
    city: 'Chiang Mai',
    imageUrl: null,
    excerpt: 'No riding, softer pace, local lunch, and clearer animal-welfare expectations.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'bangkok-food',
    title: 'Bangkok Canals, Temples & Food Route',
    city: 'Bangkok',
    imageUrl: null,
    excerpt: 'Heat-aware Bangkok route for old-town temples, canals, and evening food.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'krabi-four-islands',
    title: 'Krabi Four Islands Longtail Day',
    city: 'Krabi',
    imageUrl: null,
    excerpt: 'Classic Krabi beaches sequenced around tide windows and easier pier logistics.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'samui-ang-thong',
    title: 'Koh Samui Ang Thong Marine Park',
    city: 'Koh Samui',
    imageUrl: null,
    excerpt: 'A scenic marine park day with kayak options and comfort notes before partner handoff.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
  {
    id: 'ayutthaya-history',
    title: 'Ayutthaya Temples from Bangkok',
    city: 'Ayutthaya',
    imageUrl: null,
    excerpt: 'A clean historical day trip with private-driver logic and less midday walking.',
    summary: null,
    supplier: { title: 'RadarScout curated' },
  },
]

function shortText(product: Product): string {
  return product.excerpt ?? product.summary ?? 'Thailand day-tour option with city match, route fit, and clear partner handoff details.'
}

function cityList(products: Product[]): string {
  return Array.from(new Set(products.map(product => product.city).filter(Boolean))).slice(0, 4).join(' + ')
}

function rankProductsForQuery(query: string): Product[] {
  const normalizedQuery = query.toLowerCase()
  const preferredCity = fallbackTours.find(product => product.city && normalizedQuery.includes(product.city.toLowerCase()))

  if (!preferredCity) return fallbackTours

  return [
    preferredCity,
    ...fallbackTours.filter(product => product.id !== preferredCity.id),
  ]
}

export function ThailandTourChat() {
  const [query, setQuery] = useState(promptExamples[0])
  const [submittedQuery, setSubmittedQuery] = useState(promptExamples[0])
  const [isLoading, setIsLoading] = useState(false)
  const products = useMemo(() => rankProductsForQuery(submittedQuery), [submittedQuery])

  const answer = useMemo(() => {
    const cities = cityList(products) || 'Thailand'
    const first = products[0]
    const second = products[1]
    const third = products[2]

    return {
      headline: `I found a ${cities} route with matched day-tour ideas.`,
      body: `For this request, I would start with ${first?.title ?? 'a private city introduction'}, then add ${second?.title ?? 'one relaxed nature day'} and ${third?.title ?? 'one food or culture day'}. The plan keeps pickup zones simple, avoids long midday transfers, and compares experience fit before sending you to a booking partner for current details.`,
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
          placeholder="Example: Phuket 3 days, Chiang Mai 4 days, island tours, elephants, boutique hotels, softer pace..."
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
              Current product sample
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
              <div className="mt-5 border border-[#e5dccf] bg-[#fcfaee] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff7900]">
                  Read-only comparison sample
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#5f5549]">
                  Use this static planning card to compare fit, then continue with a booking partner for current details.
                </p>
              </div>
              <a
                href={`mailto:hello@radarscout.io?subject=${encodeURIComponent(`RadarScout question: ${product.title}`)}`}
                className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-black px-4 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#ff9933] hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Ask about this experience
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

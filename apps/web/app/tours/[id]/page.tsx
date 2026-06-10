import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db, Prisma } from '@reddit-monitor/db'
import { detectProductType, getPriceDisclaimer, marketplaceEstimateValue, priceComparisonLabel, productSelectionScore, productView, publicEstimate, radarScoutOffer, radarScoutOfferValue } from '@/lib/bokunProductView'
import { fetchBokunActivityDetails } from '@/lib/bokun'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: { id: string }
  searchParams?: { page?: string }
}

const PAGE_SIZE = 12

const TAG_COPY: Record<string, { title: string; intro: string; faq: Array<{ question: string; answer: string }> }> = {
  adventure: {
    title: 'Best Adventure Tours in Thailand',
    intro: 'Compare direct-rate Thailand adventure tours including rafting, jungle walks, island routes, caves, viewpoints, and full-day outdoor trips planned with realistic timing.',
    faq: [
      { question: 'Are these adventure tours full-day or half-day?', answer: 'RadarScout labels the tour duration from supplier data and avoids forcing two half-day tours into one rushed day.' },
      { question: 'Can I request a private adventure tour?', answer: 'Yes. Use the booking request form on any product page and add your hotel area, group size, pace, and private-tour preference.' },
      { question: 'Are prices final?', answer: 'Prices are direct-rate estimates. RadarScout confirms supplier availability and final pickup details before payment.' },
    ],
  },
  'elephant-care': {
    title: 'Best Elephant Care Experiences in Thailand',
    intro: 'Find Thailand elephant sanctuary and observation experiences with ethical-care signals, supplier descriptions, direct-rate estimates, and simple availability requests.',
    faq: [
      { question: 'Does RadarScout prioritize ethical elephant experiences?', answer: 'The tag engine looks for sanctuary, elephant care, observation, rescue, and nature-reserve language in supplier content.' },
      { question: 'Can I add elephant care to a multi-city trip?', answer: 'Yes. The trip planner can include one suitable elephant experience without repeating elephant tours every day.' },
      { question: 'Do these tours include pickup?', answer: 'Pickup depends on the supplier and hotel area. RadarScout confirms the pickup window before reservation.' },
    ],
  },
  'food-experience': {
    title: 'Best Food Experiences in Thailand',
    intro: 'Browse Thailand food tours, cooking classes, market visits, lunch routes, dinner experiences, and culinary activities with direct-rate price comparison.',
    faq: [
      { question: 'Are cooking classes included?', answer: 'Yes. Cooking-class products are tagged separately when supplier content mentions cooking, recipes, Thai cuisine, or market preparation.' },
      { question: 'Can food tours be combined with temples or markets?', answer: 'Yes, but RadarScout keeps daily timing realistic and avoids stacking rushed activities.' },
      { question: 'Can dietary notes be added?', answer: 'Yes. Add vegetarian, allergy, spice-level, or dietary notes in the booking request.' },
    ],
  },
  'airport-transfer': {
    title: 'Airport Transfers and Private Transport in Thailand',
    intro: 'Compare airport transfers, private transport, pickup, drop-off, fast-track, and VIP transfer products across Thailand with supplier-backed direct-rate estimates.',
    faq: [
      { question: 'Can I book airport pickup through RadarScout?', answer: 'Yes. Submit your travel date, pickup area, arrival details, and passenger count so RadarScout can confirm availability.' },
      { question: 'Are transfers private?', answer: 'Many transfer products are private or premium. Check the product title and details before sending a request.' },
      { question: 'Do I pay before confirmation?', answer: 'No. RadarScout sends a booking request first and confirms supplier availability before payment instructions.' },
    ],
  },
}

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function parsePage(value: string | undefined): number {
  if (!value) return 1
  const page = Number(value)
  if (!Number.isFinite(page)) return 1
  return Math.max(Math.floor(page), 1)
}

async function findTagBySlug(slug: string): Promise<string | null> {
  const tags = await db.productTag.groupBy({
    by: ['tagName'],
    where: { active: true, product: { active: true } },
  })

  return tags.find(tag => slugifyTag(tag.tagName) === slug)?.tagName ?? null
}

export async function generateMetadata({ params }: PageProps) {
  const product = await db.bokunProduct.findUnique({
    where: { id: params.id },
    select: { title: true, excerpt: true, city: true },
  })

  if (!product) {
    const tagName = await findTagBySlug(params.id)
    if (!tagName) return { title: 'Tour not found | RadarScout' }

    const slug = slugifyTag(tagName)
    const copy = TAG_COPY[slug]
    return {
      title: `${copy?.title ?? `Best ${tagName} Tours in Thailand`} | RadarScout`,
      description: copy?.intro ?? `Browse Thailand ${tagName.toLowerCase()} tours with RadarScout direct-rate price comparison and supplier-backed availability requests.`,
    }
  }

  return {
    title: `${product.title} | RadarScout Thailand Day Tours`,
    description: product.excerpt ?? `Book ${product.title} in ${product.city ?? 'Thailand'} with RadarScout direct-rate itinerary support.`,
  }
}

async function TagLandingPage({ tagName, page }: { tagName: string; page: number }) {
  const skip = (page - 1) * PAGE_SIZE
  const slug = slugifyTag(tagName)
  const copy = TAG_COPY[slug] ?? {
    title: `Best ${tagName} Tours in Thailand`,
    intro: `Browse Thailand ${tagName.toLowerCase()} tours with RadarScout direct-rate price comparison, supplier-backed products, and simple booking requests.`,
    faq: [
      { question: `How does RadarScout select ${tagName} tours?`, answer: 'RadarScout uses supplier content and tag scoring to surface active products matching this travel style.' },
      { question: 'Can I request custom timing?', answer: 'Yes. Send a booking request from the product page and include hotel area, travel date, pace, and anything to avoid.' },
      { question: 'Are prices confirmed immediately?', answer: 'Displayed prices are estimates. RadarScout confirms supplier availability and final price before payment.' },
    ],
  }

  const where = {
    active: true,
    tagName: {
      equals: tagName,
      mode: 'insensitive' as const,
    },
    product: {
      active: true,
    },
  }
  const [total, rows] = await Promise.all([
    db.productTag.count({ where }),
    db.productTag.findMany({
      where,
      orderBy: [
        { score: 'desc' },
        { lastSeenAt: 'desc' },
      ],
      skip,
      take: PAGE_SIZE,
      include: {
        product: {
          include: {
            supplier: {
              select: { title: true, status: true },
            },
          },
        },
      },
    }),
  ])
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  return (
    <main className="min-h-screen bg-[#f1eadc] text-[#101820] [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.07)_1px,transparent_0)] [background-size:24px_24px]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <Link href="/tours" className="min-h-[44px] bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
          All tours
        </Link>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-3xl font-black text-[#101820] [font-family:cursive]">RadarScout tag guide</p>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-[-0.04em] sm:text-7xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-8 text-[#5a5147]">
            {copy.intro}
          </p>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">
            {total} active supplier products tagged {tagName}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row, index) => {
            const product = row.product
            const view = productView(product.rawJson, product.description, product.excerpt)
            const score = productSelectionScore(product)
            const productType = detectProductType(product)
            const directPrice = radarScoutOffer(product.retailPrice, product.netSettlementPrice, product.currency, productType)
            const estimatedOtaPrice = publicEstimate(product.retailPrice, product.netSettlementPrice, product.currency)
            const comparisonLabel = priceComparisonLabel(product.retailPrice, product.netSettlementPrice, productType).split('*')[0]

            return (
              <Link key={product.id} href={`/tours/${product.id}`} className="group overflow-hidden bg-[#fffdf7] shadow-[0_14px_34px_rgba(16,24,32,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,24,32,0.16)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f1eadc]">
                  {view.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={view.imageUrl} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-end bg-[linear-gradient(135deg,#0f766e,#d9ebe6_55%,#f7f5ef)] p-5">
                      <p className="text-4xl font-black text-white drop-shadow">{product.city ?? 'Thailand'}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                  <div className="absolute left-4 top-4 z-10 bg-[#101820] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white">
                    #{skip + index + 1} {product.city ?? 'Thailand'}
                  </div>
                  <div className="absolute right-4 top-4 z-10 max-w-[52%] rounded-full bg-[#0f766e] px-3 py-1 text-right text-xs font-black text-white">
                    {comparisonLabel}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
                    {product.supplier?.title ?? 'Local supplier'}
                  </p>
                  <h2 className="mt-3 line-clamp-2 font-serif text-2xl font-black leading-tight tracking-[-0.02em] text-[#101820] group-hover:text-[#0f766e]">
                    {product.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-[#5a6670]">
                    {view.summary ?? product.excerpt ?? 'Active Thailand day-tour option with supplier inventory and direct-rate estimate.'}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[#efb735]">★★★★★</span>
                    <span className="text-xs font-black uppercase tracking-[0.08em] text-[#697783]">
                      Tag score {row.score.toString()} · curated {score}
                    </span>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#e4ddd0] pt-4">
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#7b8790] line-through">Typical OTA {estimatedOtaPrice}</p>
                      <p className="text-2xl font-black text-[#0f766e]">{directPrice}</p>
                    </div>
                    <span className="text-right text-sm font-black text-[#0f766e]">Direct-rate offer</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {totalPages > 1 ? (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link href={`/tours/${slug}${page - 1 > 1 ? `?page=${page - 1}` : ''}`} className="min-h-[44px] bg-[#fffdf7] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#101820] shadow-[0_10px_24px_rgba(16,24,32,0.08)]">
                Previous
              </Link>
            ) : null}
            <span className="px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#5a5147]">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={`/tours/${slug}?page=${page + 1}`} className="min-h-[44px] bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}

        <section className="mt-16 bg-[#fffdf7] p-6 shadow-[0_14px_34px_rgba(16,24,32,0.08)] sm:p-8">
          <h2 className="font-serif text-3xl font-black tracking-[-0.03em]">FAQ</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {copy.faq.map(item => (
              <article key={item.question}>
                <h3 className="text-base font-black">{item.question}</h3>
                <p className="mt-2 text-sm font-semibold leading-7 text-[#5a5147]">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default async function TourDetailPage({ params, searchParams }: PageProps) {
  const product = await db.bokunProduct.findUnique({
    where: { id: params.id },
    include: {
      supplier: {
        select: { title: true, status: true },
      },
    },
  })

  if (!product) {
    const tagName = await findTagBySlug(params.id)
    if (!tagName) notFound()

    return <TagLandingPage tagName={tagName} page={parsePage(searchParams?.page)} />
  }

  if (!product.active) notFound()

  const detailResult = await fetchBokunActivityDetails({
    activityId: product.bokunActivityId,
    currency: product.currency ?? undefined,
    lang: 'EN',
  }).catch(() => null)
  const rawJson = detailResult?.ok ? detailResult.body as Prisma.JsonValue : product.rawJson
  const view = productView(rawJson, product.description, product.excerpt)
  const itinerary = view.itinerary.length
    ? view.itinerary
    : [
        'Confirm hotel area, pickup window, traveler count, and preferred travel date.',
        'Run this as one full-day tour or one standalone half-day tour only. RadarScout will not stitch two half-days into one rushed day.',
        'Send a booking request and we confirm supplier availability, final pickup details, and direct-rate pricing.',
      ]
  const included = view.included.length ? view.included : ['Supplier activity arrangement', 'RadarScout direct-rate planning support', 'Pickup guidance when available']
  const excluded = view.excluded.length ? view.excluded : ['Personal expenses', 'Optional tips', 'Items not confirmed by the supplier']
  const additionalInfo = [
    ...view.additionalInfo,
    ...(view.cancellationPolicy ? ['Cancellation policy: supplier cancellation rules apply'] : []),
    ...(view.guidance.length ? view.guidance.map(item => `Guide: ${item}`) : []),
    ...(view.meetingType ? [`Meeting type: ${view.meetingType.replace(/_/g, ' ').toLowerCase()}`] : []),
    ...(view.difficulty ? [`Difficulty: ${view.difficulty.toLowerCase()}`] : []),
    ...(view.pickup ? [`Pickup: ${view.pickup}`] : []),
  ].filter((item, index, items) => item && index === items.findIndex(candidate => candidate === item))
  const mainImage = view.imageUrl
  const uniqueImages = (view.images.length ? view.images : mainImage ? [mainImage] : [])
    .filter((image, index, images) => index === images.findIndex(candidate => candidate.split('?')[0] === image.split('?')[0]))
    .slice(0, 3)
  const compactSummary = (view.summary ?? product.excerpt ?? 'Active Thailand day-tour option with supplier inventory and direct-rate estimate.')
    .replace(/\s+/g, ' ')
    .slice(0, 420)
  const descriptionParagraphs = view.descriptionParagraphs.length
    ? view.descriptionParagraphs
    : [compactSummary]
  const safeTiming = 'One full-day tour or one standalone half-day tour only'
  const productType = detectProductType(product)
  const publicPrice = publicEstimate(product.retailPrice, product.netSettlementPrice, product.currency)
  const radarPrice = radarScoutOffer(product.retailPrice, product.netSettlementPrice, product.currency, productType)
  const comparisonLabel = priceComparisonLabel(product.retailPrice, product.netSettlementPrice, productType)
  const publicPriceValue = marketplaceEstimateValue(product.retailPrice, product.netSettlementPrice)
  const radarPriceValue = radarScoutOfferValue(product.retailPrice, product.netSettlementPrice, productType)
  const estimatedSavings = publicPriceValue !== null && radarPriceValue !== null
    ? `${product.currency ?? 'USD'} ${Math.max(0, publicPriceValue - radarPriceValue)}`
    : 'Quote'

  return (
    <main className="min-h-screen bg-[#fbf7ea] text-[#101820]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <Link href="/tours" className="min-h-[44px] bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
          All tours
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] lg:items-start lg:px-8">
        <div className="lg:sticky lg:top-6">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#e8dfcc] shadow-[0_18px_40px_rgba(16,24,32,0.10)]">
            {mainImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImage} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-end bg-[linear-gradient(135deg,#0f766e,#d9ebe6_55%,#f7f5ef)] p-8">
                <p className="text-5xl font-black text-white drop-shadow">{product.city ?? 'Thailand'}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/10 to-transparent" />
          </div>
          {uniqueImages.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {uniqueImages.slice(0, 4).map((image, index) => (
                <div key={image} className={`aspect-[4/3] w-full border-4 ${index === 0 ? 'border-[#f59a3d]' : 'border-[#f4a34a]/60'} bg-[#e8dfcc] p-1`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${product.title} preview ${index + 1}`} className="h-full w-full object-cover opacity-80" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="py-2 lg:pl-4">
          <p className="text-2xl font-black text-[#101820] [font-family:cursive]">{product.city ?? 'Thailand'} day tour</p>
          <h1 className="mt-3 font-serif text-4xl font-black leading-[0.98] tracking-[-0.035em] sm:text-5xl">
            {product.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-xl leading-none text-[#efb735]">★★★★★</span>
            <span className="text-xs font-black uppercase tracking-[0.1em] text-[#e85e30]">Smart-compared direct-rate offer</span>
            {view.reviewCount ? (
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[#5a5147]">
                {view.reviewRating ? `${view.reviewRating}/5 · ` : ''}{view.reviewCount} reviews
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-4">
            <p className="text-4xl font-black tracking-[-0.04em]">
              {radarPrice}
            </p>
            <p className="pb-1 text-xl font-bold text-[#7b8790] line-through">
              {publicPrice}
            </p>
          </div>
          <div className="mt-4 grid overflow-hidden border border-[#ded7ca] bg-white shadow-[0_10px_0_rgba(16,24,32,0.05)] sm:grid-cols-2">
            <div className="border-b border-[#ded7ca] p-3 sm:border-b-0 sm:border-r">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7b8790]">Major OTA estimated price</p>
              <p className="mt-2 text-xl font-black text-[#7b8790] line-through">{publicPrice}</p>
            </div>
            <div className="bg-[#eef8f4] p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">RadarScout target offer</p>
              <p className="mt-2 text-xl font-black text-[#101820]">{radarPrice}</p>
            </div>
          </div>
          <p className="mt-3 inline-flex bg-[#101820] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
            {comparisonLabel}
          </p>
          <p className="mt-3 text-xs font-semibold italic text-[#697783]">{getPriceDisclaimer()}</p>

          <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-[#5a5147]">
            {compactSummary}{compactSummary.length >= 420 ? '...' : ''}
          </p>

          <div className="mt-7 grid gap-4">
            <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
              <p className="text-base font-black">Duration</p>
              <div className="flex flex-wrap gap-4">
                <span className="bg-[#101820] px-4 py-2 text-sm font-semibold text-white">{view.duration ?? 'Full day'}</span>
                <span className="px-2 py-2 text-sm font-semibold text-[#5a5147]">Pickup window confirmed</span>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
              <p className="text-base font-black">Age Range</p>
              <div className="flex flex-wrap gap-4">
                <span className="bg-[#101820] px-4 py-2 text-sm font-semibold text-white">All ages</span>
                <span className="px-2 py-2 text-sm font-semibold text-[#5a5147]">Supplier rules apply</span>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
              <p className="text-base font-black">Group</p>
              <div className="flex flex-wrap gap-4">
                <span className="bg-[#101820] px-4 py-2 text-sm font-semibold text-white">1 Person+</span>
                <span className="px-2 py-2 text-sm font-semibold text-[#5a5147]">{safeTiming}</span>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-5 text-sm font-black">
            <span>♡ Add to wishlist</span>
            <span>↗ Compare direct rate</span>
            <span>⌘ Share</span>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-[140px_1fr]">
            <div className="grid min-h-[56px] grid-cols-3 border border-[#101820] text-center text-lg font-black">
              <span className="content-center">−</span>
              <span className="content-center">1</span>
              <span className="content-center">+</span>
            </div>
            <Link
              href="mailto:hello@radarscout.io"
              className="inline-flex min-h-[56px] items-center justify-center bg-[#f59a3d] px-5 text-center text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-[#e85e30]"
            >
              Request availability
            </Link>
          </div>
          <Link
            href="mailto:hello@radarscout.io"
            className="mt-4 inline-flex min-h-[56px] w-full items-center justify-center bg-[#f59a3d] px-5 text-center text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-[#e85e30]"
          >
            Check availability
          </Link>

          <div className="mt-8 border-t border-[#d8d1c4] pt-6">
            <p className="text-sm font-semibold leading-7 text-[#5a5147]">🚐 <strong>Pickup:</strong> Confirmed after hotel-area check.</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a5147]">💳 <strong>Payment:</strong> Request first, pay after supplier confirmation.</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a5147]">↘ <strong>Price:</strong> Direct-rate offer shown beside estimated OTA pricing.</p>
          </div>

          <section className="mt-10 bg-[#fffdf7] p-5 shadow-[0_14px_34px_rgba(16,24,32,0.10)] sm:p-6 lg:p-8">
            <h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[#101820]">
              Contact us for availability
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a5147]">
              Availability and booking requests are currently handled manually while we finalize supplier onboarding and direct Bókun partner agreements.
            </p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a5147]">
              Email us at hello@radarscout.io with your travel date, group size, and preferred experience.
            </p>
            <a
              href={`mailto:hello@radarscout.io?subject=${encodeURIComponent(`Availability request: ${product.title}`)}`}
              className="mt-5 inline-flex min-h-[56px] items-center justify-center bg-[#f59a3d] px-6 text-center text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-[#e85e30]"
            >
              Email RadarScout
            </a>
          </section>
        </div>
      </section>

      <section className="border-y border-[#ded7ca] bg-[#fbf7ea]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 border-b border-[#ded7ca] text-center text-sm font-black uppercase tracking-[0.06em] sm:text-base">
            <div className="border-b-4 border-[#f59a3d] py-6 text-[#f59a3d]">Description</div>
            <div className="py-6">Additional Information</div>
            <div className="py-6">Reviews</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-5xl space-y-5 text-base font-semibold leading-8 text-[#101820]">
          {descriptionParagraphs.slice(0, 8).map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-black">All This Trip Includes</h2>
            <ul className="mt-5 space-y-2 text-sm font-semibold leading-7 text-[#5a5147]">
              {included.slice(0, 8).map(item => <li key={item}>• {item}</li>)}
            </ul>

            <div className="mt-16">
              <h2 className="text-2xl font-black">Itinerary & timing</h2>
              <ul className="mt-5 space-y-2 text-sm font-semibold leading-7 text-[#5a5147]">
                {itinerary.slice(0, 8).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black">Additional Information</h2>
            <ul className="mt-5 space-y-2 text-sm font-semibold leading-7 text-[#5a5147]">
              {additionalInfo.length
                ? additionalInfo.slice(0, 12).map(item => <li key={item}>• {item}</li>)
                : (
                    <>
                      {excluded.slice(0, 6).map(item => <li key={item}>• {item}</li>)}
                      <li>• Confirmation is sent after supplier availability is checked.</li>
                      <li>• Pickup details depend on hotel area and supplier rules.</li>
                    </>
                  )}
            </ul>
            <p className="mt-8 bg-[#101820] p-5 text-sm font-semibold leading-7 text-white">
              {view.pickup ?? 'Pickup details depend on hotel area and supplier availability. RadarScout confirms the exact pickup window before reservation.'}
            </p>

            <div className="mt-10">
              <h2 className="text-2xl font-black">Reviews</h2>
              <div className="mt-5 bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
                <div className="flex flex-wrap items-end gap-3">
                  <p className="text-3xl font-black text-[#101820]">
                    {view.reviewRating ? `${view.reviewRating}/5` : 'No public rating yet'}
                  </p>
                  <p className="pb-1 text-sm font-black uppercase tracking-[0.12em] text-[#e85e30]">
                    {view.reviewCount ? `${view.reviewCount} supplier reviews` : 'Supplier reviews not provided'}
                  </p>
                </div>

                {view.reviews.length ? (
                  <div className="mt-6 space-y-5">
                    {view.reviews.slice(0, 4).map(review => (
                      <article key={`${review.author ?? 'guest'}-${review.text.slice(0, 20)}`} className="border-t border-[#ded7ca] pt-5">
                        <div className="flex flex-wrap items-center gap-2 text-sm font-black">
                          <span>{review.author ?? 'Verified traveler'}</span>
                          {review.rating ? <span className="text-[#efb735]">{review.rating}/5</span> : null}
                          {review.date ? <span className="text-[#7b8790]">{review.date}</span> : null}
                        </div>
                        {review.title ? <h3 className="mt-2 font-black">{review.title}</h3> : null}
                        <p className="mt-2 text-sm font-semibold leading-7 text-[#5a5147]">{review.text}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm font-semibold leading-7 text-[#5a5147]">
                    Bókun has not provided public review text for this activity yet. RadarScout will show review details here when the supplier feed includes them.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

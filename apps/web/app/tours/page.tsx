import Link from 'next/link'
import { db } from '@reddit-monitor/db'
import { detectProductType, getPriceDisclaimer, priceComparisonLabel, productSelectionScore, productView, publicEstimate, radarScoutOffer } from '@/lib/bokunProductView'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Thailand Day Tours With Smart Price Comparison | RadarScout',
  description: 'Browse RadarScout selected Thailand day tours with smart price comparison against estimated OTA prices and lower direct-rate offers.',
}

type ToursPageProps = {
  searchParams?: {
    tag?: string
    page?: string
  }
}

const PAGE_SIZE = 12

const FEATURED_TAGS = [
  'Island Hopping',
  'Elephant Care',
  'Adventure',
  'Food Experience',
  'Temple Tour',
  'Airport Transfer',
  'Private Tour',
  'Spa',
]

function parsePage(value: string | undefined): number {
  if (!value) return 1

  const page = Number(value)
  if (!Number.isFinite(page)) return 1

  return Math.max(Math.floor(page), 1)
}

function pageHref(tag: string | undefined, page: number): string {
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
  if (page > 1) params.set('page', String(page))

  const query = params.toString()
  return query ? `/tours?${query}` : '/tours'
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const selectedTag = searchParams?.tag?.trim()
  const currentPage = parsePage(searchParams?.page)
  const skip = (currentPage - 1) * PAGE_SIZE
  const thailandWhere = {
    NOT: {
      OR: [
        { title: { contains: 'Kenya', mode: 'insensitive' as const } },
        { title: { contains: 'Nairobi', mode: 'insensitive' as const } },
        { title: { contains: 'Maasai', mode: 'insensitive' as const } },
        { title: { contains: 'Mara', mode: 'insensitive' as const } },
        { title: { contains: 'Nakuru', mode: 'insensitive' as const } },
        { title: { contains: 'Giraffe', mode: 'insensitive' as const } },
      ],
    },
  }
  const productWhere = {
    active: true,
    ...thailandWhere,
  }
  const tagWhere = selectedTag
    ? {
        active: true,
        tagName: {
          equals: selectedTag,
          mode: 'insensitive' as const,
        },
        product: productWhere,
      }
    : null

  const [tagCounts, totalProducts, productRows] = await Promise.all([
    db.productTag.groupBy({
      by: ['tagName'],
      where: {
        active: true,
        product: productWhere,
      },
      _count: {
        tagName: true,
      },
    }),
    selectedTag && tagWhere
      ? db.productTag.count({ where: tagWhere })
      : db.bokunProduct.count({ where: productWhere }),
    selectedTag && tagWhere
      ? db.productTag.findMany({
          where: tagWhere,
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
        }).then(rows => rows.map(row => row.product))
      : db.bokunProduct.findMany({
          where: productWhere,
          orderBy: [{ updatedAt: 'desc' }],
          skip,
          take: PAGE_SIZE,
          include: {
            supplier: {
              select: { title: true, status: true },
            },
          },
        }),
  ])
  const selectedProducts = productRows
  const totalPages = Math.max(Math.ceil(totalProducts / PAGE_SIZE), 1)
  const tagCountMap = new Map(tagCounts.map(tag => [tag.tagName.toLowerCase(), tag._count.tagName]))
  const allToursCount = await db.bokunProduct.count({
    where: productWhere,
  })

  return (
    <main className="min-h-screen bg-[#f1eadc] text-[#101820] [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.07)_1px,transparent_0)] [background-size:24px_24px]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <Link href="/#planner" className="min-h-[44px] bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
          Plan a trip
        </Link>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-3xl font-black text-[#101820] [font-family:cursive]">Smart price comparison catalog</p>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-[-0.04em] sm:text-7xl">
            Thailand tours priced against estimated OTA rates
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-8 text-[#5a5147]">
            {selectedTag
              ? `Showing ${totalProducts} active supplier tours tagged ${selectedTag}. Each card compares an estimated major online travel agency price with a RadarScout direct-rate offer.`
              : `${allToursCount} active supplier tours synced from connected suppliers. Each card compares an estimated major online travel agency price with a RadarScout direct-rate offer.`}
          </p>
        </div>

        <nav aria-label="Tour tags" className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-3">
          <Link
            href="/tours"
            className={`min-h-[44px] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] transition ${
              selectedTag
                ? 'bg-[#fffdf7] text-[#101820] shadow-[0_10px_24px_rgba(16,24,32,0.08)] hover:bg-white'
                : 'bg-[#101820] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]'
            }`}
          >
            All tours ({allToursCount})
          </Link>
          {FEATURED_TAGS.map(tag => (
            <Link
              key={tag}
              href={`/tours?tag=${encodeURIComponent(tag)}`}
              className={`min-h-[44px] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] transition ${
                selectedTag?.toLowerCase() === tag.toLowerCase()
                  ? 'bg-[#f59a3d] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]'
                  : 'bg-[#fffdf7] text-[#101820] shadow-[0_10px_24px_rgba(16,24,32,0.08)] hover:bg-white'
              }`}
            >
              {tag} ({tagCountMap.get(tag.toLowerCase()) ?? 0})
            </Link>
          ))}
        </nav>

        {selectedProducts.length === 0 ? (
          <div className="mx-auto mt-12 max-w-2xl bg-white/85 p-8 text-center shadow-[0_18px_40px_rgba(16,24,32,0.10)]">
            <h2 className="text-3xl font-black">No supplier products synced yet.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#5a5147]">
              Connect and sync Bókun first, then this page will automatically show the active products.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {selectedProducts.map((product, index) => {
              const view = productView(product.rawJson, product.description, product.excerpt)
              const score = productSelectionScore(product)
              const productType = detectProductType(product)
              const directPrice = radarScoutOffer(product.retailPrice, product.netSettlementPrice, product.currency, productType)
              const estimatedOtaPrice = publicEstimate(product.retailPrice, product.netSettlementPrice, product.currency)
              const comparisonLabel = priceComparisonLabel(product.retailPrice, product.netSettlementPrice, productType).split('*')[0]

              return (
                <Link
                  key={product.id}
                  href={`/tours/${product.id}`}
                  className="group overflow-hidden bg-[#fffdf7] shadow-[0_14px_34px_rgba(16,24,32,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,24,32,0.16)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f1eadc]">
                    {view.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={view.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
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
                    <h2 className="mt-3 line-clamp-2 font-serif text-2xl font-black leading-tight tracking-[-0.02em] text-[#101820] transition-colors group-hover:text-[#0f766e]">
                      {product.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-[#5a6670]">
                      {view.summary ?? 'Active Thailand day-tour option with supplier inventory and direct-rate estimate.'}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex items-center text-[#efb735]" aria-label="Five star tour">
                        {[0, 1, 2, 3, 4].map(star => (
                          <svg key={star} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.08em] text-[#697783]">
                        Curated score {score}
                      </span>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#e4ddd0] pt-4">
                      <div>
                        <p className="mb-1 text-xs font-bold text-[#7b8790] line-through">
                          Typical OTA {estimatedOtaPrice}
                        </p>
                        <p className="text-2xl font-black text-[#0f766e]">
                          {directPrice}
                        </p>
                      </div>
                      <span className="text-right text-sm font-black text-[#0f766e]">
                        Direct-rate offer
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
        {selectedProducts.length > 0 && totalPages > 1 ? (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
            {currentPage > 1 ? (
              <Link
                href={pageHref(selectedTag, currentPage - 1)}
                className="min-h-[44px] bg-[#fffdf7] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#101820] shadow-[0_10px_24px_rgba(16,24,32,0.08)]"
              >
                Previous
              </Link>
            ) : null}
            <span className="px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#5a5147]">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                href={pageHref(selectedTag, currentPage + 1)}
                className="min-h-[44px] bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]"
              >
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
        <div className="mt-12 border-l-4 border-[#f59a3d] bg-[#fff8e8] p-6">
          <p className="text-sm font-semibold leading-6 text-[#8a5a13]">
            {getPriceDisclaimer()}
          </p>
        </div>
      </section>
    </main>
  )
}

import React from 'react'
import Link from 'next/link'

/**
 * Where RadarScout has actually walked. Each city is a pin on a route drawn
 * roughly to Thailand's own geography — north to the gulf to the Andaman.
 *
 * `photo` is the slot for a real photograph of the city. Until one exists the
 * pin falls back to its `scene`, so the section is never a row of holes. To
 * add a picture, drop the file in `public/images/cities/` and set `photo` here
 * — nothing else changes.
 */
type CityScene = 'temple' | 'mountains' | 'coast' | 'skyline' | 'island'

type JourneyCity = {
  name: string
  known: string
  href: string
  /** Percentage position within the map frame. */
  x: number
  y: number
  scene: CityScene
  photo?: string
}

const CITIES: readonly JourneyCity[] = [
  { name: 'Chiang Mai', known: 'Elephants · Old City vs Nimman', href: '/guides/chiang-mai', x: 34, y: 14, scene: 'mountains', photo: '/images/cities/chiang-mai.jpg' },
  { name: 'Bangkok', known: 'Canals · Markets · First-time bases', href: '/guides/bangkok', x: 47, y: 40, scene: 'skyline', photo: '/images/cities/bangkok.jpg' },
  { name: 'Pattaya', known: 'Jomtien · Day trips worth the drive', href: '/thailand/bangkok', x: 66, y: 49, scene: 'coast', photo: '/images/cities/pattaya.jpg' },
  { name: 'Koh Samui', known: 'Bophut · Gulf-season timing', href: '/thailand/bangkok', x: 74, y: 66, scene: 'island', photo: '/images/cities/koh-samui.jpg' },
  { name: 'Krabi', known: 'Railay · Ao Nang · Island runs', href: '/thailand/phuket', x: 36, y: 70, scene: 'coast', photo: '/images/cities/krabi.jpg' },
  { name: 'Phuket', known: 'Andaman islands · Kata vs Bang Tao', href: '/guides/phuket', x: 28, y: 86, scene: 'island', photo: '/images/cities/phuket.jpg' },
]

const SCENES: Record<CityScene, { from: string; via: string; to: string; art: React.ReactNode }> = {
  mountains: {
    from: '#2A2036', via: '#7E4436', to: '#D68B45',
    art: <path fill="#1A1118" d="M0,120 L0,84 L22,68 L44,82 L62,58 L78,80 L100,66 L120,86 L120,120 Z" />,
  },
  temple: {
    from: '#2B1F30', via: '#7A4232', to: '#D9903F',
    art: <path fill="#170F14" d="M0,120 L0,96 L34,90 L52,66 L58,44 L64,66 L84,92 L120,88 L120,120 Z" />,
  },
  skyline: {
    from: '#181C2E', via: '#5B3350', to: '#C9603F',
    art: (
      <g fill="#110C16">
        <rect x="8" y="72" width="14" height="48" /><rect x="26" y="56" width="11" height="64" />
        <rect x="41" y="80" width="16" height="40" /><rect x="61" y="48" width="12" height="72" />
        <rect x="77" y="70" width="15" height="50" /><rect x="96" y="60" width="12" height="60" />
      </g>
    ),
  },
  coast: {
    from: '#1E2A38', via: '#6E4438', to: '#E0974A',
    art: (
      <g>
        <path fill="#14202B" d="M0,120 L0,92 L30,86 L58,94 L88,84 L120,92 L120,120 Z" />
        <path fill="#0E1820" d="M0,120 L0,106 L120,100 L120,120 Z" />
      </g>
    ),
  },
  island: {
    from: '#1C2733', via: '#5F4437', to: '#E7A552',
    art: (
      <g fill="#111C22">
        <path d="M0,120 L0,100 L26,94 L46,102 L46,120 Z" />
        <path d="M72,120 L72,96 L92,88 L120,98 L120,120 Z" />
        <path d="M56,102 C56,88 62,80 62,72 C62,80 68,88 68,102 Z" />
      </g>
    ),
  },
}

function CityPin({ city }: { city: JourneyCity }) {
  const scene = SCENES[city.scene]

  return (
    <Link
      href={city.href}
      className="group absolute z-10 -translate-x-1/2 -translate-y-full focus-visible:outline-none"
      style={{ left: `${city.x}%`, top: `${city.y}%` }}
    >
      <span className="relative flex flex-col items-center">
        {/* Teardrop frame: circular print with a cream mount and a point. */}
        <span className="relative block h-[62px] w-[62px] overflow-hidden rounded-full border-[3px] border-rs-sand-50 shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110 sm:h-[76px] sm:w-[76px]">
          {city.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={city.photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full">
              <defs>
                <linearGradient id={`pin-${city.name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={scene.from} />
                  <stop offset="0.58" stopColor={scene.via} />
                  <stop offset="1" stopColor={scene.to} />
                </linearGradient>
              </defs>
              <rect width="120" height="120" fill={`url(#pin-${city.name.replace(/\s/g, '')})`} />
              {scene.art}
            </svg>
          )}
        </span>
        <span
          aria-hidden="true"
          className="-mt-1 h-0 w-0 border-x-[7px] border-t-[11px] border-x-transparent border-t-rs-sand-50"
        />
        <span className="mt-1.5 whitespace-nowrap text-center">
          <span className="block font-rs-display text-sm font-semibold text-white sm:text-base">{city.name}</span>
        </span>
      </span>
    </Link>
  )
}

export function JourneyMap() {
  return (
    <section className="relative overflow-hidden bg-rs-forest-900 px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="rs-paper pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <h2 className="font-rs-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Journey<br />Map
          </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-24 rounded-full bg-rs-terracotta" />
          <p className="mt-6 max-w-[34ch] text-base leading-8 text-white/74">
            Six cities we can answer follow-up questions about — not a map of everywhere,
            a map of where we have actually been.
          </p>
          <Link
            href="/guides"
            className="mt-7 inline-flex min-h-[48px] items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-rs-gold transition hover:text-rs-terracotta"
          >
            Start exploring
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative aspect-[4/5] w-full sm:aspect-[5/4]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
            <path
              d="M34,14 L47,40 L66,49 L74,66 L36,70 L28,86"
              fill="none"
              stroke="var(--rs-gold)"
              strokeWidth="0.5"
              strokeDasharray="2 2.6"
              opacity="0.75"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {CITIES.map(city => <CityPin key={city.name} city={city} />)}
        </div>
      </div>
    </section>
  )
}

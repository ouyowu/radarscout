import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'
import {
  buildThailandRouteMapModel,
  getThailandOutlinePoints,
  THAILAND_MAP_VIEWBOX,
} from '@/lib/ai-trip/thailand-route-map'
import { buildOpenStreetMapSearchHref } from './dayTripMap'

type ThailandRouteMapProps = {
  itinerary: DayTripItinerary
}

// Inline schematic SVG map: no external tiles, no API keys, city-level pins
// only. Exact meeting and pickup details remain on each product page.
export function ThailandRouteMap({ itinerary }: ThailandRouteMapProps) {
  const model = buildThailandRouteMapModel(itinerary)

  if (model.stops.length === 0 && model.unmappedCities.length === 0) return null

  const outlinePoints = getThailandOutlinePoints()

  return (
    <figure aria-label="Schematic Thailand route overview" className="m-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <svg
          viewBox={`0 0 ${THAILAND_MAP_VIEWBOX.width} ${THAILAND_MAP_VIEWBOX.height}`}
          role="img"
          aria-label={`Schematic map of Thailand showing ${model.stops.length} route stop${model.stops.length === 1 ? '' : 's'}`}
          className="mx-auto h-auto w-full max-w-[240px] shrink-0 sm:mx-0"
        >
          <rect
            x="0"
            y="0"
            width={THAILAND_MAP_VIEWBOX.width}
            height={THAILAND_MAP_VIEWBOX.height}
            rx="18"
            fill="#fff3ee"
          />
          <polygon
            points={outlinePoints}
            fill="#d9ece8"
            stroke="#9ac9c0"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {model.segments.map((segment, index) => (
            <line
              key={`${segment.from.city}-${segment.to.city}-${index}`}
              x1={segment.from.x}
              y1={segment.from.y}
              x2={segment.to.x}
              y2={segment.to.y}
              stroke="#2a6f66"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          ))}
          {model.stops.map(stop => (
            <g key={stop.city}>
              <circle cx={stop.x} cy={stop.y} r="11" fill="#f9ab00" opacity="0.24" />
              <circle cx={stop.x} cy={stop.y} r="6.5" fill="#f9ab00" stroke="#ffffff" strokeWidth="2" />
              <text
                x={stop.x + 12}
                y={stop.y + 4}
                fontSize="13"
                fontWeight="700"
                fill="#2d3436"
              >
                {stop.city}
              </text>
            </g>
          ))}
        </svg>

        <div className="min-w-0 flex-1">
          <ol className="grid gap-2">
            {model.stops.map(stop => (
              <li
                key={stop.city}
                className="flex items-center justify-between gap-3 rounded-rs-md bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-rs-ink">{stop.city}</p>
                  <p className="mt-0.5 text-xs font-semibold text-rs-muted">
                    Day {stop.dayNumbers.join(', ')}
                  </p>
                </div>
                <a
                  href={buildOpenStreetMapSearchHref(stop.city)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${stop.city} area map`}
                  className="inline-flex min-h-[44px] shrink-0 items-center rounded-rs-pill border border-rs-forest-500/20 px-4 text-xs font-bold uppercase tracking-[0.1em] text-rs-forest-700 transition hover:border-rs-terracotta hover:text-rs-terracotta-600"
                >
                  Area map
                </a>
              </li>
            ))}
            {model.unmappedCities.map(city => (
              <li
                key={city}
                className="flex items-center justify-between gap-3 rounded-rs-md bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-rs-ink">{city}</p>
                  <p className="mt-0.5 text-xs font-semibold text-rs-muted">Area shown via external map only</p>
                </div>
                <a
                  href={buildOpenStreetMapSearchHref(city)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${city} area map`}
                  className="inline-flex min-h-[44px] shrink-0 items-center rounded-rs-pill border border-rs-forest-500/20 px-4 text-xs font-bold uppercase tracking-[0.1em] text-rs-forest-700 transition hover:border-rs-terracotta hover:text-rs-terracotta-600"
                >
                  Area map
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mt-3 text-xs font-semibold leading-5 text-rs-muted">
        Schematic destination overview at city level. Exact meeting and pickup details remain on each product page.
      </figcaption>
    </figure>
  )
}

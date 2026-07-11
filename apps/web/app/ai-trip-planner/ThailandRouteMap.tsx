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

  if (model.stops.length === 0) return null

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
            fill="#eaf3f0"
          />
          <polygon
            points={outlinePoints}
            fill="#d9ebe4"
            stroke="#9dbfb2"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {model.segments.map(segment => (
            <line
              key={`${segment.from.city}-${segment.to.city}`}
              x1={segment.from.x}
              y1={segment.from.y}
              x2={segment.to.x}
              y2={segment.to.y}
              stroke="#0f766e"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          ))}
          {model.stops.map(stop => (
            <g key={stop.city}>
              <circle cx={stop.x} cy={stop.y} r="11" fill="#0f766e" opacity="0.16" />
              <circle cx={stop.x} cy={stop.y} r="6.5" fill="#0f766e" stroke="#ffffff" strokeWidth="2" />
              <text
                x={stop.x + 12}
                y={stop.y + 4}
                fontSize="13"
                fontWeight="700"
                fill="#1e2d59"
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
                className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#101820]">{stop.city}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#5a6670]">
                    Day {stop.dayNumbers.join(', ')}
                  </p>
                </div>
                <a
                  href={buildOpenStreetMapSearchHref(stop.city)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-[#1e2d59]/20 px-4 text-xs font-black uppercase tracking-[0.1em] text-[#1e2d59] transition hover:border-[#0f766e] hover:text-[#0f766e]"
                >
                  Area map
                </a>
              </li>
            ))}
            {model.unmappedCities.map(city => (
              <li
                key={city}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#101820]">{city}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#5a6670]">Area shown via external map only</p>
                </div>
                <a
                  href={buildOpenStreetMapSearchHref(city)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-[#1e2d59]/20 px-4 text-xs font-black uppercase tracking-[0.1em] text-[#1e2d59] transition hover:border-[#0f766e] hover:text-[#0f766e]"
                >
                  Area map
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mt-3 text-xs font-semibold leading-5 text-[#5a6670]">
        Schematic destination overview at city level. Exact meeting and pickup details remain on each product page.
      </figcaption>
    </figure>
  )
}

'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { Map as MapLibreMap } from 'maplibre-gl'
import type { ThailandItineraryStop } from '@/lib/itineraries/thailandTemplates'

type MapLibreDayMapProps = {
  cityName: string
  day: number
  stops: readonly ThailandItineraryStop[]
  publicToken: string | null
}

function CoordinateFallback({ stops }: { stops: readonly ThailandItineraryStop[] }) {
  const points = useMemo(() => {
    if (stops.length === 0) return []

    const lats = stops.map(stop => stop.lat)
    const lngs = stops.map(stop => stop.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const latRange = Math.max(maxLat - minLat, 0.01)
    const lngRange = Math.max(maxLng - minLng, 0.01)

    return stops.map((stop, index) => ({
      ...stop,
      index: index + 1,
      x: 10 + ((stop.lng - minLng) / lngRange) * 80,
      y: 90 - ((stop.lat - minLat) / latRange) * 80,
    }))
  }, [stops])

  return (
    <figure className="m-0" aria-label="Coordinate map preview">
      <div className="relative min-h-[340px] overflow-hidden rounded-rs-lg bg-[#e7f1ea]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_35%),linear-gradient(135deg,rgba(42,111,102,0.08),rgba(249,171,0,0.12))]" />
        <svg viewBox="0 0 100 100" role="img" aria-label={`Map preview with ${points.length} reviewed stop coordinates`} className="absolute inset-0 h-full w-full">
          {points.slice(0, -1).map((point, index) => {
            const next = points[index + 1]
            return (
              <line
                key={`${point.name}-${next.name}`}
                x1={point.x}
                y1={point.y}
                x2={next.x}
                y2={next.y}
                stroke="#2a6f66"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            )
          })}
          {points.map(point => (
            <g key={point.name}>
              <circle cx={point.x} cy={point.y} r="3.8" fill="#f9ab00" stroke="#ffffff" strokeWidth="1.2" />
              <text x={point.x} y={point.y + 1.2} textAnchor="middle" fontSize="3.4" fontWeight="800" fill="#2d3436">
                {point.index}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs font-semibold leading-5 text-rs-muted">
        Reviewed coordinates are ready. The street map appears when the approved public map token is configured.
      </figcaption>
    </figure>
  )
}

export function MapLibreDayMap({ cityName, day, stops, publicToken }: MapLibreDayMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!publicToken || !containerRef.current || stops.length === 0) return

    let cancelled = false
    let map: MapLibreMap | null = null

    void import('maplibre-gl').then(({ default: maplibre }) => {
      if (cancelled || !containerRef.current) return

      map = new maplibre.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(publicToken)}`,
        center: [stops[0].lng, stops[0].lat],
        zoom: 12,
        attributionControl: { compact: true },
      })

      const bounds = new maplibre.LngLatBounds()
      stops.forEach((stop, index) => {
        bounds.extend([stop.lng, stop.lat])
        new maplibre.Marker({ color: '#f9ab00' })
          .setLngLat([stop.lng, stop.lat])
          .setPopup(new maplibre.Popup({ offset: 18 }).setText(`${index + 1}. ${stop.name}`))
          .addTo(map!)
      })

      if (stops.length === 1) {
        map.setCenter([stops[0].lng, stops[0].lat])
        map.setZoom(13)
      } else {
        map.fitBounds(bounds, { padding: 64, maxZoom: 14, duration: 0 })
      }
    })

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [publicToken, stops])

  if (!publicToken) return <CoordinateFallback stops={stops} />

  return (
    <figure className="m-0">
      <div
        ref={containerRef}
        aria-label={`${cityName} day ${day} street map`}
        className="min-h-[340px] overflow-hidden rounded-rs-lg bg-rs-sage-200"
      />
      <figcaption className="mt-2 text-xs font-semibold leading-5 text-rs-muted">
        Map data © OpenStreetMap contributors · map tiles © MapTiler. Pins use reviewed template coordinates; this is not live navigation.
      </figcaption>
    </figure>
  )
}

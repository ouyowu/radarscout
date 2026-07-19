'use client'

import { useEffect, useRef } from 'react'
import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'
import type { ThailandItineraryStop } from '@/lib/itineraries/thailandTemplates'

type MapLibreDayMapProps = {
  cityName: string
  day: number
  stops: readonly ThailandItineraryStop[]
  publicToken: string | null
}

const OPENSTREETMAP_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'osm-raster': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-raster',
      type: 'raster',
      source: 'osm-raster',
    },
  ],
}

export function MapLibreDayMap({ cityName, day, stops, publicToken }: MapLibreDayMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapStyle = publicToken
    ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(publicToken)}`
    : OPENSTREETMAP_RASTER_STYLE

  useEffect(() => {
    if (!containerRef.current || stops.length === 0) return

    let cancelled = false
    let map: MapLibreMap | null = null

    void import('maplibre-gl').then(({ default: maplibre }) => {
      if (cancelled || !containerRef.current) return

      map = new maplibre.Map({
        container: containerRef.current,
        style: mapStyle,
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
  }, [mapStyle, stops])

  return (
    <figure className="m-0">
      <div
        ref={containerRef}
        aria-label={`${cityName} day ${day} street map`}
        className="min-h-[340px] overflow-hidden rounded-rs-lg bg-rs-sage-200"
      />
      <figcaption className="mt-2 text-xs font-semibold leading-5 text-rs-muted">
        Map data © OpenStreetMap contributors · map tiles © {publicToken ? 'MapTiler' : 'OpenStreetMap'}. Pins use reviewed template coordinates; this is not live navigation.
      </figcaption>
    </figure>
  )
}

import React from 'react'
import { cn } from './utils'

type TornEdgeProps = {
  /** Colour of the paper being torn — the surface the edge belongs to. */
  tone?: 'sand' | 'cloud'
  /** Point the tear the other way, for a section ending rather than starting. */
  flip?: boolean
  className?: string
}

// Hand-torn paper reads as short irregular steps, not a smooth wave, so these
// are straight segments at jittered heights. The fiber path sits a few pixels
// proud of the edge path to suggest the thickness of the stock.
const EDGE =
  'M0,40 L0,24 L22,16 L41,22 L63,12 L84,20 L108,11 L129,19 L154,10 L176,18 L201,9 L224,17 L248,10 L272,19 L297,12 L321,21 L347,13 L370,22 L396,14 L420,23 L447,15 L470,24 L497,16 L520,25 L546,17 L570,26 L597,18 L620,27 L648,19 L672,28 L698,20 L722,29 L750,21 L774,30 L800,22 L824,31 L852,23 L876,32 L902,24 L926,32 L954,25 L978,33 L1004,26 L1028,34 L1056,27 L1080,35 L1106,28 L1130,36 L1158,29 L1182,37 L1208,30 L1232,38 L1260,31 L1284,39 L1310,32 L1334,39 L1362,33 L1386,40 L1412,34 L1440,40 Z'

const FIBER =
  'M0,40 L0,21 L22,13 L41,19 L63,9 L84,17 L108,8 L129,16 L154,7 L176,15 L201,6 L224,14 L248,7 L272,16 L297,9 L321,18 L347,10 L370,19 L396,11 L420,20 L447,12 L470,21 L497,13 L520,22 L546,14 L570,23 L597,15 L620,24 L648,16 L672,25 L698,17 L722,26 L750,18 L774,27 L800,19 L824,28 L852,20 L876,29 L902,21 L926,29 L954,22 L978,30 L1004,23 L1028,31 L1056,24 L1080,32 L1106,25 L1130,33 L1158,26 L1182,34 L1208,27 L1232,35 L1260,28 L1284,36 L1310,29 L1334,36 L1362,30 L1386,37 L1412,31 L1440,38 L1440,40 Z'

export function TornEdge({ tone = 'sand', flip = false, className }: TornEdgeProps) {
  return (
    <svg
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn(
        'block w-full',
        'h-[clamp(20px,2.6vw,38px)]',
        flip ? '-scale-y-100' : '',
        className,
      )}
    >
      <path
        d={FIBER}
        fill={tone === 'sand' ? 'var(--rs-sand-100)' : 'var(--rs-sand-50)'}
      />
      <path
        d={EDGE}
        fill={tone === 'sand' ? 'var(--rs-sand-50)' : 'var(--rs-cloud)'}
      />
    </svg>
  )
}

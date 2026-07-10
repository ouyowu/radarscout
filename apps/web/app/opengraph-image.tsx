import { ImageResponse } from 'next/og'

export const alt = 'RadarScout Thailand Experience Planner'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #102c23 0%, #1f5b46 58%, #d57c48 100%)',
          color: '#ffffff',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: '72px',
          width: '100%',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: '42px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            padding: '58px 64px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: '0.12em' }}>
            RADARSCOUT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
              Thailand Experience Planner
            </div>
            <div style={{ color: '#e8f2ed', display: 'flex', fontSize: 30, lineHeight: 1.35 }}>
              Compare real experiences and continue with a trusted booking partner.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}

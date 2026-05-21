import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RadarScout – Smart Home, Wearables & Health Tech';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #020617 60%, #0f172a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid background dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(6,182,212,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            ◎
          </div>
          <span style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff' }}>
            Radar<span style={{ color: '#22d3ee' }}>Scout</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
            marginBottom: '20px',
          }}
        >
          Smart Home, Wearables &amp; Health Tech
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          Expert buying guides, in-depth reviews &amp; product comparisons
        </div>

        {/* Pill tags */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['Smart Rings', 'Sleep Trackers', 'Smart Locks', 'Wearables'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '8px 20px',
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                borderRadius: '999px',
                color: '#22d3ee',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            color: '#475569',
            fontSize: '18px',
          }}
        >
          radarscout.io
        </div>
      </div>
    ),
    { ...size },
  );
}

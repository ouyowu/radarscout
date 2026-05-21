import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RadarScout - Smart home, wearables, and health tech guides';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)',
          color: 'white',
          padding: '64px',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 60%, #9333ea 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            R
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 42, fontWeight: 800 }}>RadarScout</div>
            <div style={{ fontSize: 22, color: '#94a3b8' }}>
              Smart home • wearables • health tech
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 980 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(34, 211, 238, 0.12)',
              border: '1px solid rgba(34, 211, 238, 0.28)',
              color: '#67e8f9',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Buying guides • reviews • comparisons
          </div>
          <div style={{ fontSize: 66, lineHeight: 1.05, fontWeight: 900 }}>
            Find the right smart tech before you buy.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#cbd5e1' }}>
            Expert product research, hands-on comparisons, and practical advice for your
            home and health setup.
          </div>
        </div>
      </div>
    ),
    size
  );
}

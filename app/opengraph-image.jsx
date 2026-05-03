import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'IdeaHunt — Startup & product ideas from the internet'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0d0d0d',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial Black, Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* Border frame */}
        <div style={{
          position: 'absolute',
          inset: '24px',
          border: '2px solid white',
          display: 'flex',
        }} />

        {/* Logo mark */}
        <div style={{
          width: '72px',
          height: '72px',
          background: '#0d0d0d',
          border: '2px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <span style={{ color: 'white', fontSize: '28px', fontWeight: '900', letterSpacing: '2px' }}>IH</span>
        </div>

        {/* Title */}
        <div style={{
          color: 'white',
          fontSize: '80px',
          fontWeight: '900',
          letterSpacing: '12px',
          textTransform: 'uppercase',
          marginBottom: '16px',
          textShadow: '4px 4px 0px #ff6b35',
        }}>
          IDEAHUNT
        </div>

        {/* Tagline */}
        <div style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '24px',
          fontWeight: '400',
          letterSpacing: '2px',
          textAlign: 'center',
          maxWidth: '700px',
        }}>
          Startup &amp; product ideas from Reddit, HN, Dev.to &amp; more
        </div>

        {/* Source pills */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '40px',
        }}>
          {[
            { name: 'REDDIT', color: '#FF4500' },
            { name: 'HACKER NEWS', color: '#FF6600' },
            { name: 'DEV.TO', color: '#A855F7' },
          ].map(s => (
            <div key={s.name} style={{
              border: `1px solid ${s.color}`,
              color: s.color,
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '2px',
            }}>
              {s.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}

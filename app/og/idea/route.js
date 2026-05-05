import { ImageResponse } from 'next/og'
import { SOURCE_MAP } from '@/lib/sources'

export const runtime = 'edge'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Untitled Idea'
  const sourceId = searchParams.get('source') || ''
  const category = searchParams.get('category') || 'General'
  const score = parseInt(searchParams.get('score') || '0', 10)
  const author = searchParams.get('author') || ''

  const source = SOURCE_MAP[sourceId]
  const sourceColor = source?.color || '#ffffff'
  const sourceName = source?.shortName || sourceId

  // Truncate title for display
  const displayTitle = title.length > 120 ? title.slice(0, 117) + '…' : title

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0d0d0d',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Arial Black, Arial, sans-serif',
          position: 'relative',
          padding: '48px',
        }}
      >
        {/* Border frame */}
        <div style={{
          position: 'absolute',
          inset: '24px',
          border: '2px solid rgba(255,255,255,0.15)',
          display: 'flex',
        }} />

        {/* Top row — logo + source */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px',
          zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: '#0d0d0d',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: '16px', fontWeight: '900', letterSpacing: '1px' }}>IH</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: '700', letterSpacing: '4px' }}>
              IDEAHUNT
            </span>
          </div>

          {/* Source badge */}
          {sourceName && (
            <div style={{
              border: `1.5px solid ${sourceColor}`,
              color: sourceColor,
              padding: '6px 18px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              {sourceName}
            </div>
          )}
        </div>

        {/* Title */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <div style={{
            color: 'white',
            fontSize: displayTitle.length > 80 ? '36px' : '48px',
            fontWeight: '900',
            lineHeight: 1.2,
            letterSpacing: '0.5px',
            marginBottom: '24px',
          }}>
            {displayTitle}
          </div>

          {/* Category + meta row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              {category}
            </div>
            {score > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                <span>↑</span>
                <span>{score.toLocaleString()} upvotes</span>
              </div>
            )}
            {author && (
              <div style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '14px',
                fontWeight: '400',
              }}>
                by {author}
              </div>
            )}
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: '13px',
          letterSpacing: '1.5px',
          zIndex: 1,
          marginTop: '24px',
        }}>
          idea-hunt.rohangore.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

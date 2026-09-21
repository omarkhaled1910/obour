import { ImageResponse } from 'next/og'

export const alt = 'New Obour City Owners Platform'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #022c22 0%, #065f46 65%, #7c2d3a 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          padding: '72px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            border: '2px solid rgba(255,255,255,.35)',
            borderRadius: 999,
            display: 'flex',
            fontSize: 26,
            marginBottom: 36,
            padding: '12px 28px',
          }}
        >
          OWNERS SERVICES
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          NEW OBOUR CITY
        </div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 600, marginTop: 12 }}>
          OWNERS PLATFORM
        </div>
        <div
          style={{
            color: '#d1fae5',
            display: 'flex',
            fontSize: 27,
            marginTop: 30,
          }}
        >
          LEGALIZATION · LICENSING · CONSTRUCTION · FUNDING
        </div>
      </div>
    ),
    size,
  )
}

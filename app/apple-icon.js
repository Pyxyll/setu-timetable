import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'nodejs'
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          borderRadius: '20%',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 40 40">
          <rect x="4" y="4" width="32" height="32" rx="2" fill="none" stroke="black" strokeWidth="2"/>
          <line x1="4" y1="12" x2="36" y2="12" stroke="black" strokeWidth="2"/>
          <line x1="12" y1="4" x2="12" y2="36" stroke="black" strokeWidth="2"/>
          <rect x="14" y="14" width="8" height="8" fill="black" opacity="0.2"/>
          <rect x="24" y="24" width="8" height="8" fill="black" opacity="0.2"/>
        </svg>
      </div>
    ),
    { ...size }
  )
}
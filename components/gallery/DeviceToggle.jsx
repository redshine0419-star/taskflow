'use client'
import { useEffect, useState } from 'react'

export default function DeviceToggle() {
  const [mobile, setMobile] = useState(false)
  const [path, setPath] = useState('')
  const [isFramed, setIsFramed] = useState(false)

  useEffect(() => {
    setPath(window.location.pathname)
    try {
      setIsFramed(window.self !== window.top)
    } catch {
      setIsFramed(true)
    }
  }, [])

  if (isFramed) return null

  return (
    <>
      <div style={{
        position: 'fixed', top: 14, right: 14, zIndex: 10000,
        display: 'flex', gap: 2, background: 'rgba(0,0,0,0.65)', borderRadius: 999,
        padding: 3, backdropFilter: 'blur(6px)',
      }}>
        <button
          type="button"
          onClick={() => setMobile(false)}
          style={{
            fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
            borderRadius: 999, padding: '7px 14px',
            background: mobile ? 'transparent' : '#fff',
            color: mobile ? '#fff' : '#111',
          }}
        >
          🖥️ PC
        </button>
        <button
          type="button"
          onClick={() => setMobile(true)}
          style={{
            fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
            borderRadius: 999, padding: '7px 14px',
            background: mobile ? '#fff' : 'transparent',
            color: mobile ? '#111' : '#fff',
          }}
        >
          📱 모바일
        </button>
      </div>

      {mobile && path && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: '#2B2B2B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 16px', overflow: 'auto',
        }}>
          <div style={{
            width: 390, height: 844, maxHeight: '90vh', flexShrink: 0,
            border: '10px solid #111', borderRadius: 44, overflow: 'hidden',
            boxShadow: '0 30px 70px rgba(0,0,0,0.55)', background: '#fff', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 120, height: 22, background: '#111', borderRadius: '0 0 14px 14px', zIndex: 1,
            }} />
            <iframe
              src={path}
              title="모바일 미리보기"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )}
    </>
  )
}

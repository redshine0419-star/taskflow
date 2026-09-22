'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#FFF7F5', surface: '#FFFFFF', text: '#3A2A2C', muted: '#8C7477',
  rose: '#B76E79', border: '#F0DEDC',
}

const PACKAGES = [
  { name: '베이직', price: '350만원', items: ['스튜디오 촬영', '식장 스냅', '앨범 1권'] },
  { name: '프리미엄', price: '650만원', items: ['본식 영상', '스튜디오+야외 촬영', '앨범 2권', '메이크업 리허설'], highlighted: true },
  { name: '올인원', price: '980만원', items: ['본식 영상+스냅', '해외 프리웨딩', '앨범 3권', '전담 플래너 배정'] },
]

function BookingForm() {
  const [form, setForm] = useState({ name: '', phone: '', date: '' })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.rose, fontWeight: 700 }}>
        상담 예약이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="신랑·신부 성함" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.rose, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        상담 예약하기
      </button>
    </form>
  )
}

export default function WeddingLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,247,245,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.rose, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Eden Wedding</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#gallery" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>갤러리</a>
            <a href="#packages" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>패키지</a>
            <a href="#booking" style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.rose, padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}>상담 예약</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '90px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>💍</div>
        <h1 style={{
          margin: 0, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.4,
          fontFamily: 'Georgia, serif', fontStyle: 'italic', color: T.rose,
        }}>
          두 사람의 하루를,<br />가장 아름다운 순간으로
        </h1>
        <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
          이든 웨딩은 스튜디오·드레스·메이크업부터 본식 촬영까지, 하나의 팀이 처음부터 끝까지 함께해요.
        </p>
        <a href="#packages" style={{
          display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          color: '#fff', background: T.rose, padding: '13px 28px', borderRadius: 999,
        }}>
          패키지 둘러보기
        </a>
      </section>

      {/* Gallery */}
      <section id="gallery" style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>웨딩 갤러리</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {['🌸', '💐', '🕊️', '✨', '👰', '🤵'].map((e, i) => (
            <div key={i} style={{
              aspectRatio: '1', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
            }}>
              {e}
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>웨딩 패키지</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {PACKAGES.map((p) => (
              <div key={p.name} style={{
                border: p.highlighted ? `2px solid ${T.rose}` : `1px solid ${T.border}`,
                borderRadius: 16, padding: 24, background: T.bg, position: 'relative',
              }}>
                {p.highlighted && (
                  <span style={{ position: 'absolute', top: -12, left: 24, fontSize: 11, fontWeight: 700, color: '#fff', background: T.rose, borderRadius: 999, padding: '3px 10px' }}>
                    인기
                  </span>
                )}
                <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, color: T.rose }}>{p.price}</div>
                <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {p.items.map((it) => (
                    <li key={it} style={{ fontSize: 13, color: T.muted, display: 'flex', gap: 6 }}>
                      <span style={{ color: T.rose }}>✓</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>상담 예약</h2>
        <BookingForm />
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        Eden Wedding · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}

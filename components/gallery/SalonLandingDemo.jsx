'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#FFF9FB', surface: '#FFFFFF', text: '#3A2E33', muted: '#8C7A84',
  accent: '#C77DA6', accentLight: '#FBEAF2', border: '#F3DCE8',
}

const SERVICES = [
  { name: '커트', price: '35,000원~' },
  { name: '펌', price: '90,000원~' },
  { name: '염색', price: '80,000원~' },
  { name: '두피 클리닉', price: '60,000원~' },
]

const DESIGNERS = [
  { name: '이하은 디자이너', role: '원장 · 컬러 전문' },
  { name: '김소율 디자이너', role: '펌 · 클리닉 전문' },
]

function ReserveForm() {
  const [form, setForm] = useState({ name: '', phone: '', service: SERVICES[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.accent, fontWeight: 700 }}>
        예약이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 10, border: 'none', background: T.accent, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        예약하기
      </button>
    </form>
  )
}

export default function SalonLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,249,251,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: T.accent }}>글로우헤어</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#services" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>시술 메뉴</a>
            <a href="#designers" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>디자이너</a>
            <a href="#reserve" style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.accent, padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}>예약하기</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 70px', textAlign: 'center',
        background: `linear-gradient(rgba(255,249,251,0.88), rgba(255,249,251,0.94)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.accent, background: T.accentLight, padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            예약제로 여유롭게 운영해요
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
            내 머릿결에 맞는 스타일,<br />글로우헤어
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
            커트부터 두피 클리닉까지, 디자이너 1:1 예약제로 편안하게 관리받으세요.
          </p>
          <a href="#reserve" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.accent, padding: '13px 28px', borderRadius: 999,
          }}>
            지금 예약하기
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>시술 메뉴</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {SERVICES.map((s) => (
            <div key={s.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
              <div style={{ marginTop: 8, fontSize: 15, color: T.accent, fontWeight: 700 }}>{s.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Designers */}
      <section id="designers" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>디자이너 소개</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {DESIGNERS.map((d) => (
              <div key={d.name} style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentLight, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💇</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: T.accent, fontWeight: 600 }}>{d.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>예약하기</h2>
        <ReserveForm />
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        글로우헤어 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}

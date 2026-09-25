'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#FFFBF2', surface: '#FFFFFF', text: '#3A3226', muted: '#8A7F68',
  accent: '#F2A93B', mint: '#5FBFA6', border: '#F0E4C8',
}

const SERVICES = [
  { icon: '✂️', name: '미용', desc: '견종별 맞춤 스타일링' },
  { icon: '🏠', name: '호텔', desc: '24시간 CCTV로 안심 케어' },
  { icon: '🎓', name: '유치원', desc: '사회화 훈련 · 놀이 프로그램' },
  { icon: '🛁', name: '스파', desc: '피부 진정 스파 케어' },
]

const REVIEWS = [
  { name: '초코 보호자', text: '분리불안 있는 아이인데 선생님들이 세심하게 봐주셔서 안심했어요.' },
  { name: '몽이 보호자', text: '미용 스타일이 마음에 쏙 들었어요. 다음에도 꼭 맡길게요.' },
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
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.mint, fontWeight: 700 }}>
        예약 문의가 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="보호자 성함" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 10, border: 'none', background: T.mint, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        예약 문의하기
      </button>
    </form>
  )
}

export default function PetLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,251,242,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: T.accent }}>포포하우스</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#services" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>서비스</a>
            <a href="#reviews" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>이용 후기</a>
            <a href="#reserve" style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.mint, padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}>예약 문의</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 70px', textAlign: 'center',
        background: `linear-gradient(rgba(255,251,242,0.88), rgba(255,251,242,0.94)), url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.mint, background: '#EAF7F3', padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            우리 아이 첫 호텔, 안심하고 맡기세요
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
            반려동물 미용 · 호텔<br />포포하우스
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
            미용부터 호텔링, 유치원까지 — 우리 아이 하루를 세심하게 책임져요.
          </p>
          <a href="#reserve" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.accent, padding: '13px 28px', borderRadius: 999,
          }}>
            예약 문의하기
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>서비스 안내</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {SERVICES.map((s) => (
            <div key={s.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>이용 후기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ marginTop: 12, fontSize: 12, color: T.muted, fontWeight: 600 }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>예약 문의</h2>
        <ReserveForm />
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        포포하우스 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}

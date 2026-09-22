'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#FBF6EF', surface: '#FFFFFF', text: '#3B2A1E', muted: '#8A7263',
  accent: '#8C5A3C', gold: '#C9A66B', border: '#E7DCC9',
}

const MENU = [
  { emoji: '☕', name: '핸드드립 오늘의 커피', price: '6,500원' },
  { emoji: '🥐', name: '버터 크루아상', price: '4,800원' },
  { emoji: '🍰', name: '바스크 치즈케이크', price: '7,000원' },
  { emoji: '🍵', name: '얼그레이 라떼', price: '6,000원' },
]

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.accent, fontWeight: 700 }}>
        문의해주셔서 감사합니다! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <textarea placeholder="예약/문의 내용" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        문의 보내기
      </button>
    </form>
  )
}

export default function CafeLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(251,246,239,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>카페 소슬</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#menu" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>메뉴</a>
            <a href="#about" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>소개</a>
            <a href="#visit" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>오시는 길</a>
            <a href="#contact" style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.accent, padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}>예약 문의</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '90px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>☕</div>
        <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35 }}>
          하루의 쉼표,<br />카페 소슬입니다
        </h1>
        <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
          직접 로스팅한 원두와 매일 아침 굽는 페이스트리로 조용한 오후를 채워드려요.
        </p>
        <a href="#visit" style={{
          display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          color: '#fff', background: T.accent, padding: '13px 28px', borderRadius: 999,
        }}>
          오시는 길 보기
        </a>
      </section>

      {/* Menu */}
      <section id="menu" style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>오늘의 메뉴</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {MENU.map((m) => (
            <div key={m.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{m.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{m.name}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: T.gold, fontWeight: 700 }}>{m.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>소슬 이야기</h2>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8 }}>
            2019년, 작은 골목 안에서 시작한 카페 소슬은 &ldquo;천천히 마시는 커피 한 잔&rdquo;을 지향해요.
            원두는 2주에 한 번 직접 로스팅하고, 디저트는 매일 새벽 직접 구워요.
            창가 자리에 앉아 책 한 권과 함께 조용한 시간을 보내보세요.
          </p>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>오시는 길</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: T.gold, fontWeight: 700, marginBottom: 6 }}>주소</div>
            <div style={{ fontSize: 14 }}>서울 마포구 어울림길 12 (예시 주소)</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: T.gold, fontWeight: 700, marginBottom: 6 }}>영업시간</div>
            <div style={{ fontSize: 14 }}>매일 10:00 – 21:00 (라스트오더 20:30)</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: T.gold, fontWeight: 700, marginBottom: 6 }}>휴무</div>
            <div style={{ fontSize: 14 }}>매주 월요일</div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>단체석 · 대관 문의</h2>
          <ContactForm />
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        카페 소슬 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}

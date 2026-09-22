'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#0B0D17', surface: '#151827', text: '#F1F3FA', muted: '#9096B0',
  purple: '#7C3AED', blue: '#2563EB', border: '#262A3D',
}

const FEATURES = [
  { icon: '⚡', title: '실시간 동기화', desc: '팀원 전체가 같은 데이터를 실시간으로 공유해요.' },
  { icon: '🔗', title: '연동 100+', desc: '슬랙, 노션, 깃허브 등 이미 쓰는 툴과 바로 연결돼요.' },
  { icon: '🤖', title: 'AI 자동화', desc: '반복 업무를 AI가 자동으로 처리해줘요.' },
]

const LOGOS = ['ACME', 'NORTHSTAR', 'ORBIT', 'PRISM', 'VELOCITY']

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0', color: T.purple, fontWeight: 700 }}>
        신청 완료! 출시되면 가장 먼저 알려드릴게요. (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
      <input required type="email" placeholder="업무용 이메일" value={email} onChange={(e) => setEmail(e.target.value)}
        style={{ flex: 1, minWidth: 200, padding: '13px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 14 }} />
      <button type="submit" style={{
        padding: '13px 24px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', color: '#fff',
        background: `linear-gradient(90deg, ${T.purple}, ${T.blue})`,
      }}>
        얼리 액세스 신청
      </button>
    </form>
  )
}

export default function StartupLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(11,13,23,0.9)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>런치패드</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>기능</a>
            <a href="#trust" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>도입 사례</a>
            <a href="#waitlist" style={{
              fontSize: 13, fontWeight: 700, color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
              background: `linear-gradient(90deg, ${T.purple}, ${T.blue})`,
            }}>
              얼리 액세스
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '96px 24px 64px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#C4B5FD',
          background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)',
          padding: '6px 14px', borderRadius: 999, marginBottom: 20,
        }}>
          🚀 프라이빗 베타 오픈
        </span>
        <h1 style={{
          margin: 0, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.3,
          background: `linear-gradient(90deg, #fff, #C4B5FD)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          팀의 속도를 바꾸는<br />업무 자동화 플랫폼
        </h1>
        <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
          반복되는 운영 업무를 런치패드가 대신 처리하고, 팀은 진짜 중요한 일에 집중하게 해드려요.
        </p>
        <div style={{ marginTop: 32 }}>
          <WaitlistForm />
        </div>
      </section>

      {/* Trust logos */}
      <section id="trust" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 24px', display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {LOGOS.map((l) => (
            <span key={l} style={{ fontSize: 14, fontWeight: 700, color: T.muted, letterSpacing: '0.05em' }}>{l}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 700, marginBottom: 36 }}>핵심 기능</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" style={{ borderTop: `1px solid ${T.border}`, padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>지금 얼리 액세스에 참여하세요</h2>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>베타 참여자에게는 출시 후 3개월 무료 이용권을 드려요.</p>
        <WaitlistForm />
      </section>

      <footer style={{ borderTop: `1px solid ${T.border}`, textAlign: 'center', padding: '28px 24px', fontSize: 12, color: T.muted }}>
        런치패드 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}

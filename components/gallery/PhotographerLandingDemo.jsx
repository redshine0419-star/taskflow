'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#0A0A0A', surface: '#141414', text: '#F2F2F2', muted: '#8A8A8A', border: '#262626',
}

const WORKS = [
  { title: '결혼식 스냅', emoji: '🕊️' },
  { title: '가족사진', emoji: '👨‍👩‍👧' },
  { title: '프로필 촬영', emoji: '🖤' },
  { title: '브랜드 화보', emoji: '📸' },
  { title: '웨딩 본식', emoji: '💍' },
  { title: '베이비 촬영', emoji: '👶' },
]

function InquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', type: WORKS[0].title })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#fff', fontWeight: 700 }}>
        촬영 문의가 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 4, border: `1px solid ${T.border}`, fontSize: 14, background: T.surface, color: T.text }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 4, border: `1px solid ${T.border}`, fontSize: 14, background: T.surface, color: T.text }} />
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 4, border: `1px solid ${T.border}`, fontSize: 14, background: T.surface, color: T.text }}>
        {WORKS.map((w) => <option key={w.title} value={w.title}>{w.title}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 4, border: 'none', background: '#fff', color: '#0A0A0A', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        촬영 문의하기
      </button>
    </form>
  )
}

export default function PhotographerLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.15em' }}>STUDIO ILLUM</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#works" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>WORKS</a>
            <a href="#inquiry" style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', background: '#fff', padding: '8px 16px', textDecoration: 'none' }}>문의하기</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px',
        background: `linear-gradient(rgba(10,10,10,0.55), rgba(10,10,10,0.75)), url('https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.3em', color: '#B8B8B8', marginBottom: 20 }}>PHOTOGRAPHY STUDIO</div>
          <h1 style={{ margin: 0, fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            빛으로 남기는<br />당신의 순간
          </h1>
          <p style={{ marginTop: 22, fontSize: 15, color: '#C9C9C9', lineHeight: 1.7 }}>
            웨딩, 가족, 프로필까지 — 자연광을 살린 사진으로 기록해요.
          </p>
          <a href="#inquiry" style={{
            display: 'inline-block', marginTop: 30, fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textDecoration: 'none',
            color: '#0A0A0A', background: '#fff', padding: '14px 32px',
          }}>
            촬영 문의하기
          </a>
        </div>
      </section>

      {/* Works */}
      <section id="works" style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', color: T.muted, textAlign: 'center', marginBottom: 8 }}>PORTFOLIO</div>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 700, marginBottom: 36 }}>작업물</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 4 }}>
          {WORKS.map((w) => (
            <div key={w.title} style={{
              aspectRatio: '1', background: T.surface, border: `1px solid ${T.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 32 }}>{w.emoji}</span>
              <span style={{ fontSize: 13, color: T.muted }}>{w.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquiry" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>촬영 문의</h2>
          <InquiryForm />
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        STUDIO ILLUM · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}

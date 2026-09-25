'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

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

const STATS = [
  { value: '9년', label: '촬영 경력' },
  { value: '1,100+', label: '누적 촬영 건수' },
  { value: '4.9★', label: '고객 평점' },
]

const REVIEWS = [
  { name: '신부 한O빈', text: '자연광을 정말 잘 살려주셔서 사진이 다 화보 같았어요.' },
  { name: '고객 유O진', text: '프로필 촬영인데도 편하게 리드해주셔서 표정이 자연스럽게 나왔어요.' },
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .ph-nav-links { display: flex; gap: 24px; align-items: center; }
        .ph-nav-toggle { display: none; }
        .ph-work-item { transition: transform .25s ease; }
        .ph-work-item:hover { transform: scale(1.05); }
        .ph-review { transition: transform .18s ease; }
        .ph-review:hover { transform: translateY(-4px); }
        @media (max-width: 680px) {
          .ph-nav-links { display: none; }
          .ph-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: ${T.bg}; padding: 20px 24px; border-bottom: 1px solid ${T.border}; }
          .ph-nav-toggle { display: block; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.15em' }}>STUDIO ILLUM</span>
          </div>
          <div className={`ph-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#works" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>WORKS</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>REVIEWS</a>
            <a href="#inquiry" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', background: '#fff', padding: '8px 16px', textDecoration: 'none' }}>문의하기</a>
          </div>
          <button className="ph-nav-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#fff' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
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

      {/* Stats */}
      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Works */}
      <section id="works" style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', color: T.muted, textAlign: 'center', marginBottom: 8 }}>PORTFOLIO</div>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 700, marginBottom: 36 }}>작업물</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 4 }}>
          {WORKS.map((w) => (
            <div key={w.title} className="ph-work-item" style={{
              aspectRatio: '1', background: T.surface, border: `1px solid ${T.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 32 }}>{w.emoji}</span>
              <span style={{ fontSize: 13, color: T.muted }}>{w.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>고객 후기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} className="ph-review" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, padding: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ marginTop: 12, fontSize: 12, color: T.muted, fontWeight: 600 }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquiry" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>촬영 문의</h2>
        <InquiryForm />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', marginBottom: 8 }}>STUDIO ILLUM</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              사업자등록번호 890-12-34567 (예시)<br />
              서울 성수동 스튜디오길 5<br />
              010-1234-5678
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>촬영 시간</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              매일 09:00 – 20:00 (사전 예약제)
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>SNS</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 20 }}>
              <span>📷</span><span>🎞️</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1040, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.muted, textAlign: 'center' }}>
          STUDIO ILLUM · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
        </div>
      </footer>
    </div>
  )
}

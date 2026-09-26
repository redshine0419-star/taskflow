'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#111111', surface: '#1B1B1B', text: '#F5F5F5', muted: '#9A9A9A',
  red: '#E63946', border: '#2B2B2B',
}

const PROGRAMS = [
  { name: '1:1 PT', desc: '개인별 목표에 맞춘 맞춤 트레이닝', price: '회당 80,000원' },
  { name: '그룹 PT', desc: '3~4인 소그룹, 합리적인 가격', price: '회당 35,000원' },
  { name: '바디프로필 반', desc: '12주 완성 단기 집중 프로그램', price: '패키지 900,000원' },
]

const STATS = [
  { value: '2,200+', label: '누적 회원 수' },
  { value: '87%', label: '재등록률' },
  { value: '8년', label: '트레이너 평균 경력' },
]

const REVIEWS = [
  { name: '회원 정O호', text: '12주 만에 체지방률이 눈에 띄게 줄었어요. 식단 관리도 꼼꼼히 봐주세요.' },
  { name: '회원 윤O아', text: '바디프로필 목표로 시작했는데 자세 교정까지 신경 써주셔서 좋았어요.' },
]

function ConsultForm() {
  const [form, setForm] = useState({ name: '', phone: '', goal: PROGRAMS[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.red, fontWeight: 700 }}>
        상담 신청이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, background: T.surface, color: T.text }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, background: T.surface, color: T.text }} />
      <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, background: T.surface, color: T.text }}>
        {PROGRAMS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.red, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        무료 상담 신청
      </button>
    </form>
  )
}

export default function GymLandingDemo() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .gym-nav-links { display: flex; gap: 24px; align-items: center; }
        .gym-nav-toggle { display: none; }
        .gym-card { transition: transform .18s ease, box-shadow .18s ease; }
        .gym-card:hover { transform: translateY(-4px); box-shadow: 0 14px 26px rgba(230,57,70,0.18); }
        @media (max-width: 680px) {
          .gym-nav-links { display: none; }
          .gym-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: ${T.bg}; padding: 20px 24px; border-bottom: 1px solid ${T.border}; }
          .gym-nav-toggle { display: block; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(17,17,17,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>CORE<span style={{ color: T.red }}>GYM</span></span>
          </div>
          <div className={`gym-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#programs" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>프로그램</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>회원 후기</a>
            <a href="#consult" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.red, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>상담 신청</a>
          </div>
          <button className="gym-nav-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#fff' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 70px', textAlign: 'center',
        background: `linear-gradient(rgba(17,17,17,0.75), rgba(17,17,17,0.85)), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.red, border: `1px solid ${T.red}`, padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            체지방 감량 · 바디프로필 전문
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            변화는 핑계 없이,<br />코어짐에서 시작해요
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
            국가공인 트레이너의 1:1 맞춤 코칭으로 가장 빠르고 안전하게 목표에 도달해요.
          </p>
          <a href="#consult" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.red, padding: '13px 28px', borderRadius: 8,
          }}>
            무료 체험 신청
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.red }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section id="programs" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>프로그램</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {PROGRAMS.map((p) => (
            <div key={p.name} className="gym-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
              <div style={{ marginTop: 8, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{p.desc}</div>
              <div style={{ marginTop: 14, fontSize: 16, fontWeight: 800, color: T.red }}>{p.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>회원 후기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} className="gym-card" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ marginTop: 12, fontSize: 12, color: T.muted, fontWeight: 600 }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consult */}
      <section id="consult" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>무료 상담 신청</h2>
        <ConsultForm />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>CORE<span style={{ color: T.red }}>GYM</span></div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              사업자등록번호 901-23-45678 (예시)<br />
              서울 마포구 헬스로 77<br />
              02-7890-1234
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>운영시간</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              평일 06:00 – 23:00<br />
              주말·공휴일 09:00 – 18:00
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>SNS</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 20 }}>
              <span>📷</span><span>🎥</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1040, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.muted, textAlign: 'center' }}>
          CORE GYM · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
        </div>
      </footer>
    </div>
  )
}

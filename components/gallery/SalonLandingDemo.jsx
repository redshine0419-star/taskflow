'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#FFF9FB', surface: '#FFFFFF', text: '#3A2E33', muted: '#8C7A84',
  accent: '#C77DA6', accentLight: '#FBEAF2', border: '#F3DCE8',
}

const SERVICES = [
  { icon: '✂️', name: '커트', price: '35,000원~', desc: '얼굴형에 맞는 맞춤 커트' },
  { icon: '🌀', name: '펌', price: '90,000원~', desc: '디지털·매직·볼륨펌' },
  { icon: '🎨', name: '염색', price: '80,000원~', desc: '뿌리염색부터 컬러체인지까지' },
  { icon: '💧', name: '두피 클리닉', price: '60,000원~', desc: '탈모·비듬 케어 프로그램' },
]

const DESIGNERS = [
  { name: '이하은 디자이너', role: '원장 · 컬러 전문', rating: 4.9, reviews: 128 },
  { name: '김소율 디자이너', role: '펌 · 클리닉 전문', rating: 4.8, reviews: 94 },
]

const REVIEWS = [
  { name: '정O아', rating: 5, text: '펌 텐션이 딱 원하는 대로 나와서 만족스러웠어요.' },
  { name: '한O빈', rating: 5, text: '두피 클리닉 받고 나서 확실히 가벼워졌어요.' },
]

const GALLERY = ['💇‍♀️', '✨', '🎨', '💆‍♀️']

function Stars({ n }) {
  return <span style={{ color: T.accent, fontSize: 12, letterSpacing: 1 }}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))}</span>
}

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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .salon-nav-links { display: flex; gap: 24px; align-items: center; }
        .salon-nav-toggle { display: none; }
        .salon-card { transition: transform .18s ease, box-shadow .18s ease; }
        .salon-card:hover { transform: translateY(-4px); box-shadow: 0 14px 26px rgba(199,125,166,0.14); }
        @media (max-width: 680px) {
          .salon-nav-links { display: none; }
          .salon-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: ${T.bg}; padding: 20px 24px; border-bottom: 1px solid ${T.border}; }
          .salon-nav-toggle { display: block; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,249,251,0.95)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: T.accent }}>글로우헤어</span>
          </div>
          <div className={`salon-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#services" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>시술 메뉴</a>
            <a href="#designers" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>디자이너</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>스타일 갤러리</a>
            <a href="#reserve" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.accent, padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}>예약하기</a>
          </div>
          <button className="salon-nav-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: T.text }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 60px', textAlign: 'center',
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
            <div key={s.name} className="salon-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: T.muted }}>{s.desc}</div>
              <div style={{ marginTop: 10, fontSize: 15, color: T.accent, fontWeight: 700 }}>{s.price}</div>
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
              <div key={d.name} className="salon-card" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentLight, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💇</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: T.accent, fontWeight: 600 }}>{d.role}</div>
                <div style={{ marginTop: 8 }}>
                  <Stars n={d.rating} /> <span style={{ fontSize: 12, color: T.muted }}>({d.reviews})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style gallery */}
      <section id="gallery" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>스타일 갤러리</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {GALLERY.map((e, i) => (
            <div key={i} className="salon-card" style={{
              aspectRatio: '1', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
            }}>
              {e}
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>고객 후기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
                <Stars n={r.rating} />
                <p style={{ margin: '10px 0 0', fontSize: 13.5, color: T.muted, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600 }}>{r.name}</div>
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

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '40px 24px' }}>
        <div style={{
          maxWidth: 1040, margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: T.accent, marginBottom: 8 }}>글로우헤어</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              사업자등록번호 345-67-89012 (예시)<br />
              서울 강남구 헤어로 8<br />
              02-2345-6789
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>영업시간</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              화~일 10:00 – 20:00<br />
              매주 월요일 휴무 (예약제)
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>SNS</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 20 }}>
              <span>📷</span><span>📘</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1040, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.muted, textAlign: 'center' }}>
          글로우헤어 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
        </div>
      </footer>
    </div>
  )
}

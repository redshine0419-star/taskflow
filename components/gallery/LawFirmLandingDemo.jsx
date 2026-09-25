'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#FFFFFF', dark: '#0B1E3D', surface: '#F5F7FA', text: '#1A2333', muted: '#5B6478',
  gold: '#C9A54A', border: '#E3E7EE',
}

const PRACTICE = [
  { name: '기업 자문', desc: '계약·M&A·규제 대응 전반' },
  { name: '민사 소송', desc: '손해배상·채권채무 분쟁' },
  { name: '형사 변호', desc: '수사 단계부터 전 심급 대응' },
  { name: '부동산·건설', desc: '분양·재건축·시행 분쟁' },
]

const STEPS = [
  { step: '01', title: '상담 신청', desc: '온라인으로 사건 개요를 남겨주세요.' },
  { step: '02', title: '초기 상담', desc: '담당 변호사가 사건을 검토하고 방향을 안내해요.' },
  { step: '03', title: '수임 · 진행', desc: '위임 계약 후 절차를 진행하고 진행상황을 공유해요.' },
]

const STATS = [
  { value: '15년', label: '경력 변호사 직접 상담' },
  { value: '89%', label: '수임 사건 승소율' },
  { value: '1,200+', label: '누적 수임 건수' },
]

const REVIEWS = [
  { name: '의뢰인 김O민', rating: 5, text: '초기 상담부터 끝까지 방향을 명확하게 짚어주셨어요.' },
  { name: '의뢰인 박O진', rating: 5, text: '진행상황을 계속 공유해주셔서 불안하지 않았어요.' },
]

function Stars({ n }) {
  return <span style={{ color: T.gold, fontSize: 12, letterSpacing: 1 }}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))}</span>
}

function ConsultForm() {
  const [form, setForm] = useState({ name: '', phone: '', topic: PRACTICE[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.gold, fontWeight: 700 }}>
        상담 신청이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {PRACTICE.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 6, border: 'none', background: T.dark, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        상담 신청하기
      </button>
    </form>
  )
}

export default function LawFirmLandingDemo() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .law-nav-links { display: flex; gap: 24px; align-items: center; }
        .law-nav-toggle { display: none; }
        .law-card { transition: transform .18s ease, box-shadow .18s ease; }
        .law-card:hover { transform: translateY(-4px); box-shadow: 0 14px 26px rgba(11,30,61,0.12); }
        @media (max-width: 680px) {
          .law-nav-links { display: none; }
          .law-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: ${T.dark}; padding: 20px 24px; }
          .law-nav-toggle { display: block; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(11,30,61,0.95)', backdropFilter: 'blur(6px)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: '#8592AA', textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: '#fff' }}>이현 법률사무소</span>
          </div>
          <div className={`law-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#practice" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: '#D7DEEA', textDecoration: 'none' }}>전문분야</a>
            <a href="#process" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: '#D7DEEA', textDecoration: 'none' }}>상담절차</a>
            <a href="#consult" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 700, color: T.dark, background: T.gold, padding: '8px 16px', borderRadius: 6, textDecoration: 'none' }}>상담 신청</a>
          </div>
          <button className="law-nav-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#fff' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '90px 24px 60px',
        background: `linear-gradient(rgba(11,30,61,0.88), rgba(11,30,61,0.92)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.gold, border: `1px solid ${T.gold}`, padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            의뢰인의 편에서 끝까지
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4, color: '#fff' }}>
            정확한 판단, 신뢰할 수 있는 결과<br />이현 법률사무소
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: '#B9C2D6', lineHeight: 1.7 }}>
            기업 자문부터 민형사 소송까지, 15년 경력의 변호사가 사건 초기부터 직접 검토해요.
          </p>
          <a href="#consult" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: T.dark, background: T.gold, padding: '13px 28px', borderRadius: 6,
          }}>
            무료 상담 신청
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: T.dark }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.gold }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#B9C2D6', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice areas */}
      <section id="practice" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>전문분야</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {PRACTICE.map((p) => (
            <div key={p.name} className="law-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.gold, marginBottom: 14 }} />
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>상담 절차</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {STEPS.map((s) => (
              <div key={s.step} className="law-card" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.gold, marginBottom: 8 }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>의뢰인 후기</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {REVIEWS.map((r) => (
            <div key={r.name} className="law-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 22 }}>
              <Stars n={r.rating} />
              <p style={{ margin: '10px 0 0', fontSize: 13.5, color: T.muted, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600 }}>{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Consult */}
      <section id="consult" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>상담 신청</h2>
          <ConsultForm />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: T.dark, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: T.gold, marginBottom: 8 }}>이현 법률사무소</div>
            <div style={{ fontSize: 12, color: '#8592AA', lineHeight: 1.8 }}>
              사업자등록번호 567-89-01234 (예시)<br />
              서울 서초구 법조로 21<br />
              02-4567-8901
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#D7DEEA', marginBottom: 8 }}>상담 시간</div>
            <div style={{ fontSize: 12, color: '#8592AA', lineHeight: 1.8 }}>
              평일 09:00 – 18:00<br />
              (사전 예약 시 야간 상담 가능)
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#D7DEEA', marginBottom: 8 }}>대표전화</div>
            <div style={{ fontSize: 12, color: '#8592AA' }}>02-4567-8901</div>
          </div>
        </div>
        <div style={{ maxWidth: 1040, margin: '32px auto 0', paddingTop: 20, borderTop: '1px solid #24365A', fontSize: 12, color: '#8592AA', textAlign: 'center' }}>
          이현 법률사무소 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
        </div>
      </footer>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#F7FAFD', surface: '#FFFFFF', text: '#1F2937', muted: '#6B7280',
  accent: '#0F62D6', accentLight: '#E8F1FD', border: '#DCE6F2',
}

const DEPARTMENTS = [
  { icon: '🩺', name: '내과', desc: '만성질환·건강검진 상담' },
  { icon: '🦴', name: '정형외과', desc: '근골격계 통증 치료' },
  { icon: '👶', name: '소아청소년과', desc: '성장·예방접종 관리' },
  { icon: '🔬', name: '건강검진센터', desc: '종합 검진 프로그램' },
]

const DOCTORS = [
  { name: '김도윤 원장', role: '내과 전문의', desc: '서울대학교병원 내과 전임의 출신', rating: 4.9, reviews: 214 },
  { name: '박서연 원장', role: '정형외과 전문의', desc: '척추·관절 클리닉 15년 경력', rating: 4.8, reviews: 176 },
]

const STATS = [
  { value: '15년', label: '지역 진료 경력' },
  { value: '4.9★', label: '환자 만족도' },
  { value: '3만+', label: '누적 진료 건수' },
]

const REVIEWS = [
  { name: '환자 이O호', rating: 5, text: '예약 시간 딱 맞춰 진료봐주셔서 대기 없이 편했어요.' },
  { name: '환자 최O민', rating: 5, text: '설명을 자세히 해주셔서 안심하고 진료받을 수 있었어요.' },
]

function Stars({ n }) {
  return <span style={{ color: T.accent, fontSize: 12, letterSpacing: 1 }}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))}</span>
}

function ReserveForm() {
  const [form, setForm] = useState({ name: '', phone: '', dept: DEPARTMENTS[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.accent, fontWeight: 700 }}>
        예약 신청이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        예약 신청하기
      </button>
    </form>
  )
}

export default function ClinicLandingDemo() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .clinic-nav-links { display: flex; gap: 24px; align-items: center; }
        .clinic-nav-toggle { display: none; }
        .clinic-card { transition: transform .18s ease, box-shadow .18s ease; }
        .clinic-card:hover { transform: translateY(-4px); box-shadow: 0 14px 26px rgba(15,98,214,0.1); }
        @media (max-width: 680px) {
          .clinic-nav-links { display: none; }
          .clinic-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: ${T.bg}; padding: 20px 24px; border-bottom: 1px solid ${T.border}; }
          .clinic-nav-toggle { display: block; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,250,253,0.95)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.accent }}>정다운의원</span>
          </div>
          <div className={`clinic-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#departments" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>진료과목</a>
            <a href="#doctors" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>의료진</a>
            <a href="#hours" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>진료시간</a>
            <a href="#reserve" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.accent, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>예약하기</a>
          </div>
          <button className="clinic-nav-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: T.text }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 60px', textAlign: 'center',
        background: `linear-gradient(rgba(247,250,253,0.9), rgba(247,250,253,0.94)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80') center 30%/cover`,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.accent, background: T.accentLight, padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            가족 같은 마음으로 진료합니다
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
            믿을 수 있는 동네 주치의,<br />정다운의원
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
            내과·정형외과·소아청소년과 전문의가 상주하며, 예약制으로 대기 시간 없이 진료받으실 수 있어요.
          </p>
          <a href="#reserve" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.accent, padding: '13px 28px', borderRadius: 8,
          }}>
            진료 예약하기
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.accent }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section id="departments" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>진료과목</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {DEPARTMENTS.map((d) => (
            <div key={d.name} className="clinic-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{d.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>의료진 소개</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {DOCTORS.map((d) => (
              <div key={d.name} className="clinic-card" style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center', background: T.bg }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentLight, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>👨‍⚕️</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: T.accent, fontWeight: 600 }}>{d.role}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>{d.desc}</div>
                <div style={{ marginTop: 8 }}>
                  <Stars n={d.rating} /> <span style={{ fontSize: 12, color: T.muted }}>({d.reviews})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>환자 후기</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {REVIEWS.map((r) => (
            <div key={r.name} className="clinic-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
              <Stars n={r.rating} />
              <p style={{ margin: '10px 0 0', fontSize: 13.5, color: T.muted, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600 }}>{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hours */}
      <section id="hours" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>진료시간 · 오시는 길</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: T.accent, fontWeight: 700, marginBottom: 6 }}>평일</div>
              <div style={{ fontSize: 14 }}>09:00 – 18:30 (점심 13:00–14:00)</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.accent, fontWeight: 700, marginBottom: 6 }}>토요일</div>
              <div style={{ fontSize: 14 }}>09:00 – 13:00 (일요일·공휴일 휴진)</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.accent, fontWeight: 700, marginBottom: 6 }}>위치</div>
              <div style={{ fontSize: 14 }}>서울 강남구 헬스로 34 (예시 주소)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>진료 예약 신청</h2>
        <ReserveForm />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: T.accent, marginBottom: 8 }}>정다운의원</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              사업자등록번호 456-78-90123 (예시)<br />
              서울 강남구 헬스로 34<br />
              02-3456-7890
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>진료시간</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              평일 09:00 – 18:30<br />
              토요일 09:00 – 13:00<br />
              일요일·공휴일 휴진
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>대표전화</div>
            <div style={{ fontSize: 12, color: T.muted }}>02-3456-7890</div>
          </div>
        </div>
        <div style={{ maxWidth: 1040, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.muted, textAlign: 'center' }}>
          정다운의원 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
        </div>
      </footer>
    </div>
  )
}
